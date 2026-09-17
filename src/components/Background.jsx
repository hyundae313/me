import { useEffect, useRef } from 'react'
import './Background.css'

/**
 * 고정 배경: 오로라 글로우 + 그리드 + 노이즈.
 * 데스크톱(정밀 포인터)에서만 커서를 따라다니는 스포트라이트를 켭니다.
 */
export function Background() {
  const spotRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const el = spotRef.current
    if (!el) return
    let raf = 0
    let x = 0
    let y = 0

    const paint = () => {
      raf = 0
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(paint)
    }

    el.style.opacity = '1'
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-spot" ref={spotRef} />
      <div className="bg-noise" />
      <div className="bg-vignette" />
    </div>
  )
}
