import React from 'react';
import { navLinks, footerData } from '../mockData';

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
            <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
            <a href={`tel:${footerData.phone}`}>{footerData.phone}</a>
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
