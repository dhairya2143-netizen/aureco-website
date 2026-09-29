import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 264;
const FRAME_W = 1440;
const FRAME_H = 810;

// Timeline inside the pinned container.
//  0.00 .. LOGO_END : brand reveal. The full-screen Aureco lockup rushes toward
//                     the viewer and dissolves while the tee, printed with the
//                     same mark, settles in from far away. The wordmark becomes
//                     the print on the shirt.
//  LOGO_END .. FILM_END : the packing film scrubs, frame by frame.
//  FILM_END .. HOLD_END : the last frame holds while the beat chrome fades.
//  HOLD_END .. 1.00 : a short step-in dissolve hands the view to the page.
const LOGO_END = 0.12;
const FILM_START = 0.12;
const FILM_END = 0.86;
const HOLD_END = 0.9;
const SMOOTHING = 0.26;
// How far the tee starts "away" during the reveal, and how large the brand
// lockup grows as it rushes past the viewer.
const TEE_IN_SCALE = 0.74;
const LOGO_OUT_SCALE = 2.6;
// A restrained step toward the bag keeps every pixel sharp; the dissolve does
// the match cut, so no deep zoom is needed.
const EXIT_SCALE = 1.55;
// Past this progress the film releases the page chrome (navbar, WhatsApp).
const RELEASE = 0.96;
const CONCURRENCY = 6;

// Beat ranges scaled to the 264-frame, 10fps sequence.
const CAPTIONS = [
  { end: 60, index: '01', title: 'The tee' },
  { end: 100, index: '02', title: 'The wrap' },
  { end: 140, index: '03', title: 'The box' },
  { end: 180, index: '04', title: 'The ribbon' },
  { end: 220, index: '05', title: 'The tag' },
  { end: FRAME_COUNT, index: '06', title: 'Ready' },
];

const TITLE = 'Custom Packaging for Fashion Brands';
const STATIC_SUBLINE =
  'Everything your garment wears before your customer does: tags, wraps, seals, and the bag it walks out in.';
const POSTER_ALT =
  'An off-white Aureco shopping bag standing upright, printed with the Aureco leaf mark.';

