import { useEffect } from 'react'

/**
 * data-parallax 요소를 뷰포트 중심으로부터의 거리에 따라 살짝 위아래로 움직입니다.
 * --py 커스텀 프로퍼티에 값을 써서, CSS가 transform: translateY(var(--py))로 반영합니다.
 */
export function useParallax(selector = '[data-parallax]') {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll(selector))
    if (!els.length) return

    let raf = null
    const update = () => {
      raf = null
      const vh = window.innerHeight
      for (const el of els) {
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const offset = (center - vh / 2) / vh
        const py = Math.max(-22, Math.min(22, offset * 44))
        el.style.setProperty('--py', `${py.toFixed(1)}px`)
      }
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [selector])
}
