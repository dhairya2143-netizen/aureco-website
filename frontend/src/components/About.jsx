import React from 'react';
import { aboutData } from '../mockData';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-headline" data-paper>{aboutData.headline}</h2>
          <p className="about-body" data-paper data-paper-delay={90}>{aboutData.body}</p>
        </div>
        <div className="about-image-wrapper" data-paper data-paper-delay={180}>
          <div className="about-image" style={{ backgroundImage: `url(${aboutData.image})` }} />
        </div>
      </div>
    </section>
  );
};

export default About;
