const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function dep(name){try{return require(name);}catch{return require('../.tooling/node_modules/'+name);}}
const {JSDOM}=dep('jsdom'),source=fs.readFileSync(path.join(__dirname,'../docs/assets/site-tools.js'),'utf8');
function setup(page='guide/',connection={}){
 const dom=new JSDOM('<div class="md-sidebar--primary"><a href="/study-garden/guide/">使用说明</a><a href="/study-garden/graph/">知识图谱</a><a href="/study-garden/private/">个人私密空间</a><a href="/study-garden/library/">我的书签</a><a href="/study-garden/courses/python/">Python</a></div><div class="md-content"><h1>测试文章</h1></div>',{url:'https://example.test/study-garden/'+page,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;Object.defineProperty(d,'currentScript',{value:{src:'https://example.test/study-garden/assets/site-tools.js'}});
 Object.defineProperty(w.navigator,'connection',{value:connection});w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};w.HTMLElement.prototype.scrollIntoView=function(){};
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};return {dom,w,d,start(){w.eval(source);}};
}

// Deterministic scroll/storage tests; never touch a real browser's study records.
function reader(initial,page='guide/'){
 const t=setup(page),{w,d}=t,key='study-garden-reading-position',timers=new Map();let seq=0,writes=0;
 if(initial!==undefined)w.localStorage.setItem(key,typeof initial==='string'?initial:JSON.stringify(initial));
 const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){if(k===key)writes++;return original.call(this,k,v);};
 w.setTimeout=(fn,ms)=>{const id=++seq;timers.set(id,{fn,ms});return id;};w.clearTimeout=id=>timers.delete(id);
 Object.defineProperty(d.documentElement,'scrollHeight',{value:2000,configurable:true});Object.defineProperty(w,'innerHeight',{value:1000,configurable:true});Object.defineProperty(w,'scrollY',{value:0,writable:true});
 const scroll=y=>{w.scrollY=y;w.dispatchEvent(new w.Event('scroll'));};
 return {...t,key,scroll,writes:()=>writes,read:()=>JSON.parse(w.localStorage.getItem(key)),flush(){for(const [id,timer]of [...timers])if(timer.ms===400){timers.delete(id);timer.fn();}}};
}

