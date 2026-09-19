import { useEffect, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 문자열 배열을 순서대로 한 번씩 타이핑합니다. 앞 문장이 끝나야 다음 문장이 시작됩니다.
 * doneIndex 는 지금까지 타이핑을 마친 마지막 인덱스입니다(-1이면 아직 아무것도 안 끝남).
 */
export function useTypeSequence(
  texts,
  { speed = 42, startDelay = 350, gap = 300, start = true } = {},
) {
  const [reduced] = useState(prefersReduced)
  const [texts0] = useState(texts)
  const [outs, setOuts] = useState(() => texts0.map((t) => (reduced ? t : '')))
  const [doneIndex, setDoneIndex] = useState(reduced ? texts0.length - 1 : -1)

  useEffect(() => {
    if (reduced || !texts0.length || !start) return
    let cancelled = false
    let timer

    const typeAt = (idx, delay) => {
      const text = texts0[idx]
      let pos = 0
      const step = () => {
        if (cancelled) return
        pos += 1
        setOuts((prev) => {
          const next = prev.slice()
          next[idx] = text.slice(0, pos)
          return next
        })
        if (pos >= text.length) {
          setDoneIndex(idx)
          if (idx + 1 < texts0.length) typeAt(idx + 1, gap)
          return
        }
        timer = setTimeout(step, speed)
      }
      timer = setTimeout(step, delay)
    }

    typeAt(0, startDelay)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [texts0, speed, startDelay, gap, reduced, start])

  return { texts: outs, doneIndex }
}
