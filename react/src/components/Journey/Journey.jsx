import './Journey.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LEETCODE_USER = 'shubham1singh23'
const GITHUB_USER = 'shubham1singh23'

const cardVariants = {
  offscreen: { opacity: 0, y: 60 },
  onscreen: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.18, duration: 0.9 } }
}

const Journey = () => {
  const [leetcode, setLeetcode] = useState(null)
  const [github, setGithub] = useState(null)
  const [githubRepos, setGithubRepos] = useState([])

  useEffect(() => {
    // LeetCode stats from third-party API
    fetch(`https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`)
      .then(res => res.json())
      .then(data => setLeetcode(data))
      .catch(() => setLeetcode(null))
    // GitHub user
    fetch(`https://api.github.com/users/${GITHUB_USER}`)
      .then(res => res.json())
      .then(data => setGithub(data))
      .catch(() => setGithub(null))
    // GitHub repos
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
      .then(res => res.json())
      .then(data => setGithubRepos(Array.isArray(data) ? data : []))
      .catch(() => setGithubRepos([]))
  }, [])

  return (
    <motion.section
      id="journey"
      className="journey-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Journey</h2>
      <div className="journey-content">
        {/* LeetCode Card */}
        <motion.div
          className="journey-card leetcode-card"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="journey-card-header">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="journey-icon" />
            <div>
              <div className="journey-username">@{LEETCODE_USER}</div>
              <div className="journey-title">LeetCode</div>
            </div>
          </div>
          <div className="journey-desc">Solving algorithmic challenges and improving problem-solving skills through consistent practice on LeetCode.</div>
          <div className="journey-stats">
            <div><b>Problems Solved</b><br />{leetcode ? leetcode.totalSolved : '...'}</div>
            <div><b>Language</b><br />{leetcode ? leetcode.languageProblemCount?.[0]?.languageName || 'Java' : '...'}</div>
            <div><b>Acceptance Rate</b><br />{leetcode ? leetcode.acceptanceRate + '%' : '...'}</div>
          </div>
          <div className="journey-note">LeetCode Journey<br />Consistently solving problems and participating in contests to sharpen algorithmic thinking and problem-solving skills.</div>
          <a href={`https://leetcode.com/u/${LEETCODE_USER}/`} target="_blank" rel="noopener noreferrer" className="journey-link">View Full Profile</a>
        </motion.div>
        {/* GitHub Card */}
        <motion.div
          className="journey-card github-card"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="journey-card-header">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="journey-icon" />
            <div>
              <div className="journey-username">@{GITHUB_USER}</div>
              <div className="journey-title">GitHub</div>
            </div>
          </div>
          <div className="journey-desc">Building and contributing to open-source projects, showcasing full-stack development skills and collaborative coding.</div>
          <div className="journey-stats">
            <div><b>Repositories</b><br />{githubRepos.length > 0 ? githubRepos.length : '...'}</div>
            <div><b>Contributions</b><br />{github ? github.public_gists + github.public_repos : '...'}</div>
            <div><b>Stars</b><br />{githubRepos.length > 0 ? githubRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0) : '...'}</div>
          </div>
          <div className="journey-note">Open Source Contributions<br />Building innovative projects and collaborating with the developer community through meaningful contributions.</div>
          <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer" className="journey-link">View Full Profile</a>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Journey
