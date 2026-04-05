import './Hero.css'
import { useState } from 'react'
import { normalizeImageUrl } from '../../utils/cloudinaryUpload'

const Hero = ({ portfolio }) => {
  const meta = portfolio?.meta || {}
  const [imageFailed, setImageFailed] = useState(false)
  const stats = [
    { value: `${(portfolio?.projects || []).length}+`, label: 'Projects shipped' },
    { value: `${(portfolio?.experience || []).length || 1}`, label: 'Hands-on roles' },
    { value: `${(portfolio?.certifications || []).length}+`, label: 'Certifications' }
  ]

  const profileImageUrl = normalizeImageUrl(portfolio?.about?.profileImage)
  const initials = (meta?.name || 'Portfolio')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <section id="top" className="hero section">
      <div className="container hero-layout">
        <div className="hero-content">
          <div className="hero-copy-panel">
            <span className="mono fade-up stagger-1 hero-kicker" style={{ color: 'var(--text-muted)' }}>
              Full-stack developer building reliable web products
            </span>
            <h1 className="fade-up stagger-2">{meta?.name}</h1>
            <p className="hero-tagline fade-up stagger-3">
              {meta?.tagline}
            </p>

            {meta?.availability ? (
              <div className="availability-badge fade-up stagger-4">
                <span className="dot" /> {meta.availability}
              </div>
            ) : null}

            <div className="hero-cta fade-up stagger-5">
              <a href="#work" className="cta-primary">View My Work</a>
              <a href="#contact" className="cta-secondary">Get In Touch</a>
            </div>
          </div>

          <div className="hero-stats fade-up stagger-5">
            {stats.map(stat => (
              <div className="hero-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual fade-up stagger-3" aria-label="Profile image">
          <div className="profile-ring">
            {profileImageUrl && !imageFailed ? (
              <img
                className="profile-image"
                src={profileImageUrl}
                alt={meta?.name ? `${meta.name} profile` : 'Profile'}
                loading="eager"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="profile-fallback" aria-hidden="true">{initials}</div>
            )}
          </div>
          <div className="hero-spotlight">
            <span className="mono">Focus</span>
            <p>Secure backend systems, smooth React frontends, and products that feel fast and thoughtful.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
