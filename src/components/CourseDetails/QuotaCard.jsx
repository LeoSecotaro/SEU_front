import React from 'react'
import './coursedetails.css'
import { FaUsers, FaCheckCircle } from 'react-icons/fa'

export default function QuotaCard({ quota, enrolled }) {
  const percent = (quota && enrolled) ? Math.min(100, Math.round((enrolled / quota) * 100)) : 0

  return (
    <div className="info-card quota-card">
      <div className="info-card-body">
        <div className="info-card-title">Información de Cupo</div>

        <div className="info-card-line">
          <span className="line-icon users"><FaUsers /></span>
          <span className="line-text">
            {quota ? <strong>{quota} <span className="muted">cupos</span></strong> : <span className="muted">Cupo no especificado</span>}
          </span>
        </div>

        {quota && typeof enrolled !== 'undefined' ? (
          <div className="info-card-line quota-progress-line">
            <div className="quota-progress" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
              <div className="quota-bar" style={{ width: `${percent}%` }} />
            </div>
            <div className="quota-label">{enrolled} inscritos</div>
          </div>
        ) : typeof enrolled !== 'undefined' ? (
          <div className="info-card-line">
            <span className="line-icon small"><FaCheckCircle /></span>
            <span className="line-text">{enrolled} inscritos</span>
          </div>
        ) : null}

      </div>
    </div>
  )
}
