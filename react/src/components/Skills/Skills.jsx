import './Skills.css'

const Skills = ({ portfolio }) => {
  const primary = Object.keys(portfolio?.skills || {}).slice(0, 3)

  return (
    <div className="skills-subsection">
      <span className="mono" style={{ color: 'var(--text-muted)' }}>Currently working with</span>
      <div className="skills-current-list">
        {primary.map(category => (
          <div className="skills-current-group" key={category}>
            <p className="skills-current-title">{category}</p>
            <p className="skills-current-values">{(portfolio.skills[category] || []).join(' / ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
