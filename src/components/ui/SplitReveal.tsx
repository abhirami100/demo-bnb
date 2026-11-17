"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: ReactNode;
  className?: string;
  /** "mount" animates immediately (hero), "scroll" waits until the text enters the viewport. */
  trigger?: "mount" | "scroll";
  delay?: number;
  stagger?: number;
  /** Split by lines (masked slide-up) or words. */
  by?: "lines" | "words";
};

/** Masked line/word reveal built on GSAP SplitText. Text stays fully readable without JS. */
export function SplitReveal({ as: Tag = "div", children, className, trigger = "scroll", delay = 0, stagger = 0.09, by = "lines" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | null = null;
      // Wait for webfonts so line breaks are measured with the final font.
      const run = () => {
        split = SplitText.create(el, {
          type: by === "lines" ? "lines" : "words,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = by === "lines" ? self.lines : self.words;
            return gsap.from(targets, {
              yPercent: 110,
              rotate: by === "lines" ? 2 : 0,
              duration: 1.2,
              stagger,
              delay,
              ease: "expo.out",
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
        gsap.set(el, { autoAlpha: 1 });
      };
      gsap.set(el, { autoAlpha: 0 });
      document.fonts.ready.then(run);
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
