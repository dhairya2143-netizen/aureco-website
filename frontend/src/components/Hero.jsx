import React, { useEffect, useState } from 'react';
import { heroData } from '../mockData';
import HangTag from './HangTag';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section" aria-label="Aureco custom packaging for fashion brands">
      <div
        className="hero-background-image"
        style={{ backgroundImage: `url(${heroData.image})` }}
        role="img"
        aria-label={heroData.imageAlt}
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
          <p className="hero-eyebrow">{heroData.eyebrow}</p>
          <div className="hero-divider" aria-hidden="true" />
          <h1 className="hero-headline">{heroData.headline}</h1>
          <p className="hero-subheadline">{heroData.subheadline}</p>
        </div>
        <HangTag />
      </div>
    </section>
  );
};

export default Hero;
