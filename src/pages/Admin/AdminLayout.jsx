import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaGraduationCap } from 'react-icons/fa'
import { FiMenu } from 'react-icons/fi'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import './AdminLayout.css'
import { toast } from 'react-toastify'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const checkAdmin = async () => {
      try {
        // call a protected admin endpoint to verify session + admin flag
        const res = await fetch('/api/admin/courses', { method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' } })
        if (!mounted) return
        if (res.status === 401) {
          // not signed in
          toast.error('Necesita iniciar sesión')
          navigate('/login')
          return
        }
        if (res.status === 403) {
          // signed in but not admin
          toast.error('Acceso denegado')
          navigate('/')
          return
        }
        // any ok response means user can access admin
      } catch (err) {
        console.error('Error verificando permisos admin', err)
        toast.error('Error al verificar permisos')
        navigate('/login')
      } finally {
        if (mounted) setLoadingAuth(false)
      }
    }

    checkAdmin()
    return () => { mounted = false }
  }, [navigate])

  const handleLogout = async () => {
    try {
      // perform sign out on backend (Devise) using DELETE
      const csrf = (typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]')) ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : null
      let res = await fetch('/api/users/sign_out', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {})
        }
      })

      // If dev server isn't proxying /api, it may return 404 — try backend absolute URL as fallback
      if (res.status === 404) {
        try {
          res = await fetch('http://localhost:3000/users/sign_out', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              ...(csrf ? { 'X-CSRF-Token': csrf } : {})
            }
          })
        } catch (e) {
          console.error('Fallback sign out failed', e)
        }
      }

      if (res && (res.ok || res.status === 204)) {
        toast.success('Sesión cerrada')
        navigate('/login')
      } else {
        // try to parse error JSON
        let errText = 'Error cerrando sesión'
        try {
          const body = await res.json()
          errText = body.error || body.message || JSON.stringify(body)
        } catch (e) {
          console.error('Error parsing sign out response', e)
        }
        toast.error(errText)
      }
    } catch (error) {
      console.error('Error logging out', error)
      toast.error('Error de red al cerrar sesión')
    }
  }

  if (loadingAuth) return (
    <div className="admin-layout"><div style={{padding:40}}>Verificando permisos...</div></div>
  )

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="admin-content">
        <header className="admin-header admin-header-dark">
          <div className="admin-header-left">
            <button className="mobile-menu-btn" aria-label="Abrir menú" onClick={() => setMobileMenuOpen(true)}>
              <FiMenu />
            </button>
          </div>

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
