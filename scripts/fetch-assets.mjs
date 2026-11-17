// One-off: mirrors genuine assets from the existing bnbgroup.org site into /public.
import fs from "node:fs/promises";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const BASE = "https://bnbgroup.org";
const bundle = await fs.readFile(path.join(ROOT, "scripts/.old-bundle.js"), "utf8");
const gallery = JSON.parse(await fs.readFile(path.join(ROOT, "scripts/source-gallery.json"), "utf8"));

const jobs = [];
for (const m of new Set(bundle.match(/\/assets\/[^"]+\.(?:webp|png|jpe?g|mp4)/g))) {
  const file = decodeURIComponent(m.split("/").pop()).replace(/-[A-Za-z0-9_-]{8}\./, ".").replace(/\s+/g, "-").toLowerCase();
  jobs.push([BASE + m, path.join(ROOT, "public/brand-assets", file)]);
}
for (const tab of gallery.tabs) for (const img of tab.images)
  jobs.push([BASE + img.url, path.join(ROOT, "public/gallery", img.url.split("/").pop().toLowerCase())]);

let ok = 0, fail = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const [url, dest] = queue.shift();
    try {
      await fs.access(dest); ok++; continue;
    } catch {}
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
    } catch (e) { fail.push(url + " " + e.message); }
  }
}));
console.log("ok", ok, "fail", fail.length); fail.forEach(f => console.log(f));
