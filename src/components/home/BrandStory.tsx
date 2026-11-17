"use client";

import { useRef, type ReactNode } from "react";
import { COPY, LIFESTYLE, SITE } from "@/data/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";

const YEARS = new Date().getFullYear() - SITE.founded;

/** Only figures already stated on the current site (founding year, HQ + branch cities). */
const FACTS = [
  {
    value: SITE.founded,
    from: 1990,
    suffix: "",
    label: "Established in Riyadh",
  },
  {
    value: YEARS,
    from: 0,
    suffix: "+",
    label: "Years serving the Saudi market",
  },
  {
    value: 1 + SITE.branches.length,
    from: 0,
    suffix: "",
    label: "Cities across the Kingdom",
  },
];

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
);

const PILLARS = [
  {
    k: "Vision",
    v: COPY.vision,
    icon: icon(
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>,
    ),
  },
  {
    k: "Mission",
    v: COPY.mission,
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>,
    ),
  },
  {
    k: "Strength",
    v: COPY.strength,
    icon: icon(
      <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Zm-3.5 9 2.5 2.5 4.5-5" />,
    ),
  },
];

/** Brand introduction on full indigo: story + key facts, layered parallax photography, and vision/mission/strength cards. */
export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const st = { trigger: ref.current, start: "top 65%", once: true };

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        const d = Number(el.dataset.depth);
        gsap.fromTo(
          el,
          { yPercent: 12 * d },
          {
            yPercent: -12 * d,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      gsap.fromTo(
        ".story-mask",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.6,
          ease: "expo.inOut",
          stagger: 0.15,
          scrollTrigger: st,
        },
      );
      gsap.from(".story-badge", {
        scale: 0,
        rotate: -90,
        duration: 1.4,
        delay: 0.9,
        ease: "back.out(1.6)",
        scrollTrigger: st,
      });
      gsap.from(".story-fade", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        delay: 0.3,
        scrollTrigger: st,
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const obj = { n: Number(el.dataset.from) };
        gsap.to(obj, {
          n: to,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      });

      // Entrance runs on the outer wrappers; the inner cards own the CSS hover transitions,
      // so the two never fight over transform/opacity.
      gsap.from(".pillar-in", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        scrollTrigger: { trigger: grid.current, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  const cities = [
    { name: SITE.headOffice.split(",")[0], hq: true },
    ...SITE.branches.map((name) => ({ name, hq: false })),
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="story-title"
      className="grain relative overflow-hidden bg-indigo py-24 text-paper lg:py-36"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[40rem] rounded-full bg-indigo-bright/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-60 -left-40 size-[36rem] rounded-full bg-indigo-deep/70 blur-3xl"
      />
      {/* faint oversized year as a backdrop */}
      <p
        aria-hidden
        className="pointer-events-none absolute top-10 -left-6 font-semibold leading-none tracking-[-0.06em] text-paper/[0.04] select-none text-[clamp(8rem,26vw,24rem)]"
      >
        {SITE.founded}
      </p>

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow story-fade inline-flex items-center gap-3 text-sun">
            <span className="h-px w-8 bg-sun" />
            About BnB Group
          </p>
          <SplitReveal as="h2" className="mt-6 text-h1 font-semibold">
            <span id="story-title">
              More than stationery.{" "}
              <span className="serif-accent font-normal text-sun">
                A part of every idea.
              </span>
            </span>
          </SplitReveal>
          <p className="story-fade mt-8 max-w-xl text-lead text-paper/80">
            {COPY.aboutIntro.split(". ").slice(0, 2).join(". ")}.
          </p>

          {/* where we are */}
          <ul
            className="story-fade mt-8 flex flex-wrap gap-2"
            aria-label="Our locations"
          >
            {cities.map((c) => (
              <li
                key={c.name}
                className={
                  c.hq
                    ? "inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-sm font-medium text-ink"
                    : "inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-4 py-2 text-sm text-paper/85 backdrop-blur-sm transition-colors duration-300 hover:border-sun/60 hover:text-paper"
                }
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 1a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                </svg>
                {c.name}
                {c.hq && (
                  <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase opacity-70">
                    HQ
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="story-fade mt-10">
            <Button href="/aboutus/" variant="light">
              Our story
            </Button>
          </div>

          {/* key facts */}
          <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-paper/15 pt-8 sm:gap-8">
            {FACTS.map((f) => (
              <div key={f.label} className="story-fade flex flex-col-reverse">
                <dt className="mt-3 text-xs leading-snug text-paper/60 sm:text-sm">
                  {f.label}
                </dt>
                <dd className="text-[clamp(2rem,4.5vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                  <span data-count={f.value} data-from={f.from}>
                    {f.value}
                  </span>
                  <span className="text-sun">{f.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* layered photography */}
        <div className="relative min-h-[30rem] sm:min-h-[38rem] lg:col-span-6 lg:min-h-[44rem]">
          <figure
            data-depth="0.6"
            className="story-mask group absolute top-0 right-0 w-[72%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-paper/10"
          >
            <img
              src={LIFESTYLE.artDesk}
              alt="Art supplies and paints laid out on a desk"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
            />
          </figure>
          <figure
            data-depth="1.4"
            className="story-mask group absolute bottom-10 left-0 w-[52%] overflow-hidden rounded-[1.5rem] shadow-2xl ring-1 ring-paper/10"
          >
            <img
              src={LIFESTYLE.celloPens}
              alt="Pens arranged on a red notebook"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
            />
          </figure>
          <figure
            data-depth="2.2"
            className="story-mask group absolute right-[8%] bottom-0 w-[38%] overflow-hidden rounded-[1.25rem] shadow-2xl ring-4 ring-indigo"
          >
            <img
              src={LIFESTYLE.oilPastels}
              alt="Oil pastels in bright colours"
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
            />
          </figure>

          {/* rotating "since" badge */}
          <div
            data-depth="1"
            className="absolute top-[38%] left-[6%] z-10 sm:top-[34%]"
          >
            <div className="story-badge relative grid size-28 place-items-center rounded-full bg-sun text-ink shadow-xl sm:size-36">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]"
                aria-hidden
              >
                <defs>
                  <path
                    id="badge-circle"
                    d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"
                  />
                </defs>
                <text className="fill-current text-[9.5px] font-semibold tracking-[0.2em] uppercase">
                  <textPath href="#badge-circle">
                    Stationery • Packaging • Since {SITE.founded} •
                  </textPath>
                </text>
              </svg>
              <span className="serif-accent text-2xl sm:text-3xl">
                {SITE.founded}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* vision / mission / strength */}
      <div className="container-x relative mt-20 lg:mt-28">
        <div ref={grid} className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {PILLARS.map((p, i) => (
            <div key={p.k} className="pillar-in flex">
              <div className="pillar-card group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-paper/10 bg-paper/[0.04] p-7 backdrop-blur-sm transition-[translate,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-sun/40 hover:bg-paper/[0.08] lg:p-9">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-sun/15 text-sun transition-colors duration-500 group-hover:bg-sun group-hover:text-ink">
                    {p.icon}
                  </span>
                  <span className="text-sm font-medium text-paper/35 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 text-h3 font-semibold">
                  Our{" "}
                  <span className="serif-accent font-normal text-sun">
                    {p.k.toLowerCase()}
                  </span>
                </h3>
                <p className="mt-4 leading-relaxed text-paper/75">{p.v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
