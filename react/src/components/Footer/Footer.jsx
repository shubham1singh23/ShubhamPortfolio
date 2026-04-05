import './Footer.css'

const Footer = ({ portfolio }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <div>
          <span className="mono muted">Copyright {new Date().getFullYear()} {portfolio?.meta?.name}</span>
        </div>
        <span className="mono muted">Built with React / designed for clarity and momentum</span>
      </div>
    </div>
  </footer>
)

export default Footer
