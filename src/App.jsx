import { lazy, Suspense, useEffect } from 'react'
import { TrackPanel } from './components/TrackPanel'
import { initTracking, trackEvent } from './lib/analytics'
import { useRoute } from './lib/useRoute'

const PersonalPage = lazy(() => import('./personal/PersonalPage'))
const DevPage = lazy(() => import('./pages/DevPage'))

export default function App() {
  const path = useRoute()
  const isDev = path === '/dev'

  useEffect(() => {
    initTracking()
  }, [])

  // 어느 페이지를 봤는지도 유입 로그에 남깁니다
  useEffect(() => {
    trackEvent('page_view', { page: isDev ? 'dev' : 'personal', path })
  }, [isDev, path])

  useEffect(() => {
    document.documentElement.dataset.page = isDev ? 'dev' : 'personal'
  }, [isDev])

  return (
    <>
      <Suspense fallback={null}>{isDev ? <DevPage /> : <PersonalPage />}</Suspense>
      <TrackPanel />
    </>
  )
}
