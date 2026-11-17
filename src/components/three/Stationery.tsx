"use client";

/**
 * Lightweight procedural stationery models (no GLB download needed).
 * Kept deliberately generic in shape; the only branded surfaces are the genuine
 * BnB notebook cover photographs used as textures.
 * All models are authored standing along +Y, centred on the origin.
 */

import { RoundedBox, useTexture } from "@react-three/drei";
import { forwardRef, useMemo, useRef, type ReactNode } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];
import * as THREE from "three";

/* ───────────────── shared materials ───────────────── */

const matCache = new Map<string, THREE.Material>();
function std(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  const key = color + JSON.stringify(opts);
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.45, metalness: 0, ...opts });
    matCache.set(key, m);
  }
  return m;
}
const METAL = () => std("#d9dbe0", { metalness: 1, roughness: 0.22 });
const WOOD = () => std("#e7c49a", { roughness: 0.8 });
const PAPER = () => std("#fbfaf6", { roughness: 0.9 });

/* ───────────────── pencil ───────────────── */

export function Pencil({ color = "#2b3194", lead = "#2a2a2e", eraser = true, length = 3.2, ...props }: { color?: string; lead?: string; eraser?: boolean; length?: number } & GroupProps) {
  const r = 0.12;
  const body = length - 0.55 - (eraser ? 0.38 : 0);
  return (
    <group {...props}>
      <mesh castShadow material={std(color, { roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 })} position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r, body, 6]} />
      </mesh>
      {/* sharpened wood cone */}
      <mesh castShadow material={WOOD()} position={[0, body / 2 + 0.21, 0]}>
        <cylinderGeometry args={[0.035, r, 0.42, 6]} />
      </mesh>
      <mesh material={std(lead, { roughness: 0.5 })} position={[0, body / 2 + 0.47, 0]}>
        <coneGeometry args={[0.036, 0.11, 12]} />
      </mesh>
      {eraser && (
        <>
          <mesh castShadow material={METAL()} position={[0, -body / 2 - 0.11, 0]}>
            <cylinderGeometry args={[r + 0.008, r + 0.008, 0.22, 20]} />
          </mesh>
          <mesh castShadow material={std("#f08aa0", { roughness: 0.85 })} position={[0, -body / 2 - 0.3, 0]}>
            <cylinderGeometry args={[r - 0.004, r - 0.004, 0.18, 20]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ───────────────── pen ───────────────── */

const penMats = (body: string, accent: string) => ({
  bodyMat: std(body, { roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 }),
  accentMat: std(accent, { metalness: 0.9, roughness: 0.25 }),
});

/** Pen cap with clip, authored at the capped position (slides off along +Y). */
export const PenCap = forwardRef<THREE.Group, { body?: string; accent?: string }>(function PenCap({ body = "#121318", accent = "#d9dbe0" }, ref) {
  const { bodyMat, accentMat } = penMats(body, accent);
  return (
    <group ref={ref}>
      <group position={[0, 1.02, 0]}>
        <mesh castShadow material={bodyMat}>
          <cylinderGeometry args={[0.122, 0.122, 0.95, 32]} />
        </mesh>
        <mesh material={accentMat} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.122, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh castShadow material={accentMat} position={[0, -0.47, 0]}>
          <cylinderGeometry args={[0.126, 0.126, 0.06, 32]} />
        </mesh>
        <mesh castShadow material={accentMat} position={[0, 0.05, 0.15]}>
          <boxGeometry args={[0.05, 0.75, 0.035]} />
        </mesh>
      </group>
    </group>
  );
});

export function Pen({
  body = "#121318",
  accent = "#d9dbe0",
  showCap = true,
  ...props
}: { body?: string; accent?: string; showCap?: boolean } & GroupProps) {
  const { bodyMat, accentMat } = penMats(body, accent);
  return (
    <group {...props}>
      {/* barrel */}
      <mesh castShadow material={bodyMat} position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.11, 0.1, 1.9, 32]} />
      </mesh>
      {/* grip */}
      <mesh castShadow material={std("#2a2b31", { roughness: 0.9 })} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.098, 0.105, 0.5, 32]} />
      </mesh>
      <mesh castShadow material={accentMat} position={[0, 1.31, 0]}>
        <cylinderGeometry args={[0.035, 0.098, 0.22, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
      </mesh>
      {/* end cap */}
      <mesh castShadow material={accentMat} position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.12, 32]} />
      </mesh>
      {showCap && <PenCap body={body} accent={accent} />}
    </group>
  );
}

