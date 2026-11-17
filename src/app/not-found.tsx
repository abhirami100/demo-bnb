import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-32 pb-20">
      <p className="eyebrow text-indigo">404</p>
      <h1 className="mt-6 text-display font-semibold">
        This page is <span className="serif-accent font-normal text-indigo">blank</span>.
      </h1>
      <p className="mt-6 max-w-md text-lead text-ink-soft">The page you were looking for doesn’t exist — but the collection does.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-medium text-paper hover:bg-indigo">
          Back home
        </Link>
        <Link href="/gallery/" className="inline-flex min-h-12 items-center rounded-full border border-ink/25 px-6 font-medium hover:border-ink">
          Browse the gallery
        </Link>
      </div>
    </section>
  );
}
