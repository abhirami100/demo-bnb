"use client";

import { motion } from "framer-motion";
import { WHY_BNB } from "@/data/site";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** The six "Why BNB" points from the current home page, as a sticky editorial index. */
export function WhyBnb() {
  return (
    <section aria-labelledby="why-title" className="container-x py-24 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow text-indigo">Why BNB</p>
            <SplitReveal as="h2" className="mt-5 text-h1 font-semibold">
              <span id="why-title">
                Built on <span className="serif-accent font-normal text-indigo">trust</span>, delivered with care.
              </span>
            </SplitReveal>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {WHY_BNB.map((w, i) => (
            <motion.li
              key={w.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-8 last:border-b sm:grid-cols-[5rem_1fr] lg:py-10"
            >
              <span className="text-sm font-medium text-marker tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-h3 font-semibold transition-colors duration-500 group-hover:text-indigo">{w.title}</h3>
                <p className="mt-3 max-w-xl text-ink-soft">{w.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
