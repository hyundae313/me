import { useEffect, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 문구 배열을 순환하며 타이핑/삭제하는 효과. reduced-motion 이면 첫 문구만 표시. */
export function useTypewriter(words, { type = 78, erase = 38, hold = 1700 } = {}) {
  const [reduced] = useState(prefersReduced)
  const [text, setText] = useState('')

  useEffect(() => {
    if (reduced || !words.length) return

    let i = 0
    let pos = 0
    let erasing = false
    let timer

    const step = () => {
      const word = words[i % words.length]
      pos += erasing ? -1 : 1
      setText(word.slice(0, pos))

      let delay = erasing ? erase : type
      if (!erasing && pos === word.length) {
        erasing = true
        delay = hold
      } else if (erasing && pos === 0) {
        erasing = false
        i += 1
        delay = 220
      }
      timer = setTimeout(step, delay)
    }

    timer = setTimeout(step, 500)
    return () => clearTimeout(timer)
  }, [words, type, erase, hold, reduced])

  // 모션을 줄인 환경에서는 애니메이션 없이 첫 문구만 그대로 보여줍니다
  return { text: reduced ? words[0] || '' : text }
}
