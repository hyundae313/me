import { education, experience, extras, ui } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import './Career.css'

export function Career() {
  const { t } = usePrefs()

  return (
    <section className="section career" id="career">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow mono">03 — Career</span>
          <h2>{t(ui.career)}</h2>
          <p>{t(ui.careerSub)}</p>
        </div>

        <ol className="tl">
          {experience.map((job, i) => (
            <li key={i} className="tl-item reveal" style={{ '--d': `${i * 90}ms` }}>
              <span className={`tl-dot${job.current ? ' is-current' : ''}`} />
              <div className="tl-card card">
                <div className="tl-head">
                  <div>
                    <h3>{t(job.company)}</h3>
                    <span className="tl-role">{t(job.role)}</span>
                  </div>
                  <span className={`tl-period mono${job.current ? ' is-current' : ''}`}>
                    {t(job.period)}
                  </span>
                </div>
                <p className="tl-desc">{t(job.desc)}</p>
                {job.bullets?.length > 0 && (
                  <ul className="tl-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{t(b)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="career-extra">
          <div className="career-block reveal">
            <h3 className="career-block-title mono">{t(ui.education)}</h3>
            <ul className="edu">
              {education.map((e, i) => (
                <li key={i} className="edu-item card">
                  <div className="edu-top">
                    <strong>{t(e.school)}</strong>
                    <span className="mono">{e.period}</span>
                  </div>
                  <span className="edu-major">{t(e.major)}</span>
                  {e.note && <span className="edu-note">{t(e.note)}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="career-block reveal" style={{ '--d': '100ms' }}>
            <h3 className="career-block-title mono">{t(ui.patent)}</h3>
            <ul className="edu">
              {extras.patents.map((p, i) => (
                <li key={i} className="edu-item card">
                  <div className="edu-top">
                    <strong>{t(p.title)}</strong>
                  </div>
                  <span className="mono edu-num">{p.number}</span>
                </li>
              ))}
              {extras.languages.map((l, i) => (
                <li key={`lang-${i}`} className="edu-item card edu-lang">
                  <strong>{t(l.name)}</strong>
                  <span className="edu-major">{t(l.level)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
