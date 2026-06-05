import React, { useState } from 'react'
import '../Modal/Modal.css'
import Modal from '../Modal/Modal'
import { createAdminUser } from '../../api/users'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { formatApiError } from '../../utils/errors'

export default function AdminUserModal({ onClose, onCreated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleCreate = async () => {
    if (password !== passwordConfirmation) {
      setErrorMsg('Las contraseñas no coinciden')
      toast.error('Las contraseñas no coinciden')
      return
    }

    setErrorMsg('')
    setLoading(true)
    try {
      await createAdminUser({ email, password, password_confirmation: passwordConfirmation })
      onCreated && onCreated()
    } catch (err) {
      console.error('create user error', err)
      const msg = formatApiError(err, 'Error creando usuario')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Nuevo Usuario" onClose={onClose} footer={<>
      <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
      <button onClick={handleCreate} className="btn btn-primary" disabled={loading}>Crear</button>
    </>}>
      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div className="field">
        <label>Contraseña</label>
        <div className="input-with-toggle">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Ingrese contraseña" 
            value={password} 
            onChange={e => {
              setPassword(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
            className={errorMsg ? 'input-error' : ''}
          />
          <button type="button" className="pwd-toggle" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(s => !s)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div className="field">
        <label>Confirmar Contraseña</label>
        <div className="input-with-toggle">
          <input 
            type={showPasswordConfirmation ? 'text' : 'password'} 
            placeholder="Reingrese contraseña" 
            value={passwordConfirmation} 
            onChange={e => {
              setPasswordConfirmation(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
            className={errorMsg ? 'input-error' : ''}
          />
          <button type="button" className="pwd-toggle" aria-label={showPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPasswordConfirmation(s => !s)}>
            {showPasswordConfirmation ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errorMsg && <span className="error-message">{errorMsg}</span>}
      </div>

    </Modal>
  )
}

