"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRANDS } from "@/data/brands";
import { COLLECTION_BY_ID, countOf } from "@/data/collections";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** All brands with a sticky, scroll-spied index on desktop. */
export function BrandList() {
  const [active, setActive] = useState(BRANDS[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    BRANDS.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="container-x pb-24 lg:pb-36">
      <div className="grid gap-10 lg:grid-cols-12">
        <nav aria-label="Brands" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-32 space-y-1">
            {BRANDS.map((b, i) => (
              <li key={b.id}>
                <a
                  href={`#${b.id}`}
                  aria-current={active === b.id ? "true" : undefined}
                  className={cn(
                    "group flex items-baseline gap-3 py-1.5 text-lg tracking-[-0.02em] transition-colors duration-300",
                    active === b.id ? "text-ink" : "text-ink-mute hover:text-ink",
                  )}
                >
                  <span className="w-6 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">
                    {b.name}
                    {active === b.id && <motion.span layoutId="brand-dot" className="absolute top-1/2 -right-4 size-1.5 -translate-y-1/2 rounded-full bg-marker" />}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lg:col-span-9">
          {BRANDS.map((b, i) => {
            const flip = i % 2 === 1;
            const collection = b.collection ? COLLECTION_BY_ID[b.collection] : null;
            return (
              <article key={b.id} id={b.id} aria-labelledby={`${b.id}-name`} className="scroll-mt-28 border-t border-line py-14 first:border-t-0 first:pt-0 lg:py-20">
                <div className={cn("grid items-center gap-10 md:grid-cols-2", flip && "md:[&>*:first-child]:order-2")}>
                  <Reveal className="relative">
                    <div className="group relative overflow-hidden rounded-[2rem] bg-card p-6">
                      <img
                        src={b.visual}
                        alt={`${b.name} products`}
                        loading="lazy"
                        className="aspect-[713/634] w-full object-contain transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04] group-hover:rotate-[-1deg]"
                      />
                      <span className="eyebrow absolute top-5 left-5 rounded-full bg-paper/85 px-3 py-1.5 text-ink-soft backdrop-blur">
                        {String(i + 1).padStart(2, "0")} / {BRANDS.length}
                      </span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    {b.logo ? (
                      <img src={b.logo} alt="" loading="lazy" className="mb-6 h-12 w-auto max-w-[14rem] object-contain object-left" />
                    ) : null}
                    <h2 id={`${b.id}-name`} className="text-h2 font-semibold">
                      {b.name}
                    </h2>
                    <p className="mt-5 leading-relaxed text-ink-soft">{b.description}</p>
                    {b.lines && (
                      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${b.name} product lines`}>
                        {b.lines.map((l) => (
                          <li key={l} className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
                            {l}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={`/contact-us/?brand=${encodeURIComponent(b.name)}`}
                        className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-indigo"
                      >
                        Enquire now
                      </Link>
                      {collection && (
                        <Link
                          href={`/gallery/?c=${collection.id}`}
                          className="inline-flex min-h-11 items-center rounded-full border border-ink/25 px-5 text-sm font-medium transition-colors hover:border-ink"
                        >
                          View {countOf(collection.id)} products
                        </Link>
                      )}
                    </div>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
