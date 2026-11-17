import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { COPY, SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us | Stationery Distributor in Saudi Arabia",
  description: `Contact BnB Group for orders and queries. Call ${SITE.phone.label}, toll free ${SITE.tollFree.label}, or email ${SITE.email}.`,
  alternates: { canonical: "/contact-us/" },
};

export default function ContactPage() {
  const cards = [
    {
      k: "Address",
      body: (
        <>
          Head Office: {SITE.headOffice}
          <br />
          Branches: {SITE.branches.join(" · ")}
        </>
      ),
    },
    {
      k: "Information",
      body: (
        <>
          <a href={SITE.phone.href} className="hover:text-indigo">
            {SITE.phone.label}
          </a>
          <br />
          <a href={SITE.tollFree.href} className="hover:text-indigo">
            {SITE.tollFree.label}
          </a>{" "}
          <span className="text-ink-mute">(toll free)</span>
          <br />
          <a href={`mailto:${SITE.email}`} className="hover:text-indigo">
            {SITE.email}
          </a>
        </>
      ),
    },
    {
      k: "We’re open",
      body: (
        <>
          {SITE.hours[0]}
          <br />
          {SITE.hours[1]}
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        crumb="Contact Us"
        title={
          <>
            Let’s <span className="serif-accent font-normal text-indigo">talk</span> stationery.
          </>
        }
        intro={
          <p>
            {COPY.contactCta} {COPY.contactCtaSub}.
          </p>
        }
      />
      <section aria-label="Contact form and details" className="container-x pb-24 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="space-y-4 lg:col-span-5">
            {cards.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.06} className="rounded-[1.5rem] bg-card p-7">
                <h2 className="eyebrow text-indigo">{c.k}</h2>
                <p className="mt-3 text-lg leading-relaxed">{c.body}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[1.5rem] bg-[#25d366] p-7 font-medium text-white transition-transform duration-500 hover:-translate-y-1"
              >
                Chat with us on WhatsApp <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
      <section aria-label="Map" className="container-x pb-24 lg:pb-36">
        <div className="overflow-hidden rounded-[2rem] bg-card">
          <iframe
            src={SITE.mapEmbed}
            title="BnB Group location on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[26rem] w-full grayscale-[0.4] lg:h-[32rem]"
          />
        </div>
      </section>
    </>
  );
}
