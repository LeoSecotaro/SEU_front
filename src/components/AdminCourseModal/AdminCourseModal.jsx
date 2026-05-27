import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminCourseModal.css';
import { fetchAdminOptions, createAdminCourse } from '../../api/admin'

export default function AdminCourseModal({ onClose, onCourseCreated }) {
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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [modes, setModes] = useState([]);
  const [days, setDays] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const parseList = (json) => {
      if (!json) return [];
      if (Array.isArray(json)) return json;
      // common envelope shapes
      if (Array.isArray(json.data)) return json.data;
      if (Array.isArray(json.labels)) return json.labels;
      if (Array.isArray(json.modes)) return json.modes;
      if (Array.isArray(json.days)) return json.days;
      // fallback to values if the object is a map
      return Object.values(json).flat().filter(Boolean);
    };

    const normalizeIds = (list) => list.map(item => ({ ...item, id: Number(item.id) }));

    const fetchOptions = async () => {
      try {
        const { modes: m, days: d, labels: l } = await fetchAdminOptions()
        setModes(normalizeIds(parseList(m)))
        setDays(normalizeIds(parseList(d)))
        setLabels(normalizeIds(parseList(l)))
      } catch (error) {
        console.error('Error fetching form options:', error)
        setModes([])
        setDays([])
        setLabels([])
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' && name !== 'price_is_monthly' ? prev[name] : (type === 'checkbox' ? checked : value)
    }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  // When toggling day checkboxes keep day_ids and course_days_attributes in sync
  const handleArrayChange = (e, field) => {
    const raw = e.target.value;
    const value = Number.isNaN(Number(raw)) ? null : Number(raw);
    if (value === null) return;

    setFormData(prev => {
      const current = prev[field] || [];
      const isPresent = current.includes(value);
      let next = {};

      if (isPresent) {
        // remove
        next[field] = current.filter(id => id !== value);
        if (field === 'day_ids') {
          next.course_days_attributes = (prev.course_days_attributes || []).filter(d => Number(d.day_id) !== value);
        }
      } else {
        // add
        next[field] = [...current, value];
        if (field === 'day_ids') {
          // add a default time entry for this day
          const defaultEntry = { day_id: value, start_time: '', end_time: '' };
          next.course_days_attributes = [...(prev.course_days_attributes || []), defaultEntry];
        }
      }

      return { ...prev, ...next };
    });
  };

  const handleDayTimeChange = (dayId, field, value) => {
    setFormData(prev => {
      const list = (prev.course_days_attributes || []).map(d => {
        if (Number(d.day_id) === Number(dayId)) {
          return { ...d, [field]: value };
        }
        return d;
      });
      return { ...prev, course_days_attributes: list };
    });
  };

  const handleAddTopic = () => {
    setFormData(prev => ({
      ...prev,
      course_topics_attributes: [
        ...prev.course_topics_attributes,
        { title: '', content: '' }
      ]
    }));
  };

  const handleRemoveTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      course_topics_attributes: prev.course_topics_attributes.filter((_, i) => i !== index)
    }));
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...formData.course_topics_attributes];
    newTopics[index][field] = value;
    setFormData(prev => ({ ...prev, course_topics_attributes: newTopics }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate required nested attributes before sending to backend
    const labelsCount = (formData.label_ids || []).filter(Boolean).length;
    const courseDaysCount = (formData.course_days_attributes || []).filter(d => !(d && d._destroy)).length;
    if (labelsCount === 0) {
      toast.error('La entidad requiere al menos una etiqueta asignada.');
      return;
    }
    if (courseDaysCount === 0) {
      toast.error('La entidad requiere al menos un horario/día asignado.');
      return;
    }
    setSubmitting(true);

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
    };

    try {
      try {
        const created = await createAdminCourse(payload.course, imageFile)
        onCourseCreated(created)
        onClose()
      } catch (err) {
        console.error('Submission error:', err)
        const errorMessage = translateBackendErrors(err)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error de red al crear el curso');
    } finally {
      setSubmitting(false);
    }
  };

  // helper to translate known backend validation messages to Spanish
  const translateBackendErrors = (errData) => {
    if (!errData) return 'Error desconocido';
    const mapMessage = (msg) => {
      if (!msg) return '';
      // exact or partial matches
      if (typeof msg === 'string') {
        if (msg.match(/Course days start time/i)) return 'El horario del día requiere hora de inicio.';
        if (msg.match(/Course days end time/i)) return 'El horario del día requiere hora de fin.';
        // generic blank messages
        if (msg.match(/can't be blank/i)) return msg.replace(/can't be blank/i, 'no puede estar vacío');
        return msg;
      }
      return String(msg);
    };

    if (errData.errors) {
      if (Array.isArray(errData.errors)) {
        return errData.errors.map(mapMessage).filter(Boolean).join('; ');
      }
      if (typeof errData.errors === 'object') {
        return Object.entries(errData.errors)
          .map(([field, messages]) => {
            const msgs = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgs.map(mapMessage).join(', ')}`;
          })
          .join('; ');
      }
      return mapMessage(errData.errors);
    }

    // fallback
    if (errData.error) return mapMessage(errData.error);
    return JSON.stringify(errData);
  };

  if (loadingOptions) return (
    <div className="modal-overlay"><div className="modal-content admin-course-modal"><div className="modal-body">Cargando...</div></div></div>
  )

  return (
    <div className="modal-overlay">
      <div className="modal-content admin-course-modal">
        <div className="modal-header">
          <h2>Crear Curso</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        {loadingOptions ? (
          <div className="modal-body"><p>Cargando opciones...</p></div>
        ) : (
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
                    <button type="button" className="btn-secondary-sm" onClick={handleAddTopic}>
                      <FiPlus /> Agregar Tema
                    </button>
                  </div>

                  {formData.course_topics_attributes.length === 0 && (
                    <p className="no-topics">No se han agregado temas aún.</p>
                  )}

                  <div className="topics-list">
                    {formData.course_topics_attributes.map((topic, index) => (
                      <div key={index} className="topic-card">
                        <div className="topic-header-row">
                          <h4>Tema {index + 1}</h4>
                          <button type="button" className="btn-icon danger" onClick={() => handleRemoveTopic(index)}>
                            <FiTrash2 />
                          </button>
                        </div>
                        <input
                          placeholder="Título del tema"
                          value={topic.title}
                          onChange={e => handleTopicChange(index, 'title', e.target.value)}
                          className="topic-input"
                        />
                        <textarea
                          rows="2"
                          placeholder="Contenido del tema (opcional)"
                          value={topic.content}
                          onChange={e => handleTopicChange(index, 'content', e.target.value)}
                          className="topic-textarea"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar with days/labels */}
              <div className="selection-lists">
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

                <div className="checkbox-list-container">
                  <label>Días de cursada</label>
                  <div className="checkbox-list">
                    {days.map(d => (
                      <label key={d.id} className="inline-check">
                        <input type="checkbox" value={d.id} checked={formData.day_ids.includes(Number(d.id))} onChange={e => handleArrayChange(e, 'day_ids')} />
                        <span>{d.name || d.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="checkbox-list-container">
                  <label>Etiquetas / Categorías</label>
                  <div className="checkbox-list">
                    {labels.map(l => (
                      <label key={l.id} className="inline-check">
                        <input type="checkbox" value={l.id} checked={formData.label_ids.includes(Number(l.id))} onChange={e => handleArrayChange(e, 'label_ids')} />
                        <span>{l.name || l.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Per-day time selectors shown under the selection lists for better discoverability */}
                <div className="day-time-list sidebar-day-times">
                  {days.filter(d => formData.day_ids.includes(Number(d.id))).map(d => {
                    const entry = (formData.course_days_attributes || []).find(cd => Number(cd.day_id) === Number(d.id)) || { day_id: d.id, start_time: '', end_time: '' };
                    return (
                      <div className="day-time-card" key={d.id}>
                        <div className="day-time-label">{d.name || d.title}</div>
                        <div className="day-time-inputs">
                          <label>
                            Inicio
                            <input type="time" value={entry.start_time || ''} onChange={e => handleDayTimeChange(d.id, 'start_time', e.target.value)} />
                          </label>
                          <label>
                            Fin
                            <input type="time" value={entry.end_time || ''} onChange={e => handleDayTimeChange(d.id, 'end_time', e.target.value)} />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
