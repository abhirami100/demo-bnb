import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PRIVACY } from "@/data/privacy.generated";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumb="Privacy Policy" title="Privacy policy." />
      <article className="container-x pb-24 lg:pb-36">
        <div className="max-w-3xl space-y-4 leading-relaxed text-ink-soft lg:ml-[25%]">
          {PRIVACY.map((b, i) =>
            "h" in b ? (
              <h2 key={i} className="pt-8 text-h3 font-semibold text-ink first:pt-0">
                {b.h}
              </h2>
            ) : (
              <p key={i}>{b.p}</p>
            ),
          )}
        </div>
      </article>
    </>
  );
}
