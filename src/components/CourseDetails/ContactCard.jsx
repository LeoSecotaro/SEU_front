import React from 'react'
import './coursedetails.css'
import { FaEnvelope, FaWhatsapp, FaBuilding } from 'react-icons/fa'

export default function ContactCard({ course }) {
  const email = (course && (course.email || course.contact_email)) || null
  const phone = (course && (course.phone_number || course.contact_phone)) || null

  return (
    <div className="contact-card">
      <h4>¿Tienes dudas?</h4>

      <ul className="contact-list">
        {email && (
          <li className="contact-item">
            <span className="contact-icon"><FaEnvelope /></span>
            <div className="contact-body">
              <a className="contact-value" href={`mailto:${email}`}>{email}</a>
            </div>
          </li>
        )}

        {phone && (
          <li className="contact-item">
            <span className="contact-icon"><FaWhatsapp /></span>
            <div className="contact-body">
              <a className="contact-value" href={`https://wa.me/${String(phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{phone}</a>
            </div>
          </li>
        )}

        {course && course.office && (
          <li className="contact-item">
            <span className="contact-icon"><FaBuilding /></span>
            <div className="contact-body">
              <div className="contact-value">{course.office}</div>
            </div>
          </li>
        )}
      </ul>

    </div>
  )
}
