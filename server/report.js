// ─────────────────────────────────────────────────────────────
//  수집된 로그를 사람이 읽을 수 있게 요약합니다.
//
//    npm run report            최근 30일
//    npm run report -- 7       최근 7일
//    npm run report -- all     전체
// ─────────────────────────────────────────────────────────────

import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const LOG_DIR = resolve(process.env.LOG_DIR || 'logs')
const arg = process.argv[2] || '30'
const days = arg === 'all' ? Infinity : Number(arg)

const pad = (s, n) => String(s).padEnd(n, ' ')
const bar = (n, max, w = 22) => '█'.repeat(Math.max(1, Math.round((n / max) * w)))

function table(title, counts, total) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (!rows.length) return
  const max = rows[0][1]
  const width = Math.min(28, Math.max(...rows.map(([k]) => k.length)) + 1)
  console.log(`\n  ${title}`)
  console.log('  ' + '─'.repeat(56))
  for (const [k, v] of rows.slice(0, 12)) {
    const pct = total ? ` ${((v / total) * 100).toFixed(0).padStart(3)}%` : ''
    console.log(
      `  ${pad(k.slice(0, width), width)} ${String(v).padStart(4)}${pct}  ${bar(v, max)}`,
    )
  }
}

async function load() {
  let files
  try {
    files = (await readdir(LOG_DIR)).filter((f) => f.endsWith('.jsonl')).sort()
  } catch {
    console.log(`\n  로그 폴더가 없습니다: ${LOG_DIR}`)
    console.log('  아직 수집된 방문이 없거나, 서버를 아직 안 띄운 상태입니다.\n')
    return []
  }
  if (Number.isFinite(days)) {
    const cutoff = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10)
    files = files.filter((f) => f.slice(0, 10) >= cutoff)
  }

  const rows = []
  for (const f of files) {
    const text = await readFile(join(LOG_DIR, f), 'utf8')
    for (const line of text.split('\n')) {
      if (!line.trim()) continue
      try {
        rows.push(JSON.parse(line))
      } catch {
        /* 깨진 줄은 건너뜁니다 */
      }
    }
  }
  return rows
}

const rows = await load()
if (!rows.length) {
  if (rows.length === 0) console.log('  집계할 로그가 없습니다.\n')
  process.exit(0)
}

const visits = rows.filter((r) => r.event === 'visit')
const leaves = rows.filter((r) => r.event === 'leave')
const visitors = new Set(visits.map((r) => r.visitorId).filter(Boolean))
const newVisitors = visits.filter((r) => r.isNewVisitor).length

const by = (list, fn) =>
  list.reduce((acc, r) => {
    const k = fn(r)
    if (k) acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

const dwell = leaves.map((r) => r.props?.dwellMs).filter((n) => typeof n === 'number')
const scroll = leaves.map((r) => r.props?.maxScroll).filter((n) => typeof n === 'number')
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

console.log('\n  ═══ 방문 요약 ' + '═'.repeat(43))
console.log(`  기간          ${arg === 'all' ? '전체' : `최근 ${days}일`}`)
console.log(
  `  방문          ${visits.length}회 · 방문자 ${visitors.size}명 (신규 ${newVisitors})`,
)
if (dwell.length) console.log(`  평균 체류     ${(avg(dwell) / 1000).toFixed(0)}초`)
if (scroll.length) console.log(`  평균 스크롤   ${avg(scroll).toFixed(0)}%`)

// ?ref= 로 사람마다 다르게 보낸 링크는 따로 모아서 봅니다
const refVisits = visits.filter((r) => r.attribution?.medium === 'link')
if (refVisits.length) {
  const refs = [...new Set(refVisits.map((r) => r.attribution.source))]
  console.log('\n  개별 링크 (?ref=)')
  console.log('  ' + '─'.repeat(56))
  for (const ref of refs) {
    const hits = refVisits.filter((r) => r.attribution.source === ref)
    const people = new Set(hits.map((r) => r.visitorId)).size
    const sessions = new Set(hits.map((r) => r.sessionId))
    const ends = leaves.filter((r) => sessions.has(r.sessionId))
    const secs = avg(ends.map((r) => r.props?.dwellMs).filter(Number.isFinite)) / 1000
    const depth = avg(ends.map((r) => r.props?.maxScroll).filter(Number.isFinite))
    const last = hits[hits.length - 1].ts.slice(5, 16).replace('T', ' ')
    console.log(
      `  ${pad(ref.slice(0, 16), 16)} ${String(hits.length).padStart(3)}회` +
        ` · 기기 ${people}` +
        (secs ? ` · ${secs.toFixed(0)}초` : '') +
        (depth ? ` · ${depth.toFixed(0)}%` : '') +
        `  마지막 ${last}`,
    )
  }
}

table(
  '유입 출처',
  by(visits, (r) => r.attribution?.source),
  visits.length,
)
table(
  '유입 종류',
  by(visits, (r) => r.attribution?.medium),
  visits.length,
)
table(
  '캠페인',
  by(visits, (r) => r.attribution?.campaign),
  0,
)
table(
  'referrer 도메인',
  by(visits, (r) => r.attribution?.referrerHost),
  0,
)
table(
  '랜딩 경로',
  by(visits, (r) => r.attribution?.landingPath),
  visits.length,
)
table(
  '본 페이지',
  by(
    rows.filter((r) => r.event === 'page_view'),
    (r) => r.props?.page,
  ),
  0,
)
table(
  '기기',
  by(visits, (r) => r.device?.type),
  visits.length,
)
table(
  '이벤트',
  by(rows, (r) => r.event),
  0,
)

console.log('\n  최근 방문 10건')
console.log('  ' + '─'.repeat(56))
for (const r of visits.slice(-10).reverse()) {
  const when = r.ts.slice(5, 16).replace('T', ' ')
  const src = `${r.attribution?.source || '?'}/${r.attribution?.medium || '?'}`
  console.log(
    `  ${when}  ${pad(src.slice(0, 22), 22)} ${pad(r.device?.type || '', 8)} ${r.isNewVisitor ? '신규' : '재방문'}`,
  )
}
console.log('')
