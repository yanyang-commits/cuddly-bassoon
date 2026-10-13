import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {buildPrompt} from '../public/assets/prompt-core.js';
import vm from 'node:vm';
const tools=JSON.parse(await readFile('content/tools.json','utf8'));
const categories=[...new Set(tools.map(t=>t.category))];
assert.equal(tools.length,77);assert.equal(categories.length,10);
for(const t of tools){assert.equal(new URL(t.url).protocol,'https:');assert.equal(new URL(t.sourceUrl).protocol,'https:');}
assert.throws(()=>buildPrompt({idea:'  '}));
for(const scenario of ['项目探索','学习新知识','职业判断','创作与写作','方案比较','执行与复盘']){
 const result=buildPrompt({idea:'测试任务',scenario,goal:'交付一页方案',context:'用户提供材料',limits:'一个小时',format:'清单'});
 for(const part of ['测试任务',scenario,'交付一页方案','用户提供材料','一个小时','清单','验收'])assert.ok(result.text.includes(part));
}
assert.ok(buildPrompt({idea:'创建网站'}).text.includes('待确认'));
// Exercise the actual filtering and favorite event handlers using a DOM adapter.
class El{constructor(dataset={}){this.dataset=dataset;this.value='';this.checked=false;this.hidden=false;this.textContent='';this.handlers={};this.attrs={};}addEventListener(n,f){this.handlers[n]=f}setAttribute(k,v){this.attrs[k]=v}focus(){}scrollIntoView(){}fire(n){return this.handlers[n]?.({preventDefault(){}})}}
const cards=tools.map(t=>new El({name:t.name,category:t.category,mode:t.mode,featured:t.featured?'yes':'no',search:[t.name,t.description,t.task,t.category,t.mode,...t.tags].join(' ')}));
const groups=categories.map(category=>{const e=new El();e.querySelectorAll=()=>cards.filter(c=>c.dataset.category===category);return e});
const saves=tools.map(t=>new El({save:t.name}));const shortcuts=categories.map(c=>new El({categoryShortcut:c}));
function setup(initial='',brokenStorage=false){
 const nodes=Object.fromEntries(['tool-search','tool-category','tool-mode','tool-featured','tool-saved','tool-status','tool-empty','tool-save-status','tool-reset','tool-clear-saved'].map(n=>['#'+n,new El()]));
 nodes['#tool-category'].value='all';nodes['#tool-category'].options=['all',...categories].map(value=>({value}));nodes['#tool-mode'].value='all';
 const data={};const doc={querySelector:s=>s==='.tool-controls'?new El():nodes[s],querySelectorAll:s=>({'[data-tool]':cards,'[data-tool-group]':groups,'[data-category-shortcut]':shortcuts,'[data-save]':saves}[s]||[])};
 const ctx={document:doc,location:{href:'https://test.local/tools/'+initial,search:initial},URL,URLSearchParams,history:{replaceState(){}},localStorage:{getItem(){if(brokenStorage)throw Error('blocked');return null},setItem(k,v){if(brokenStorage)throw Error('blocked');data[k]=v}},addEventListener(){}};
 vm.runInNewContext(awaitSource,ctx);return {nodes,data};
}
const awaitSource=await readFile('public/assets/tools.js','utf8');
let {nodes,data}=setup('?category='+encodeURIComponent('图像与设计'));
assert.equal(cards.filter(c=>!c.hidden).length,tools.filter(t=>t.category==='图像与设计').length);
nodes['#tool-reset'].fire('click');assert.equal(cards.filter(c=>!c.hidden).length,77);
nodes['#tool-search'].value='这个关键词不可能存在';nodes['#tool-search'].fire('input');assert.equal(cards.filter(c=>!c.hidden).length,0);assert.equal(nodes['#tool-empty'].hidden,false);
nodes['#tool-reset'].fire('click');saves[0].fire('click');nodes['#tool-saved'].checked=true;nodes['#tool-saved'].fire('change');assert.equal(cards.filter(c=>!c.hidden).length,1);assert.ok(data['onestel-tools-v1'].includes('ChatGPT'));
nodes['#tool-clear-saved'].fire('click');assert.equal(cards.filter(c=>!c.hidden).length,0);
nodes['#tool-reset'].fire('click');nodes['#tool-mode'].value='本地';nodes['#tool-mode'].fire('change');assert.ok(cards.filter(c=>!c.hidden).every(c=>/本地|自部署/.test(c.dataset.mode)));
({nodes}=setup('',true));saves[0].fire('click');assert.ok(nodes['#tool-save-status'].textContent.includes('无法保存'));
const toggle=new El(),nav=new El();toggle.hidden=true;nav.classList={toggle(k,v){nav.open=v},remove(){nav.open=false}};toggle.getAttribute=k=>toggle.attrs[k];let keydown;
vm.runInNewContext(await readFile('public/assets/site.js','utf8'),{document:{querySelector:s=>s==='#nav-toggle'?toggle:nav,addEventListener(n,f){keydown=f}}});toggle.fire('click');assert.equal(toggle.attrs['aria-expanded'],'true');keydown({key:'Escape'});assert.equal(toggle.attrs['aria-expanded'],'false');
async function walk(p){let result=[];for(const e of await readdir(p,{withFileTypes:true})){const f=p+'/'+e.name;result.push(...(e.isDirectory()?await walk(f):[f]));}return result}
const config=JSON.parse(await readFile('site.config.json','utf8'));let pages=0;for(const f of await walk('dist'))if(f.endsWith('.html')){const html=await readFile(f,'utf8');assert.equal(html.includes('noindex, nofollow'),!!config.private);if(!config.private)assert.ok(html.includes('rel="canonical"'));assert.ok(!html.includes('onestel.invalid'));assert.ok(!html.includes('v=undefined'));const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(match[1]));pages++;}
assert.ok((await readFile('dist/robots.txt','utf8')).includes(config.private?'Disallow: /':'Allow: /'));
console.log(`Release checks passed: ${pages} HTML pages, 77 tools, 10 categories, six prompt scenarios, filtering, favorites, storage failure, menu, metadata and anchors. Browser rendering remains unverified.`);
