import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 211;
const FRAME_W = 1440;
const FRAME_H = 810;

// Timeline inside the pinned container: the film scrubs, the last frame holds
// while the film chrome falls silent, then a short step-in dissolve hands the
// viewport to the page and the navbar arrives.
const FILM_END = 0.86;
const HOLD_END = 0.9;
const SMOOTHING = 0.28;
// A restrained step toward the bag keeps every pixel sharp; the dissolve does
// the match cut, so no deep zoom is needed.
const EXIT_SCALE = 1.55;
// Past this progress the film releases the page chrome (navbar, WhatsApp).
const RELEASE = 0.96;
const CONCURRENCY = 6;

const CAPTIONS = [
  { end: 48, index: '01', title: 'The tee' },
  { end: 80, index: '02', title: 'The wrap' },
  { end: 112, index: '03', title: 'The box' },
  { end: 144, index: '04', title: 'The ribbon' },
  { end: 176, index: '05', title: 'The tag' },
  { end: FRAME_COUNT, index: '06', title: 'Ready' },
];

const TITLE = 'Custom Packaging for Fashion Brands';
const STATIC_SUBLINE =
  'Everything your garment wears before your customer does: tags, wraps, seals, and the bag it walks out in.';
const POSTER_ALT =
  'An off-white Aureco shopping bag standing upright, printed with the Aureco leaf mark.';

const frameSrc = (n) => `/hero-frames/frame_${String(n).padStart(3, '0')}.webp`;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t) => t * t * (3 - 2 * t);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Coarse pass first so any scroll position has something to show, then refine.
const loadOrder = () => {
  const seen = new Set();
  const order = [];
  const push = (n) => {
    if (n >= 1 && n <= FRAME_COUNT && !seen.has(n)) {
      seen.add(n);
      order.push(n);
    }
  };
  push(1);
  push(FRAME_COUNT);
  for (const step of [8, 4, 1]) for (let n = 1; n <= FRAME_COUNT; n += step) push(n);
  return order;
};

const scrollToContact = (e) => {
  e.preventDefault();
  const el = document.querySelector('#contact');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const setFilmLive = (live) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('film-live', live);
  }
};

const StaticHero = () => (
  <section className="film-hero-static" aria-label="Aureco custom packaging for fashion brands">
    <img
      className="film-static-image"
      src="/hero-frames/poster.png"
      alt={POSTER_ALT}
      width={FRAME_W}
      height={FRAME_H}
      decoding="async"
    />
    <div className="film-static-content">
      <h1 className="film-payoff-headline">{TITLE}</h1>
      <p className="film-payoff-subline">{STATIC_SUBLINE}</p>
      <a href="#contact" className="film-payoff-cta" onClick={scrollToContact}>
        Get a Quote
      </a>
    </div>
  </section>
);

