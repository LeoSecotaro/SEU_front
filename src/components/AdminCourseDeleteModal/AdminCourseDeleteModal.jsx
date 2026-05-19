import React, { useState } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import '../AdminCourseModal/AdminCourseModal.css'
import { deleteAdminCourse } from '../../api/adminCourses'

export default function AdminCourseDeleteModal({ courseId, courseTitle, onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await deleteAdminCourse(courseId)
      onDeleted && onDeleted()
      onClose && onClose()
      return
    } catch (err) {
      console.error('Delete error', err)
      setError(err && err.message ? String(err.message) : 'Error de red al intentar eliminar el curso')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content admin-course-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Eliminar Curso</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el curso <strong>{courseTitle || `#${courseId}`}</strong>? Esta acción no se puede deshacer.</p>
          {error && <p style={{ color: '#ef4444', marginTop: 8 }}>{error}</p>}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>Cancelar</button>
          <button type="button" className="btn-primary" onClick={handleDelete} disabled={submitting} style={{ backgroundColor: '#ef4444', color: '#fff' }}>
            {submitting ? 'Eliminando...' : (<><FiTrash2 /> Eliminar</>)}
          </button>
        </div>
      </div>
    </div>
  )
}
