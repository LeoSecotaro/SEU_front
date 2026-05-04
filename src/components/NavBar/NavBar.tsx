import './navbar.css'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaGraduationCap, FaArrowLeft, FaHome } from 'react-icons/fa'

export default function NavBar() {
  const headerRef = useRef<HTMLElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      const el = headerRef.current
      if (!el) return
      if (window.scrollY > 24) el.classList.add('scrolled')
      else el.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // run once to set initial state
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/' || location.pathname === ''

  return (
    <header ref={headerRef} className="site-header">
      <div className="container nav-row centered">
        {/* show navigation actions when not on home */}
        {!isHome && (
          <div className="nav-actions">
            <button
              type="button"
              className="btn icon-btn nav-back"
              onClick={() => navigate(-1)}
              aria-label="Volver atrás"
            >
              <FaArrowLeft />
            </button>

            <button
              type="button"
              className="btn icon-btn nav-home"
              onClick={() => navigate('/')}
              aria-label="Ir al inicio"
            >
              <FaHome />
            </button>
          </div>
        )}

        <a className="brand" href="#" aria-label="UTN">
          <div className="brand-logo" aria-hidden>
            <FaGraduationCap />
          </div>
          <div className="brand-text">
            <strong className="brand-title">UTN</strong>
            <span className="brand-sub">Facultad Regional Mendoza</span>
          </div>
        </a>
      </div>
    </header>
  )
}
