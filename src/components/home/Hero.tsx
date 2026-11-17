"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { HeroArt } from "@/components/flat/HeroArt";
import { useNearViewport } from "@/hooks/useCan3D";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/data/brands";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { visible } = useNearViewport(section, "0px");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Composition drifts up and tilts away as the hero scrolls out.
      gsap.to(".hero-art-inner", {
        yPercent: -32,
        rotation: -5,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "30% top", end: "bottom top", scrub: true },
      });

      // Pointer parallax: each piece follows the cursor by its depth (mouse/trackpad only).
      const el = section.current;
      if (!el || !window.matchMedia("(pointer: fine)").matches) return;
      const layers = gsap.utils.toArray<HTMLElement>(".hp-par", el).map((node) => ({
        depth: Number(node.dataset.depth) || 0,
        x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3" }),
        y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3" }),
        r: gsap.quickTo(node, "rotation", { duration: 1.4, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        for (const l of layers) {
          l.x(-px * l.depth * 46);
          l.y(-py * l.depth * 32);
          l.r(px * l.depth * 5);
        }
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 lg:pt-28"
    >
      {/* soft paper backdrop + oversized brand glyph */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70rem_40rem_at_75%_40%,#fbfaf7_0%,transparent_60%)]" />
      <div className="absolute inset-0 -z-0">
        <HeroArt paused={!visible} />
      </div>

      <div className="hero-copy container-x pointer-events-none relative z-10 mt-auto grid flex-1 items-end pb-10 lg:items-center lg:pb-0">
        <div className="pointer-events-auto max-w-[44rem] pt-[46svh] lg:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.9 }}
            className="eyebrow mb-6 flex items-center gap-3 text-indigo"
          >
            <span className="h-px w-10 bg-indigo" /> School &amp; office stationery · Saudi Arabia
          </motion.p>
          <SplitReveal
            as="h1"
            trigger="mount"
            delay={0.75}
            stagger={0.1}
            className="text-display font-semibold text-balance"
          >
            <span id="hero-title">
              Where <span className="serif-accent font-normal text-indigo">Creativity</span> Meets Everyday Essentials.
            </span>
          </SplitReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.35 }}
            className="mt-7 max-w-lg text-lead text-ink-soft"
          >
            Explore a world of thoughtfully selected stationery and office essentials designed to inspire creativity and productivity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.5 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button href="/gallery/">Explore Our Collection</Button>
            <Button href="#showcase" variant="outline">
              Discover Our Products
            </Button>
          </motion.div>
        </div>
      </div>

      {/* bottom rail: genuine brand names + scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="relative z-10 mt-10 border-t border-line"
      >
        <div className="container-x flex items-center gap-6 py-4">
          <a href="#intro" className="group hidden shrink-0 items-center gap-3 text-sm text-ink-soft sm:flex" aria-label="Scroll to content">
            <span className="relative grid h-9 w-6 place-items-start justify-center rounded-full border border-ink/30 pt-1.5">
              <span className="block h-2 w-0.5 animate-bounce rounded-full bg-ink" />
            </span>
            Scroll
          </a>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={i} aria-hidden={i >= BRANDS.length} className="eyebrow whitespace-nowrap text-ink-mute">
                  {b.name} <span className="ml-10 text-marker">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
