import React, { useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import '../../pages/Admin/AdminCourses.css'

export default function AdminCourseCard({ course, onEdit, onDelete }) {
  const [openTopics, setOpenTopics] = useState(false)

  const toggleTopics = () => setOpenTopics(v => !v)

  const handleEdit = () => {
    if (typeof onEdit === 'function') return onEdit()
    console.log('Editar', course.id)
  }

  const handleDelete = () => {
    if (typeof onDelete === 'function') return onDelete()
    console.log('Eliminar', course.id)
  }

  // Robust fallbacks for modality and category
  const modality = (
    course.modality ||
    course.mode ||
    course.mode_name ||
    course.modality_name ||
    (course.modality && (course.modality.name || course.modality.title)) ||
    (course.mode && (course.mode.name || course.mode.title)) ||
    null
  )

  const category = (
    course.category ||
    (course.label && (course.label.name || course.label.title)) ||
    (course.category_name || course.label_name) ||
    ''
  )

  // Normalize common display fields so cards work with different backend shapes
  const title = course.title ?? course.name ?? course.course_name ?? ''
  const description = course.description ?? course.summary ?? course.short_description ?? ''
  const priceVal = course.price ?? course.cost ?? course.fee ?? null
  const durationVal = course.duration ?? course.hours ?? course.duration_hours ?? null

  const startRaw = course.start ?? course.start_date ?? course.start_at ?? null
  const formatDate = (d) => {
    if (!d) return null
    if (typeof d === 'string') {
      // prefer YYYY-MM-DD portion
      return d.includes('T') ? d.split('T')[0] : d
    }
    return String(d)
  }
  const start = formatDate(startRaw)

  // Support only canonical DB fields: quota (max) and quota_minimum (min)
  const toNum = (v) => {
    if (v === undefined || v === null) return null
    const n = Number(v)
    return Number.isNaN(n) ? null : n
  }

  // Use only canonical fields coming from the normalized object (or the raw payload if you intentionally populate them there)
  const maxVal = toNum(course.quota ?? null)
  const minVal = toNum(course.quota_minimum ?? null)

  const formatQuota = (v) => (v === null || v === undefined ? '—' : String(v))

  return (
    <div className="admin-course-card">
      <div className="course-tags">
        <span className="tag">{category}</span>
        {modality ? <span className="tag-outline">{modality}</span> : null}
        <span className="course-id">ID #{course.id}</span>
      </div>

      <h3>{title || '—'}</h3>

      {description && (
        <p className="course-desc">{description}</p>
      )}

      <div className="course-meta">
        <span>$ {priceVal ? Number(priceVal).toLocaleString() : '—'} ARS</span>
        <span>Duración en horas: {durationVal ?? '—'}</span>
        <span>Cupo máx: {formatQuota(maxVal)}</span>
        <span>Cupo mín: {formatQuota(minVal)}</span>
        <span>Inicio: <strong>{start || '—'}</strong></span>
      </div>

      <div className="course-actions">
        <button className="btn-icon outline" title="Editar" onClick={handleEdit}>
          <FiEdit2 /> Editar
        </button>
        <button className="btn-icon danger outline" title="Eliminar" onClick={handleDelete}>
          <FiTrash2 />
        </button>
        {course.topics && course.topics.length > 0 && (
          <button type="button" className="btn-link" onClick={toggleTopics}>
            {openTopics ? 'Ocultar temario' : `Ver temario (${course.topics.length})`}
          </button>
        )}
      </div>

      {openTopics && course.topics && (
        <div className="course-topics">
          <ul>
            {course.topics.map(t => (
              <li key={t.id} className="topic-item">
                <strong>{t.title}</strong>
                {t.content ? <div className="topic-content">{t.content}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
