import './Education.css'
import Certifications from '../Certifications/Certifications'

const Education = ({ portfolio }) => {
  const education = portfolio?.education || []
  const certifications = portfolio?.certifications || []

  return (
    <section className="section education" id="education">
      <div className="container">
        <div className="section-shell education-shell">
          <div className="education-shell-inner">
            <div className="section-heading">
              <div className="section-heading-copy">
                <span className="mono muted">04 - Education</span>
                <h2 className="education-heading">Education and growth</h2>
                <p>Academic fundamentals supported by continuous learning and hands-on building.</p>
              </div>
            </div>

            <div className="education-grid">
              <div>
                {education.map((edu, index) => (
                  <article className="education-entry" key={`${edu.institution || 'edu'}-${index}`}>
                    <h3>{edu.institution}</h3>
                    <p className="education-degree">{edu.degree}</p>
                    <p className="education-period mono muted">{edu.period}</p>

                    {edu.highlights?.length ? (
                      <p className="education-highlights">{edu.highlights.join(', ')}</p>
                    ) : null}
                  </article>
                ))}
              </div>

              <Certifications certifications={certifications} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
