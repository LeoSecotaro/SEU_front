import React from 'react'
import './coursecard.css'
import { FaRegClock, FaUserFriends, FaArrowRight, FaBookOpen } from 'react-icons/fa'

export default function CourseCard({ course }) {
  const badge = (course.labels && course.labels[0] && course.labels[0].name) || course.label_name || course.category || ''
  return (
    <article className="course-card">
      <div className="hero">
        {badge && <span className="course-badge">{badge}</span>}
        <div className="hero-icon" aria-hidden><FaBookOpen /></div>
      </div>

      <div className="body">
        <h3>{course.name}</h3>

        <div className="meta">
          <span className="meta-item"><FaRegClock className="icon" /> {course.duration || '—'}</span>
          <span className="meta-item"><FaUserFriends className="icon" /> {course.mode_name || '—'}</span>
        </div>

        <div className="footer">
          <div className="starts">INICIA <strong>{course.start_date}</strong></div>
          <a className="btn small" href={`/courses/${course.id}`}>Ver Detalles <FaArrowRight /></a>
        </div>
      </div>
    </article>
  )
}
