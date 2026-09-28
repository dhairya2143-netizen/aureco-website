import React from 'react';
import { industries } from '../mockData';

const Industries = () => {
  return (
    <section id="industries" className="industries-section" aria-labelledby="industries-title">
      <div className="industries-container">
        <div className="industries-header">
          <span className="eyebrow" data-paper>Who we serve</span>
          <h2 className="industries-title" id="industries-title" data-paper data-paper-delay={90}>
            Built for fashion, ready for anyone
          </h2>
          <p className="industries-subtitle" data-paper data-paper-delay={180}>
            We work primarily with clothing brands, fashion designers, apparel retailers
            and jewellery boutiques across India. The packaging suits any brand that values
            the unboxing moment.
          </p>
        </div>

        <div className="industries-grid">
          {industries.map((industry, index) => (
            <div
              key={industry.id}
              className="industry-card"
              data-paper
              data-paper-delay={180 + index * 90}
            >
              <span className="industry-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="industry-body">
                <h3 className="industry-title">{industry.title}</h3>
                <p className="industry-description">{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
