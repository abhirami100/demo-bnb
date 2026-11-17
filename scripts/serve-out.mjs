// Minimal static server for previewing the `out/` export locally (mimics nginx try_files $uri $uri/ ...).
// Also stubs POST /mailserver/server.php so the contact form can be exercised without the PHP host.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || "out");
const PORT = Number(process.argv[3] || 3300);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain" };

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/mailserver/server.php" && req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        console.log("[mail stub]", body);
        res.writeHead(200, { "content-type": "text/plain" }).end("ok");
      });
      return;
    }
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) file = path.join(ROOT, "404.html");
    const ext = path.extname(file);
    res.writeHead(file.endsWith("404.html") && !url.endsWith("404.html") ? 404 : 200, {
      "content-type": TYPES[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
