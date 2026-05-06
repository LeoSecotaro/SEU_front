import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiBook, FiTag, FiMonitor, FiClock, FiSettings, FiLogOut } from 'react-icons/fi'
import './AdminSidebar.css'

export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          {/* Logo o inicial */}
          <span>UTN</span>
        </div>
        <div className="brand-text">
          <h3>Panel Admin</h3>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiBook className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Cursos</span>
                <span className="nav-desc">Gestión del catálogo</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiTag className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Categorías</span>
                <span className="nav-desc">Áreas temáticas</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/modalities" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiMonitor className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Modalidades</span>
                <span className="nav-desc">Tipos de cursado</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/schedules" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FiClock className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Días y Horarios</span>
                <span className="nav-desc">Plantillas de horario</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-logout">
          <FiLogOut className="nav-icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
