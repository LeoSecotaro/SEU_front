import { useEffect, useState } from 'react'
import './courses.css'
import { FaLayerGroup } from 'react-icons/fa'
import CourseCard from '../CourseCard/CourseCard'
import { listCourses, listLabels } from '../../api/courses'

export default function CoursesList() {
  const [courses, setCourses] = useState([])
  const [labels, setLabels] = useState([])
  const [selectedLabel, setSelectedLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listLabels()
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.data || data || [])
        setLabels(arr)
      })
      .catch(e => console.error('Error cargando etiquetas', e))
  }, [])


  useEffect(() => {
    setLoading(true)
    setError(null)
    
    listCourses({ per_page: 9, label_ids: selectedLabel ? [selectedLabel] : undefined })
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.data || data || [])
        setCourses(arr)
      })
      .catch(e => {
        console.error('listCourses error', e)
        setError(e)
      })
      .finally(() => setLoading(false))
  }, [selectedLabel]) 

  const handleSelectLabel = (labelId) => {
    setSelectedLabel(labelId)
  }

  if (loading) return <div className="courses-grid">Cargando...</div>
  if (error) return <div className="courses-grid">Error al cargar cursos</div>

  return (
    <section id="cursos" className="courses-section">
      <div className="courses-inner">
        <header className="courses-header">
          <div className="header-left">
            <div className="catalog-icon" aria-hidden="true">
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
                onClick={() => handleSelectLabel('')}
                aria-pressed={selectedLabel === ''}
              >
                Todos
              </button>

              {labels.map((l) => (
                <button
                  key={l.id || l.name}
                  className={`filter-pill ${String(selectedLabel) === String(l.id ?? l.name) ? 'active' : ''}`}
                  onClick={() => handleSelectLabel(l.id ?? l.name)}
                  aria-pressed={String(selectedLabel) === String(l.id ?? l.name)}
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