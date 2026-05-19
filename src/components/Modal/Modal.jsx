import React from 'react'
import './Modal.css'
import { FiX } from 'react-icons/fi'

export default function Modal({ title, children, onClose = () => {}, footer = null }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>
  )
}
