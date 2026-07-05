# Henry's — Fresh. Clean. You.

Production-ready product website for the **Henry's** premium deodorant, built with
React, Three.js (react-three-fiber) and GSAP — interactive 3D, luxurious scroll
effects and full accessibility support.

## Quick start

```bash
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build
```

## Tech stack

| Layer | Library |
| --- | --- |
| UI | React 18 + Vite |
| 3D | three, @react-three/fiber, @react-three/drei |
| Scroll / motion | gsap (ScrollTrigger), framer-motion, react-intersection-observer |
| Extras | lottie-react (available for vector animations) |

## Page structure (8 sections)

1. **Hero** — full-screen stage, procedural 3D flacon (continuous 5s spin,
   mouse-follow tilt, hover glow, volumetric light rays), parallax headline,
   pulsing scroll indicator.
2. **Story** — founder story over a parallax "video" layer, copy fades in over
   300px of scroll, ingredient cards with 150ms staggered reveals + hover expand.
3. **3D Product Showcase** — orbitable bottle (drag, auto-rotate 360°/8s with
   pause-on-hover), glass/gold/liquid layers with highlight chips, liquid
   sloshing after drag, specifications panel.
4. **Benefits** — 4 feature cards, fade-in-up with 200ms stagger, hover shadow
   growth + icon scale, SVG stroke-dasharray checkmarks.
5. **Scent Selector** — 4 scents; selection retints the 3D bottle site-wide
   (React context), crossfades the visual and transitions the background (2s).
6. **Testimonials** — scroll-scrubbed horizontal track, grayscale→color avatars,
   star-by-star rating fill (100ms/star).
7. **Social Proof** — rAF counters (0→50,000 / 0→98% over 2s) with pulse-glow,
   trust badges.
8. **CTA / Shop** — add-to-cart flow (ripple → spinner → confetti burst +
   checkmark), launch offer, footer + sticky email signup bar.

## Architecture

```
src/
├── components/
│   ├── three/            # FlaconModel (procedural GLTF-fallback), canvases, env
│   ├── Hero.jsx / HeroFlacon3D.jsx
│   ├── Story.jsx, ProductShowcase3D.jsx, Benefits.jsx, ScentSelector.jsx
│   ├── Testimonials.jsx, SocialProof.jsx, CTA.jsx, Navbar.jsx
│   └── ScrollReveal.jsx  # declarative reveal wrapper (fade-up/scale/blur/clip)
├── hooks/                # useScrollAnimation, useParallax,
│                         # useIntersectionObserver, useScroll3D, useReducedMotion
├── context/ScentContext.jsx
├── data/scents.js
└── styles/               # theme (tokens), globals, animations, scrollEffects, components
```

### 3D model

The flacon is generated procedurally from Three.js primitives (glass cylinder
with transmission 0.9 / IOR 1.5, gold cap with metalness 1.0, scent-tinted
liquid with wave/slosh animation) — no GLTF download required. To swap in a
real Draco-compressed GLTF, load it with `useGLTF` inside
`src/components/three/` and keep `FlaconModel` as the Suspense fallback.

### Performance

- Three.js and GSAP/framer-motion are split into separate chunks; both 3D
  canvases are lazy-loaded (`React.lazy` + `Suspense`) so the initial paint is
  text-first.
- Scroll work is rAF-gated with passive listeners; reveals use
  IntersectionObserver; GPU-friendly transforms with `will-change` and CSS
  containment per section.
- Mobile LOD: reduced geometry segments + capped device pixel ratio below 640px.

### Accessibility

Keyboard navigable (skip link, focus-visible styles, real buttons/tabs),
ARIA labels on 3D viewports and interactive widgets, WCAG AA contrast, and
`prefers-reduced-motion` disables every scroll/3D/confetti animation.
