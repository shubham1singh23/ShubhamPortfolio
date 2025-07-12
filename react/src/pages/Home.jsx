import './Home.css'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Projects from '../components/Projects/Projects'
import Skills from '../components/Skills/Skills'
import Journey from '../components/Journey/Journey'
import Contact from '../components/Contact/Contact'
import Education from '../components/Education/Education'
import Certifications from '../components/Certifications/Certifications'

const Home = ({ darkMode }) => {
  return (
    <div className="home">
      <Hero darkMode={darkMode} />
      <About />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <Journey />
      <Contact />
    </div>
  )
}

export default Home
