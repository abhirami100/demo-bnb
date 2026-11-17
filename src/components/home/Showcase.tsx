"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMedia";
import { ShowcaseArt, PENCIL_COLOURS } from "@/components/flat/ShowcaseArt";
import { ProductImage } from "@/components/ui/ProductImage";
import { findItem } from "@/data/collections";
import { LIFESTYLE } from "@/data/site";
import { cn } from "@/lib/cn";
import { useLenis } from "@/components/providers/SmoothScroll";

/** Chapter copy: headlines are editorial; body text is quoted from the current site's brand pages. */
const CHAPTERS = [
  {
    kicker: "Notebooks",
    title: (
      <>
        Pages that open <span className="serif-accent font-normal">every</span> idea.
      </>
    ),
    body: "Smartkids notebooks are high-quality notebooks and are well accepted by most of the schools in the Kingdom — alongside BnB’s own English notebook range.",
    link: { href: "/gallery/?c=english-notebook", label: "Browse English Notebooks" },
    photo: findItem("english-notebook", 29)!,
  },
  {
    kicker: "Writing instruments",
    title: (
      <>
        Made to <span className="serif-accent font-normal">write</span>, every day.
      </>
    ),
    body: "We are the sole distributor of Cello pen, and Cello Trimate is the most selling ball point pen in KSA — with Montex, Orion, Digno, Flexoffice and Pelikan alongside.",
    link: { href: "/brand/", label: "Meet our brands" },
    photo: findItem("pelikan", 17)!,
  },
  {
    kicker: "Colour & art",
    title: (
      <>
        A spectrum for <span className="serif-accent font-normal">every</span> artist.
      </>
    ),
    body: "Camel and Camlin have over 2000 innovative products — the most recognized stationery and art brand in India as well as abroad.",
    link: { href: "/gallery/?c=camlin", label: "Explore Camlin" },
    photo: findItem("camlin", 159)!,
  },
  {
    kicker: "One partner",
    title: (
      <>
        A to Z, for school <span className="serif-accent font-normal">&amp;</span> office.
      </>
    ),
    body: "We offer a comprehensive range of stationery supplies and packaging products, providing an all-encompassing solution for your needs.",
    link: { href: "/gallery/", label: "See the full collection" },
    photo: null,
  },
] as const;

const BOUNDS = [0, 0.25, 0.5, 0.74, 1.01];

