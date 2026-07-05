import { useCallback, useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useReducedMotion from '../hooks/useReducedMotion';

const CONFETTI_COLORS = ['#1dd1a1', '#ffa502', '#ffffff', '#48dbfb', '#10ac84'];

/**
 * Canvas confetti burst — self-contained, no dependency.
 * Spawns ~90 particles from the button position and lets them
 * fall out with gravity + drag over ~1.6s.
 */
function fireConfetti(canvas, originX, originY) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particles = Array.from({ length: 90 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: 4 + Math.random() * 5,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    };
  });

  let raf;
  const step = () => {
    ctx.clearRect(0, 0, width, height);
    let alive = false;

    particles.forEach((p) => {
      if (p.life <= 0) return;
      alive = true;
      p.vy += 0.28; // gravity
      p.vx *= 0.985; // drag
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.life -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (alive) {
      raf = requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** Injects a ripple <span> at the click point (removed on animation end). */
function spawnRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.addEventListener('animationend', () => ripple.remove());
  button.appendChild(ripple);
}

/**
 * Section 8 — CTA / SHOP NOW
 * Add-to-cart flow: ripple → loading spinner → success checkmark +
 * confetti burst. Plus the launch offer, footer, and a sticky
 * email-signup bar ("Get 20% off your first order").
 */
export default function CTA() {
  const [cartState, setCartState] = useState('idle'); // idle | loading | success
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);
  const timersRef = useRef([]);
  const reduced = useReducedMotion();

  // Sticky signup bar appears once the CTA section is approached
  const [sentinelRef, pastHero] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '600px 0px 0px 0px',
    once: true,
  });

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const handleAddToCart = useCallback(
    (event) => {
      if (cartState !== 'idle') return;
      if (!reduced) spawnRipple(event);
      setCartState('loading');

      timersRef.current.push(
        setTimeout(() => {
          setCartState('success');

          // Confetti bursts from the button's center
          if (canvasRef.current && buttonRef.current && !reduced) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const btnRect = buttonRef.current.getBoundingClientRect();
            fireConfetti(
              canvasRef.current,
              btnRect.left + btnRect.width / 2 - canvasRect.left,
              btnRect.top + btnRect.height / 2 - canvasRect.top
            );
          }

          timersRef.current.push(setTimeout(() => setCartState('idle'), 2600));
        }, 900)
      );
    },
    [cartState, reduced]
  );

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <>
      <span ref={sentinelRef} aria-hidden="true" />

      <section className="cta section" id="shop">
        {/* Floating decorative elements */}
        <span className="cta__bubble cta__bubble--1 floaty" aria-hidden="true" />
        <span className="cta__bubble cta__bubble--2 floaty" aria-hidden="true" />
        <span className="cta__bubble cta__bubble--3 floaty" aria-hidden="true" />

        {/* Confetti layer */}
        <canvas className="cta__confetti" ref={canvasRef} aria-hidden="true" />

        <div className="container cta__inner">
          <ScrollReveal effect="scale" className="cta__card">
            <span className="cta__offer">
              Limited Launch Offer · <strong>20% Off</strong> + Free Shipping
            </span>

            <h2 className="cta__title">Ready to Stay Fresh?</h2>
            <p className="cta__sub serif-accent">
              Join 50,000+ people who never think about their deodorant twice.
            </p>

            <div className="cta__price" aria-label="Price">
              <span className="cta__price-old">€24.00</span>
              <span className="cta__price-new">€19.20</span>
              <span className="cta__price-unit">/ 75ml</span>
            </div>

            <button
              type="button"
              ref={buttonRef}
              className={`btn btn--gold cta__button cta__button--${cartState}`}
              onClick={handleAddToCart}
              disabled={cartState === 'loading'}
              aria-live="polite"
            >
              {cartState === 'idle' && 'Add to Cart'}
              {cartState === 'loading' && (
                <>
                  <svg className="spinner" viewBox="0 0 50 50" width="20" height="20" aria-hidden="true">
                    <circle cx="25" cy="25" r="20" />
                  </svg>
                  Adding…
                </>
              )}
              {cartState === 'success' && (
                <>
                  <svg
                    className="check-svg is-drawn"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 12.5 10 18.5 20 6" />
                  </svg>
                  Added!
                </>
              )}
            </button>

            <p className="cta__reassure">
              100-day money-back guarantee · Ships within 24h from Hamburg
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- Footer with email signup ---------- */}
      <footer className="footer" role="contentinfo">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="navbar__logo">HENRY&rsquo;S<span className="navbar__logo-dot">.</span></span>
            <p>Fresh. Clean. You. — Premium deodorant, made in Germany.</p>
          </div>

          <form className="footer__signup" onSubmit={handleSubscribe}>
            <label htmlFor="footer-email">Get 20% off your first order</label>
            <div className="footer__signup-row">
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
              />
              <button type="submit" className="btn btn--primary" disabled={subscribed}>
                {subscribed ? 'Welcome! ✓' : 'Sign Up'}
              </button>
            </div>
            {subscribed && (
              <p className="footer__signup-done" role="status">
                Check your inbox — your 20% code is on its way.
              </p>
            )}
          </form>
        </div>
        <p className="footer__legal container">
          © {new Date().getFullYear()} Henry&rsquo;s Care GmbH, Hamburg. All rights reserved.
        </p>
      </footer>

      {/* ---------- Sticky email signup bar ---------- */}
      {pastHero && !subscribed && !barDismissed && (
        <div className="signup-bar" role="complementary" aria-label="Newsletter signup">
          <form className="signup-bar__form container" onSubmit={handleSubscribe}>
            <span className="signup-bar__text">
              <strong>Get 20% off</strong> your first order
            </span>
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">Sign Up</button>
            <button
              type="button"
              className="signup-bar__close"
              onClick={() => setBarDismissed(true)}
              aria-label="Dismiss signup bar"
            >
              ×
            </button>
          </form>
        </div>
      )}
    </>
  );
}
