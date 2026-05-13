import './footer.css'
import { FaGraduationCap, FaEnvelope, FaEnvelopeOpenText, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="col">
          <div className="logo">
            <div className="footer-brand-logo" aria-hidden="true">
              <FaGraduationCap size={20} color="#fff" />
            </div>
            <div>
              <strong>UTN</strong>
              <div className="muted">Extensión Universitaria</div>
            </div>
          </div>

          <p className="muted desc">Formación profesional continua para impulsar tu carrera. Cursos de excelencia académica dictados por profesionales en actividad.</p>

          <div className="socials" aria-hidden>
            <a className="social-link" href="https://www4.frm.utn.edu.ar/contactos/" target="_blank" rel="noopener noreferrer" aria-label="Contactos">
              <FaEnvelope className="social-icon" />
              <span className="social-label">Contactos</span>
            </a>
            <a className="social-link" href="https://www4.frm.utn.edu.ar/web_mail/" target="_blank" rel="noopener noreferrer" aria-label="Webmail">
              <FaEnvelopeOpenText className="social-icon" />
              <span className="social-label">Webmail</span>
            </a>
          </div>
        </div>

        <div className="col contact-col">
          <h4>Contacto</h4>
          <p className="contact-line"><FaMapMarkerAlt className="contact-icon" /> Rodríguez 273, Mendoza<br/>Argentina</p>
          <p className="contact-line"><FaPhoneAlt className="contact-icon" /> +549 2614988048</p>
          <p className="contact-line"><FaEnvelope className="contact-icon" /> capacitacion@frm.utn.edu.ar</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="copyright">© {new Date().getFullYear()} UTN Facultad Regional Mendoza. Todos los derechos reservados.</div>
          <div className="legal-links">
            <a href="#">Términos y Condiciones</a>
            <a href="#">Políticas de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
