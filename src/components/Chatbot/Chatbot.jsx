import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { generateCourseSummary, sendCourseChat, deleteCurrentChatSession } from '../../api/chat';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FaRegComment, FaTimes, FaTrash } from 'react-icons/fa';

export default function Chatbot({ courseId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      if (!summaryGenerated) {
        generateSummary();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateSummary = async () => {
    try {
      setIsLoading(true);
      await generateCourseSummary(courseId);
      setSummaryGenerated(true);
      setMessages([{ role: 'assistant', content: '¡Hola! Soy el asistente de este curso. ¿En qué te puedo ayudar?' }]);
    } catch (error) {
      console.error('Error generating summary:', error);
      setMessages([{ role: 'assistant', content: 'Hubo un error al inicializar el asistente. Por favor, inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendCourseChat(courseId, userMessage.content);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response || 'No response' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      setIsLoading(true);
      await deleteCurrentChatSession();
      setMessages([{ role: 'assistant', content: 'La sesión fue reiniciada.' }]);
      setSummaryGenerated(false);
    } catch (error) {
      console.error('Error deleting chat session:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'No se pudo reiniciar la sesión. Intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => setShowConfirm(false);

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="chatbot-icon">{isOpen ? <FaTimes /> : <FaRegComment />}</span>
        {!isOpen && hasUnread && <span className="chatbot-badge">1</span>}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chatbot-header">
          <h3>Asistente del Curso</h3>
          <div className="chatbot-header-actions">
            <button className="chatbot-delete" onClick={handleDeleteSession} title="Reiniciar sesión del asistente">
              <FaTrash />
            </button>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} title="Cerrar chat">
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.role}`}>
              <div className="chatbot-message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-message assistant">
              <div className="chatbot-message-content typing">...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading}>
            ➤
          </button>
        </form>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Reiniciar sesión del asistente"
        message="¿Deseas reiniciar la sesión del asistente? Se borrarán los mensajes actuales."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmLabel="Reiniciar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
