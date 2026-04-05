import './Journey.css'

const Journey = ({ portfolio }) => {
  const experience = Array.isArray(portfolio?.experience) ? portfolio.experience : []

  return (
    <section id="journey" className="section experience">
      <div className="container">
        <div className="section-shell experience-shell">
          <div className="experience-shell-inner">
            <div className="section-heading">
              <div className="section-heading-copy">
                <span className="mono muted">03 - Experience</span>
                <h2 className="experience-heading">Where I&apos;ve worked</h2>
                <p>Experience shaped by product delivery, backend foundations, and practical problem solving.</p>
              </div>
            </div>

            <div className="experience-timeline">
              {experience.map((exp, index) => (
                <div className="experience-entry" key={`${exp.company || 'exp'}-${index}`}>
                  <div className="experience-marker" aria-hidden="true" />
                  <div className="experience-body">
                    <div className="experience-header">
                      <div>
                        <span className="experience-role">{exp.role}</span>
                        <span className="experience-sep"> at </span>
                        <span className="experience-company">{exp.company}</span>
                      </div>
                      <div className="experience-period mono">{exp.period}</div>
                    </div>

                    {exp.current ? <span className="current-badge">Current</span> : null}

                    <p className="experience-desc">{exp.description}</p>

                    <div className="experience-tags">
                      {(exp.technologies || []).map(tech => (
                        <span className="tag" key={`${exp.company}-${tech}`}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Journey
