import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
]

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const handleToggle = () => setOpen(o => !o)

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setOpen(false)

    // Smooth scroll to section
    const targetId = href.substring(1) // Remove '#' from href
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const navbar = document.querySelector('.navbar')
      const navbarHeight = navbar ? navbar.offsetHeight : 0
      const targetPosition = targetElement.offsetTop - navbarHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })

      // Add a subtle animation effect
      targetElement.style.transform = 'translateY(-10px)'
      targetElement.style.transition = 'transform 0.3s ease'

      setTimeout(() => {
        targetElement.style.transform = 'translateY(0)'
      }, 300)
    }
  }

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setScrolled(scrollTop > 50)

      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1))
      const navbar = document.querySelector('.navbar')
      const navbarHeight = navbar ? navbar.offsetHeight : 0

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop - navbarHeight - 100
          if (scrollTop >= sectionTop) {
            setActiveSection(`#${sections[i]}`)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.navbar-links') && !event.target.closest('.navbar-hamburger')) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <span className="navbar-logo"><p style={{ fontFamily: 'monospace', fontSize: '24px', color: 'white' }}>
          Portfolio
        </p>

        </span>
        <button
          className="navbar-hamburger"
          onClick={handleToggle}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <FontAwesomeIcon icon={open ? faTimes : faBars} />
        </button>

        <div className={`navbar-links${open ? ' open' : ''}`}>
          {navLinks.map(link => (
            <a
              href={link.href}
              key={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={activeSection === link.href ? 'active' : ''}
              aria-current={activeSection === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar