import React, { useState, useEffect } from 'react'
import { updateAdminUser, getAdminUser, updateCurrentUser } from '../../api/users'
import '../Modal/Modal.css'
import Modal from '../Modal/Modal'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export default function AdminUserEditModal({ userId, onClose, onUpdated, currentUserIdProp, currentUserEmailProp, showPasswordFields }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentUserEmail, setCurrentUserEmail] = useState(null)

  useEffect(() => {
    // if parent passed current user info, use it immediately to avoid timing issues
    if (currentUserIdProp) setCurrentUserId(String(currentUserIdProp))
    if (currentUserEmailProp) setCurrentUserEmail(String(currentUserEmailProp))

    let mounted = true
    getAdminUser(userId).then(data => {
      if (!mounted) return
      setEmail(data.email || '')
      setLoading(false)
    }).catch(err => { console.error('fetch user', err); setLoading(false) })

    // only check canonical route if needed
    const tryFetchCurrent = async () => {
      const ep = '/api/v1/current_user'
      try {
        const res = await fetch(ep, { credentials: 'include', headers: { Accept: 'application/json' } })
        if (!res || !res.ok) return
        const body = await res.json()
        let id = null
        let em = null
        if (body) {
          if (body.id) { id = body.id; em = body.email }
          else if (body.user) { id = body.user.id; em = body.user.email }
          else if (body.current_user) { id = body.current_user.id; em = body.current_user.email }
        }
        if (mounted && (id || em)) {
          if (id) setCurrentUserId(String(id))
          if (em) setCurrentUserEmail(String(em))
        }
      } catch (e) {
        // ignore
      }
    }

    if (!currentUserIdProp && !currentUserEmailProp) tryFetchCurrent()

    return () => { mounted = false }
  }, [userId])

  // If AuthContext provides currentUser use it to determine ownership
  const auth = useAuth()
  useEffect(() => {
    if (auth && auth.currentUser) {
      const u = auth.currentUser
      if (u.id) setCurrentUserId(String(u.id))
      if (u.email) setCurrentUserEmail(String(u.email))
    }
  }, [auth])

  // Prop updates from parent should override context when available
  useEffect(() => {
    if (currentUserIdProp) setCurrentUserId(String(currentUserIdProp))
    if (currentUserEmailProp) setCurrentUserEmail(String(currentUserEmailProp))
  }, [currentUserIdProp, currentUserEmailProp])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      // If password was provided, ensure confirmation matches; otherwise omit password fields to avoid sending empty strings
      if (password && password.length > 0 && password !== passwordConfirmation) {
        toast.error('La confirmación de contraseña no coincide')
        setLoading(false)
        return
      }

      // Determine ownership
      const authUserId = auth && auth.currentUser && auth.currentUser.id ? String(auth.currentUser.id) : null
      const computedIsOwn = (currentUserEmail && email)
        ? String(currentUserEmail).toLowerCase() === String(email).toLowerCase()
        : (authUserId ? authUserId === String(userId) : (currentUserId ? String(currentUserId) === String(userId) : false))
      const isOwnAccount = typeof showPasswordFields === 'boolean' ? !!showPasswordFields : computedIsOwn

      // If changing own password, use canonical endpoint which requires current_password
      if (isOwnAccount && password && password.length > 0) {
        if (!currentPassword || currentPassword.length === 0) {
          toast.error('Debes ingresar tu contraseña actual para cambiarla')
          setLoading(false)
          return
        }

        const payload = {
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation || ''
        }

        await updateCurrentUser(payload)

        // Refresh auth context if function provided
        if (auth && typeof auth.refreshCurrentUser === 'function') {
          try { await auth.refreshCurrentUser() } catch (e) { /* ignore */ }
        }

        toast.success('Contraseña actualizada')
        onUpdated && onUpdated()
        return
      }

      // Otherwise proceed to admin update endpoint
      const payload = { email }
      if (password && password.length > 0) {
        payload.password = password
        payload.password_confirmation = passwordConfirmation
      }

      await updateAdminUser(userId, payload)
      toast.success('Usuario actualizado')
      onUpdated && onUpdated()
    } catch (err) {
      console.error('update user error', err)
      const msg = err && err.payload ? (err.payload.error || err.payload.message || JSON.stringify(err.payload)) : 'Error actualizando usuario'
      toast.error(msg)
    } finally {
      setLoading(false)
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    }
  }

  // Prefer parent's explicit boolean if provided to avoid async timing issues. Otherwise fall back to email/id checks.
  const authUserId = auth && auth.currentUser && auth.currentUser.id ? String(auth.currentUser.id) : null
  const computedIsOwn = (currentUserEmail && email)
    ? String(currentUserEmail).toLowerCase() === String(email).toLowerCase()
    : (authUserId ? authUserId === String(userId) : (currentUserId ? String(currentUserId) === String(userId) : false))

  const isOwnAccount = typeof showPasswordFields === 'boolean' ? !!showPasswordFields : computedIsOwn

  return (
    <Modal title="Editar Usuario" onClose={onClose} footer={<>
      <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
      <button onClick={handleUpdate} className="btn btn-primary" disabled={loading}>Actualizar</button>
    </>}>
      {loading ? <p>Cargando...</p> : (
        <>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          {isOwnAccount && (
            <>
              <div className="field">
                <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
                <div className="input-with-toggle">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className="pwd-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirmar Contraseña</label>
                <div className="input-with-toggle">
                  <input type={showPasswordConfirmation ? 'text' : 'password'} value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
                  <button type="button" className="pwd-toggle" aria-label={showPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPasswordConfirmation(s => !s)}>
                    {showPasswordConfirmation ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Contraseña Actual (requerida para cambiar)</label>
                <div className="input-with-toggle">
                  <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                  <button type="button" className="pwd-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </>
          )}

          {!isOwnAccount && (
            <div className="muted" style={{marginTop:12}}>No puede cambiar la contraseña de otros usuarios desde aquí.</div>
          )}
        </>
      )}
    </Modal>
  )
}
