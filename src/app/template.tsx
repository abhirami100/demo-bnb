"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Page transition: an indigo sheet slides away as each route mounts, like turning a page.
 * Re-mounts on every navigation (App Router template). Reduced-motion users get an instant
 * transition via the global <MotionConfig reducedMotion="user"> plus a CSS override.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-indigo"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      />
      {/* Opacity only: a transform here would break fixed/sticky descendants (lightbox, pinned scenes). */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
        {children}
      </motion.div>
    </>
  );
}
