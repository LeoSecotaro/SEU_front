import React, { useState, useEffect } from 'react'
import TopicItem from './TopicItem'
import './coursedetails.css'

export default function TopicsList({ topics = [] }) {
  // keep only items with title
  const items = Array.isArray(topics) ? topics.filter(t => t && (t.title || t.name)) : []
  const [openIndex, setOpenIndex] = useState(items.length ? 0 : -1) // open first by default

  useEffect(() => {
    console.log('TopicsList items:', items)
  }, [items])

  const toggle = (i) => {
    setOpenIndex(prev => (prev === i ? -1 : i))
  }

  if (items.length === 0) return <div className="no-topics">No se encontraron temas para este curso.</div>

  return (
    <div className="topics-list">
      {items.map((t, i) => (
        <TopicItem
          key={t.id || i}
          index={i + 1}
          item={t}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  )
}
