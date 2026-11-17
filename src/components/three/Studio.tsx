"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Soft product-studio lighting. The environment is generated locally from light panels (no HDR download). */
export function Studio({ shadows = true }: { shadows?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 6]}
        intensity={1.6}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 2, 3]} intensity={0.45} color="#c9cdfa" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} position={[-6, 1, 1]} scale={[3, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} color="#ffe9d6" position={[6, 1, 1]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={0.8} color="#9fa6ff" position={[0, 0, -8]} scale={6} />
      </Environment>
    </>
  );
}
