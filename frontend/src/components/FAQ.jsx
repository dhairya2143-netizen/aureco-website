import React from 'react';
import { faqs } from '../mockData';

// Answers stay open rather than sitting behind an accordion: the FAQPage schema
// in public/index.html has to match visible text, and collapsed copy is weighted
// lower by both crawlers and answer engines.
const FAQ = () => (
  <section id="faq" className="faq-section" aria-labelledby="faq-title">
    <div className="faq-container">
      <div className="faq-header">
        <h2 className="faq-title" id="faq-title" data-paper>
          Questions brands ask us
        </h2>
        <p className="faq-subtitle" data-paper data-paper-delay={90}>
          Minimum orders, materials, lead times and cost, answered plainly before you enquire.
        </p>
      </div>

      <dl className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={faq.id} data-paper data-paper-delay={120 + index * 40}>
            <dt className="faq-question">
              <h3>{faq.question}</h3>
            </dt>
            <dd className="faq-answer">{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <p className="faq-footnote">
        Still deciding? Send the product, the quantity and your deadline through the enquiry
        form below and we will come back within 24 hours.
      </p>
    </div>
  </section>
);

export default FAQ;
