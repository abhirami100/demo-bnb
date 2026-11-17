/**
 * Lightweight 2D stationery illustrations (inline SVG + CSS).
 * They replace the WebGL models: no three.js, no canvas and no GPU warm-up, so they paint immediately.
 * Every piece scales to its container width, so layouts position them with percentages.
 */
import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Base = { className?: string; style?: CSSProperties };

/** SVG-safe unique id (React ids contain characters that break `url(#…)` in some browsers). */
function useSvgId() {
  return "s" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Cylindrical shading: bright top edge fading to a darker underside. */
function Shade({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity=".5" />
      <stop offset=".32" stopColor="#fff" stopOpacity=".08" />
      <stop offset=".7" stopColor="#000" stopOpacity=".04" />
      <stop offset="1" stopColor="#000" stopOpacity=".32" />
    </linearGradient>
  );
}

/* ───────── Pencil ───────── */
export function Pencil({
  color,
  lead = "#2a2a2e",
  eraser = true,
  vertical = false,
  className,
  style,
}: Base & { color: string; lead?: string; eraser?: boolean; vertical?: boolean }) {
  const g = useSvgId();
  const x0 = eraser ? 46 : 0;
  const art = (
    <>
      <path d="M260 0 L316 14 L260 28 Z" fill="#e9c79c" />
      <path d="M260 0 L316 14 L260 28 Z" fill={`url(#${g})`} />
      <path d="M300 10 L316 14 L300 18 Z" fill={lead} />
      {eraser && (
        <>
          <rect x="0" y="1" width="26" height="26" rx="6" fill="#f2a1ab" />
          <rect x="20" y="0" width="28" height="28" fill="#c9ccd3" />
          <path d="M27 0v28M34 0v28M41 0v28" stroke="#8f939d" strokeWidth="1.5" />
        </>
      )}
      <rect x={x0} y="0" width={264 - x0} height="28" rx={eraser ? 0 : 3} fill={color} />
      <path d="M264 0 Q274 4.6 264 9.3 Q274 14 264 18.6 Q274 23.3 264 28 Z" fill={color} />
      <path d={`M${x0} 9.3H266M${x0} 18.6H266`} stroke="#000" strokeOpacity=".12" />
      <rect x="0" y="0" width="270" height="28" fill={`url(#${g})`} rx="3" />
    </>
  );
  return (
    <svg
      viewBox={vertical ? "0 0 28 320" : "0 0 320 28"}
      className={cn("block h-auto w-full overflow-visible", className)}
      style={style}
      aria-hidden
    >
      <defs>
        <Shade id={g} />
      </defs>
      {vertical ? <g transform="translate(0 320) rotate(-90)">{art}</g> : art}
    </svg>
  );
}

/* ───────── Pen (cap is a separate group so it can slide off) ───────── */
export function Pen({
  body = "#121318",
  accent = "#d9dbe0",
  capClassName,
  className,
  style,
}: Base & { body?: string; accent?: string; capClassName?: string }) {
  const g = useSvgId();
  return (
    <svg viewBox="0 -4 320 38" className={cn("block h-auto w-full overflow-visible", className)} style={style} aria-hidden>
      <defs>
        <Shade id={g} />
      </defs>
      <rect x="0" y="5" width="16" height="20" rx="6" fill={accent} />
      <rect x="8" y="3" width="226" height="24" rx="12" fill={body} />
      <rect x="232" y="5" width="40" height="20" rx="3" fill="#2a2b31" />
      <path d="M240 5v20M248 5v20M256 5v20M264 5v20" stroke="#000" strokeOpacity=".4" strokeWidth="2" />
      <path d="M272 6 L304 13 L304 17 L272 24 Z" fill={accent} />
      <circle cx="306" cy="15" r="2.4" fill="#1a1a1a" />
      <rect x="0" y="3" width="304" height="24" rx="10" fill={`url(#${g})`} />
      <g className={capClassName}>
        <rect x="196" y="1" width="116" height="28" rx="14" fill={body} />
        <rect x="200" y="1" width="9" height="28" fill={accent} />
        <rect x="196" y="1" width="116" height="28" rx="14" fill={`url(#${g})`} />
        <rect x="214" y="-3" width="82" height="7" rx="3.5" fill={accent} />
        <circle cx="292" cy="2" r="4" fill={accent} />
      </g>
    </svg>
  );
}

/* ───────── Highlighter ───────── */
export function Highlighter({ color = "#f4d23c", cap = "#e0b81f", className, style }: Base & { color?: string; cap?: string }) {
  const g = useSvgId();
  return (
    <svg viewBox="0 0 230 44" className={cn("block h-auto w-full overflow-visible", className)} style={style} aria-hidden>
      <defs>
        <Shade id={g} />
      </defs>
      <rect x="0" y="2" width="172" height="40" rx="10" fill={color} />
      <rect x="28" y="2" width="84" height="40" fill="#fff" fillOpacity=".3" />
      <rect x="150" y="0" width="80" height="44" rx="12" fill={cap} />
      <rect x="0" y="0" width="230" height="44" rx="11" fill={`url(#${g})`} />
    </svg>
  );
}

/* ───────── Eraser ───────── */
export function Eraser({ sleeve = "#2b3194", className, style }: Base & { sleeve?: string }) {
  const g = useSvgId();
  return (
    <svg viewBox="0 0 100 54" className={cn("block h-auto w-full overflow-visible", className)} style={style} aria-hidden>
      <defs>
        <Shade id={g} />
      </defs>
      <rect x="0" y="0" width="100" height="54" rx="10" fill="#f6f3ee" />
      <path d="M36 0H90a10 10 0 0 1 10 10V44a10 10 0 0 1-10 10H36Z" fill={sleeve} />
      <rect x="44" y="23" width="44" height="8" rx="4" fill="#fff" fillOpacity=".85" />
      <rect x="0" y="0" width="100" height="54" rx="10" fill={`url(#${g})`} />
    </svg>
  );
}

/* ───────── Ruler ───────── */
export function Ruler({ className, style }: Base) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <svg viewBox="0 0 420 52" className={cn("block h-auto w-full overflow-visible", className)} style={style} aria-hidden>
      <rect x="0.5" y="0.5" width="419" height="51" rx="4" fill="#dfe7f3" fillOpacity=".9" stroke="#9fb0cc" />
      {ticks.map((i) => (
        <line key={i} x1={10 + i * 10} x2={10 + i * 10} y1="1" y2={i % 10 === 0 ? 19 : i % 5 === 0 ? 13 : 8} stroke="#4b5873" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4].map((n) => (
        <text key={n} x={10 + n * 100} y="32" fontSize="9" textAnchor="middle" fill="#4b5873" fontFamily="ui-sans-serif, system-ui">
          {n * 10}
        </text>
      ))}
    </svg>
  );
}

