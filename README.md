# ONESTEL · 科技实践笔记

**把新工具变成真实作品。** 一个面向个人创作者的科技独立站，记录 AI、数字工具与独立站建设的方法，帮助读者从了解工具走向完成具体任务。

[访问网站](https://yanyang-commits.github.io/cuddly-bassoon/) · [AI 工具导航](https://yanyang-commits.github.io/cuddly-bassoon/tools/) · [阅读文章](https://yanyang-commits.github.io/cuddly-bassoon/articles/) · [构建与部署记录](https://github.com/yanyang-commits/cuddly-bassoon/actions)

## 项目概览

ONESTEL 从一个可持续维护的小型网站开始：用原创文章积累方法，用工具导航提供行动入口，后续根据真实需求加入 AI 小工具。当前已部署到 GitHub Pages；ONESTEL 为项目品牌，尚未确认 `onestel.com` 的归属或配置。

- **内容站**：首页、文章列表、3 篇原创方法文章、关于页及 404 页面。
- **AI 工具导航**：73 个工具与平台、10 个分类，涵盖国内外常见创作与工作场景。
- **组合筛选**：关键词、用途分类、使用方式与“入门优先”可同时使用，支持无结果提示及重置。
- **静态优先**：文章正文和全部工具卡片在构建时生成；关闭 JavaScript 仍可阅读并访问工具官网。
- **发布基础**：独立页面标题、描述、canonical、Open Graph、站点地图与 robots.txt；静态资源带内容指纹参数。

当前没有站内 AI 调用、用户登录、数据库、实时新闻采集、邮件订阅提交或后台编辑。工具导航提供外部产品入口，不代表站内已经集成这些服务。

## 技术栈与运行方式

| 层级 | 当前方案 | 维护特点 |
| --- | --- | --- |
| 页面与交互 | 原生 HTML / CSS / JavaScript | 无前端框架和第三方前端脚本 |
| 构建 | Node.js 24、ES Modules | 使用 Node 内置模块生成静态页面 |
| 内容 | JSON 文件 | 文章与工具资料独立于页面模板 |
| 检查 | 自定义构建检查脚本 | 检查生成页面的站内链接和资源 |
| 部署 | GitHub Actions + GitHub Pages | main 分支更新后自动构建发布 |
| 后续 AI | 独立服务端 API，尚未实现 | 静态界面与模型服务分开维护 |

项目没有 npm 第三方依赖，无需运行 `npm install`。生成目录 `dist/` 不提交到 Git，由工作流重新构建。

## 本地启动

先安装 **Node.js 24 或以上版本**，再执行：

```bash
git clone https://github.com/yanyang-commits/cuddly-bassoon.git
cd cuddly-bassoon
npm run dev
```

打开 [本地预览](http://localhost:4321/cuddly-bassoon/)。预览服务只监听本机 `127.0.0.1:4321`，不用于生产服务。当前没有热更新；修改文件后按 `Ctrl+C` 停止服务，再运行 `npm run dev`。

| 命令 | 用途 |
| --- | --- |
| `npm run build` | 生成页面、静态资源、sitemap.xml、robots.txt 和 404 |
| `npm run check` | 检查已生成的站内链接和资源；先运行 build |
| `npm run dev` | 重新构建并启动本地预览 |

## 页面与信息架构

首页依次展示品牌导航、网站定位、内容方向、最新文章、工具导航入口和页脚。主要路径如下；在线地址统一前置 `/cuddly-bassoon`。

| 路径 | 页面内容 |
| --- | --- |
| `/` | 网站定位、内容方向与最新文章 |
| `/articles/` | 按标题、分类和摘要搜索文章 |
| `/articles/start-small/` | 独立站第一版：先给读者一条清楚的阅读路径 |
| `/articles/ai-workflow/` | 用 AI 整理笔记：从零散材料到可核验的文章提纲 |
| `/articles/choose-digital-tools/` | 挑选数字工具：先验证任务，再决定是否长期使用 |
| `/tools/` | AI 工具导航、组合筛选和任务选择建议 |
| `/about/` | 项目定位与内容原则 |
| `/404.html` | 错误地址提示与返回首页入口 |

## 目录说明

| 文件或目录 | 职责 |
| --- | --- |
| `site.config.json` | 站名、描述、网站来源地址与部署子路径 |
| `content/posts.json` | 文章列表与纯文字正文 |
| `content/tools.json` | 工具名称、用途、分类、标签、官方来源与核对日期 |
| `public/assets/style.css` | 全站样式及响应式布局 |
| `public/assets/search.js` | 文章列表搜索 |
| `public/assets/tools.js` | 工具导航组合筛选 |
| `scripts/build.mjs` | 页面模板、资源复制与静态构建 |
| `scripts/render-tools.mjs` | 工具数据校验与导航页面渲染 |
| `scripts/check.mjs` | 生成结果中的站内链接及资源检查 |
| `scripts/serve.mjs` | 本地预览服务器 |
| `.github/workflows/pages.yml` | PR 构建检查与 main 分支发布 |
| `docs/TOOL_SOURCES.md` | 工具官方资料与收录说明 |
| `docs/AI_INTEGRATION.md` | 未来 AI 接口与费用控制设计 |
| `docs/PROJECT_PLAN.md` | 初始 MVP 规划；当前进度与后续优先级以本 README 为准 |
| `.env.example` | 未来服务端密钥示意；静态站不会加载这些变量 |
| `dist/` | 自动生成的部署文件，已忽略提交 |

## 内容维护

### 添加文章

在 `content/posts.json` 数组中复制现有记录并修改。字段示例：

```json
{
  "slug": "my-first-ai-workflow",
  "title": "用一个真实任务验证 AI 工作流",
  "category": "AI 实践",
  "date": "2026-10-10",
  "summary": "交代读者将解决的问题，以及文章提供的方法。",
  "paragraphs": [
    "第一段说明任务、背景和约束。",
    "第二段记录方法、结果和仍需核验的信息。"
  ]
}
```

`slug` 使用唯一的小写英文、数字与连字符；日期使用 `YYYY-MM-DD`。`paragraphs` 是纯文字段落，构建器会转义 HTML，当前不解析 Markdown。正文要区分事实、判断和待核验信息，不把未执行的尝试写成实际经验。

### 维护 AI 工具导航

目前的分类与数量为：

| 分类 | 数量 | 分类 | 数量 |
| --- | ---: | --- | ---: |
| 通用助手 | 14 | 搜索与研究 | 5 |
| 编程与建站 | 10 | 图像与设计 | 7 |
| 视频与数字人 | 7 | 音频与音乐 | 4 |
| 办公与写作 | 8 | 会议与记录 | 2 |
| 智能体与自动化 | 7 | 开发平台与本地模型 | 9 |

在 `content/tools.json` 中添加或编辑记录，结构示例：

```json
{
  "name": "工具名称",
  "url": "https://example.com/",
  "category": "图像与设计",
  "description": "简洁说明工具的主要用途。",
  "task": "矢量图、品牌视觉与设计资产",
  "mode": "网页 / API",
  "tags": ["矢量", "图像", "品牌"],
  "featured": false,
  "verifiedAt": "2026-10-10",
  "sourceUrl": "https://example.com/"
}
```

这里的 `example.com` 是字段示意，正式收录时替换为确认过的 HTTPS 官方地址。名称保持唯一，分类优先沿用已有方向。`mode` 使用包含“网页”“API”“本地”或“自部署”的明确文字，以便筛选脚本识别；`featured` 为布尔值，表示编辑建议的“入门优先”。

收录前核对官网、产品名称和实际入口，更新 `verifiedAt`，并同步 [官方来源清单](docs/TOOL_SOURCES.md)。如增减条目，同步本 README 的总数与分类数量；页面数量和分类选项会从数据自动生成。页面展示的统一核对日期目前在 `scripts/render-tools.mjs` 中维护，整批复核时需一并更新。

最新一批官网资料核对日期为 **2026-10-10**。本目录覆盖代表性工具，不宣称穷尽所有优秀产品，也不等于逐项性能测试或排名。产品功能、价格、额度、许可与地区可用性以官方最新说明为准。

## 验证与发布

更新内容后运行：

```bash
npm run build
npm run check
```

再用本地浏览器检查页面：导航与文章链接、工具分类和关键词组合筛选、无结果提示、重置按钮，以及窄屏下的文字换行与横向溢出。自动检查只能验证部分结构与链接，不能代替视觉检查，也不会核验外部官网是否仍可访问。

有仓库写入权限时，可以提交到 main：

```bash
git add README.md content/posts.json content/tools.json
git commit -m "Update ONESTEL content and documentation"
git push origin main
```

根据实际修改选择提交文件。多人协作时建议新建分支并发起 Pull Request；远端有新提交时先合并，避免强推覆盖。

当前 Pages 已配置为 **GitHub Actions**：

1. Pull Request 到 main：运行构建与链接检查，不发布。
2. 推送到 main：构建、检查、上传 `dist/` 并发布到 Pages。
3. 需要重新发布时，在 Actions 中手动运行 `Build and deploy Pages` 工作流。

如复制到其他仓库，先在 Settings → Pages 中选择 GitHub Actions，并调整 `site.config.json` 的地址和子路径。

### 更换域名或部署路径

当前配置为：

```json
{
  "name": "ONESTEL",
  "description": "科技、AI 与独立站的实践笔记。把新工具变成真实作品。",
  "url": "https://yanyang-commits.github.io",
  "basePath": "/cuddly-bassoon"
}
```

`url` 是网站来源地址，不包含部署子路径；`basePath` 是仓库站点的路径。迁移到自有域名根目录时，将 `url` 改为实际 HTTPS 域名，将 `basePath` 设为 `""`，再构建发布。DNS、Pages 自定义域名与 HTTPS 需要单独配置；本仓库没有默认添加 `CNAME`。

## 后续迭代顺序

| 优先级 | 工作 | 完成标准 |
| --- | --- | --- |
| 1 | 持续发布原创实践笔记、复核工具资料 | 每篇回答具体问题；入口、名称与核对日期可追溯 |
| 2 | 完善手机视觉验证、键盘操作与阅读体验 | 导航和筛选易操作，文字可读，页面无横向溢出 |
| 3 | 增加 RSS、标签页与分享信息 | 读者能订阅更新并找到同主题文章 |
| 4 | 接入“笔记 → 文章提纲”AI 小工具 | 空输入、成功、超时和额度耗尽都有明确反馈 |
| 5 | 验证订阅与商业化需求 | 有真实使用反馈后再接入邮件服务、账户或数据库 |

若内容规模、多人编辑或模板复杂度显著增长，再评估 Astro + Markdown 等内容框架；不为迁移本身增加维护负担。

### AI 接入原则

GitHub Pages 只托管静态文件，模型调用需要独立服务端。未来接口设计见 [AI 接入方案](docs/AI_INTEGRATION.md)：密钥仅保存在服务端；设置请求长度、超时、限流和费用上限；前端清楚标注输出需要核验。不要把密钥写入 JSON、前端脚本、配置文件或 Git，也不要直接插入未经处理的模型 HTML。

## 常见问题

**为什么修改后没有变化？** 本地需要重新运行 `npm run dev`；线上查看 Actions 是否成功部署，再刷新页面。资源内容指纹有助于加载新版本，但部署完成前页面仍可能显示旧内容。

**为什么运行 check 报文件不存在？** 先执行 `npm run build`，检查脚本读取的是 `dist/`。

**为什么首页或样式出现 404？** 核对 `url`、`basePath` 与实际部署地址是否一致；仓库 Pages 使用 `/cuddly-bassoon/`，不是域名根目录。

**可以在正文里写 Markdown 或 HTML 吗？** 当前正文只支持纯文字段落。需要图片、代码块或复杂排版时，应先扩展内容结构和构建模板。

**站点会保存工具搜索记录吗？** 当前筛选只在浏览器完成，站点不保存搜索记录，也没有站内分析统计。访问外部工具官网后，其服务政策独立适用。

## 参与维护与许可

欢迎通过 Issue 反馈失效工具入口、页面问题或内容建议。新增工具请附官方地址、适合任务、分类与核对日期；提交 PR 前运行构建和检查。避免把未发布的账号资料或密钥提交到仓库。

仓库目前**未附开源许可证**。公开可见不等于授予任意复制、修改或分发许可；后续决定开放复用时，再明确代码与文章内容各自的授权范围。

## 参考文档

- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Node.js 下载](https://nodejs.org/en/download)
- [工具官方来源清单](docs/TOOL_SOURCES.md)
- [AI 接入方案](docs/AI_INTEGRATION.md)
- [初始 MVP 规划](docs/PROJECT_PLAN.md)
