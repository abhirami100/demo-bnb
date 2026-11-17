"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { WHY_BNB } from "@/data/site";
import { COLLECTIONS, countOf, findItem } from "@/data/collections";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/cn";
import { Glyph, Kicker, PALETTE } from "./ui";

/* ───────── Why BnB: sticky stacking cards ───────── */
const WHY_PHOTOS = [
  findItem("flexoffice", 99),
  findItem("pelikan", 17),
  findItem("camlin", 14),
  findItem("english-notebook", 29),
  findItem("camlin", 96),
  findItem("art-craft", 43),
];

export function WhyStack2() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".ws-card");
      // Each card shrinks and dims slightly as the next one slides over it.
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector(".ws-inner"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top 70%", end: "top 20%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-why" className="graph-paper border-t border-line pt-24 pb-32 lg:pt-32">
      <div className="container-x text-center">
        <Kicker>Why BnB</Kicker>
        <h2 id="h2-why" className="mx-auto mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance">
          Everything around your order, handled
        </h2>
      </div>

      <ol className="container-x mt-14 max-w-6xl">
        {WHY_BNB.map((w, i) => {
          const photo = WHY_PHOTOS[i];
          return (
            <li key={w.title} className="ws-card sticky mb-8" style={{ top: `calc(6.5rem + ${i * 14}px)` }}>
              <div className="ws-inner grid origin-top overflow-hidden rounded-[2rem] bg-card shadow-[0_30px_60px_-30px_rgb(18_21_77/.35)] md:grid-cols-2">
                <div className="flex flex-col justify-between gap-10 p-7 lg:p-12">
                  <p className="font-serif text-lg italic text-ink-mute">
                    {i + 1}/{WHY_BNB.length}
                  </p>
                  <div>
                    <h3 className="text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.05] font-semibold tracking-[-0.03em]">{w.title}</h3>
                    <p className="mt-4 max-w-md text-ink-soft lg:text-lead">{w.body}</p>
                  </div>
                </div>
                <div className={cn("p-4 lg:p-6", PALETTE[(i + 2) % PALETTE.length])}>
                  <div className="grid h-full min-h-56 place-items-center rounded-[1.4rem] bg-card/90 p-6 lg:min-h-80">
                    {photo && <ProductImage item={photo} className="aspect-square w-full max-w-xs" sizes="(min-width: 768px) 30vw, 80vw" />}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ───────── Range: coloured tiles grouped by where they are used ───────── */
const GROUPS = [
  { tag: "School", title: "Back to school, sorted", ids: ["english-notebook", "art-craft", "camlin"] as const },
  { tag: "Office", title: "Keep every desk moving", ids: ["flexoffice", "pelikan"] as const },
];

export function Range2() {
  let n = 0;
  return (
    <section aria-labelledby="h2-range" className="graph-paper border-t border-line py-24 lg:py-32">
      <div className="container-x">
        <Kicker>What&apos;s in the range</Kicker>
        <h2 id="h2-range" className="mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance">
          Everything you need, for school and office.
        </h2>

        <div className="mt-14 space-y-14">
          {GROUPS.map((g) => (
            <div key={g.tag} className="grid gap-6 lg:grid-cols-[16rem_1fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="eyebrow rounded-full border border-ink/30 px-2.5 py-1 text-[0.6rem]">{g.tag}</span>
                <p className="mt-3 text-xl font-medium tracking-[-0.02em]">{g.title}</p>
              </div>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {g.ids.map((id) => {
                  const c = COLLECTIONS.find((x) => x.id === id)!;
                  const cover = findItem(id, c.covers[0]);
                  const k = n++;
                  return (
                    <li key={id}>
                      <Link
                        href={`/gallery/?c=${id}`}
                        className={cn(
                          "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl p-4 transition-transform duration-500 ease-out-expo hover:-translate-y-1 lg:p-5",
                          PALETTE[(k + 1) % PALETTE.length],
                        )}
                      >
                        <span>
                          <span className="block text-lg leading-tight font-semibold tracking-[-0.02em] lg:text-xl">{c.name}</span>
                          <span className="mt-1 block font-serif text-sm italic text-ink/70">{countOf(id)} products</span>
                        </span>
                        <Glyph kind={k} className="w-3/4 transition-all duration-500 ease-out-expo group-hover:scale-90 group-hover:opacity-0" />
                        {/* product photo slides up on hover */}
                        {cover && (
                          <span className="absolute inset-x-3 bottom-3 top-[38%] translate-y-[110%] rounded-xl bg-card p-2 transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
                            <ProductImage item={cover} className="size-full" sizes="20vw" />
                          </span>
                        )}
                      </Link>
                      <p className="mt-2 text-xs text-ink-soft">{c.summary}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
