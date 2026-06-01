import React from 'react'
import './coursedetails.css'
import TopicsList from './TopicsList'
import ScheduleCard from './ScheduleCard'
import QuotaCard from './QuotaCard'
import MetaCard from './MetaCard'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHourglassHalf } from 'react-icons/fa'

export default function CourseContent({ course }) {
  // build a days array that includes per-day start/end times when available
  const daysWithTimes = (course.course_days && course.course_days.length)
    ? course.course_days.map(cd => ({
        id: cd.day_id || (cd.day && cd.day.id),
        name: (cd.day && (cd.day.name || cd.day.title)) || (course.days && course.days.find(d => d.id === cd.day_id) && (course.days.find(d => d.id === cd.day_id).name)) || cd.day_name || cd.name,
        start_time: cd.start_time || cd.start || null,
        end_time: cd.end_time || cd.end || null
      }))
    : (course.days || [])

   // derive min quota using several possible backend keys; avoid using || which treats 0 as falsy
   const minQuota = course ? (
     course.min_quota ?? course.minQuota ?? course.quota_min ?? course.quota_minimum ?? course.minimum_quota ?? course.minimumQuota ?? (course.raw && (course.raw.min_quota ?? course.raw.minQuota ?? course.raw.quota_minimum)) ?? (course.attributes && course.attributes.min_quota) ?? null
   ) : null

   // multi-key fallbacks for other fields
   const description = course.description ?? course.short_description ?? course.summary ?? course.body ?? ''
   const goals = course.goals ?? course.objectives ?? course.goal ?? ''
   const modeLabel = (course.mode && course.mode.name) || course.mode_name || course.modality || (course.mode_id === 1 ? 'Presencial' : '')
   const priceVal = (course.price != null) ? course.price : (course.price_cents ? course.price_cents / 100 : (course.cost != null ? course.cost : null))
   const priceIsMonthly = !!(course.price_is_monthly ?? course.price_monthly ?? (course.price_period === 'monthly'))
   const address = course.address ?? course.location ?? course.venue ?? ''
   const duration = course.duration ?? course.duration_text ?? course.hours_description ?? ''
   const hourly = course.hourly_load ?? course.hours ?? course.hourly ?? ''

   return (
     <div className="course-content">
      <section className="course-meta-cards">
        <div className="meta-grid">
          <MetaCard Icon={FaMapMarkerAlt} title="Modalidad:" value={<strong>{modeLabel}</strong>} />
          <MetaCard Icon={FaCalendarAlt} title="Inicio:" value={<strong>{course.start_date || 'Inicio con el cupo mínimo'}</strong>} />
          <MetaCard Icon={FaClock} title="Duración:" value={<strong>{duration}</strong>} />
          <MetaCard Icon={FaHourglassHalf} title="Carga Horaria:" value={<strong>{hourly}</strong>} />
        </div>
      </section>

      <section className="course-objectives">
        <h3>Objetivos del Curso</h3>
        <div className="course-goals">{goals}</div>
      </section>

      <section className="course-topics">
        <h3>Temas a Desarrollar</h3>
        <TopicsList topics={course.topics || course.modules || course.syllabus || []} />

        <div className="info-cards">
          <ScheduleCard schedule={course.schedule || course.hours_description || course.timetable || course.start} address={address} days={daysWithTimes} />
          <QuotaCard quota={course.quota || course.capacity} minQuota={minQuota} enrolled={course.enrolled || course.registered} />
        </div>
      </section>

    </div>
  )
}
