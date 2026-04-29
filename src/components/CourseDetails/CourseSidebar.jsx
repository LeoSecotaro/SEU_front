import React from 'react'
import './coursedetails.css'

export default function CourseSidebar({ course }) {
  return (
    <aside className="course-sidebar">
      <div className="price-card">
        <div className="price-header">INVERSIÓN</div>
        <div className="price-amount">{course.price_display || `$${course.price} ARS`}</div>
        <div className="price-actions">
          <button className="btn primary large">Inscribirme Ahora</button>
        </div>
      </div>

      <div className="contact-card">
        <h4>¿Tienes dudas?</h4>
        {course.contact_email && <div className="contact-item">Email: {course.contact_email}</div>}
        {course.contact_phone && <div className="contact-item">WhatsApp: {course.contact_phone}</div>}
      </div>
    </aside>
  )
}
