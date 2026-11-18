import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PALETTE_HEX } from "@/components/home2/ui";

/** Root page: an index of the home page designs, each linking to its own route. */
export const metadata: Metadata = {
	title: { absolute: "BnB Group | Home page designs" },
	robots: { index: false, follow: true },
};

type Design = {
	n: string;
	href: string;
	title: string;
	style: string;
	body: string;
	tags: string[];
	preview: ReactNode;
};

const DESIGNS: Design[] = [
	{
		n: "01",
		href: "/home-1/",
		title: "Home 1",
		style: "Editorial",
		body: "Warm paper and BnB indigo, large serif accents, an interactive 3D stationery showcase and scroll-driven storytelling.",
		tags: ["Paper + indigo", "3D showcase", "Scroll story"],
		preview: <PreviewOne />,
	},
	{
		n: "02",
		href: "/home-2/",
		title: "Home 2",
		style: "Playful",
		body: "Graph-paper backdrop with a bright block palette, morphing tiles, a brand hub and a quick-answer FAQ.",
		tags: ["Graph paper", "Block palette", "FAQ"],
		preview: <PreviewTwo />,
	},
];

export default function DesignIndexPage() {
	return (
		<div className="container-x flex min-h-svh flex-col py-8 lg:py-12">
			<header className="flex items-center justify-between gap-4">
				<span className="inline-flex items-center gap-3">
					<Image
						src="/brand-assets/logo-80.png"
						alt=""
						width={40}
						height={40}
						className="size-10"
					/>
					<span className="text-[1.05rem] font-semibold tracking-[-0.03em]">
						BnB Group
					</span>
				</span>
				<span className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft">
					{DESIGNS.length} designs
				</span>
			</header>

			<div className="mt-16 max-w-3xl lg:mt-24">
				<p className="eyebrow text-indigo">Home page designs</p>
			</div>

			<ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">
				{DESIGNS.map((d) => (
					<li key={d.href}>
						<Link
							href={d.href}
							className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-card transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(18_19_24/.35)]"
						>
							<div className="relative aspect-[16/10] overflow-hidden">
								<div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
									{d.preview}
								</div>
								<span className="absolute top-4 left-4 rounded-full bg-card/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
									{d.style}
								</span>
							</div>

							<div className="flex flex-1 flex-col p-6 lg:p-8">
								<div className="flex items-start justify-between gap-6">
									<div>
										<p className="text-sm text-ink-mute">{d.n}</p>
										<h2 className="mt-1 text-h3 font-semibold">{d.title}</h2>
									</div>
									<span
										aria-hidden
										className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors duration-500 group-hover:bg-indigo"
									>
										<svg
											viewBox="0 0 16 16"
											className="size-4 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.6"
										>
											<path d="M2 8h12M9 3l5 5-5 5" />
										</svg>
									</span>
								</div>
								<p className="mt-4 max-w-md text-ink-soft">{d.body}</p>
								<ul className="mt-auto flex flex-wrap gap-2 pt-6">
									{d.tags.map((t) => (
										<li
											key={t}
											className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft"
										>
											{t}
										</li>
									))}
								</ul>
								<span className="mt-6 text-sm text-ink-mute">
									bnbgroup.org<span className="text-ink">{d.href}</span>
								</span>
							</div>
						</Link>
					</li>
				))}
			</ul>

			<p className="mt-auto pt-16 text-sm text-ink-mute">
				Badarath Al-Aamal Trading Company · Riyadh, KSA
			</p>
		</div>
	);
}

/** Stylised thumbnail of Home 1: paper, indigo headline, serif accent, product shot. */
function PreviewOne() {
	return (
		<div aria-hidden className="relative size-full bg-paper">
			<div className="absolute -right-10 -bottom-16 size-64 rounded-full bg-sun/50 blur-3xl" />
			<div className="absolute inset-x-6 top-6 flex items-center justify-between">
				<span className="h-2 w-16 rounded-full bg-ink/80" />
				<span className="flex gap-2">
					{[0, 1, 2, 3].map((i) => (
						<span key={i} className="h-1.5 w-8 rounded-full bg-ink/20" />
					))}
				</span>
			</div>
			<div className="absolute top-[28%] left-6 w-[52%]">
				<p className="text-[clamp(1.4rem,3.2vw,2.4rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
					Big ideas start with{" "}
					<span className="serif-accent font-normal text-indigo">little</span>{" "}
					supplies
				</p>
				<span className="mt-4 inline-block h-6 w-24 rounded-full bg-ink" />
			</div>
			<Image
				src="/brand-assets/prod1.webp"
				alt=""
				width={600}
				height={600}
				className="on-paper absolute right-2 bottom-0 h-[78%] w-auto object-contain"
			/>
			<div className="absolute inset-x-0 bottom-0 h-[14%] bg-indigo-deep" />
		</div>
	);
}

/** Stylised thumbnail of Home 2: graph paper with a mosaic of palette blocks. */
function PreviewTwo() {
	const shapes = [
		"9999px",
		"1rem",
		"9999px 9999px 1rem 1rem",
		"1rem 9999px 9999px 1rem",
		"1rem",
		"9999px",
	];
	return (
		<div aria-hidden className="graph-paper relative size-full">
			<div className="absolute inset-x-6 top-6 flex items-center justify-between">
				<span className="h-2 w-16 rounded-full bg-ink/80" />
				<span className="h-6 w-20 rounded-full bg-ink" />
			</div>
			<p className="absolute top-[24%] left-6 w-[46%] text-[clamp(1.4rem,3.2vw,2.4rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
				One partner for your{" "}
				<span className="serif-accent font-normal">notebooks</span>
			</p>
			<div className="absolute top-[22%] right-6 bottom-6 grid w-[40%] grid-cols-3 gap-1.5">
				{Array.from({ length: 9 }, (_, i) => (
					<span
						key={i}
						style={{
							background: PALETTE_HEX[i % PALETTE_HEX.length],
							borderRadius: shapes[i % shapes.length],
						}}
					/>
				))}
			</div>
		</div>
	);
}
