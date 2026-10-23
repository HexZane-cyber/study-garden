const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function dep(name){try{return require(name);}catch{return require('../.tooling/node_modules/'+name);}}
const {JSDOM}=dep('jsdom'),source=fs.readFileSync(path.join(__dirname,'../docs/assets/site-tools.js'),'utf8');
function setup(page='guide/',connection={}){
 const dom=new JSDOM('<div class="md-sidebar--primary"><a href="/study-garden/guide/">使用说明</a><a href="/study-garden/graph/">知识图谱</a><a href="/study-garden/private/">个人私密空间</a><a href="/study-garden/library/">我的书签</a><a href="/study-garden/courses/python/">Python</a></div><div class="md-content"><h1>测试文章</h1></div>',{url:'https://example.test/study-garden/'+page,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;Object.defineProperty(d,'currentScript',{value:{src:'https://example.test/study-garden/assets/site-tools.js'}});
 Object.defineProperty(w.navigator,'connection',{value:connection});w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.HTMLElement.prototype.scrollIntoView=function(){};
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};return {dom,w,d,start(){w.eval(source);}};
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
