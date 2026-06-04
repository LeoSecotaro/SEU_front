import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSettings } from 'react-icons/fi'
import './AdminCourses.css'
import AdminCourseCard from '../../components/AdminCourseCard/AdminCourseCard'
import AdminCourseModal from '../../components/AdminCourseModal/AdminCourseModal'
import AdminCourseEditModal from '../../components/AdminCourseEditModal/AdminCourseEditModal'
import AdminCourseDeleteModal from '../../components/AdminCourseDeleteModal/AdminCourseDeleteModal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { apiGet } from '../../api/client'
import SkeletonCard from '../../components/Skeletons/SkeletonCard'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [deletingCourse, setDeletingCourse] = useState(null)

  const fetchCourses = async () => {
    try {
      // Use proxied API endpoint only
      const data = await apiGet('/admin/courses')

      // Normalize backend shape to the UI shape
      const normalize = (c) => {
        // helper to pick first human-friendly label from different shapes
        const pickLabel = (v) => {
          if (v === undefined || v === null) return ''
          if (Array.isArray(v)) {
            const first = v[0]
            if (!first) return ''
            if (typeof first === 'string') return first
            return first.name || first.title || ''
          }
          if (typeof v === 'object') return v.name || v.title || ''
          return String(v)
        }

        // map mode_id to human label when explicit modality name is not provided
        const modeMap = {
          1: 'Presencial',
          2: 'Virtual',
          3: 'Mixto'
        }

        const title = pickLabel(c.name) || pickLabel(c.title) || pickLabel(c.course_title) || 'Sin título'

        const priceNum = c.price !== undefined && c.price !== null ? parseFloat(c.price) : (c.price_cents ? c.price_cents / 100 : null)

        let startLabel = ''
        if (c.start_date) {
          try {
            const d = new Date(c.start_date)
            // Ej: may. 2026 en español (es-AR)
            startLabel = new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric' }).format(d)
          } catch (e) {
            startLabel = c.start_date
          }
        }

        const modalityFromFields = pickLabel(c.modality) || pickLabel(c.modality_name) || pickLabel(c.mode_name)
        const modality = modalityFromFields || (c.mode_id ? modeMap[c.mode_id] : '') || ''

        // prefer labels array first (primer label)
        const category = pickLabel(c.labels) || pickLabel(c.category) || pickLabel(c.category_name) || pickLabel(c.area) || ''

        // prefer explicit duration, otherwise use hourly_load and present in Spanish
        const duration = c.duration || (c.hourly_load ? `${c.hourly_load} horas` : '') || ''

        // canonical quota fields: expose both quota (max) and quota_minimum (min)
        const quota = c.quota ?? c.quota_maximum ?? c.capacity ?? c.capacity_max ?? c.quota_max ?? null
        const quota_minimum = c.quota_minimum ?? c.min_quota ?? c.quota_min ?? null

        const description = c.description || c.short_description || ''
        // truncate description for admin list display to keep cards compact
        const maxDesc = 320
        const shortDescription = description && description.length > maxDesc ? description.slice(0, maxDesc).trim() + '...' : description

        const topics = Array.isArray(c.course_topics) ? c.course_topics : (Array.isArray(c.topics) ? c.topics : [])

        return {
          id: c.id,
          title,
          price: priceNum,
          duration,
          // provide canonical fields used by AdminCourseCard
          quota,
          quota_minimum,
          start: startLabel,
          category,
          modality,
          description: shortDescription,
          topics,
          raw: c
        }
      }

      const normalized = Array.isArray(data) ? data.map(normalize) : []
      setCourses(normalized)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCourseCreated = (newCourse) => {
    // show toast and refresh the list after a successful creation
    toast.success('Curso creado correctamente')
    fetchCourses()
  }

  const handleCourseUpdated = () => {
    // show toast and refresh after update
    toast.success('Curso actualizado correctamente')
    setEditingCourseId(null)
    fetchCourses()
  }

  const handleCourseDeleted = () => {
    toast.success('Curso eliminado correctamente')
    setDeletingCourse(null)
    fetchCourses()
  }

  return (
    <div className="admin-courses">
      <div className="page-header">
        <div className="header-title">
          <FiSettings className="page-icon" />
          <div>
            <h1>Cursos</h1>
            <p>{courses.length} cursos en el catálogo</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Nuevo Curso
        </button>
      </div>

      {loading ? (
        <div className="courses-list">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="courses-list">
          {courses.map(course => (
            <AdminCourseCard key={course.id} course={course} onEdit={() => setEditingCourseId(course.raw && course.raw.id ? course.raw.id : course.id)} onDelete={() => setDeletingCourse({ id: course.raw && course.raw.id ? course.raw.id : course.id, title: course.title })} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AdminCourseModal 
          onClose={() => setIsModalOpen(false)} 
          onCourseCreated={handleCourseCreated} 
        />
      )}

      {editingCourseId && (
        <AdminCourseEditModal
          courseId={editingCourseId}
          onClose={() => setEditingCourseId(null)}
          onCourseUpdated={handleCourseUpdated}
        />
      )}

      {deletingCourse && (
        <AdminCourseDeleteModal
          courseId={deletingCourse.id}
          courseTitle={deletingCourse.title}
          onClose={() => setDeletingCourse(null)}
          onDeleted={handleCourseDeleted}
        />
      )}

    </div>
  )
}
