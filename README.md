# ONESTEL · 科技实践笔记

为 `yanyang-commits/cuddly-bassoon` 准备的独立站 MVP。品牌是暂定名，不表示域名已注册。

## 定位
面向希望把科技和 AI 用进创作与工作的个人，发布实践笔记、工具入口和后续小实验。先积累内容与作品，再验证商业化方向。

## 技术栈
原生 HTML/CSS/JavaScript；Node.js 24 静态生成；JSON 内容；GitHub Actions + GitHub Pages。没有 npm 第三方依赖、数据库或登录系统。所有文章生成独立 HTML，不依赖客户端 JavaScript 渲染正文。无需 npm install，也无需 package-lock.json。

## 开始
安装 Node.js 24，然后在项目根目录运行：

```bash
npm run build
npm run check
npm run dev
```
打开 http://localhost:4321/cuddly-bassoon/ 。修改内容后停止服务并重新运行 npm run dev；当前不提供热更新。

## 目录
- `site.config.json`：站名、描述、正式地址和部署子路径。
- `content/posts.json`：文章，正文 paragraphs 是纯文字段落。
- `content/tools.json`：工具导航数据。
- `public/assets/`：共享样式和文章筛选交互。
- `scripts/build.mjs`：生成页面、站点地图、robots.txt 和 404。
- `scripts/check.mjs`：检查构建后的站内链接与资源。
- `scripts/serve.mjs`：仅本地预览服务器。
- `.github/workflows/pages.yml`：PR 构建检查和 main 分支部署。
- `docs/PROJECT_PLAN.md`：信息架构与迭代计划。
- `docs/AI_INTEGRATION.md`：未来 AI 服务端接口设计。
- `dist/`：生成结果，不提交到 Git。

## 修改内容
复制 posts.json 中的一条记录；slug 使用唯一的小写英文和连字符；date 使用 YYYY-MM-DD；paragraphs 填正文段落。构建器会转义正文中的 HTML，不支持 Markdown 或任意 HTML。当前已有三篇正式编辑的原创方法文章。修改 tools.json 可增减工具卡片。

## 提交到目标空仓库
本包没有 Git 元数据。解压后进入项目根目录执行：

```bash
git init -b main
git add .
git commit -m "Initialize ONESTEL static site MVP"
git remote add origin https://github.com/yanyang-commits/cuddly-bassoon.git
git push -u origin main
```

需要你的 GitHub 写入权限。若远端已有新提交，先拉取并合并，不要强推覆盖。

## GitHub Pages
在仓库 Settings → Pages → Build and deployment，将 Source 设为 GitHub Actions，再触发工作流。仓库可见性和账户方案须支持 Pages；如果界面没有该选项，先检查权限与可用性。
预期地址是 https://yanyang-commits.github.io/cuddly-bassoon/ ，站点已上线；main 分支更新会自动构建并发布。
换域名时同时修改 config.url（域名，不带子路径）和 config.basePath（独立域名设为空字符串），再重建；域名 DNS 与 Pages 自定义域名也需单独配置。不默认添加 CNAME，onestel.com 尚未确认归属。

## 当前功能与边界
首页、文章列表、三篇详情、工具导航、关于页和 404。列表筛选在浏览器完成。无在线 AI、订阅提交、实时新闻和后台编辑。部署工作流已在目标仓库通过。预览服务器不能充当生产 API 服务。

## 官方参考
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://nodejs.org/en/download
- https://platform.openai.com/docs

暂不附开源许可证；公开仓库不自动赋予他人任意复用许可。决定开源时再选择许可证。

## AI 工具导航
当前收录 73 个工具与平台、10 个使用方向。支持关键词、分类、使用方式、入门优先联合筛选与重置；关闭 JavaScript 仍可浏览全部工具。每条含名称、官方入口、用途、任务、标签与核对日期。`scripts/render-tools.mjs` 渲染导航，`public/assets/tools.js` 负责筛选。内容维护时核对官网并更新 verifiedAt。页面不保存用户搜索，不依赖外部字体、图片或第三方前端脚本。资源带内容指纹参数，以便更新后加载新样式。
