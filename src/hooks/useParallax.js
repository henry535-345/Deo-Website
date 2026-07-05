import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll parallax hook (effect #2).
 * Moves the element vertically while its container crosses the viewport.
 *
 * @param {number} offset - total Y travel in px (negative = moves up)
 * @param {Object} opts   - { scrub, start, end } ScrollTrigger overrides
 * @returns {React.RefObject}
 */
export default function useParallax(offset = -30, opts = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: -offset / 2 },
        {
          y: offset / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: node.parentElement ?? node,
            start: opts.start ?? 'top bottom',
            end: opts.end ?? 'bottom top',
            scrub: opts.scrub ?? 0.6, // smooth, rAF-driven by GSAP
          },
        }
      );
    });

    return () => ctx.revert();
  }, [offset, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
