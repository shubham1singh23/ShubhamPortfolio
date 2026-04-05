import './Home.css'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Projects from '../components/Projects/Projects'
import Journey from '../components/Journey/Journey'
import Contact from '../components/Contact/Contact'
import Education from '../components/Education/Education'
import Footer from '../components/Footer/Footer'

const normalizePortfolio = (data) => {
  const aboutDescription = data?.about?.description || ''
  const normalizedMeta = {
    name: data?.meta?.name || data?.about?.name || '',
    tagline: data?.meta?.tagline || aboutDescription.split('.').slice(0, 2).join('.').trim(),
    availability: data?.meta?.availability || '',
    email: data?.meta?.email || '',
    resumeUrl: data?.meta?.resumeUrl || data?.resumeUrl || ''
  }

  const normalizedAbout = {
    ...data?.about,
    bio: data?.about?.bio || aboutDescription
  }

  const normalizedSkills = Array.isArray(data?.skills)
    ? data.skills.reduce((acc, skill) => {
      const category = skill?.category || 'Others'
      if (!acc[category]) acc[category] = []
      if (skill?.name) acc[category].push(skill.name)
      return acc
    }, {})
    : {}

  const normalizedProjects = Array.isArray(data?.projects)
    ? data.projects.map((project, index) => ({
      ...project,
      technologies: project?.technologies || project?.tech || [],
      githubUrl: project?.githubUrl || project?.github || '',
      liveUrl: project?.liveUrl || project?.live || '',
      featured: typeof project?.featured === 'boolean' ? project.featured : index < 3,
      year: project?.year || ''
    }))
    : []

  const normalizedEducation = Array.isArray(data?.education)
    ? data.education.map(item => ({
      ...item,
      institution: item?.institution || item?.collegeName || '',
      degree: item?.degree || item?.courseName || '',
      period: item?.period || item?.duration || '',
      highlights: Array.isArray(item?.highlights)
        ? item.highlights
        : (item?.scores || []).map(score => `${score.examTitle}: ${score.score}`)
    }))
    : []

  const normalizedCertifications = Array.isArray(data?.certifications)
    ? data.certifications.map(cert => ({
      ...cert,
      name: cert?.name || cert?.certificationName || '',
      issuer: cert?.issuer || cert?.issuingOrganization || '',
      year: cert?.year || cert?.issueDate || ''
    }))
    : []

  return {
    ...data,
    meta: normalizedMeta,
    about: normalizedAbout,
    skills: normalizedSkills,
    projects: normalizedProjects,
    education: normalizedEducation,
    certifications: normalizedCertifications,
    experience: Array.isArray(data?.experience) ? data.experience : [],
    social: Array.isArray(data?.social) ? data.social : []
  }
}

const Home = ({ darkMode, toggleDarkMode }) => {
  const [portfolio, setPortfolio] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch('/data/portfolio.json')
        const data = await response.json()
        setPortfolio(normalizePortfolio(data))
      } catch {
        setPortfolio(normalizePortfolio({}))
      } finally {
        requestAnimationFrame(() => setIsReady(true))
      }
    }

    loadPortfolio()
  }, [])

  const pageClassName = useMemo(
    () => `home ${isReady ? 'home-loaded' : ''}`,
    [isReady]
  )

  if (!portfolio) {
    return <div className="home" />
  }

  return (
    <div className={pageClassName}>
      <div className="home-ambient home-ambient-one" aria-hidden="true" />
      <div className="home-ambient home-ambient-two" aria-hidden="true" />
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        resumeUrl={portfolio?.meta?.resumeUrl}
        showJourney={(portfolio?.experience || []).length > 1}
      />
      <main className="home-main">
        <Hero portfolio={portfolio} />
        <About portfolio={portfolio} />
        <Projects portfolio={portfolio} />
        {(portfolio?.experience || []).length > 1 ? (
          <Journey portfolio={portfolio} />
        ) : null}
        <Education portfolio={portfolio} />
        <Contact portfolio={portfolio} />
      </main>
      <Footer portfolio={portfolio} />
    </div>
  )
}

export default Home
