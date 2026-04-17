import React, { useEffect, useRef, useState } from 'react';
import { aboutData } from '../mockData';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-container">
        <div className={`about-text ${isVisible ? 'visible' : ''}`}>
          <h2 className="about-headline">{aboutData.headline}</h2>
          <p className="about-body">{aboutData.body}</p>
        </div>
        <div className={`about-image-wrapper ${isVisible ? 'visible' : ''}`}>
          <div className="about-image" style={{ backgroundImage: `url(${aboutData.image})` }} />
        </div>
      </div>
    </section>
  );
};

export default About;
