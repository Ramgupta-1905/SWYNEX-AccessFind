import { MapPin, Heart, ArrowUpRight } from 'lucide-react'

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <span className="footer-logo-icon">
              <MapPin size={19} />
            </span>
            <span>AccessFind</span>
          </a>

          <p>
            Making public spaces easier to navigate, more accessible,
            and more inclusive for everyone.
          </p>

          <span className="footer-tagline">
            Built with <Heart size={12} fill="currentColor" /> for everyone.
          </span>
        </div>

        <div className="footer-navigation">
          <h3>Explore</h3>
          {footerLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </div>

        <div className="footer-note">
          <h3>Our purpose</h3>
          <p>
            Helping people discover public facilities with clearer
            accessibility information and greater confidence.
          </p>
          <a href="#home" className="footer-back-to-top">
            Back to top ↑
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AccessFind. All rights reserved.</p>
        <p>Accessibility matters. Everyone belongs.</p>
      </div>
    </footer>
  )
}