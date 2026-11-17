"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/cn";
import { Frame, PALETTE_HEX } from "./ui";

const WORDS = ["notebooks", "pens", "colours", "office desk", "packaging"];

/* Shapes are expressed with the same 4-point clip-path + border-radius so the browser can tween between any two. */
const FULL = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
const SHAPES: { clip: string; radius: string }[] = [
  { clip: FULL, radius: "0" }, // square
  { clip: FULL, radius: "50%" }, // circle
  { clip: FULL, radius: "50% 50% 0 0" }, // arch
  { clip: FULL, radius: "100% 0 0 0" }, // quarter
  { clip: "polygon(0 0, 100% 0, 100% 0, 0 100%)", radius: "0" }, // triangle
  { clip: "polygon(100% 0, 100% 0, 100% 100%, 0 100%)", radius: "0" }, // triangle (flipped)
  { clip: "polygon(50% 8%, 92% 50%, 50% 92%, 8% 50%)", radius: "0" }, // diamond
  { clip: FULL, radius: "0 50% 0 50%" }, // leaf
];

type Cell = { s: number; c: number; empty: boolean };

/** Deterministic pseudo-random so the server and client render the same first frame. */
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const COUNT = 36; // 12 × 3 on desktop, first 24 as 6 × 4 on mobile
const INITIAL: Cell[] = Array.from({ length: COUNT }, (_, i) => ({
  s: Math.floor(seeded(i) * SHAPES.length),
  c: Math.floor(seeded(i + 100) * PALETTE_HEX.length),
  empty: seeded(i + 200) < 0.16,
}));

function Mosaic() {
  const reduce = useReducedMotion();
  const [cells, setCells] = useState(INITIAL);

  // Every couple of seconds a few blocks morph into a new shape and colour.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setCells((prev) => {
        const next = prev.slice();
        for (let k = 0; k < 4; k++) {
          const i = Math.floor(Math.random() * COUNT);
          next[i] = {
            s: Math.floor(Math.random() * SHAPES.length),
            c: Math.floor(Math.random() * PALETTE_HEX.length),
            empty: Math.random() < 0.12,
          };
        }
        return next;
      });
    }, 1600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative grid grid-cols-6 lg:grid-cols-12" aria-hidden>
      {cells.map((cell, i) => {
        const shape = SHAPES[cell.s];
        return (
          <div key={i} className={cn("aspect-square p-0", i >= 24 && "hidden lg:block")}>
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 + ((i * 7) % COUNT) * 0.025 }}
              className="size-full"
            >
              <div
                className="morph size-full"
                style={
                  {
                    clipPath: shape.clip,
                    borderRadius: shape.radius,
                    backgroundColor: cell.empty ? "transparent" : PALETTE_HEX[cell.c],
                  } as CSSProperties
                }
              />
            </motion.div>
          </div>
        );
      })}
      {/* brand mark sits in the middle of the mosaic */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 1.1 }}
        className="absolute top-1/2 left-1/2 grid aspect-square w-[calc(100%/6)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-coral shadow-[0_18px_40px_-14px_rgb(255_90_50/.7)] lg:w-[calc(100%/12)]"
      >
        <img src="/brand-assets/logo-80.png" alt="" className="w-1/2 animate-[spin_14s_linear_infinite]" />
      </motion.div>
    </div>
  );
}

function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, [reduce]);
  return (
    <span className="relative inline-grid overflow-hidden pb-[0.08em] align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          initial={{ y: "100%", rotate: 4, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          exit={{ y: "-100%", rotate: -4, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="serif-accent col-start-1 row-start-1 whitespace-nowrap text-indigo"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero2() {
  return (
    <section aria-labelledby="h2-hero" className="graph-paper relative overflow-hidden pt-28 lg:pt-36">
      <div className="container-x grid gap-8 pb-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:pb-14">
        <h1 id="h2-hero" className="text-[clamp(2.8rem,7vw,7rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
          One partner
          <br />
          for your <RotatingWord />
          <span className="sr-only">: notebooks, pens, colours, office supplies and packaging.</span>
        </h1>
        <div className="max-w-md lg:justify-self-end">
          <p className="text-lead text-ink-soft">
            Explore a world of thoughtfully selected stationery and office essentials designed to inspire creativity and productivity.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/gallery/">Explore Our Collection</Button>
            <Button href="/contact-us/" variant="outline">
              Contact us
            </Button>
          </div>
        </div>
      </div>

      <Frame className="mb-16 lg:mb-24">
        <div className="eyebrow pointer-events-none absolute -top-6 left-[4%] text-[0.65rem] text-ink-mute">School</div>
        <div className="eyebrow pointer-events-none absolute -top-6 right-[4%] text-[0.65rem] text-ink-mute">Office</div>
        <div className="eyebrow pointer-events-none absolute -bottom-6 left-[4%] text-[0.65rem] text-ink-mute">Art &amp; craft</div>
        <div className="eyebrow pointer-events-none absolute right-[4%] -bottom-6 text-[0.65rem] text-ink-mute">Packaging</div>
        <div className="mx-auto max-w-[96rem] px-[clamp(1rem,4vw,3.5rem)]">
          <Mosaic />
        </div>
      </Frame>
    </section>
  );
}
