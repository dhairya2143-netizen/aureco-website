import React, { useEffect, useRef, useState } from 'react';
import { heroData } from '../mockData';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-background-image" style={{ backgroundImage: `url(${heroData.image})` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
          <div className="hero-divider" />
          <h1 className="hero-headline">{heroData.headline}</h1>
          <p className="hero-subheadline">{heroData.subheadline}</p>
          <button onClick={scrollToContact} className="hero-cta">
            {heroData.ctaText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
