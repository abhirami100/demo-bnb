"use client";

import { useEffect, useState } from "react";

/**
 * Decides whether to mount a WebGL scene: requires WebGL support and no data-saver. Resolves after hydration, so the static fallback is always what is pre-rendered.
 */
export function useCan3D() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let supported = false;
    try {
      const c = document.createElement("canvas");
      supported = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      supported = false;
    }
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    setOk(supported && !saveData);
  }, []);
  return ok;
}

/** Mount children only once the element is near the viewport and the browser is idle. */
export function useNearViewport(ref: React.RefObject<Element | null>, rootMargin = "200px") {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return { near, visible };
}
