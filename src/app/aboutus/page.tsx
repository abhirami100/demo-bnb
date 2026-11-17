import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ContactCta } from "@/components/home/ContactCta";
import { CLIENT_LOGOS, COPY, LIFESTYLE, SISTER_CONCERNS, SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us | Trusted Stationery Supplier Since 2006",
  description: COPY.aboutIntro.slice(0, 155),
  alternates: { canonical: "/aboutus/" },
};

const PILLARS = [
  { k: "Vision", v: COPY.vision, tone: "bg-sun" },
  { k: "Mission", v: COPY.mission, tone: "bg-indigo text-paper" },
  { k: "Strength", v: COPY.strength, tone: "bg-card" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About Us"
        title={
          <>
            More than stationery. <span className="serif-accent font-normal text-indigo">A part of every idea.</span>
          </>
        }
      />

      {/* introduction */}
      <section aria-labelledby="intro-h" className="container-x pb-24 lg:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <figure className="overflow-hidden rounded-[2rem] bg-paper-2">
              <img src={LIFESTYLE.store} alt="Shelves stocked with stationery products" className="aspect-[4/5] w-full object-contain p-8" />
            </figure>
          </Reveal>
          <div className="lg:col-span-7 lg:pl-8">
            <h2 id="intro-h" className="eyebrow text-indigo">
              Introduction
            </h2>
            <Reveal>
              <p className="mt-6 text-[clamp(1.2rem,1.9vw,1.75rem)] leading-[1.45] tracking-[-0.015em]">{COPY.aboutIntro}</p>
            </Reveal>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3">
              <div>
                <dt className="eyebrow text-ink-mute">Established</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{SITE.founded}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-mute">Head office</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Riyadh</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="eyebrow text-ink-mute">Branches</dt>
                <dd className="mt-2 text-lg font-medium">{SITE.branches.join(" · ")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* vision / mission / strength */}
      <section aria-label="Vision, mission and strength" className="container-x pb-24 lg:pb-36">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08} className={`flex min-h-[22rem] flex-col justify-between rounded-[2rem] p-8 lg:p-10 ${p.tone}`}>
              <p className="eyebrow opacity-70">0{i + 1}</p>
              <div>
                <h2 className="text-h2 font-semibold">{p.k}</h2>
                <p className="mt-4 leading-relaxed opacity-85">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* clients */}
      <section aria-labelledby="clients-h" className="border-y border-line bg-card py-24 lg:py-32">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow text-indigo">Our clients</p>
            <SplitReveal as="h2" className="mt-4 text-h2 font-semibold">
              <span id="clients-h">
                Trusted by retailers <span className="serif-accent font-normal">&amp;</span> schools across the Kingdom.
              </span>
            </SplitReveal>
          </div>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-line sm:grid-cols-3 lg:grid-cols-5">
            {CLIENT_LOGOS.map((src, i) => (
              <li key={src} className="group grid aspect-[3/2] place-items-center bg-card p-6">
                <img
                  src={src}
                  alt={`Client logo ${i + 1}`}
                  loading="lazy"
                  className="max-h-20 w-auto max-w-full object-contain grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* sister concerns */}
      <section aria-labelledby="sister-h" className="container-x py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow text-indigo">Our sister concerns</p>
            <h2 id="sister-h" className="mt-4 text-h2 font-semibold">
              Part of a <span className="serif-accent font-normal">wider</span> family.
            </h2>
          </div>
          <ul className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-4">
            {SISTER_CONCERNS.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 0.06} className="flex h-full flex-col items-center justify-between gap-4 rounded-[1.5rem] bg-card p-6 text-center">
                  <img src={s.logo} alt="" loading="lazy" className="h-24 w-auto max-w-full object-contain" />
                  <p className="text-sm font-medium">{s.name}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
