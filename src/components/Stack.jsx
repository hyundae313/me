import { stacks, ui } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import './Stack.css'

export function Stack() {
  const { t } = usePrefs()

  return (
    <section className="section stack" id="stack">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow mono">04 — Stack</span>
          <h2>{t(ui.stack)}</h2>
          <p>{t(ui.stackSub)}</p>
        </div>

        <div className="stack-grid">
          {stacks.map((group, i) => (
            <div
              key={i}
              className="stack-card card reveal"
              style={{ '--d': `${i * 80}ms` }}
            >
              <div className="stack-card-head">
                <span className="stack-num mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(group.group)}</h3>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="stack-bullet" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
