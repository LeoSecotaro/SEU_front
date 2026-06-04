import React from 'react'
import './skeleton.css'
import '../CourseDetails/coursedetails.css'

export default function CourseDetailsSkeleton() {
  return (
    <div className="course-page container" aria-hidden="true">
      <section className="course-hero">
        <div className="hero-inner" style={{ paddingTop: '40px' }}>
          <div className="skeleton-box" style={{ width: '120px', height: '24px', borderRadius: '12px', marginBottom: '16px' }}></div>
          <div className="skeleton-box skeleton-text" style={{ width: '80%', height: '48px', marginBottom: '16px' }}></div>
          <div className="skeleton-box skeleton-text" style={{ width: '60%', height: '48px', marginBottom: '24px' }}></div>
          
          <div className="skeleton-box skeleton-text" style={{ width: '90%', height: '20px', marginBottom: '8px' }}></div>
          <div className="skeleton-box skeleton-text" style={{ width: '70%', height: '20px' }}></div>
        </div>
      </section>

      <div className="course-inner">
        <div className="course-grid">
          <div className="course-content">
            <div className="course-meta-cards" style={{ marginBottom: '32px' }}>
              <div className="meta-grid" style={{ display: 'flex', gap: '16px' }}>
                <div className="meta-card skeleton-box" style={{ flex: 1, height: '80px', borderRadius: '12px' }}></div>
                <div className="meta-card skeleton-box" style={{ flex: 1, height: '80px', borderRadius: '12px' }}></div>
                <div className="meta-card skeleton-box" style={{ flex: 1, height: '80px', borderRadius: '12px' }}></div>
              </div>
            </div>
            
            <div className="course-goals" style={{ marginTop: '24px' }}>
              <div className="skeleton-box skeleton-text" style={{ width: '40%', height: '28px', marginBottom: '24px' }}></div>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton-box skeleton-text" style={{ width: i % 2 === 0 ? '100%' : '85%', height: '16px', marginBottom: '12px' }}></div>
              ))}
            </div>
          </div>

          <aside className="course-sidebar">
            <div className="price-card" style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div className="skeleton-box" style={{ width: '100%', height: '20px', marginBottom: '24px' }}></div>
              <div className="skeleton-box" style={{ width: '80%', height: '40px', margin: '0 auto 32px auto' }}></div>
              <div className="skeleton-box" style={{ width: '100%', height: '50px', borderRadius: '10px' }}></div>
            </div>

            <div className="contact-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div className="skeleton-box" style={{ width: '60%', height: '20px', marginBottom: '20px' }}></div>
              <div className="skeleton-box" style={{ width: '100%', height: '48px', borderRadius: '10px', marginBottom: '12px' }}></div>
              <div className="skeleton-box" style={{ width: '100%', height: '48px', borderRadius: '10px' }}></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
