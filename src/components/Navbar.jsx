import { useEffect, useState } from 'react';

/**
 * Minimal fixed header — transparent over the hero,
 * frosted glass once the page is scrolled.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container" aria-label="Main navigation">
        <a href="#hero" className="navbar__logo">
          HENRY&rsquo;S<span className="navbar__logo-dot">.</span>
        </a>
        <ul className="navbar__links">
          <li><a href="#story">Story</a></li>
          <li><a href="#product">Product</a></li>
          <li><a href="#scents">Scents</a></li>
        </ul>
        <a href="#shop" className="btn btn--primary navbar__cta">Shop Now</a>
      </nav>
    </header>
  );
}
