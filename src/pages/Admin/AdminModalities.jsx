import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import './AdminModalities.css'
import { toast } from 'react-toastify'
import AdminDeleteModal from '../../components/AdminDeleteModal/AdminDeleteModal'

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
      let res = await fetch('/api/admin/modes', { credentials: 'include', headers: { 'Accept': 'application/json' } })
      if (res.status === 404) {
        res = await fetch('http://localhost:3000/admin/modes', { credentials: 'include', headers: { 'Accept': 'application/json' } })
      }
      if (!res.ok) throw new Error('Error fetching modes')
      const data = await res.json()
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
      let res = await fetch('/api/admin/modes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ mode: { name } })
      })
      if (res.status === 404) {
        const r2 = await fetch('http://localhost:3000/admin/modes', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ mode: { name } })
        })
        if (!r2.ok) throw new Error('Create failed')
        await fetchModes()
        setNewName('')
        toast.success('Modalidad creada')
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err && err.error ? err.error : 'Error creando modalidad')
      }
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
      let res = await fetch(`/api/admin/modes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ mode: { name } })
      })
      if (res.status === 404) {
        res = await fetch(`http://localhost:3000/admin/modes/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ mode: { name } })
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err && err.error ? err.error : 'Error actualizando')
      }
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
