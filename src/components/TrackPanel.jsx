import { useEffect, useState } from 'react'
import {
  clearTrackLog,
  getAttribution,
  getTrackLog,
  trackingEndpoint,
} from '../lib/analytics'
import './TrackPanel.css'

/**
 * 유입 추적 확인용 패널.
 * 주소 뒤에 ?track=1 을 붙이면 열립니다. 방문자에게는 보이지 않습니다.
 */
const isEnabled = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('track') === '1'

export function TrackPanel() {
  const [open, setOpen] = useState(isEnabled)
  const [attr] = useState(() => (isEnabled() ? getAttribution() : null))
  const [log, setLog] = useState(() => (isEnabled() ? getTrackLog() : []))

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setLog(getTrackLog()), 1500)
    return () => clearInterval(id)
  }, [open])

  if (!open || !attr) return null

  const rows = [
    ['source', attr.last.source],
    ['medium', attr.last.medium],
    ['campaign', attr.last.campaign || '—'],
    ['referrer', attr.last.referrerHost || '—'],
    ['landing', attr.last.landingPath],
    ['first-touch', `${attr.first.source} / ${attr.first.medium}`],
    ['visitor', attr.isNewVisitor ? 'new' : 'returning'],
    ['endpoint', trackingEndpoint || 'local only'],
  ]

  return (
    <aside className="tp">
      <header className="tp-head">
        <strong>traffic source</strong>
        <button onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
      </header>

      <dl className="tp-rows">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd title={String(v)}>{String(v)}</dd>
          </div>
        ))}
      </dl>

      <div className="tp-log-head">
        <span>events ({log.length})</span>
        <button
          onClick={() => {
            clearTrackLog()
            setLog([])
          }}
        >
          clear
        </button>
      </div>

      <ul className="tp-log">
        {log.slice(0, 14).map((e, i) => (
          <li key={i}>
            <span className="tp-ev">{e.event}</span>
            <span className="tp-props">
              {Object.entries(e.props || {})
                .map(([k, v]) => `${k}=${v}`)
                .join(' ') || '—'}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
