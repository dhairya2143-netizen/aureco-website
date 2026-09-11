# Aureco — Motion & Performance Plan

Execute stages in order. Each stage ends with a verification command that must pass
before moving on. Do not skip verification. Do not add npm dependencies — zero new
packages is a hard requirement.

## Hard constraints (violating any of these fails the task)

1. **No animation library.** No GSAP, no Framer Motion, no react-spring, no Lenis.
   Pure CSS transitions + a small amount of vanilla JS. `package.json` must be
   byte-identical when you finish.
2. **Animate only `transform` and `opacity`.** Never animate `width`, `height`,
   `top`, `left`, `margin`, `filter`, `box-shadow`, `clip-path`, or
   `background-position`. Those force layout or paint on every frame.
3. **No `scroll` event listener that reads layout.** Reveals use one shared
   `IntersectionObserver` that `unobserve()`s each element after it fires, so the
   ongoing cost after reveal is exactly zero.
4. **Every animation respects `prefers-reduced-motion: reduce`** by rendering the
   final state immediately and never starting a loop.
5. **No `will-change` left permanently on.** Either omit it, or remove it on
   `transitionend`. Dozens of permanently-promoted layers cost more than they save.
6. **New images are lazy-loaded and carry explicit `width`/`height`** so they
   cannot cause layout shift.
7. **Colours:** only existing CSS variables (`--aureco-green #6B8E3E`,
   `--aureco-off-white #F5F0E8`, `--aureco-charcoal #1C1C1A`,
   `--aureco-light-green #8BAF5C`, `--aureco-dark-green #556F2E`). No new hex values.
8. **No em dashes in any user-facing copy.** Use commas, colons, or full stops.

---

## Stage 0 — Fix the real load problem (do this first)

### 0.1 Remove the fake 2-second loader

`frontend/src/pages/Home.jsx` currently gates the entire page behind
`setTimeout(() => setLoading(false), 2000)` and returns `<LoadingAnimation />`
until it fires. Nothing mounts during that window, so images and fonts do not
even begin downloading until 2s have passed. This is the single largest cause of
the site feeling slow.

Replace it so content mounts immediately and the splash becomes a non-blocking
overlay that gets out of the way fast:

- Render the real page immediately on first paint. `<LoadingAnimation />` must
  no longer be an early `return`.
- Render `<LoadingAnimation />` as a fixed-position overlay *on top of* the page
  while `loading` is true.
- Dismiss it on whichever happens first: `window.load`, or a **600ms** cap.
- Keep the existing fade-out styling if there is any; add a
  `.loading-animation.is-dismissed { opacity: 0; pointer-events: none; }`
  transition of 400ms so it fades rather than cuts.

### 0.2 Preload the hero image

`frontend/public/index.html` — add inside `<head>`:

```html
<link rel="preload" as="image" href="/images/hero.webp" type="image/webp">
```

### 0.3 Verify

```bash
cd frontend
grep -n "2000" src/pages/Home.jsx   # must return nothing
CI=false REACT_APP_SUPABASE_URL=https://example.supabase.co \
  REACT_APP_SUPABASE_ANON_KEY=preview-only npx -y yarn@1.22.22 build
```

Build must print "Compiled successfully."

---

## Stage 1 — Paper physics (the shared motion foundation)

The idea: nothing on this site should snap into place. Everything arrives like a
sheet of paper settling onto a table. Slight rise, slight tilt, decelerating like
air resistance. One system, applied everywhere, so the whole site feels made of
the material Aureco sells.

### 1.1 New file: `frontend/src/lib/paperMotion.js`

```js
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
```

### 1.2 CSS in `frontend/src/App.css`

Add the tokens to the existing `:root` block (do not create a second `:root`):

```css
  --ease-paper: cubic-bezier(0.16, 1, 0.3, 1);
  --paper-duration: 760ms;
```

Then add:

