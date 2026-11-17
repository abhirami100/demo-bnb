import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Block palette shared by every home-2 section (tokens live in globals.css). */
export const PALETTE = ["bg-sky", "bg-sage", "bg-lime", "bg-coral", "bg-apricot"] as const;
export const PALETTE_HEX = ["#bfe0f2", "#a9c3a6", "#cdf05c", "#ff8c66", "#f6b979"] as const;

/** Small handwritten-style label that introduces a section. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-serif text-xl italic text-ink-soft lg:text-2xl", className)}>{children}</p>;
}

/** Hairline frame with dotted corners, like a technical drawing. */
export function Frame({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  const dot = cn("absolute size-1.5", dark ? "bg-paper/70" : "bg-ink");
  return (
    <div className={cn("relative border-y", dark ? "border-paper/15" : "border-line", className)}>
      <span aria-hidden className={cn(dot, "-top-[3.5px] -left-[3px]")} />
      <span aria-hidden className={cn(dot, "-top-[3.5px] -right-[3px]")} />
      <span aria-hidden className={cn(dot, "-bottom-[3.5px] -left-[3px]")} />
      <span aria-hidden className={cn(dot, "-right-[3px] -bottom-[3.5px]")} />
      {children}
    </div>
  );
}

/** Bold black glyphs used on the range tiles (decorative). */
export function Glyph({ kind, className }: { kind: number; className?: string }) {
  const common = { className: cn("h-auto w-full", className), viewBox: "0 0 120 60", "aria-hidden": true } as const;
  switch (kind % 6) {
    case 0:
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={18 + i * 26} cy="30" rx={18 - i * 3} ry="26" />
          ))}
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <g transform="translate(36 30)">
            {[0, 60, 120].map((r) => (
              <rect key={r} x="-26" y="-7" width="52" height="14" rx="2" transform={`rotate(${r})`} />
            ))}
          </g>
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M10 60a50 50 0 0 1 100 0h-34a16 16 0 0 0-32 0Z" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${46 + i * 30} 4a26 26 0 1 0 0 52v-14a12 12 0 1 1 0-24Z`} />
          ))}
        </svg>
      );
    case 4:
      return (
        <svg {...common}>
          <rect x="4" y="8" width="112" height="44" rx="22" />
          <circle cx="30" cy="30" r="12" fill="var(--glyph-hole, #fff)" />
          <circle cx="90" cy="30" r="12" fill="var(--glyph-hole, #fff)" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={4 + i * 11.6} y="6" width="6" height="48" />
          ))}
        </svg>
      );
  }
}
