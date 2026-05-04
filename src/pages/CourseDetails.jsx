import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourse } from '../api/courses'
import './courseDetails.css'

import CourseHero from '../components/CourseDetails/CourseHero'
import CourseSidebar from '../components/CourseDetails/CourseSidebar'
import CourseContent from '../components/CourseDetails/CourseContent'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    getCourse(id).then((c) => { console.log('getCourse response:', c); setCourse(c) }).catch((e) => { console.error('getCourse error', e); setError(e) })
  }, [id])

  if (error) return <div className="container">Error cargando curso: {String(error)}</div>
  if (!course) return <div className="container">Cargando...</div>

  return (
    <div className="course-page container">
      <CourseHero course={course} />

      <div className="course-inner">
        <div className="course-grid">
          <CourseContent course={course} />
          <CourseSidebar course={course} />
        </div>
      </div>
    </div>
  )
}
