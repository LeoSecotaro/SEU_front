import React from 'react'
import './ConfirmModal.css'

export default function ConfirmModal({ isOpen, title = 'Confirmar', message = '', onConfirm, onCancel, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar' }) {
  if (!isOpen) return null

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h4>{title}</h4>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn-confirm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