const MARK_URL = `${process.env.PUBLIC_URL || ''}/aureco-mark.png`;
const MARK_STYLE = { WebkitMaskImage: `url(${MARK_URL})`, maskImage: `url(${MARK_URL})` };

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
  const logoIntroRef = useRef(null);
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
        // Contain fit, centred on screen. The frame's cream backdrop is a photo
        // gradient that never flat-matches the page cream, so instead of relying
        // on a colour match we feather the frame edges to transparent at draw
        // time (see drawFrame): the product floats on the page with no visible
        // box. Centring both axes keeps the animation in the middle of the view.
        const fit = Math.min(cw / FRAME_W, ch / FRAME_H);
        m.dw = FRAME_W * fit;
        m.dh = FRAME_H * fit;
        m.dx = (cw - m.dw) / 2;
        m.dy = (ch - m.dh) / 2;
        m.feather = Math.min(90, m.dw * 0.16, m.dh * 0.16);
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

      // Feather all four edges to transparent so the frame's photo backdrop melts
      // into the page cream instead of reading as a lighter rectangle. The product
      // always sits centred with cream margins, so nothing meaningful is erased.
      const f = m.feather || 0;
      if (f > 0) {
        ctx.globalCompositeOperation = 'destination-out';
        const edge = (x0, y0, x1, y1, rx, ry, rw, rh) => {
          const g = ctx.createLinearGradient(x0, y0, x1, y1);
          g.addColorStop(0, 'rgba(0,0,0,1)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(rx, ry, rw, rh);
        };
        edge(m.dx, 0, m.dx + f, 0, m.dx, m.dy, f, m.dh);                       // left
        edge(m.dx + m.dw, 0, m.dx + m.dw - f, 0, m.dx + m.dw - f, m.dy, f, m.dh); // right
        edge(0, m.dy, 0, m.dy + f, m.dx, m.dy, m.dw, f);                       // top
        edge(0, m.dy + m.dh, 0, m.dy + m.dh - f, m.dx, m.dy + m.dh - f, m.dw, f); // bottom
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const setNum = (el, prop, value, key) => {
      const last = lastRef.current;
      if (!el || Math.abs(last[key] - value) < 0.004) return;
      last[key] = value;
      el.style[prop] = String(value);
    };

    const render = (p) => {
      const filmP = clamp01((p - FILM_START) / (FILM_END - FILM_START));
      const frame = Math.max(1, Math.min(FRAME_COUNT, Math.round(1 + filmP * (FRAME_COUNT - 1))));
      const idx = pickIndex(frame);
      if (idx && idx !== drawnRef.current) {
        drawFrame(idx);
        drawnRef.current = idx;
      }

      const last = lastRef.current;

      // Brand reveal: the lockup rushes toward the viewer and dissolves while the
      // tee scales up from far into place.
      const logoP = clamp01(p / LOGO_END);
      const logoScale = 1 + (LOGO_OUT_SCALE - 1) * smoothstep(logoP);
      const logoAlpha = 1 - smoothstep(clamp01(logoP / 0.82));
      setNum(logoIntroRef.current, 'opacity', logoAlpha, 'logo');
      if (logoIntroRef.current) {
        logoIntroRef.current.style.transform = `scale(${logoScale.toFixed(4)})`;
        logoIntroRef.current.classList.toggle('is-gone', logoAlpha <= 0.02);
      }

      // The opening statement appears once the tee has landed, then yields.
      const intro =
        smoothstep(clamp01((p - LOGO_END) / 0.04)) *
        (1 - smoothstep(clamp01((p - (LOGO_END + 0.09)) / 0.06)));
      setNum(introRef.current, 'opacity', intro, 'intro');
      if (introRef.current) introRef.current.classList.toggle('is-gone', intro <= 0.02 && p > LOGO_END);
      setNum(cueRef.current, 'opacity', intro, 'cue');

      // Beat chrome (caption, progress) is silent during the reveal and the hold.
      const chrome =
        smoothstep(clamp01((p - LOGO_END) / 0.03)) *
        (1 - smoothstep(clamp01((p - FILM_END) / (HOLD_END - FILM_END))));
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
      const wordmark = (1 - clamp01((p - 0.93) / 0.04)) * smoothstep(clamp01((p - LOGO_END) / 0.03));
      setNum(wordmarkRef.current, 'opacity', wordmark, 'wordmark');

      const ci = CAPTIONS.findIndex((c) => frame <= c.end);
      if (ci !== last.caption) {
        captionRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === ci ? '1' : '0';
        });
        last.caption = ci;
      }

      // Canvas transform: scales up from far during the reveal, holds at 1 through
      // the film, then a small step-in on exit. Opacity fades in at the reveal and
      // out on exit.
      const exit = clamp01((p - HOLD_END) / (1 - HOLD_END));
      let scale;
      if (p < LOGO_END) {
        scale = TEE_IN_SCALE + (1 - TEE_IN_SCALE) * smoothstep(logoP);
      } else {
        scale = 1 + (EXIT_SCALE - 1) * smoothstep(exit);
      }
      if (Math.abs(last.scale - scale) > 0.002) {
        last.scale = scale;
        canvas.style.transform = scale !== 1 ? `scale(${scale.toFixed(4)})` : '';
      }
      const introAlpha = smoothstep(clamp01(logoP / 0.7));
      const exitAlpha = 1 - smoothstep(clamp01((exit - 0.35) / 0.65));
      const alpha = Math.min(introAlpha, exitAlpha);
      setNum(canvas, 'opacity', alpha, 'alpha');

      const transforming = p < LOGO_END || exit > 0;
      if (transforming !== last.zooming) {
        last.zooming = transforming;
        canvas.style.willChange = transforming ? 'transform' : '';
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
        <div className="film-logo-intro" ref={logoIntroRef}>
          <div className="film-logo-inner">
            <span className="film-logo-mark" aria-hidden="true" style={MARK_STYLE} />
            <span className="film-logo-word">Aureco</span>
          </div>
        </div>
        <span className="film-wordmark" ref={wordmarkRef} aria-hidden="true">
          Aureco
        </span>
        <div className="film-intro" ref={introRef}>
          <p className="film-intro-kicker">Sustainable &middot; Made in India</p>
          <h1 className="film-intro-title">
            The packaging your <em>garment</em> deserves
          </h1>
          <p className="film-intro-sub">
            Custom hang tags, woven labels, tissue, boxes and bags for fashion brands.
            Watch one order pack itself.
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
