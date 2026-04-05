import './About.css'
import Skills from '../Skills/Skills'

const toLabel = category => {
  const map = {
    'Programming Languages': 'Languages',
    Frameworks: 'Frameworks',
    Databases: 'Databases',
    Others: 'Tools'
  }

  return map[category] || category
}

const About = ({ portfolio }) => {
  const bio = portfolio?.about?.bio || ''
  const paragraphs = bio
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  const groupedSkills = portfolio?.skills || {}

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-shell about-shell">
          <div className="about-shell-inner">
            <div className="section-heading">
              <div className="section-heading-copy">
                <span className="mono muted">01 - About</span>
                <h2 className="about-title-main">A bit about me</h2>
                <p>I enjoy turning backend-heavy ideas into products that feel calm, fast, and easy to use.</p>
              </div>
              <div className="section-heading-note">
                <strong>Approach</strong>
                Thoughtful UX, clean APIs, and maintainable engineering decisions.
              </div>
            </div>

            <div className="about-grid">
              <div className="about-bio">
                <div className="about-bio-intro">
                  <span className="mono muted">Profile</span>
                  <p className="about-bio-summary">
                    Full-stack developer focused on secure systems, clean architecture, and responsive interfaces.
                  </p>
                </div>
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>
                ))}
              </div>

              <div className="about-side">
                <div className="about-skills-panel">
                  <div className="about-panel-header">
                    <span className="mono muted">Capabilities</span>
                    <p>Core tools and technologies I use to design, build, and ship projects.</p>
                  </div>

                  <div className="about-skills-grid">
                    {Object.entries(groupedSkills).map(([category, list]) => (
                      <div className="skill-group" key={category}>
                        <span className="mono" style={{ color: 'var(--text-muted)' }}>{toLabel(category)}</span>
                        <div className="skill-list">
                          {list.map(skill => (
                            <span className="tag" key={`${category}-${skill}`}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Skills portfolio={portfolio} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
