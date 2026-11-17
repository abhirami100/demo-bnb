import Link from "next/link";
import { cn } from "@/lib/cn";

/** Official BnB Group mark (from the current site) + wordmark. */
export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "paper" }) {
  return (
    <Link href="/" aria-label="BnB Group — home" className={cn("group inline-flex items-center gap-3", className)}>
      <img
        src="/brand-assets/logo-80.png"
        alt=""
        width={40}
        height={40}
        className="size-10 transition-transform duration-700 ease-out-expo group-hover:rotate-[-8deg]"
      />
      <span className={cn("hidden leading-none sm:block", tone === "paper" ? "text-paper" : "text-ink")}>
        <span className="block text-[1.05rem] font-semibold tracking-[-0.03em]">BnB Group</span>
        <span className="eyebrow mt-1 block text-[0.6rem] opacity-60">Since 2006 · Riyadh</span>
      </span>
    </Link>
  );
}
