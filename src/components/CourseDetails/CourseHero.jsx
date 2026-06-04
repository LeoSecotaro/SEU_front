import React from 'react'
import './coursedetails.css'

export default function CourseHero({ course }) {
  // handle cases where the prop may be nested: { course: { ... } }
  const src = course && (course.course ? course.course : course)

  const subtitle = src && (src.label_name || (src.labels && src.labels[0] && src.labels[0].name)) || ''
  // show description only (do not fall back to goals)
  const heroLead = src && (src.description || src.summary || src.short_description) || ''

  return (
    <section className="course-hero">
      <div className="hero-inner">
        {subtitle && <div className="badge">{subtitle}</div>}
        <h1>{src && src.name}</h1>
        <p className="lead">{heroLead}</p>
      </div>
    </section>
  )
}
