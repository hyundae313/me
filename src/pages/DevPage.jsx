import { useEffect, useMemo } from 'react'
import { Background } from '../components/Background'
import { Career } from '../components/Career'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Header, MobileTopBar, TabBar } from '../components/Nav'
import { Stack } from '../components/Stack'
import { Work } from '../components/Work'
import { nav } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useFonts } from '../hooks/useFonts'
import { usePrefs } from '../hooks/usePrefs'
import { useReveal } from '../hooks/useReveal'
import { useScrollProgress } from '../hooks/useScrollProgress'

const FONTS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'

export default function DevPage() {
  const { lang } = usePrefs()
  const ids = useMemo(() => nav.map((n) => n.id), [])
  const active = useActiveSection(ids)
  const progress = useScrollProgress()

  useFonts(FONTS)
  useReveal(lang)

  useEffect(() => {
    document.title = '김현대 · Hyundae Kim — CTO · 겸임교수 · 앱 개발자'
  }, [])

  return (
    <>
      <Background />
      <Header active={active} progress={progress} />
      <MobileTopBar />

      <main>
        <Hero />
        <Work />
        <Career />
        <Stack />
        <Contact />
      </main>

      <Footer />
      <TabBar active={active} />
    </>
  )
}
