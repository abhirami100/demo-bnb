"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks horizontal drag on an element (mouse or touch) and accumulates it into a velocity ref
 * that a 3D scene reads and decays each frame. Vertical page scrolling stays native (touch-action: pan-y).
 */
export function useDragVelocity(ref: React.RefObject<HTMLElement | null>) {
  const velocity = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let lastX = 0;
    const isInteractive = (t: EventTarget | null) => t instanceof Element && !!t.closest("a,button,input,textarea,select");
    const onDown = (e: PointerEvent) => {
      if (isInteractive(e.target)) return;
      down = true;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      velocity.current += e.clientX - lastX;
      lastX = e.clientX;
    };
    const onUp = () => (down = false);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [ref]);
  return velocity;
}
