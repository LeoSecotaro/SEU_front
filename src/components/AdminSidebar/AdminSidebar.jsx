import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiBook, FiTag, FiMonitor, FiClock, FiSettings, FiLogOut, FiX, FiUsers } from 'react-icons/fi'
import './AdminSidebar.css'

export default function AdminSidebar({ onLogout, mobileOpen = false, onClose = () => {} }) {
  const handleClickLink = () => {
    if (mobileOpen) onClose()
  }

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`} aria-hidden={!mobileOpen && undefined}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          {/* Logo o inicial */}
          <span>UTN</span>
        </div>
        <div className="brand-text">
          <h3>Panel Admin</h3>
        </div>
        {/* Close button visible only when mobile menu is open */}
        {mobileOpen && (
          <button className="mobile-close" onClick={onClose} aria-label="Cerrar menú">
            <FiX />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleClickLink}>
              <FiBook className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Cursos</span>
                <span className="nav-desc">Gestión del catálogo</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/labels" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleClickLink}>
              <FiTag className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Categorías</span>
                <span className="nav-desc">Áreas temáticas</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/modalities" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleClickLink}>
              <FiMonitor className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Modalidades</span>
                <span className="nav-desc">Tipos de cursado</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/schedules" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleClickLink}>
              <FiClock className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Días</span>
                <span className="nav-desc">Plantillas de días</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={handleClickLink}>
              <FiUsers className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Usuarios</span>
                <span className="nav-desc">Administrar cuentas</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => { if (mobileOpen) onClose(); onLogout && onLogout() }} className="btn-logout">
          <FiLogOut className="nav-icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
