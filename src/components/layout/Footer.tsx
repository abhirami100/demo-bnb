"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Footer2 } from "@/components/home2/Footer2";
import { Logo } from "@/components/ui/Logo";
import { useLenis } from "@/components/providers/SmoothScroll";
import { COPY, NAV, SITE } from "@/data/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useFitText } from "@/hooks/useFitText";

/** Picks the footer that matches the page design: home-2 has its own. */
export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null; // design index page has no footer
  return pathname?.startsWith("/home-2") ? <Footer2 /> : <ClassicFooter />;
}

const ACTIONS = [
  {
    label: "WhatsApp",
    value: "Chat with our team",
    href: SITE.whatsapp,
    external: true,
    icon: <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3l-4.5 1.5Zm5-12c0 4 3 7 7 7l1.5-1.5-2.5-1.5-1 1c-1.2-.4-2.6-1.8-3-3l1-1L10 7 8.5 8.5Z" />,
  },
  {
    label: "Call us",
    value: SITE.phone.label,
    href: SITE.phone.href,
    external: false,
    icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  },
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    external: false,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
];

/** Modern footer: contact action tiles, compact link columns, oversized wordmark and a cursor-following glow. */
function ClassicFooter() {
  const ref = useRef<HTMLElement>(null);
  const word = useRef<HTMLDivElement>(null);
  useFitText(word);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".footer-in", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.from(word.current!.children, {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: word.current, start: "top 95%", once: true },
      });
    },
    { scope: ref },
  );

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const cities = [SITE.headOffice.split(",")[0], ...SITE.branches];

  return (
    <footer
      ref={ref}
      onPointerMove={onMove}
      className="grain relative overflow-hidden bg-indigo-deep text-paper [--mx:70%] [--my:20%]"
    >
      {/* soft glow that follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(36rem circle at var(--mx) var(--my), rgb(61 68 201 / .35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-bright/30 blur-3xl"
      />

      <div className="container-x relative pt-16 pb-8 lg:pt-24">
        {/* contact actions */}
        <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
          {ACTIONS.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel={a.external ? "noreferrer" : undefined}
              className="footer-in group flex items-center gap-4 rounded-2xl border border-paper/10 bg-paper/[0.04] p-5 backdrop-blur-sm transition-[border-color,background-color,translate] duration-500 ease-out-expo hover:-translate-y-1 hover:border-sun/40 hover:bg-paper/[0.08] lg:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sun/15 text-sun transition-colors duration-500 group-hover:bg-sun group-hover:text-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {a.icon}
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-paper/50">{a.label}</span>
                <span className="mt-1 block truncate font-medium">{a.value}</span>
              </span>
              <svg
                viewBox="0 0 16 16"
                className="size-4 shrink-0 text-paper/40 transition-all duration-500 ease-out-expo group-hover:rotate-[-45deg] group-hover:text-sun"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M2 8h12M9 3l5 5-5 5" />
              </svg>
            </a>
          ))}
        </div>

        <div className="mt-16 grid gap-12 border-t border-paper/10 pt-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="footer-in lg:col-span-5">
            <Logo tone="paper" className="[&>span]:block" />
            <p className="mt-6 max-w-md leading-relaxed text-paper/65">{COPY.footerIntro}</p>
          </div>

          <nav aria-label="Footer" className="footer-in lg:col-span-3">
            <p className="eyebrow text-paper/45">Explore</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="group inline-flex items-center text-paper/80 transition-colors hover:text-paper">
                    <span className="h-px w-0 bg-sun transition-all duration-500 ease-out-expo group-hover:mr-2 group-hover:w-4" />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-in md:col-span-2 lg:col-span-4">
            <p className="eyebrow text-paper/45">Visit us</p>
            <ul className="mt-5 space-y-2 text-paper/80">
              {SITE.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
              <li>
                <a href={SITE.tollFree.href} className="transition-colors hover:text-sun">
                  {SITE.tollFree.label} <span className="text-paper/45">· toll free</span>
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Our locations">
              {cities.map((c, i) => (
                <li
                  key={c}
                  className={
                    i === 0
                      ? "rounded-full bg-sun px-3.5 py-1.5 text-xs font-medium text-ink"
                      : "rounded-full border border-paper/15 px-3.5 py-1.5 text-xs text-paper/75"
                  }
                >
                  {c}
                  {i === 0 && <span className="ml-1.5 opacity-60">HQ</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={word}
          aria-hidden
          className="mt-16 flex justify-center overflow-hidden whitespace-nowrap text-[clamp(3.5rem,17vw,19rem)] leading-[0.9] font-semibold tracking-[-0.06em] select-none"
        >
          {"BnB Group".split("").map((ch, i) => (
            <span
              key={i}
              className={
                ch === " "
                  ? "w-[0.25em]"
                  : "bg-gradient-to-b from-paper to-paper/30 bg-clip-text pt-[0.04em] pr-[0.06em] -mr-[0.06em] pb-[0.16em] text-transparent"
              }
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 text-sm text-paper/50 sm:flex-row sm:items-center">
          <p>
            © {year} BnB Group · {SITE.legalName}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy/" className="transition-colors hover:text-paper">
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={toTop}
              className="group inline-flex items-center gap-2 rounded-full border border-paper/15 py-1.5 pr-1.5 pl-4 text-paper/75 transition-colors hover:border-sun/50 hover:text-paper"
            >
              Back to top
              <span className="grid size-7 place-items-center rounded-full bg-paper/10 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M8 14V2M3 7l5-5 5 5" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
