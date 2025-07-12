import { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

const EMAILJS_SERVICE_ID = 'service_dzxr55s'
const EMAILJS_TEMPLATE_ID = 'template_eztmfnf'
const EMAILJS_PUBLIC_KEY = 'cl0qtOarXGwwNB_dO'

const Contact = () => {
  const form = useRef()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Initialize EmailJS
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

    // Check if EmailJS is properly configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError(true)
      setErrorMessage('EmailJS is not properly configured. Please check your keys.')
      setLoading(false)
      return
    }

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
      .then((result) => {
        setSent(true)
        setLoading(false)
        form.current.reset()
      })
      .catch((error) => {
        setError(true)
        setErrorMessage('Failed to send message. Please try again or check your EmailJS configuration.')
        setLoading(false)
      })
  }

  return (
    <motion.section
      id="contact"
      className="contact-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Contact</h2>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input type="text" name="name" placeholder="Your Name" required />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} />
          <input type="email" name="time" placeholder="Your Email" required />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faCommentDots} />
          <textarea name="message" placeholder="Your Message" rows="5" required />
        </div>
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.06 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
        {sent && <p className="success-msg">Message sent successfully! I'll get back to you soon.</p>}
        {error && <p className="error-msg">{errorMessage}</p>}
      </form>
    </motion.section>
  )
}

export default Contact
