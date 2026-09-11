import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/paperMotion';

// Damped harmonic oscillator, driven by scroll velocity. The tag swings like
// a pendulum from the string's anchor at the ceiling, not from its own centre.
const STIFFNESS = 0.008; // restoring force toward vertical
const DAMPING = 0.94;    // velocity retained per frame (air resistance)
const IMPULSE = 0.03;    // how hard scroll movement kicks the tag
const MAX_KICK = 3.2;    // clamp so a fast flick cannot spin it
const SLEEP = 0.008;     // below this, the loop stops itself

const HangTag = () => {
  const wrapRef = useRef(null);
  const rotatorRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rotator = rotatorRef.current;
    if (!wrap || !rotator) return undefined;

    if (prefersReducedMotion()) {
      rotator.style.transform = 'rotate(0deg)';
      return undefined;
    }

    let angle = 0;
    let velocity = 0;
    let kick = 0;
    let lastScrollY = window.scrollY;
    let rafId = null;
    let looping = false;
    let heroVisible = false;

    const tick = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      kick = Math.max(-MAX_KICK, Math.min(MAX_KICK, delta * IMPULSE));

      velocity += -STIFFNESS * angle;
      velocity += kick;
      velocity *= DAMPING;
      angle += velocity;

      rotator.style.transform = `rotate(${angle.toFixed(3)}deg)`;

      if (Math.abs(angle) < SLEEP && Math.abs(velocity) < SLEEP && kick === 0) {
        looping = false;
        rotator.style.willChange = '';
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (looping || !heroVisible) return;
      looping = true;
      rotator.style.willChange = 'transform';
      rafId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      if (heroVisible) startLoop();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const hero = wrap.closest('.hero-section');
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) {
          lastScrollY = window.scrollY;
          startLoop();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
          looping = false;
          rotator.style.willChange = '';
        }
      },
      { threshold: 0 }
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      heroObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hang-tag" ref={wrapRef} aria-hidden="true">
      {/* Rotation lives on this HTML wrapper, not on an SVG <g>: SVG transforms
          repaint, HTML transforms composite on the GPU. The pivot sits at the
          top centre, which is exactly where the string meets the ceiling. */}
      <div className="hang-tag-pivot" ref={rotatorRef}>
        <svg width="140" height="240" viewBox="0 0 140 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="70" y1="0" x2="70" y2="88" stroke="var(--aureco-charcoal)" strokeWidth="1.5" />
          <rect
            x="22" y="88" width="96" height="132" rx="10"
            fill="var(--aureco-off-white)" stroke="var(--aureco-charcoal)" strokeWidth="1"
          />
          <circle cx="70" cy="104" r="5" fill="none" stroke="var(--aureco-charcoal)" strokeWidth="1.5" />
          <text
            x="70" y="168" textAnchor="middle"
            fontFamily="'Playfair Display', serif" fontSize="21" fontWeight="600"
            fill="var(--aureco-charcoal)"
          >
            Aureco
          </text>
          <line x1="40" y1="184" x2="100" y2="184" stroke="var(--aureco-green)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default HangTag;
