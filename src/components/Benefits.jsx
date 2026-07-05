import useIntersectionObserver from '../hooks/useIntersectionObserver';

const BENEFITS = [
  {
    title: '24h Fresh',
    text: 'One morning swipe outlasts workouts, meetings and midnight trains.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Invisible Technology',
    text: 'Zero white marks, zero yellow stains. Black shirts stay black.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" strokeLinejoin="round" />
        <path d="M4 4l16 16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Natural Ingredients',
    text: 'Aluminum-free mineral complex, organic oils, nothing to hide.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 21C7 17 4 13.5 4 9.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 8 4.5c0 4-3 7.5-8 11.5Z" strokeLinejoin="round" />
        <path d="M12 5v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'German Precision',
    text: 'Formulated, tested and bottled in Hamburg under dermatological control.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** Animated checkmark using the stroke-dasharray reveal technique. */
function Checkmark({ drawn }) {
  return (
    <svg
      className={`check-svg ${drawn ? 'is-drawn' : ''}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4 12.5 10 18.5 20 6" />
    </svg>
  );
}

/**
 * Section 4 — BENEFITS
 * 4 feature cards: fade-in-up 300ms ease-out with 200ms stagger,
 * hover grows shadow 0→20px, tints the background, scales icon 1→1.15,
 * checkmark strokes itself in when the grid enters the viewport.
 */
export default function Benefits() {
  const [gridRef, inView] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="benefits section section--light" id="benefits" data-skew>
      <div className="container">
        <div className="benefits__header">
          <span className="section-kicker">Why Henry&rsquo;s</span>
          <h2 className="section-title">Four reasons you&rsquo;ll never switch back.</h2>
        </div>

        <ul
          className={`benefits__grid ${inView ? 'is-visible' : ''}`}
          ref={gridRef}
        >
          {BENEFITS.map((benefit, i) => (
            <li
              key={benefit.title}
              className="benefit-card"
              style={{ transitionDelay: `${i * 200}ms` }} // 200ms stagger
            >
              <span className="benefit-card__icon" aria-hidden="true">
                {benefit.icon}
              </span>
              <h3 className="benefit-card__title">
                {benefit.title}
                <Checkmark drawn={inView} />
              </h3>
              <p className="benefit-card__text">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
