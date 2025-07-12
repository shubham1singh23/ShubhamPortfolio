import './Projects.css'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faChrome } from '@fortawesome/free-brands-svg-icons'
import { motion } from 'framer-motion'

const Projects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(() => setProjects([]))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section
      id="projects"
      className="projects-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="projects-container">
        <h2>My Projects</h2>
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((project, idx) => (
            <motion.div
              className="project-card"
              key={project._id || idx}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.title} />
                <div className="project-card-overlay">
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                      <FontAwesomeIcon icon={faGithub} />
                    </a>
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" title="Live Demo">
                        <FontAwesomeIcon icon={faChrome} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech && project.tech.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Horizontal Scroll Indicator for Mobile */}
        {projects.length > 0 && (
          <div className="projects-scroll-indicator">
            <div className="scroll-text">Swipe to explore</div>
            <div className="scroll-arrow"></div>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default Projects