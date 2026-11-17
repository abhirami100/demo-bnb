"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Animations are intentionally shown to every visitor, including those with the OS
 * "reduce motion" setting on. To respect that setting again, return
 * `window.matchMedia("(prefers-reduced-motion: reduce)").matches` here.
 */
export const prefersReducedMotion = () => false;

/** Drop-in for framer-motion's useReducedMotion, routed through the same switch. */
export const useReducedMotion = () => prefersReducedMotion();

export { gsap, ScrollTrigger, SplitText, useGSAP };