{
 const path='/study-garden/guide/',other='/study-garden/courses/signals/';
 const t=reader({[path]:.4,[other]:.1});t.start();assert.equal(t.writes(),0);assert(t.d.querySelector('.site-tools').textContent.includes('继续上次阅读 · 40%'));
 t.scroll(550);t.w.localStorage.setItem(t.key,JSON.stringify({[path]:.4,[other]:.8}));const count=t.writes();t.flush();assert.equal(t.writes(),count+1);assert.deepEqual(t.read(),{[other]:.8,[path]:.55},'save must preserve another article updated after this tab opened');
 t.scroll(730);t.w.scrollY=0;t.w.dispatchEvent(new t.w.PageTransitionEvent('pagehide'));assert.equal(t.read()[path],.73,'page exit saves the last sampled scroll before the debounce, even if the browser reset scrollY');const savedWrites=t.writes();t.flush();t.w.dispatchEvent(new t.w.PageTransitionEvent('pagehide'));t.scroll(730);t.flush();assert.equal(t.writes(),savedWrites,'an already saved or unchanged position must not be written again');t.dom.window.close();

 const fresh=reader();fresh.start();fresh.w.dispatchEvent(new fresh.w.PageTransitionEvent('pagehide'));assert.equal(fresh.writes(),0);assert.equal(fresh.w.localStorage.getItem(fresh.key),null);fresh.scroll(620);Object.defineProperty(fresh.d,'hidden',{value:true,configurable:true});fresh.d.dispatchEvent(new fresh.w.Event('visibilitychange'));assert.equal(fresh.read()[path],.62,'switching away flushes pending reading progress');fresh.scroll(800);fresh.flush();assert.equal(fresh.read()[path],.62,'hidden-page scrolls must not replace the last reading position');fresh.dom.window.close();

 for(const raw of ['null','[]','"text"','bad JSON',JSON.stringify({[path]:2}),JSON.stringify({[path]:'0.5'}),JSON.stringify({'https://other.test/':.5}),JSON.stringify({'/study-garden/guide/#one':.5}),JSON.stringify({'/outside/':.5}),JSON.stringify({'__proto__':.5,[path]:null})]){
  const broken=reader(raw);broken.start();broken.scroll(900);broken.flush();broken.w.dispatchEvent(new broken.w.PageTransitionEvent('pagehide'));assert.equal(broken.w.localStorage.getItem(broken.key),raw);assert.equal(broken.writes(),0);assert(broken.d.querySelector('.site-tools').textContent.includes('停止覆盖'));assert(![...broken.d.querySelectorAll('button')].some(b=>b.textContent.includes('继续上次阅读')));broken.dom.window.close();
 }
 const denied=reader({[path]:.4});denied.start();denied.w.Storage.prototype.setItem=function(){throw new Error('QuotaExceededError');};denied.scroll(700);denied.flush();assert.equal(denied.read()[path],.4);assert(denied.d.querySelector('.site-tools').textContent.includes('未能保存'));denied.dom.window.close();
 const changed=reader({[path]:.4});changed.start();changed.w.localStorage.setItem(changed.key,'{"__proto__":0.5}');changed.scroll(500);changed.flush();assert.equal(changed.w.localStorage.getItem(changed.key),'{"__proto__":0.5}','new invalid data after page load must also remain untouched');changed.w.localStorage.removeItem(changed.key);changed.w.dispatchEvent(new changed.w.PageTransitionEvent('pagehide'));assert.equal(changed.read()[path],.5,'a failed pending save can retry after the storage problem is resolved');changed.dom.window.close();
 const unavailable=reader();unavailable.w.Storage.prototype.getItem=function(){throw new Error('SecurityError');};unavailable.start();unavailable.scroll(400);unavailable.flush();assert.equal(unavailable.writes(),0);assert(unavailable.d.querySelector('.site-tools').textContent.includes('停止覆盖'));unavailable.dom.window.close();

 const resume=reader({[path]:.4});resume.start();let destination;resume.w.scrollTo=options=>{destination=options;};resume.w.localStorage.setItem(resume.key,JSON.stringify({[path]:.76}));resume.w.dispatchEvent(new resume.w.StorageEvent('storage',{key:resume.key}));assert(resume.d.querySelector('.site-tools').textContent.includes('继续上次阅读 · 76%'));assert.equal(destination,undefined,'cross-tab updates must not jump the current article');resume.w.localStorage.setItem(resume.key,JSON.stringify({[path]:.82}));[...resume.d.querySelectorAll('button')].find(b=>b.textContent.includes('继续上次阅读')).click();assert.equal(destination.top,820,'explicit resume must read the latest value even before the storage event arrives');assert.equal(destination.behavior,'auto');resume.w.localStorage.removeItem(resume.key);resume.w.dispatchEvent(new resume.w.StorageEvent('storage',{key:null}));assert(![...resume.d.querySelectorAll('button')].some(b=>b.textContent.includes('继续上次阅读')));resume.dom.window.close();
 const anchor=reader({[path]:.4},'guide/#section');anchor.start();assert(![...anchor.d.querySelectorAll('button')].some(b=>b.textContent.includes('继续上次阅读')));anchor.dom.window.close();
 const short=reader({[path]:.4});short.start();Object.defineProperty(short.d.documentElement,'scrollHeight',{value:800});short.scroll(0);short.flush();assert.equal(short.writes(),0,'a non-scrollable page must not reset progress');short.dom.window.close();
 const full=reader(Object.fromEntries(Array.from({length:200},(_,i)=>['/study-garden/notes/n'+i+'/',.2])));full.start();full.scroll(500);full.flush();assert.equal(Object.keys(full.read()).length,200);assert.equal(full.read()[path],.5);assert(!Object.hasOwn(full.read(),'/study-garden/notes/n0/'));full.dom.window.close();
 const oversized=reader(Object.fromEntries(Array.from({length:201},(_,i)=>['/study-garden/notes/n'+i+'/',.2])));oversized.start();oversized.scroll(500);oversized.flush();assert.equal(oversized.writes(),0);assert.equal(Object.keys(oversized.read()).length,201);oversized.dom.window.close();
 console.log('Reading position reliability passed: fresh merge, exit/hidden flush, no idle writes, malformed/blocked storage preservation, latest explicit resume, anchors, reduced motion and bounded history.');
}
(async()=>{
 const t=setup();const {w,d}=t;
 w.localStorage.setItem('study-garden-reading-v1',JSON.stringify({recent:[{title:'最近的笔记',url:'https://example.test/study-garden/notes/vectors/'}],bookmarks:[{title:'恶意地址',url:'javascript:alert(1)'},{title:'外站',url:'https://other.test/'}]}));
 w.localStorage.setItem('study-garden-reading-position',JSON.stringify({'/study-garden/guide/':.4}));t.start();
 const action=name=>[...d.querySelectorAll('.site-tools button')].find(b=>b.textContent.includes(name));
 action('快速打开').click();assert(d.querySelector('dialog').open);assert(d.querySelector('.site-quick-results').textContent.includes('最近的笔记'));assert(!d.querySelector('.site-quick-results').textContent.includes('恶意地址'));
 const input=d.querySelector('#site-quick-input');input.value='图谱';input.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.site-quick-results a').length,1);assert.equal(d.querySelector('.site-quick-results a').pathname,'/study-garden/graph/');
 input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));assert(d.querySelector('.is-current'));
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true,cancelable:true}));assert(!d.querySelector('dialog').open);
 action('字 +').click();assert.equal(JSON.parse(w.localStorage.getItem('study-garden-reader-prefs')).size,1.1);
 action('专注阅读').click();assert(d.body.classList.contains('site-reading-focus'));action('退出专注').click();assert(!d.body.classList.contains('site-reading-focus'));
 assert(action('继续上次阅读'));action('继续上次阅读').click();assert(!action('继续上次阅读'));
 const graph=d.querySelector('a[href$="graph/"]');graph.dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));assert.equal(d.querySelectorAll('link[rel=prefetch]').length,1);graph.dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));assert.equal(d.querySelectorAll('link[rel=prefetch]').length,1);
 d.querySelector('a[href$="private/"]').dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));assert.equal(d.querySelectorAll('link[rel=prefetch]').length,1);
 // Test loading feedback without causing jsdom to navigate.
 d.addEventListener('click',e=>e.preventDefault());graph.click();assert(!d.querySelector('.site-navigation-status').hidden);w.dispatchEvent(new w.PageTransitionEvent('pageshow',{persisted:true}));assert(d.querySelector('.site-navigation-status').hidden);
 t.dom.window.close();
 for(const connection of [{saveData:true},{effectiveType:'2g'},{effectiveType:'slow-2g'}]){const x=setup('private/',connection);x.start();assert(![...x.d.querySelectorAll('button')].some(b=>b.textContent==='专注阅读'));assert(!x.d.querySelector('.site-reading-progress'));x.d.querySelector('a[href$="graph/"]').dispatchEvent(new x.w.FocusEvent('focusin',{bubbles:true}));assert(!x.d.querySelector('link[rel=prefetch]'));x.dom.window.close();}
 const broken=setup();broken.w.localStorage.setItem('study-garden-reader-prefs','bad json');broken.start();assert(broken.d.querySelector('.site-tools'));broken.dom.window.close();
 console.log('Site tools passed: quick search, safe local links, keyboard selection, reader preferences, resume, prefetch limits, slow-network exclusion and navigation reset.');
})().catch(e=>{console.error(e);process.exitCode=1;});

