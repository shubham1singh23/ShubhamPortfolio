import './Certifications.css'

const Certifications = ({ certifications }) => {
  if (!certifications?.length) {
    return null
  }

  return (
    <div className="certifications-subsection">
      <h3>Certifications and courses</h3>
      <div className="cert-list">
        {certifications.map((cert, index) => (
          <div className="cert-line" key={`${cert.name || 'cert'}-${index}`}>
            <span className="cert-name">{cert.name}</span>
            <span className="mono cert-meta">{cert.issuer} / {cert.year}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certifications
