const search=document.querySelector('#tool-search');
if(search){
 const category=document.querySelector('#tool-category');
 const mode=document.querySelector('#tool-mode');
 const featured=document.querySelector('#tool-featured');
 const cards=[...document.querySelectorAll('[data-tool]')];
 const status=document.querySelector('#tool-status');
 const empty=document.querySelector('#tool-empty');
 function filter(){const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let visible=0;for(const card of cards){const matchMode=mode.value==='all'||(mode.value==='本地'?/本地|自部署/.test(card.dataset.mode):card.dataset.mode.includes(mode.value));const match=terms.every(t=>card.dataset.search.toLocaleLowerCase().includes(t))&&(category.value==='all'||card.dataset.category===category.value)&&matchMode&&(!featured.checked||card.dataset.featured==='yes');card.hidden=!match;if(match)visible++;}status.textContent=`显示 ${visible} / ${cards.length} 个工具`;empty.hidden=visible!==0;}
 search.addEventListener('input',filter);for(const el of [category,mode,featured])el.addEventListener('change',filter);
 document.querySelector('#tool-reset').addEventListener('click',()=>{search.value='';category.value='all';mode.value='all';featured.checked=false;filter();search.focus();});
 filter();
}
