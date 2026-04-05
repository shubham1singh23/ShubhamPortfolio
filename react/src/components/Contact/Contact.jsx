import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const Contact = ({ portfolio }) => {
  const form = useRef()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY)
    }
  }, [])

  const sendEmail = (e) => {
    e.preventDefault()
    setSent(false)
    setError(false)
    setErrorMessage('')
    setLoading(true)

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError(true)
      setErrorMessage('Email form is not configured yet.')
      setLoading(false)
      return
    }

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setSent(true)
        setLoading(false)
        form.current.reset()
      })
      .catch(() => {
        setError(true)
        setErrorMessage('Unable to send message. Please try direct email.')
        setLoading(false)
      })
  }

  const availability = portfolio?.meta?.availability
  const email = portfolio?.meta?.email
  const social = portfolio?.social || []

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-copy">
            <span className="mono muted">05 - Contact</span>
            <h2>Let&apos;s work together</h2>

            <p className="contact-sub">
              I&apos;m currently {availability ? availability.toLowerCase() : 'available for opportunities'}. My inbox is open
              whether it&apos;s a job opportunity, a project, or just a hello.
            </p>

            {email ? (
              <a href={`mailto:${email}`} className="email-link">{email}</a>
            ) : null}

            <div className="social-links">
              {social.map(item => (
                <a
                  href={item.url}
                  className="social-link"
                  key={`${item.platform}-${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.platform}
                </a>
              ))}
            </div>

            <button className="form-toggle mono" onClick={() => setShowForm(prev => !prev)}>
              {showForm ? 'Hide form' : 'Prefer a form?'}
            </button>
          </div>

          <div className="contact-panel">
            <p className="contact-panel-title mono">Send a note</p>
            <p className="contact-panel-copy">Short messages, collaboration ideas, internship opportunities, or project discussions are all welcome.</p>

            {showForm ? (
              <form ref={form} onSubmit={sendEmail} className="contact-form-minimal">
                <input type="text" name="name" placeholder="Your name" required />
                <input type="email" name="email" placeholder="Your email" required />
                <textarea name="message" placeholder="Your message" rows="5" required />
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {sent ? <p className="success-msg">Message sent successfully.</p> : null}
                {error ? <p className="error-msg">{errorMessage}</p> : null}
              </form>
            ) : (
              <div className="contact-panel-placeholder">
                <span className="mono">Fastest route</span>
                <p>Email me directly for the quickest response, or open the form if you prefer a structured message.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
