import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/data/site";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BnB Group | Leading School & Office Stationery Distributor in Saudi Arabia",
    template: "%s | BnB Group",
  },
  description:
    "BnB Group (Badarath Al-Aamal Trading Company) — trusted stationery & packaging distributor since 2006. Head office in Riyadh with branches in Dammam, Jeddah and Khamis Mushayth.",
  icons: { icon: "/brand-assets/logo-80.png" },
  openGraph: {
    type: "website",
    siteName: "BnB Group",
    locale: "en_US",
    images: [{ url: "/brand-assets/prod1.webp" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f0e9",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BnB Group",
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/brand-assets/logo-80.png`,
  foundingDate: String(SITE.founded),
  email: SITE.email,
  telephone: SITE.phone.label,
  address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
