import React from 'react'
import './skeleton.css'

export default function SkeletonCard() {
  return (
    <div className="admin-course-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
      <div className="course-tags" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div>
        <div className="skeleton-box" style={{ width: '100px', height: '24px', borderRadius: '12px' }}></div>
      </div>
      
      <div className="skeleton-box skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '16px' }}></div>
      
      <div className="skeleton-box skeleton-text" style={{ width: '100%', height: '14px', marginBottom: '6px' }}></div>
      <div className="skeleton-box skeleton-text" style={{ width: '90%', height: '14px', marginBottom: '16px' }}></div>

      <div className="course-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div className="skeleton-box skeleton-text" style={{ width: '100px', height: '14px', margin: 0 }}></div>
        <div className="skeleton-box skeleton-text" style={{ width: '120px', height: '14px', margin: 0 }}></div>
        <div className="skeleton-box skeleton-text" style={{ width: '90px', height: '14px', margin: 0 }}></div>
      </div>

      <div className="course-actions" style={{ display: 'flex', gap: '8px' }}>
        <div className="skeleton-box" style={{ width: '80px', height: '36px', borderRadius: '8px' }}></div>
        <div className="skeleton-box" style={{ width: '40px', height: '36px', borderRadius: '8px' }}></div>
      </div>
    </div>
  )
}
