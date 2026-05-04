import React from 'react'
import './coursedetails.css'

export default function MetaCard({ Icon, title, value }) {
  return (
    <div className="meta-card">
      {Icon && (
        <div className="meta-card-icon">
          <Icon />
        </div>
      )}
      <div className="meta-card-body">
        <div className="meta-card-title">{title}</div>
        <div className="meta-card-value">{value}</div>
      </div>
    </div>
  )
}
