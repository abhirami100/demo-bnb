/**
 * Company content — copied from the existing bnbgroup.org pages (Home, About Us, Contact Us, footer).
 * Do not add claims, figures or history here that are not on the current site.
 */
export const SITE = {
  name: "BnB Group",
  legalName: "Badarath Al-Aamal Trading Company",
  url: "https://bnbgroup.org",
  founded: 2006,
  tollFree: { label: "+966 11 474 7170", href: "tel:+966114747170" },
  phone: { label: "+966 920002268", href: "tel:+966920002268" },
  email: "info@bnbgroup.org",
  whatsapp: "https://wa.me/966557772715",
  hours: ["Saturday – Thursday: 8:30 – 05:30", "Friday – Off Day"],
  headOffice: "Riyadh, KSA",
  branches: ["Dammam", "Jeddah", "Khamis Mushayth"],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14850035.69365452!2d46.7300538!3d24.6754365!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f04131a30181f%3A0x66d6ba4eb039bd62!2sBNB%20GROUP!5e0!3m2!1sen!2sin!4v1757571834612!5m2!1sen!2sin",
  /** Existing PHP mailer on the current host; the form posts the same urlencoded fields. */
  mailEndpoint: "/mailserver/server.php",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/aboutus/" },
  { label: "Our Brands", href: "/brand/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Contact Us", href: "/contact-us/" },
] as const;

export const COPY = {
  footerIntro:
    "Established in 2006, BADERAT AL-AAMAL is a trusted name in the world of stationery and packaging. With our headquarters in Riyadh, KSA, and branches in Dammam, Jeddah, and Khamis Mushayth, we have swiftly become a leading distributor in Saudi Arabia.",
  homeTagline: "Big Ideas Start with Little Supplies",
  partnerTitle: "Your Trusted Stationery & Packaging Partner",
  partnerBody:
    "We are Baderat al Amal Trading Company (BNB Group), your trusted partner in the world of stationery and packaging. Established in 2006, we have grown to become a leading distributor in Saudi Arabia, with our headquarters in Riyadh and branches in Dammam, Jeddah, and Khamis Mushayth. Our commitment to quality and customer satisfaction has made us a trusted name in the industry. Explore our wide range of products and services, and discover why we are the go-to choice for businesses and individuals alike.",
  aboutIntro:
    "Badarath Al-Aamal Trading Company (BnB Group) is one of the most reputed trading Company started in 2006 with head office located in Riyadh KSA. Within a short span of time we became a leading distributor in the field of School and office Stationery in Saudi Arabia with branches in Dammam, Jeddah and Khamis Mushayth. We take pride in our happy and satisfied customer's base. Our energetic sales, marketing and logistics teams ensures that all our commitments are fulfilled with precision as we make further inroads to the new markets riding on our formidable reputation. Our aim is boundless growth based on symbiotic ethos.",
  vision: "Provide quality products to the best satisfaction of the customers.",
  mission:
    "The mission of BnB Group is to contribute Material value to its clients and to help them establish strong, successful long-term Positions in their markets.",
  strength:
    "All our products are sourced with utmost attention to quality from the best companies in the world. Being part of a large trading establishment any requirement other than stationery also could be arranged promptly.",
  contactCta: "We are BNB Group. Quality Service is all that matters to us.",
  contactCtaSub: "Kindly Reach out to us for Orders and Queries",
} as const;

export const WHY_BNB = [
  {
    title: "A to Z Solution for School and Office Stationery",
    body: "We offer a comprehensive range of stationery supplies and packaging products, providing an all-encompassing solution for your needs.",
  },
  {
    title: "Trusted in the Saudi Market",
    body: "Our reputation precedes us. We have gained the trust of countless clients in the Saudi market, establishing ourselves as a reliable partner.",
  },
  {
    title: "Vast Loyal Customer Base",
    body: "Our success is rooted in the satisfaction of our customers. We take pride in our extensive and loyal customer base who rely on us for their stationery and packaging requirements.",
  },
  {
    title: "National & International Reach",
    body: "Serving both national and international clients, our reach extends beyond borders, making us a global player in the industry.",
  },
  {
    title: "Uncompromising Quality",
    body: "Quality is non-negotiable for us. We ensure that our products and services meet the highest standards, providing you with excellence in every purchase.",
  },
  {
    title: "Speedy Delivery & Best-in-Market Prices",
    body: "We understand the importance of timely delivery and competitive pricing. Experience the convenience of prompt delivery without compromising on affordability.",
  },
] as const;

/** Client logos shown on the current About page (no names were published, so alt text stays generic). */
export const CLIENT_LOGOS = [1, 4, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25].map(
  (n) => `/brand-assets/client${n}.webp`,
);

export const SISTER_CONCERNS = [
  { name: "Zeal International School", logo: "/brand-assets/zealschool.webp" },
  { name: "Huda Al-Noor International School", logo: "/brand-assets/huda-al-noor.webp" },
  { name: "Modern International School", logo: "/brand-assets/mis-logo-transp.png" },
  // Name as printed (in Arabic) on the logo: مؤسسة بدر ناصر البدر للتجارة
  { name: "Bader Nasser Al-Bader Trading Est.", logo: "/brand-assets/al-bader.webp" },
] as const;

/** Lifestyle product photography from the current home page "Our Product Range" strip. */
export const LIFESTYLE = {
  artDesk: "/brand-assets/prod1.webp",
  oilPastels: "/brand-assets/prod2.webp",
  montexSet: "/brand-assets/prod3.webp",
  celloBottles: "/brand-assets/prod4.webp",
  celloPens: "/brand-assets/prod5.webp",
  colourSplit: "/brand-assets/prod6.webp",
  pastelDesk: "/brand-assets/prod7.webp",
  pastelPens: "/brand-assets/prod8.webp",
  store: "/brand-assets/store.webp",
} as const;
