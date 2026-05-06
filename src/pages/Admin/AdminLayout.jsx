import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaGraduationCap } from 'react-icons/fa'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import './AdminLayout.css'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Llamada al backend para cerrar sesión (ej. Devise sign_out)
      // fetch('/users/sign_out', { method: 'DELETE' })
      console.log('Logging out...')
      navigate('/login')
    } catch (error) {
      console.error('Error logging out', error)
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      <div className="admin-content">
        <header className="admin-header admin-header-dark">
          <div className="admin-header-center">
            <div className="admin-header-icon" aria-hidden>
              <FaGraduationCap />
            </div>
            <div className="admin-header-title">
              <span className="admin-sub">Administración</span>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
