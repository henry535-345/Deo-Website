import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import FlaconModel from './three/FlaconModel';
import SceneEnvironment from './three/SceneEnvironment';
import { useScent } from '../context/ScentContext';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Volumetric-style light rays sweeping through the glass:
 * additive-blended cones orbiting the bottle. Cheap fake, reads premium.
 */
function LightRays({ color = '#1dd1a1' }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[Math.sin((i / 3) * Math.PI * 2) * 0.2, 0.4, Math.cos((i / 3) * Math.PI * 2) * 0.2]}
          rotation={[0, (i / 3) * Math.PI * 2, 0.5]}
        >
          <coneGeometry args={[0.5, 4, 4, 1, true]} />
          <meshBasicMaterial
            color={i === 1 ? '#ffffff' : color}
            transparent
            opacity={0.045}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Hero bottle rig:
 *  - inner group: continuous 360° spin, one cycle every 5s
 *  - outer group: eases toward the mouse position (mouse-follow tilt)
 *  - hover: glow + color shift handled inside FlaconModel via `hovered`
 */
function HeroRig({ reduced }) {
  const { scent } = useScent();
  const spinRef = useRef();
  const tiltRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Responsive flacon size: shrinks on narrow (portrait) viewports so the
  // headline stays readable — roughly 60vw mobile / 40vw desktop.
  const aspect = useThree((s) => s.viewport.aspect);
  const responsiveScale = THREE.MathUtils.clamp(aspect * 1.02, 0.6, 1.05);

  useFrame((state, delta) => {
    if (reduced) return;

    // Continuous rotation: full turn every 5 seconds
    if (spinRef.current) {
      spinRef.current.rotation.y += (Math.PI * 2 * delta) / 5;
    }

    // Mouse-follow: damped tilt toward the normalized pointer
    if (tiltRef.current) {
      const { x, y } = state.pointer;
      tiltRef.current.rotation.y = THREE.MathUtils.damp(
        tiltRef.current.rotation.y, x * 0.35, 4, delta
      );
      tiltRef.current.rotation.x = THREE.MathUtils.damp(
        tiltRef.current.rotation.x, -y * 0.2, 4, delta
      );
    }
  });

  return (
    <group ref={tiltRef} position={[0, -0.3, 0]}>
      <Float
        speed={reduced ? 0 : 2}
        rotationIntensity={0}
        floatIntensity={reduced ? 0 : 0.4}
        floatingRange={[-0.05, 0.05]}
      >
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <FlaconModel
            ref={spinRef}
            liquidColor={scent.liquid}
            glowColor={hovered ? '#ffa502' : scent.glow}
            hovered={hovered}
            scale={responsiveScale}
          />
        </group>
      </Float>

      <LightRays color={scent.glow} />

      {/* Soft drop shadow under the bottle */}
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.55}
        scale={5}
        blur={2.6}
        far={2}
        color="#000000"
      />
    </group>
  );
}

/**
 * Full hero canvas. dpr is capped and detail lowered on small screens (LOD).
 */
export default function HeroFlacon3D() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      className="hero__canvas"
      camera={{ position: [0, 0.2, 7], fov: 30 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <SceneEnvironment intensity={0.9} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-3, 2, -2]} intensity={12} color="#1dd1a1" />
        <pointLight position={[3, -1, 2]} intensity={6} color="#ffa502" />
        <HeroRig reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
