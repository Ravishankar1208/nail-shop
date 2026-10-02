import { useState } from 'react';
import { Link } from 'react-router-dom';
import './component.css';
import './footer-styles.css';

const socialLinks = [
  { label: 'Instagram', href: '#', icon: '◎' },
  { label: 'Pinterest', href: '#', icon: '◌' },
  { label: 'Facebook', href: '#', icon: '◍' },
];

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col footer-col-brand">
            <Link to="/" className="brand footer-brand" aria-label="Nail Atelier home">
              <span className="brand-mark">N</span>
              <span className="brand-text">Nail Atelier</span>
            </Link>
            <p className="footer-copy">
              Curated nail colors and care essentials designed to elevate every ritual.
            </p>
            <div className="footer-social" aria-label="Social media links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} aria-label={link.label} className="footer-social-link">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/categories">Collections</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-list">
              <li><Link to="/shop">Gel Polish</Link></li>
              <li><Link to="/shop">Classic Colors</Link></li>
              <li><Link to="/shop">Nail Art</Link></li>
              <li><Link to="/shop">Care Essentials</Link></li>
              <li><Link to="/shop">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-list">
              <li><Link to="/contact">Shipping</Link></li>
              <li><Link to="/contact">Returns</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
              <li><Link to="/contact">Support</Link></li>
              <li><Link to="/admin/login">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <div className="footer-newsletter-copy">
            <p className="footer-newsletter-label">Stay in the Color</p>
            <p className="footer-newsletter-text">Get updates on new shades, launches and offers.</p>
          </div>

          <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
            <div className="footer-newsletter-fields">
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer-newsletter-button">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <div className="footer-copyright">© 2026 Nail Atelier. All rights reserved.</div>
            <div className="footer-bottom-links">
              <Link to="/about">Privacy Policy</Link>
              <Link to="/contact">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
