# ar-card-gift-mvp

占位素材链路：扫码 -> 普通 HTTPS 网页 -> 摄像头 AR。换真素材只改 `assets/` 同名文件与 `config.js`；二维码不变（只要网址不变）。

部署目录说明：
- `index.html` / `config.js` / `app.js` / `style.css`：静态站点（A-Frame + MindAR 通过 CDN 加载）
- `assets/`：门票图、祝福视频、文案、MindAR 目标文件
- `docs/`：使用说明与测试记录

源工作区（含生成 `.mind` 的编译工具）：`F:\管家\工作区\AR卡片礼物\`
