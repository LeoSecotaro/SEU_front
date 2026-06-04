import React from 'react'
import './skeleton.css'
import '../CourseCard/coursecard.css' // To inherit .course-card dimensions

export default function CourseCardSkeleton() {
  return (
    <article className="course-card" aria-hidden="true">
      <div className="hero" style={{ background: '#f8fafc' }}>
        {/* Placeholder para la imagen o badge */}
        <div className="skeleton-box" style={{ width: '100%', height: '100%' }}></div>
      </div>

      <div className="body">
        {/* Title */}
        <div className="skeleton-box skeleton-text" style={{ width: '85%', height: '24px', marginBottom: '16px' }}></div>
        
        {/* Mode pill */}
        <div className="skeleton-box" style={{ width: '80px', height: '22px', borderRadius: '12px', marginBottom: '16px' }}></div>

        <div className="meta" style={{ display: 'flex', gap: '16px' }}>
          <div className="skeleton-box" style={{ width: '90px', height: '16px' }}></div>
          <div className="skeleton-box" style={{ width: '60px', height: '16px' }}></div>
        </div>

        <div className="footer" style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-box" style={{ width: '120px', height: '14px' }}></div>
          <div className="skeleton-box" style={{ width: '110px', height: '36px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </article>
  )
}
