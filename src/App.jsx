import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScentProvider } from './context/ScentContext';
import { useScrollSkew } from './hooks/useScrollAnimation';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import ProductShowcase3D from './components/ProductShowcase3D';
import Benefits from './components/Benefits';
import ScentSelector from './components/ScentSelector';
import Testimonials from './components/Testimonials';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';

export default function App() {
  // Global effect #4: sections skew up to 2° with scroll velocity
  useScrollSkew();

  // Re-measure scroll triggers once webfonts settle (layout shifts otherwise)
  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }, []);

  return (
    <ScentProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Story />
        <ProductShowcase3D />
        <Benefits />
        <ScentSelector />
        <Testimonials />
        <SocialProof />
        <CTA />
      </main>
    </ScentProvider>
  );
}
