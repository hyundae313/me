import { profile } from '../data/profile'
import { usePrefs } from '../hooks/usePrefs'
import './Footer.css'

export function Footer() {
  const { t } = usePrefs()
  const year = new Date().getFullYear()

  return (
    <footer className="ftr">
      <div className="wrap ftr-inner">
        <span className="mono">
          © {year} {t(profile.name)}
        </span>
        <span className="mono ftr-built">Built with React · Vite</span>
      </div>
    </footer>
  )
}
