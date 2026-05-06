import { useEffect, useState, useCallback } from 'react'
import './courses.css'
import { FaLayerGroup } from 'react-icons/fa'
import CourseCard from '../CourseCard/CourseCard'

export default function CoursesList() {
  const [courses, setCourses] = useState([])
  const [labels, setLabels] = useState([])
  const [selectedLabel, setSelectedLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLabels, setLoadingLabels] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async (labelId = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ per_page: 9 })
      if (labelId) params.set('label_id', labelId)
      const res = await fetch(`/api/v1/courses?${params.toString()}`)
      if (!res.ok) throw new Error('Error fetching courses')
      const json = await res.json()
      setCourses(json.data || json || [])
    } catch (e) {
      // fallback: try /api/courses (no v1)
      try {
        const params = new URLSearchParams({ per_page: 9 })
        if (labelId) params.set('label_id', labelId)
        const res2 = await fetch(`/api/courses?${params.toString()}`)
        if (!res2.ok) throw e
        const j2 = await res2.json()
        setCourses(j2.data || j2 || [])
      } catch (err) {
        setError(err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLabels = useCallback(async () => {
    setLoadingLabels(true)
    try {
      const res = await fetch('/api/v1/labels')
      if (res.ok) {
        const json = await res.json()
        setLabels(json.data || json || [])
        return
      }
      // fallback
      const res2 = await fetch('/api/labels')
      if (res2.ok) {
        const j2 = await res2.json()
        setLabels(j2.data || j2 || [])
      }
    } catch (e) {
      // ignore labels error, leave empty
    } finally {
      setLoadingLabels(false)
    }
  }, [])

  useEffect(() => {
    fetchLabels()
    fetchCourses()
  }, [fetchCourses, fetchLabels])

  useEffect(() => {
    // refetch when label changes
    fetchCourses(selectedLabel)
  }, [selectedLabel, fetchCourses])

  if (loading) return <div className="courses-grid">Cargando...</div>
  if (error) return <div className="courses-grid">Error al cargar cursos</div>

  return (
    <section id="cursos" className="courses-section">
      <div className="courses-inner">
        <header className="courses-header">
          <div className="header-left">
            <div className="catalog-icon" aria-hidden>
              <FaLayerGroup />
            </div>
            <div>
              <h2>Catálogo de Cursos</h2>
              <p className="subtitle">Encuentra el programa ideal para tu desarrollo profesional.</p>
            </div>
          </div>

          <div className="header-right">
            <div className="filters" role="tablist" aria-label="Filtros de cursos">
              <button
                className={`filter-pill ${selectedLabel === '' ? 'active' : ''}`}
                onClick={() => setSelectedLabel('')}
                aria-pressed={selectedLabel === ''}
              >
                Todos
              </button>

              {labels.map((l) => (
                <button
                  key={l.id || l.name}
                  className={`filter-pill ${String(selectedLabel) === String(l.id || l.name) ? 'active' : ''}`}
                  onClick={() => setSelectedLabel(l.id || l.name)}
                  aria-pressed={String(selectedLabel) === String(l.id || l.name)}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="courses-grid">
          {courses.length === 0 && <div>No hay cursos</div>}
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
