"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname === "/") return null; // design index page

  return (
    <motion.a
      href={SITE.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with BnB Group on WhatsApp"
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 2.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/.6)] sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.33.67 4.5 1.84 6.35L4 29l7.9-1.8a12.1 12.1 0 0 0 4.14.72C22.67 27.92 28 22.56 28 15.95 28 9.36 22.67 3 16.04 3Zm0 22.7c-1.3 0-2.6-.24-3.8-.72l-.55-.21-4.7 1.07 1.1-4.48-.36-.58a9.6 9.6 0 0 1-1.55-5.23c0-5.4 4.4-9.8 9.86-9.8 5.43 0 9.85 4.6 9.85 9.6 0 5.83-4.42 10.35-9.85 10.35Zm5.4-7.3c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1-1.04 2.45s1.06 2.84 1.21 3.04c.15.2 2.09 3.18 5.06 4.46.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </motion.a>
  );
}
