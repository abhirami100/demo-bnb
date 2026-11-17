import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BrandList } from "@/components/brands/BrandList";
import { ContactCta } from "@/components/home/ContactCta";
import { BRANDS } from "@/data/brands";

export const metadata: Metadata = {
  title: "Our Brands | Trusted Stationery Partners",
  description: `BnB Group distributes ${BRANDS.map((b) => b.name).join(", ")} across Saudi Arabia.`,
  alternates: { canonical: "/brand/" },
};

export default function BrandsPage() {
  return (
    <>
      <PageHero
        crumb="Our Brands"
        title={
          <>
            Brands we <span className="serif-accent font-normal text-indigo">bring</span> to the Kingdom.
          </>
        }
        intro={<p>From everyday ball pens to premium writing instruments, art colours, paper and classroom technology.</p>}
      />
      <BrandList />
      <ContactCta />
    </>
  );
}
