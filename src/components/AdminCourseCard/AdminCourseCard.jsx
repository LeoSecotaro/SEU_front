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

  return (
    <div className="admin-course-card">
      <div className="course-tags">
        <span className="tag">{course.category}</span>
        <span className="tag-outline">{course.modality}</span>
        <span className="course-id">ID #{course.id}</span>
      </div>

      <h3>{course.title}</h3>

      {course.description && (
        <p className="course-desc">{course.description}</p>
      )}

      <div className="course-meta">
        <span>$ {course.price ? course.price.toLocaleString() : '—'} ARS</span>
        <span>{course.duration}</span>
        <span>Cupo mín: {course.minQuota ?? '—'}</span>
        <span>Inicio: <strong>{course.start || '—'}</strong></span>
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
