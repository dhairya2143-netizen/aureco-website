export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One observer for the whole page. Elements opt in with a data-paper attribute.
// Each element is unobserved the moment it settles, so there is no ongoing cost.
export function initPaperMotion(root = document) {
  const els = Array.from(root.querySelectorAll('[data-paper]:not(.paper-settled)'));
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add('paper-settled'));
    return () => {};
  }

  els.forEach((el, i) => {
    // Deterministic alternating tilt so paper never lands perfectly square.
    if (!el.style.getPropertyValue('--paper-tilt')) {
      const tilt = (i % 2 === 0 ? 1 : -1) * (0.5 + ((i * 7) % 5) * 0.12);
      el.style.setProperty('--paper-tilt', `${tilt.toFixed(2)}deg`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.paperDelay || 0);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('paper-settled');
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
