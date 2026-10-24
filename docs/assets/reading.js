(() => {
 'use strict';const title=document.querySelector('.md-content h1');if(!title)return;
 const base=new URL('../',document.currentScript.src),M=window.ReadingModel,library=document.getElementById('reading-library');let state=M.blank();
 try{window.ArticleActivity?.record(localStorage,location.href,base.href);}catch{}
 const notice=document.createElement('p');notice.className='reading-meta';notice.setAttribute('role','status');
 function read(){try{state=M.load(localStorage,base.href);notice.textContent='';return true;}catch{notice.textContent='阅读记录暂时无法读取，已停止写入。可在“数据与备份”下载原始记录。';return false;}}
 function change(fn){if(!read())return false;try{const next=fn(state);M.save(localStorage,next);state=next;notice.textContent='';return true;}catch{notice.textContent='保存失败，原记录没有被本次操作覆盖。';return false;}}
 const url=location.origin+location.pathname,item={title:title.textContent.replace(/¶/g,'').trim().slice(0,300)||'未命名文章',url,date:new Date().toISOString().slice(0,10)};read();
 function render(){if(!library)return;library.replaceChildren(notice);for(const [name,items]of [['收藏的文章',state.bookmarks],['最近阅读',state.recent]]){const h=document.createElement('h2');h.textContent=name;library.append(h);if(!items.length){const p=document.createElement('p');p.textContent='这里暂时没有记录。';p.className='reading-meta';library.append(p);continue;}const list=document.createElement('ul');list.className='reading-list';for(const entry of items){const li=document.createElement('li'),a=document.createElement('a');a.href=entry.url;a.textContent=entry.title;li.append(a);if(name==='收藏的文章'){const b=document.createElement('button');b.type='button';b.textContent='取消收藏';b.setAttribute('aria-label','取消收藏 '+entry.title);b.onclick=()=>{change(s=>({...s,bookmarks:s.bookmarks.filter(x=>x.url!==entry.url)}));render();};li.append(b);}list.append(li);}library.append(list);}}
 let button;function update(){if(!button)return;const saved=state.bookmarks.some(x=>x.url===url);button.textContent=saved?'★ 已收藏':'☆ 收藏本页';button.setAttribute('aria-pressed',String(saved));}
 if(library)render();else{
  change(s=>({...s,recent:[item,...s.recent.filter(x=>x.url!==url)].slice(0,12)}));
  const actions=document.createElement('div');actions.className='reading-actions';button=document.createElement('button');button.type='button';update();button.onclick=()=>{change(s=>({...s,bookmarks:s.bookmarks.some(x=>x.url===url)?s.bookmarks.filter(x=>x.url!==url):[item,...s.bookmarks].slice(0,200)}));update();};
  const a=document.createElement('a');a.href=new URL('library/',base).href;a.textContent='我的书签 ↗';actions.append(button,a);title.after(actions);actions.after(notice);
 }
 addEventListener('storage',event=>{if(event.key===M.KEY||event.key===null){read();render();update();}});
})();