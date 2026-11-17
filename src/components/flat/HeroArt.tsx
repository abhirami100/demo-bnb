import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eraser, Highlighter, Notebook, PaperClip, Pen, Pencil, Ruler } from "./Stationery2D";

type Piece = {
  /** Position and width as % of the composition box. */
  x: number;
  y: number;
  w: number;
  /** Resting rotation (deg). */
  r: number;
  /** Pointer-parallax strength; higher reads as closer to the viewer. */
  depth: number;
  /** Entrance delay (s). */
  d: number;
  desktopOnly?: boolean;
  shadow?: boolean;
  node: ReactNode;
};

/* Ordered back → front. */
const PIECES: Piece[] = [
  { x: 4, y: 4, w: 22, r: -16, depth: 0.15, d: 0.42, desktopOnly: true, node: <Notebook cover="/textures/notebook-white.jpg" spine="#d8dbe6" eager /> },
  { x: 62, y: 0, w: 27, r: 10, depth: 0.2, d: 0.3, node: <Notebook cover="/textures/spiral-2.jpg" spine="#26355f" spiral eager /> },
  { x: 20, y: -4, w: 54, r: 5, depth: 0.3, d: 1.0, desktopOnly: true, shadow: true, node: <Ruler /> },
  { x: 30, y: 12, w: 35, r: -8, depth: 0.45, d: 0.15, node: <Notebook cover="/textures/spiral-1.jpg" bare eager /> },
  { x: 0, y: 34, w: 36, r: 30, depth: 0.7, d: 0.82, shadow: true, node: <Pen body="#2b3194" accent="#e8c66a" /> },
  { x: 0, y: 62, w: 46, r: -26, depth: 0.9, d: 0.55, shadow: true, node: <Pencil color="#2b3194" /> },
  { x: 14, y: 78, w: 42, r: -10, depth: 1, d: 0.62, shadow: true, node: <Pencil color="#ff5b36" /> },
  { x: 56, y: 76, w: 38, r: 22, depth: 0.8, d: 0.68, shadow: true, node: <Pencil color="#f4d23c" eraser={false} lead="#c79a00" /> },
  { x: 48, y: 48, w: 46, r: -36, depth: 1.1, d: 0.75, shadow: true, node: <Pen /> },
  { x: 36, y: 88, w: 26, r: 8, depth: 1.2, d: 0.9, shadow: true, node: <Highlighter /> },
  { x: 86, y: 54, w: 12, r: 24, depth: 1.3, d: 0.96, shadow: true, node: <Eraser /> },
  { x: 25, y: 6, w: 4, r: 18, depth: 1.4, d: 1.08, shadow: true, node: <PaperClip /> },
  { x: 92, y: 28, w: 4, r: -34, depth: 1.4, d: 1.14, shadow: true, node: <PaperClip color="#ff5b36" /> },
  { x: 6, y: 86, w: 4, r: 62, depth: 1.4, d: 1.2, shadow: true, node: <PaperClip /> },
];

/**
 * Floating stationery composition for the hero. Entrance and idle float are pure CSS
 * (they start before hydration); pointer parallax and scroll motion are added by the Hero via GSAP
 * on `.hp-par` (reads `data-depth`) and `.hero-art-inner`.
 */
export function HeroArt({ paused }: { paused: boolean }) {
  return (
    <div
      aria-hidden
      data-paused={paused || undefined}
      className="absolute top-[13svh] left-1/2 aspect-[5/4] w-[min(92vw,30rem)] -translate-x-1/2 lg:top-1/2 lg:right-[3%] lg:left-auto lg:w-[min(50vw,62rem)] lg:translate-x-0 lg:-translate-y-[46%]"
    >
      <div className="hero-art-inner relative size-full">
        {PIECES.map((p, i) => (
          <div
            key={i}
            className={cn("absolute", p.desktopOnly && "hidden lg:block")}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` }}
          >
            <div className="hp-par will-change-transform" data-depth={p.depth}>
              <div className="piece-in" style={{ "--d": `${p.d}s`, "--spin": `${p.r > 0 ? -28 : 28}deg` } as CSSProperties}>
                <div
                  className="piece-float"
                  style={
                    {
                      "--fd": `${5 + (i % 4) * 0.9}s`,
                      "--fdl": `${-i * 0.73}s`,
                      "--fy": `${-6 - p.depth * 8}px`,
                      "--fr": `${i % 2 ? 2.5 : -2.5}deg`,
                    } as CSSProperties
                  }
                >
                  <div
                    className={cn(p.shadow && "drop-shadow-[0_16px_14px_rgb(18_21_77/0.22)]")}
                    style={{ transform: `rotate(${p.r}deg)` }}
                  >
                    {p.node}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
