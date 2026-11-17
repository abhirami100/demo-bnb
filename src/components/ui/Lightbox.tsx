"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COLLECTION_BY_ID, imgSrc, itemLabel } from "@/data/collections";
import type { GalleryItem } from "@/data/types";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

type Props = {
  items: GalleryItem[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Full-screen product viewer: keyboard, swipe, click-to-zoom, thumbnails, focus management. */
export function Lightbox({ items, index, onChange }: Props) {
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [dir, setDir] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = index !== null;
  const item = open ? items[index] : null;

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      setZoom(false);
      onChange((index + d + items.length) % items.length);
    },
    [index, items.length, onChange],
  );
  const close = useCallback(() => onChange(null), [onChange]);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      lastFocus.current?.focus?.();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        // keep focus inside the dialog
        const nodes = document.querySelectorAll<HTMLElement>("#lightbox button, #lightbox a");
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, close]);

  // Preload neighbours for instant navigation.
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((d) => {
      const n = items[(index + d + items.length) % items.length];
      if (n) new Image().src = imgSrc(n);
    });
  }, [index, items]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          id="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={itemLabel(item)}
          className="fixed inset-0 z-[80] flex flex-col bg-indigo-deep/96 text-paper backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          data-lenis-prevent
        >
          <div className="container-x flex items-center justify-between gap-4 py-4">
            <p className="text-sm text-paper/70 tabular-nums">
              {index + 1} / {items.length}
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              className="grid size-12 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink"
              aria-label="Close viewer"
            >
              <svg viewBox="0 0 16 16" className="size-4" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={item.id}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d * 80, opacity: 0, scale: 0.96 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ x: d * -80, opacity: 0, scale: 0.96 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                drag={zoom ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -400) go(1);
                  else if (info.offset.x > 80 || info.velocity.x > 400) go(-1);
                }}
                className="relative flex h-full max-h-[78vh] w-full max-w-4xl items-center justify-center"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                    setZoom((z) => !z);
                  }}
                  onPointerMove={(e) => {
                    if (!zoom) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                  }}
                  aria-label={zoom ? "Zoom out" : "Zoom in"}
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-10",
                    zoom ? "cursor-zoom-out" : "cursor-zoom-in",
                  )}
                >
                  <img
                    src={imgSrc(item)}
                    alt={itemLabel(item)}
                    draggable={false}
                    className="size-full object-contain transition-transform duration-500 ease-out-expo"
                    style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
                  />
                </button>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 hidden size-14 -translate-y-1/2 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink sm:grid"
              aria-label="Previous product"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 hidden size-14 -translate-y-1/2 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink sm:grid"
              aria-label="Next product"
            >
              →
            </button>
          </div>

          <div className="container-x flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-sun">{COLLECTION_BY_ID[item.collection].name}</p>
              <p className="mt-2 max-w-xl text-lg font-medium tracking-[-0.02em]">{itemLabel(item)}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full bg-paper/10 sm:hidden" aria-label="Previous product">
                ←
              </button>
              <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full bg-paper/10 sm:hidden" aria-label="Next product">
                →
              </button>
              <Link
                href={`/contact-us/?product=${encodeURIComponent(itemLabel(item))}`}
                className="inline-flex min-h-12 items-center rounded-full bg-paper px-5 text-sm font-medium text-ink transition-colors hover:bg-sun"
                onClick={close}
              >
                Enquire about this
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
