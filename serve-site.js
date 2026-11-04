// 本地预览服务器：手机需 HTTPS 才能开摄像头，但 localhost 可用于桌面预览
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = 8091;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".mind": "application/octet-stream",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/" || urlPath === "/index.html") {
    res.writeHead(302, { Location: "/site/" });
    res.end();
    return;
  }
  if (urlPath === "/site") {
    res.writeHead(302, { Location: "/site/" });
    res.end();
    return;
  }
  if (urlPath === "/site/") urlPath = "/site/index.html";
  const file = path.join(root, urlPath);
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log("site preview: http://127.0.0.1:" + port + "/"));
