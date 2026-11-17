"use client";

import { useRef } from "react";
import { COPY, LIFESTYLE, SITE } from "@/data/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** "Your Trusted Stationery & Packaging Partner" — words ink in as you scroll; photo unmasks. */
export function Intro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: ".intro-body", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.fromTo(
        ".intro-photo",
        { clipPath: "inset(18% 22% 18% 22% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 2rem)",
          ease: "none",
          scrollTrigger: { trigger: ".intro-photo", start: "top 90%", end: "center 55%", scrub: true },
        },
      );
      gsap.fromTo(".intro-photo img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".intro-photo", start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: ref },
  );

  const words = COPY.partnerBody.split(" ");
  const facts = [
    { k: "Established", v: String(SITE.founded) },
    { k: "Head office", v: "Riyadh" },
    { k: "Branches", v: SITE.branches.join(" · ") },
  ];

  return (
    <section id="intro" ref={ref} aria-labelledby="intro-title" className="container-x py-24 lg:py-40">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-indigo">{COPY.homeTagline}</p>
          <SplitReveal as="h2" className="mt-6 text-h1 font-semibold text-balance">
            <span id="intro-title">
              Your trusted <span className="serif-accent font-normal text-indigo">stationery</span> &amp; packaging partner
            </span>
          </SplitReveal>
          <p className="intro-body mt-10 max-w-2xl text-[clamp(1.15rem,1.8vw,1.6rem)] leading-[1.45] tracking-[-0.01em]">
            {words.map((w, i) => (
              <span key={i} className="intro-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.k} className={f.k === "Branches" ? "col-span-2 sm:col-span-1" : ""}>
                <dt className="eyebrow text-ink-mute">{f.k}</dt>
                <dd className="mt-2 text-xl font-medium tracking-[-0.02em]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5 lg:pt-24">
          <figure className="intro-photo relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper-2">
            <img src={LIFESTYLE.store} alt="Shelves stocked with stationery products" loading="lazy" className="size-full object-contain p-6" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 text-xs font-medium backdrop-blur">
              Stationery &amp; packaging, since 2006
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
