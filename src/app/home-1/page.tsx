import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Showcase } from "@/components/home/Showcase";
import { Collections } from "@/components/home/Collections";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { WhyBnb } from "@/components/home/WhyBnb";
import { BrandStory } from "@/components/home/BrandStory";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { ContactCta } from "@/components/home/ContactCta";

/** Home page design 1 (editorial paper + indigo, 3D stationery). Listed on the root design index. */
export const metadata: Metadata = {
  title: "Home 1",
};

export default function Home1Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Showcase />
      <Collections />
      <FeaturedRail />
      <WhyBnb />
      <BrandStory />
      <BrandMarquee />
      <ContactCta />
    </>
  );
}
