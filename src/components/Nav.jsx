import { useEffect, useRef, useState } from 'react'
import { nav as navItems, profile } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import { trackEvent } from '../lib/analytics'
import { Icon } from './Icons'
import './Nav.css'

const tabIcon = {
  home: Icon.home,
  work: Icon.grid,
  career: Icon.work,
  stack: Icon.stack,
  contact: Icon.mail,
}

function goTo(id, from) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  trackEvent('nav_click', { to: id, from })
  if (navigator.vibrate) navigator.vibrate(8)
}

/** 데스크톱 상단 헤더 */
export function Header({ active, progress }) {
  const { lang, setLang, theme, setTheme, t } = usePrefs()
  const [solid, setSolid] = useState(false)
  const indicatorRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 활성 메뉴 아래로 미끄러지는 인디케이터
  useEffect(() => {
    const list = listRef.current
    const bar = indicatorRef.current
    if (!list || !bar) return
    const btn = list.querySelector(`[data-id="${active}"]`)
    if (!btn) return
    bar.style.width = `${btn.offsetWidth}px`
    bar.style.transform = `translateX(${btn.offsetLeft}px)`
    bar.style.opacity = '1'
  }, [active, lang])

  return (
    <header className={`hdr${solid ? ' is-solid' : ''}`}>
      <div className="hdr-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="hdr-inner wrap">
        <button
          className="hdr-logo"
          onClick={() => goTo('home', 'logo')}
          aria-label="Home"
        >
          <span className="hdr-dot" />
          <span className="mono">{profile.handle}</span>
        </button>

        <nav className="hdr-nav" ref={listRef} aria-label="Sections">
          <span className="hdr-ind" ref={indicatorRef} aria-hidden="true" />
          {navItems.map((item) => (
            <button
              key={item.id}
              data-id={item.id}
              className={`hdr-link${active === item.id ? ' is-active' : ''}`}
              onClick={() => goTo(item.id, 'header')}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>

        <div className="hdr-tools">
          <button
            className="tool tool-lang"
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            aria-label="Toggle language"
          >
            <span className={lang === 'ko' ? 'on' : ''}>KO</span>
            <i />
            <span className={lang === 'en' ? 'on' : ''}>EN</span>
          </button>
          <button
            className="tool tool-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Icon.moon width={17} height={17} />
            ) : (
              <Icon.sun width={17} height={17} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

/** 모바일 상단 미니바 (로고 + 토글) */
export function MobileTopBar() {
  const { lang, setLang, theme, setTheme } = usePrefs()
  return (
    <div className="mtop">
      <button className="hdr-logo" onClick={() => goTo('home', 'logo')} aria-label="Home">
        <span className="hdr-dot" />
        <span className="mono">{profile.handle}</span>
      </button>
      <div className="hdr-tools">
        <button
          className="tool tool-lang"
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          aria-label="Toggle language"
        >
          <span className={lang === 'ko' ? 'on' : ''}>KO</span>
          <i />
          <span className={lang === 'en' ? 'on' : ''}>EN</span>
        </button>
        <button
          className="tool tool-icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Icon.moon width={17} height={17} />
          ) : (
            <Icon.sun width={17} height={17} />
          )}
        </button>
      </div>
    </div>
  )
}

/** 모바일 하단 탭바 — 엄지로 닿는 위치, safe-area 대응 */
export function TabBar({ active }) {
  const { t } = usePrefs()
  const barRef = useRef(null)
  const pillRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    const pill = pillRef.current
    if (!bar || !pill) return
    const btn = bar.querySelector(`[data-id="${active}"]`)
    if (!btn) return
    pill.style.width = `${btn.offsetWidth}px`
    pill.style.transform = `translateX(${btn.offsetLeft}px)`
  }, [active])

  return (
    <nav className="tabbar" ref={barRef} aria-label="Sections">
      <span className="tabbar-pill" ref={pillRef} aria-hidden="true" />
      {navItems.map((item) => {
        const Ico = tabIcon[item.id] || Icon.home
        const on = active === item.id
        return (
          <button
            key={item.id}
            data-id={item.id}
            className={`tab${on ? ' is-active' : ''}`}
            onClick={() => goTo(item.id, 'tabbar')}
            aria-current={on ? 'true' : undefined}
          >
            <Ico width={21} height={21} />
            <span>{t(item.label)}</span>
          </button>
        )
      })}
    </nav>
  )
}
