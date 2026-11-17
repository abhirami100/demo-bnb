"use client";

import { useRef, useState } from "react";
import { COLLECTION_BY_ID, FEATURED, itemLabel } from "@/data/collections";
import { ProductImage } from "@/components/ui/ProductImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const SIZES = ["w-[78vw] sm:w-[46vw] lg:w-[min(32vw,52vh)]", "w-[64vw] sm:w-[36vw] lg:w-[min(24vw,40vh)]", "w-[70vw] sm:w-[40vw] lg:w-[min(28vw,46vh)]"];
const OFFSETS = ["lg:mt-0", "lg:mt-[10vh]", "lg:-mt-[4vh]", "lg:mt-[6vh]"];

/** Featured products: horizontal gallery driven by vertical scroll on desktop; swipeable rail on touch. */
export function FeaturedRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Each card counter-rotates slightly as it travels — subtle depth.
        gsap.utils.toArray<HTMLElement>(".rail-img").forEach((img) => {
          gsap.fromTo(
            img,
            { rotate: -4, scale: 0.92 },
            {
              rotate: 4,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="featured-title" className="relative overflow-hidden bg-ink py-20 text-paper lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 items-center gap-5 overflow-x-auto px-4 sm:scroll-px-8 sm:px-8 lg:snap-none lg:overflow-visible lg:gap-8 lg:pr-[10vw] lg:pl-[clamp(1rem,4vw,3.5rem)]"
      >
        <div className="w-[80vw] shrink-0 snap-start sm:w-[50vw] lg:w-[32vw] lg:pr-10">
          <p className="eyebrow text-sun">Featured products</p>
          <h2 id="featured-title" className="mt-5 text-h1 font-semibold">
            Picked from the <span className="serif-accent font-normal text-sun">shelves</span>.
          </h2>
          <p className="mt-6 max-w-sm text-paper/70">
            A handful of genuine products from across our five collections. Tap any piece for a closer look.
          </p>
          <p className="mt-10 hidden items-center gap-3 text-sm text-paper/50 lg:flex">
            <span className="h-px w-10 bg-paper/40" /> Keep scrolling
          </p>
        </div>
        {FEATURED.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpen(i)}
            className={cn("group shrink-0 snap-center text-left", SIZES[i % SIZES.length], OFFSETS[i % OFFSETS.length])}
          >
            <span className="rail-img relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-white p-8 transition-[border-radius] duration-700 ease-out-expo group-hover:rounded-[3rem]">
              <ProductImage
                item={item}
                className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                sizes="(min-width:1024px) 30vw, 70vw"
              />
              <span className="absolute right-4 bottom-4 grid size-11 translate-y-3 place-items-center rounded-full bg-ink text-sm text-paper opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                ⤢
              </span>
            </span>
            <span className="mt-4 flex items-baseline justify-between gap-4">
              <span className="eyebrow text-paper/50">{COLLECTION_BY_ID[item.collection].name}</span>
              <span className="text-xs text-paper/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <span className="mt-1 block font-medium tracking-[-0.01em] text-paper/90">{itemLabel(item)}</span>
          </button>
        ))}
      </div>
      <Lightbox items={FEATURED} index={open} onChange={setOpen} />
    </section>
  );
}
