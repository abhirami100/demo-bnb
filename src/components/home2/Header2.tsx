"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";
import { PALETTE_HEX } from "./ui";

/** Home-2 header: a floating "drawing-board" toolbar with block-palette nav stickers. */

// Each nav item owns a block shape + colour from the home-2 palette.
const ITEMS = NAV.map((n, i) => ({
  ...n,
  href: n.href === "/" ? "/home-2/" : n.href,
  color: PALETTE_HEX[i % PALETTE_HEX.length],
  radius: ["0.5rem", "999px", "999px 999px 0.5rem 0.5rem", "0.5rem 999px 0.5rem 999px", "999px 0.5rem 999px 0.5rem"][i % 5],
}));

const isActive = (pathname: string, href: string) =>
  href === "/home-2/" ? pathname.startsWith("/home-2") : pathname.startsWith(href.replace(/\/$/, ""));

const ease = [0.16, 1, 0.3, 1] as const;

function Corners({ className }: { className?: string }) {
  return (
    <>
      {["-top-[3px] -left-[3px]", "-top-[3px] -right-[3px]", "-bottom-[3px] -left-[3px]", "-right-[3px] -bottom-[3px]"].map((p) => (
        <span key={p} aria-hidden className={cn("absolute size-1.5 bg-ink", p, className)} />
      ))}
    </>
  );
}

export function Header2() {
  const pathname = usePathname() ?? "";
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", hidden ? "0px" : "");
  }, [hidden]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const activeHref = ITEMS.find((i) => isActive(pathname, i.href))?.href ?? null;
  const highlight = hover ?? activeHref;

  return (
    <>
      <motion.header
        initial={{ y: "-120%" }}
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.7, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "mx-auto transition-[max-width,padding] duration-700 ease-out-expo",
            scrolled ? "max-w-6xl px-3 pt-3 sm:px-4" : "max-w-[96rem] px-[clamp(1rem,4vw,3.5rem)] pt-4 lg:pt-5",
          )}
        >
          <div
            className={cn(
              "relative flex h-16 items-center justify-between gap-4 border pr-2 pl-3 transition-[background-color,border-color,box-shadow,border-radius] duration-700 ease-out-expo sm:pl-4",
              scrolled || open
                ? "rounded-2xl border-ink/15 bg-card/85 shadow-[0_18px_40px_-24px_rgb(18_19_24/.45)] backdrop-blur-xl"
                : "rounded-none border-transparent bg-transparent",
            )}
          >
            {(scrolled || open) && <Corners />}

            {/* brand */}
            <Link href="/home-2/" aria-label="BnB Group — home" className="group relative z-[60] flex items-center gap-2.5">
              <span className="grid size-10 place-items-center">
                <img src="/brand-assets/logo-80.png" alt="" width={40} height={40} className="size-8 object-contain" />
              </span>
              <span className="leading-none">
                <span className="block text-[1.05rem] font-semibold tracking-[-0.03em]">BnB Group</span>
                <span className="hidden font-serif text-[0.8rem] italic text-ink-mute sm:block">stationery &amp; packaging</span>
              </span>
            </Link>

            {/* nav stickers */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1" onPointerLeave={() => setHover(null)}>
                {ITEMS.map((item) => {
                  const active = item.href === activeHref;
                  const lit = item.href === highlight;
                  return (
                    <li key={item.href} className="relative">
                      {lit && (
                        <motion.span
                          layoutId="nav2-sticker"
                          aria-hidden
                          className="absolute inset-0"
                          initial={false}
                          animate={{ backgroundColor: item.color, borderRadius: item.radius }}
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        onPointerEnter={() => setHover(item.href)}
                        onFocus={() => setHover(item.href)}
                        onBlur={() => setHover(null)}
                        aria-current={active ? "page" : undefined}
                        className="relative z-10 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink"
                      >
                        {active && <span aria-hidden className="size-1.5 rounded-full bg-ink" />}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* actions */}
            <div className="relative z-[60] flex items-center gap-2">
              <a
                href={SITE.tollFree.href}
                className="hidden items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-sm font-medium transition-colors hover:border-ink xl:inline-flex"
              >
                <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-lime/30" />
                {SITE.tollFree.label}
              </a>
              <Link
                href="/contact-us/"
                className="group hidden items-center gap-2 rounded-xl bg-ink py-2.5 pr-2.5 pl-4 text-sm font-medium text-paper transition-colors duration-300 hover:bg-indigo md:inline-flex"
              >
                Enquire
                <span className="grid size-6 place-items-center rounded-md bg-lime text-ink transition-[border-radius,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:rounded-full">
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </Link>

              {/* menu toggle: a 2×2 block mosaic that folds into an X */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu-2"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-12 place-items-center rounded-xl border border-ink/15 bg-card lg:hidden"
              >
                <span className={cn("grid grid-cols-2 gap-1 transition-transform duration-500 ease-out-expo", open && "rotate-45")}>
                  {[0, 2, 3, 1].map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-2 transition-[border-radius,transform] duration-500 ease-out-expo",
                        open ? "rounded-full" : ["rounded-[2px]", "rounded-full", "rounded-t-full", "rounded-tl-full"][i],
                      )}
                      style={{ background: open ? "var(--color-ink)" : PALETTE_HEX[c] }}
                    />
                  ))}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu-2"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="graph-paper fixed inset-0 z-[45] flex flex-col lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-24">
              <ul className="space-y-2">
                {ITEMS.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.06 }}
                    >
                      <Link href={item.href} className="group flex items-center gap-4 py-1.5">
                        <motion.span
                          aria-hidden
                          className="size-[clamp(2.2rem,9vw,3rem)] shrink-0"
                          style={{ background: item.color, borderRadius: item.radius }}
                          initial={{ scale: 0, rotate: -60 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 + i * 0.06 }}
                        />
                        <span
                          className={cn(
                            "text-[clamp(2.2rem,10vw,3.6rem)] leading-none font-semibold tracking-[-0.045em]",
                            active && "serif-accent font-normal text-indigo",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.45 } }}
              exit={{ opacity: 0 }}
              className="container-x pb-6"
            >
              <div className="relative grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
                <Corners />
                <a href={SITE.tollFree.href} className="min-h-11">
                  <span className="block font-serif text-base italic text-ink-mute">Toll free</span>
                  {SITE.tollFree.label}
                </a>
                <a href={`mailto:${SITE.email}`} className="min-h-11 break-all">
                  <span className="block font-serif text-base italic text-ink-mute">Email</span>
                  {SITE.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
