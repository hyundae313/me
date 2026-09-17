import { useEffect } from 'react'

/**
 * 등장 애니메이션용 요소가 뷰포트에 들어오면 .in 클래스를 붙입니다.
 *
 * @param dep       이 값이 바뀌면(예: 언어 전환) 새로 그려진 요소까지 다시 관찰
 * @param selector  관찰할 요소 (개발자 페이지 '.reveal', 개인 페이지 '.p-rise')
 */
export function useReveal(dep, selector = '.reveal') {
  useEffect(() => {
    const els = document.querySelectorAll(`${selector}:not(.in)`)
    if (!els.length) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))

    // 안전장치: 어떤 이유로든 관찰이 안 걸리면 페이지가 통째로 빈 화면이 됩니다.
    // 2.5초 뒤에도 숨어 있는 요소는 그냥 보여줍니다.
    const safety = setTimeout(() => {
      els.forEach((el) => el.classList.add('in'))
    }, 2500)

    return () => {
      clearTimeout(safety)
      io.disconnect()
    }
  }, [dep, selector])
}
