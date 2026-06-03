import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import './Login.css'
import { signIn } from '../../api/session'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const toggleShowPassword = () => setShowPassword((v) => !v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signIn(email, password)

      if (!res.ok) {
        // intentar leer mensaje de error del JSON, si existe
        let data = null
        try {
          data = await res.json()
        } catch (err) {
          // noop
        }
        const msg = (data && (data.error || data.message || data.errors)) || `Error ${res.status}`
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
        setLoading(false)
        return
      }

      // login ok
      // en Rails puede devolver datos del usuario.
      setLoading(false)
      navigate('/admin')
    } catch (err) {
      setError('Error de red. Intentá nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="brand-icon">
          <FiGraduationCap />
        </div>
        <h1>UTN</h1>
        <p>Extensión Universitaria · Administración</p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="header-icon">
            <FiLock />
          </div>
          <div className="header-text">
            <h2>Acceso Administrativo</h2>
            <p>Ingresá tus credenciales para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error" role="alert">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@utn.edu.ar"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleShowPassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

function FiGraduationCap({ className }) {
 
  return (
    <svg 
      className={className} 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  );
}
