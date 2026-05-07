import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import './AdminModalities.css'
import { toast } from 'react-toastify'
import AdminDeleteModal from '../../components/AdminDeleteModal/AdminDeleteModal'
import { apiGet, apiPost, apiPut } from '../../api/client'

export default function AdminModalities() {
  const [modes, setModes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deletingMode, setDeletingMode] = useState(null)

  const fetchModes = async () => {
    setLoading(true)
    try {
      const data = await apiGet('/api/admin/modes', { includeCredentials: true })
      const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : Object.values(data).flat())
      setModes(list.filter(Boolean))
    } catch (err) {
      console.error('Failed to load modes', err)
      toast.error('No se pudo cargar las modalidades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchModes() }, [])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await apiPost('/api/admin/modes', { mode: { name } }, { includeCredentials: true })
      setNewName('')
      toast.success('Modalidad creada')
      fetchModes()
    } catch (err) {
      console.error('Create mode error', err)
      toast.error('No se pudo crear la modalidad')
    }
  }

  const startEdit = (mode) => {
    setEditingId(mode.id)
    setEditingName(mode.name || mode.title || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleUpdate = async (id) => {
    const name = (editingName || '').trim()
    if (!name) return
    try {
      await apiPut(`/api/admin/modes/${id}`, { mode: { name } }, { includeCredentials: true })
      toast.success('Modalidad actualizada')
      cancelEdit()
      fetchModes()
    } catch (err) {
      console.error('Update mode error', err)
      toast.error('No se pudo actualizar la modalidad')
    }
  }

  const handleDelete = (mode) => {
    setDeletingMode({ id: mode.id, title: mode.name || mode.title })
  }

  const onDeleted = () => {
    toast.success('Modalidad eliminada')
    setDeletingMode(null)
    fetchModes()
  }

  return (
    <div className="admin-labels">
      <div className="labels-header">
        <h2>Modalidades</h2>
        <p className="muted">Las modalidades definen el tipo de cursado disponible para los cursos.</p>
      </div>

      <div className="labels-list">
        {loading ? <p>Cargando...</p> : (
          modes.length === 0 ? <p className="muted">No hay modalidades aún.</p> : (
            modes.map(mode => (
              <div key={mode.id} className="label-row">
                {editingId === mode.id ? (
                  <>
                    <input value={editingName} onChange={e => setEditingName(e.target.value)} className="label-input edit" />
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => handleUpdate(mode.id)} title="Guardar"><FiCheck /></button>
                      <button className="btn-icon danger" onClick={cancelEdit} title="Cancelar"><FiX /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="label-text">{mode.name || mode.title}</div>
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => startEdit(mode)} title="Editar"><FiEdit2 /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(mode)} title="Eliminar"><FiTrash2 /></button>
                    </div>
                  </>
                )}
              </div>
            ))
          )
        )}
      </div>

      <div className="labels-add">
        <input placeholder="Ej: Semipresencial" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreate() }} />
        <button className="btn-primary" onClick={handleCreate}><FiPlus /> Agregar</button>
      </div>

      {deletingMode && (
        <AdminDeleteModal id={deletingMode.id} title={deletingMode.title} basePath={'/api/admin/modes'} itemName={'Modalidad'} onClose={() => setDeletingMode(null)} onDeleted={onDeleted} />
      )}
    </div>
  )
}
