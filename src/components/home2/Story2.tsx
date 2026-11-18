"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/data/brands";
import { COPY, LIFESTYLE } from "@/data/site";
import { Frame, Kicker, PALETTE_HEX } from "./ui";

/* ───────── Who we are: words fill in as you scroll ───────── */
const STATEMENT =
  "BnB Group is a leading distributor of school and office stationery in Saudi Arabia, headquartered in Riyadh since 2006 with branches in Dammam, Jeddah and Khamis Mushayth.";

/** Each fact sits in its own palette block; the shapes echo the header's sticker set. */
const FACTS = [
  { big: "2006", small: "founded in Riyadh", c: 4, r: "1.25rem" },
  { big: "4", small: "cities across KSA", c: 0, r: "999px" },
  { big: `${BRANDS.length}`, small: "brands distributed", c: 2, r: "999px 999px 1.25rem 1.25rem" },
  { big: `${new Date().getFullYear() - 2006}+`, small: "years in the trade", c: 3, r: "1.25rem 999px 1.25rem 999px" },
];

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
      // fact cards rise up from below with a fade, one after another, then keep floating forever
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".st-shelf", start: "top 85%", toggleActions: "play none none reverse" },
      });
      tl.from(".st-block", { y: 140, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.15 })
        .from(".st-line", { scaleX: 0, autoAlpha: 0, transformOrigin: "center", duration: 0.9, ease: "power2.out" }, 0.2)
        .from(".st-fact", { autoAlpha: 0, y: 16, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 0.5);

      // endless gentle bob on an inner wrapper; all cards move together so the row stays level and straight
      gsap.to(".st-float", { y: -12, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true });
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
      {/* fact blocks: a scattered pile that stacks itself neatly on a shelf as you scroll */}
      <div className="st-shelf container-x mt-20 lg:mt-28">
        <ul className="st-deck relative grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-4 lg:gap-8">
          {FACTS.map((f) => (
            <li key={f.small} className="st-block">
              <div
                className="st-float flex aspect-square flex-col items-center justify-center p-4 text-center text-ink shadow-[0_24px_40px_-24px_rgb(18_21_77/.45)]"
                style={{ borderRadius: f.r, background: PALETTE_HEX[f.c] }}
              >
                <span className="st-fact block text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em]">{f.big}</span>
                <span className="st-fact mt-2 block font-serif text-sm italic text-ink-soft lg:text-base">{f.small}</span>
              </div>
            </li>
          ))}
        </ul>
        <div aria-hidden className="st-line mt-6 h-px w-full bg-ink/25" />
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
