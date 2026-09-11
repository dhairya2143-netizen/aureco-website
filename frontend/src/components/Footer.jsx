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
          <div className="footer-brand" data-paper>
            <h2 className="footer-logo">Aureco</h2>
            <p className="footer-tagline">{footerData.tagline}</p>
            <p className="footer-blurb">{footerData.blurb}</p>
          </div>

          <nav className="footer-nav" data-paper data-paper-delay={90} aria-label="Footer navigation">
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

          <div className="footer-contact" data-paper data-paper-delay={180}>
            <a
              href={`mailto:${footerData.email}`}
              className="footer-contact-item"
              aria-label={`Email Aureco at ${footerData.email}`}
            >
              <Mail size={18} aria-hidden="true" />
              <span>{footerData.email}</span>
            </a>
            <a
              href={`tel:${footerData.phone}`}
              className="footer-contact-item"
              aria-label={`Call Aureco on ${footerData.phone}`}
            >
              <Phone size={18} aria-hidden="true" />
              <span>{footerData.phone}</span>
            </a>
            <a
              href={footerData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item footer-instagram"
              aria-label="Aureco on Instagram, opens in a new tab"
            >
              <Instagram size={18} aria-hidden="true" />
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
