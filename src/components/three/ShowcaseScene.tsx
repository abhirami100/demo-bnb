"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Eraser, Highlighter, Notebook, PaperClip, Pen, PenCap, Pencil, Ruler } from "./Stationery";
import { Studio } from "./Studio";

/* ───────── timeline helpers ───────── */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Normalised progress of `p` within [a, b]. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Pose = { p: [number, number, number]; r: [number, number, number]; s: number };
const V = new THREE.Vector3();

function applyPose(g: THREE.Object3D, a: Pose, b: Pose, t: number, dt: number) {
  const k = 10; // damping keeps scrubbing silky even with coarse scroll steps
  V.set(...a.p).lerp(new THREE.Vector3(...b.p), t);
  g.position.x = THREE.MathUtils.damp(g.position.x, V.x, k, dt);
  g.position.y = THREE.MathUtils.damp(g.position.y, V.y, k, dt);
  g.position.z = THREE.MathUtils.damp(g.position.z, V.z, k, dt);
  g.rotation.x = THREE.MathUtils.damp(g.rotation.x, THREE.MathUtils.lerp(a.r[0], b.r[0], t), k, dt);
  g.rotation.y = THREE.MathUtils.damp(g.rotation.y, THREE.MathUtils.lerp(a.r[1], b.r[1], t), k, dt);
  g.rotation.z = THREE.MathUtils.damp(g.rotation.z, THREE.MathUtils.lerp(a.r[2], b.r[2], t), k, dt);
  g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, Math.max(0.0001, THREE.MathUtils.lerp(a.s, b.s, t)), k, dt));
}

/** Piecewise pose track: [[progress, pose], ...] sorted by progress. */
function poseAt(track: [number, Pose][], p: number): [Pose, Pose, number] {
  if (p <= track[0][0]) return [track[0][1], track[0][1], 0];
  for (let i = 0; i < track.length - 1; i++) {
    const [p0, a] = track[i];
    const [p1, b] = track[i + 1];
    if (p <= p1) return [a, b, ease(seg(p, p0, p1))];
  }
  const last = track[track.length - 1][1];
  return [last, last, 0];
}

const FLAT: [number, number, number] = [-Math.PI / 2, 0, 0];
const flat = (z: number): [number, number, number] => [-Math.PI / 2, 0, z];
const HIDE = (p: [number, number, number], r: [number, number, number] = [0, 0, 0]): Pose => ({ p, r, s: 0 });

/* Chapter windows (also used by the DOM overlay). */
export const CHAPTERS = [0, 0.25, 0.5, 0.74] as const;

/* ───────── tracks ───────── */
const NOTEBOOK: [number, Pose][] = [
  [0.0, { p: [0.6, 0, 0], r: [0.1, -0.5, 0.05], s: 0.95 }],
  [0.2, { p: [0.6, 0, 0], r: [0.05, 0.25, 0], s: 0.95 }],
  [0.3, HIDE([-5, 0.5, -2], [0, 0.8, 0.3])],
  [0.76, HIDE([0, 3, 0], FLAT)],
  [0.9, { p: [-0.9, 0, 0.1], r: flat(0.08), s: 1 }],
];
const PEN: [number, Pose][] = [
  [0.22, HIDE([5, 0, 0], [0, 0, -1.2])],
  [0.3, { p: [0.6, 0, 0.6], r: [0.2, 0, -1.05], s: 1.15 }],
  [0.47, { p: [0.6, 0, 0.6], r: [-0.25, 0, -1.25], s: 1.15 }],
  [0.54, HIDE([5, -1, 0], [0, 0, -1])],
  [0.78, HIDE([2, 3, 0], FLAT)],
  [0.92, { p: [1.25, 0.12, -0.35], r: flat(-0.35), s: 0.95 }],
];
const PENCIL_SET: [number, Pose][] = [
  [0.47, HIDE([0.6, -4, 0])],
  [0.55, { p: [0.6, -0.2, 0], r: [0.05, 0, 0], s: 1.05 }],
  [0.7, { p: [0.6, -0.4, 0], r: [0.15, 0, 0], s: 1.05 }],
  [0.76, HIDE([0.6, -4, 0])],
  [0.8, HIDE([0, 3, 0], FLAT)],
  [0.94, { p: [1.65, 0.1, 0.9], r: FLAT, s: 0.8 }],
];

