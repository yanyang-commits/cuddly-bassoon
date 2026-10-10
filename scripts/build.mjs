import {renderPrompt} from './render-prompt.mjs';
import {renderTools} from './render-tools.mjs';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile,rm,cp} from 'node:fs/promises';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const config=await read('site.config.json');
const posts=await read('content/posts.json');
const tools=await read('content/tools.json');
const versions={};for(const file of ['style.css','search.js','tools.js','prompt.js','prompt-core.js']){versions[file]=createHash('sha256').update(await readFile('public/assets/'+file)).digest('hex').slice(0,10);}

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=config.basePath.replace(/\/$/,'');
if(base && !/^\/[a-zA-Z0-9/_-]+$/.test(base))throw Error('Invalid basePath');
const origin=new URL(config.url);if(!['https:','http:'].includes(origin.protocol))throw Error('Invalid site URL');
const link=p=>`${base}/${p}`;
const canonical=p=>`${config.url.replace(/\/$/,'')}${link(p)}`;
const slugs=new Set();for(const post of posts){if(!/^[a-z0-9-]+$/.test(post.slug)||slugs.has(post.slug))throw Error('Invalid or duplicate slug');slugs.add(post.slug);if(!Array.isArray(post.paragraphs)||!post.title||!post.summary||!/^\d{4}-\d{2}-\d{2}$/.test(post.date))throw Error('Invalid article');}
const nav=[['','首页'],['prompt/','高质量提问'],['articles/','文章'],['tools/','工具'],['about/','关于']];
function layout(title,body,path='',description=config.description){return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · ${esc(config.name)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical(path))}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical(path))}"><meta property="og:type" content="website"><link rel="stylesheet" href="${link('assets/style.css')}?v=${versions['style.css']}"></head><body><a class="skip" href="#main">跳到正文</a><header><div class="wrap"><a class="brand" href="${link('')}">${esc(config.name)}</a><nav aria-label="主导航">${nav.map(([p,label])=>`<a href="${link(p)}" ${p===path?'aria-current="page"':''}>${label}</a>`).join('')}</nav></div></header><main id="main" class="wrap">${body}</main><footer><div class="wrap">${esc(config.name)} / 科技实践笔记 · 独立探索，持续记录。<br>把问题写清楚，把方法用起来。</div></footer><script src="${link('assets/search.js')}?v=${versions['search.js']}" defer></script>${path==='tools/'?`<script src="${link('assets/tools.js')}?v=${versions['tools.js','prompt.js','prompt-core.js']}" defer></script>`:''}${path==='prompt/'?`<script type="module" src="${link('assets/prompt.js')}?v=${versions['prompt.js']}"></script>`:''}</body></html>`;}
const card=p=>`<article class="card" data-search="${esc(p.title+' '+p.category+' '+p.summary)}"><div class="meta">${esc(p.category)} · <time datetime="${p.date}">${p.date}</time></div><h3><a href="${link('articles/'+p.slug+'/')}">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p></article>`;
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
await writeFile('dist/assets/prompt.js',(await readFile('public/assets/prompt.js','utf8')).replace("'./prompt-core.js'","'./prompt-core.js?v="+versions['prompt-core.js']+"'"));
const pages=new Map();
pages.set('prompt/',layout('高质量提问 · AI 任务指令生成器',renderPrompt(),'prompt/','输入模糊想法，生成包含目标、背景、约束、反例、验收标准和下一步行动的 AI 任务指令。'));
pages.set('',layout('把模糊想法变成可执行任务',`<div class="eyebrow">ONESTEL / FROM IDEA TO ACTION</div><h1>把想法说清楚，<br>让项目做下去。</h1><p class="lead">不知道怎么向 AI 描述任务？从一句模糊想法开始，生成有目标、有约束、能验收的任务指令。</p><div class="home-actions"><a class="button" href="${link('prompt/')}">开始高质量提问 →</a><a href="${link('tools/')}">选择 AI 工具 ↗</a></div><h2>从模糊问题到明确行动</h2><div class="grid"><div class="card"><h3>01 / 描述想法</h3><p>写下你想完成的事，按需补充背景与条件。</p></div><div class="card"><h3>02 / 生成指令</h3><p>把目标、证据、约束与验收标准交代清楚，不编造未知条件。</p></div><div class="card"><h3>03 / 推进项目</h3><p>让 AI 比较方案、挑战假设，给出最小下一步与检查方法。</p></div></div><h2>实践笔记</h2><div class="grid">${posts.map(card).join('')}</div><h2>找到适合任务的 AI</h2><p>工具导航收录 ${tools.length} 个工具与平台。先说清楚要做什么，再选择合适的入口。</p><a href="${link('tools/')}">打开工具导航 →</a>`));
pages.set('articles/',layout('实践笔记',`<div class="eyebrow">THE JOURNAL</div><h1>实践笔记</h1><p class="lead">把问题、过程与结论留在这里。</p><label for="search">搜索标题、分类或摘要</label><br><input id="search" type="search" placeholder="试试：AI、独立站"><p id="search-status" role="status">共 ${posts.length} 篇文章</p><div class="grid">${posts.map(card).join('')}</div>`,'articles/'));
for(const p of posts){const route=`articles/${p.slug}/`;pages.set(route,layout(p.title,`<article class="article"><a href="${link('articles/')}">← 全部文章</a><p class="meta">${esc(p.category)} · <time datetime="${p.date}">${p.date}</time></p><h1>${esc(p.title)}</h1><p class="lead">${esc(p.summary)}</p>${p.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</article>`,route,p.summary));}
pages.set('tools/',layout('AI 工具导航',renderTools(tools,esc),'tools/','精选 AI 工具与开发平台，按用途搜索和筛选通用助手、研究、编程、设计、视频、办公和自动化工具。'));
pages.set('about/',layout('关于',`<div class="eyebrow">ABOUT THE PROJECT</div><h1>持续探索，<br>慢慢做出作品。</h1><p class="lead">ONESTEL 帮助人们把模糊想法整理成可执行任务。高质量提问是核心入口，工具导航与实践笔记提供后续支持。</p><h2>为什么做这个站</h2><p>用文章和小实验积累可展示的作品，把零散的学习连接成长期项目。</p><h2>如何更新</h2><p>围绕具体问题整理方法、选择与结果。通用方法与实际记录会清楚区分；工具和技术信息以对应的官方资料为核对入口。</p><h2>当前阶段</h2><p>你可以在高质量提问工作台生成、编辑和复制 AI 任务指令，再选择工具推进项目。指令在浏览器内按框架组合，不调用模型，也不上传输入。</p>`,'about/'));
for(const [route,html]of pages){await mkdir('dist/'+route,{recursive:true});await writeFile('dist/'+route+'index.html',html);}
await writeFile('dist/404.html',layout('页面不存在',`<h1>这一页还不存在。</h1><p>请检查地址，或回到首页继续探索。</p><a class="button" href="${link('')}">返回首页</a>`,'404.html'));
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.keys()].map(p=>`<url><loc>${esc(canonical(p))}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${canonical('sitemap.xml')}\n`);await writeFile('dist/.nojekyll','');
console.log(`Built ${pages.size} pages + 404`);
