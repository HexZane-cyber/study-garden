const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function dep(n){try{return require(n);}catch{return require('../.tooling/node_modules/'+n);}}
const {JSDOM}=dep('jsdom'),root=path.join(__dirname,'..'),questions=require('../docs/assets/exercises.json'),courses=require('../docs/assets/course-catalog.json').courses;
const button=(d,text)=>[...d.querySelectorAll('button')].find(b=>b.textContent===text),tick=()=>new Promise(r=>setImmediate(r));
function page(query='',blocked=false){
 const dom=new JSDOM('<div id="local-ai-app"></div><script id="practice-data" type="application/json"></script><script id="ai-course-data" type="application/json"></script>',{url:'https://test.invalid/study-garden/local-ai/'+query,runScripts:'outside-only'}),w=dom.window,d=w.document;
 d.getElementById('practice-data').textContent=JSON.stringify(questions);d.getElementById('ai-course-data').textContent=JSON.stringify({courses});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLAnchorElement.prototype.click=function(){};w.Blob=Blob;let lastBlob=null;
 w.URL.createObjectURL=b=>{lastBlob=b;return'blob:https://test.invalid/test';};w.URL.revokeObjectURL=()=>{};
 w.localStorage.setItem('personal-progress','untouched');
 if(blocked)Object.defineProperty(w,'sessionStorage',{get(){throw Error('blocked');}});else w.sessionStorage.setItem('zhixin-ai-exercise-v1',JSON.stringify({id:'divider',mode:'hint',answer:'stale-answer'}));
 let starts=0,fetches=0,probes=0;const calls=[];Object.defineProperty(w,'isSecureContext',{value:true});Object.defineProperty(w.navigator,'gpu',{value:{requestAdapter:async()=>{probes++;return{features:new Set(['shader-f16'])};}}});
 w.fetch=async()=>{fetches++;throw Error('unexpected network');};w.ZhixinWebLLM={start(){starts++;return{ready:Promise.resolve(),close(){},async generate(messages){calls.push(JSON.parse(JSON.stringify(messages)));return '示例回复 '+calls.length;}};}};
 Object.defineProperty(d,'currentScript',{value:{src:'https://test.invalid/study-garden/assets/local-ai.js',dataset:{runtime:'runtime.js',worker:'worker.js'}}});for(const f of ['local-ai-model.js','local-ai.js'])w.eval(fs.readFileSync(path.join(root,'docs/assets',f),'utf8'));
 return{w,d,dom,calls,get starts(){return starts;},get fetches(){return fetches;},get probes(){return probes;},async exported(text){button(d,text).click();return lastBlob.text();}};
}
(async()=>{
 const p=page('?keep=1&course=ee-dsp&intent=prerequisites'),{w,d}=p,input=d.querySelector('[aria-label="向本地 AI 提问"]'),scope=d.querySelector('.local-ai-scope strong');
 const dsp=courses.find(c=>c.id==='ee-dsp'),ic=courses.find(c=>c.id==='ic-digital');assert(scope.textContent.includes(dsp.title));assert(input.value.includes('先修准备'));assert(!input.value.includes('stale-answer'));assert.equal(p.starts,0);assert.equal(p.probes,0);assert.equal(p.fetches,0);assert(d.querySelector('.local-ai-course-info').textContent.includes(dsp.summary));
 button(d,'下载并加载模型').click();await tick();button(d,'发送给本地 AI').click();await tick();assert.equal(p.starts,1);assert(p.calls[0][0].content.includes(dsp.summary));
 input.value='DSP-only-sentinel';button(d,'发送给本地 AI').click();await tick();assert(p.calls[1].some(m=>m.content==='示例回复 1'));
 const picker=d.querySelector('[aria-label="选择讨论课程"]'),intent=d.querySelector('[aria-label="课程辅助方式"]');picker.value=ic.id;picker.dispatchEvent(new w.Event('change'));intent.value='quiz';button(d,'填入课程提问').click();assert(scope.textContent.includes(ic.title));assert(d.querySelectorAll('.local-ai-message').length>=4);assert.equal(new URL(w.location.href).searchParams.get('course'),ic.id);assert.equal(new URL(w.location.href).searchParams.get('keep'),'1');
 button(d,'发送给本地 AI').click();await tick();assert(p.calls[2][0].content.includes(ic.summary));assert(!JSON.stringify(p.calls[2]).includes('DSP-only-sentinel'));assert.equal(p.starts,1,'switching topic must reuse the loaded model');
 w.dispatchEvent(new w.CustomEvent('zhixin:exercise',{detail:{id:'divider',mode:'hint',answer:'8'}}));assert(scope.textContent.includes('习题：'));assert(d.querySelector('.local-ai-course-info').hidden);assert.equal(new URL(w.location.href).searchParams.get('course'),null);button(d,'发送给本地 AI').click();await tick();assert(!JSON.stringify(p.calls[3]).includes(ic.summary));assert(!JSON.stringify(p.calls[3]).includes('DSP-only-sentinel'));
 button(d,'退出习题模式').click();assert.equal(scope.textContent,'当前讨论：自由问答');input.value='free-only-sentinel';button(d,'发送给本地 AI').click();await tick();assert(!p.calls[4][0].content.includes('当前公开讨论背景'));assert(!JSON.stringify(p.calls[4]).includes(dsp.summary));
 button(d,'新建自由问答').click();input.value='new-free-only';button(d,'发送给本地 AI').click();await tick();assert.equal(p.calls[5].length,2);assert(!JSON.stringify(p.calls[5]).includes('free-only-sentinel'));assert(d.querySelectorAll('.local-ai-message').length>=10);
 input.value='需要保留的自由草稿';picker.value=ic.id;picker.dispatchEvent(new w.Event('change'));button(d,'填入课程提问').click();button(d,'恢复上一份草稿').click();assert.equal(input.value,'需要保留的自由草稿');assert.equal(scope.textContent,'当前讨论：自由问答');assert(d.querySelector('.local-ai-course-info').hidden);assert.equal(new URL(w.location.href).searchParams.get('course'),null);
 const exported=await p.exported('导出本次对话');assert(exported.includes(dsp.title));assert(exported.includes(ic.title));assert(exported.includes('free-only-sentinel'));
 const diagnostic=JSON.parse(await p.exported('导出连接诊断'));assert(!JSON.stringify(diagnostic).includes('free-only-sentinel'));assert.equal(w.localStorage.getItem('personal-progress'),'untouched');assert.equal(w.localStorage.length,1);assert.equal(p.fetches,0);p.dom.window.close();
 const q=page('?course=__proto__&exercise=divider&mode=check',true);assert(q.d.querySelector('.local-ai-scope').textContent.includes('习题：'));assert(q.d.querySelector('[aria-label="向本地 AI 提问"]').value.includes('参考要点'));q.dom.window.close();
 const unknown=page('?course=not-in-catalog',true);assert.equal(unknown.d.querySelector('.local-ai-scope strong').textContent,'当前讨论：自由问答');assert.equal(unknown.starts,0);unknown.dom.window.close();
 console.log('Course AI UI passed: public handoff, explicit sending, topic isolation, loaded-model reuse, URL sync, draft recovery, scoped exports and unchanged personal records.');
})().catch(e=>{console.error(e);process.exitCode=1;});
