import React from 'react'
import './coursedetails.css'

export default function CourseContent({ course }) {
  return (
    <div className="course-content">
      <section className="course-meta-cards">
        <div className="meta-grid">
          <div className="meta-item">Modalidad: <strong>{course.mode_name || (course.mode_id === 1 ? 'Presencial' : 'Online')}</strong></div>
          <div className="meta-item">Inicio: <strong>{course.start_date}</strong></div>
          <div className="meta-item">Duración: <strong>{course.duration}</strong></div>
          <div className="meta-item">Carga Horaria: <strong>{course.hourly_load || course.hours || course.hourly}</strong></div>
        </div>
      </section>

      <section className="course-objectives">
        <h3>Objetivos del Curso</h3>
        <div>{course.goals}</div>
      </section>

      <section className="course-topics">
        <h3>Temas a Desarrollar</h3>
        {/* topics absent in provided JSON; show schedule and address as fallback */}
        <div className="topics-fallback">
          <p><strong>Horario:</strong> {course.schedule}</p>
          <p><strong>Dirección:</strong> {course.address}</p>
          <p><strong>Cupo máximo:</strong> {course.quota}</p>
        </div>
      </section>

    </div>
  )
}
