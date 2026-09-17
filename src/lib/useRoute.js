import { useEffect, useState } from 'react'

// 배포 경로(vite base). 로컬은 '/', GitHub Pages 는 '/me/' 입니다.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

const clean = (p) => {
  const s = p.replace(/\/+$/, '')
  return s === '' ? '/' : s
}

/** '/me/dev' 처럼 base 가 붙은 주소에서 base 를 떼어냅니다. */
const strip = (p) => (BASE && p.startsWith(BASE) ? p.slice(BASE.length) : p)

const read = () => (typeof window === 'undefined' ? '/' : clean(strip(window.location.pathname)))

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
  window.history.pushState({}, '', BASE + to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}
