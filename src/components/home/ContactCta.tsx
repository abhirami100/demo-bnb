"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { COPY, SITE } from "@/data/site";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** Office hours from SITE.hours: Saturday – Thursday, 8:30 – 17:30, Riyadh time. Friday off. */
function isOpenInRiyadh(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return get("weekday") !== "Fri" && minutes >= 8 * 60 + 30 && minutes < 17 * 60 + 30;
}

const ICONS: Record<string, ReactNode> = {
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  chat: (
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
};

const CHANNELS = [
  { icon: "phone", label: "Toll free", value: SITE.tollFree.label, href: SITE.tollFree.href },
  { icon: "chat", label: "WhatsApp", value: "Chat with us", href: SITE.whatsapp, external: true },
  { icon: "mail", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

const BADGE_TEXT = "Contact us • Orders & queries • ";

export function ContactCta() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpenInRiyadh());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--cx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--cy", `${e.clientY - r.top}px`);
  };

  return (
    <section aria-labelledby="cta-title" className="container-x pb-24 lg:pb-36">
      <div
        onPointerMove={onMove}
        className="grain relative isolate overflow-hidden rounded-[2rem] bg-ink text-paper [--cx:80%] [--cy:10%] sm:rounded-[2.5rem]"
      >
        {/* dot grid, faded towards the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]"
          style={{
            backgroundImage: "radial-gradient(rgb(243 240 233 / .18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* spotlight that follows the cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(32rem circle at var(--cx) var(--cy), rgb(61 68 201 / .45), transparent 70%)" }}
        />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-96 rounded-full bg-sun/20 blur-3xl" />

        <div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10 lg:px-16 lg:pt-14">
          {/* top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-paper/55">{COPY.contactCtaSub}</p>
            <p className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.04] px-3.5 py-1.5 text-xs text-paper/75 backdrop-blur-sm">
              <span className="relative flex size-2">
                {open && <span className="absolute inset-0 animate-ping rounded-full bg-lime/70" />}
                <span className={`relative size-2 rounded-full ${open === null ? "bg-paper/30" : open ? "bg-lime" : "bg-coral"}`} />
              </span>
              {open === null ? "Riyadh HQ" : open ? "Open now" : "Closed now"}
              <span className="text-paper/40">· Sat–Thu 8:30–5:30</span>
            </p>
          </div>

          {/* headline + badge */}
          <div className="mt-12 grid items-end gap-10 lg:mt-20 lg:grid-cols-12">
            <SplitReveal as="h2" className="text-h1 font-semibold lg:col-span-9">
              <span id="cta-title">
                Quality service is <span className="serif-accent font-normal text-sun">all</span> that matters to us.
              </span>
            </SplitReveal>

            <div className="flex lg:col-span-3 lg:justify-end">
              <Link
                href="/contact-us/"
                aria-label="Contact us"
                className="group relative grid size-36 shrink-0 place-items-center sm:size-44"
              >
                <svg
                  viewBox="0 0 200 200"
                  aria-hidden
                  className="absolute inset-0 size-full animate-[spin_18s_linear_infinite] text-paper/70 motion-reduce:animate-none"
                >
                  <defs>
                    <path id="cta-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text className="fill-current text-[15.5px] font-medium tracking-[0.18em] uppercase">
                    <textPath href="#cta-ring">{BADGE_TEXT.repeat(2)}</textPath>
                  </text>
                </svg>
                <span className="grid size-20 place-items-center rounded-full bg-sun text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110 sm:size-24">
                  <svg
                    viewBox="0 0 16 16"
                    className="size-6 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                  >
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* channels */}
        <ul className="mt-6 grid border-t border-paper/10 sm:grid-cols-3 lg:mt-10">
          {CHANNELS.map((c, i) => (
            <li key={c.label} className={i > 0 ? "border-t border-paper/10 sm:border-t-0 sm:border-l" : ""}>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className="group flex items-center gap-4 px-6 py-5 transition-colors duration-500 hover:bg-paper/[0.05] sm:px-10 lg:px-16 lg:py-7"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-sun"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {ICONS[c.icon]}
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-paper/45">{c.label}</span>
                  <span className="mt-0.5 block truncate font-medium tracking-[-0.01em]">{c.value}</span>
                </span>
                <svg
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0 text-paper/35 transition-all duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-sun"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden
                >
                  <path d="M2 8h12M9 3l5 5-5 5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
