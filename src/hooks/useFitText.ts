"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scales an element's font-size so its single line of text fills the element's width exactly.
 * The CSS font-size acts as the starting point (and the fallback before JS runs).
 */
export function useFitText(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastWidth = -1;
    const fit = () => {
      const width = el.clientWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;
      el.style.fontSize = "";
      const base = parseFloat(getComputedStyle(el).fontSize);
      // Measure the letters themselves: scrollWidth never drops below the box width, so it can't detect spare room.
      const kids = el.children;
      if (!kids.length) return;
      const content =
        kids[kids.length - 1].getBoundingClientRect().right - kids[0].getBoundingClientRect().left;
      if (content > 0) el.style.fontSize = `${(base * width * 0.995) / content}px`;
    };

    fit();
    document.fonts?.ready.then(() => {
      lastWidth = -1;
      fit();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}
