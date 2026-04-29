import React from 'react'
import './coursedetails.css'

export default function CourseHero({ course }) {
  const subtitle = course.label_name || (course.labels && course.labels[0] && course.labels[0].name) || ''
  // Prefer summary/short_description for hero; fall back to description, then goals
  const heroLead = course.summary || course.short_description || course.description || course.goals || ''
  return (
    <section className="course-hero">
      <div className="hero-inner">
        {subtitle && <div className="badge">{subtitle}</div>}
        <h1>{course.name}</h1>
        <p className="lead">{heroLead}</p>
      </div>
    </section>
  )
}
