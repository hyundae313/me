import { useEffect } from 'react'
import { chapters } from '../data/personal'
import { useActiveSection } from '../hooks/useActiveSection'
import { useFonts } from '../hooks/useFonts'
import { useReveal } from '../hooks/useReveal'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { trackEvent } from '../lib/analytics'
import { Days, Interlude, Intro, Likes, Story, Values } from './sections'
import './personal.css'

const FONTS =
  'https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@300;400;600&family=EB+Garamond:ital,wght@0,500;1,400&display=swap'

const ids = chapters.map((c) => c.id)

function jump(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  trackEvent('chapter_jump', { to: id })
  if (navigator.vibrate) navigator.vibrate(8)
}

export default function PersonalPage() {
  const active = useActiveSection(ids)
  const progress = useScrollProgress()

  useFonts(FONTS)
  useReveal(null, '.p-rise')

  useEffect(() => {
    document.title = '김현대'
  }, [])

  const label = chapters.find((c) => c.id === active)?.label ?? chapters[0].label

  return (
    <div className="p-page">
      <div className="p-grain" aria-hidden="true" />
      <div
        className="p-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <main>
        <Intro />
        <Story />
        <Interlude after="story" />
        <Days />
        <Likes />
        <Interlude after="likes" />
        <Values />
      </main>

      {/* 데스크톱: 오른쪽 세로 챕터 표시 */}
      <nav className="p-rail" aria-label="목차">
        {chapters.map((c) => (
          <button
            key={c.id}
            className={`p-rail-item${active === c.id ? ' is-active' : ''}`}
            onClick={() => jump(c.id)}
          >
            <span className="p-rail-label">{c.label}</span>
            <span className="p-rail-dot" />
          </button>
        ))}
      </nav>

      {/* 모바일: 하단 얇은 알약 — 현재 챕터 이름 + 점 */}
      <nav className="p-pill" aria-label="목차">
        <span className="p-pill-label">{label}</span>
        <span className="p-pill-dots">
          {chapters.map((c) => (
            <button
              key={c.id}
              className={`p-pill-dot${active === c.id ? ' is-active' : ''}`}
              onClick={() => jump(c.id)}
              aria-label={c.label}
              aria-current={active === c.id ? 'true' : undefined}
            />
          ))}
        </span>
      </nav>
    </div>
  )
}
