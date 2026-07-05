import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural "Henry's" deodorant flacon built from Three.js primitives
 * (no external GLTF needed — acts as the always-available fallback model).
 *
 * Layers (all individually named for the showcase layer highlight):
 *  - Glass body  : MeshPhysicalMaterial, transmission 0.9, roughness 0.1, IOR 1.5
 *  - Mint liquid : tinted by the active scent, subtle wave/slosh animation
 *  - Gold cap    : metalness 1.0
 *
 * @param {string} liquidColor   - hex tint of the liquid (scent dependent)
 * @param {boolean} hovered      - drives the glow / color-shift state
 * @param {{current:number}} agitationRef
 *        external "slosh energy" — bump it (e.g. on orbit-drag end) and the
 *        liquid sloshes, decaying over ~1s (ease-out via exponential decay)
 * @param {string|null} highlight - 'cap' | 'glass' | 'liquid' to emphasize a layer
 * @param {boolean} lowDetail     - mobile LOD: halves segment counts
 */
const FlaconModel = forwardRef(function FlaconModel(
  {
    liquidColor = '#1dd1a1',
    glowColor = '#1dd1a1',
    hovered = false,
    agitationRef,
    highlight = null,
    lowDetail = false,
    ...groupProps
  },
  ref
) {
  const seg = lowDetail ? 24 : 48;

  const liquidRef = useRef();
  const glassMat = useRef();
  const liquidMat = useRef();
  const capMat = useRef();
  const internalAgitation = useRef(0);

  // Reusable color instances (avoid per-frame allocations)
  const targetLiquid = useMemo(() => new THREE.Color(liquidColor), [liquidColor]);
  const targetGlow = useMemo(() => new THREE.Color(glowColor), [glowColor]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // --- Liquid sloshing -------------------------------------------------
    // External agitation (orbit drag) feeds an internal energy value that
    // decays exponentially — reads as a ~1s ease-out settle.
    if (agitationRef?.current) {
      internalAgitation.current = Math.min(
        0.35,
        internalAgitation.current + agitationRef.current
      );
      agitationRef.current = 0;
    }
    internalAgitation.current *= Math.exp(-4 * delta);

    if (liquidRef.current) {
      const idle = 0.02; // always-on subtle wave
      const amp = idle + internalAgitation.current;
      liquidRef.current.rotation.z = Math.sin(t * 6) * amp;
      liquidRef.current.rotation.x = Math.cos(t * 5.2) * amp * 0.6;
      liquidRef.current.position.y = -0.16 + Math.sin(t * 2.2) * 0.008;
    }

    // --- Scent tint + hover glow (smoothly lerped) -----------------------
    if (liquidMat.current) {
      liquidMat.current.color.lerp(targetLiquid, Math.min(1, delta * 3));
      liquidMat.current.emissive.lerp(targetGlow, Math.min(1, delta * 3));
      liquidMat.current.emissiveIntensity = THREE.MathUtils.damp(
        liquidMat.current.emissiveIntensity,
        hovered || highlight === 'liquid' ? 0.55 : 0.12,
        6,
        delta
      );
    }
    if (glassMat.current) {
      glassMat.current.emissiveIntensity = THREE.MathUtils.damp(
        glassMat.current.emissiveIntensity,
        hovered || highlight === 'glass' ? 0.25 : 0,
        6,
        delta
      );
    }
    if (capMat.current) {
      capMat.current.emissiveIntensity = THREE.MathUtils.damp(
        capMat.current.emissiveIntensity,
        highlight === 'cap' ? 0.35 : 0,
        6,
        delta
      );
    }
  });

  return (
    <group ref={ref} {...groupProps} dispose={null}>
      {/* ---- Liquid (rendered first, inside the glass) ---- */}
      <mesh ref={liquidRef} name="liquid" position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.46, 0.5, 1.28, seg]} />
        <meshPhysicalMaterial
          ref={liquidMat}
          color={liquidColor}
          emissive={glowColor}
          emissiveIntensity={0.12}
          transmission={0.55}
          roughness={0.25}
          thickness={1.2}
          ior={1.33}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* ---- Glass body ---- */}
      <mesh name="glass" position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 1.7, seg]} />
        <meshPhysicalMaterial
          ref={glassMat}
          color="#eafcf7"
          emissive="#1dd1a1"
          emissiveIntensity={0}
          transmission={0.9}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* ---- Glass shoulder (tapers to the neck) ---- */}
      <mesh name="shoulder" position={[0, 0.97, 0]}>
        <cylinderGeometry args={[0.24, 0.55, 0.26, seg]} />
        <meshPhysicalMaterial
          color="#eafcf7"
          transmission={0.9}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* ---- Neck ---- */}
      <mesh name="neck" position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.22, seg]} />
        <meshStandardMaterial color="#dfe6e9" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* ---- Gold cap ---- */}
      <group name="cap" position={[0, 1.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.46, seg]} />
          <meshStandardMaterial
            ref={capMat}
            color="#ffa502"
            emissive="#ffa502"
            emissiveIntensity={0}
            metalness={1}
            roughness={0.18}
          />
        </mesh>
        {/* Cap top: slightly domed */}
        <mesh position={[0, 0.23, 0]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.3, seg, Math.max(12, seg / 2)]} />
          <meshStandardMaterial color="#ffa502" metalness={1} roughness={0.18} />
        </mesh>
        {/* Engraved brand ring */}
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.012, 12, seg]} />
          <meshStandardMaterial color="#c98216" metalness={1} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
});

export default FlaconModel;
