import { useEffect } from 'react'

/** 페이지에 필요한 웹폰트 stylesheet 만 주입합니다. (중복 주입 방지) */
export function useFonts(href) {
  useEffect(() => {
    if (!href) return
    if (document.querySelector(`link[data-fonts="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.dataset.fonts = href
    document.head.appendChild(link)
  }, [href])
}
