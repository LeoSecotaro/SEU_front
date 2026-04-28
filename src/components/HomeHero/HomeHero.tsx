import './homehero.css'
import { useCallback } from 'react'

export default function HomeHero() {
  const scrollToCourses = useCallback((e: React.MouseEvent) => {
    // keep default anchor behavior for non-JS users but prevent double jump
    e.preventDefault()
    const el = document.getElementById('cursos')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section className="hero-landing" id="inicio">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="pill">Inscripciones Abiertas</span>
          <h1>
            Nuevos Cursos,
            <br />
            <span className="accent">Nuevas Oportunidades Laborales.</span>
          </h1>
          <p className="lead">
            Formación profesional continua dictada por expertos. Actualiza tus
            conocimientos y adquiere las herramientas que la industria demanda
            hoy.
          </p>
          <a className="btn primary" href="#cursos" onClick={scrollToCourses}>Explorar Cursos</a>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="dot-grid" />
        </div>
      </div>

      <div className="stats container">
        <div className="stat"> 
          <strong>+40</strong>
          <span>Años de Trayectoria</span>
        </div>
        <div className="stat">
          <strong>+15k</strong>
          <span>Alumnos Egresados</span>
        </div>
        <div className="stat">
          <strong>20+</strong>
          <span>Cursos Activos</span>
        </div>
        <div className="stat">
          <strong>100%</strong>
          <span>Certificación UTN</span>
        </div>
      </div>
    </section>
  )
}
