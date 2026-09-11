import React from 'react';
import { industries } from '../mockData';
import { Scissors, Shirt, Store, Gem } from 'lucide-react';

const iconMap = {
  Scissors: Scissors,
  Shirt: Shirt,
  Store: Store,
  Gem: Gem
};

const Industries = () => {
  return (
    <section id="industries" className="industries-section">
      <div className="industries-container">
        <div className="industries-header">
          <h2 className="industries-title" data-paper>Built for Fashion. Ready for Anyone.</h2>
          <p className="industries-subtitle" data-paper data-paper-delay={90}>
            We work primarily with clothing brands, fashion designers, and apparel retailers,
            but our solutions extend to any brand that values the unboxing moment.
          </p>
        </div>

        <div className="industries-grid">
          {industries.map((industry, index) => {
            const IconComponent = iconMap[industry.icon] || Store;
            return (
              <div
                key={industry.id}
                className="industry-card"
                data-paper
                data-paper-delay={180 + index * 90}
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
