import { useContext } from 'react'
import { PrefsContext } from '../lib/prefsContext'

/**
 * usePrefs() → { lang, setLang, theme, setTheme, t }
 * t({ ko, en }) 로 현재 언어 문자열을 꺼냅니다. 문자열이면 그대로 반환.
 */
export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside <PrefsProvider>')
  const t = (value) => {
    if (value == null) return ''
    if (typeof value === 'string') return value
    return value[ctx.lang] ?? value.en ?? value.ko ?? ''
  }
  return { ...ctx, t }
}
