import useIntersectionObserver from '../hooks/useIntersectionObserver';

/**
 * Declarative scroll-reveal wrapper.
 * Adds `.is-visible` when the element enters the viewport; the actual
 * transition lives in scrollEffects.css and honours prefers-reduced-motion.
 *
 * @param {'fade-up'|'scale'|'blur'|'clip'|'fade'} effect
 * @param {number} delay - transition delay in ms (for staggering)
 * @param {string} as    - wrapper tag
 */
export default function ScrollReveal({
  effect = 'fade-up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const [ref, inView] = useIntersectionObserver();

  return (
    <Tag
      ref={ref}
      data-reveal={effect}
      className={`${className} ${inView ? 'is-visible' : ''}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
