import Link from "next/link";
import type { ReactNode } from "react";
import { SplitReveal } from "./SplitReveal";

/** Shared inner-page header: breadcrumb, oversized title, optional intro + aside. */
export function PageHero({ crumb, title, intro, aside }: { crumb: string; title: ReactNode; intro?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="container-x pt-32 pb-12 lg:pt-44 lg:pb-20">
      <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2 text-ink-mute">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page" className="text-indigo">
          {crumb}
        </span>
      </nav>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <SplitReveal as="h1" trigger="mount" delay={0.35} className="text-display font-semibold lg:col-span-8">
          {title}
        </SplitReveal>
        {(intro || aside) && (
          <div className="lg:col-span-4">
            {intro && <div className="text-lead text-ink-soft">{intro}</div>}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
