/**
 * Scent catalogue for the Scent Selector and the 3D bottle tint.
 * `liquid` / `glow` are hex colors fed into the Three.js materials,
 * `bg` drives the section background transition (2s ease).
 */
export const SCENTS = [
  {
    id: 'mint',
    name: 'Fresh Mint',
    tagline: 'The signature. Crisp, cool, unmistakably Henry’s.',
    notes: {
      top: ['Bergamot', 'Lemon'],
      heart: ['Spearmint', 'Eucalyptus'],
      base: ['Cedarwood', 'Musk'],
    },
    liquid: '#1dd1a1',
    glow: '#1dd1a1',
    bg: '#0f1f1b',
    swatch: 'linear-gradient(135deg, #1dd1a1, #10ac84)',
  },
  {
    id: 'citrus',
    name: 'Citrus Spark',
    tagline: 'A burst of Mediterranean sun — zesty and alive.',
    notes: {
      top: ['Blood Orange', 'Grapefruit'],
      heart: ['Neroli', 'Ginger'],
      base: ['Amber', 'Vetiver'],
    },
    liquid: '#ffa502',
    glow: '#ffb733',
    bg: '#231a0d',
    swatch: 'linear-gradient(135deg, #ffa502, #ff7f50)',
  },
  {
    id: 'ocean',
    name: 'Ocean Drift',
    tagline: 'Sea spray and open horizons, bottled.',
    notes: {
      top: ['Sea Salt', 'Cucumber'],
      heart: ['Marine Accord', 'Sage'],
      base: ['Driftwood', 'White Musk'],
    },
    liquid: '#48dbfb',
    glow: '#48dbfb',
    bg: '#0c1b26',
    swatch: 'linear-gradient(135deg, #48dbfb, #0abde3)',
  },
  {
    id: 'wood',
    name: 'Nordic Wood',
    tagline: 'Warm, grounded, quietly confident.',
    notes: {
      top: ['Cardamom', 'Pink Pepper'],
      heart: ['Cypress', 'Iris'],
      base: ['Sandalwood', 'Tonka Bean'],
    },
    liquid: '#c98d5c',
    glow: '#e0a878',
    bg: '#1f1712',
    swatch: 'linear-gradient(135deg, #c98d5c, #8d5a34)',
  },
];

export const DEFAULT_SCENT_ID = 'mint';
