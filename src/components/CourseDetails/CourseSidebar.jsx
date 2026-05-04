import React from 'react'
import './coursedetails.css'
import ContactCard from './ContactCard'

export default function CourseSidebar({ course }) {
  // Determine base price string
  let basePrice = 'Consultar precio'
  if (course) {
    if (course.price === 0 || course.price === null) {
      basePrice = 'Gratis'
    } else if (course.price_display) {
      basePrice = course.price_display
    } else if (typeof course.price !== 'undefined') {
      basePrice = `$${course.price} ARS`
    }
  }

  // Append monthly indicator only when applicable and not 'Gratis' or 'Consultar precio'
  const priceText = course && course.price_is_monthly && basePrice !== 'Gratis' && basePrice !== 'Consultar precio'
    ? `${basePrice} /mes`
    : basePrice

  return (
    <aside className="course-sidebar">
      <div className="price-card">
        <div className="price-header">INVERSIÓN</div>
        <div className="price-amount">{priceText}</div>
        <div className="price-actions">
          <button className="btn primary large">Inscribirme Ahora</button>
        </div>
      </div>

      <ContactCard course={course} />
    </aside>
  )
}
