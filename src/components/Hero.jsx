import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import useParallax from '../hooks/useParallax';
import useReducedMotion from '../hooks/useReducedMotion';

// The Three.js bundle is heavy — lazy-load it so text paints first (FCP).
const HeroFlacon3D = lazy(() => import('./HeroFlacon3D'));

/**
 * Section 1 — HERO
 * Full-screen gradient stage, interactive 3D flacon (5s spin, mouse-follow,
 * hover glow), parallax headline floating above the product, light sweep,
 * pulsing scroll indicator.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  // Headline drifts slower than the scroll → floats above the product
  const headlineRef = useParallax(-90);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="hero light-sweep" id="hero" aria-label="Henry's – premium deodorant">
      {/* 3D stage sits behind the copy */}
      <div className="hero__stage" aria-hidden="true">
        <Suspense fallback={<div className="hero__stage-fallback" />}>
          <HeroFlacon3D />
        </Suspense>
      </div>

      <div className="hero__content container" ref={headlineRef}>
        <motion.p
          className="hero__eyebrow"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Premium Deodorant · Made in Germany
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          HENRY&rsquo;S
          <span className="hero__title-sub">
            Fresh. Clean. <em>You.</em>
          </span>
        </motion.h1>

        <motion.div
          className="hero__actions"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="btn btn--primary" onClick={() => scrollTo('shop')}>
            Shop Now
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => scrollTo('story')}>
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Pulsing scroll indicator */}
      <button
        type="button"
        className="scroll-indicator"
        onClick={() => scrollTo('story')}
        aria-label="Scroll down to the story section"
      >
        <span className="scroll-indicator__mouse" aria-hidden="true">
          <span className="scroll-indicator__dot" />
        </span>
        Scroll
      </button>
    </section>
  );
}
