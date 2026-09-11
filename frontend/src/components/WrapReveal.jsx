import React, { useEffect, useRef } from 'react';
import { revealItems } from '../mockData';
import { prefersReducedMotion } from '../lib/paperMotion';

const WrapReveal = () => {
  const frameRefs = useRef([]);

  useEffect(() => {
    const frames = frameRefs.current.filter(Boolean);
    if (!frames.length) return undefined;

    if (prefersReducedMotion()) {
      frames.forEach((frame) => frame.classList.add('is-unwrapped'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-unwrapped');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );

    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="wrap-reveal" className="wrap-reveal-section" aria-labelledby="wrap-reveal-title">
      <div className="wrap-reveal-container">
        <div className="wrap-reveal-header">
          <h2 className="wrap-reveal-title" id="wrap-reveal-title" data-paper>See it made up.</h2>
          <p className="wrap-reveal-subtitle" data-paper data-paper-delay={90}>
            Our own packaging suite, produced exactly the way yours would be.
          </p>
        </div>

        <div className="wrap-reveal-grid">
          {revealItems.map((item, index) => (
            <figure className="wrap-item" data-paper data-paper-delay={index * 90} key={item.id}>
              <div
                className="wrap-frame"
                style={{ aspectRatio: `${item.w} / ${item.h}` }}
                ref={(el) => (frameRefs.current[index] = el)}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.name}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  decoding="async"
                />
                <div className="wrap-sheet" aria-hidden="true" />
                <div className="wrap-seal" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3c-3.5 3-5 6.2-5 9a5 5 0 0 0 10 0c0-2.8-1.5-6-5-9z"
                      fill="var(--aureco-off-white)"
                    />
                    <path d="M12 6.5v12" stroke="var(--aureco-off-white)" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>
              <figcaption>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WrapReveal;
