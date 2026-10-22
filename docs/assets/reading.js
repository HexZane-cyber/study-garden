(() => {
  'use strict';
  const title=document.querySelector('.md-content h1');if(!title)return;
  const script=document.currentScript,base=new URL('../',script.src),key='study-garden-reading-v1';
  let state={bookmarks:[],recent:[]};try{state={...state,...JSON.parse(localStorage.getItem(key)||'{}')};}catch{}
  const safe=item=>{try{const u=new URL(item.url);return u.origin===base.origin&&u.pathname.startsWith(base.pathname)&&typeof item.title==='string';}catch{return false;}};
  state.bookmarks=(Array.isArray(state.bookmarks)?state.bookmarks:[]).filter(safe);state.recent=(Array.isArray(state.recent)?state.recent:[]).filter(safe);
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{return false;}};
  const url=location.origin+location.pathname,item={title:title.textContent.replace(/¶/g,'').trim(),url,date:new Date().toISOString().slice(0,10)};
  const library=document.getElementById('reading-library');
  function render(){library.replaceChildren();for(const [label,items]of [['收藏的文章',state.bookmarks],['最近阅读',state.recent]]){const h=document.createElement('h2');h.textContent=label;library.append(h);if(!items.length){const p=document.createElement('p');p.textContent='这里暂时没有记录。';p.className='reading-meta';library.append(p);continue;}const list=document.createElement('ul');list.className='reading-list';for(const entry of items){const li=document.createElement('li'),a=document.createElement('a');a.href=entry.url;a.textContent=entry.title;li.append(a);if(label==='收藏的文章'){const b=document.createElement('button');b.textContent='取消收藏';b.onclick=()=>{state.bookmarks=state.bookmarks.filter(x=>x.url!==entry.url);save();render();};li.append(b);}list.append(li);}library.append(list);}}
  if(library){render();return;}
  state.recent=[item,...state.recent.filter(x=>x.url!==url)].slice(0,12);save();
  const actions=document.createElement('div');actions.className='reading-actions';const button=document.createElement('button');button.type='button';const update=()=>{const saved=state.bookmarks.some(x=>x.url===url);button.textContent=saved?'★ 已收藏':'☆ 收藏本页';button.setAttribute('aria-pressed',String(saved));};update();button.onclick=()=>{const previous=state.bookmarks;state.bookmarks=state.bookmarks.some(x=>x.url===url)?state.bookmarks.filter(x=>x.url!==url):[item,...state.bookmarks].slice(0,200);if(!save()){state.bookmarks=previous;button.textContent='保存失败，请检查浏览器存储';return;}update();};const a=document.createElement('a');a.href=new URL('library/',base).href;a.textContent='我的书签 ↗';actions.append(button,a);title.after(actions);
})();
