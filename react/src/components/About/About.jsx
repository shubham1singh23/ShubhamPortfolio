import './About.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const fallbackAvatar = 'https://ui-avatars.com/api/?name=Profile&background=eee&color=555&size=128'

const About = () => {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => {
        setAbout(data.about)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading portfolio.json:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-short"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return about ? (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="about-container">
        <motion.div
          className="about-avatar-wrapper"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            className="about-avatar"
            src={about.profileImage || fallbackAvatar}
            alt="Profile Avatar"
            loading="lazy"
          />
          <div className="avatar-ring"></div>
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="about-title">About Me</h2>
          <p className="about-description">{about.description}</p>
        </motion.div>
      </div>
    </motion.section>
  ) : (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-error">
          <p>Unable to load about information</p>
        </div>
      </div>
    </section>
  )
}

export default About