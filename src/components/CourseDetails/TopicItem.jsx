import React from 'react'
import './coursedetails.css'
import { FaChevronRight } from 'react-icons/fa'

export default function TopicItem({ item, index, isOpen, onToggle }) {
  const title = item.title || item.name || `Tema ${index}`
  const content = item.content || item.description || item.summary || ''

  return (
    <div className={`topic-item ${isOpen ? 'open' : ''}`}>
      <button className="topic-toggle" onClick={onToggle} aria-expanded={isOpen}>
        <span className="topic-index">{index}</span>
        <span className="topic-title">{title}</span>
        <span className="topic-icon"><FaChevronRight /></span>
      </button>

      <div className={`topic-body ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="topic-body-inner">
          <p>{content}</p>
        </div>
      </div>
    </div>
  )
}
