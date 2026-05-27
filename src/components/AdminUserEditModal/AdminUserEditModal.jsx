import React, { useState, useEffect } from 'react'
import { updateAdminUser, getAdminUser } from '../../api/users'
import '../Modal/Modal.css'
import Modal from '../Modal/Modal'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function AdminUserEditModal({ userId, onClose, onUpdated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  useEffect(() => {
    let mounted = true
    getAdminUser(userId).then(data => {
      if (!mounted) return
      setEmail(data.email || '')
      setLoading(false)
    }).catch(err => { console.error('fetch user', err); setLoading(false) })
    return () => { mounted = false }
  }, [userId])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateAdminUser(userId, { email, password, password_confirmation: passwordConfirmation })
      onUpdated && onUpdated()
    } catch (err) {
      console.error('update user error', err)
      alert('Error actualizando usuario')
    } finally {
      setLoading(false)
    }
  }

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
        </>
      )}
    </Modal>
  )
}
