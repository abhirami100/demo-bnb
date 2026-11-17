"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/data/brands";
import { SITE, WHY_BNB } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Kicker } from "./ui";

/* Checkerboard placement on a 6-column grid (12 brands → 12 of 24 cells). */
const FILLED = [0, 2, 4, 7, 9, 11, 12, 14, 16, 19, 21, 23];

export function Brands2() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Gravity settle (desktop 6-column grid only; on smaller screens the empty cells are hidden,
      // so the logos already sit in rows). Logos start in their checkerboard spots; once you scroll
      // to the grid each one falls straight down its column onto the tile/floor below, packing the
      // 12 logos into two full rows. Scrolling back up lifts them back to the checkerboard.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const COLS = 6;
        const grid = root.current!.querySelector<HTMLElement>(".br-grid")!;
        const cells = Array.from(grid.children) as HTMLElement[];
        const ROWS = Math.ceil(cells.length / COLS);

        // For each column: lowest tile lands on the bottom row, the next one on the row above, …
        type Move = { card: HTMLElement; from: number; to: number };
        const moves: Move[] = [];
        for (let col = 0; col < COLS; col++) {
          const inCol = FILLED.filter((i) => i % COLS === col).sort((a, b) => b - a);
          inCol.forEach((cellIndex, k) => {
            const card = cells[cellIndex].querySelector<HTMLElement>(".br-card");
            if (card) moves.push({ card, from: cellIndex, to: (ROWS - 1 - k) * COLS + col });
          });
        }

        const tl = gsap.timeline({ paused: true });
        for (const m of moves) {
          const rows = (m.to - m.from) / COLS;
          if (rows <= 0) continue;
          tl.to(
            m.card,
            {
              // measured from the real cells so it stays exact at any width
              y: () => cells[m.to].offsetTop - cells[m.from].offsetTop,
              duration: 0.55 + 0.3 * Math.sqrt(rows), // farther falls take longer, like gravity
              ease: "bounce.out",
            },
            gsap.utils.random(0, 0.25),
          );
        }

        ScrollTrigger.create({
          trigger: grid,
          start: "top 45%",
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
          // re-measure fall distances after a resize, keeping the current settled/unsettled state
          onRefresh: (self) => {
            tl.progress(0).invalidate();
            if (self.progress > 0) tl.progress(1);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  let b = 0;
  return (
    <section
      ref={root}
      aria-labelledby="h2-brands"
      className="graph-paper py-24 lg:py-32"
    >
      <div className="container-x text-center">
        <Kicker>Our brands</Kicker>
        <h2
          id="h2-brands"
          className="mx-auto mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance"
        >
          One distributor. Every brand on the shelf.
        </h2>
      </div>

      <div className="container-x mt-14 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="br-grid grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 24 }, (_, i) => {
            const brand = FILLED.includes(i) ? BRANDS[b++] : null;
            return (
              <div
                key={i}
                className={cn(
                  "h-24 border-r border-b border-line p-1.5",
                  !brand && "hidden lg:block",
                )}
              >
                {brand && (
                  <div className="br-card h-full">
                    <Link
                      href="/brand/"
                      aria-label={brand.name}
                      className="group grid h-full place-items-center rounded-xl bg-white px-4 py-2.5 shadow-[0_1px_0_rgb(0_0_0/.04)] ring-1 ring-line transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgb(18_19_24/.4)]"
                    >
                      {/* logo files have white backgrounds, so the tile is white too */}
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt=""
                         
                          className="max-h-11 w-auto max-w-full object-contain transition-transform duration-500 ease-out-expo group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-[clamp(1.1rem,1.6vw,1.5rem)] font-bold tracking-[-0.04em] whitespace-nowrap text-indigo transition-transform duration-500 ease-out-expo group-hover:scale-105">
                          {brand.name}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <dl className="grid grid-cols-3 gap-6 self-center lg:grid-cols-1 lg:gap-10">
          <div className="flex flex-col">
            <dt className="text-sm text-ink-soft">brands</dt>
            <dd className="order-first text-[clamp(2.4rem,4vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]">
              {BRANDS.length}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-sm text-ink-soft">cities</dt>
            <dd className="order-first text-[clamp(2.4rem,4vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]">
              {1 + SITE.branches.length}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-sm text-ink-soft">established</dt>
            <dd className="order-first text-[clamp(2.4rem,4vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]">
              {SITE.founded}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ───────── Hub: everything orbits one partner ───────── */
const ORBIT = [
  "Notebooks",
  "Pens",
  "Colours",
  "Art & craft",
  "Office",
  "Packaging",
];

export function Hub2() {
  return (
    <section
      aria-labelledby="h2-hub"
      className="graph-paper overflow-hidden border-t border-line py-24 lg:py-32"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
        <h2
          id="h2-hub"
          className="text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.035em] lg:text-right"
        >
          Your whole list,
          <br />
          one partner
        </h2>

        <div className="relative mx-auto aspect-square w-[min(80vw,26rem)]">
          {/* dashed orbit */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".35"
              strokeWidth=".35"
              strokeDasharray="1.2 1.6"
            />
          </svg>
          {/* rotating ring of labels (counter-rotated so text stays upright) */}
          <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
            {ORBIT.map((label, i) => {
              const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <div
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(50 + Math.cos(a) * 44).toFixed(2)}%`,
                    top: `${(50 + Math.sin(a) * 44).toFixed(2)}%`,
                  }}
                >
                  <span className="block animate-[spin_40s_linear_infinite_reverse] rounded-full border border-line bg-card px-3 py-1 text-xs font-medium whitespace-nowrap shadow-sm lg:text-sm">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* centre */}
          <div className="absolute inset-[24%] grid place-items-center rounded-[38%] bg-lime">
            <span className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
              BnB Group
            </span>
          </div>
        </div>

        <p className="text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.035em]">
          every order,
          <br />
          handled.
        </p>
      </div>

      <div className="container-x mt-12 flex flex-col items-center">
        <span aria-hidden className="h-14 w-px bg-ink/30" />
        <div className="w-full max-w-md rounded-2xl bg-card p-6 text-center shadow-sm">
          <p className="font-semibold tracking-[-0.02em]">{WHY_BNB[0].title}</p>
          <p className="mt-2 text-sm text-ink-soft">{WHY_BNB[0].body}</p>
          <div className="mt-5 flex justify-center">
            <Button href={SITE.tollFree.href}>
              Call {SITE.tollFree.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
