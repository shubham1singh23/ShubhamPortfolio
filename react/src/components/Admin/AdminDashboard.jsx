import { useState, useEffect, useRef } from 'react'
import './AdminDashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faSignOutAlt, faEdit, faTrash, faPlus, faDownload, faCopy, faImage } from '@fortawesome/free-solid-svg-icons'

const CLOUDINARY_UPLOAD_PRESET = 'portfolio'
const CLOUDINARY_CLOUD_NAME = 'dh9nlw5gq'
console.log(CLOUDINARY_CLOUD_NAME)
console.log(CLOUDINARY_UPLOAD_PRESET)
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const AdminDashboard = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [activeTab, setActiveTab] = useState('about')
  const [aboutImage, setAboutImage] = useState(null)
  const [aboutImagePreview, setAboutImagePreview] = useState('')
  const [exportJson, setExportJson] = useState('')
  const exportTextareaRef = useRef(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    github: '',
    live: '',
    position: 0
  })
  const [editProjectIndex, setEditProjectIndex] = useState(null)
  const [projectImagePreview, setProjectImagePreview] = useState('')
  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: '',
    category: 'Programming Languages'
  })
  const [editSkillIndex, setEditSkillIndex] = useState(null)
  const [projectImageUploading, setProjectImageUploading] = useState(false)

  // Education state
  const [educationForm, setEducationForm] = useState({
    courseName: '',
    collegeName: '',
    duration: '',
    scores: [{ examTitle: '', score: '' }],
    isVisible: true
  })
  const [editEducationIndex, setEditEducationIndex] = useState(null)

  // Certifications state
  const [certForm, setCertForm] = useState({
    certificationName: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: 'No expiry',
    credentialId: '',
    verificationLink: '',
    description: '',
    isVisible: true
  })
  const [editCertIndex, setEditCertIndex] = useState(null)

  // Expanded FontAwesome tech/coding/development icons
  const popularIcons = [
    'faReact', 'faAngular', 'faVuejs', 'faNodeJs', 'faJs', 'faPython', 'faJava', 'faPhp', 'faSwift', 'faRust', 'faGo', 'faCuttlefish', 'faHtml5', 'faCss3', 'faSass', 'faLess',
    'faBootstrap', 'faJquery', 'faLaravel', 'faDjango', 'faSpring',
    'faDatabase', 'faMongoDB', 'faMySQL', 'faPostgreSQL', 'faRedis', 'faFire',
    'faGit', 'faGithub', 'faGitlab', 'faBitbucket',
    'faDocker', 'faJenkins', 'faNpm', 'faYarn', 'faFigma', 'faSlack', 'faTrello', 'faJira',
    'faAws', 'faGoogle', 'faCloud', 'faCloudscale', 'faCloudsmith', 'faCloudversify', 'faDigitalOcean', 'faHeroku', 'faSalesforce',
    'faLinux', 'faWindows', 'faApple', 'faAndroid', 'faUbuntu', 'faRedhat', 'faCentos', 'faFedora', 'faDebian', 'faRaspberryPi',
    'faChrome', 'faFirefox', 'faEdge', 'faOpera',
    'faTerminal', 'faCode', 'faServer', 'faCogs', 'faCube', 'faProjectDiagram', 'faShieldAlt', 'faLock', 'faBug', 'faRocket', 'faMobileAlt', 'faLaptopCode', 'faNetworkWired',
    'faCloudUploadAlt', 'faCloudDownloadAlt', 'faTools', 'faClipboardCheck', 'faFileCode', 'faSitemap', 'faSyncAlt', 'faTasks', 'faUserSecret', 'faVial', 'faWrench', 'faPalette',
    'faChartBar', 'faChartLine', 'faChartPie', 'faKeyboard', 'faMicrochip', 'faRobot', 'faSatellite', 'faUserCog', 'faCloudSun', 'faCloudMoon', 'faCloudRain', 'faCloudShowersHeavy'
  ]

  // Fetch portfolio.json on load
  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(() => setPortfolio({}))
  }, [])

  // Handle About image upload to Cloudinary
  const handleAboutImageChange = async (e) => {
    const file = e.target.files[0]
    setAboutImage(file)
    if (file) {
      setAboutImagePreview(URL.createObjectURL(file))
      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.secure_url) {
        setPortfolio(prev => ({ ...prev, about: { ...prev.about, profileImage: data.secure_url } }))
      }
    }
  }

  // Handle About field changes
  const handleAboutChange = (e) => {
    setPortfolio(prev => ({
      ...prev,
      about: { ...prev.about, [e.target.name]: e.target.value }
    }))
  }

  // Handle About save (in-memory only)
  const handleAboutSave = (e) => {
    e.preventDefault()
    // No backend, just update state
  }

  // Export JSON
  const handleExportJson = () => {
    setExportJson(JSON.stringify(portfolio, null, 2))
  }

  const handleCopyExportJson = () => {
    if (exportTextareaRef.current) {
      exportTextareaRef.current.select()
      document.execCommand('copy')
    }
  }

  // Handle project image upload to Cloudinary
  const handleProjectImageChange = async (e) => {
    const file = e.target.files[0]
    setProjectImagePreview(file ? URL.createObjectURL(file) : '')
    if (file) {
      setProjectImageUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      try {
        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData })
        const data = await res.json()
        if (data.secure_url) {
          setProjectForm(prev => ({ ...prev, image: data.secure_url }))
        }
      } finally {
        setProjectImageUploading(false)
      }
    }
  }

  // Handle project form field changes
  const handleProjectFormChange = (e) => {
    setProjectForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Add or update project
  const handleProjectSave = (e) => {
    e.preventDefault()
    setPortfolio(prev => {
      const projects = prev.projects ? [...prev.projects] : []
      const techArr = projectForm.tech.split(',').map(t => t.trim()).filter(Boolean)
      const newProject = { ...projectForm, tech: techArr, position: projects.length }
      if (editProjectIndex !== null) {
        projects[editProjectIndex] = newProject
      } else {
        projects.push(newProject)
      }
      return { ...prev, projects }
    })
    setProjectForm({ title: '', description: '', tech: '', image: '', github: '', live: '', position: 0 })
    setEditProjectIndex(null)
    setProjectImagePreview('')
  }

  // Edit project
  const handleEditProject = (idx) => {
    const p = portfolio.projects[idx]
    setProjectForm({
      title: p.title,
      description: p.description,
      tech: p.tech.join(', '),
      image: p.image,
      github: p.github,
      live: p.live,
      position: p.position || idx
    })
    setEditProjectIndex(idx)
    setProjectImagePreview(p.image)
  }

  // Delete project
  const handleDeleteProject = (idx) => {
    setPortfolio(prev => {
      const projects = prev.projects ? [...prev.projects] : []
      projects.splice(idx, 1)
      return { ...prev, projects }
    })
    setEditProjectIndex(null)
    setProjectForm({ title: '', description: '', tech: '', image: '', github: '', live: '', position: 0 })
    setProjectImagePreview('')
  }

  // Handle skill form field changes
  const handleSkillFormChange = (e) => {
    setSkillForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Add or update skill
  const handleSkillSave = (e) => {
    e.preventDefault()
    setPortfolio(prev => {
      const skills = prev.skills ? [...prev.skills] : []
      const newSkill = { ...skillForm }
      if (editSkillIndex !== null) {
        skills[editSkillIndex] = newSkill
      } else {
        skills.push(newSkill)
      }
      return { ...prev, skills }
    })
    setSkillForm({ name: '', icon: '', category: 'Programming Languages' })
    setEditSkillIndex(null)
  }

  // Edit skill
  const handleEditSkill = (idx) => {
    const s = portfolio.skills[idx]
    setSkillForm({
      name: s.name,
      icon: s.icon,
      category: s.category || 'Programming Languages'
    })
    setEditSkillIndex(idx)
  }

  // Delete skill
  const handleDeleteSkill = (idx) => {
    setPortfolio(prev => {
      const skills = prev.skills ? [...prev.skills] : []
      skills.splice(idx, 1)
      return { ...prev, skills }
    })
    setEditSkillIndex(null)
    setSkillForm({ name: '', icon: '', category: 'Programming Languages' })
  }

  // Education handlers
  const handleEducationFormChange = (e) => {
    setEducationForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleEducationScoreChange = (idx, e) => {
    setEducationForm(prev => ({
      ...prev,
      scores: prev.scores.map((s, i) => i === idx ? { ...s, [e.target.name]: e.target.value } : s)
    }))
  }
  const addEducationScore = () => setEducationForm(prev => ({ ...prev, scores: [...prev.scores, { examTitle: '', score: '' }] }))
  const removeEducationScore = idx => setEducationForm(prev => ({ ...prev, scores: prev.scores.filter((_, i) => i !== idx) }))
  const handleEducationSave = (e) => {
    e.preventDefault()
    setPortfolio(prev => {
      const education = prev.education ? [...prev.education] : []
      const newEdu = { ...educationForm, scores: educationForm.scores }
      if (editEducationIndex !== null) {
        education[editEducationIndex] = newEdu
      } else {
        education.push(newEdu)
      }
      return { ...prev, education }
    })
    setEducationForm({ courseName: '', collegeName: '', duration: '', scores: [{ examTitle: '', score: '' }], isVisible: true })
    setEditEducationIndex(null)
  }
  const handleEditEducation = (idx) => {
    const e = portfolio.education[idx]
    setEducationForm({
      courseName: e.courseName,
      collegeName: e.collegeName,
      duration: e.duration,
      scores: e.scores && e.scores.length ? e.scores : [{ examTitle: '', score: '' }],
      isVisible: e.isVisible !== undefined ? e.isVisible : true
    })
    setEditEducationIndex(idx)
  }
  const handleDeleteEducation = (idx) => {
    setPortfolio(prev => {
      const education = prev.education ? [...prev.education] : []
      education.splice(idx, 1)
      return { ...prev, education }
    })
    setEditEducationIndex(null)
    setEducationForm({ courseName: '', collegeName: '', duration: '', scores: [{ examTitle: '', score: '' }], isVisible: true })
  }

  // Certification handlers
  const handleCertFormChange = (e) => {
    setCertForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleCertSave = (e) => {
    e.preventDefault()
    setPortfolio(prev => {
      const certifications = prev.certifications ? [...prev.certifications] : []
      const newCert = { ...certForm }
      if (editCertIndex !== null) {
        certifications[editCertIndex] = newCert
      } else {
        certifications.push(newCert)
      }
      return { ...prev, certifications }
    })
    setCertForm({ certificationName: '', issuingOrganization: '', issueDate: '', expiryDate: 'No expiry', credentialId: '', verificationLink: '', description: '', isVisible: true })
    setEditCertIndex(null)
  }
  const handleEditCert = (idx) => {
    const c = portfolio.certifications[idx]
    setCertForm({
      certificationName: c.certificationName,
      issuingOrganization: c.issuingOrganization,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate,
      credentialId: c.credentialId,
      verificationLink: c.verificationLink,
      description: c.description,
      isVisible: c.isVisible !== undefined ? c.isVisible : true
    })
    setEditCertIndex(idx)
  }
  const handleDeleteCert = (idx) => {
    setPortfolio(prev => {
      const certifications = prev.certifications ? [...prev.certifications] : []
      certifications.splice(idx, 1)
      return { ...prev, certifications }
    })
    setEditCertIndex(null)
    setCertForm({ certificationName: '', issuingOrganization: '', issueDate: '', expiryDate: 'No expiry', credentialId: '', verificationLink: '', description: '', isVisible: true })
  }

  if (!portfolio) {
    return <div className="admin-dashboard"><h2>Loading Portfolio...</h2></div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>Admin Portfolio Editor</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleExportJson} title="Export Portfolio JSON">
            <FontAwesomeIcon icon={faDownload} /> Export JSON
          </button>
        </div>
      </div>
      <div className="admin-dashboard-tabs">
        <button onClick={() => setActiveTab('about')}>About</button>
        <button onClick={() => setActiveTab('projects')}>Projects</button>
        <button onClick={() => setActiveTab('skills')}>Skills</button>
        <button onClick={() => setActiveTab('education')}>Education</button>
        <button onClick={() => setActiveTab('certifications')}>Certifications</button>
      </div>
      <div className="admin-dashboard-content">
        {activeTab === 'about' && (
          <div>
            <h3>About Me</h3>
            <form className="admin-form" onSubmit={handleAboutSave} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <label style={{ fontWeight: 500 }}>Profile Image:</label>
              <input type="file" accept="image/*" onChange={handleAboutImageChange} />
              {aboutImagePreview || portfolio.about?.profileImage ? (
                <img src={aboutImagePreview || portfolio.about?.profileImage} alt="Profile Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />
              ) : null}
              <input name="name" value={portfolio.about?.name || ''} onChange={handleAboutChange} placeholder="Your Name" required style={{ width: '100%' }} />
              <textarea name="description" value={portfolio.about?.description || ''} onChange={handleAboutChange} placeholder="Description" rows={3} style={{ width: '100%', resize: 'vertical' }} required />
              <button type="submit" className="btn-primary">Save About</button>
            </form>
          </div>
        )}
        {activeTab === 'projects' && (
          <div>
            <h3>Projects</h3>
            <form className="admin-form" onSubmit={handleProjectSave} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <input name="title" value={projectForm.title} onChange={handleProjectFormChange} placeholder="Project Title" required style={{ width: '100%' }} />
              <textarea name="description" value={projectForm.description} onChange={handleProjectFormChange} placeholder="Project Description" rows={2} style={{ width: '100%' }} required />
              <input name="tech" value={projectForm.tech} onChange={handleProjectFormChange} placeholder="Technologies (comma separated)" style={{ width: '100%' }} />
              <input name="github" value={projectForm.github} onChange={handleProjectFormChange} placeholder="GitHub URL" style={{ width: '100%' }} />
              <input name="live" value={projectForm.live} onChange={handleProjectFormChange} placeholder="Live Demo URL" style={{ width: '100%' }} />
              <input type="file" accept="image/*" onChange={handleProjectImageChange} />
              {projectImageUploading && <span style={{ color: '#888', fontSize: 13 }}>Uploading image...</span>}
              {projectImagePreview || projectForm.image ? (
                <img src={projectImagePreview || projectForm.image} alt="Project Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              ) : null}
              <button type="submit" className="btn-primary" disabled={projectImageUploading}>{editProjectIndex !== null ? 'Update' : 'Add'} Project</button>
              {editProjectIndex !== null && (
                <button type="button" onClick={() => { setEditProjectIndex(null); setProjectForm({ title: '', description: '', tech: '', image: '', github: '', live: '', position: 0 }); setProjectImagePreview('') }}>Cancel</button>
              )}
            </form>
            <div>
              <h4>Project List</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {portfolio.projects && portfolio.projects.length > 0 ? portfolio.projects.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: 16, border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#f9f9f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {p.image && <img src={p.image} alt={p.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
                      <div style={{ flex: 1 }}>
                        <b>{p.title}</b>
                        <div style={{ fontSize: 13, color: '#666' }}>{p.tech && p.tech.join(', ')}</div>
                        <div style={{ fontSize: 13 }}>{p.description}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                          {p.live && <span> | <a href={p.live} target="_blank" rel="noopener noreferrer">Live</a></span>}
                        </div>
                      </div>
                      <button onClick={() => handleEditProject(idx)} title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                      <button onClick={() => handleDeleteProject(idx)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </li>
                )) : <li>No projects yet.</li>}
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'skills' && (
          <div>
            <h3>Skills</h3>
            <form className="admin-form" onSubmit={handleSkillSave} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <input name="name" value={skillForm.name} onChange={handleSkillFormChange} placeholder="Skill Name" required style={{ width: '100%' }} />
              <select name="icon" value={skillForm.icon} onChange={handleSkillFormChange} style={{ width: '100%' }}>
                <option value="">-- Select Icon (or type below) --</option>
                {popularIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input name="icon" value={skillForm.icon} onChange={handleSkillFormChange} placeholder="Or type FontAwesome icon name (e.g. faReact)" style={{ width: '100%' }} />
              <select name="category" value={skillForm.category} onChange={handleSkillFormChange} style={{ width: '100%' }}>
                <option>Programming Languages</option>
                <option>Frameworks</option>
                <option>Databases</option>
                <option>Others</option>
              </select>
              <button type="submit" className="btn-primary">{editSkillIndex !== null ? 'Update' : 'Add'} Skill</button>
              {editSkillIndex !== null && (
                <button type="button" onClick={() => { setEditSkillIndex(null); setSkillForm({ name: '', icon: '', category: 'Programming Languages' }) }}>Cancel</button>
              )}
            </form>
            <div>
              <h4>Skill List</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {portfolio.skills && portfolio.skills.length > 0 ? portfolio.skills.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: 12, border: '1px solid #eee', borderRadius: 8, padding: 10, background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.icon && <FontAwesomeIcon icon={s.icon.replace('fa', 'fa-').toLowerCase()} style={{ color: '#3b82f6' }} />}
                      <b>{s.name}</b> <span style={{ color: '#888', fontSize: 13 }}>{s.category}</span> <span style={{ color: '#888', fontSize: 13 }}>{s.icon}</span>
                    </div>
                    <button onClick={() => handleEditSkill(idx)} title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                    <button onClick={() => handleDeleteSkill(idx)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                  </li>
                )) : <li>No skills yet.</li>}
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'education' && (
          <div>
            <h3>Education</h3>
            <form className="admin-form" onSubmit={handleEducationSave} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <input name="courseName" value={educationForm.courseName} onChange={handleEducationFormChange} placeholder="Course Name" required style={{ width: '100%' }} />
              <input name="collegeName" value={educationForm.collegeName} onChange={handleEducationFormChange} placeholder="College Name" required style={{ width: '100%' }} />
              <input name="duration" value={educationForm.duration} onChange={handleEducationFormChange} placeholder="Duration (e.g. 2020-2024)" style={{ width: '100%' }} />
              <div style={{ width: '100%' }}>
                <label>Scores:</label>
                {educationForm.scores.map((score, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <input name="examTitle" value={score.examTitle} onChange={e => handleEducationScoreChange(idx, e)} placeholder="Exam Title" required style={{ flex: 1 }} />
                    <input name="score" value={score.score} onChange={e => handleEducationScoreChange(idx, e)} placeholder="Score" required style={{ flex: 1 }} />
                    {educationForm.scores.length > 1 && <button type="button" onClick={() => removeEducationScore(idx)}>-</button>}
                  </div>
                ))}
                <button type="button" onClick={addEducationScore}>+ Add Score</button>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={educationForm.isVisible} onChange={e => setEducationForm(prev => ({ ...prev, isVisible: e.target.checked }))} /> Visible
              </label>
              <button type="submit" className="btn-primary">{editEducationIndex !== null ? 'Update' : 'Add'} Education</button>
              {editEducationIndex !== null && (
                <button type="button" onClick={() => { setEditEducationIndex(null); setEducationForm({ courseName: '', collegeName: '', duration: '', scores: [{ examTitle: '', score: '' }], isVisible: true }) }}>Cancel</button>
              )}
            </form>
            <div>
              <h4>Education List</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {portfolio.education && portfolio.education.length > 0 ? portfolio.education.map((e, idx) => (
                  <li key={idx} style={{ marginBottom: 12, border: '1px solid #eee', borderRadius: 8, padding: 10, background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <b>{e.courseName}</b> <span style={{ color: '#888', fontSize: 13 }}>{e.collegeName}</span> <span style={{ color: '#888', fontSize: 13 }}>{e.duration}</span>
                      <div style={{ fontSize: 13, color: '#666' }}>{e.scores && e.scores.map((s, i) => <span key={i}>{s.examTitle}: {s.score}{i < e.scores.length - 1 ? ', ' : ''}</span>)}</div>
                      <span style={{ color: '#888', fontSize: 12 }}>{e.isVisible ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <button onClick={() => handleEditEducation(idx)} title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                    <button onClick={() => handleDeleteEducation(idx)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                  </li>
                )) : <li>No education yet.</li>}
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'certifications' && (
          <div>
            <h3>Certifications</h3>
            <form className="admin-form" onSubmit={handleCertSave} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <input name="certificationName" value={certForm.certificationName} onChange={handleCertFormChange} placeholder="Certification Name" required style={{ width: '100%' }} />
              <input name="issuingOrganization" value={certForm.issuingOrganization} onChange={handleCertFormChange} placeholder="Issuing Organization" required style={{ width: '100%' }} />
              <input name="issueDate" value={certForm.issueDate} onChange={handleCertFormChange} placeholder="Issue Date (e.g., June 2024)" required style={{ width: '100%' }} />
              <input name="expiryDate" value={certForm.expiryDate} onChange={handleCertFormChange} placeholder="Expiry Date (e.g., June 2025 or No expiry)" style={{ width: '100%' }} />
              <input name="credentialId" value={certForm.credentialId} onChange={handleCertFormChange} placeholder="Credential ID (optional)" style={{ width: '100%' }} />
              <input name="verificationLink" value={certForm.verificationLink} onChange={handleCertFormChange} placeholder="Verification Link (optional)" style={{ width: '100%' }} />
              <textarea name="description" value={certForm.description} onChange={handleCertFormChange} placeholder="Short Description (optional)" rows={2} style={{ width: '100%' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={certForm.isVisible} onChange={e => setCertForm(prev => ({ ...prev, isVisible: e.target.checked }))} /> Visible
              </label>
              <button type="submit" className="btn-primary">{editCertIndex !== null ? 'Update' : 'Add'} Certification</button>
              {editCertIndex !== null && (
                <button type="button" onClick={() => { setEditCertIndex(null); setCertForm({ certificationName: '', issuingOrganization: '', issueDate: '', expiryDate: 'No expiry', credentialId: '', verificationLink: '', description: '', isVisible: true }) }}>Cancel</button>
              )}
            </form>
            <div>
              <h4>Certification List</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {portfolio.certifications && portfolio.certifications.length > 0 ? portfolio.certifications.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: 12, border: '1px solid #eee', borderRadius: 8, padding: 10, background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <b>{c.certificationName}</b> <span style={{ color: '#888', fontSize: 13 }}>{c.issuingOrganization}</span> <span style={{ color: '#888', fontSize: 13 }}>{c.issueDate} - {c.expiryDate}</span>
                      <div style={{ fontSize: 13, color: '#666' }}>{c.description}</div>
                      {c.credentialId && <div style={{ fontSize: 12, color: '#888' }}>Credential ID: {c.credentialId}</div>}
                      {c.verificationLink && <div style={{ fontSize: 12 }}><a href={c.verificationLink} target="_blank" rel="noopener noreferrer">View Certificate</a></div>}
                      <span style={{ color: '#888', fontSize: 12 }}>{c.isVisible ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <button onClick={() => handleEditCert(idx)} title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                    <button onClick={() => handleDeleteCert(idx)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                  </li>
                )) : <li>No certifications yet.</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
      {exportJson && (
        <div style={{ marginTop: 32 }}>
          <h3>Exported Portfolio JSON</h3>
          <textarea
            ref={exportTextareaRef}
            value={exportJson}
            readOnly
            style={{ width: '100%', height: 300, fontFamily: 'monospace', fontSize: 14, marginBottom: 16, background: '#181a1f', color: '#d3d6db', borderRadius: 8, border: '1px solid #444' }}
          />
          <button className="btn-primary" onClick={handleCopyExportJson} style={{ marginRight: 12 }}><FontAwesomeIcon icon={faCopy} /> Copy</button>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
