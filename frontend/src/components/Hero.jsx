import React, { useEffect, useState } from 'react';
import { heroData } from '../mockData';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background-image" style={{ backgroundImage: `url(${heroData.image})` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
          <div className="hero-divider" />
          <h1 className="hero-headline">{heroData.headline}</h1>
          <p className="hero-subheadline">{heroData.subheadline}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