/* ───────── Paper clip ───────── */
export function PaperClip({ color = "#c9ccd3", className, style }: Base & { color?: string }) {
  return (
    <svg viewBox="0 0 28 80" className={cn("block h-auto w-full overflow-visible", className)} style={style} aria-hidden>
      <path
        d="M9 24v38a5 5 0 0 0 10 0V12a8 8 0 0 0-16 0v52a11 11 0 0 0 22 0V22"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ───────── Notebook (HTML + CSS 3D cover, no WebGL) ───────── */
export function Notebook({
  cover,
  spine = "#2b3194",
  spiral = false,
  bare = false,
  eager = false,
  page,
  coverClassName,
  className,
  style,
}: Base & {
  cover: string;
  spine?: string;
  spiral?: boolean;
  /** The cover photo already shows its own binding: draw no rings or spine strip. */
  bare?: boolean;
  eager?: boolean;
  coverClassName?: string;
  /** Content written on the first page (revealed when the cover opens). */
  page?: ReactNode;
}) {
  const ruled = {
    backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 7%, rgb(43 49 148 / .14) 7% calc(7% + 1px))",
  };
  return (
    <div className={cn("relative aspect-[3/4] [container-type:inline-size] [perspective:2600px]", className)} style={style} aria-hidden>
      {/* page block with ruled lines */}
      <div
        className="absolute inset-0 rounded-l-sm rounded-r-lg bg-card shadow-[0_2px_0_#e2ddd2,0_4px_0_#f7f4ee,0_6px_0_#e2ddd2,0_26px_40px_-18px_rgb(18_21_77/.5)]"
        style={ruled}
      >
        <div className="absolute inset-y-0 left-[14%] w-px bg-marker/40" />
        {page && <div className="absolute inset-x-[20%] top-[15.6%] font-serif text-[8.4cqw] leading-[9.33cqw] text-indigo italic">{page}</div>}
      </div>
      {/* cover: front face + inside face */}
      <div className={cn("absolute inset-0 origin-left [transform-style:preserve-3d]", coverClassName)}>
        <div className="absolute inset-0 overflow-hidden rounded-l-sm rounded-r-lg [backface-visibility:hidden]" style={{ background: spine }}>
          <img
            src={cover}
            alt=""
            draggable={false}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/.3),transparent_42%,rgb(0_0_0/.14))]" />
          {!spiral && !bare && <div className="absolute inset-y-0 left-0 w-[8%]" style={{ background: spine }} />}
        </div>
        {/* inside of the cover reads as the left page of an open spread */}
        <div
          className="absolute inset-0 rounded-l-lg rounded-r-sm bg-card shadow-[inset_-18px_0_24px_-16px_rgb(18_21_77/.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={ruled}
        >
          <div className="absolute inset-y-0 right-[14%] w-px bg-marker/40" />
        </div>
      </div>
      {spiral && !bare && (
        <div className="absolute inset-y-[3%] -left-[4%] flex w-[10%] flex-col justify-between">
          {Array.from({ length: 13 }, (_, i) => (
            <span key={i} className="block h-[2.6%] rounded-full bg-[linear-gradient(to_bottom,#f2f3f5,#8d929c)] shadow-[0_1px_1px_rgb(0_0_0/.25)]" />
          ))}
        </div>
      )}
    </div>
  );
}
