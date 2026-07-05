import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useReducedMotion from '../hooks/useReducedMotion';

const STATS = [
  { target: 50000, suffix: '+', label: 'Happy Users', format: (n) => n.toLocaleString('en-US') },
  { target: 98, suffix: '%', label: 'Would Recommend', format: (n) => String(n) },
  { target: 24, suffix: 'h', label: 'Proven Freshness', format: (n) => String(n) },
];

const BADGES = [
  {
    label: 'German Made',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: '100-Day Money-Back Guarantee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
        <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Certified Vegan & Cruelty-Free',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 21C7 17 4 13.5 4 9.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 8 4.5c0 4-3 7.5-8 11.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/**
 * Counter that ticks 0 → target over `duration` ms using rAF with an
 * ease-out curve, then fires a pulse-glow once the target is reached.
 */
function Counter({ target, suffix, label, format, duration = 2000 }) {
  const [ref, inView] = useIntersectionObserver({ threshold: 0.5 });
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  const rafRef = useRef();

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setValue(target);
      setDone(true);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3; // cubic ease-out
      setValue(Math.round(target * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true); // triggers pulse-glow
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target, duration, reduced]);

  return (
    <div className="stat" ref={ref}>
      <span className={`stat__value ${done ? 'pulse-glow' : ''}`}>
        {format(value)}
        <span className="stat__suffix">{suffix}</span>
      </span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

/**
 * Section 7 — SOCIAL PROOF
 * Scroll-triggered counters (2s, pulse-glow on completion) + trust badges.
 */
export default function SocialProof() {
  return (
    <section className="proof section section--dark" id="proof" data-skew>
      <div className="container">
        <span className="section-kicker">In Numbers</span>
        <h2 className="section-title">Freshness, verified at scale.</h2>

        <div className="proof__stats">
          {STATS.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>

        <ul className="proof__badges" aria-label="Trust badges">
          {BADGES.map((badge) => (
            <li key={badge.label} className="trust-badge">
              <span className="trust-badge__icon" aria-hidden="true">{badge.icon}</span>
              {badge.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
