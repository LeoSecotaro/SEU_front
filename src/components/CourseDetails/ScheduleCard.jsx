import React from 'react'
import './coursedetails.css'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

function formatTimeFromISO(iso) {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  } catch (e) {
    return null
  }
}

function formatSchedule(schedule, days) {
  // If days array provided, prefer showing days + time (if available)
  if (Array.isArray(days) && days.length > 0) {
    const names = days.map(d => (d && (d.name || d.title)) || String(d)).join(' · ')
    // attempt to extract time from schedule (ISO string or object)
    let time = null
    if (typeof schedule === 'string') time = formatTimeFromISO(schedule)
    else if (typeof schedule === 'object' && schedule.start) time = formatTimeFromISO(schedule.start)
    return time ? `${names} ${time}` : names
  }

  // fallback to previous behaviors
  if (!schedule && schedule !== 0) return null
  if (Array.isArray(schedule)) return schedule.join(', ')
  if (typeof schedule === 'object') {
    if (schedule.days && schedule.start_time && schedule.end_time) {
      return `${schedule.days} ${schedule.start_time}–${schedule.end_time}`
    }
    if (schedule.start && schedule.end) {
      try {
        const s = new Date(schedule.start)
        const e = new Date(schedule.end)
        const sameDay = s.toDateString() === e.toDateString()
        const dateFmt = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })
        const timeFmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
        return sameDay
          ? `${dateFmt.format(s)} ${timeFmt.format(s)}–${timeFmt.format(e)}`
          : `${dateFmt.format(s)} ${timeFmt.format(s)} — ${dateFmt.format(e)} ${timeFmt.format(e)}`
      } catch (e) {
        return JSON.stringify(schedule)
      }
    }
    return JSON.stringify(schedule)
  }
  if (typeof schedule === 'string') {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T/;
    if (isoRegex.test(schedule)) {
      try {
        const d = new Date(schedule)
        const fmt = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        return fmt.format(d)
      } catch (e) {
        return schedule
      }
    }
    return schedule
  }
  return String(schedule)
}

export default function ScheduleCard({ schedule, address, days }) {
  const formatted = formatSchedule(schedule, days)

  return (
    <div className="info-card schedule-card">
      <div className="info-card-body">
        <div className="info-card-title">Días y Horarios</div>

        {formatted ? (
          <div className="info-card-line">
            <span className="line-icon"><FaCalendarAlt /></span>
            <span className="line-text"><strong>{formatted}</strong></span>
          </div>
        ) : (
          <div className="info-card-line">
            <span className="line-icon"><FaCalendarAlt /></span>
            <span className="line-text">Horario no disponible</span>
          </div>
        )}

        {address && (
          <div className="info-card-line info-card-address-line">
            <span className="line-icon pin"><FaMapMarkerAlt /></span>
            <span className="line-text info-card-address">{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