const PENCIL_COLOURS = ["#e53935", "#ff7a1a", "#f4d23c", "#8bc34a", "#1e9e5a", "#18b6c7", "#2b6fd6", "#2b3194", "#7b3fb8", "#e05aa8", "#8d5a3b", "#121318"];

function Stage({ progress, dragRef, compact }: { progress: React.RefObject<number>; dragRef: React.RefObject<number>; compact: boolean }) {
  const root = useRef<THREE.Group>(null);
  const nb = useRef<THREE.Group>(null);
  const pen = useRef<THREE.Group>(null);
  const penSpin = useRef<THREE.Group>(null);
  const pencils = useRef<THREE.Group>(null);
  const extras = useRef<THREE.Group>(null);
  const open = useRef(0);
  const cap = useRef(0);
  const spin = useRef(0);
  const { camera, size } = useThree();
  const penCap = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const p = progress.current ?? 0;

    // user drag → inertial spin of the whole stage, easing back to rest
    spin.current += (dragRef.current ?? 0) * 0.005;
    dragRef.current = (dragRef.current ?? 0) * 0.88;
    spin.current = THREE.MathUtils.damp(spin.current, 0, 1.5, dt);
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, spin.current + state.pointer.x * 0.12, 4, dt);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -state.pointer.y * 0.06, 4, dt);
    }

    // notebook
    if (nb.current) {
      const [a, b, t] = poseAt(NOTEBOOK, p);
      applyPose(nb.current, a, b, t, dt);
      const targetOpen = p < 0.28 ? ease(seg(p, 0.03, 0.17)) * (1 - seg(p, 0.22, 0.28)) : 0;
      open.current = THREE.MathUtils.damp(open.current, targetOpen, 8, dt);
    }
    // pen: spins on its long axis and uncaps
    if (pen.current) {
      const [a, b, t] = poseAt(PEN, p);
      applyPose(pen.current, a, b, t, dt);
    }
    if (penSpin.current) {
      const spinT = ease(seg(p, 0.27, 0.5));
      penSpin.current.rotation.y = THREE.MathUtils.damp(penSpin.current.rotation.y, spinT * Math.PI * 4, 8, dt);
    }
    cap.current = THREE.MathUtils.damp(cap.current, p > 0.6 ? 0 : ease(seg(p, 0.33, 0.42)) * (1 - seg(p, 0.46, 0.52)) * 1.5, 8, dt);
    if (penCap.current) penCap.current.position.y = cap.current;

    // pencils: fan out into an arc, then gather into a neat row for the flat-lay
    if (pencils.current) {
      const [a, b, t] = poseAt(PENCIL_SET, p);
      applyPose(pencils.current, a, b, t, dt);
      const fan = ease(seg(p, 0.55, 0.68)) * (1 - seg(p, 0.72, 0.8));
      const row = seg(p, 0.8, 0.94);
      pencils.current.children.forEach((child, i) => {
        const n = PENCIL_COLOURS.length;
        const k = i - (n - 1) / 2;
        const tz = THREE.MathUtils.lerp(k * 0.045, k * 0.2, fan) * (1 - row) + 0 * row;
        const tx = THREE.MathUtils.lerp(k * 0.05, k * 0.38, fan) * (1 - row) + k * 0.26 * row;
        const ty = -Math.abs(k) * 0.08 * fan;
        child.rotation.z = THREE.MathUtils.damp(child.rotation.z, -tz * (1 - row), 8, dt);
        child.position.x = THREE.MathUtils.damp(child.position.x, tx, 8, dt);
        child.position.y = THREE.MathUtils.damp(child.position.y, ty, 8, dt);
      });
    }
    // accessories arrive last for the flat-lay
    if (extras.current) {
      const t = ease(seg(p, 0.84, 0.98));
      extras.current.children.forEach((c, i) => {
        const local = clamp01(t * 1.6 - i * 0.12);
        c.scale.setScalar(THREE.MathUtils.damp(c.scale.x, Math.max(0.0001, local), 8, dt));
      });
    }

    // camera: front-on product shots → top-down desk view
    const top = ease(seg(p, 0.74, 0.9));
    // Front shots keep the product right of the copy; the top-down view frames the whole desk
    // and, on desktop, leaves the left third clear for text.
    // Pull back on portrait screens so the widest pose (pencil fan) still fits horizontally.
    const aspect = size.width / size.height;
    const fit = compact ? THREE.MathUtils.clamp(1 / (aspect * 1.1), 1.2, 2.6) : 1;
    const dist = 8.6 * fit;
    const cx = compact ? 0.6 : -0.8;
    const tx = compact ? 0.15 : -2.1;
    const topY = compact ? 9.5 * fit : 12.5;
    const lx = THREE.MathUtils.lerp(cx, tx, top);
    const ly = compact ? THREE.MathUtils.lerp(-1.9, -1.4, top) : 0;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, lx, 6, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, THREE.MathUtils.lerp(compact ? -1.9 : 0, topY, top), 6, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, THREE.MathUtils.lerp(dist, compact ? 3 : 2, top), 6, dt);
    camera.lookAt(lx, ly * (1 - top), compact ? 1.6 * top : 0);
  });


  return (
    <group ref={root}>
      <group ref={nb} scale={0.0001}>
        <Notebook cover="/textures/spiral-3.jpg" spine="#7b2d26" spiral openRef={open} />
      </group>

      <group ref={pen} scale={0.0001}>
        <group ref={penSpin}>
          <PenWithCap capRef={penCap} />
        </group>
      </group>

      <group ref={pencils} scale={0.0001}>
        {PENCIL_COLOURS.map((c) => (
          <Pencil key={c} color={c} lead={c} eraser={false} length={3} />
        ))}
      </group>

      <group ref={extras} position={[0, 0.05, 0]}>
        <Highlighter scale={0.0001} position={[0.9, 0, 2.5]} rotation={[-Math.PI / 2, 0, 1.2]} />
        <Eraser scale={0.0001} position={[-2.8, 0, -1.2]} rotation={[-Math.PI / 2, 0, -0.5]} />
        <Ruler scale={0.0001} position={[-0.6, 0, 2.0]} rotation={[-Math.PI / 2, 0, 0.04]} />
        <PaperClip scale={0.0001} position={[2.85, 0, -1.25]} rotation={[-Math.PI / 2, 0, 0.6]} color="#ff5b36" />
        <PaperClip scale={0.0001} position={[3.15, 0, -0.9]} rotation={[-Math.PI / 2, 0, 0.2]} />
        <Pen scale={0.0001} body="#2b3194" accent="#e8c66a" position={[-2.9, 0.1, 0.9]} rotation={[-Math.PI / 2, 0, 0.3]} />
      </group>

      <ContactShadows position={[0, -2.2, 0]} opacity={0.3} scale={16} blur={2.6} far={5} resolution={256} color="#12154d" />
    </group>
  );
}

/** Pen with a detachable cap so the timeline can pull it off. */
function PenWithCap({ capRef }: { capRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group>
      <Pen body="#1d2170" accent="#e3e5ea" showCap={false} />
      <PenCap ref={capRef} body="#1d2170" accent="#e3e5ea" />
    </group>
  );
}

export default function ShowcaseScene({
  progress,
  dragRef,
  compact,
  active,
  eventSource,
}: {
  progress: React.RefObject<number>;
  dragRef: React.RefObject<number>;
  compact: boolean;
  active: boolean;
  eventSource: React.RefObject<HTMLElement | null>;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 8.6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Studio shadows={false} />
        <Stage progress={progress} dragRef={dragRef} compact={compact} />
      </Suspense>
    </Canvas>
  );
}
