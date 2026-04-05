import './AdminEducation.css'

const AdminEducation = ({ education, onChange }) => {
  const updateItem = (index, field, value) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const updateHighlights = (index, value) => {
    updateItem(
      index,
      'scores',
      value.split(',').map(item => item.trim()).filter(Boolean).map(item => ({ examTitle: item, score: '' }))
    )
  }

  return (
    <div className="admin-panel admin-education-section">
      <h3>Education</h3>
      <div className="array-list">
        {education.map((item, index) => (
          <div className="array-item" key={`${item.collegeName || 'edu'}-${index}`}>
            <input
              value={item.courseName || ''}
              placeholder="Course / Degree"
              onChange={e => updateItem(index, 'courseName', e.target.value)}
            />
            <input
              value={item.collegeName || ''}
              placeholder="Institution"
              onChange={e => updateItem(index, 'collegeName', e.target.value)}
            />
            <input
              value={item.duration || ''}
              placeholder="Period"
              onChange={e => updateItem(index, 'duration', e.target.value)}
            />
            <input
              value={(item.scores || []).map(score => score.examTitle || score.score).join(', ')}
              placeholder="Highlights (comma-separated)"
              onChange={e => updateHighlights(index, e.target.value)}
            />

            <button
              className="mono admin-text-btn"
              onClick={() => onChange(education.filter((_, idx) => idx !== index))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="mono admin-text-btn"
        onClick={() => onChange([...(education || []), { courseName: '', collegeName: '', duration: '', scores: [] }])}
      >
        Add New
      </button>
    </div>
  )
}

export default AdminEducation
