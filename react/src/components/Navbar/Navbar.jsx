import { Moon, SunMedium } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './Navbar.css'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
]

const Navbar = ({ darkMode, toggleDarkMode, resumeUrl, showJourney }) => {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#about')
  const [scrolled, setScrolled] = useState(false)
  const visibleLinks = useMemo(
    () => navLinks.filter(link => link.href !== '#journey' || showJourney),
    [showJourney]
  )

  const handleToggle = () => setOpen(prev => !prev)

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setOpen(false)

    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 90,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0.01
      }
    )

    visibleLinks.forEach(link => {
      const id = link.href.slice(1)
      const section = document.getElementById(id)
      if (section) {
        observer.observe(section)
      }
    })

    return () => observer.disconnect()
  }, [visibleLinks])

  useEffect(() => {
    const handleClickOutside = event => {
      if (open && !event.target.closest('.navbar-inner')) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <a href="#top" className="navbar-logo" onClick={e => handleLinkClick(e, '#top')}>
            Shubham Singh
          </a>

          <button
            className="navbar-hamburger"
            onClick={handleToggle}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? 'Close' : 'Menu'}
          </button>

          <div className={`navbar-links ${open ? 'open' : ''}`}>
            {visibleLinks.map(link => (
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
              {darkMode ? <SunMedium size={15} /> : <Moon size={15} />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {resumeUrl ? (
              <a href={resumeUrl} className="resume-link" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
