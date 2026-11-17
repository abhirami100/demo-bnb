import type { CSSProperties, ReactNode } from "react";
import { Eraser, Highlighter, Notebook, PaperClip, Pen, Pencil, Ruler } from "./Stationery2D";

export const PENCIL_COLOURS = ["#e53935", "#ff7a1a", "#f4d23c", "#8bc34a", "#1e9e5a", "#18b6c7", "#2b6fd6", "#2b3194", "#7b3fb8", "#e05aa8", "#8d5a3b", "#121318"];

type FlatItem = { x: number; y: number; w: number; r: number; node: ReactNode };

/** Final "desk flat-lay" chapter, ordered back → front. */
const FLAT: FlatItem[] = [
  { x: 8, y: 87, w: 78, r: -2, node: <Ruler /> },
  { x: 4, y: 8, w: 40, r: -7, node: <Notebook cover="/textures/spiral-1.jpg" bare /> },
  { x: 40, y: 12, w: 56, r: -24, node: <Pen body="#2b3194" accent="#e8c66a" /> },
  ...["#e53935", "#f4d23c", "#1e9e5a", "#2b6fd6", "#7b3fb8"].map((c, i) => ({
    x: 46,
    y: 40 + i * 5.5,
    w: 50,
    r: -4 + i * 1.2,
    node: <Pencil color={c} lead={c} eraser={false} />,
  })),
  { x: 6, y: 68, w: 34, r: 14, node: <Highlighter /> },
  { x: 77, y: 72, w: 14, r: -16, node: <Eraser /> },
  { x: 45, y: 68, w: 4, r: 30, node: <PaperClip color="#ff5b36" /> },
  { x: 52, y: 71, w: 4, r: 8, node: <PaperClip /> },
];

const shadow = "drop-shadow-[0_14px_14px_rgb(18_21_77/0.2)]";

/**
 * Static markup for the showcase stage. All motion is driven by one scrubbed GSAP timeline in
 * `Showcase` targeting the `sc-*` class names, so scrolling costs only transforms on a few nodes.
 */
export function ShowcaseArt() {
  return (
    <div
      aria-hidden
      className="absolute top-[15svh] left-1/2 aspect-square w-[min(84vw,44svh)] -translate-x-1/2 lg:top-1/2 lg:right-[5%] lg:left-auto lg:w-[min(46vw,78svh)] lg:translate-x-0 lg:-translate-y-1/2"
    >
      {/* 01 notebook: opens and closes */}
      <div className="sc-nb absolute top-[11%] left-[28%] w-[44%]">
        <Notebook
          cover="/textures/spiral-3.jpg"
          spine="#7b2d26"
          spiral
          coverClassName="sc-nb-cover"
          page={
            <>
              Big ideas
              <br />
              start with
              <br />
              little supplies.
            </>
          }
        />
      </div>

      {/* 02 pen: glides in, uncaps, tilts, recaps */}
      <div className={`sc-pen absolute top-[45%] left-[12%] w-[76%] opacity-0 ${shadow}`}>
        <Pen body="#1d2170" accent="#e3e5ea" capClassName="sc-cap" />
      </div>

      {/* 03 colour pencils: fan out into an arc */}
      <div className={`sc-pencils absolute inset-0 opacity-0 ${shadow}`}>
        {PENCIL_COLOURS.map((c) => (
          <div key={c} className="sc-pencil absolute bottom-[10%] left-[47.5%] w-[5%]">
            <Pencil vertical color={c} lead={c} eraser={false} />
          </div>
        ))}
      </div>

      {/* 04 desk flat-lay */}
      {FLAT.map((f, i) => (
        <div key={i} className="sc-flat absolute opacity-0" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%` } as CSSProperties}>
          <div className={shadow} style={{ transform: `rotate(${f.r}deg)` }}>
            {f.node}
          </div>
        </div>
      ))}
    </div>
  );
}
