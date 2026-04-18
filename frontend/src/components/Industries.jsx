import React, { useEffect, useRef, useState } from 'react';
import { industries } from '../mockData';
import { Scissors, Shirt, Store, Gem } from 'lucide-react';

const iconMap = {
  Scissors: Scissors,
  Shirt: Shirt,
  Store: Store,
  Gem: Gem
};

const Industries = () => {
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
    <section id="industries" className="industries-section" ref={sectionRef}>
      <div className="industries-container">
        <div className={`industries-header ${isVisible ? 'visible' : ''}`}>
          <h2 className="industries-title">Built for Fashion. Ready for Anyone.</h2>
          <p className="industries-subtitle">
            We work primarily with clothing brands, fashion designers, and apparel retailers — 
            but our solutions extend to any brand that values the unboxing moment.
          </p>
        </div>
        
        <div className="industries-grid">
          {industries.map((industry, index) => {
            const IconComponent = iconMap[industry.icon] || Store;
            return (
              <div
                key={industry.id}
                className={`industry-card ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="industry-icon">
                  <IconComponent size={32} />
                </div>
                <h3 className="industry-title">{industry.title}</h3>
                <p className="industry-description">{industry.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Industries;
