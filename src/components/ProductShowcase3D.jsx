import { Suspense, lazy, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { useScent } from '../context/ScentContext';

// Lazy: keeps three.js out of the critical path until this section approaches
const ShowcaseCanvas = lazy(() => import('./three/ShowcaseCanvas'));

const SPECS = [
  { label: 'Volume', value: '75 ml' },
  { label: 'Scent Profile', value: 'Fresh Mint & Bergamot' },
  { label: 'Duration', value: '24H Fresh' },
  { label: 'Origin', value: 'Made in Germany' },
  { label: 'Ethics', value: 'Vegan & Cruelty-Free' },
];

const LAYERS = [
  { id: 'cap', label: 'Gold Cap', hint: 'Precision-milled, metalness 1.0' },
  { id: 'glass', label: 'Glass Body', hint: 'Recycled glass, IOR 1.5' },
  { id: 'liquid', label: 'Active Liquid', hint: 'Scent-tinted mineral complex' },
];

/**
 * Section 3 — 3D PRODUCT SHOWCASE
 * Orbitable flacon (drag to rotate, auto-rotate w/ pause on hover),
 * layer highlighting (cap / glass / liquid) and a specifications panel.
 */
export default function ProductShowcase3D() {
  const { scent } = useScent();
  const [highlight, setHighlight] = useState(null);
  const canvasHostRef = useRef(null);

  return (
    <section className="showcase section" id="product" data-skew>
      <div className="container">
        <ScrollReveal effect="fade-up">
          <span className="section-kicker">The Product</span>
          <h2 className="section-title">Engineered like an instrument.</h2>
          <p className="section-lead serif-accent">
            Drag to explore — every layer of Henry&rsquo;s is deliberate.
          </p>
        </ScrollReveal>

        <div className="showcase__grid">
          {/* 3D viewport */}
          <ScrollReveal effect="scale" className="showcase__viewport-wrap">
            <div
              className="showcase__viewport"
              ref={canvasHostRef}
              role="img"
              aria-label={`Interactive 3D model of the Henry's deodorant bottle, currently tinted ${scent.name}. Drag to rotate.`}
            >
              <Suspense fallback={<div className="showcase__loading"><span className="spinner-css" /></div>}>
                <ShowcaseCanvas highlight={highlight} />
              </Suspense>
            </div>

            {/* Layer legend — hover/focus highlights the matching 3D part */}
            <ul className="showcase__layers" aria-label="Product layers">
              {LAYERS.map((layer) => (
                <li key={layer.id}>
                  <button
                    type="button"
                    className={`layer-chip ${highlight === layer.id ? 'is-active' : ''}`}
                    onMouseEnter={() => setHighlight(layer.id)}
                    onMouseLeave={() => setHighlight(null)}
                    onFocus={() => setHighlight(layer.id)}
                    onBlur={() => setHighlight(null)}
                    aria-pressed={highlight === layer.id}
                  >
                    <span className={`layer-chip__dot layer-chip__dot--${layer.id}`} aria-hidden="true" />
                    {layer.label}
                    <span className="layer-chip__hint">{layer.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Specifications panel */}
          <aside className="showcase__specs" aria-label="Product specifications">
            <h3 className="showcase__specs-title">Specifications</h3>
            <dl>
              {SPECS.map((spec, i) => (
                <ScrollReveal
                  effect="fade-up"
                  delay={i * 120}
                  as="div"
                  className="spec-row"
                  key={spec.label}
                >
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </ScrollReveal>
              ))}
            </dl>
            <ScrollReveal effect="fade" delay={650}>
              <p className="showcase__note serif-accent">
                Refillable glass. Designed to be the last deodorant bottle
                you ever buy.
              </p>
            </ScrollReveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
