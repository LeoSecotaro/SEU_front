import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import './AdminLabels.css'
import { toast } from 'react-toastify'
import AdminDeleteModal from '../../components/AdminDeleteModal/AdminDeleteModal'

export default function AdminLabels() {
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deletingLabel, setDeletingLabel] = useState(null)

  const fetchLabels = async () => {
    setLoading(true)
    try {
      let res = await fetch('/api/admin/labels', { credentials: 'include', headers: { 'Accept': 'application/json' } })
      if (res.status === 404) {
        res = await fetch('http://localhost:3000/admin/labels', { credentials: 'include', headers: { 'Accept': 'application/json' } })
      }
      if (!res.ok) throw new Error('Error fetching labels')
      const data = await res.json()
      // Accept different shapes: array or { data: [...] }
      const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : Object.values(data).flat())
      setLabels(list.filter(Boolean))
    } catch (err) {
      console.error('Failed to load labels', err)
      toast.error('No se pudo cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLabels() }, [])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      const res = await fetch('/api/admin/labels', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ label: { name } })
      })
      if (res.status === 404) {
        const r2 = await fetch(`http://localhost:3000/admin/labels`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ label: { name } })
        })
        if (!r2.ok) throw new Error('Create failed')
        await fetchLabels()
        setNewName('')
        toast.success('Categoría creada')
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err && err.error ? err.error : 'Error creando categoría')
      }
      setNewName('')
      toast.success('Categoría creada')
      fetchLabels()
    } catch (err) {
      console.error('Create label error', err)
      toast.error('No se pudo crear la categoría')
    }
  }

  const startEdit = (label) => {
    setEditingId(label.id)
    setEditingName(label.name || label.title || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleUpdate = async (id) => {
    const name = (editingName || '').trim()
    if (!name) return
    try {
      let res = await fetch(`/api/admin/labels/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ label: { name } })
      })
      if (res.status === 404) {
        res = await fetch(`http://localhost:3000/admin/labels/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ label: { name } })
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err && err.error ? err.error : 'Error actualizando')
      }
      toast.success('Categoría actualizada')
      cancelEdit()
      fetchLabels()
    } catch (err) {
      console.error('Update label error', err)
      toast.error('No se pudo actualizar la categoría')
    }
  }

  // open delete modal instead of immediate confirm
  const handleDelete = (label) => {
    setDeletingLabel({ id: label.id, title: label.name || label.title })
  }

  const onDeleted = () => {
    toast.success('Categoría eliminada')
    setDeletingLabel(null)
    fetchLabels()
  }

  return (
    <div className="admin-labels">
      <div className="labels-header">
        <h2>Categorías</h2>
        <p className="muted">Las categorías agrupan los cursos por área temática. Se usan en los filtros del catálogo y en el formulario de alta de cursos.</p>
      </div>

      <div className="labels-list">
        {loading ? <p>Cargando...</p> : (
          labels.length === 0 ? <p className="muted">No hay categorías aún.</p> : (
            labels.map(label => (
              <div key={label.id} className="label-row">
                {editingId === label.id ? (
                  <>
                    <input value={editingName} onChange={e => setEditingName(e.target.value)} className="label-input edit" />
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => handleUpdate(label.id)} title="Guardar"><FiCheck /></button>
                      <button className="btn-icon danger" onClick={cancelEdit} title="Cancelar"><FiX /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="label-text">{label.name || label.title}</div>
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => startEdit(label)} title="Editar"><FiEdit2 /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(label)} title="Eliminar"><FiTrash2 /></button>
                    </div>
                  </>
                )}
              </div>
            ))
          )
        )}
      </div>

      <div className="labels-add">
        <input placeholder="Ej: Mecánica Industrial" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreate() }} />
        <button className="btn-primary" onClick={handleCreate}><FiPlus /> Agregar</button>
      </div>

      {deletingLabel && (
        <AdminDeleteModal id={deletingLabel.id} title={deletingLabel.title} basePath={'/api/admin/labels'} itemName={'Categoría'} onClose={() => setDeletingLabel(null)} onDeleted={onDeleted} />
      )}
    </div>
  )
}
