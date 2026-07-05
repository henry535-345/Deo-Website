import { createContext, useContext, useMemo, useState } from 'react';
import { SCENTS, DEFAULT_SCENT_ID } from '../data/scents';

/**
 * Shares the currently selected scent across the site so the
 * Scent Selector can retint the 3D bottle everywhere it appears.
 */
const ScentContext = createContext(null);

export function ScentProvider({ children }) {
  const [scentId, setScentId] = useState(DEFAULT_SCENT_ID);

  const value = useMemo(() => {
    const scent = SCENTS.find((s) => s.id === scentId) ?? SCENTS[0];
    return { scent, scentId, setScentId, scents: SCENTS };
  }, [scentId]);

  return <ScentContext.Provider value={value}>{children}</ScentContext.Provider>;
}

export function useScent() {
  const ctx = useContext(ScentContext);
  if (!ctx) throw new Error('useScent must be used inside <ScentProvider>');
  return ctx;
}
