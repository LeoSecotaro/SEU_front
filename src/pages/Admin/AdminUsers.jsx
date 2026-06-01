import React, { useState, useEffect } from 'react'
import './AdminUsers.css'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import AdminUserModal from '../../components/AdminUserModal/AdminUserModal'
import AdminUserEditModal from '../../components/AdminUserEditModal/AdminUserEditModal'
import AdminDeleteModal from '../../components/AdminDeleteModal/AdminDeleteModal'
import { listAdminUsers } from '../../api/users'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await listAdminUsers()
      setUsers(Array.isArray(data) ? data : (data.data || []))
    } catch (err) {
      console.error('Failed to load users', err)
      toast.error('No se pudo cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const onUserCreated = () => { toast.success('Usuario creado'); setCreateModalOpen(false); fetchUsers() }
  const onUserUpdated = () => { toast.success('Usuario actualizado'); setEditingUserId(null); fetchUsers() }
  const onUserDeleted = () => { toast.success('Usuario eliminado'); setDeletingUser(null); fetchUsers() }

  const editingIsOwn = currentUser && editingUserId ? String(currentUser.id) === String(editingUserId) : false

  return (
    <div className="admin-users">
      <div className="page-header">
        <div className="header-title">
          <FiPlus className="page-icon" />
          <div>
            <h1>Usuarios</h1>
            <p>{users.length} usuarios</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setCreateModalOpen(true)}><FiPlus /> Nuevo Usuario</button>
      </div>

      {loading ? <p>Cargando usuarios...</p> : (
        <div className="users-list">
          {users.map(u => (
            <div key={u.id} className="user-row">
              <div className="user-email">{u.email}</div>
              <div className="user-actions">
                <button className="btn-icon" onClick={() => setEditingUserId(u.id)} title="Editar"><FiEdit2 /></button>
                <button className="btn-icon danger" onClick={() => setDeletingUser({ id: u.id, email: u.email })} title="Eliminar"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {createModalOpen && <AdminUserModal onClose={() => setCreateModalOpen(false)} onCreated={onUserCreated} />}
      {editingUserId && (
        <AdminUserEditModal
          userId={editingUserId}
          currentUserIdProp={currentUser && currentUser.id}
          currentUserEmailProp={currentUser && currentUser.email}
          showPasswordFields={editingIsOwn ? true : undefined}
          onClose={() => setEditingUserId(null)}
          onUpdated={onUserUpdated}
        />
      )}
      {deletingUser && <AdminDeleteModal id={deletingUser.id} title={deletingUser.email} basePath={'/api/admin/users'} itemName={'Usuario'} onClose={() => setDeletingUser(null)} onDeleted={onUserDeleted} />}
    </div>
  )
}
