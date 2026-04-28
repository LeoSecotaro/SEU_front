import './navbar.css'
import { useEffect, useRef } from 'react'
import { FaGraduationCap } from 'react-icons/fa'

export default function NavBar() {
  const headerRef = useRef<HTMLElement | null>(null)

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

  return (
    <header ref={headerRef} className="site-header">
      <div className="container nav-row centered">
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