{
 const t=setup(),{w,d}=t;const nav=d.querySelector('.md-sidebar--primary');for(const [title,url]of [['MIT 信号与系统','/study-garden/courses/signals/'],['MIT 数字信号处理','/study-garden/courses/dsp/']]){const a=d.createElement('a');a.textContent=title;a.href=url;nav.append(a);}
 w.localStorage.setItem('study-garden-reader-prefs','broken preference');w.localStorage.setItem('study-garden-reading-v1',JSON.stringify({bookmarks:[{title:'普通收藏',url:'https://example.test/study-garden/notes/ordinary/'},{title:'置顶收藏',url:'https://example.test/study-garden/notes/pinned/',pinned:true},{title:'凭证地址',url:'https://user:password@example.test/study-garden/secret/'}],recent:[]}));const before=w.localStorage.getItem('study-garden-reading-v1');t.start();assert.equal(w.localStorage.getItem('study-garden-reader-prefs'),'broken preference','page load must not overwrite unreadable preference data');
 const trigger=[...d.querySelectorAll('.site-tools button')].find(b=>b.textContent.includes('快速打开'));trigger.focus();trigger.click();const input=d.querySelector('#site-quick-input'),dialog=d.querySelector('dialog');assert.equal(d.querySelector('.site-quick-results a span').textContent,'置顶收藏');assert(!d.querySelector('.site-quick-results').textContent.includes('凭证地址'));
 input.value='ＭＩＴ 信号';input.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.site-quick-results a').length,2);assert(d.querySelector('.site-quick-feedback').textContent.includes('匹配 2 项'));
 input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',isComposing:true,bubbles:true}));assert(!d.querySelector('.is-current'));input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert(d.querySelector('.site-quick-feedback').textContent.includes('第 1 项'));input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert(!dialog.open);assert.equal(d.activeElement,trigger);assert.equal(w.localStorage.getItem('study-garden-reading-v1'),before);
 const link=d.createElement('a');link.href='/study-garden/catalog/?courseQuery=CMOS';d.body.append(link);d.addEventListener('click',e=>e.preventDefault());link.click();assert(!d.querySelector('.site-navigation-status').hidden,'parameterized course links need navigation feedback');w.dispatchEvent(new w.PageTransitionEvent('pageshow'));const same=d.createElement('a');same.href=w.location.pathname+'#section';d.body.append(same);same.click();assert(d.querySelector('.site-navigation-status').hidden,'same-page anchors must not display loading');
 const a=d.createElement('a'),b=d.createElement('a');a.href='/study-garden/courses/signals/#one';b.href='/study-garden/courses/signals/#two';d.body.append(a,b);a.dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));b.dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));assert.equal([...d.querySelectorAll('link[rel="prefetch"]')].filter(x=>x.href.includes('/signals/')).length,1);assert([...d.querySelectorAll('link[rel="prefetch"]')].every(x=>!x.href.includes('#')));t.dom.window.close();
 const fresh=setup();fresh.start();assert.equal(fresh.w.localStorage.getItem('study-garden-reader-prefs'),null,'reading a page must not create a preference record');fresh.dom.window.close();
 console.log('Quick navigation refinement passed: normalized multi-keyword matches, pin priority, credential rejection, IME keys, close focus, zero-write initial preferences, query navigation and anchor-deduplicated prefetch.');
}
