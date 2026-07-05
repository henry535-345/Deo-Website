import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger animation hook.
 * Attaches a scroll-linked tween to the returned ref.
 *
 * @param {Object} config
 * @param {Object} config.from     - gsap "from" vars
 * @param {Object} config.to       - gsap "to" vars
 * @param {Object} config.trigger  - extra ScrollTrigger vars (start, end, scrub…)
 * @returns {React.RefObject}
 */
export default function useScrollAnimation({
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  trigger = {},
} = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(node, from, {
        ...to,
        scrollTrigger: {
          trigger: node,
          start: 'top 82%',
          toggleActions: 'play none none none',
          ...trigger,
        },
      });
    });

    return () => ctx.revert();
    // Config objects are static per call-site; deliberately not in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return ref;
}

/**
 * Global "skew on fast scroll" effect (effect #4).
 * Applies a velocity-proportional skewY (max ±2deg) to every
 * element carrying [data-skew], springing back on scroll end.
 */
export function useScrollSkew() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const targets = gsap.utils.toArray('[data-skew]');
    if (!targets.length) return undefined;

    const clamp = gsap.utils.clamp(-2, 2); // max 2deg
    const setters = targets.map((el) => gsap.quickTo(el, 'skewY', {
      duration: 0.5,
      ease: 'power3.out',
    }));

    const st = ScrollTrigger.create({
      onUpdate(self) {
        const skew = clamp(self.getVelocity() / -400);
        setters.forEach((set) => set(skew));
      },
      onScrubComplete() {
        setters.forEach((set) => set(0));
      },
    });

    // Spring back to 0 whenever scrolling stops
    const idle = ScrollTrigger.addEventListener('scrollEnd', () =>
      setters.forEach((set) => set(0))
    );

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener('scrollEnd', idle);
    };
  }, [reduced]);
}
