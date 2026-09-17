// ─────────────────────────────────────────────────────────────
//  유입 출처 추적 (Referrer / UTM Attribution)
//
//  · first-touch : 이 브라우저가 "처음" 어디서 왔는지 (localStorage, 영구)
//  · last-touch  : 이번 세션에서 어디서 왔는지 (sessionStorage)
//  · 이벤트 로그 : 최근 50건을 로컬에 보관 (?track=1 로 확인)
//
//  서버로 보내려면 .env 에 엔드포인트만 지정하면 됩니다.
//    VITE_TRACK_ENDPOINT=https://your-api.example.com/collect
//  GA4(gtag) 나 Plausible 이 로드돼 있으면 그쪽으로도 함께 전달합니다.
// ─────────────────────────────────────────────────────────────

const LS_FIRST = 'hd.attr.first'
const LS_VISITOR = 'hd.visitor'
const LS_LOG = 'hd.track.log'
const SS_LAST = 'hd.attr.last'
const SS_SESSION = 'hd.session'
const LOG_MAX = 50

const ENDPOINT = import.meta.env.VITE_TRACK_ENDPOINT || ''
const DEBUG = import.meta.env.DEV

/** 검색엔진 / SNS 도메인 → 사람이 읽을 수 있는 출처 이름 */
const KNOWN_SOURCES = [
  [/(^|\.)google\./, 'google', 'organic'],
  [/(^|\.)naver\./, 'naver', 'organic'],
  [/(^|\.)daum\.|(^|\.)search\.daum/, 'daum', 'organic'],
  [/(^|\.)bing\./, 'bing', 'organic'],
  [/duckduckgo\./, 'duckduckgo', 'organic'],
  [/(^|\.)instagram\./, 'instagram', 'social'],
  [/(^|\.)facebook\.|(^|\.)fb\./, 'facebook', 'social'],
  [/(^|\.)threads\./, 'threads', 'social'],
  [/(^|\.)x\.com|(^|\.)twitter\./, 'x', 'social'],
  [/(^|\.)linkedin\.|lnkd\.in/, 'linkedin', 'social'],
  [/(^|\.)github\./, 'github', 'referral'],
  [/(^|\.)velog\.|tistory\.|medium\.|brunch\./, 'blog', 'referral'],
  [/kakao\.|kakaocdn|open\.kakao/, 'kakao', 'social'],
  [/(^|\.)youtube\.|youtu\.be/, 'youtube', 'social'],
  [/(^|\.)reddit\./, 'reddit', 'social'],
  [/(^|\.)news\.ycombinator\./, 'hackernews', 'referral'],
  [/(^|\.)wanted\.|saramin\.|jobkorea\.|programmers\.co\.kr/, 'job-board', 'referral'],
]

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'x' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function readJSON(store, key) {
  try {
    const raw = store.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJSON(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value))
  } catch {
    /* 시크릿 모드 등에서 저장이 막혀도 추적 자체는 계속 동작 */
  }
}

/** referrer + 쿼리스트링으로 출처를 판별 */
export function resolveSource(href = window.location.href, referrer = document.referrer) {
  const url = new URL(href)
  const q = url.searchParams
  const get = (k) => (q.get(k) || '').trim().slice(0, 120) || null

  const utm = {
    source: get('utm_source'),
    medium: get('utm_medium'),
    campaign: get('utm_campaign'),
    term: get('utm_term'),
    content: get('utm_content'),
  }
  // 짧은 링크용 축약 파라미터: ?ref=resume, ?from=namecard
  const shortRef = get('ref') || get('from') || get('src')
  const clickId = get('gclid') || get('fbclid') || get('ttclid') || null

  let host = null
  try {
    host = referrer ? new URL(referrer).hostname.toLowerCase() : null
  } catch {
    host = null
  }
  const self = host && host === window.location.hostname

  let source = utm.source || shortRef
  let medium = utm.medium || (shortRef ? 'link' : null)

  if (!source && host && !self) {
    const hit = KNOWN_SOURCES.find(([re]) => re.test(host))
    source = hit ? hit[1] : host
    medium = medium || (hit ? hit[2] : 'referral')
  }
  if (!source) {
    source = 'direct'
    medium = medium || 'none'
  }
  if (clickId && medium === 'none') medium = 'cpc'

  return {
    source,
    medium,
    campaign: utm.campaign,
    term: utm.term,
    content: utm.content,
    referrer: self ? null : referrer || null,
    referrerHost: self ? null : host,
    clickId,
    landingPath: url.pathname + url.search,
    at: new Date().toISOString(),
  }
}

