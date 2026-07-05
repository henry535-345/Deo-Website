import { AnimatePresence, motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useScent } from '../context/ScentContext';
import useReducedMotion from '../hooks/useReducedMotion';

const NOTE_TIERS = [
  { key: 'top', label: 'Top Notes' },
  { key: 'heart', label: 'Heart Notes' },
  { key: 'base', label: 'Base Notes' },
];

/**
 * Section 5 — SCENT SELECTOR
 * Picking a scent crossfades the visual (parallax-fade), animates the
 * description in, retints the 3D bottle site-wide (via ScentContext) and
 * transitions the section background over 2s.
 */
export default function ScentSelector() {
  const { scent, scentId, setScentId, scents } = useScent();
  const reduced = useReducedMotion();

  const fade = reduced
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 26 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -18 },
      };

  return (
    <section
      className="scents section section--dark"
      id="scents"
      data-skew
      style={{
        backgroundColor: scent.bg,
        transition: 'background-color 2s ease', // 2s bg transition on select
      }}
    >
      <div className="container">
        <ScrollReveal effect="fade-up">
          <span className="section-kicker">Find Your Scent</span>
          <h2 className="section-title">One formula. Four personalities.</h2>
        </ScrollReveal>

        {/* Scent tabs */}
        <div className="scents__tabs" role="tablist" aria-label="Choose a scent">
          {scents.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scentId === s.id}
              className={`scent-tab ${scentId === s.id ? 'is-active' : ''}`}
              onClick={() => setScentId(s.id)}
            >
              <span className="scent-tab__swatch" style={{ background: s.swatch }} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>

        <div className="scents__stage">
          {/* Visual: parallax-fading scent "hero image" (gradient orb) */}
          <div className="scents__visual parallax-scene" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={scent.id}
                className="scents__orb parallax-layer"
                style={{ background: `radial-gradient(circle at 35% 30%, ${scent.glow}, ${scent.bg} 75%)` }}
                initial={reduced ? false : { opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06, y: -30 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="scents__orb-bottle floaty">
                  <svg viewBox="0 0 60 120" width="72" role="img" aria-hidden="true">
                    <rect x="14" y="34" width="32" height="76" rx="10" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.4)" />
                    <rect x="18" y="52" width="24" height="54" rx="7" fill={scent.liquid} opacity="0.85" />
                    <rect x="22" y="10" width="16" height="20" rx="4" fill="#ffa502" />
                  </svg>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description + fragrance pyramid */}
          <div className="scents__info" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={scent.id}
                {...fade}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="scents__name">{scent.name}</h3>
                <p className="scents__tagline serif-accent">{scent.tagline}</p>

                <dl className="scents__pyramid">
                  {NOTE_TIERS.map((tier, i) => (
                    <motion.div
                      className="scents__tier"
                      key={tier.key}
                      initial={reduced ? false : { opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.45 }}
                    >
                      <dt>{tier.label}</dt>
                      <dd>{scent.notes[tier.key].join(' · ')}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="scents__hint">
          The 3D bottle above follows your choice — scroll up to see it retinted.
        </p>
      </div>
    </section>
  );
}