/* ───────────────── notebook ───────────────── */

type NotebookProps = {
  cover: string;
  spine?: string;
  spiral?: boolean;
  /** 0 = closed, 1 = fully open. Can be a ref for per-frame animation. */
  open?: number;
  openRef?: React.RefObject<number>;
  width?: number;
  height?: number;
} & GroupProps;

export function Notebook({ cover, spine = "#e0601f", spiral = false, open = 0, openRef, width = 2.1, height = 2.9, ...props }: NotebookProps) {
  const tex = useTexture(cover);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const thick = 0.24;
  const coverT = 0.025;
  const coverRef = useRef<THREE.Group>(null);
  const pages = useRef<THREE.Group[]>([]);

  const coverMats = useMemo(() => {
    const side = std(spine, { roughness: 0.55 });
    const front = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4 });
    // box face order: +x, -x, +y, -y, +z, -z
    return [side, side, side, side, front, PAPER()];
  }, [tex, spine]);

  useFrame(() => {
    const p = openRef ? openRef.current ?? 0 : open;
    if (coverRef.current) coverRef.current.rotation.y = -p * Math.PI * 0.96;
    pages.current.forEach((g, i) => {
      if (!g) return;
      const local = THREE.MathUtils.clamp(p * 1.25 - i * 0.07, 0, 1);
      g.rotation.y = -local * Math.PI * (0.9 - i * 0.045);
    });
  });

  const hingeX = -width / 2;
  return (
    <group {...props}>
      {/* back cover */}
      <mesh castShadow receiveShadow position={[0, 0, -thick / 2]} material={std(spine, { roughness: 0.55 })}>
        <boxGeometry args={[width, height, coverT]} />
      </mesh>
      {/* page block */}
      <mesh castShadow receiveShadow position={[0.02, 0, 0]} material={PAPER()}>
        <boxGeometry args={[width - 0.06, height - 0.08, thick - coverT * 2]} />
      </mesh>
      {/* loose leaves that fan when opening */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={i} position={[hingeX + 0.03, 0, thick / 2 - coverT - 0.004 - i * 0.004]} ref={(g) => void (g && (pages.current[i] = g))}>
          <mesh position={[(width - 0.06) / 2, 0, 0]} material={PAPER()} castShadow>
            <boxGeometry args={[width - 0.08, height - 0.1, 0.003]} />
          </mesh>
          {i === 0 && <RuledLines width={width - 0.1} height={height - 0.14} />}
        </group>
      ))}
      {/* front cover, hinged on the spine edge */}
      <group ref={coverRef} position={[hingeX, 0, thick / 2]}>
        <mesh castShadow position={[width / 2, 0, 0]} material={coverMats}>
          <boxGeometry args={[width, height, coverT]} />
        </mesh>
      </group>
      {spiral && <Spiral x={hingeX + 0.02} height={height} thick={thick} />}
    </group>
  );
}

function RuledLines({ width, height }: { width: number; height: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 352;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fbfaf6";
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "rgba(61,68,201,.35)";
    g.lineWidth = 1.2;
    for (let y = 40; y < c.height - 10; y += 14) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(c.width, y);
      g.stroke();
    }
    g.strokeStyle = "rgba(255,91,54,.55)";
    g.beginPath();
    g.moveTo(34, 0);
    g.lineTo(34, c.height);
    g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[(width + 0.04) / 2, 0, 0.002]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={tex} roughness={0.95} />
    </mesh>
  );
}

