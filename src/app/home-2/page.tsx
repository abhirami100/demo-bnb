import type { Metadata } from "next";
import { Hero2 } from "@/components/home2/Hero2";
import { Cloud2, Statement2, Tagline2 } from "@/components/home2/Story2";
import { Brands2, Hub2 } from "@/components/home2/Brands2";
import { Range2, WhyStack2 } from "@/components/home2/Features2";
import { Branches2, Faq2, Ready2 } from "@/components/home2/Close2";

/** Alternative home page design (graph paper + playful block palette). Not indexed while it is a variant. */
export const metadata: Metadata = {
  title: "Home 2",
  robots: { index: false, follow: true },
};

export default function Home2Page() {
  return (
    <>
      <Hero2 />
      <Statement2 />
      <Cloud2 />
      <Tagline2 />
      <Brands2 />
      <Hub2 />
      <WhyStack2 />
      <Range2 />
      <Branches2 />
      <Ready2 />
      <Faq2 />
    </>
  );
}
