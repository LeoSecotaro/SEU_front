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

  // resolve image URL (relative paths from Rails are fine as-is)
  const resolveImageSrc = (url) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('//')) return url
    // allow absolute paths from backend (e.g. /rails/active_storage/...)
    return url
  }

  return (
    <article className="course-card">
      <div className="hero">
        {badge && <span className="course-badge">{badge}</span>}
        {course.image_url ? (
          <img
            className="hero-img"
            src={resolveImageSrc(course.image_url)}
            alt={asText(course.name) || 'Course image'}
            loading="lazy"
          />
        ) : (
          <div className="hero-placeholder" aria-hidden>
            <FaBookOpen className="hero-icon" />
          </div>
        )}
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
          <div className="starts">INICIA <strong>{course.start_date ? asText(course.start_date) : 'Inicio con el cupo mínimo'}</strong></div>
          <Link className="btn small" to={`/courses/${course.id}`}>Ver Detalles <FaArrowRight /></Link>
        </div>
      </div>
    </article>
  )
}
