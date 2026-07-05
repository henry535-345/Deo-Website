import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: 'I’ve never felt fresher all day. Henry’s is a game-changer.',
    name: 'Alex',
    role: 'Fitness Coach',
    stars: 5,
    initials: 'AL',
    hue: '#1dd1a1',
  },
  {
    quote: 'Survived a 14-hour shift and I still smelled like a spa. Unreal.',
    name: 'Miriam',
    role: 'ER Nurse',
    stars: 5,
    initials: 'MI',
    hue: '#ffa502',
  },
  {
    quote: 'Finally a deo that doesn’t ruin my black shirts. Design is gorgeous too.',
    name: 'Jonas',
    role: 'Architect',
    stars: 5,
    initials: 'JO',
    hue: '#48dbfb',
  },
  {
    quote: 'The Fresh Mint scent gets me compliments at least twice a week.',
    name: 'Sofia',
    role: 'Barista & DJ',
    stars: 4,
    initials: 'SO',
    hue: '#c98d5c',
  },
  {
    quote: 'Bought one for my brother. Then my dad. Then three more for me.',
    name: 'Emre',
    role: 'Product Manager',
    stars: 5,
    initials: 'EM',
    hue: '#a29bfe',
  },
];

/** Star rating that fills star-by-star (100ms per star) once visible. */
function Stars({ count, active }) {
  const [filled, setFilled] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      setFilled(count);
      return undefined;
    }
    setFilled(0);
    const timers = [];
    for (let i = 1; i <= count; i += 1) {
      timers.push(setTimeout(() => setFilled(i), i * 100)); // 100ms per star
    }
    return () => timers.forEach(clearTimeout);
  }, [active, count, reduced]);

  return (
    <span className="stars" role="img" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star ${i <= filled ? 'is-filled' : ''}`} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function TestimonialCard({ t }) {
  const { ref, inView } = useInView({ threshold: 0.55, triggerOnce: false });

  return (
    <li ref={ref} className={`testimonial-card ${inView ? 'is-focus' : ''}`}>
      <Stars count={t.stars} active={inView} />
      <blockquote className="testimonial-card__quote serif-accent">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="testimonial-card__meta">
        {/* Avatar: grayscale → color when the card is in focus */}
        <span
          className="testimonial-card__avatar"
          style={{ '--avatar-hue': t.hue }}
          aria-hidden="true"
        >
          {t.initials}
        </span>
        <span>
          <strong>{t.name}</strong>
          <em>{t.role}</em>
        </span>
      </figcaption>
    </li>
  );
}

/**
 * Section 6 — TESTIMONIALS
 * Horizontal card track translated by scroll progress (momentum comes from
 * GSAP's scrub smoothing), avatars desaturated until focused,
 * star ratings fill one by one.
 */
export default function Testimonials() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return undefined;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth + 96);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 10%',
          scrub: 0.8, // momentum feel: track eases toward scroll position
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="testimonials section" id="testimonials" ref={sectionRef}>
      <div className="container">
        <span className="section-kicker">Loved Daily</span>
        <h2 className="section-title">Word travels fast when you smell this good.</h2>
      </div>

      <ul className="testimonials__track" ref={trackRef} aria-label="Customer testimonials">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </ul>
    </section>
  );
}
