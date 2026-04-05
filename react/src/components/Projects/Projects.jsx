import './Projects.css'
import { useMemo, useState } from 'react'

const Projects = ({ portfolio }) => {
  const [showAll, setShowAll] = useState(false)
  const projects = portfolio?.projects || []
  const featured = projects.filter(project => project.featured)
  const visibleProjects = showAll ? projects : featured

  const hiddenCount = useMemo(
    () => Math.max(0, projects.length - featured.length),
    [projects.length, featured.length]
  )

  return (
    <section id="work" className="section projects">
      <div className="container">
        <div className="section-shell projects-shell">
          <div className="projects-shell-inner">
            <div className="section-heading">
              <div className="section-heading-copy">
                <span className="mono muted">02 - Selected Work</span>
                <h2 className="projects-heading">Things I&apos;ve built</h2>
                <p>Backend systems, full-stack applications, and experiments that balance reliability with a user-friendly finish.</p>
              </div>
              <div className="section-heading-note">
                <strong>Project lens</strong>
                A mix of product thinking, system design, and implementation details.
              </div>
            </div>

            <div className="projects-grid">
              {visibleProjects.map((project, index) => (
                <article className="project-entry" key={`${project?.title || 'project'}-${index}`}>
                  <div className="project-content">
                    <div className="project-meta">
                      <span className="mono muted">{String(index + 1).padStart(2, '0')}</span>
                      <span className="mono muted">{project.year || 'Featured build'}</span>
                    </div>

                    <h3 className="project-title">
                      <a
                        href={project.liveUrl || project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.title} <span aria-hidden="true">-&gt;</span>
                      </a>
                    </h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tags">
                      {(project.technologies || []).map(tech => (
                        <span className="tag" key={`${project.title}-${tech}`}>{tech}</span>
                      ))}
                    </div>

                    <div className="project-links">
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          GitHub
                        </a>
                      ) : null}

                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          Live demo
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!showAll && hiddenCount > 0 ? (
              <button className="show-all-projects" onClick={() => setShowAll(true)}>
                Show all projects ({hiddenCount})
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