```css
[data-paper] {
  opacity: 0;
  transform: translate3d(0, 22px, 0) rotate(var(--paper-tilt, 0deg));
  transition:
    opacity var(--paper-duration) var(--ease-paper),
    transform var(--paper-duration) var(--ease-paper);
}

[data-paper].paper-settled {
  opacity: 1;
  transform: translate3d(0, 0, 0) rotate(0deg);
}

@media (prefers-reduced-motion: reduce) {
  [data-paper],
  [data-paper].paper-settled {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### 1.3 Wire it up

In `frontend/src/pages/Home.jsx`, after the page renders (in a `useEffect` that
depends on `loading`), call `initPaperMotion()` and return its cleanup function.

Add `data-paper` to these elements. Use `data-paper-delay` for stagger where a
group of siblings appears together (0, 90, 180, 270 …):

- `About.jsx` — the headline, the body paragraph, and the image
- `Products.jsx` — the `.products-title` **only**
- `Industries.jsx` — the section title, subtitle, and each industry card (stagger)
- `Contact.jsx` — the section title and the form container
- `Footer.jsx` — each footer column (stagger)

**Do NOT add `data-paper` to `.product-card`.** `Products.jsx` already drives
those with its own carousel transform loop and the two systems would fight over
the same `transform` property.

### 1.4 Verify

```bash
cd frontend && CI=false REACT_APP_SUPABASE_URL=https://example.supabase.co \
  REACT_APP_SUPABASE_ANON_KEY=preview-only npx -y yarn@1.22.22 build
git -C .. diff --stat frontend/package.json   # must be empty
```

---

## Stage 2 — The swinging hang tag (hero only)

A hang tag hangs from a string in the hero and swings with the momentum of your
scroll: flick down fast and it kicks out, stop and it settles with two or three
decaying swings. It reacts to *how* you scroll, which is why it reads as physical
rather than as a played-back animation.

### 2.1 New file: `frontend/src/components/HangTag.jsx`

Requirements:

- Renders an inline SVG: a string running down from the top of the hero, and a
  tag hanging off it. The tag is a rounded rectangle in `--aureco-off-white`
  with a punched hole at the top, the word `Aureco` in Playfair Display, and a
  thin `--aureco-green` rule under it. Roughly 96px wide by 132px tall.
- The rotating element's `transform-origin` must be the **string's anchor point
  at the very top**, not the tag's own centre. A tag pivots where it hangs.
- Positioned absolutely in the hero, upper right, clear of the headline (which
  sits left). Use `pointer-events: none` so it never blocks clicks.

**Physics — damped harmonic oscillator, driven by scroll velocity:**

```js
const STIFFNESS = 0.008;   // restoring force toward vertical
const DAMPING   = 0.94;    // velocity retained per frame
const IMPULSE   = 0.03;    // how hard scroll movement kicks the tag
const MAX_KICK  = 3.2;     // clamp so a fast flick cannot spin it
const SLEEP     = 0.008;   // below this, stop the loop entirely

// per frame:
velocity += -STIFFNESS * angle;   // spring pulls back to 0
velocity += kick;                 // from scroll delta this frame
velocity *= DAMPING;              // air resistance
angle    += velocity;
el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
```

**Performance rules for the loop (these matter most):**

- Read `window.scrollY` **once per frame inside the rAF callback**. Do not read
  it in a scroll handler. The scroll listener (if any) must be `{ passive: true }`
  and may only set a flag.
- The rAF loop **stops itself** when `Math.abs(angle) < SLEEP &&
  Math.abs(velocity) < SLEEP && kick === 0`. Restart it on the next scroll.
  A tag hanging still must cost zero CPU.
- Gate the whole thing behind an `IntersectionObserver` on the hero section:
  when the hero leaves the viewport, cancel the rAF and remove listeners.
  When it returns, resume.
- Set `will-change: transform` on the rotating element only while the loop is
  running; remove it when the loop sleeps.
- If `prefersReducedMotion()` is true: render the tag static at 0deg, register
  no listeners, and start no loop at all.
- Clean up rAF, listeners, and the observer in the `useEffect` return.

**Mobile:** below 640px scale the tag to about 70% and move it clear of the
headline. Do not remove it.

### 2.2 Mount it

`frontend/src/components/Hero.jsx` — render `<HangTag />` inside
`.hero-content`, after the `.hero-text` div. The hero section needs
`position: relative` (verify it already has it in App.css; add if not).

### 2.3 Verify

Build, then confirm by inspection that: the loop stops when idle, listeners are
passive, and cleanup runs on unmount.

---

## Stage 3 — The wrap reveal section

Each product photo arrives wrapped: a sheet of paper covers it, then slides away
diagonally to reveal the product, and a round seal presses down onto the corner.
It is Aureco's product performing its own job.

### 3.1 Data — add to `frontend/src/mockData.js`

```js
export const revealItems = [
  { id: 1, image: '/images/reveal/drawstring-detail.webp', w: 900, h: 900,
    name: 'Drawstring bags',
    note: 'Cotton, with a woven label sewn into the seam.' },
  { id: 2, image: '/images/reveal/brand-card.webp', w: 900, h: 900,
    name: 'Business cards',
    note: 'Textured stock, deboss, and a raised leaf mark.' },
  { id: 3, image: '/images/reveal/woven-label.webp', w: 537, h: 720,
    name: 'Woven labels',
    note: 'The name inside every garment.' },
  { id: 4, image: '/images/reveal/card-stack.webp', w: 506, h: 900,
    name: 'Seed paper cards',
    note: 'Printed on plantable stock, ready to ship.' },
  { id: 5, image: '/images/reveal/wrapping-rolls.webp', w: 900, h: 491,
    name: 'Wrapping paper and stickers',
    note: 'Made as a matched set, never as separate buys.' },
  { id: 6, image: '/images/reveal/tote-detail.webp', w: 900, h: 491,
    name: 'Tote bags',
    note: 'Folded, tied, and tagged before they reach you.' },
];
```

All six files already exist at those paths. Do not re-encode or move them.

### 3.2 New file: `frontend/src/components/WrapReveal.jsx`

Structure per item:

```jsx
<figure className="wrap-item" data-paper data-paper-delay={index * 90}>
  <div className="wrap-frame">
    <img src={item.image} alt={item.name} width={item.w} height={item.h}
         loading="lazy" decoding="async" />
    <div className="wrap-sheet" aria-hidden="true" />
    <div className="wrap-seal" aria-hidden="true">{/* inline leaf SVG */}</div>
  </div>
  <figcaption>
    <h3>{item.name}</h3>
    <p>{item.note}</p>
  </figcaption>