function deviceInfo() {
  const w = window.innerWidth
  return {
    type: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
    viewport: `${w}x${window.innerHeight}`,
    dpr: window.devicePixelRatio || 1,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ua: navigator.userAgent.slice(0, 180),
    standalone: window.matchMedia('(display-mode: standalone)').matches,
  }
}

function getVisitorId() {
  let id = null
  try {
    id = localStorage.getItem(LS_VISITOR)
  } catch {
    /* ignore */
  }
  if (!id) {
    id = uid()
    try {
      localStorage.setItem(LS_VISITOR, id)
    } catch {
      /* ignore */
    }
  }
  return id
}

function getSessionId() {
  let id = null
  try {
    id = sessionStorage.getItem(SS_SESSION)
  } catch {
    /* ignore */
  }
  if (!id) {
    id = uid()
    try {
      sessionStorage.setItem(SS_SESSION, id)
    } catch {
      /* ignore */
    }
  }
  return id
}

function pushLog(entry) {
  const log = readJSON(localStorage, LS_LOG) || []
  log.unshift(entry)
  writeJSON(localStorage, LS_LOG, log.slice(0, LOG_MAX))
}

const dnt =
  typeof navigator !== 'undefined' &&
  (navigator.doNotTrack === '1' || window.doNotTrack === '1')

function send(payload) {
  if (DEBUG) console.info('[track]', payload.event, payload)
  pushLog(payload)

  // 서드파티가 붙어 있으면 함께 전달
  if (typeof window.gtag === 'function') {
    window.gtag('event', payload.event, {
      traffic_source: payload.attribution?.source,
      traffic_medium: payload.attribution?.medium,
      campaign: payload.attribution?.campaign,
      ...payload.props,
    })
  }
  if (typeof window.plausible === 'function') {
    window.plausible(payload.event, {
      props: { ...payload.props, source: payload.attribution?.source },
    })
  }

  if (!ENDPOINT || dnt) return
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
      return
    }
  } catch {
    /* sendBeacon 실패 시 fetch 로 폴백 */
  }
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    mode: 'cors',
  }).catch(() => {})
}

let attribution = null

/** 앱 시작 시 1회 호출 — 유입 출처를 확정하고 방문 이벤트를 기록 */
export function initTracking() {
  if (attribution) return attribution

  const current = resolveSource()
  const first = readJSON(localStorage, LS_FIRST)
  const isNewVisitor = !first

  if (isNewVisitor) writeJSON(localStorage, LS_FIRST, current)

  // 세션 내 첫 진입일 때만 last-touch 갱신 (내부 이동으로 direct 덮어쓰기 방지)
  let last = readJSON(sessionStorage, SS_LAST)
  if (!last || current.source !== 'direct') {
    last = current
    writeJSON(sessionStorage, SS_LAST, last)
  }

  attribution = {
    first: first || current,
    last,
    current,
    isNewVisitor,
  }

  send({
    event: 'visit',
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    isNewVisitor,
    attribution: last,
    firstTouch: attribution.first,
    device: deviceInfo(),
    props: { title: document.title },
    at: current.at,
  })

  // 체류 시간은 페이지를 떠날 때 한 번 보냄
  const started = Date.now()
  const bye = () => {
    if (document.visibilityState !== 'hidden') return
    send({
      event: 'leave',
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      attribution: last,
      props: { dwellMs: Date.now() - started, maxScroll: maxScrollPct },
      at: new Date().toISOString(),
    })
    document.removeEventListener('visibilitychange', bye)
  }
  document.addEventListener('visibilitychange', bye)

  return attribution
}

let maxScrollPct = 0
export function noteScrollDepth(pct) {
  if (pct > maxScrollPct) maxScrollPct = Math.min(100, Math.round(pct))
}

/** CTA 클릭 등 개별 이벤트 — trackEvent('cta_click', { id: 'contact' }) */
export function trackEvent(event, props = {}) {
  send({
    event,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    attribution: attribution?.last || resolveSource(),
    props,
    at: new Date().toISOString(),
  })
}

export function getAttribution() {
  return attribution || initTracking()
}

export function getTrackLog() {
  return readJSON(localStorage, LS_LOG) || []
}

export function clearTrackLog() {
  try {
    localStorage.removeItem(LS_LOG)
  } catch {
    /* ignore */
  }
}

export const trackingEndpoint = ENDPOINT
