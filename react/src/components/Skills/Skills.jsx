import './Skills.css'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as brands from '@fortawesome/free-brands-svg-icons'
import * as solids from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

const categories = ['Programming Languages', 'Frameworks', 'Databases', 'Others']

function getIconByName(name) {
  // Try brands first, then solids
  if (brands[name]) return brands[name]
  if (solids[name]) return solids[name]
  return null
}

const Skills = () => {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => setSkills(data.skills || []))
      .catch(() => setSkills([]))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const categoryVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const skillVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  return (
    <motion.section
      id="skills"
      className="skills-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="skills-header"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>Skills & Technologies</h2>
        <div className="skills-subtitle">
          <div className="header-decoration"></div>
        </div>
      </motion.div>

      <motion.div
        className="skills-categories"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {categories.map((cat, categoryIndex) => (
          <motion.div
            className="skills-category"
            key={cat}
            variants={categoryVariants}
            whileHover={{
              scale: 1.02,
              y: -5,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <motion.h3
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 + 0.3 }}
            >
              {cat}
              <div className="category-underline"></div>
            </motion.h3>
            <motion.div className="skills-list">
              {skills.filter(skill => skill.category === cat).map((skill, idx) => (
                <motion.div
                  className="skill-bar"
                  key={skill._id || idx}
                  variants={skillVariants}
                  whileHover={{
                    scale: 1.05,
                    x: 5,
                    boxShadow: '0 8px 25px rgba(0,188,212,0.15)',
                    transition: { type: 'spring', stiffness: 400, damping: 15 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="skill-icon"
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.2,
                      transition: { duration: 0.5 }
                    }}
                  >
                    {getIconByName(skill.icon)
                      ? <FontAwesomeIcon icon={getIconByName(skill.icon)} />
                      : skill.icon}
                  </motion.span>
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-glow"></div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="skills-scroll-indicator">
        <motion.div
          className="chevron"
          animate={{
            y: [0, 8, 0],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="chevron"
          animate={{
            y: [0, 8, 0],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        ></motion.div>
      </div>
    </motion.section>
  )
}

export default Skills