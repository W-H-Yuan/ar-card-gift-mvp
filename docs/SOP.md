# 可复用制作 SOP：AR 卡片礼物

目标：做一次之后，再换一版卡片礼物只改素材和配置，不改逻辑代码。

## 1. 复制模板

复制 `site/` 到新的卡片礼物目录（或复制本部署仓），保留 `config.js` 结构。

## 2. 换素材

按同名替换：

- `assets/ticket.png`：卡片设计图（清晰、对比强、建议 >1000px）
- `assets/blessing.mp4`：祝福视频（建议 1080p 以内、30s 内、<30MB）
- `assets/copy.txt`：文案（姓名 / 日期 / 祝福语）

## 3. 生成 MindAR 目标文件

在源工作区 `F:\管家\工作区\AR卡片礼物\tools\compile` 下：

```
npm.cmd run compile -- "F:\管家\工作区\AR卡片礼物\assets\ticket.png" "F:\管家\工作区\AR卡片礼物\assets\targets.mind"
```

或直接：

```
node compile-target.js "path\to\ticket.png" "path\to\targets.mind"
```

`tools/compile` 已包含本地离线依赖（`node_modules`），不依赖原生 canvas。

## 4. 改配置

在 `config.js` 修改：

- `cardName` / `copy`：封面与文案
- `show3D` / `showVideo` / `enablePassword`：功能开关
- `videoSrc` / `targetSrc`：若素材文件换了路径
- `password`：启用口令时填写

## 5. 本地预览

双击源工作区根目录的 `启动预览.bat`（若尚未生成，可手动运行 `node site/serve-site.js`），在电脑浏览器打开 `http://localhost:8091/`。

注意：仅 `localhost` 能开摄像头，手机真机必须走 HTTPS。

## 6. 部署

把 `index.html`、`config.js`、`app.js`、`style.css`、`assets/`、`docs/` 推到 GitHub Pages 或其他静态托管，刷新 HTTPS 网址。

## 7. 出二维码与说明

网址不变：旧二维码继续有效，无需重印。网址变了：重新生成二维码并贴在卡片背面角落。

## 8. 真机抽检

iOS + Android 各扫一次（微信 / 浏览器各一项），把结果写进 `docs/测试记录.md`。
