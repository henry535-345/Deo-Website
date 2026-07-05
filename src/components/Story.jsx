import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';
import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
  {
    icon: '🌿',
    name: 'Eucalyptus Extract',
    short: 'Cooling freshness',
    detail:
      'Cold-pressed eucalyptus from certified organic farms keeps skin cool and calm — all day.',
  },
  {
    icon: '🍋',
    name: 'Bergamot Oil',
    short: 'Citrus brightness',
    detail:
      'Hand-picked Calabrian bergamot lends the signature sparkling top note of every Henry’s scent.',
  },
  {
    icon: '💧',
    name: 'Aloe Vera',
    short: 'Gentle hydration',
    detail:
      'Soothes right after shaving. No alcohol burn, no residue — just soft, hydrated skin.',
  },
  {
    icon: '🪨',
    name: 'Mineral Complex',
    short: '24h odor control',
    detail:
      'Natural zinc minerals neutralize odor at the source instead of masking it — aluminum-free.',
  },
];

/**
 * Section 2 — STORY
 * Video-style parallax background, copy that fades in over 300px of scroll,
 * staggered ingredient cards (150ms) that expand on hover, with a
 * progressive backdrop-blur entrance.
 */
export default function Story() {
  const reduced = useReducedMotion();
  const copyRef = useRef(null);
  // Video layer drifts -30px against scroll
  const videoRef = useParallax(-60);
  const [cardsRef, cardsInView] = useIntersectionObserver({ threshold: 0.2 });
  const [expanded, setExpanded] = useState(null);

  // Copy opacity 0 → 100% mapped onto 300px of scroll distance
  useEffect(() => {
    const node = copyRef.current;
    if (!node || reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top 92%',
            end: '+=300', // exactly 300px of scroll
            scrub: 0.4,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="story section section--dark" id="story" data-skew>
      {/* "Video" background: layered animated gradients + film grain,
          parallax-shifted. Swap for a real <video> by adding a source. */}
      <div className="story__video-wrap" aria-hidden="true">
        <div className="story__video" ref={videoRef}>
          <video
            className="story__video-el"
            autoPlay
            muted
            loop
            playsInline
            poster=""
            tabIndex={-1}
          />
          <div className="story__video-fallback" />
        </div>
        <div className="story__video-overlay" />
      </div>

      <div className="container story__inner">
        <div className="story__copy" ref={copyRef}>
          <span className="section-kicker">Our Story</span>
          <h2 className="section-title">
            Born in a Hamburg gym locker room.
          </h2>
          <p className="serif-accent story__quote">
            &ldquo;Every deodorant I tried either quit after lunch or smelled like a
            chemistry lab. So I made my own.&rdquo;
          </p>
          <p className="section-lead">
            Henry spent two years with German dermatologists and perfumers,
            testing 147 formulations until one survived a full training day,
            a client dinner and the last train home. That formula became
            Henry&rsquo;s — clean ingredients, uncompromising freshness, zero
            white marks.
          </p>
          <p className="story__signature serif-accent">— Henry T., Founder</p>
        </div>

        {/* Ingredient showcase — staggered icon reveals, hover expands */}
        <ul
          className={`story__ingredients ${cardsInView ? 'is-visible' : ''}`}
          ref={cardsRef}
          aria-label="Key ingredients"
        >
          {INGREDIENTS.map((ing, i) => (
            <li
              key={ing.name}
              className={`ingredient-card blur-entrance ${cardsInView ? 'is-visible' : ''} ${
                expanded === i ? 'is-expanded' : ''
              }`}
              style={{ transitionDelay: `${i * 150}ms` }} // 150ms stagger
              onMouseEnter={() => setExpanded(i)}
              onMouseLeave={() => setExpanded(null)}
            >
              <button
                type="button"
                className="ingredient-card__toggle"
                aria-expanded={expanded === i}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onFocus={() => setExpanded(i)}
              >
                <span className="ingredient-card__icon" aria-hidden="true">
                  {ing.icon}
                </span>
                <span className="ingredient-card__name">{ing.name}</span>
                <span className="ingredient-card__short">{ing.short}</span>
              </button>
              <p className="ingredient-card__detail">{ing.detail}</p>
            </li>
          ))}
        </ul>

        <ScrollReveal effect="clip" as="p" className="story__footnote">
          147 formulations. 1 winner. 0 compromises.
        </ScrollReveal>
      </div>
    </section>
  );
}
