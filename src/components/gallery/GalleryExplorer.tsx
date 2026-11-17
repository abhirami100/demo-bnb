"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { GALLERY } from "@/data/gallery.generated";
import { COLLECTIONS, COLLECTION_BY_ID, itemLabel } from "@/data/collections";
import { BRANDS } from "@/data/brands";
import type { CollectionId, GalleryItem } from "@/data/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/cn";
import { ScrollTrigger } from "@/lib/gsap";

const PAGE = 24;
type Filter = CollectionId | "all";

const isFilter = (v: string | null): v is CollectionId => !!v && COLLECTIONS.some((c) => c.id === v);

/** Every 11th tile becomes a large editorial feature on wide screens. */
const isFeature = (i: number) => i % 11 === 0;

function Tile({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const feature = isFeature(index);
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % PAGE) * 0.025 }}
      className={cn(feature && "sm:col-span-2 sm:row-span-2")}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full overflow-hidden rounded-[1.5rem] bg-white text-left transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(18_19_24/.35)]"
        aria-label={`View ${itemLabel(item)}`}
      >
        <span className={cn("relative block aspect-[4/5] p-[9%]", feature && "sm:aspect-auto sm:h-full")} style={{ backgroundColor: "#fff" }}>
          <ProductImage
            item={item}
            className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
            sizes={feature ? "(min-width:1024px) 40vw, 90vw" : "(min-width:1280px) 20vw, (min-width:640px) 30vw, 45vw"}
          />
        </span>
        <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-end justify-between gap-3 rounded-xl bg-paper/90 px-3 py-2.5 opacity-0 backdrop-blur transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="min-w-0">
            <span className="eyebrow block text-[0.6rem] text-indigo">{COLLECTION_BY_ID[item.collection].name}</span>
            <span className="mt-0.5 block truncate text-sm font-medium">{item.title ?? `No. ${item.n}`}</span>
          </span>
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs text-paper">
            ⤢
          </span>
        </span>
      </button>
    </motion.li>
  );
}

export function GalleryExplorer() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [count, setCount] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);

  // The page is prerendered with every product; the ?c= filter is applied after hydration
  // and kept in sync with back/forward navigation.
  useEffect(() => {
    const sync = () => {
      const c = new URLSearchParams(window.location.search).get("c");
      setFilter(isFilter(c) ? c : "all");
      setCount(PAGE);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const items = useMemo(() => (filter === "all" ? GALLERY : GALLERY.filter((g) => g.collection === filter)), [filter]);
  const visible = items.slice(0, count);

  const choose = (f: Filter) => {
    setFilter(f);
    setCount(PAGE);
    router.replace(f === "all" ? "/gallery/" : `/gallery/?c=${f}`, { scroll: false });
    const y = (top.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 90;
    if (window.scrollY > y) window.scrollTo({ top: y });
  };

  // Infinite loading: append the next page as the sentinel approaches.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setCount((c) => Math.min(c + PAGE, items.length)), { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [items.length]);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [visible.length, filter]);

  const current = filter === "all" ? null : COLLECTION_BY_ID[filter];
  const brand = current ? BRANDS.find((b) => b.collection === current.id) : null;

  return (
    <section aria-label="Product gallery" className="pb-24 lg:pb-36">
      <div ref={top} />
      {/* filter bar */}
      <div className="sticky top-[var(--header-h,4.5rem)] z-30 border-y border-line bg-paper/85 backdrop-blur-xl transition-[top] duration-500 ease-out-expo lg:top-[var(--header-h,5rem)]">
        <div className="container-x no-scrollbar flex items-center gap-2 overflow-x-auto py-3" role="tablist" aria-label="Filter by collection">
          <LayoutGroup id="filters">
            {(["all", ...COLLECTIONS.map((c) => c.id)] as Filter[]).map((f) => {
              const active = f === filter;
              const label = f === "all" ? "All products" : COLLECTION_BY_ID[f].name;
              const n = f === "all" ? GALLERY.length : GALLERY.filter((g) => g.collection === f).length;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => choose(f)}
                  className={cn(
                    "relative min-h-11 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                    active ? "text-paper" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  {active && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">
                    {label} <span className={cn("ml-1 tabular-nums", active ? "text-paper/60" : "text-ink-mute")}>{n}</span>
                  </span>
                </button>
              );
            })}
          </LayoutGroup>
        </div>
      </div>

      {/* collection intro */}
      <div className="container-x">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-4 py-10 sm:flex-row sm:items-end"
          >
            <div>
              <h2 className="text-h2 font-semibold">{current ? current.name : "Every collection"}</h2>
              <p className="mt-2 max-w-xl text-ink-soft">
                {current ? current.summary : "Browse the full range — Camlin, Flexoffice, Pelikan, BnB English notebooks and Art & Craft."}
              </p>
            </div>
            <p className="text-sm text-ink-mute tabular-nums" aria-live="polite">
              Showing {visible.length} of {items.length}
              {brand && (
                <>
                  {" · "}
                  <Link href={`/brand/#${brand.id}`} className="font-medium text-indigo hover:underline">
                    About {brand.name}
                  </Link>
                </>
              )}
            </p>
          </motion.div>
        </AnimatePresence>

        <ul className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <Tile key={item.id} item={item} index={i} onOpen={() => setOpen(i)} />
            ))}
          </AnimatePresence>
        </ul>

        <div ref={sentinel} aria-hidden className="h-px" />
        {count < items.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(c + PAGE, items.length))}
              className="min-h-12 rounded-full border border-ink/25 px-6 text-sm font-medium transition-colors hover:border-ink"
            >
              Load more products
            </button>
          </div>
        )}
      </div>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </section>
  );
}
