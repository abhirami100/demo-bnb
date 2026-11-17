# BnB Group — website revamp

Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText · Framer Motion · React Three Fiber · Lenis.

## Run

```bash
npm install
npm run dev            # http://localhost:3000 (dev mode is slow for the 3D scenes; judge performance on a build)
npm run build          # static export → out/
node scripts/serve-out.mjs out 3300   # preview the export; also stubs the mail endpoint
```

## Deploy

`out/` is plain static files. Upload it to the existing nginx host **next to the existing `/mailserver/server.php`** —
the contact form posts the same urlencoded fields as the current site (`name, company, email, number, message`).
URLs are unchanged (`/aboutus/`, `/brand/`, `/gallery/`, `/contact-us/`, `/privacy-policy/`); `trailingSlash` emits
`<route>/index.html`, which works with a standard `try_files $uri $uri/ =404;`.

## Content provenance

All copy, product photos, logos and brand descriptions come from the current bnbgroup.org:

- `scripts/fetch-assets.mjs` mirrors the original assets into `public/`.
- `scripts/build-data.mjs` generates responsive webp variants (`public/gallery/w480|w960`), image dimensions, placeholder
  colours, and `src/data/gallery.generated.ts` (471 products). Art & Craft product names were transcribed from the
  names printed on the photos; other products have no published names and are labelled “Collection — No. n”.
- 3D notebooks are wrapped in real BnB notebook cover photos (`public/textures`). Pens, pencils etc. are generic
  procedural models — no product GLB models exist.

## Structure

- `src/app` — routes (home, aboutus, brand, gallery, contact-us, privacy-policy, 404, sitemap, robots)
- `src/components/home` — hero, intro, pinned 3D showcase, collections, featured rail, why-BnB, brand story, marquee, CTA
- `src/components/three` — stationery models, hero scene, scroll-driven showcase scene, studio lighting
- `src/data` — site copy, brands, collections, generated gallery & privacy text

## Accessibility & performance notes

- `prefers-reduced-motion`: no WebGL, no smooth scrolling, static photo showcase, transforms disabled.
- No WebGL / data-saver: photo fallbacks. 3D is code-split and only mounted near the viewport; render loops pause off-screen.
- Fonts are self-hosted (no build-time network).
