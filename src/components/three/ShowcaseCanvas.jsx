import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import FlaconModel from './FlaconModel';
import SceneEnvironment from './SceneEnvironment';
import { useScent } from '../../context/ScentContext';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Feeds orbit-drag energy into the liquid slosh: when the user stops
 * rotating, the liquid keeps moving briefly and settles (~1s ease-out).
 */
function ShowcaseRig({ highlight, hovered, agitationRef, lowDetail }) {
  const { scent } = useScent();
  const controlsRef = useRef();
  const lastAzimuth = useRef(0);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const azimuth = controls.getAzimuthalAngle();
    const delta = Math.abs(azimuth - lastAzimuth.current);
    lastAzimuth.current = azimuth;
    // Manual drags produce larger deltas than auto-rotate — only those slosh.
    if (delta > 0.02 && agitationRef.current < 0.3) {
      agitationRef.current += delta * 0.25;
    }
  });

  return (
    <>
      <group position={[0, -0.35, 0]}>
        <FlaconModel
          liquidColor={scent.liquid}
          glowColor={scent.glow}
          hovered={false}
          highlight={highlight}
          agitationRef={agitationRef}
          lowDetail={lowDetail}
          scale={1}
        />
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.4}
          scale={6}
          blur={2.4}
          far={2.4}
          color="#0f0f0f"
        />
      </group>

      {/* Auto-rotate 360°/8s, paused while the pointer is over the viewport.
          autoRotateSpeed 2.0 ≈ 30s per orbit → 7.5 ≈ 8s per orbit. */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        autoRotate={!hovered}
        autoRotateSpeed={7.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
        makeDefault
      />
    </>
  );
}

export default function ShowcaseCanvas({ highlight }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [lowDetail, setLowDetail] = useState(false);
  const agitationRef = useRef(0);

  // Mobile LOD: fewer segments + capped dpr below tablet width
  useEffect(() => {
    const check = () => setLowDetail(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <Canvas
      camera={{ position: [0.8, 0.2, 7.2], fov: 30 }}
      dpr={lowDetail ? [1, 1.5] : [1, 2]}
      gl={{ alpha: true, antialias: true }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Suspense fallback={null}>
        <SceneEnvironment intensity={1} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 7, 3]} intensity={1.2} />
        <pointLight position={[-4, 2, -3]} intensity={10} color="#1dd1a1" />
        <ShowcaseRig
          highlight={highlight}
          hovered={hovered && !reduced}
          agitationRef={agitationRef}
          lowDetail={lowDetail}
        />
      </Suspense>
    </Canvas>
  );
}
