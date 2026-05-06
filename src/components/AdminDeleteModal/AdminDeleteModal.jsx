import React, { useState } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import '../AdminCourseModal/AdminCourseModal.css'

export default function AdminDeleteModal({ id, title, basePath = '/api/admin/labels', itemName = 'Elemento', onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setSubmitting(true)
    setError(null)
    try {
      let res = await fetch(`${basePath}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      if (res.status === 404) {
        // fallback to backend absolute URL (strip /api prefix if present)
        const fallbackBase = basePath.startsWith('/api') ? basePath.replace('/api', '') : basePath
        res = await fetch(`http://localhost:3000${fallbackBase}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        })
      }

      if (res.ok || res.status === 204) {
        onDeleted && onDeleted()
        onClose && onClose()
        return
      }

      let payload = null
      try { payload = await res.json() } catch (e) { payload = null }
      setError(payload && (payload.error || payload.message) ? String(payload.error || payload.message) : `Error al eliminar (status ${res.status})`)
    } catch (err) {
      console.error('Delete error', err)
      setError('Error de red al intentar eliminar')
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
