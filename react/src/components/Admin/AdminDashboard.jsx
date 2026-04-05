import { useEffect, useMemo, useState } from 'react'
import './AdminDashboard.css'
import AdminProjects from './AdminProjects'
import AdminEducation from './AdminEducation'
import AdminCertification from './AdminCertification'
import { triggerGithubWebhook } from '../../utils/webhookTrigger'
import { normalizeImageUrl, uploadToCloudinary } from '../../utils/cloudinaryUpload'

const AdminDashboard = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [activeTab, setActiveTab] = useState('about')
  const [saveStatus, setSaveStatus] = useState('')
  const [exportJson, setExportJson] = useState('')
  const [profileUploading, setProfileUploading] = useState(false)
  const [profileUploadStatus, setProfileUploadStatus] = useState('')

  const tabs = useMemo(() => ([
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' }
  ]), [])

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(() => setPortfolio({}))
  }, [])

  const handleExportJson = () => {
    setExportJson(JSON.stringify(portfolio, null, 2))
  }

  const handleSave = async () => {
    if (!portfolio) {
      return
    }

    setSaveStatus('Saving...')
    localStorage.setItem('portfolio-admin-draft', JSON.stringify(portfolio))

    const webhookResult = await triggerGithubWebhook()
    if (webhookResult.success) {
      setSaveStatus('Saved & deploy triggered ✓')
    } else {
      setSaveStatus(`Saved locally (webhook: ${webhookResult.reason})`)
    }
  }

  const updateAbout = updates => {
    setPortfolio(prev => ({
      ...prev,
      about: {
        ...(prev?.about || {}),
        ...updates
      }
    }))
  }

  const updateMeta = updates => {
    setPortfolio(prev => ({
      ...prev,
      meta: {
        ...(prev?.meta || {}),
        ...updates
      }
    }))
  }

  const updateSkills = skills => setPortfolio(prev => ({ ...prev, skills }))
  const updateProjects = projects => setPortfolio(prev => ({ ...prev, projects }))
  const updateEducation = education => setPortfolio(prev => ({ ...prev, education }))
  const updateCertifications = certifications => setPortfolio(prev => ({ ...prev, certifications }))

  const handleProfileImageUpload = async event => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setProfileUploading(true)
    setProfileUploadStatus('Uploading profile image...')

    const result = await uploadToCloudinary(file)
    if (result.success) {
      updateAbout({ profileImage: result.url })
      setProfileUploadStatus('Profile image uploaded ✓')
    } else {
      setProfileUploadStatus(`Upload failed: ${result.reason}`)
    }

    setProfileUploading(false)
    event.target.value = ''
  }

  if (!portfolio) {
    return <div className="admin-dashboard"><p>Loading...</p></div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <span className="mono">Portfolio Admin</span>
        <div className="admin-topbar-actions">
          <a href="/" target="_blank" rel="noopener noreferrer">View Live →</a>
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </header>

      {saveStatus ? <p className="admin-save-status mono">{saveStatus}</p> : null}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={tab.id === activeTab ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="admin-content">
        {activeTab === 'about' && (
          <div className="admin-panel">
            <h3>About</h3>
            <label>Name</label>
            <input
              value={portfolio?.about?.name || ''}
              onChange={e => updateAbout({ name: e.target.value })}
            />
            <label>Bio</label>
            <textarea
              value={portfolio?.about?.description || ''}
              onChange={e => updateAbout({ description: e.target.value })}
            />
            <label>Profile Image URL</label>
            <input
              value={portfolio?.about?.profileImage || ''}
              onChange={e => updateAbout({ profileImage: normalizeImageUrl(e.target.value) })}
            />
            <label>Upload Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              disabled={profileUploading}
            />
            {profileUploadStatus ? <p className="admin-upload-status">{profileUploadStatus}</p> : null}
            {portfolio?.about?.profileImage ? (
              <img
                className="admin-image-preview"
                src={normalizeImageUrl(portfolio.about.profileImage)}
                alt="Profile preview"
                loading="lazy"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}

            <label>Tagline</label>
            <input
              value={portfolio?.meta?.tagline || ''}
              onChange={e => updateMeta({ tagline: e.target.value })}
            />
            <label>Availability</label>
            <input
              value={portfolio?.meta?.availability || ''}
              onChange={e => updateMeta({ availability: e.target.value })}
            />
            <label>Email</label>
            <input
              value={portfolio?.meta?.email || ''}
              onChange={e => updateMeta({ email: e.target.value })}
            />
            <label>Resume URL</label>
            <input
              value={portfolio?.meta?.resumeUrl || ''}
              onChange={e => updateMeta({ resumeUrl: e.target.value })}
            />
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="admin-panel">
            <h3>Skills</h3>
            {Array.isArray(portfolio.skills) ? (
              <div className="array-list">
                {portfolio.skills.map((skill, index) => (
                  <div className="array-item" key={`${skill.name || 'skill'}-${index}`}>
                    <input
                      value={skill.name || ''}
                      placeholder="Skill"
                      onChange={e => {
                        const updated = [...portfolio.skills]
                        updated[index] = { ...updated[index], name: e.target.value }
                        updateSkills(updated)
                      }}
                    />
                    <input
                      value={skill.category || ''}
                      placeholder="Category"
                      onChange={e => {
                        const updated = [...portfolio.skills]
                        updated[index] = { ...updated[index], category: e.target.value }
                        updateSkills(updated)
                      }}
                    />
                    <button
                      className="mono admin-text-btn"
                      onClick={() => {
                        const updated = portfolio.skills.filter((_, idx) => idx !== index)
                        updateSkills(updated)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <button
              className="mono admin-text-btn"
              onClick={() => updateSkills([...(portfolio.skills || []), { name: '', category: 'Others' }])}
            >
              Add New
            </button>
          </div>
        )}

        {activeTab === 'projects' && (
          <AdminProjects
            projects={portfolio.projects || []}
            onChange={updateProjects}
          />
        )}

        {activeTab === 'education' && (
          <AdminEducation education={portfolio.education || []} onChange={updateEducation} />
        )}

        {activeTab === 'certifications' && (
          <AdminCertification
            certifications={portfolio.certifications || []}
            onChange={updateCertifications}
          />
        )}

          {exportJson ? (
            <div className="admin-panel admin-export">
              <h3>Export JSON</h3>
              <textarea value={exportJson} readOnly />
            </div>
          ) : null}
        </section>
      </div>

      {exportJson ? (
        <button className="mono admin-text-btn" onClick={handleExportJson}>Refresh Export JSON</button>
      ) : (
        <button className="mono admin-text-btn" onClick={handleExportJson}>Export JSON</button>
      )}
    </div>
  )
}

export default AdminDashboard
