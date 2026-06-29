import React from 'react'
import './skeleton.css'

export default function SkeletonRow({ className = 'label-row', textWidth = '40%' }) {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '16px' }}>
        <div className="skeleton-box skeleton-text" style={{ width: textWidth, height: '16px', margin: 0 }}></div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="skeleton-box skeleton-button"></div>
        <div className="skeleton-box skeleton-button"></div>
      </div>
    </div>
  )
}
