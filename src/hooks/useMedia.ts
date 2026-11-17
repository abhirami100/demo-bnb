"use client";

import { useSyncExternalStore } from "react";

function subscribeMQ(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** SSR-safe media query hook (returns `serverValue` during prerender). */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMQ(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Always false: animations are shown to everyone (see prefersReducedMotion in @/lib/gsap). */
export const useReducedMotion = () => false;
export const useIsCoarsePointer = () => useMediaQuery("(pointer: coarse)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)", true);
