import { useState, useEffect, useRef } from 'react'
import './navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      if (window.scrollY > 24) headerRef.current.classList.add('scrolled')
      else headerRef.current.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // run once to set initial state
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} className="site-header">
      <div className="container nav-row">
        <a className="brand" href="#">
          <div className="brand-logo" aria-hidden>
            UTN
          </div>
          <span className="brand-sub">Facultad Regional Mendoza</span>
        </a>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Abrir menú"
          onClick={() => setOpen((s) => !s)}
        >
          <span className="hamburger" />
        </button>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Navegación principal">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#cursos">Cursos</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <div className="nav-actions">
            {/* reserved for future actions */}
          </div>
        </nav>
      </div>
    </header>
  )
}
