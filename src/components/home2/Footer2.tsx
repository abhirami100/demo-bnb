"use client";

import Link from "next/link";
import { useRef } from "react";
import { COPY, NAV, SITE } from "@/data/site";
import { COLLECTIONS } from "@/data/collections";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useFitText } from "@/hooks/useFitText";
import { PALETTE_HEX } from "./ui";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-serif text-lg italic text-ink-mute">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}

const link = "text-ink/80 transition-colors hover:text-indigo";

export function Footer2() {
  const ref = useRef<HTMLElement>(null);
  const word = useRef<HTMLDivElement>(null);
  useFitText(word);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".f2-word > span", {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".f2-word", start: "top 95%", once: true },
      });
    },
    { scope: ref },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative overflow-hidden bg-sky pt-10 pb-4 lg:pt-16 lg:pb-6">

      <div className="container-x relative">
        <div className="relative rounded-[1.6rem] bg-card px-6 pt-12 pb-6 shadow-2xl lg:px-12 lg:pt-16">
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "right-4 bottom-4"].map((p) => (
            <span key={p} aria-hidden className={cn("absolute size-1.5 bg-ink", p)} />
          ))}

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Link href="/home-2/" className="inline-flex items-center gap-3" aria-label="BnB Group home">
                <img src="/brand-assets/logo-80.png" alt="" width={40} height={40} className="size-10" />
                <span className="text-lg font-semibold tracking-[-0.03em]">BnB Group</span>
              </Link>
              <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{COPY.footerIntro}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-indigo"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="rounded-full border border-ink/20 px-5 py-2.5 text-sm transition-colors hover:border-ink"
                >
                  {SITE.email}
                </a>
              </div>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
              <Col title="Explore">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={link}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </Col>
              <Col title="Collections">
                {COLLECTIONS.map((c, i) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: PALETTE_HEX[i % PALETTE_HEX.length] }} />
                    <Link href={`/gallery/?c=${c.id}`} className={link}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </Col>
              <div className="col-span-2 sm:col-span-1">
                <Col title="Need help">
                  <li>
                    <a href={SITE.tollFree.href} className={link}>
                      {SITE.tollFree.label} <span className="text-ink-mute">(toll free)</span>
                    </a>
                  </li>
                  <li>
                    <a href={SITE.phone.href} className={link}>
                      {SITE.phone.label}
                    </a>
                  </li>
                  {SITE.hours.map((h) => (
                    <li key={h} className="text-ink-mute">
                      {h}
                    </li>
                  ))}
                  <li className="pt-1 text-ink-mute">
                    Head Office: {SITE.headOffice}
                    <br />
                    Branches: {SITE.branches.join(" · ")}
                  </li>
                </Col>
              </div>
            </nav>
          </div>

          {/* wordmark */}
          <div className="mt-16 flex flex-col items-center lg:mt-20">
            <div
              ref={word}
              aria-hidden
              // same sky blue as the footer behind the card, so the letters read as cut out of it
              // bleeds through the card's side padding so the word spans the card edge to edge
              className="f2-word -mx-6 flex min-w-0 self-stretch justify-center overflow-hidden whitespace-nowrap text-[clamp(3.5rem,12vw,11.5rem)] leading-[0.9] font-semibold tracking-[-0.06em] text-sky select-none lg:-mx-12"
            >
              {"BnB Group".split("").map((ch, i) => (
                // equal padding both sides keeps the fitted word optically centred
                <span key={i} className={ch === " " ? "w-[0.22em]" : "-mx-[0.03em] px-[0.03em] pt-[0.04em] pb-[0.16em]"}>
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-line pt-5 text-sm text-ink-mute sm:flex-row">
            <p>
              © {year} BnB Group · {SITE.legalName}
            </p>
            <p className="flex gap-5">
              <Link href="/privacy-policy/" className="hover:text-ink">
                Privacy Policy
              </Link>
              <Link href="/contact-us/" className="hover:text-ink">
                Contact
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
