import React, { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import '../AdminCourseModal/AdminCourseModal.css'

export default function AdminCourseEditModal({ courseId, onClose, onCourseUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goals: '',
    start_date: '',
    mode_id: '',
    quota: '',
    email: '',
    phone_number: '',
    address: '',
    duration: '',
    hourly_load: '',
    day_ids: [],
    label_ids: [],
    price: '',
    price_is_monthly: false,
    course_topics_attributes: [],
    course_days_attributes: [],
    image_url: ''
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [modes, setModes] = useState([])
  const [days, setDays] = useState([])
  const [labels, setLabels] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const parseList = (json) => {
      if (!json) return []
      if (Array.isArray(json)) return json
      if (Array.isArray(json.data)) return json.data
      if (Array.isArray(json.labels)) return json.labels
      if (Array.isArray(json.modes)) return json.modes
      if (Array.isArray(json.days)) return json.days
      return Object.values(json).flat().filter(Boolean)
    }
    const normalizeIds = (list) => list.map(item => ({ ...item, id: Number(item.id) }))

    const fetchOptions = async () => {
      try {
        const [modesRes, daysRes, labelsRes] = await Promise.all([
          fetch('/api/admin/modes'),
          fetch('/api/admin/days'),
          fetch('/api/admin/labels')
        ])
        if (modesRes.ok) setModes(normalizeIds(parseList(await modesRes.json())))
        if (daysRes.ok) setDays(normalizeIds(parseList(await daysRes.json())))
        if (labelsRes.ok) setLabels(normalizeIds(parseList(await labelsRes.json())))
      } catch (err) {
        console.error('Error fetching options', err)
        setModes([])
        setDays([])
        setLabels([])
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    if (!courseId) return
    const isoToTime = (iso) => {
      if (!iso) return ''
      try {
        const d = new Date(iso)
        // use UTC to avoid local timezone shifts (backend stores times often as Z/UTC)
        const hh = String(d.getUTCHours()).padStart(2, '0')
        const mm = String(d.getUTCMinutes()).padStart(2, '0')
        return `${hh}:${mm}`
      } catch (e) {
        // if it's already HH:MM
        if (typeof iso === 'string' && iso.length >= 5 && iso[2] === ':') return iso.slice(0,5)
        return ''
      }
    }

    const fetchCourse = async () => {
      setLoadingCourse(true)
      try {
        // try proxied admin route first
        let res = await fetch(`/api/admin/courses/${courseId}`)
        if (res.status === 404) {
          res = await fetch(`http://localhost:3000/admin/courses/${courseId}`)
        }
        if (!res.ok) throw new Error('Error fetching course')
        const c = await res.json()
        // map backend shape to formData fields
        const dayIds = Array.isArray(c.course_days) && c.course_days.length
          ? c.course_days.map(cd => Number(cd.day_id))
          : (Array.isArray(c.days) ? c.days.map(d => Number(d.id || d)) : [])

        const courseDaysAttrs = Array.isArray(c.course_days) ? c.course_days.map(cd => ({
          id: cd.id !== undefined ? Number(cd.id) : undefined,
          day_id: Number(cd.day_id),
          start_time: isoToTime(cd.start_time || cd.start),
          end_time: isoToTime(cd.end_time || cd.end)
        })) : []

        const labelIds = Array.isArray(c.labels) ? c.labels.map(l => Number(l.id)) : (Array.isArray(c.label_ids) ? c.label_ids.map(Number) : [])

        const topics = Array.isArray(c.course_topics) ? c.course_topics.map(t => ({ id: t.id !== undefined ? Number(t.id) : undefined, title: t.title || '', content: t.content || '' })) : (Array.isArray(c.topics) ? c.topics.map(t => ({ id: t.id !== undefined ? Number(t.id) : undefined, title: t.title || '', content: t.content || '' })) : [])

        setFormData({
          name: c.name || c.title || '',
          description: c.description || '',
          goals: c.goals || '',
          start_date: c.start_date || '',
          mode_id: c.mode_id || (c.mode && c.mode.id) || '',
          quota: c.quota ?? c.capacity ?? '',
          email: c.email || '',
          phone_number: c.phone_number || '',
          address: c.address || c.location || '',
          duration: c.duration || '',
          hourly_load: c.hourly_load || c.hours || '',
          day_ids: dayIds,
          label_ids: labelIds,
          price: c.price != null ? String(c.price) : '',
          price_is_monthly: !!c.price_is_monthly,
          course_topics_attributes: topics,
          course_days_attributes: courseDaysAttrs,
          image_url: c.image_url || ''
        })
        if (c.image_url) setImagePreview(c.image_url)
      } catch (err) {
        console.error('Error loading course for edit', err)
      } finally {
        setLoadingCourse(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      setImageFile(null)
      setImagePreview('')
      return
    }
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const handleArrayChange = (e, field) => {
    const raw = e.target.value
    const value = Number.isNaN(Number(raw)) ? null : Number(raw)
    if (value === null) return
    setFormData(prev => {
      const current = prev[field] || []
      const isPresent = current.includes(value)
      let next = {}
      if (isPresent) {
        next[field] = current.filter(id => id !== value)
        if (field === 'day_ids') {
          // For existing course_days that have an id, mark them for destruction so Rails updates instead of trying to re-create
          const existing = prev.course_days_attributes || []
          const updated = existing.map(d => {
            if (Number(d.day_id) === value) {
              if (d.id) return { ...d, _destroy: true }
              return null // remove new (unsaved) entry
            }
            return d
          }).filter(Boolean)
          next.course_days_attributes = updated
        }
      } else {
        next[field] = [...current, value]
        if (field === 'day_ids') {
          const defaultEntry = { day_id: value, start_time: '', end_time: '' }
          next.course_days_attributes = [...(prev.course_days_attributes || []), defaultEntry]
        }
      }
      return { ...prev, ...next }
    })
  }

  const handleDayTimeChange = (dayId, field, value) => {
    setFormData(prev => {
      const list = (prev.course_days_attributes || []).map(d => {
        if (Number(d.day_id) === Number(dayId)) return { ...d, [field]: value }
        return d
      })
      return { ...prev, course_days_attributes: list }
    })
  }

  const handleAddTopic = () => setFormData(prev => ({ ...prev, course_topics_attributes: [...prev.course_topics_attributes, { title: '', content: '' }] }))
  const handleRemoveTopic = (i) => {
    setFormData(prev => {
      const existing = prev.course_topics_attributes || []
      const topic = existing[i]
      if (topic && topic.id) {
        // mark for destruction so Rails will delete it on PATCH
        return { ...prev, course_topics_attributes: existing.map((t, idx) => idx === i ? { ...t, _destroy: true } : t) }
      }
      // remove unsaved topic entries
      return { ...prev, course_topics_attributes: existing.filter((_, idx) => idx !== i) }
    })
  }
  const handleTopicChange = (i, field, value) => {
    const newTopics = [...formData.course_topics_attributes]
    newTopics[i][field] = value
    setFormData(prev => ({ ...prev, course_topics_attributes: newTopics }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      course: {
        name: formData.name,
        description: formData.description,
        goals: formData.goals,
        start_date: formData.start_date || null,
        mode_id: formData.mode_id ? Number(formData.mode_id) : null,
        quota: formData.quota ? Number(formData.quota) : null,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        duration: formData.duration,
        hourly_load: formData.hourly_load ? Number(formData.hourly_load) : null,
        course_days_attributes: formData.course_days_attributes || [],
        label_ids: formData.label_ids || [],
        price: formData.price ? parseFloat(formData.price) : null,
        price_is_monthly: !!formData.price_is_monthly,
        course_topics_attributes: formData.course_topics_attributes || []
      }
    }

    try {
      let res
      if (imageFile) {
        const fd = new FormData()
        fd.append('course', JSON.stringify(payload.course))
        fd.append('image', imageFile)
        res = await fetch(`/api/admin/courses/${courseId}`, { method: 'PATCH', body: fd })
      } else {
        if (formData.image_url) payload.course.image_url = formData.image_url
        res = await fetch(`/api/admin/courses/${courseId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      if (res.ok) {
        const updated = await res.json()
        onCourseUpdated && onCourseUpdated(updated)
        onClose()
      } else {
        const err = await res.json()
        alert('Error al actualizar: ' + JSON.stringify(err))
      }
    } catch (err) {
      console.error('Update error', err)
      alert('Error de red al actualizar')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingOptions || loadingCourse) return (
    <div className="modal-overlay"><div className="modal-content admin-course-modal"><div className="modal-body">Cargando...</div></div></div>
  )

  return (
    <div className="modal-overlay">
      <div className="modal-content admin-course-modal">
        <div className="modal-header">
          <h2>Editar Curso</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-column-main">
              <div className="form-group full-width">
                <label>Nombre del curso</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange}></textarea>
              </div>

              <div className="form-group full-width">
                <label>Objetivos (goals)</label>
                <textarea rows="2" name="goals" value={formData.goals} onChange={handleChange}></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de inicio</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Modalidad</label>
                  <select name="mode_id" value={formData.mode_id} onChange={handleChange}>
                    <option value="">Seleccione modalidad</option>
                    {modes.map(m => <option key={m.id} value={m.id}>{m.name || m.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cupo</label>
                  <input type="number" name="quota" value={formData.quota} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Precio</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', color: '#475569' }}>
                    <input type="checkbox" name="price_is_monthly" checked={!!formData.price_is_monthly} onChange={handleChange} />
                    <span>Precio mensual</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email de contacto</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Duración (texto)</label>
                  <input type="text" name="duration" placeholder="Ej: 40 horas" value={formData.duration} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Carga horaria (num)</label>
                  <input type="text" name="hourly_load" value={formData.hourly_load} onChange={handleChange} />
                </div>

                <div className="form-group">
                  {/* placeholder column to keep layout balanced */}
                  <label style={{ visibility: 'hidden' }}>placeholder</label>
                  <div />
                </div>
              </div>

              {/* Temario Dinámico */}
              <div className="form-group full-width topics-section">
                <div className="topics-header">
                  <h3>Temario del curso</h3>
                  <button type="button" className="btn-secondary-sm" onClick={handleAddTopic}><FiPlus /> Agregar Tema</button>
                </div>

                {formData.course_topics_attributes.length === 0 && (<p className="no-topics">No se han agregado temas aún.</p>)}

                <div className="topics-list">
                  {formData.course_topics_attributes.map((topic, index) => {
                    if (topic && topic._destroy) return null // hide deleted ones but keep them in the payload
                    return (
                      <div key={index} className="topic-card">
                        <div className="topic-header-row">
                          <h4>Tema {index + 1}</h4>
                          <button type="button" className="btn-icon danger" onClick={() => handleRemoveTopic(index)}><FiTrash2 /></button>
                        </div>
                        <input placeholder="Título del tema" value={topic.title} onChange={e => handleTopicChange(index, 'title', e.target.value)} className="topic-input" />
                        <textarea rows="2" placeholder="Contenido del tema (opcional)" value={topic.content} onChange={e => handleTopicChange(index, 'content', e.target.value)} className="topic-textarea" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="form-column-sidebar">
              <div className="form-group full-width">
                <label>Imagen del curso</label>
                <div className="image-upload">
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Vista previa" />
                      <button type="button" className="btn-icon" onClick={() => { setImageFile(null); setImagePreview('') }}><FiX /></button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Días de la semana</label>
                <div className="checkbox-list">
                  {days.map(d => (
                    <label key={d.id} className="inline-check">
                      <input type="checkbox" value={d.id} checked={formData.day_ids.includes(Number(d.id))} onChange={e => handleArrayChange(e, 'day_ids')} />
                      <span>{d.name || d.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Etiquetas</label>
                <div className="checkbox-list">
                  {labels.map(l => (
                    <label key={l.id} className="inline-check">
                      <input type="checkbox" value={l.id} checked={formData.label_ids.includes(Number(l.id))} onChange={e => handleArrayChange(e, 'label_ids')} />
                      <span>{l.name || l.title}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Per-day time selectors shown under the selection lists for better discoverability */}
            <div className="day-time-list sidebar-day-times">
              {days.filter(d => formData.day_ids.includes(Number(d.id))).map(d => {
                const entry = (formData.course_days_attributes || []).find(cd => Number(cd.day_id) === Number(d.id)) || { day_id: d.id, start_time: '', end_time: '' }
                return (
                  <div className="day-time-card" key={d.id}>
                    <div className="day-time-label">{d.name || d.title}</div>
                    <div className="day-time-inputs">
                      <label>Inicio<input type="time" value={entry.start_time || ''} onChange={e => handleDayTimeChange(d.id, 'start_time', e.target.value)} /></label>
                      <label>Fin<input type="time" value={entry.end_time || ''} onChange={e => handleDayTimeChange(d.id, 'end_time', e.target.value)} /></label>
                    </div>
                  </div>
                )
              })}
            </div>

          </div> {/* .form-grid */}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Guardando...' : 'Actualizar Curso'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
