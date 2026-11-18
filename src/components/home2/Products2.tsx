"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { LIFESTYLE } from "@/data/site";
import { cn } from "@/lib/cn";
import { Kicker } from "./ui";

/**
 * "Our Product Range" — the strip that follows the banner on the live site (same 8 photos,
 * brands as named in its alt text), laid out as an accordion of tall photo strips: one opens
 * wide at a time (auto-advancing, or on hover / tap), and the strips rise in one by one.
 */
const PRODUCTS = [
  { src: LIFESTYLE.artDesk, brand: "Camlin", name: "Art essentials" },
  { src: LIFESTYLE.oilPastels, brand: "Camlin", name: "Oil pastels" },
  { src: LIFESTYLE.montexSet, brand: "Montex", name: "Writing set" },
  { src: LIFESTYLE.celloBottles, brand: "Cello", name: "Bottles" },
  { src: LIFESTYLE.celloPens, brand: "Cello", name: "Pens" },
  { src: LIFESTYLE.colourSplit, brand: null, name: "Colours" },
  { src: LIFESTYLE.pastelDesk, brand: null, name: "Pastels" },
  { src: LIFESTYLE.pastelPens, brand: null, name: "Pens" },
];

const AUTO_MS = 3800;
const pad = (n: number) => String(n).padStart(2, "0");

export function Products2() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // gently walk through the range on its own until someone takes over
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % PRODUCTS.length), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      tl.from(".pr-head", { yPercent: 110, stagger: 0.1, duration: 1 })
        // strips rise up and unmask one after another
        .from(
          ".pr-strip",
          { yPercent: 18, clipPath: "inset(100% 0% 0% 0% round 1.25rem)", duration: 1.1, ease: "expo.out", stagger: 0.09 },
          0.15,
        )
        .from(".pr-meta", { autoAlpha: 0, y: 12, duration: 0.6 }, 0.6);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-products" className="graph-paper relative overflow-hidden border-y border-line py-20 lg:py-28">
      <div className="container-x">
        {/* heading row */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>What we supply</Kicker>
            <h2 id="h2-products" className="mt-1 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
              <span className="inline-block overflow-hidden align-bottom">
                <span className="pr-head inline-block">Our Product</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="pr-head serif-accent inline-block font-normal">Range.</span>
              </span>
            </h2>
          </div>
          <div className="pr-meta flex items-center gap-6">
            <p className="font-mono text-sm tabular-nums text-ink-soft" aria-hidden>
              {pad(active + 1)} <span className="text-ink/30">/ {pad(PRODUCTS.length)}</span>
            </p>
            <Link
              href="/gallery/"
              className="group inline-flex items-center gap-2 border-b border-ink pb-1 font-medium tracking-[-0.02em]"
            >
              View all products
              <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* accordion of strips: row on desktop, column on mobile */}
        <ul
          className="mt-10 flex h-[78svh] max-h-[44rem] flex-col gap-2 lg:mt-14 lg:h-[64svh] lg:flex-row lg:gap-3"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {PRODUCTS.map((p, i) => {
            const open = i === active;
            return (
              <li
                key={p.src}
                className="pr-strip relative min-h-0 min-w-0 overflow-hidden rounded-[1.25rem] bg-ink transition-[flex-grow] duration-[900ms] ease-out-expo"
                style={{ flexGrow: open ? 6 : 1, flexBasis: 0 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={open}
                  aria-label={p.brand ? `${p.brand} ${p.name}` : p.name}
                  className="group absolute inset-0 size-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <img
                    src={p.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover transition-[transform,filter] duration-[1200ms] ease-out-expo",
                      open ? "scale-100 brightness-100" : "scale-110 brightness-[0.6] grayscale-[35%] group-hover:brightness-75",
                    )}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

                  {/* slim state: number + brand, set sideways on desktop */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-3 left-3 flex items-center gap-2 font-mono text-[0.7rem] tabular-nums text-paper transition-opacity duration-500 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:flex-col",
                      open && "opacity-0",
                    )}
                  >
                    {pad(i + 1)}
                    <span className="font-sans text-xs font-medium whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180">
                      {p.brand ?? p.name}
                    </span>
                  </span>

                  {/* open state: big caption */}
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 p-4 text-paper transition-[opacity,transform] duration-700 ease-out-expo lg:p-7",
                      open ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0",
                    )}
                  >
                    <span className="block font-mono text-xs tabular-nums text-paper/70">{pad(i + 1)}</span>
                    <span className="mt-1 block text-[clamp(1.6rem,3vw,2.8rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap">
                      {p.brand && <>{p.brand} </>}
                      <span className="font-serif font-normal italic">{p.brand ? p.name.toLowerCase() : p.name}</span>
                    </span>
                  </span>

                  {/* auto-advance timer */}
                  {open && !paused && (
                    <span
                      key={active}
                      aria-hidden
                      className="absolute top-0 left-0 h-1 bg-paper/80"
                      style={{ animation: `pr-timer ${AUTO_MS}ms linear forwards` }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <style>{`@keyframes pr-timer { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