function StaticShowcase() {
  return (
    <section id="showcase" aria-labelledby="showcase-title" className="container-x py-24 lg:py-36">
      <h2 id="showcase-title" className="eyebrow text-indigo">
        Product showcase
      </h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-2">
        {CHAPTERS.map((c, i) => (
          <li key={c.kicker} className="overflow-hidden rounded-[2rem] bg-card p-6 lg:p-10">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-paper">
              {c.photo ? (
                <ProductImage item={c.photo} className="size-full p-6" />
              ) : (
                <img src={LIFESTYLE.artDesk} alt="Art supplies on a studio desk" className="size-full object-cover" loading="lazy" />
              )}
            </div>
            <p className="eyebrow mt-6 text-ink-mute">
              0{i + 1} — {c.kicker}
            </p>
            <h3 className="mt-3 text-h3 font-semibold">{c.title}</h3>
            <p className="mt-3 text-ink-soft">{c.body}</p>
            <Link href={c.link.href} className="mt-5 inline-block font-medium text-indigo underline-offset-4 hover:underline">
              {c.link.label} →
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Showcase() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (reduce) return;
      const mid = (PENCIL_COLOURS.length - 1) / 2;
      // One timeline, scrubbed by scroll. Positions are in scroll progress (0 → 1) and line up with BOUNDS.
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate(self) {
            if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
            const idx = BOUNDS.findIndex((b, i) => self.progress >= b && self.progress < BOUNDS[i + 1]);
            setChapter((c) => (idx !== -1 && idx !== c ? idx : c));
          },
        },
      });

      // 01 — notebook turns to face us and opens flat into a centred spread, then closes and slides away.
      tl.fromTo(".sc-nb", { rotation: -8, yPercent: 4, xPercent: 0 }, { rotation: 0, yPercent: 0, xPercent: 50, duration: 0.14 }, 0.02)
        .fromTo(".sc-nb-cover", { rotationY: 0 }, { rotationY: -179, duration: 0.14 }, 0.02)
        .to(".sc-nb-cover", { rotationY: 0, duration: 0.05 }, 0.18)
        .to(".sc-nb", { xPercent: 0, rotation: -6, duration: 0.05 }, 0.18)
        .to(".sc-nb", { xPercent: -130, rotation: -20, autoAlpha: 0, duration: 0.05, ease: "power2.in" }, 0.22)

        // 02 — pen glides in, the cap pulls fully clear of the tip (lifting and tipping away),
        //      the pen tilts into a writing angle, then the cap snaps back on and the pen leaves.
        //      Cap units are the pen's SVG units: the cap starts at x=196 and the tip ends at ~309,
        //      so it has to travel > 113 to uncover the tip.
        .fromTo(".sc-pen", { xPercent: 60, rotation: -50, autoAlpha: 0 }, { xPercent: 0, rotation: -20, autoAlpha: 1, duration: 0.06 }, 0.25)
        // make room on the right so the removed cap stays in frame
        .to(".sc-pen", { xPercent: -16, scale: 0.88, rotation: -14, duration: 0.07 }, 0.315)
        .fromTo(
          ".sc-cap",
          { x: 0, y: 0, rotation: 0 },
          { x: 150, y: -16, rotation: 10, transformOrigin: "50% 50%", duration: 0.07, ease: "power3.inOut" },
          0.325,
        )
        .to(".sc-pen", { rotation: -5, duration: 0.05 }, 0.395)
        .to(".sc-cap", { x: 0, y: 0, rotation: 0, duration: 0.045, ease: "power3.inOut" }, 0.445)
        .to(".sc-pen", { xPercent: 0, scale: 1, rotation: -12, duration: 0.045 }, 0.445)
        .to(".sc-pen", { xPercent: 70, rotation: 10, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.5)

        // 03 — colour pencils rise and fan into an arc.
        .fromTo(".sc-pencils", { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.06 }, 0.5)
        .fromTo(
          ".sc-pencil",
          { rotation: (i: number) => (i - mid) * 1, transformOrigin: "50% 135%" },
          { rotation: (i: number) => (i - mid) * 8.5, duration: 0.12 },
          0.56,
        )
        .to(".sc-pencils", { yPercent: 45, autoAlpha: 0, duration: 0.05 }, 0.71)

        // 04 — everything lands on the desk.
        .fromTo(
          ".sc-flat",
          { autoAlpha: 0, y: -50, scale: 0.85, rotation: -10 },
          { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.09, stagger: 0.012, ease: "back.out(1.4)" },
          0.76,
        )
        .set({}, {}, 1);
    },
    { dependencies: [reduce], scope: wrap, revertOnUpdate: true },
  );

  if (reduce) return <StaticShowcase />;

  const jump = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const target = top + span * (BOUNDS[i] + 0.06);
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const c = CHAPTERS[chapter];

  return (
    <section ref={wrap} id="showcase" aria-labelledby="showcase-title" className="relative h-[460vh] bg-paper-2/60">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* backdrop: ruled paper + spine line */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 47px, rgb(43 49 148 / .07) 47px 48px)" }}
        />
        <div aria-hidden className="absolute top-0 bottom-0 left-[8%] w-px bg-marker/30" />

        <ShowcaseArt />

        {/* chapter copy */}
        <div className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-24 lg:justify-center lg:pb-0">
          <h2 id="showcase-title" className="eyebrow pointer-events-auto absolute top-24 flex items-center gap-3 text-indigo lg:top-28">
            <span className="h-px w-10 bg-indigo" /> Product showcase
          </h2>
          <div className="pointer-events-auto max-w-[28rem] rounded-3xl bg-paper/80 p-5 backdrop-blur-md lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="eyebrow text-ink-mute">
                  <span className="text-marker">0{chapter + 1}</span> / 04 — {c.kicker}
                </p>
                <h3 className="mt-4 text-h2 font-semibold text-balance">{c.title}</h3>
                <p className="mt-4 text-ink-soft lg:text-lead">{c.body}</p>
                <Link
                  href={c.link.href}
                  className="group mt-6 inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-medium transition-colors hover:border-ink"
                >
                  {c.link.label}
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* chapter nav + progress */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-x flex items-center gap-4 pb-6">
            <div className="flex gap-1.5">
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.kicker}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Go to chapter ${i + 1}: ${ch.kicker}`}
                  aria-current={chapter === i ? "step" : undefined}
                  className={cn(
                    "h-11 rounded-full px-3 text-xs font-medium transition-colors duration-300",
                    chapter === i ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  0{i + 1}
                  <span className="ml-1.5 hidden md:inline">{ch.kicker}</span>
                </button>
              ))}
            </div>
            <div className="h-px flex-1 bg-line">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
