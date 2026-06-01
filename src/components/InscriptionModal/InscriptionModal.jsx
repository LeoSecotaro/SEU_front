import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import './InscriptionModal.css'
import { createInscription } from '../../api/inscriptions'

export default function InscriptionModal({ isOpen, onClose, course }) {
  if (!isOpen) return null
  const [form, setForm] = useState({
    nombreAspirante: '', apellidoAspirante: '', dni: '', fechaNacimiento: '', mail: '', numeroCelular: '', nombreCurso: course && (course.title || course.name) || '', descripcionCurso: course && course.description || '', fhInicioCurso: course && course.start_date || '', quota: course && (course.quota ?? course.capacity ?? '') || '', precioCurso: course && (course.price ?? '') || ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    // prefill course-related fields when modal opens
    setForm(prev => ({
      ...prev,
      nombreCurso: course && (course.title || course.name) || prev.nombreCurso,
      descripcionCurso: course && course.description || prev.descripcionCurso,
      fhInicioCurso: course && course.start_date || prev.fhInicioCurso,
      quota: (course && (course.quota ?? course.capacity)) ?? prev.quota,
      precioCurso: (course && (course.price ?? '')) ?? prev.precioCurso
    }))
  }, [isOpen, course])

  const validateField = (k, v) => {
    const val = String(v || '').trim()
    if (['nombreAspirante', 'apellidoAspirante', 'dni', 'fechaNacimiento', 'mail', 'numeroCelular'].includes(k)) {
      if (!val) return 'Este texto no puede estar vacio'
    }

    if (k === 'dni') {
      if (!/^\d{6,9}$/.test(val)) return 'Formato incorrecto'
    }

    if (k === 'mail') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Formato incorrecto'
    }

    if (k === 'numeroCelular') {
      // accept format: 2619999999 or 261 9999999 (3 digits, optional space, 7-8 digits)
      if (!/^\d{3}\s?\d{7,8}$/.test(val)) return 'Formato incorrecto'
    }

    return ''
  }

  const handleChange = (k) => (e) => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [k]: value }))
    // validate on change
    setErrors(prev => ({ ...prev, [k]: validateField(k, value) }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // validate all
      const toCheck = ['nombreAspirante', 'apellidoAspirante', 'dni', 'fechaNacimiento', 'mail', 'numeroCelular']
      const newErrors = {}
      toCheck.forEach(k => {
        const err = validateField(k, form[k])
        if (err) newErrors[k] = err
      })
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) {
        setLoading(false)
        return
      }
       // convert numeric fields when possible
       const payload = { ...form }
      if (payload.quota !== '') {
        const q = Number(String(payload.quota).replace(/[^0-9.-]/g, ''))
        payload.quota = Number.isNaN(q) ? payload.quota : q
      }
      if (payload.precioCurso !== '') {
        const p = Number(String(payload.precioCurso).replace(/[^0-9.-]/g, ''))
        payload.precioCurso = Number.isNaN(p) ? payload.precioCurso : p
      }
      await createInscription(payload)
      alert('Inscripción enviada')
      onClose && onClose()
    } catch (err) {
      console.error('inscription error', err)
      alert('Error enviando inscripción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Inscribirme</h3>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar"> <FiX /> </button>
        </div>
        <div className="modal-body">
          <label>Nombre</label>
          <input value={form.nombreAspirante} onChange={handleChange('nombreAspirante')} />
          <label>Apellido</label>
          <input value={form.apellidoAspirante} onChange={handleChange('apellidoAspirante')} />
          <label>DNI</label>
          <input value={form.dni} onChange={handleChange('dni')} />
          <label>Fecha Nacimiento</label>
          <input type="date" value={form.fechaNacimiento} onChange={handleChange('fechaNacimiento')} />
          <label>Mail</label>
          <input value={form.mail} onChange={handleChange('mail')} />
          {errors.mail && <div className="field-error">{errors.mail}</div>}

          <label>Numero Celular (ej: 261 9999999)</label>
          <input value={form.numeroCelular} onChange={handleChange('numeroCelular')} />
          {errors.numeroCelular && <div className="field-error">{errors.numeroCelular}</div>}
          {/* Course fields are sent but not shown in the modal per requirements */}
        </div>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
        </div>
      </div>
    </div>
  )
}
