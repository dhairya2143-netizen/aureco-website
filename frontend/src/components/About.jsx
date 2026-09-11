import React from 'react';
import { aboutData } from '../mockData';

const About = () => {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-headline" id="about-title" data-paper>{aboutData.headline}</h2>
          <p className="about-body" data-paper data-paper-delay={90}>{aboutData.body}</p>
        </div>
        <div className="about-image-wrapper" data-paper data-paper-delay={180}>
          <div
            className="about-image"
            style={{ backgroundImage: `url(${aboutData.image})` }}
            role="img"
            aria-label={aboutData.imageAlt}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
