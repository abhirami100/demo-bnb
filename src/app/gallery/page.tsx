import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { GALLERY } from "@/data/gallery.generated";
import { COLLECTIONS } from "@/data/collections";

export const metadata: Metadata = {
  title: "Gallery | Stationery Products",
  description: `Browse ${GALLERY.length} genuine stationery products from Camlin, Flexoffice, Pelikan, BnB English notebooks and Art & Craft — distributed by BnB Group across Saudi Arabia.`,
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        crumb="Gallery"
        title={
          <>
            The <span className="serif-accent font-normal text-indigo">collection</span>.
          </>
        }
        intro={
          <p>
            {GALLERY.length} genuine products across {COLLECTIONS.length} collections. Filter by collection, then open any piece full-screen.
          </p>
        }
      />
      <GalleryExplorer />
    </>
  );
}
