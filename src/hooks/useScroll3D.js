import { useEffect, useRef } from 'react';

/**
 * Tracks how far a section has scrolled through the viewport (0 → 1)
 * without re-rendering React. Used to drive 3D transforms (bottle tilt,
 * camera drift) from scroll position via refs.
 *
 * Reads happen inside requestAnimationFrame and the scroll listener is
 * passive + debounced by the rAF gate — no layout thrash.
 *
 * @returns {{ sectionRef: React.RefObject, progressRef: React.RefObject<number> }}
 */
export default function useScroll3D() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    let ticking = false;

    const measure = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top enters bottom of viewport, 1 when bottom leaves top
      const total = rect.height + vh;
      const passed = vh - rect.top;
      progressRef.current = Math.min(1, Math.max(0, passed / total));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { sectionRef, progressRef };
}
