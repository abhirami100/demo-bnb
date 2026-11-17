"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/gsap";
import { COLLECTIONS, countOf, findItem, type Collection } from "@/data/collections";
import { ProductImage } from "@/components/ui/ProductImage";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const LAYOUT = [
  "lg:col-span-7 lg:row-span-2 min-h-[30rem] lg:min-h-[44rem]",
  "lg:col-span-5 min-h-[24rem] lg:min-h-0",
  "lg:col-span-5 min-h-[24rem] lg:min-h-0",
  "lg:col-span-5 min-h-[24rem]",
  "lg:col-span-7 min-h-[24rem]",
];

/** Positions for the fanned product stack (rest → hover). */
const FAN = [
  { rest: { x: "-52%", y: "4%", r: -10 }, hover: { x: "-82%", y: "-2%", r: -16 } },
  { rest: { x: "0%", y: "-4%", r: 0 }, hover: { x: "0%", y: "-10%", r: 0 } },
  { rest: { x: "52%", y: "6%", r: 9 }, hover: { x: "82%", y: "0%", r: 15 } },
];

function CollectionCard({ c, index }: { c: Collection; index: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(28rem circle at ${x} ${y}, rgb(255 255 255 / .55), transparent 60%)`);
  const covers = c.covers.slice(0, 3).map((n) => findItem(c.id, n)!).filter(Boolean);
  const big = index === 0;

  return (
    <Reveal delay={(index % 2) * 0.08} className={cn("relative [perspective:1200px]", LAYOUT[index])}>
      <motion.div
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="group relative h-full"
      >
        <Link
          href={`/gallery/?c=${c.id}`}
          className="relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 sm:p-8"
          style={{ backgroundColor: `color-mix(in oklab, ${c.tone} 34%, var(--color-card))` }}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: glow,
            }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <span className="eyebrow rounded-full bg-paper/70 px-3 py-1.5 text-ink-soft backdrop-blur">
              0{index + 1} · {countOf(c.id)} products
            </span>
            <span
              aria-hidden
              className="grid size-12 place-items-center rounded-full bg-ink text-paper transition-transform duration-700 ease-out-expo group-hover:rotate-[-45deg] group-hover:scale-110"
            >
              →
            </span>
          </div>

          {/* fanned product stack */}
          <div className={cn("relative my-6 flex-1", big ? "min-h-[16rem]" : "min-h-[11rem]")} style={{ transform: "translateZ(40px)" }}>
            {covers.map((item, i) => (
              <div key={item.id} className={cn("absolute inset-0 flex items-center justify-center", i === 1 ? "z-10" : "z-0")}>
                <motion.div
                  variants={{
                    rest: { x: FAN[i].rest.x, y: FAN[i].rest.y, rotate: FAN[i].rest.r, scale: i === 1 ? 1 : 0.86 },
                    hover: { x: FAN[i].hover.x, y: FAN[i].hover.y, rotate: FAN[i].hover.r, scale: i === 1 ? 1.08 : 0.9 },
                  }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  className={cn("aspect-[4/5] max-h-full", big ? "h-[min(100%,24rem)]" : "h-[min(100%,15rem)]")}
                >
                  <div className="size-full rounded-2xl bg-white p-3 shadow-[0_24px_50px_-24px_rgb(18_19_24/.45)]">
                    <ProductImage item={item} blend={false} className="size-full" sizes="(min-width:1024px) 18vw, 40vw" />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="relative" style={{ transform: "translateZ(30px)" }}>
            <h3 className={cn("font-semibold tracking-[-0.04em]", big ? "text-h1" : "text-h2")}>
              <span className="relative inline-block overflow-hidden align-bottom">
                <span className="block transition-transform duration-700 ease-out-expo group-hover:-translate-y-full">{c.name}</span>
                <span aria-hidden className="serif-accent absolute inset-0 block translate-y-full font-normal transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
                  {c.name}
                </span>
              </span>
            </h3>
            <p className="mt-2 max-w-md text-ink-soft">{c.summary}</p>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export function Collections() {
  return (
    <section aria-labelledby="collections-title" className="container-x py-24 lg:py-36">
      <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow text-indigo">Our product range</p>
          <SplitReveal as="h2" className="mt-5 max-w-3xl text-h1 font-semibold">
            <span id="collections-title">
              Five collections, <span className="serif-accent font-normal">one</span> trusted source.
            </span>
          </SplitReveal>
        </div>
        <Link href="/gallery/" className="group inline-flex items-center gap-2 self-start border-b border-ink/30 pb-1 font-medium hover:border-ink lg:self-auto">
          View the full gallery <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
        {COLLECTIONS.map((c, i) => (
          <CollectionCard key={c.id} c={c} index={i} />
        ))}
      </div>
    </section>
  );
}
