import { useMemo, useState } from 'react'
import { projects, ui } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import { trackEvent } from '../lib/analytics'
import { Icon } from './Icons'
import './Work.css'

export function Work() {
  const { t } = usePrefs()
  const [filter, setFilter] = useState('featured')

  const list = useMemo(
    () => (filter === 'featured' ? projects.filter((p) => p.featured) : projects),
    [filter],
  )

  return (
    <section className="section work" id="work">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow mono">02 — Work</span>
          <h2>{t(ui.work)}</h2>
          <p>{t(ui.workSub)}</p>
        </div>

        <div className="work-filter" role="tablist">
          {[
            ['featured', ui.featured],
            ['all', ui.all],
          ].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              className={`work-filter-btn${filter === key ? ' is-active' : ''}`}
              onClick={() => {
                setFilter(key)
                trackEvent('work_filter', { filter: key })
              }}
            >
              {t(label)}
            </button>
          ))}
          <span className="work-hint mono">{t(ui.swipe)}</span>
        </div>

        <ul className="work-list">
          {list.map((p, i) => (
            <li
              key={p.id}
              className="work-card card reveal"
              style={{ '--d': `${i * 70}ms`, '--accent': p.accent }}
            >
              <div className="work-thumb">
                <img
                  src={p.image}
                  alt={t(p.title)}
                  width="1200"
                  height="750"
                  loading="lazy"
                  decoding="async"
                />
                <span className="work-thumb-glow" />
                {p.badge && <span className="work-badge">{t(p.badge)}</span>}
              </div>

              <div className="work-body">
                <div className="work-top">
                  <span className="mono work-tag">{t(p.tag)}</span>
                  <span className="mono work-year">{p.year}</span>
                </div>

                <h3>{t(p.title)}</h3>
                <span className="work-org">{t(p.org)}</span>
                <p>{t(p.summary)}</p>

                <ul className="work-stack">
                  {p.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>

                {(p.links.live || p.links.repo) && (
                  <div className="work-links">
                    {p.links.live && (
                      <a
                        href={p.links.live}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackEvent('project_link', { id: p.id, kind: 'live' })
                        }
                      >
                        {t(ui.live)}
                        <Icon.arrow width={15} height={15} />
                      </a>
                    )}
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackEvent('project_link', { id: p.id, kind: 'repo' })
                        }
                      >
                        {t(ui.code)}
                        <Icon.github width={15} height={15} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
