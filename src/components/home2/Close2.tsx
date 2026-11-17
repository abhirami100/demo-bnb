"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/data/brands";
import { COPY, SITE } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Kicker, PALETTE, PALETTE_HEX } from "./ui";

/* ───────── Branches: cards ride an arc as you scroll ───────── */
const CITIES = [
  { city: SITE.headOffice.split(",")[0], tag: "Head office", notes: [...SITE.hours] },
  ...SITE.branches.map((b) => ({ city: b, tag: "Branch", notes: [`${b} branch`, "Orders & queries via our toll-free line"] })),
];
const STEP = 34; // degrees between cards on the wheel

export function Branches2() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(wheel.current, {
        rotation: -STEP * (CITIES.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          snap: { snapTo: 1 / (CITIES.length - 1), duration: 0.5, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * (CITIES.length - 1))),
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="h2-cities" className="relative h-[320vh] border-t border-line">
      <div className="graph-paper sticky top-0 h-[100svh] overflow-hidden" style={{ ["--R" as string]: "clamp(380px, 56vw, 860px)" }}>
        <div className="container-x pt-24 text-center lg:pt-28">
          <Kicker>Where to find us</Kicker>
          <h2 id="h2-cities" className="mx-auto mt-2 max-w-3xl text-[clamp(2rem,4vw,3.8rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance">
            Four cities. One team across the Kingdom.
          </h2>
        </div>

        <div
          ref={wheel}
          className="absolute left-1/2 size-0"
          style={{ top: "calc(min(64svh, 30rem) + var(--R))" }}
        >
          {/* tick ring */}
          <svg
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2 overflow-visible"
            style={{ width: "calc(var(--R) * 2.24)", height: "calc(var(--R) * 2.24)" }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="49" fill="none" stroke="#121318" strokeOpacity=".35" strokeWidth="1.2" strokeDasharray=".12 .5" />
          </svg>
          {CITIES.map((c, i) => (
            <article
              key={c.city}
              className="absolute w-[13.5rem] lg:w-[17rem]"
              style={{ transform: `translate(-50%, -50%) rotate(${i * STEP}deg) translateY(calc(var(--R) * -1))` }}
            >
              <div className={cn("relative overflow-hidden rounded-t-2xl px-4 pt-3", PALETTE[(i + 1) % PALETTE.length])}>
                <span className="block text-[5.5rem] leading-[0.8] font-semibold tracking-[-0.06em] text-card lg:text-[7rem]">
                  0{i + 1}
                </span>
                <span className="absolute top-3 right-4 font-serif text-lg italic text-card">{c.tag}</span>
              </div>
              <div className="rounded-b-2xl bg-card p-4 shadow-[0_30px_50px_-30px_rgb(18_21_77/.5)]">
                <p className="text-lg font-semibold tracking-[-0.02em]">{c.city}</p>
                <ul className="mt-2 space-y-1.5 text-xs text-ink-soft">
                  {c.notes.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 bg-ink" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2" aria-hidden>
          {CITIES.map((c, i) => (
            <span key={c.city} className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-ink" : "w-1.5 bg-ink/25")} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Ready + since-2006 dial ───────── */
export function Ready2() {
  const root = useRef<HTMLElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const o = { v: 1990 };
      gsap.to(o, {
        v: SITE.founded,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          if (year.current) year.current.textContent = String(Math.round(o.v));
        },
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".rd-bit", {
        scale: 0,
        rotation: () => gsap.utils.random(-90, 90),
        stagger: { each: 0.015, from: "random" },
        duration: 0.7,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  // confetti blocks inside the dial (deterministic positions)
  const bits = Array.from({ length: 46 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 8 + Math.sqrt(i) * 5.4;
    return { x: +(50 + Math.cos(a) * r).toFixed(2), y: +(50 + Math.sin(a) * r).toFixed(2), c: PALETTE_HEX[i % 5], round: i % 3 === 0, rot: (i * 47) % 90 };
  });

  return (
    <section ref={root} aria-labelledby="h2-ready" className="graph-paper border-t border-line py-20 lg:py-28">
      <div className="container-x grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-12 rounded-[2rem] bg-card p-8 lg:p-12">
          <h2 id="h2-ready" className="text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            Ready to stock up
            <br />
            for the new term?
          </h2>
          <div>
            <p className="max-w-sm text-ink-soft">{COPY.contactCta}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/contact-us/">Contact us</Button>
              <Button href={SITE.whatsapp} variant="outline">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-sky p-8 lg:p-12">
          <div className="flex items-start gap-4">
            <span ref={year} className="text-[clamp(4.5rem,10vw,9rem)] leading-[0.8] font-semibold tracking-[-0.06em]">
              {SITE.founded}
            </span>
            <span className="pt-2">
              <span className="block text-xl font-semibold tracking-[-0.02em] lg:text-2xl">serving the Kingdom</span>
              <span className="font-serif text-lg italic text-ink-soft">since the very first order</span>
            </span>
          </div>
          <div className="relative mx-auto -mb-40 mt-8 aspect-square w-[min(100%,24rem)] rounded-full bg-card shadow-inner lg:-mb-48">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
              {Array.from({ length: 60 }, (_, i) => (
                <line key={i} x1="50" y1="2" x2="50" y2={i % 5 === 0 ? 7 : 4.5} stroke="#121318" strokeWidth={i % 5 === 0 ? 0.8 : 0.4} transform={`rotate(${i * 6} 50 50)`} />
              ))}
            </svg>
            {bits.map((b, i) => (
              <span
                key={i}
                aria-hidden
                className="rd-bit absolute size-[7%]"
                style={{ left: `${b.x}%`, top: `${b.y}%`, background: b.c, borderRadius: b.round ? "50%" : "2px", transform: `translate(-50%, -50%) rotate(${b.rot}deg)` }}
              />
            ))}
            <span aria-hidden className="absolute top-1/2 left-1/2 h-[3px] w-[36%] origin-left -translate-y-1/2 rotate-[-30deg] rounded bg-ink" />
            <span aria-hidden className="absolute top-1/2 left-1/2 h-[3px] w-[26%] origin-left -translate-y-1/2 rotate-[95deg] rounded bg-ink" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ (answers drawn from the current site) ───────── */
const FAQ = [
  {
    q: "Where are you located?",
    a: `Our head office is in Riyadh, KSA, with branches in ${SITE.branches.slice(0, -1).join(", ")} and ${SITE.branches.at(-1)}.`,
  },
  { q: "Which brands do you distribute?", a: `${BRANDS.map((b) => b.name).join(", ")}. We are the sole distributor of Cello pen in KSA.` },
  {
    q: "Do you supply packaging as well as stationery?",
    a: "Yes. We offer a comprehensive range of stationery supplies and packaging products, providing an all-encompassing solution for your needs.",
  },
  { q: "Do you serve clients outside Saudi Arabia?", a: "Serving both national and international clients, our reach extends beyond borders." },
  { q: "What are your working hours?", a: SITE.hours.join(" · ") },
  {
    q: "How do I place an order?",
    a: `Call our toll-free line ${SITE.tollFree.label}, phone ${SITE.phone.label}, email ${SITE.email}, or message us on WhatsApp.`,
  },
];

export function Faq2() {
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  // The question nearest the middle of the viewport is the "current" one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = cards.current[i];
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -window.innerHeight * 0.3 });
    else el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section aria-labelledby="h2-faq" className="graph-paper border-t border-line py-24 lg:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* sticky side: heading + question index */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Kicker>FAQ</Kicker>
          <h2 id="h2-faq" className="mt-2 text-[clamp(2.2rem,4vw,3.8rem)] leading-[1] font-semibold tracking-[-0.04em]">
            Good questions,
            <br />
            straight answers.
          </h2>

          <ol className="mt-10 hidden border-t border-line lg:block">
            {FAQ.map((f, i) => (
              <li key={f.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    "flex w-full items-center gap-4 py-3 text-left text-[0.95rem] transition-colors duration-300",
                    active === i ? "text-ink" : "text-ink-mute hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3 shrink-0 transition-[transform,border-radius] duration-500 ease-out-expo"
                    style={{
                      background: active === i ? PALETTE_HEX[i % PALETTE_HEX.length] : "var(--color-line)",
                      borderRadius: active === i ? "999px" : "2px",
                      transform: active === i ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                  <span className="text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("truncate", active === i && "font-medium")}>{f.q}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-8 hidden items-center gap-3 lg:flex">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out-expo"
                style={{ width: `${((active + 1) / FAQ.length) * 100}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-ink-mute">
              {active + 1}/{FAQ.length}
            </span>
          </div>
        </div>

        {/* scrolling side: every answer as a card */}
        <ol className="space-y-4 lg:col-span-7 lg:space-y-6 lg:py-[12vh]">
          {FAQ.map((f, i) => {
            const on = active === i;
            const color = PALETTE_HEX[i % PALETTE_HEX.length];
            return (
              <li
                key={f.q}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                data-i={i}
                className={cn(
                  "relative rounded-[1.4rem] border bg-card p-6 transition-[border-color,box-shadow,opacity,transform] duration-500 ease-out-expo sm:p-8 lg:p-10",
                  on
                    ? "border-ink/20 shadow-[0_24px_50px_-30px_rgb(18_19_24/.45)] lg:-translate-y-1"
                    : "border-line lg:opacity-60",
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-serif text-lg italic text-ink-mute">Q{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden
                    className="size-10 shrink-0 transition-[border-radius,transform] duration-700 ease-out-expo"
                    style={{
                      background: color,
                      borderRadius: on ? "999px" : ["0.5rem", "999px 999px 0.5rem 0.5rem", "0.5rem 999px 0.5rem 999px"][i % 3],
                      transform: on ? "rotate(0deg)" : "rotate(-12deg)",
                    }}
                  />
                </div>
                <h3 className="mt-4 text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.1] font-semibold tracking-[-0.03em]">{f.q}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{f.a}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
