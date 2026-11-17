"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/data/brands";
import { COPY, LIFESTYLE } from "@/data/site";
import { Frame, Kicker, PALETTE_HEX } from "./ui";

/* ───────── Who we are: words fill in as you scroll ───────── */
const STATEMENT =
  "BnB Group is a leading distributor of school and office stationery in Saudi Arabia, headquartered in Riyadh since 2006 with branches in Dammam, Jeddah and Khamis Mushayth.";

export function Statement2() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".st-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".st-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.to(".st-shape", {
        y: (i: number) => -60 - i * 35,
        rotation: (i: number) => (i % 2 ? 40 : -40),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-who" className="graph-paper relative overflow-hidden py-24 lg:py-36">
      <div className="container-x grid gap-8 lg:grid-cols-[1fr_2.2fr]">
        <h2 id="h2-who">
          <Kicker>Who we are</Kicker>
        </h2>
        <div>
          <p className="st-text text-[clamp(1.6rem,3vw,2.9rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance">
            {STATEMENT.split(" ").map((w, i) => (
              <span key={i} className="st-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-xl text-lead text-ink-soft lg:ml-auto">{COPY.strength}</p>
        </div>
      </div>
      {/* drifting blocks */}
      <div aria-hidden className="pointer-events-none relative mx-auto mt-16 h-40 max-w-3xl">
        {[
          { l: "18%", t: "30%", s: 64, r: "0", c: 4 },
          { l: "34%", t: "0%", s: 84, r: "50%", c: 2 },
          { l: "48%", t: "40%", s: 110, r: "50%", c: 3, logo: true },
          { l: "64%", t: "8%", s: 70, r: "0 50% 0 50%", c: 1 },
          { l: "78%", t: "45%", s: 56, r: "0", c: 0 },
        ].map((b, i) => (
          <div
            key={i}
            className="st-shape absolute grid place-items-center shadow-[0_20px_40px_-20px_rgb(18_21_77/.4)]"
            style={{ left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: b.r, background: PALETTE_HEX[b.c] }}
          >
            {b.logo && <img src="/brand-assets/logo-80.png" alt="" className="w-1/2" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Product-line cloud on a dark, blurred photo ───────── */
const LINES = [
  "Notebooks",
  "Ball Point Pens",
  "Gel Pens",
  "Colour Pencils",
  "Poster Colours",
  "Oil Pastels",
  "Wax Crayons",
  "Sketch Pens",
  "Highlighters",
  "Whiteboard Markers",
  "Files and Folders",
  "Correction Pens",
  "Glue Sticks",
  "Scissors",
  "Calculators",
  "Packaging Tapes",
];

export function Cloud2() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom bottom", scrub: 0.6 },
      });
      tl.from(".cl-a", { xPercent: -30, autoAlpha: 0, duration: 0.2 }, 0)
        .from(
          ".cl-chip",
          {
            autoAlpha: 0,
            scale: 0.4,
            x: () => gsap.utils.random(-260, 260),
            y: () => gsap.utils.random(-200, 200),
            rotation: () => gsap.utils.random(-40, 40),
            stagger: { each: 0.03, from: "random" },
            duration: 0.25,
            ease: "back.out(1.6)",
          },
          0.1,
        )
        .from(".cl-paren", { scaleY: 0, autoAlpha: 0, duration: 0.15 }, 0.15)
        .from(".cl-b", { xPercent: 30, autoAlpha: 0, duration: 0.2 }, 0.45)
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-cloud" className="relative h-[170vh] bg-[#2b2b2d] text-paper">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <img src={LIFESTYLE.artDesk} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-35 blur-2xl" />
        <Frame dark className="relative w-full py-14 lg:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <h2 id="h2-cloud" className="cl-a text-[clamp(2rem,3.6vw,3.4rem)] leading-[1] font-medium tracking-[-0.035em]">
              Every item
              <br />
              on your list
            </h2>
            <div className="flex items-center gap-2 lg:gap-4">
              <span aria-hidden className="cl-paren text-6xl font-light text-paper/70 lg:text-8xl">
                (
              </span>
              <ul className="flex max-w-[34rem] flex-wrap justify-center gap-2">
                {LINES.map((l) => (
                  <li key={l} className="cl-chip rounded-full bg-paper px-3.5 py-1.5 text-xs font-medium text-ink shadow-lg lg:text-sm">
                    {l}
                  </li>
                ))}
              </ul>
              <span aria-hidden className="cl-paren text-6xl font-light text-paper/70 lg:text-8xl">
                )
              </span>
            </div>
            <p className="cl-b text-right text-[clamp(2rem,3.6vw,3.4rem)] leading-[1] font-medium tracking-[-0.035em]">
              from one
              <br />
              trusted partner
            </p>
          </div>
        </Frame>
      </div>
    </section>
  );
}

/* ───────── Lime tagline band + product range window ───────── */
const WINDOW = [LIFESTYLE.artDesk, LIFESTYLE.celloPens, LIFESTYLE.oilPastels, LIFESTYLE.montexSet, LIFESTYLE.colourSplit, LIFESTYLE.pastelPens];

export function Tagline2() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".tg-title", {
        scale: 0.8,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: true },
      });
      gsap.from(".tg-window", {
        yPercent: 28,
        rotateX: 18,
        transformPerspective: 1400,
        ease: "none",
        scrollTrigger: { trigger: ".tg-window", start: "top bottom", end: "top 35%", scrub: true },
      });
      gsap.from(".tg-plate", {
        y: (i: number) => 80 + i * 40,
        ease: "none",
        scrollTrigger: { trigger: ".tg-window", start: "top bottom", end: "top 35%", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-tag" className="relative overflow-hidden bg-lime pt-28 pb-24 lg:pt-40 lg:pb-32">
      {/* soft pixel squares */}
      <div aria-hidden className="absolute inset-0 grid grid-cols-8 opacity-60 lg:grid-cols-16">
        {Array.from({ length: 64 }, (_, i) => (
          <div key={i} className="aspect-square" style={{ background: `rgb(255 255 255 / ${((i * 37) % 7) * 0.035})` }} />
        ))}
      </div>
      <h2 id="h2-tag" className="tg-title container-x relative text-center text-[clamp(2.4rem,6vw,6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
        Big Ideas Start with
        <br />
        <span className="serif-accent font-normal">Little Supplies.</span>
      </h2>

      <div className="container-x relative mt-16 lg:mt-24">
        <div className="relative mx-auto max-w-6xl">
          <div aria-hidden className="tg-plate absolute -inset-x-4 top-10 -bottom-4 rounded-[2rem] bg-sky lg:-inset-x-10" />
          <div aria-hidden className="tg-plate absolute -inset-x-2 top-24 -bottom-10 rounded-[2rem] bg-coral lg:-inset-x-5" />
          <div className="tg-window relative overflow-hidden rounded-[1.6rem] bg-card p-3 shadow-2xl lg:p-4">
            <div className="flex items-center justify-between px-2 pb-3 lg:px-3">
              <span className="flex gap-1.5">
                <i className="size-2.5 rounded-full bg-coral" />
                <i className="size-2.5 rounded-full bg-apricot" />
                <i className="size-2.5 rounded-full bg-sage" />
              </span>
              <span className="text-xs text-ink-mute">Our product range · {BRANDS.length} brands</span>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
              {WINDOW.map((src) => (
                <img key={src} src={src} alt="" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
