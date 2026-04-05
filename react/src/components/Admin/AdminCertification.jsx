import './AdminCertification.css'

const AdminCertification = ({ certifications, onChange }) => {
  const updateItem = (index, field, value) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="admin-panel admin-certification-section">
      <h3>Certifications</h3>
      <div className="array-list">
        {certifications.map((cert, index) => (
          <div className="array-item" key={`${cert.certificationName || 'cert'}-${index}`}>
            <input
              value={cert.certificationName || ''}
              placeholder="Certification name"
              onChange={e => updateItem(index, 'certificationName', e.target.value)}
            />
            <input
              value={cert.issuingOrganization || ''}
              placeholder="Issuer"
              onChange={e => updateItem(index, 'issuingOrganization', e.target.value)}
            />
            <input
              value={cert.issueDate || ''}
              placeholder="Year / Date"
              onChange={e => updateItem(index, 'issueDate', e.target.value)}
            />
            <input
              value={cert.verificationLink || ''}
              placeholder="Verification URL"
              onChange={e => updateItem(index, 'verificationLink', e.target.value)}
            />
            <button
              className="mono admin-text-btn"
              onClick={() => onChange(certifications.filter((_, idx) => idx !== index))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="mono admin-text-btn"
        onClick={() => onChange([...(certifications || []), { certificationName: '', issuingOrganization: '', issueDate: '' }])}
      >
        Add New
      </button>
    </div>
  )
}

export default AdminCertification