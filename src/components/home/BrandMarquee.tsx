import Link from "next/link";
import { BRAND_LOGOS } from "@/data/brands";

/** Two counter-scrolling rows of the brand logos we distribute (CSS-only, pauses on hover). */
export function BrandMarquee() {
  const rows = [BRAND_LOGOS, [...BRAND_LOGOS].reverse()];
  return (
    <section aria-labelledby="brands-title" className="py-24 lg:py-32">
      <div className="container-x mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-indigo">Our brands</p>
          <h2 id="brands-title" className="mt-4 text-h2 font-semibold">
            Names you <span className="serif-accent font-normal">already</span> trust.
          </h2>
        </div>
        <Link href="/brand/" className="group inline-flex items-center gap-2 self-start border-b border-ink/30 pb-1 font-medium hover:border-ink sm:self-auto">
          All brands <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="space-y-4">
        {rows.map((row, r) => (
          <div key={r} className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul
              className="flex w-max shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
              style={{ animation: `marquee ${r ? 46 : 40}s linear infinite ${r ? "reverse" : ""}` }}
            >
              {[...row, ...row].map((b, i) => (
                <li
                  key={i}
                  aria-hidden={i >= row.length}
                  className="grid h-28 w-56 shrink-0 place-items-center rounded-2xl bg-card px-8 transition-colors duration-300 hover:bg-white sm:h-32 sm:w-64"
                >
                  <img src={b.src} alt={i < row.length ? b.name : ""} loading="lazy" className="max-h-14 w-auto max-w-full object-contain" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
