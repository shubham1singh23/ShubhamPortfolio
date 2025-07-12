import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-links">
        <a href="https://github.com/shubham1singh23" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} /> GitHub
        </a>
        <a href="https://leetcode.com/u/shubham1singh23/" target="_blank" rel="noopener noreferrer">
          LeetCode
        </a>
        <a href="https://www.linkedin.com/in/shubham-singh-9765b9287" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
        </a>
        <a href="https://x.com/Shubham1singh23?t=qj1fd292B-FdgWjTnVnqcA&s=09" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} /> Twitter
        </a>
      </div>
      <p className="footer-copy">&copy; {new Date().getFullYear()} Shubham Singh. All rights reserved.</p>
    </div>
  </footer>
)

export default Footer
