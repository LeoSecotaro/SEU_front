import React from 'react'
import './coursecard.css'
import { FaRegClock, FaUserFriends, FaArrowRight, FaBookOpen } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  // helper to safely show values that may be strings or objects like { id, name }
  const asText = (v) => {
    if (v === null || typeof v === 'undefined') return ''
    if (typeof v === 'object') return v.name || ''
    return String(v)
  }

  const badge = (course.labels && course.labels[0] && asText(course.labels[0])) || asText(course.label_name) || asText(course.category) || ''
  const modeName = asText(course.mode_name) || asText(course.mode) || ''
  const quota = typeof course.quota !== 'undefined' && course.quota !== null ? course.quota : '—'

  return (
    <article className="course-card">
      <div className="hero">
        {badge && <span className="course-badge">{badge}</span>}
        <div className="hero-icon" aria-hidden><FaBookOpen /></div>
      </div>

      <div className="body">
        <h3>{asText(course.name)}</h3>

        {/* mode pill under title */}
        {modeName && <div className="mode-pill">{modeName}</div>}

        <div className="meta">
          <span className="meta-item"><FaRegClock className="icon" /> {asText(course.duration) || '—'}</span>
          <span className="meta-item"><FaUserFriends className="icon" /> {quota}</span>
        </div>

        <div className="footer">
          <div className="starts">INICIA <strong>{asText(course.start_date)}</strong></div>
          <Link className="btn small" to={`/courses/${course.id}`}>Ver Detalles <FaArrowRight /></Link>
        </div>
      </div>
    </article>
  )
}