function Spiral({ x, height, thick }: { x: number; height: number; thick: number }) {
  const count = 15;
  const step = (height - 0.3) / (count - 1);
  return (
    <group position={[x, 0, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[0, -height / 2 + 0.15 + i * step, 0]} rotation={[Math.PI / 2, 0, 0]} material={METAL()} castShadow>
          <torusGeometry args={[thick / 2 + 0.03, 0.014, 8, 24]} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────── highlighter / eraser / clip / ruler ───────────────── */

export function Highlighter({ color = "#f4d23c", ...props }: { color?: string } & GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.42, 1.45, 0.28]} radius={0.1} smoothness={3} castShadow material={std(color, { roughness: 0.3, clearcoat: 0.8 })} position={[0, -0.25, 0]} />
      <RoundedBox args={[0.44, 0.7, 0.3]} radius={0.1} smoothness={3} castShadow material={std("#121318", { roughness: 0.3, clearcoat: 0.8 })} position={[0, 0.78, 0]} />
      <mesh material={std(color)} position={[0, -1.05, 0]}>
        <boxGeometry args={[0.2, 0.18, 0.12]} />
      </mesh>
    </group>
  );
}

export function Eraser({ sleeve = "#2b3194", ...props }: { sleeve?: string } & GroupProps) {
  return (
    <group {...props}>
      <RoundedBox args={[0.42, 0.95, 0.24]} radius={0.06} smoothness={3} castShadow material={std("#f7f5ef", { roughness: 0.9 })} />
      <mesh castShadow position={[0, -0.12, 0]} material={std(sleeve, { roughness: 0.6 })}>
        <boxGeometry args={[0.44, 0.55, 0.26]} />
      </mesh>
    </group>
  );
}

export function PaperClip({ color = "#c9ccd3", ...props }: { color?: string } & GroupProps) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const line = (a: [number, number], b: [number, number], n = 6) => {
      for (let i = 0; i <= n; i++) pts.push(new THREE.Vector3(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, 0));
    };
    const arc = (cx: number, cy: number, r: number, from: number, to: number, n = 10) => {
      for (let i = 1; i < n; i++) {
        const t = from + ((to - from) * i) / n;
        pts.push(new THREE.Vector3(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 0));
      }
    };
    line([0, -0.45], [0, 0.55]);
    arc(0.17, 0.55, 0.17, Math.PI, 0);
    line([0.34, 0.55], [0.34, -0.62]);
    arc(0.2, -0.62, 0.14, 0, -Math.PI);
    line([0.06, -0.62], [0.06, 0.4]);
    arc(0.17, 0.4, 0.11, Math.PI, 0);
    line([0.28, 0.4], [0.28, -0.3]);
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.1), 160, 0.022, 8, false);
  }, []);
  return (
    <group {...props}>
      <mesh geometry={geo} castShadow material={std(color, { metalness: 0.9, roughness: 0.25 })} position={[-0.17, 0, 0]} />
    </group>
  );
}

export function Ruler({ color = "#2b3194", ...props }: { color?: string } & GroupProps) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 112;
    const g = c.getContext("2d")!;
    g.fillStyle = color;
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "rgba(255,255,255,.9)";
    g.font = "600 18px sans-serif";
    for (let i = 0; i <= 150; i++) {
      const x = 24 + i * 6.5;
      const h = i % 10 === 0 ? 40 : i % 5 === 0 ? 28 : 16;
      g.fillRect(x, 0, 1.6, h);
      if (i % 10 === 0) g.fillText(String(i / 10), x - 4, 62);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [color]);
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.46, 0.03]} />
        <meshPhysicalMaterial attach="material-0" color={color} roughness={0.3} />
        <meshPhysicalMaterial attach="material-1" color={color} roughness={0.3} />
        <meshPhysicalMaterial attach="material-2" color={color} roughness={0.3} />
        <meshPhysicalMaterial attach="material-3" color={color} roughness={0.3} />
        <meshPhysicalMaterial attach="material-4" map={tex} roughness={0.3} clearcoat={0.6} />
        <meshPhysicalMaterial attach="material-5" color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ───────────────── helpers ───────────────── */

/** Group whose transform is driven externally each frame (keeps React out of the render loop). */
export const Rig = forwardRef<THREE.Group, { children: ReactNode } & GroupProps>(function Rig({ children, ...props }, ref) {
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
});

export const NOTEBOOK_TEXTURES = ["/textures/spiral-1.jpg", "/textures/spiral-2.jpg", "/textures/spiral-3.jpg", "/textures/notebook-white.jpg", "/textures/notebook-orange.jpg"];
useTexture.preload(NOTEBOOK_TEXTURES);
