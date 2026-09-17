import { useMemo } from 'react'
import { about, profile, ui } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import { useTypewriter } from '../hooks/useTypewriter'
import { trackEvent } from '../lib/analytics'
import { Icon, socialIcon } from './Icons'
import './Hero.css'

function jump(id, from) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  trackEvent('cta_click', { to: id, from })
}

export function Hero() {
  const { t, lang } = usePrefs()
  const words = useMemo(() => profile.roles.map((r) => t(r)), [t, lang]) // eslint-disable-line react-hooks/exhaustive-deps
  const { text } = useTypewriter(words)

  return (
    <section className="section hero" id="home">
      <div className="wrap hero-grid">
        <div className="hero-main">
          {profile.available && (
            <span className="hero-badge reveal">
              <i className="hero-badge-dot" />
              {t(profile.availableLabel)}
            </span>
          )}

          <h1 className="hero-title reveal" style={{ '--d': '60ms' }}>
            <span className="hero-hi mono">Hello, I&rsquo;m</span>
            <span className="grad-text">{t(profile.name)}</span>
          </h1>

          <p className="hero-typing reveal" style={{ '--d': '120ms' }}>
            <span className="hero-caret-wrap">
              {text}
              <span className="hero-caret" />
            </span>
          </p>

          <p className="hero-tagline reveal" style={{ '--d': '180ms' }}>
            {t(profile.tagline)}
          </p>

          <div className="hero-cta reveal" style={{ '--d': '240ms' }}>
            <button className="btn btn-primary" onClick={() => jump('work', 'hero')}>
              {t(ui.viewWork)}
              <Icon.arrow width={17} height={17} />
            </button>
            <button className="btn btn-ghost" onClick={() => jump('contact', 'hero')}>
              {t(ui.contactCta)}
            </button>
            {profile.resumeUrl && (
              <a
                className="btn btn-ghost"
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('resume_click', { from: 'hero' })}
              >
                <Icon.download width={17} height={17} />
                {t(ui.resume)}
              </a>
            )}
          </div>

          <div className="hero-meta reveal" style={{ '--d': '300ms' }}>
            <span className="hero-loc">
              <Icon.pin width={15} height={15} />
              {t(profile.location)}
            </span>
            <ul className="hero-socials">
              {profile.socials
                .filter((s) => s.url)
                .map((s) => {
                  const Ico = socialIcon[s.id] || Icon.arrow
                  return (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noreferrer"
                        aria-label={s.label}
                        onClick={() =>
                          trackEvent('social_click', {
                            network: s.id,
                            from: 'hero',
                          })
                        }
                      >
                        <Ico width={18} height={18} />
                      </a>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>

        <div className="hero-visual reveal" style={{ '--d': '160ms' }}>
          <div className="hero-orb" />
          <div className="hero-avatar">
            <img
              src={profile.avatar}
              alt={t(profile.name)}
              width="400"
              height="400"
              loading="eager"
            />
            <span className="hero-ring" />
          </div>
          <div className="hero-chip hero-chip-1 card">
            <span className="mono">{profile.years}+ yrs</span>
          </div>
          <div className="hero-chip hero-chip-2 card">
            <span className="mono">React Native</span>
          </div>
          <div className="hero-chip hero-chip-3 card">
            <span className="mono">Deep Learning</span>
          </div>
        </div>
      </div>

      <div className="wrap hero-about" id="about">
        <div className="hero-about-text">
          <span className="mono hero-about-eyebrow">{t(ui.aboutEyebrow)}</span>
          {about.body.map((p, i) => (
            <p key={i} className="reveal" style={{ '--d': `${i * 80}ms` }}>
              {t(p)}
            </p>
          ))}
        </div>
        <ul className="hero-stats">
          {about.stats.map((s, i) => (
            <li key={i} className="card reveal" style={{ '--d': `${i * 90}ms` }}>
              <strong className="grad-text">{s.value}</strong>
              <span>{t(s.label)}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="hero-scroll"
        onClick={() => jump('work', 'scroll-cue')}
        aria-label={t(ui.scroll)}
      >
        <span className="mono">{t(ui.scroll)}</span>
        <span className="hero-scroll-line" />
      </button>
    </section>
  )
}
