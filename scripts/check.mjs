import {readdir,readFile,access} from 'node:fs/promises';import path from 'node:path';
const config=JSON.parse(await readFile('site.config.json','utf8'));const base=config.basePath.replace(/\/$/,'');
async function walk(dir){let result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);result.push(...(e.isDirectory()?await walk(p):[p]));}return result;}
let checked=0;for(const file of await walk('dist')){if(!file.endsWith('.html'))continue;const html=await readFile(file,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){let u=m[1];if(u.startsWith('http')||u.startsWith('#'))continue;if(base&&!u.startsWith(base+'/'))throw Error(`Wrong base path: ${u}`);u=u.slice(base.length);let dest=path.join('dist',u);if(u.endsWith('/'))dest=path.join(dest,'index.html');await access(dest);checked++;}}
console.log(`Verified ${checked} local links and assets`);