const FilmHero = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const wordmarkRef = useRef(null);
  const captionsRef = useRef(null);
  const captionRefs = useRef([]);
  const progressFillRef = useRef(null);

  const framesRef = useRef([]);
  const metricsRef = useRef({ top: 0, span: 1, cw: 0, ch: 0, dx: 0, dy: 0, dw: 0, dh: 0, dpr: 1 });
  const scrollRef = useRef(0);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const needsDrawRef = useRef(true);
  const drawnRef = useRef(0);
  const lastRef = useRef({
    caption: -1,
    chrome: -1,
    intro: -1,
    cue: -1,
    wordmark: -1,
    fill: -1,
    scale: -1,
    alpha: -1,
    zooming: false,
    live: null,
  });

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!container || !stage || !canvas) return undefined;

    const frames = framesRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });

    const measure = () => {
      const m = metricsRef.current;
      const vh = stage.offsetHeight || window.innerHeight;
      m.top = container.getBoundingClientRect().top + window.scrollY;
      m.span = Math.max(1, container.offsetHeight - vh);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = stage.clientWidth;
      const ch = vh;
      if (cw !== m.cw || ch !== m.ch || dpr !== m.dpr) {
        m.cw = cw;
        m.ch = ch;
        m.dpr = dpr;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        // Contain fit: the whole frame is always visible, never cropped. The
        // frames share the stage's paper backdrop, so the letterbox is invisible.
        // A reserved band at the bottom keeps the cue and progress dash off the
        // subject on short viewports.
        const reserve = 76;
        const fit = Math.min(cw / FRAME_W, (ch - reserve) / FRAME_H);
        m.dw = FRAME_W * fit;
        m.dh = FRAME_H * fit;
        m.dx = (cw - m.dw) / 2;
        m.dy = (ch - reserve - m.dh) / 2;
        needsDrawRef.current = true;
      }
    };

    const targetProgress = () => {
      const m = metricsRef.current;
      return clamp01((scrollRef.current - m.top) / m.span);
    };

    // Only substitute a close neighbour; a far frame reads as broken sync.
    const pickIndex = (n) => {
      if (frames[n]) return n;
      for (let r = 1; r <= 6; r += 1) {
        if (n - r >= 1 && frames[n - r]) return n - r;
        if (n + r <= FRAME_COUNT && frames[n + r]) return n + r;
      }
      return 0;
    };

    const drawFrame = (idx) => {
      const m = metricsRef.current;
      ctx.setTransform(m.dpr, 0, 0, m.dpr, 0, 0);
      ctx.clearRect(0, 0, m.cw, m.ch);
      ctx.drawImage(frames[idx], m.dx, m.dy, m.dw, m.dh);
    };

    const setNum = (el, prop, value, key) => {
      const last = lastRef.current;
      if (!el || Math.abs(last[key] - value) < 0.004) return;
      last[key] = value;
      el.style[prop] = String(value);
    };

    const render = (p) => {
      const filmP = clamp01(p / FILM_END);
      const frame = Math.max(1, Math.min(FRAME_COUNT, Math.round(1 + filmP * (FRAME_COUNT - 1))));
      const idx = pickIndex(frame);
      if (idx && idx !== drawnRef.current) {
        drawFrame(idx);
        drawnRef.current = idx;
      }

      const last = lastRef.current;

      // The opening statement yields to the film as soon as scrolling begins.
      const intro = 1 - smoothstep(clamp01(p / 0.055));
      setNum(introRef.current, 'opacity', intro, 'intro');
      if (introRef.current) introRef.current.classList.toggle('is-gone', intro <= 0.02);
      setNum(cueRef.current, 'opacity', intro, 'cue');

      // Beat chrome (caption, progress) falls silent during the hold.
      const chrome = 1 - smoothstep(clamp01((p - FILM_END) / (HOLD_END - FILM_END)));
      setNum(captionsRef.current, 'opacity', chrome, 'chrome');
      if (progressFillRef.current) {
        const fill = Math.round(filmP * 200) / 200;
        if (fill !== last.fill) {
          last.fill = fill;
          progressFillRef.current.style.transform = `scaleX(${fill})`;
        }
        progressFillRef.current.parentElement.style.opacity = String(chrome);
      }

      // The wordmark stays through the quiet hold and hands off to the navbar
      // logo, which fades in at the same spot as the film releases.
      const wordmark = 1 - clamp01((p - 0.93) / 0.04);
      setNum(wordmarkRef.current, 'opacity', wordmark, 'wordmark');

      const ci = CAPTIONS.findIndex((c) => frame <= c.end);
      if (ci !== last.caption) {
        captionRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === ci ? '1' : '0';
        });
        last.caption = ci;
      }

      const exit = clamp01((p - HOLD_END) / (1 - HOLD_END));
      const scale = 1 + (EXIT_SCALE - 1) * smoothstep(exit);
      const alpha = 1 - smoothstep(clamp01((exit - 0.35) / 0.65));
      if (Math.abs(last.scale - scale) > 0.002) {
        last.scale = scale;
        canvas.style.transform = exit > 0 ? `scale(${scale.toFixed(4)})` : '';
      }
      setNum(canvas, 'opacity', alpha, 'alpha');

      const zooming = exit > 0;
      if (zooming !== last.zooming) {
        last.zooming = zooming;
        canvas.style.willChange = zooming ? 'transform' : '';
      }

      const live = p < RELEASE;
      if (live !== last.live) {
        last.live = live;
        setFilmLive(live);
      }
    };

    const loop = () => {
      rafRef.current = 0;
      const target = targetProgress();
      const cur = progressRef.current;
      let next = cur + (target - cur) * SMOOTHING;
      if (Math.abs(target - next) < 0.0002) next = target;
      const moved = next !== cur;
      progressRef.current = next;
      if (moved || needsDrawRef.current) {
        needsDrawRef.current = false;
        render(next);
      }
      if (next !== target && visibleRef.current) rafRef.current = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!rafRef.current && visibleRef.current) rafRef.current = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
      wake();
    };

    const onResize = () => {
      measure();
      scrollRef.current = window.scrollY;
      needsDrawRef.current = true;
      wake();
    };

    measure();
    scrollRef.current = window.scrollY;
    progressRef.current = targetProgress();

    // A frame only becomes drawable once its bitmap is decoded; otherwise the
    // first drawImage of every new frame decodes synchronously and stalls the
    // scrub loop exactly when the user first scrolls through.
    const store = (n, img) => {
      frames[n] = img;
      needsDrawRef.current = true;
      wake();
    };
    const decodeInto = (n, img) => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => store(n, img)).catch(() => store(n, img));
      } else {
        store(n, img);
      }
    };

    // Frame 1 is eager so the hero paints on the first tick.
    const first = new Image();
    first.decoding = 'async';
    first.onload = () => decodeInto(1, first);
    first.src = frameSrc(1);

    const queue = loadOrder();
    let cursor = 0;
    let inflight = 0;
    let cancelled = false;
    const pump = () => {
      while (!cancelled && inflight < CONCURRENCY && cursor < queue.length) {
        const n = queue[cursor];
        cursor += 1;
        if (frames[n]) continue;
        inflight += 1;
        const img = new Image();
        img.decoding = 'async';
        const done = (ok) => {
          inflight -= 1;
          if (cancelled) return;
          if (ok) decodeInto(n, img);
          pump();
        };
        img.onload = () => done(true);
        img.onerror = () => done(false);
        img.src = frameSrc(n);
      }
    };
    pump();

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          scrollRef.current = window.scrollY;
          needsDrawRef.current = true;
          wake();
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
          // Never leave a promoted layer behind once the hero is out of sight.
          canvas.style.willChange = '';
          lastRef.current.zooming = false;
          // The page chrome always belongs to the page once the film is gone.
          lastRef.current.live = false;
          setFilmLive(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    wake();

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      first.onload = null;
      setFilmLive(false);
    };
  }, []);

  return (
    <section
      className="film-hero"
      ref={containerRef}
      aria-label="Aureco custom packaging for fashion brands"
    >
      <div className="film-stage" ref={stageRef}>
        <canvas
          className="film-canvas"
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          role="img"
          aria-label={POSTER_ALT}
        />
        <span className="film-wordmark" ref={wordmarkRef} aria-hidden="true">
          Aureco
        </span>
        <div className="film-intro" ref={introRef}>
          <p className="film-intro-kicker">Sustainable, made in India</p>
          <h1 className="film-intro-title">Custom Packaging for Fashion Brands</h1>
          <p className="film-intro-sub">
            One order, packed before your eyes: label, tissue, box, ribbon, tag, bag.
          </p>
        </div>
        <p className="film-cue" ref={cueRef} aria-hidden="true">
          <span className="film-cue-text">Scroll to pack the order</span>
        </p>
        <div className="film-captions" ref={captionsRef} aria-hidden="true">
          {CAPTIONS.map((c, i) => (
            <div
              key={c.index}
              className="film-caption"
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="film-caption-line">
                <span className="film-caption-index">{c.index}</span>
                <span className="film-caption-dot">·</span>
                <span className="film-caption-title">{c.title}</span>
              </p>
              <span className="film-caption-rule" />
            </div>
          ))}
        </div>
        <div className="film-progress" aria-hidden="true">
          <span className="film-progress-fill" ref={progressFillRef} />
        </div>
      </div>
    </section>
  );
};

const ScrollFilmHero = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced ? <StaticHero /> : <FilmHero />;
};

export default ScrollFilmHero;
