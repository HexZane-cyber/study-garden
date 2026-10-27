const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function dep(n){try{return require(n);}catch{return require('../.tooling/node_modules/'+n);}}
const {JSDOM}=dep('jsdom'),data=require('../docs/assets/exercises.json'),root=path.join(__dirname,'..'),tick=()=>new Promise(r=>setImmediate(r));
const button=(d,text)=>[...d.querySelectorAll('button')].find(b=>b.textContent===text);
function page(gpu=true){
 const dom=new JSDOM('<div id="local-ai-app"></div><script id="practice-data" type="application/json"></script>',{url:'https://test.invalid/study-garden/local-ai/?unrelated=private-url',runScripts:'outside-only'}),w=dom.window,d=w.document;
 d.getElementById('practice-data').textContent=JSON.stringify(data);w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLAnchorElement.prototype.click=function(){};w.Blob=Blob;
 let probes=0,estimates=0,starts=0,fetches=0,lastBlob=null,pending=null;
 w.URL.createObjectURL=b=>{lastBlob=b;return'blob:https://test.invalid/test';};w.URL.revokeObjectURL=()=>{};Object.defineProperty(w,'isSecureContext',{value:true});
 Object.defineProperty(w.navigator,'storage',{value:{estimate:async()=>{estimates++;return{quota:1e8,usage:1e7};}}});
 if(gpu)Object.defineProperty(w.navigator,'gpu',{value:{requestAdapter:async()=>{probes++;return{features:new Set(['shader-f16']),info:{vendor:'Intel',architecture:'test',description:'<img src=x>'}};}}});
 w.fetch=async()=>{fetches++;throw Error('Failed to fetch');};
 w.ZhixinWebLLM={start(){starts++;return{ready:Promise.resolve(),generate:()=>new Promise((resolve,reject)=>{pending={resolve,reject};}),close(){pending?.reject(new w.DOMException('stopped','AbortError'));}};}};
 Object.defineProperty(d,'currentScript',{value:{src:'https://test.invalid/study-garden/assets/local-ai.js',dataset:{runtime:'runtime.js',worker:'worker.js'}}});
 for(const f of ['local-ai-model.js','local-ai.js'])w.eval(fs.readFileSync(path.join(root,'docs/assets',f),'utf8'));
 return{w,d,dom,get probes(){return probes;},get estimates(){return estimates;},get starts(){return starts;},get fetches(){return fetches;},fail(e){pending.reject(e);},async diagnostic(){button(d,'导出连接诊断').click();return JSON.parse(await lastBlob.text());}};
}
(async()=>{
 const p=page(),{w,d}=p,input=d.querySelector('[aria-label="向本地 AI 提问"]');assert.equal(p.probes,0);assert.equal(p.estimates,0);assert.equal(p.fetches,0);assert.equal(p.starts,0);
 input.value='原来的草稿';input.dispatchEvent(new w.Event('input'));button(d,'讲清一个概念').click();assert(input.value.includes('【填写概念'));assert.equal(p.starts,0);button(d,'恢复上一份草稿').click();assert.equal(input.value,'原来的草稿');assert(d.querySelector('.local-ai-footnote').textContent.includes('字符'));
 w.dispatchEvent(new w.CustomEvent('zhixin:exercise',{detail:{id:'divider',mode:'hint',answer:'8'}}));assert(d.querySelector('.local-ai-quick').hidden);button(d,'退出习题模式').click();assert(!d.querySelector('.local-ai-quick').hidden);button(d,'恢复上一份草稿').click();assert.equal(input.value,'原来的草稿');
 button(d,'检测 WebGPU').click();await tick();assert.equal(p.probes,1);assert.equal(p.estimates,1);const device=d.querySelector('.local-ai-device');assert(device.open);assert(device.textContent.includes('不是显存'));assert(device.textContent.includes('小于'));assert(!device.querySelector('img'));
 button(d,'下载并加载模型').click();await tick();assert.equal(p.starts,1);assert(!button(d,'发送给本地 AI').disabled);assert(!device.open);
 input.value='私人题目和推导 sentinel-4821';button(d,'发送给本地 AI').click();await tick();assert.equal(input.value,'');p.fail(Error('Failed to fetch sentinel-4821'));await tick();assert(!d.querySelector('.local-ai-help').hidden);assert(d.querySelector('.local-ai-help').textContent.includes('Hugging Face'));assert(!button(d,'恢复上次提问').hidden);
 const report=await p.diagnostic();assert.equal(report.failureCode,'network');assert.equal(report.phase,'error');assert.equal(report.capabilities.estimatedFreeStorageBytes,9e7);assert(!JSON.stringify(report).includes('sentinel'));assert(!JSON.stringify(report).includes('private-url'));
 input.value='接下来要问的新草稿';button(d,'恢复上次提问').click();assert(input.value.includes('sentinel-4821'));assert.equal(p.starts,1);button(d,'恢复上一份草稿').click();assert.equal(input.value,'接下来要问的新草稿');
 button(d,'下载并加载模型').click();await tick();input.value='取消生成也能恢复';button(d,'发送给本地 AI').click();await tick();button(d,'停止 / 卸载').click();await tick();assert(!button(d,'恢复上次提问').hidden);button(d,'恢复上次提问').click();assert.equal(input.value,'取消生成也能恢复');assert(button(d,'发送给本地 AI').disabled);
 const backend=d.querySelector('[aria-label="AI 运行方式"]');backend.value='ollama';backend.dispatchEvent(new w.Event('change'));button(d,'读取本机模型').click();await tick();assert(d.querySelector('.local-ai-help').textContent.includes('OLLAMA_ORIGINS'));button(d,'复制当前网页来源').click();await tick();const origin=d.querySelector('[aria-label="当前网页来源"]');assert(!origin.hidden);assert.equal(origin.value,'https://test.invalid');
 assert.equal(w.localStorage.length,0,'AI support must not save chats or diagnostics automatically');button(d,'清空本次对话').click();assert(button(d,'恢复上次提问').hidden);p.dom.window.close();
 const b=page(false);button(b.d,'检测 WebGPU').click();await tick();assert.equal(b.starts,0);assert(b.d.querySelector('.local-ai-help').textContent.includes('WebGPU'));assert.equal((await b.diagnostic()).failureCode,'gpu');b.dom.window.close();
 console.log('Local AI support UI passed: opt-in probes, honest storage estimates, safe device text, reversible templates, failure advice, prompt recovery, origin copying and diagnostics without conversation data.');
})().catch(e=>{console.error(e);process.exitCode=1;});
