import { useState } from 'react'
import { profile, ui } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import { trackEvent } from '../lib/analytics'
import { Icon, socialIcon } from './Icons'
import './Contact.css'

export function Contact() {
  const { t } = usePrefs()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = profile.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    trackEvent('email_copy', { from: 'contact' })
    if (navigator.vibrate) navigator.vibrate(12)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="contact-card card reveal">
          <span className="contact-glow" aria-hidden="true" />

          <span className="eyebrow mono">05 — Contact</span>
          <h2 className="contact-title">
            <span className="grad-text">{t(ui.contact)}</span>
          </h2>
          <p className="contact-sub">{t(ui.contactSub)}</p>

          <div className="contact-actions">
            <a
              className="btn btn-primary"
              href={`mailto:${profile.email}`}
              onClick={() => trackEvent('email_click', { from: 'contact' })}
            >
              <Icon.mail width={18} height={18} />
              {profile.email}
            </a>
            <button className="btn btn-ghost" onClick={copy}>
              {copied ? (
                <Icon.check width={17} height={17} />
              ) : (
                <Icon.copy width={17} height={17} />
              )}
              {copied ? t(ui.copied) : t(ui.copyEmail)}
            </button>
          </div>

          {profile.showPhone && (
            <a
              className="contact-phone"
              href={`tel:${profile.phone.replace(/-/g, '')}`}
              onClick={() => trackEvent('phone_click', { from: 'contact' })}
            >
              {profile.phone}
            </a>
          )}

          <ul className="contact-socials">
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
                      onClick={() =>
                        trackEvent('social_click', {
                          network: s.id,
                          from: 'contact',
                        })
                      }
                    >
                      <Ico width={18} height={18} />
                      <span>{s.label}</span>
                    </a>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </section>
  )
}
