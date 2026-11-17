"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/gsap";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "light" | "ghost";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-indigo",
  outline: "border border-ink/25 text-ink hover:border-ink",
  light: "bg-paper text-ink hover:bg-white",
  ghost: "text-ink",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
  /** Magnetic pull towards the cursor (desktop pointers only). */
  magnetic?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({ href, children, variant = "solid", className, icon = true, magnetic = true, ...rest }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!magnetic || reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const external = /^(https?:|mailto:|tel:)/.test(href);
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <span
          aria-hidden
          className="relative z-10 grid size-7 place-items-center overflow-hidden rounded-full bg-current/10 transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 8h12M9 3l5 5-5 5" />
          </svg>
        </span>
      )}
    </>
  );
  const cls = cn(
    "group relative inline-flex min-h-12 items-center gap-3 rounded-full py-2 pr-2.5 pl-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-500 ease-out-expo",
    !icon && "pr-6",
    styles[variant],
    className,
  );

  return (
    <motion.span style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} className="inline-flex">
      {external ? (
        <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls} {...rest}>
          {inner}
        </Link>
      )}
    </motion.span>
  );
}
