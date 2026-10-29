(() => {
 'use strict';
 const script=document.currentScript,base=new URL('../',script.src),heading=document.querySelector('.md-content h1');if(!heading)return;
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
 const internal=(value,allowQuery=false)=>{try{const u=new URL(value,base);return u.origin===base.origin&&u.pathname.startsWith(base.pathname)&&!u.username&&!u.password&&(allowQuery||!u.search)&&(/\/$|\.html$/.test(u.pathname))?u:null;}catch{return null;}};
 const tools=document.createElement('div');tools.className='site-tools';tools.setAttribute('aria-label','阅读与快捷操作');
 const status=document.createElement('span');status.className='site-tools-status';status.setAttribute('role','status');
 const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;tools.append(b);return b;};
 heading.after(tools);
 const dialog=document.createElement('dialog');dialog.className='site-quick';dialog.setAttribute('aria-label','快速打开');
 const top=document.createElement('div');top.className='site-quick-top';const label=document.createElement('label');label.textContent='快速打开';label.htmlFor='site-quick-input';
 const close=document.createElement('button');close.type='button';close.textContent='关闭 Esc';close.onclick=()=>dialog.close();top.append(label,close);
 const input=document.createElement('input');input.id='site-quick-input';input.type='search';input.placeholder='搜索页面标题、书签或最近阅读…';input.autocomplete='off';
 const result=document.createElement('div');result.className='site-quick-results';const hint=document.createElement('p');hint.textContent='↑ ↓ 选择 · Enter 打开 · Ctrl / ⌘ + K 呼出';dialog.append(top,input,hint,result);document.body.append(dialog);
 input.setAttribute('aria-controls','site-quick-results');result.id='site-quick-results';const feedback=document.createElement('p');feedback.className='site-quick-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');input.after(feedback);let results=[],cursor=-1,returnFocus=null;const normalize=value=>String(value).normalize('NFKC').toLowerCase();
 function entries(){
  const items=[],seen=new Set(),reading=read('study-garden-reading-v1',{});
  const add=(title,url,group)=>{const u=internal(url);if(!u||seen.has(u.pathname)||typeof title!=='string')return;seen.add(u.pathname);items.push({title:title.trim(),url:u.href,group});};
  for(const [key,name]of [['bookmarks','收藏'],['recent','最近阅读']])for(const item of Array.isArray(reading?.[key])?[...reading[key]].slice(0,200).sort((a,b)=>key==='bookmarks'?Number(Boolean(b?.pinned))-Number(Boolean(a?.pinned)):0):[])if(item)add(item.title,item.url,name);
  for(const a of document.querySelectorAll('.md-sidebar--primary a[href]'))add(a.textContent,a.href,'站内页面');return items;
 }
 function highlight(){results.forEach((a,i)=>{a.classList.toggle('is-current',i===cursor);if(i===cursor){a.scrollIntoView?.({block:'nearest'});feedback.textContent='第 '+(i+1)+' 项，共 '+results.length+' 项：'+a.textContent;}});}
 function render(){
  result.replaceChildren();cursor=-1;const terms=normalize(input.value).trim().split(/\s+/).filter(Boolean),all=entries().filter(x=>terms.every(term=>normalize(x.title+' '+new URL(x.url).pathname).includes(term))),matches=all.slice(0,40);feedback.textContent='匹配 '+all.length+' 项'+(all.length>40?'，先显示 40 项，请缩小关键词':'');results=[];
  for(const item of matches){const a=document.createElement('a');a.href=item.url;const title=document.createElement('span'),group=document.createElement('small');title.textContent=item.title;group.textContent=item.group;a.append(title,group);result.append(a);results.push(a);}
  if(!results.length){const p=document.createElement('p');p.textContent='没有匹配页面，可使用顶部全文搜索查找正文。';result.append(p);}
 }
 function open(){if(dialog.open){dialog.close();return;}returnFocus=document.activeElement;input.value='';render();dialog.showModal();input.focus();}
 const quickTrigger=button('快速打开 · Ctrl K',open);dialog.addEventListener('close',()=>{(returnFocus?.isConnected&&typeof returnFocus.focus==='function'?returnFocus:quickTrigger).focus();});input.oninput=render;
 input.onkeydown=e=>{if(e.isComposing||e.keyCode===229)return;if(e.key==='Escape'){e.preventDefault();dialog.close();return;}if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(results.length){cursor=cursor<0?(e.key==='ArrowDown'?0:results.length-1):(cursor+(e.key==='ArrowDown'?1:results.length-1))%results.length;highlight();}}else if(e.key==='Enter'&&results.length){e.preventDefault();results[Math.max(0,cursor)].click();}};
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 const storedPrefs=read('study-garden-reader-prefs',{}),prefs=storedPrefs&&typeof storedPrefs==='object'?storedPrefs:{};let size=[.9,1,1.1,1.2].includes(prefs.size)?prefs.size:1;
 function apply(save=false){document.documentElement.style.setProperty('--reader-scale',size);if(save)write('study-garden-reader-prefs',{size});}
 button('字 −',()=>{size=Math.max(.9,Math.round((size-.1)*10)/10);apply(true);status.textContent='字号 '+Math.round(size*100)+'%';});button('字 +',()=>{size=Math.min(1.2,Math.round((size+.1)*10)/10);apply(true);status.textContent='字号 '+Math.round(size*100)+'%';});apply();
 const special=/^(private|graph|library|contribute|workbench|dashboard|catalog|review|backup)(\/|$)/.test(location.pathname.slice(base.pathname.length));
 if(!special&&location.pathname!==base.pathname){button('制作复习卡',()=>{
  const selection=getSelection(),content=document.querySelector('.md-content');let excerpt='';
  if(selection?.rangeCount&&content?.contains(selection.anchorNode)&&content.contains(selection.focusNode))excerpt=selection.toString().trim().slice(0,4000);
  const draft={question:'关于「'+heading.textContent.replace(/¶/g,'').trim().slice(0,240)+'」，我记住了什么？',answer:excerpt,source:location.pathname.slice(base.pathname.length)+location.hash};
  try{sessionStorage.setItem('zhixin-review-draft-v1',JSON.stringify(draft));location.assign(new URL('review/',base).href);}catch{status.textContent='无法保存摘录草稿，请打开复习卡页面手动创建。';}
 });}
 if(!special){const focus=button('专注阅读',()=>{const on=document.body.classList.toggle('site-reading-focus');focus.setAttribute('aria-pressed',String(on));focus.textContent=on?'退出专注':'专注阅读';});focus.setAttribute('aria-pressed','false');}
 button('复制链接',async()=>{try{await navigator.clipboard.writeText(location.href);status.textContent='链接已复制';}catch{status.textContent='无法自动复制，请从地址栏复制链接。';}});
 tools.append(status);
 if(!special){
  const key='study-garden-reading-position';let scheduled=false,timer,dirty=false,pending=0,resume;
  const positionStatus=document.createElement('span');positionStatus.className='site-tools-status';positionStatus.setAttribute('role','status');tools.append(positionStatus);
  function positions(){
   try{
    const raw=localStorage.getItem(key);if(raw===null)return {};
    if(raw.length>200000)throw new Error();const value=JSON.parse(raw);
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>200)throw new Error();
    for(const [path,amount]of Object.entries(value)){const u=internal(path);if(!u||u.pathname!==path||!Number.isFinite(amount)||amount<0||amount>1)throw new Error();}
    return value;
   }catch{positionStatus.textContent='阅读位置暂时无法读取，已保留原记录并停止覆盖；其他阅读工具仍可使用。';return null;}
  }
  const progress=document.createElement('div');progress.className='site-reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const fraction=()=>Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));
  function updateResume(){
   const value=positions(),saved=value?.[location.pathname];if(value)positionStatus.textContent='';
   if(!value||location.hash||!Number.isFinite(saved)||saved<=.03||saved>=.99){resume?.remove();resume=null;return;}
   positionStatus.textContent='';
   if(!resume)resume=button('',()=>{
    // Read again: another tab may have updated this article since the button appeared.
    const latest=positions()?.[location.pathname];if(!Number.isFinite(latest)){updateResume();return;}
    scrollTo({top:latest*Math.max(0,document.documentElement.scrollHeight-innerHeight),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});resume.remove();resume=null;
   });
   resume.textContent='继续上次阅读 · '+Math.round(saved*100)+'%';
  }
  function savePosition(){
   clearTimeout(timer);if(!dirty)return;
   const latest=positions();if(!latest)return;
   if(latest[location.pathname]===pending){dirty=false;positionStatus.textContent='';return;}
   // Merge into the current record, not the snapshot taken when the page loaded.
   const entries=Object.entries(latest).filter(([path])=>path!==location.pathname);entries.push([location.pathname,pending]);
   if(write(key,Object.fromEntries(entries.slice(-200)))){dirty=false;positionStatus.textContent='';}
   else positionStatus.textContent='阅读位置未能保存，请检查浏览器存储；原记录保持不变。';
  }
  updateResume();
  addEventListener('scroll',()=>{
   if(!scheduled){scheduled=true;requestAnimationFrame(()=>{progress.style.transform='scaleX('+fraction()+')';scheduled=false;});}
   if(document.hidden||document.documentElement.scrollHeight<=innerHeight)return;
   pending=fraction();dirty=true;clearTimeout(timer);timer=setTimeout(savePosition,400);
  },{passive:true});
  // Keep the last scroll sample: browsers may reset scrollY while leaving a page.
  addEventListener('pagehide',savePosition);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)savePosition();else if(!dirty)updateResume();});
  addEventListener('storage',event=>{if((event.key===key||event.key===null)&&!dirty)updateResume();});
 }
 // Only warm links the user indicates; never scan or download the entire site.
 const prefetched=new Set();let warmTimer;
 function warm(a){
  const connection=navigator.connection;if(connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType||''))return;
  if(!a||a.hasAttribute('download')||a.target||prefetched.size>=4)return;const u=internal(a.href);if(!u||u.pathname===location.pathname||/^(private|workbench)(\/|$)/.test(u.pathname.slice(base.pathname.length))||prefetched.has(u.href))return;
  u.hash='';if(prefetched.has(u.href))return;prefetched.add(u.href);const link=document.createElement('link');link.rel='prefetch';link.href=u.href;document.head.append(link);
 }
 document.addEventListener('pointerover',e=>{clearTimeout(warmTimer);const a=e.target.closest('a[href]');if(a)warmTimer=setTimeout(()=>warm(a),100);},{passive:true});
 document.addEventListener('pointerout',()=>clearTimeout(warmTimer),{passive:true});document.addEventListener('focusin',e=>warm(e.target.closest('a[href]')));
 const loading=document.createElement('div');loading.className='site-navigation-status';loading.setAttribute('role','status');loading.hidden=true;document.body.append(loading);let loadTimer;
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!a||a.target||a.hasAttribute('download'))return;const u=internal(a.href,true);if(!u||(u.pathname===location.pathname&&u.search===location.search))return;loading.textContent='正在打开页面…';loading.hidden=false;clearTimeout(loadTimer);loadTimer=setTimeout(()=>{loading.textContent='页面仍在连接中，可以使用浏览器返回后重试。';},8000);});
 addEventListener('pageshow',()=>{loading.hidden=true;clearTimeout(loadTimer);});
})();
