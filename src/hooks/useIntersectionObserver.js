import { useEffect, useRef, useState } from 'react';

/**
 * Minimal IntersectionObserver hook.
 *
 * @param {Object}  options
 * @param {number}  options.threshold   - visibility ratio to trigger at
 * @param {string}  options.rootMargin  - margin around viewport
 * @param {boolean} options.once        - unobserve after first intersection
 * @returns {[React.RefObject, boolean]} [ref, isIntersecting]
 */
export default function useIntersectionObserver({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // No IO support (very old browsers): show content immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isIntersecting];
}
