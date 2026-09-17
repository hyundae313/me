import { useCallback, useEffect, useMemo, useState } from 'react'
import { PrefsContext } from './prefsContext'

const LANG_KEY = 'hd.lang'
const THEME_KEY = 'hd.theme'

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function initialLang() {
  const saved = readStored(LANG_KEY, '')
  if (saved === 'ko' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

function initialTheme() {
  const saved = readStored(THEME_KEY, '')
  if (saved === 'dark' || saved === 'light') return saved
  return 'dark'
}

export function PrefsProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const [theme, setThemeState] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f7f8fc' : '#05060b')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setLang = useCallback((next) => setLangState(next), [])
  const setTheme = useCallback((next) => setThemeState(next), [])

  const value = useMemo(
    () => ({ lang, setLang, theme, setTheme }),
    [lang, setLang, theme, setTheme],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}
