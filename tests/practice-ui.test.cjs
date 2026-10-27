const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function dep(name){try{return require(name);}catch{return require('../.tooling/node_modules/'+name);}}
const {JSDOM}=dep('jsdom'),data=require('../docs/assets/exercises.json'),M=require('../docs/assets/practice-model.js'),root=path.join(__dirname,'..');
const button=(d,text)=>[...d.querySelectorAll('button')].find(b=>b.textContent===text),tick=()=>new Promise(resolve=>setImmediate(resolve));
function page(query=''){
 const dom=new JSDOM('<div id="practice-app"></div><script type="application/json" id="practice-data"></script>',{url:'http://127.0.0.1:8080/exercises/'+query,runScripts:'outside-only'}),w=dom.window,d=w.document;
 w.HTMLElement.prototype.scrollIntoView=function(){};d.getElementById('practice-data').textContent=JSON.stringify(data);
 w.localStorage.setItem(M.KEY,JSON.stringify({version:1,records:{divider:{answer:'7',checked:true,revealed:false,hints:0},nand:{answer:'3',checked:true,revealed:false,hints:0}}}));
 Object.defineProperty(d,'currentScript',{value:{src:'http://127.0.0.1:8080/assets/practice.js',dataset:{publicBase:'https://hexzane-cyber.github.io/study-garden/'}}});
 for(const f of ['practice-model.js','practice.js'])w.eval(fs.readFileSync(path.join(root,'docs/assets',f),'utf8'));return{w,d,dom};
}
(async()=>{
 const {w,d,dom}=page(),state=d.querySelector('[aria-label="练习状态"]');state.value='wrong';state.dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('.practice-card').length,1);assert(d.getElementById('exercise-divider'));
 const answer=d.querySelector('input[aria-label="电阻分压与负载条件的答案"]');answer.value='8';answer.dispatchEvent(new w.Event('input'));assert(d.getElementById('exercise-divider'),'typing must not remove a card from the correction view');button(d,'检查答案').click();assert.equal(d.querySelector('.practice-state').dataset.state,'correct');assert(d.getElementById('exercise-divider'));
 button(d,'刷新题目列表').click();assert.equal(d.querySelectorAll('.practice-card').length,0);assert(d.querySelector('.practice-list').textContent.includes('记录会保留'));
 const before=w.localStorage.getItem(M.KEY);button(d,'返回全部习题').click();assert.equal(d.querySelectorAll('.practice-card').length,6);assert.equal(w.localStorage.getItem(M.KEY),before);
 let copied='';Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async t=>{copied=t;}},configurable:true});button(d,'复制单题链接').click();await tick();assert.equal(copied,'https://hexzane-cyber.github.io/study-garden/exercises/?exercise=divider');assert(!copied.includes('answer'));assert(!copied.includes('127.0.0.1'));
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true});button(d,'复制单题链接').click();await tick();const fallback=d.querySelector('[aria-label="手动复制单题链接"]');assert(!fallback.hidden);assert.equal(fallback.value,copied);
 // Unrelated changes in another tab are preserved when refreshing the current view.
 const current=JSON.parse(w.localStorage.getItem(M.KEY));current.records.nand.answer='2';w.localStorage.setItem(M.KEY,JSON.stringify(current));w.dispatchEvent(new w.StorageEvent('storage',{key:M.KEY}));assert(d.querySelector('.practice-status').textContent.includes('其他标签页'));
 button(d,'刷新题目列表').click();state.value='wrong';state.dispatchEvent(new w.Event('change'));assert(d.getElementById('exercise-nand'));assert.equal(JSON.parse(w.localStorage.getItem(M.KEY)).records.nand.answer,'2');dom.window.close();
 const wrongPage=page('?status=wrong');assert.equal(wrongPage.d.querySelectorAll('.practice-card').length,1);assert(wrongPage.d.querySelector('.practice-schedule').href.endsWith('dashboard/?exercise=divider'));wrongPage.dom.window.close();
 const p=page('?exercise=nand&keep=1');assert.equal(p.d.querySelectorAll('.practice-card').length,1);assert(p.d.querySelector('.practice-focused'));button(p.d,'返回全部习题').click();assert.equal(p.w.location.search,'?keep=1');assert.equal(p.d.querySelectorAll('.practice-card').length,6);p.dom.window.close();
 console.log('Practice UI passed: correction filters, stable typing, refresh, reset without data loss, public single-question links, clipboard fallback, cross-tab preservation and focused URLs.');
})().catch(e=>{console.error(e);process.exitCode=1;});
