import React, { useState } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import '../AdminCourseModal/AdminCourseModal.css'
import { deleteResource } from '../../api/resources'

export default function AdminDeleteModal({ id, title, basePath = '/admin/labels', itemName = 'Elemento', onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await deleteResource(basePath, id)
      onDeleted && onDeleted()
      onClose && onClose()
      return
    } catch (err) {
      console.error('Delete error', err)
      setError(err && err.message ? String(err.message) : 'Error de red al intentar eliminar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content admin-course-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Eliminar {itemName}</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar {itemName.toLowerCase()} <strong>{title || `#${id}`}</strong>? Esta acción no se puede deshacer.</p>
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
