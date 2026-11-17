"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Eraser, Highlighter, Notebook, PaperClip, Pen, Pencil, Ruler } from "./Stationery";
import { Studio } from "./Studio";

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Drops an object into place after `delay` seconds (from above, spinning slightly, scaling up). */
function Enter({ delay, children, from = [0, 3, 0] }: { delay: number; children: ReactNode; from?: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    if (start.current === null) start.current = clock.elapsedTime;
    const t = THREE.MathUtils.clamp((clock.elapsedTime - start.current - delay) / 1.8, 0, 1);
    const e = easeOutExpo(t);
    g.position.set(from[0] * (1 - e), from[1] * (1 - e), from[2] * (1 - e));
    g.rotation.z = (1 - e) * 0.8;
    g.scale.setScalar(Math.max(0.0001, e));
  });
  return <group ref={ref}>{children}</group>;
}

type Props = {
  /** 0 → 1 as the hero scrolls out of view (read every frame). */
  scrollRef: React.RefObject<number>;
  compact: boolean;
  /** Horizontal drag velocity injected by the parent (touch-friendly rotation). */
  dragRef: React.RefObject<number>;
};

function Composition({ scrollRef, compact, dragRef }: Props) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const { viewport } = useThree();

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = scrollRef.current ?? 0;
    // Inertial drag rotation that eases back to rest.
    spin.current += (dragRef.current ?? 0) * 0.004;
    dragRef.current = (dragRef.current ?? 0) * 0.9;
    spin.current = THREE.MathUtils.damp(spin.current, 0, 1.2, dt);
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.35 + spin.current + s * 0.9, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.18 + s * 0.5, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, s * 3.2, 4, dt);
  });

  // Desktop: composition sits right of the headline. Mobile: centred above it.
  const aspect = viewport.width / viewport.height;
  const x = compact ? 0 : Math.min(viewport.width * 0.25, 4);
  const scale = compact ? Math.min(0.62, viewport.width / 8) : Math.min(0.85, viewport.width / 14) * (aspect < 1.3 ? 0.82 : 1);

  return (
    <group position={[x, compact ? viewport.height * 0.26 : -0.1, 0]} scale={scale}>
      <group ref={root}>
        <Enter delay={0.15} from={[0, 4, 0]}>
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
            <Notebook cover="/textures/spiral-1.jpg" spine="#2f8f8a" spiral position={[0.1, 0.1, 0]} rotation={[-0.25, 0.35, 0.12]} openRef={undefined} open={0.14} />
          </Float>
        </Enter>
        <Enter delay={0.3} from={[2, 4, -2]}>
          <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
            <Notebook cover="/textures/spiral-2.jpg" spine="#26355f" spiral position={[2.3, 1.15, -1.8]} rotation={[-0.1, -0.45, -0.22]} />
          </Float>
        </Enter>
        {!compact && (
          <Enter delay={0.42} from={[-2, 4, -2]}>
            <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
              <Notebook cover="/textures/notebook-white.jpg" spine="#d8dbe6" position={[-2.3, 1.4, -2.4]} rotation={[0.15, 0.55, 0.25]} />
            </Float>
          </Enter>
        )}
        <Enter delay={0.55}>
          <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.9}>
            <Pencil color="#2b3194" position={[-1.6, -0.6, 1.2]} rotation={[0.3, 0.2, -1.05]} />
          </Float>
        </Enter>
        <Enter delay={0.62}>
          <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.9}>
            <Pencil color="#ff5b36" position={[-1.2, -1.25, 1.6]} rotation={[0.2, -0.3, -1.3]} />
          </Float>
        </Enter>
        <Enter delay={0.68}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <Pencil color="#f4d23c" eraser={false} lead="#c79a00" position={[1.9, -1.4, 1.2]} rotation={[-0.4, 0.1, 0.9]} />
          </Float>
        </Enter>
        <Enter delay={0.75}>
          <Float speed={1.4} rotationIntensity={0.7} floatIntensity={1}>
            <Pen body="#121318" accent="#d9dbe0" position={[1.5, 0.4, 1.4]} rotation={[0.4, 0.3, -0.75]} />
          </Float>
        </Enter>
        <Enter delay={0.82}>
          <Float speed={1.3} rotationIntensity={0.7} floatIntensity={1}>
            <Pen body="#2b3194" accent="#e8c66a" position={[-2.2, 1.0, 0.6]} rotation={[-0.2, 0.2, 0.6]} />
          </Float>
        </Enter>
        <Enter delay={0.9}>
          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.1}>
            <Highlighter position={[0.4, -1.75, 1.1]} rotation={[0.5, 0.4, 1.35]} />
          </Float>
        </Enter>
        <Enter delay={0.96}>
          <Float speed={2.2} rotationIntensity={1} floatIntensity={1.2}>
            <Eraser position={[2.7, -0.5, 0.4]} rotation={[0.6, -0.4, 0.4]} />
          </Float>
        </Enter>
        {!compact && (
          <Enter delay={1.02}>
            <Float speed={1} rotationIntensity={0.25} floatIntensity={0.4}>
              <Ruler position={[-0.4, 2.15, -1]} rotation={[0.5, 0.1, 0.18]} />
            </Float>
          </Enter>
        )}
        {[
          [-0.6, 1.9, 1.3, 0.3],
          [2.9, 1.3, 0.6, -0.6],
          [-2.6, -1.5, 0.4, 1.1],
        ].map(([x, y, z, r], i) => (
          <Enter key={i} delay={1.08 + i * 0.06}>
            <Float speed={2.4} rotationIntensity={1.4} floatIntensity={1.2}>
              <PaperClip position={[x, y, z]} rotation={[0.4, r, r]} color={i === 1 ? "#ff5b36" : "#c9ccd3"} />
            </Float>
          </Enter>
        ))}
      </group>
      <ContactShadows position={[0, -3.1, 0]} opacity={0.35} scale={14} blur={2.8} far={6} resolution={256} frames={compact ? 1 : Infinity} color="#12154d" />
    </group>
  );
}

export default function HeroScene({ active, eventSource, ...props }: Props & { active: boolean; eventSource: React.RefObject<HTMLElement | null> }) {
  return (
    <Canvas
      // Stop rendering entirely while the hero is off-screen.
      frameloop={active ? "always" : "never"}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      shadows={!props.compact}
      dpr={props.compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Studio shadows={!props.compact} />
        <Composition {...props} />
      </Suspense>
    </Canvas>
  );
}
