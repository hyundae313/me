// ─────────────────────────────────────────────────────────────
//  방문 로그 수집 + 정적 파일 서빙 (의존성 없음, Node 18+)
//
//    npm run serve
//
//  · 빌드 결과(dist/)를 서빙하고, /dev 새로고침도 정상 동작합니다.
//  · POST /collect 로 들어온 로그를 logs/YYYY-MM-DD.jsonl 에 한 줄씩 붙입니다.
//  · 집계는 `npm run report` 로 확인합니다.
//
//  환경변수
//    PORT          기본 8080
//    LOG_DIR       기본 ./logs
//    DIST_DIR      기본 ./dist
//    MASK_IP       기본 1 (IPv4 마지막 자리, IPv6 뒤쪽을 가림)
//    ALLOW_ORIGIN  다른 도메인에서 보낼 때만 지정 (예: https://내도메인)
// ─────────────────────────────────────────────────────────────

import { createServer } from 'node:http'
import { appendFile, mkdir, readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'

const PORT = Number(process.env.PORT || 8080)
const LOG_DIR = resolve(process.env.LOG_DIR || 'logs')
const DIST_DIR = resolve(process.env.DIST_DIR || 'dist')
const MASK_IP = process.env.MASK_IP !== '0'
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || ''

const MAX_BODY = 32 * 1024 // 32KB 넘는 요청은 거부

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
}

/** 개인정보를 조금 덜 남기려고 IP 뒷자리를 가립니다. */
function maskIp(raw) {
  if (!raw) return null
  const ip = raw.replace(/^::ffff:/, '')
  if (!MASK_IP) return ip
  if (ip.includes('.')) return ip.replace(/\.\d+$/, '.x')
  const parts = ip.split(':')
  if (parts.length <= 4) return ip // ::1 같은 짧은 주소는 그대로
  return parts.slice(0, 4).join(':') + ':x'
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) return maskIp(fwd.split(',')[0].trim())
  return maskIp(req.socket.remoteAddress)
}

function cors(res, req) {
  if (!ALLOW_ORIGIN) return
  const origin = req.headers.origin
  if (ALLOW_ORIGIN === '*' || origin === ALLOW_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', origin || ALLOW_ORIGIN)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new Error('too large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** 날짜별 파일에 한 줄씩(JSON Lines). 하루가 바뀌면 자동으로 새 파일. */
async function writeLog(record) {
  await mkdir(LOG_DIR, { recursive: true })
  const day = new Date().toISOString().slice(0, 10)
  await appendFile(join(LOG_DIR, `${day}.jsonl`), JSON.stringify(record) + '\n', 'utf8')
}

async function handleCollect(req, res) {
  let payload
  try {
    payload = JSON.parse(await readBody(req))
  } catch {
    res.writeHead(400).end()
    return
  }
  if (!payload || typeof payload !== 'object') {
    res.writeHead(400).end()
    return
  }

  const record = {
    // 서버 시각을 신뢰합니다 (클라이언트 시계는 틀릴 수 있음)
    ts: new Date().toISOString(),
    ip: clientIp(req),
    ua: String(req.headers['user-agent'] || '').slice(0, 300),
    acceptLang: String(req.headers['accept-language'] || '').slice(0, 80),
    event: String(payload.event || 'unknown').slice(0, 40),
    visitorId: String(payload.visitorId || '').slice(0, 64),
    sessionId: String(payload.sessionId || '').slice(0, 64),
    isNewVisitor: Boolean(payload.isNewVisitor),
    attribution: payload.attribution ?? null,
    firstTouch: payload.firstTouch ?? null,
    device: payload.device ?? null,
    props: payload.props ?? null,
  }

  try {
    await writeLog(record)
  } catch (err) {
    console.error('[collect] 로그 기록 실패:', err.message)
    res.writeHead(500).end()
    return
  }

  // sendBeacon 은 응답을 기다리지 않으므로 가볍게 끝냅니다
  res.writeHead(204).end()
}

async function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname)
  if (rel.endsWith('/')) rel += 'index.html'

  // 경로 탈출 방지
  const target = resolve(join(DIST_DIR, normalize(rel)))
  const inside = target === DIST_DIR || target.startsWith(DIST_DIR + sep)

  let file = inside ? target : null
  if (file) {
    try {
      const info = await stat(file)
      if (info.isDirectory()) file = join(file, 'index.html')
    } catch {
      file = null
    }
  }
  // 없는 경로는 SPA 폴백 (/dev 새로고침 대응)
  if (!file) file = join(DIST_DIR, 'index.html')

  try {
    const buf = await readFile(file)
    const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
    const immutable = file.includes(`${sep}assets${sep}`)
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    })
    res.end(buf)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('찾을 수 없습니다. dist/ 가 있는지 확인해주세요 (npm run build)')
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  cors(res, req)

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end()
    return
  }
  if (req.method === 'POST' && pathname === '/collect') {
    await handleCollect(req, res)
    return
  }
  // 로그 파일은 웹으로 절대 노출하지 않습니다
  if (pathname.startsWith('/logs')) {
    res.writeHead(404).end()
    return
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end()
    return
  }
  await serveStatic(req, res, pathname)
})

server.listen(PORT, () => {
  console.log(`  사이트   http://localhost:${PORT}`)
  console.log(`  수집     POST /collect`)
  console.log(`  로그     ${LOG_DIR}/YYYY-MM-DD.jsonl`)
  console.log(`  IP 마스킹 ${MASK_IP ? '켜짐' : '꺼짐'}`)
})
