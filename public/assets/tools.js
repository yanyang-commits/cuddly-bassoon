const search=document.querySelector('#tool-search');
if(search){
 const category=document.querySelector('#tool-category'),mode=document.querySelector('#tool-mode'),featured=document.querySelector('#tool-featured'),savedOnly=document.querySelector('#tool-saved');
 const cards=[...document.querySelectorAll('[data-tool]')],groups=[...document.querySelectorAll('[data-tool-group]')],shortcuts=[...document.querySelectorAll('[data-category-shortcut]')];
 const status=document.querySelector('#tool-status'),empty=document.querySelector('#tool-empty'),saveStatus=document.querySelector('#tool-save-status');
 const storageKey='onestel-tools-v1';let saved=new Set();
 try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(value))saved=new Set(value.filter(x=>typeof x==='string'));}catch{saveStatus.textContent='浏览器存储不可用，收藏仅在本次页面有效。';}
 const params=new URLSearchParams(location.search);
 if([...category.options].some(o=>o.value===params.get('category')))category.value=params.get('category');
 search.value=(params.get('q')||'').slice(0,200);
 if(['all','网页','API','本地'].includes(params.get('mode')))mode.value=params.get('mode');
 featured.checked=params.get('featured')==='1';savedOnly.checked=params.get('saved')==='1';
 function updateSaved(){for(const button of document.querySelectorAll('[data-save]')){const active=saved.has(button.dataset.save);button.setAttribute('aria-pressed',String(active));button.textContent=active?'已收藏':'收藏';}}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify([...saved]));saveStatus.textContent=`已保存 ${saved.size} 个工具收藏。`;}catch{saveStatus.textContent='浏览器无法保存收藏；本次页面仍可使用，刷新后不会保留。';}}
 function filter(sync=true){
  const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let visible=0;
  for(const card of cards){const matchMode=mode.value==='all'||(mode.value==='本地'?/本地|自部署/.test(card.dataset.mode):card.dataset.mode.includes(mode.value));const match=terms.every(t=>card.dataset.search.toLocaleLowerCase().includes(t))&&(category.value==='all'||card.dataset.category===category.value)&&matchMode&&(!featured.checked||card.dataset.featured==='yes')&&(!savedOnly.checked||saved.has(card.dataset.name));card.hidden=!match;if(match)visible++;}
  for(const group of groups)group.hidden=![...group.querySelectorAll('[data-tool]')].some(card=>!card.hidden);
  for(const button of shortcuts)button.setAttribute('aria-pressed',String(button.dataset.categoryShortcut===category.value));
  status.textContent=`显示 ${visible} / ${cards.length} 个工具`;empty.hidden=visible!==0;
  if(sync){const next=new URL(location.href);next.search='';if(search.value.trim())next.searchParams.set('q',search.value.trim());if(category.value!=='all')next.searchParams.set('category',category.value);if(mode.value!=='all')next.searchParams.set('mode',mode.value);if(featured.checked)next.searchParams.set('featured','1');if(savedOnly.checked)next.searchParams.set('saved','1');try{history.replaceState(null,'',next);}catch{}}
 }
 search.addEventListener('input',()=>filter());for(const el of [category,mode,featured,savedOnly])el.addEventListener('change',()=>filter());
 for(const button of shortcuts)button.addEventListener('click',()=>{category.value=category.value===button.dataset.categoryShortcut?'all':button.dataset.categoryShortcut;filter();document.querySelector('.tool-controls').scrollIntoView({block:'start'});});
 for(const button of document.querySelectorAll('[data-save]'))button.addEventListener('click',()=>{const name=button.dataset.save;saved.has(name)?saved.delete(name):saved.add(name);persist();updateSaved();filter();});
 document.querySelector('#tool-clear-saved').addEventListener('click',()=>{saved.clear();persist();updateSaved();filter();});
 document.querySelector('#tool-reset').addEventListener('click',()=>{search.value='';category.value='all';mode.value='all';featured.checked=false;savedOnly.checked=false;filter();search.focus();});
 addEventListener('pageshow',()=>filter(false));updateSaved();filter(false);
}
