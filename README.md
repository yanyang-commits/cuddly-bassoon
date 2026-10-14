# ONESTEL · 科技实践与 AI 工具导航

**把模糊想法变成可执行任务，再用合适的工具做出作品。**

[访问网站](https://yanyang-commits.github.io/onestel/) · [高质量提问](https://yanyang-commits.github.io/onestel/prompt/) · [AI 工具导航](https://yanyang-commits.github.io/onestel/tools/) · [实践笔记](https://yanyang-commits.github.io/onestel/articles/) · [反馈与建议](https://github.com/yanyang-commits/onestel/issues)

网站与仓库均公开，浏览网站无需登录。提交 GitHub Issue 需要 GitHub 账号。

## 当前版本 v0.3.0

正式首页、提问工作台、77 个工具与平台、10 个工具分类、4 篇实践文章、关于、使用指南、隐私说明和 404 页面。ONESTEL 的开放式 O 与橙色箭头标识同步用于页头及浏览器图标。

工具支持关键词、分类、使用方式、入门优先和收藏筛选；筛选条件保留在 URL 中，收藏保存在当前浏览器。提问工作台支持六类任务，生成后可编辑、复制、下载 TXT。当前按本地框架组合指令，没有模型调用，不上传或自动保存提问输入。

## 简单运行与维护

Node.js 24 + 原生 HTML/CSS/JavaScript，无生产第三方依赖。

```sh
git clone https://github.com/yanyang-commits/onestel.git
cd onestel
npm run build
npm run check
npm run release-check
npm run dev
```

本地地址为 `http://localhost:4321/onestel/`。文章在 `content/posts.json`，工具在 `content/tools.json`，模板在 `scripts/`，样式和交互在 `public/assets/`。不要直接修改自动生成的 `dist/`。

## 自动发布

GitHub Actions 在 main 更新时构建并发布到 GitHub Pages；PR 只构建验证。GitHub 的 Settings → Pages 应保持 GitHub Actions。

```json
{"url":"https://yanyang-commits.github.io","basePath":"/onestel","private":false}
```

这些配置位于 `site.config.json`。自有域名尚未绑定；品牌名称不表示已拥有 onestel.com。

## 验证与适配

构建、站内链接及核心交互逻辑检查通过。检查覆盖六类提问、工具筛选与空结果、收藏与清除、存储受限反馈、菜单开关、锚点和缓存版本。事件测试使用 DOM 适配器，不能替代浏览器测试。2026-10-14 已完成公开线上桌面验证：新 logo 和首页正常显示，77 个工具搜索与收藏筛选、提问示例生成与复制通过，反馈入口可打开。

窄屏采用单列、可折叠菜单、44px 触控按钮和 16px 表单文字。真实手机尺寸视觉验证尚未完成。

工具入口于 2026-10-13 核对：74 个可确认，Luma、可灵和 WPS AI 因抓取限制或超时标注待复核。第三方登录、收费与地区可用性以对应官网为准。

## 数据与以后接入 AI

工具收藏在浏览器 localStorage 中，不跨设备同步。提问输入不会上传，下载或复制后由用户自行管理。没有第三方分析或广告脚本；托管平台可能处理必要的访问记录。

未来模型调用通过独立服务端接口实现，密钥只放在服务端，并设置输入限制、超时、限流与费用上限。当前不提供虚假的 AI 调用按钮。详情见 [AI 接入设计](docs/AI_INTEGRATION.md)。

## 反馈

[提交问题与建议](https://github.com/yanyang-commits/onestel/issues)。请附页面地址、复现步骤和预期结果；失效工具请附工具名称与官方来源。不要提交账号密钥或私人材料。

公开可见不等于授予任意复制、修改与分发许可；当前仓库尚未添加开源许可证。
