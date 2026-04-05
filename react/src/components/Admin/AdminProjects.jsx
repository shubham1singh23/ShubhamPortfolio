import './AdminProjects.css'
import { useState } from 'react'
import { normalizeImageUrl, uploadToCloudinary } from '../../utils/cloudinaryUpload'

const AdminProjects = ({ projects, onChange }) => {
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const updateProject = (index, field, value) => {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const updateTechnologies = (index, value) => {
    updateProject(
      index,
      'tech',
      value.split(',').map(item => item.trim()).filter(Boolean)
    )
  }

  const handleProjectImageUpload = async (index, event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setUploadingIndex(index)
    setUploadStatus(`Uploading image for project ${index + 1}...`)

    const result = await uploadToCloudinary(file)
    if (result.success) {
      updateProject(index, 'image', result.url)
      setUploadStatus(`Project image uploaded ✓ (${projects[index]?.title || index + 1})`)
    } else {
      setUploadStatus(`Project image upload failed: ${result.reason}`)
    }

    setUploadingIndex(null)
    event.target.value = ''
  }

  return (
    <div className="admin-panel admin-projects-section">
      <h3>Projects</h3>
      {uploadStatus ? <p className="admin-upload-status">{uploadStatus}</p> : null}
      <div className="array-list">
        {projects.map((project, index) => (
          <div className="array-item" key={`${project.title || 'project'}-${index}`}>
            <input
              value={project.title || ''}
              placeholder="Title"
              onChange={e => updateProject(index, 'title', e.target.value)}
            />
            <textarea
              value={project.description || ''}
              placeholder="Description"
              onChange={e => updateProject(index, 'description', e.target.value)}
            />
            <input
              value={(project.tech || project.technologies || []).join(', ')}
              placeholder="Technologies (comma-separated)"
              onChange={e => updateTechnologies(index, e.target.value)}
            />
            <input
              value={project.image || ''}
              placeholder="Image URL"
              onChange={e => updateProject(index, 'image', normalizeImageUrl(e.target.value))}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => handleProjectImageUpload(index, e)}
              disabled={uploadingIndex === index}
            />
            {project.image ? (
              <img
                className="admin-image-preview"
                src={normalizeImageUrl(project.image)}
                alt={`${project.title || 'Project'} preview`}
                loading="lazy"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            <input
              value={project.github || project.githubUrl || ''}
              placeholder="GitHub URL"
              onChange={e => {
                updateProject(index, 'github', e.target.value)
                updateProject(index, 'githubUrl', e.target.value)
              }}
            />
            <input
              value={project.live || project.liveUrl || ''}
              placeholder="Live URL"
              onChange={e => {
                updateProject(index, 'live', e.target.value)
                updateProject(index, 'liveUrl', e.target.value)
              }}
            />
            <button
              className="mono admin-text-btn"
              onClick={() => onChange(projects.filter((_, idx) => idx !== index))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        className="mono admin-text-btn"
        onClick={() => onChange([...(projects || []), { title: '', description: '', tech: [], image: '', github: '', live: '' }])}
      >
        Add New
      </button>
    </div>
  )
}

export default AdminProjects