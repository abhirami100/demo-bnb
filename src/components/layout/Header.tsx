"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Header2 } from "@/components/home2/Header2";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" || /^\/home-\d/.test(pathname) : pathname.startsWith(href.replace(/\/$/, ""));

function RollText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

/** Picks the header that matches the page design: home-2 has its own; the design index has none. */
export function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return pathname?.startsWith("/home-2") ? <Header2 /> : <ClassicHeader />;
}

function ClassicHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  // Expose header visibility so sticky sub-bars (gallery filters) can slide up with it.
  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", hidden ? "0px" : "");
  }, [hidden]);

  // Close the menu on navigation; lock scrolling while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            scrolled && !open ? "bg-paper/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
            <Logo tone={open ? "paper" : "ink"} />
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1 rounded-full border border-line bg-card/60 p-1 backdrop-blur">
                {NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href} className="relative">
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                          active ? "text-paper" : "text-ink/75 hover:text-ink",
                        )}
                      >
                        <RollText>{item.label}</RollText>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href={SITE.tollFree.href}
                className="group hidden items-center gap-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink xl:inline-flex"
              >
                <span className="eyebrow rounded-full bg-indigo px-2 py-1 text-[0.6rem] text-paper">Toll free</span>
                {SITE.tollFree.label}
              </a>
              <Link
                href="/contact-us/"
                className="hidden rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink md:inline-block"
              >
                Enquire
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-[60] grid size-12 place-items-center rounded-full bg-ink text-paper lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo",
                      open ? "top-1/2 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo",
                      open ? "top-1/2 -rotate-45" : "top-full",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[45] flex flex-col bg-indigo-deep text-paper lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.25rem)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-20">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4rem)] leading-[1.05] font-medium tracking-[-0.04em]",
                          isActive(pathname, item.href) ? "text-sun" : "text-paper",
                        )}
                      >
                        <span className="text-xs tabular-nums opacity-50">0{i + 1}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="container-x grid grid-cols-2 gap-4 border-t border-paper/15 py-6 text-sm"
            >
              <a href={SITE.tollFree.href} className="min-h-11">
                <span className="eyebrow block text-[0.6rem] opacity-60">Toll free</span>
                {SITE.tollFree.label}
              </a>
              <a href={`mailto:${SITE.email}`} className="min-h-11">
                <span className="eyebrow block text-[0.6rem] opacity-60">Email</span>
                {SITE.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
