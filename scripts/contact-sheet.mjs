import sharp from "sharp"; import fs from "node:fs";
const [dir, out, cols = 6, cell = 220, filter = ""] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => /\.(webp|png|jpe?g)$/.test(f) && f.includes(filter)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const C = +cols, S = +cell, rows = Math.ceil(files.length / C);
const comps = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(`${dir}/${f}`).resize(S, S - 20, { fit: "contain", background: "#ddd" }).flatten({background:"#ddd"}).toBuffer();
  const label = Buffer.from(`<svg width="${S}" height="20"><rect width="100%" height="100%" fill="#222"/><text x="4" y="15" font-size="13" fill="#fff" font-family="sans-serif">${f}</text></svg>`);
  return [{ input: img, left: (i % C) * S, top: Math.floor(i / C) * S }, { input: label, left: (i % C) * S, top: Math.floor(i / C) * S + S - 20 }];
}));
await sharp({ create: { width: C * S, height: rows * S, channels: 3, background: "#fff" } }).composite(comps.flat()).jpeg({ quality: 70 }).toFile(out);
console.log(out, files.length);
