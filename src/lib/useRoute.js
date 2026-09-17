import { useEffect, useState } from 'react'

const clean = (p) => {
  const s = p.replace(/\/+$/, '')
  return s === '' ? '/' : s
}

const read = () => (typeof window === 'undefined' ? '/' : clean(window.location.pathname))

/** 의존성 없는 아주 가벼운 라우터. 경로 문자열과 이동 함수를 돌려줍니다. */
export function useRoute() {
  const [path, setPath] = useState(read)

  useEffect(() => {
    const onPop = () => setPath(read())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return path
}

export function navigate(to) {
  if (clean(to) === read()) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}
