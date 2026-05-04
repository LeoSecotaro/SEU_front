import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import './coursedetails.css'

export default function CourseHero({ course }) {
  const [hoverBack, setHoverBack] = useState(false)

  // handle cases where the prop may be nested: { course: { ... } }
  const src = course && (course.course ? course.course : course)

  const subtitle = src && (src.label_name || (src.labels && src.labels[0] && src.labels[0].name)) || ''
  // show description only (do not fall back to goals)
  const heroLead = src && (src.description || src.summary || src.short_description) || ''

  const backStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: hoverBack ? '#1f2937' : '#0f1724', // dark grey on hover
    color: '#ffffff',
    padding: '8px 12px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    boxShadow: hoverBack ? '0 6px 14px rgba(2,6,23,0.12)' : '0 4px 10px rgba(2,6,23,0.08)',
    transform: hoverBack ? 'translateY(-1px)' : 'none',
    transition: 'transform 160ms ease, box-shadow 160ms ease, background 160ms ease'
  }

  return (
    <section className="course-hero">
      <div className="hero-inner">
        <a
          href="http://localhost:5173/"
          className="hero-back"
          aria-label="Volver al catálogo de cursos"
          style={backStyle}
          onMouseEnter={() => setHoverBack(true)}
          onMouseLeave={() => setHoverBack(false)}
        >
          <FaArrowLeft style={{ marginRight: 6, color: '#fff' }} />
          <span>Catálogo de Cursos</span>
        </a>

        {subtitle && <div className="badge">{subtitle}</div>}
        <h1>{src && src.name}</h1>
        <p className="lead">{heroLead}</p>
      </div>
    </section>
  )
}
