import React from 'react';
import { navLinks, footerData } from '../mockData';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-divider" />
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">Aureco</h3>
            <p className="footer-tagline">{footerData.tagline}</p>
          </div>

          <nav className="footer-nav">
            <a href="/" onClick={(e) => scrollToSection(e, '/')}>
              Home
            </a>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="footer-contact">
            <a href={`mailto:${footerData.email}`} className="footer-contact-item">
              <Mail size={18} />
              <span>{footerData.email}</span>
            </a>
            <a href={`tel:${footerData.phone}`} className="footer-contact-item">
              <Phone size={18} />
              <span>{footerData.phone}</span>
            </a>
            <a 
              href={footerData.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-contact-item footer-instagram"
            >
              <Instagram size={18} />
              <span>@aurecopackaging</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
