import React from 'react'
import './coursedetails.css'
import TopicsList from './TopicsList'
import ScheduleCard from './ScheduleCard'
import QuotaCard from './QuotaCard'
import MetaCard from './MetaCard'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHourglassHalf } from 'react-icons/fa'

export default function CourseContent({ course }) {
  return (
    <div className="course-content">
      <section className="course-meta-cards">
        <div className="meta-grid">
          <MetaCard Icon={FaMapMarkerAlt} title="Modalidad:" value={course.mode && course.mode.name ? <strong>{course.mode.name}</strong> : <strong>{course.mode_name || (course.mode_id === 1 ? 'Presencial' : 'Online')}</strong>} />
          <MetaCard Icon={FaCalendarAlt} title="Inicio:" value={<strong>{course.start_date}</strong>} />
          <MetaCard Icon={FaClock} title="Duración:" value={<strong>{course.duration}</strong>} />
          <MetaCard Icon={FaHourglassHalf} title="Carga Horaria:" value={<strong>{course.hourly_load || course.hours || course.hourly}</strong>} />
        </div>
      </section>

      <section className="course-objectives">
        <h3>Objetivos del Curso</h3>
        <div>{course.goals}</div>
      </section>

      <section className="course-topics">
        <h3>Temas a Desarrollar</h3>
        <TopicsList topics={course.topics || course.modules || course.syllabus || []} />

        <div className="info-cards">
          <ScheduleCard schedule={course.schedule || course.hours_description || course.timetable || course.start} address={course.address || course.location} days={course.days} />
          <QuotaCard quota={course.quota || course.capacity} enrolled={course.enrolled || course.registered} />
        </div>
      </section>

    </div>
  )
}
