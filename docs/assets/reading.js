(() => {
 'use strict';const title=document.querySelector('.md-content h1');if(!title)return;
 const base=new URL('../',document.currentScript.src),M=window.ReadingModel,library=document.getElementById('reading-library');let state=M.blank(),removed=null,editTarget=null,limit=50;
 try{window.ArticleActivity?.record(localStorage,location.href,base.href);}catch{}
 const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;},makeButton=(text,fn)=>{const b=el('button',text);b.type='button';b.onclick=fn;return b;};
 const notice=el('p','','reading-meta');notice.setAttribute('role','status');
 function read(){try{state=M.load(localStorage,base.href);notice.textContent='';return true;}catch{notice.textContent='阅读记录暂时无法读取，已停止写入。可在“数据与备份”下载原始记录。';return false;}}
 function change(fn,message=''){if(!read())return false;try{const next=fn(state);M.save(localStorage,next);state=next;notice.textContent=message;return true;}catch(error){notice.textContent='未保存：'+error.message;return false;}}
 const now=new Date(),url=location.origin+location.pathname,item={title:title.textContent.replace(/¶/g,'').trim().slice(0,300)||'未命名文章',url,date:[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-')};read();
 const undo=makeButton('撤销取消收藏',()=>{if(!removed)return;const recovery=removed;let exists=false;if(change(s=>{exists=s.bookmarks.some(x=>x.url===recovery.item.url);return M.restoreBookmark(s,recovery.item,recovery.index);})){notice.textContent=exists?'这篇文章已重新收藏，保留当前名称和置顶状态。':'收藏已恢复。';removed=null;undo.hidden=true;render();update();if(library){const target=[...sections.querySelectorAll('a')].find(a=>a.href===recovery.item.url);(target||search).focus();}else button?.focus();}});undo.hidden=true;
 function removeBookmark(target){let recovery=null;if(change(s=>{const index=s.bookmarks.findIndex(x=>x.url===target);if(index<0)throw Error('这篇文章已在其他页面取消收藏。');recovery={item:s.bookmarks[index],index};return {...s,bookmarks:s.bookmarks.filter(x=>x.url!==target)};},'已取消收藏，可以撤销。')){removed=recovery;undo.hidden=false;render();update();if(library)undo.focus();}else{render();update();}}
 let button,search,scope,order,summary,sections,more,editor,renameInput,renameStatus;
 function update(){if(!button)return;const saved=state.bookmarks.some(x=>x.url===url);button.textContent=saved?'★ 已收藏':'☆ 收藏本页';button.setAttribute('aria-pressed',String(saved));}
 function render(){
  if(!library)return;summary.textContent='收藏 '+state.bookmarks.length+' / 200 篇 · 置顶 '+state.bookmarks.filter(x=>x.pinned).length+' 篇 · 最近阅读 '+state.recent.length+' 条';sections.replaceChildren();let matched=0,displayed=0;
  for(const [kind,name]of [['bookmarks','收藏的文章'],['recent','最近阅读']]){
   if(scope.value==='bookmarks'&&kind!=='bookmarks'||scope.value==='recent'&&kind!=='recent'||scope.value==='pinned'&&kind!=='bookmarks')continue;
   const entries=M.entriesFor(state,kind,{query:search.value,order:order.value,pinnedOnly:scope.value==='pinned'}),heading=el('h2',name+' · '+entries.length),list=el('ul',undefined,'reading-list');matched+=entries.length;
   sections.append(heading);if(!entries.length){sections.append(el('p',search.value.trim()||scope.value==='pinned'?'没有匹配的记录，可以调整搜索或筛选。':'这里暂时没有记录。','reading-meta'));continue;}
   const shown=kind==='bookmarks'?entries.slice(0,limit):entries;displayed+=shown.length;
   for(const entry of shown){
    const row=el('li'),body=el('div',undefined,'reading-entry'),a=el('a',entry.title);a.href=entry.url;body.append(a,el('small',(entry.pinned?'已置顶 · ':'')+(entry.date||'日期未记录'),'reading-meta'));row.append(body);
    if(kind==='bookmarks'){
     const actions=el('div',undefined,'reading-row-actions'),pin=makeButton(entry.pinned?'取消置顶':'置顶',()=>{change(s=>M.updateBookmark(s,entry.url,{pinned:!entry.pinned},entry),entry.pinned?'已取消置顶。':'已置顶，收藏会显示在前面。');render();}),rename=makeButton('改名',()=>{editTarget={...entry};renameInput.value=entry.title;renameStatus.textContent='只修改本机收藏名称，不会改动原文章。';editor.showModal();renameInput.focus();}),remove=makeButton('取消收藏',()=>removeBookmark(entry.url));
     pin.setAttribute('aria-label',(entry.pinned?'取消置顶 ':'置顶 ')+entry.title);pin.setAttribute('aria-pressed',String(Boolean(entry.pinned)));rename.setAttribute('aria-label','修改收藏名称 '+entry.title);rename.dataset.renameUrl=entry.url;remove.setAttribute('aria-label','取消收藏 '+entry.title);actions.append(pin,rename,remove);row.append(actions);
    }
    list.append(row);
   }
   sections.append(list);
  }
  more.hidden=scope.value==='recent'||M.entriesFor(state,'bookmarks',{query:search.value,order:order.value,pinnedOnly:scope.value==='pinned'}).length<=limit;more.textContent='再显示 50 篇收藏';summary.textContent+=' · 匹配 '+matched+' 条，显示 '+displayed+' 条';
 }
 if(library){
  library.classList.add('reading-workspace');const controls=el('div',undefined,'reading-library-tools');search=el('input');search.type='search';search.placeholder='搜索标题或文章地址…';search.setAttribute('aria-label','搜索书签和最近阅读');scope=el('select');scope.setAttribute('aria-label','筛选阅读记录类型');order=el('select');order.setAttribute('aria-label','收藏排序');
  for(const [value,label]of [['all','全部记录'],['bookmarks','仅收藏'],['pinned','置顶收藏'],['recent','最近阅读']]){const o=el('option',label);o.value=value;scope.append(o);}for(const [value,label]of [['saved','按收藏顺序'],['title','按名称'],['date','按收藏日期']]){const o=el('option',label);o.value=value;order.append(o);}
  const reset=makeButton('重置搜索与筛选',()=>{search.value='';scope.value='all';order.value='saved';limit=50;render();search.focus();});for(const control of [search,scope,order])control.addEventListener(control===search?'input':'change',()=>{limit=50;render();});
  controls.append(search,scope,order,reset);summary=el('p','','reading-meta');summary.setAttribute('role','status');sections=el('div',undefined,'reading-sections');more=makeButton('再显示 50 篇收藏',()=>{const firstNew=sections.querySelectorAll('[data-rename-url]').length;limit+=50;render();sections.querySelectorAll('[data-rename-url]')[firstNew]?.focus();});library.append(notice,controls,summary,undo,sections,more);
  editor=el('dialog',undefined,'study-panel reading-editor');editor.setAttribute('aria-label','修改收藏名称');const form=el('form'),label=el('label','收藏名称');renameInput=el('input');renameInput.required=true;renameInput.maxLength=300;renameInput.setAttribute('aria-label','收藏名称');label.append(renameInput);renameStatus=el('p','','reading-meta');renameStatus.setAttribute('role','status');const save=el('button','保存名称','study-primary');save.type='submit';const cancel=makeButton('取消',()=>editor.close());form.append(label,renameStatus,save,cancel);editor.append(el('h2','给收藏起个好找的名字'),form);document.body.append(editor);
  form.onsubmit=event=>{event.preventDefault();if(!editTarget)return;if(change(s=>M.updateBookmark(s,editTarget.url,{title:renameInput.value},editTarget),'收藏名称已更新，原文章没有改变。')){render();editor.close();}else{renameStatus.textContent=notice.textContent;render();}};editor.addEventListener('close',()=>{if(read())render();const trigger=[...sections.querySelectorAll('[data-rename-url]')].find(b=>b.dataset.renameUrl===editTarget?.url);(trigger||search).focus();editTarget=null;});render();
 }else{
  change(s=>({...s,recent:[item,...s.recent.filter(x=>x.url!==url)].slice(0,12)}));const actions=el('div',undefined,'reading-actions');button=makeButton('☆ 收藏本页',()=>{if(state.bookmarks.some(x=>x.url===url)){removeBookmark(url);return;}change(s=>M.addBookmark(s,item),'已收藏到本浏览器。');update();});update();const a=el('a','我的书签 ↗');a.href=new URL('library/',base).href;actions.append(button,a,undo);title.after(actions);actions.after(notice);
 }
 addEventListener('storage',event=>{if(event.key===M.KEY||event.key===null){read();render();update();}});
})();
