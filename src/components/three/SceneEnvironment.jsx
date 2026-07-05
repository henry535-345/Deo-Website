import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Image-based lighting without any network fetch:
 * three's procedural RoomEnvironment is prefiltered via PMREM and used
 * as the scene environment map. This is what makes the glass + gold
 * materials read as "real" (reflections, refraction highlights).
 */
export default function SceneEnvironment({ intensity = 1 }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = intensity;

    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);

  return null;
}
