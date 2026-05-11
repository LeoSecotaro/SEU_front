import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import './AdminSchedules.css'
import { toast } from 'react-toastify'
import AdminDeleteModal from '../../components/AdminDeleteModal/AdminDeleteModal'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'

export default function AdminSchedules() {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deletingDay, setDeletingDay] = useState(null)

  const fetchDays = async () => {
    setLoading(true)
    try {
      const data = await apiGet('/api/admin/days', { includeCredentials: true })
      const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : Object.values(data).flat())
      setDays(list.filter(Boolean))
    } catch (err) {
      console.error('Failed to load days', err)
      toast.error('No se pudieron cargar los días')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDays() }, [])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await apiPost('/api/admin/days', { day: { name } }, { includeCredentials: true })
      setNewName('')
      toast.success('Día creado')
      fetchDays()
    } catch (err) {
      console.error('Create day error', err)
      toast.error('No se pudo crear el día')
    }
  }

  const startEdit = (day) => {
    setEditingId(day.id)
    setEditingName(day.name || day.title || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleUpdate = async (id) => {
    const name = (editingName || '').trim()
    if (!name) return
    try {
      await apiPut(`/api/admin/days/${id}`, { day: { name } }, { includeCredentials: true })
      toast.success('Día actualizado')
      cancelEdit()
      fetchDays()
    } catch (err) {
      console.error('Update day error', err)
      toast.error('No se pudo actualizar el día')
    }
  }

  const handleDelete = (day) => {
    setDeletingDay({ id: day.id, title: day.name || day.title })
  }

  const onDeleted = () => {
    toast.success('Día eliminado')
    setDeletingDay(null)
    fetchDays()
  }

  return (
    <div className="admin-labels">
      <div className="labels-header">
        <h2>Días</h2>
        <p className="muted">Define los días de la semana.</p>
      </div>

      <div className="labels-list">
        {loading ? <p>Cargando...</p> : (
          days.length === 0 ? <p className="muted">No hay días aún.</p> : (
            days.map(day => (
              <div key={day.id} className="label-row">
                {editingId === day.id ? (
                  <>
                    <input value={editingName} onChange={e => setEditingName(e.target.value)} className="label-input edit" />
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => handleUpdate(day.id)} title="Guardar"><FiCheck /></button>
                      <button className="btn-icon danger" onClick={cancelEdit} title="Cancelar"><FiX /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="label-text">{day.name || day.title}</div>
                    <div className="label-actions">
                      <button className="btn-icon" onClick={() => startEdit(day)} title="Editar"><FiEdit2 /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(day)} title="Eliminar"><FiTrash2 /></button>
                    </div>
                  </>
                )}
              </div>
            ))
          )
        )}
      </div>

      <div className="labels-add">
        <input placeholder="Ej: Lunes" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreate() }} />
        <button className="btn-primary" onClick={handleCreate}><FiPlus /> Agregar</button>
      </div>

      {deletingDay && (
        <AdminDeleteModal id={deletingDay.id} title={deletingDay.title} basePath={'/api/admin/days'} itemName={'Día'} onClose={() => setDeletingDay(null)} onDeleted={onDeleted} />
      )}
    </div>
  )
}