</figure>
```

Section heading: **"See it made up."**
Section subline: **"Our own packaging suite, produced exactly the way yours would be."**

Use a second `IntersectionObserver` (or reuse the same pattern) to add
`.is-unwrapped` to `.wrap-frame` when it enters, then `unobserve`. Stagger with
`transition-delay` from the item index.

### 3.3 CSS in `App.css`

- `.wrap-frame` — `position: relative; overflow: hidden; border-radius: 8px;`
  and `aspect-ratio` set inline per item from `w`/`h`.
- `.wrap-frame img` — `width:100%; height:100%; object-fit: cover; display:block;`
- `.wrap-sheet` — absolutely covers the frame. Its surface is a **CSS gradient**
  in cream and kraft tones built from the existing variables, with a subtle
  repeating-linear-gradient for paper grain. **It must not load an image file.**
  Resting state covers the photo. On `.is-unwrapped` it animates to
  `transform: translate3d(-106%, -12%, 0) rotate(-9deg); opacity: 0;`
  over 1100ms with `var(--ease-paper)`.
- `.wrap-seal` — a circular seal about 56px, `--aureco-green` fill, positioned
  bottom-right of the frame. Starts `transform: scale(1.9) rotate(-18deg); opacity: 0;`
  On `.is-unwrapped` goes to `scale(1) rotate(0deg); opacity: 1;` over 520ms with
  a 560ms delay, so it lands after the sheet has cleared.
- Grid: 3 columns above 1024px, 2 columns 640–1024px, 1 column below.
  Gap `2rem`, matching `.products-track`.
- `@media (prefers-reduced-motion: reduce)` — sheet hidden, seal at final state,
  no transitions.

### 3.4 Mount it

`frontend/src/pages/Home.jsx` — render `<WrapReveal />` between `<Products />`
and `<Industries />`.

### 3.5 Verify

```bash
cd frontend && CI=false REACT_APP_SUPABASE_URL=https://example.supabase.co \
  REACT_APP_SUPABASE_ANON_KEY=preview-only npx -y yarn@1.22.22 build
ls build/images/reveal | wc -l    # must be 6
```

---

## Final acceptance checks

Run all of these and report the actual output:

```bash
cd frontend
# 1. builds clean
CI=false REACT_APP_SUPABASE_URL=https://example.supabase.co \
  REACT_APP_SUPABASE_ANON_KEY=preview-only npx -y yarn@1.22.22 build

# 2. zero new dependencies
git -C .. diff --exit-code frontend/package.json && echo "DEPS UNCHANGED"

# 3. JS bundle growth budget: main bundle must stay under 152 kB gzip
#    (it was 143.22 kB before this work)
ls -la build/static/js/main.*.js

# 4. no forbidden animated properties introduced
grep -nE "transition:[^;]*(width|height|top|left|margin|clip-path|box-shadow|filter)" src/App.css

# 5. no scroll listener without passive
grep -n "addEventListener('scroll'" src/**/*.js*
```

Check 4 should return nothing new from this work (pre-existing hits are fine,
note them). Check 5: every scroll listener you add must show `{ passive: true }`.

Report the real numbers from checks 1 and 3. Do not claim success without pasting
the output.
