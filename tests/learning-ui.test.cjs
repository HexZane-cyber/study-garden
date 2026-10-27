const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function dependency(name){try{return require(name);}catch{return require(`../.tooling/node_modules/${name}`);}}
const {JSDOM}=dependency('jsdom'),root=path.join(__dirname,'..'),data=require('../docs/assets/course-catalog.json');
const M=require('../docs/assets/learning-model.js');
function page(pathname,host){
 const dom=new JSDOM(`<div id="${host}"></div><script id="learning-data" type="application/json"></script>`,{url:'https://test.invalid/study-garden/'+pathname,runScripts:'outside-only'}),w=dom.window,d=w.document;
 d.getElementById('learning-data').textContent=JSON.stringify(data);
 Object.defineProperty(d,'currentScript',{value:{src:'https://test.invalid/study-garden/assets/learning.js'},configurable:true});
 w.localStorage.setItem(M.KEY,JSON.stringify({version:1,entries:{python:'done'}}));
 w.eval(fs.readFileSync(path.join(root,'docs/assets/learning-model.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'docs/assets/learning.js'),'utf8'));
 return {dom,w,d};
}
const button=(d,text)=>[...d.querySelectorAll('button')].find(b=>b.textContent===text);
(async()=>{
 const {dom,w,d}=page('catalog/?keep=1&q=MIT+%E4%BF%A1%E5%8F%B7&track='+encodeURIComponent('信息通信基础'),'course-catalog');
 const search=d.querySelector('[aria-label="搜索课程"]'),track=d.querySelector('[aria-label="学习方向"]');
 assert.equal(search.value,'MIT 信号');assert.equal(track.value,'信息通信基础');assert(d.querySelector('.learning-card h3').textContent.includes('信号'));
 const expected=M.filter(data.courses,{python:'done'},{query:'MIT 信号',track:'信息通信基础'});assert.equal(d.querySelectorAll('.learning-card').length,expected.length);
 const original=w.localStorage.getItem(M.KEY),compare=d.querySelector('[data-compare-id]');compare.click();assert(!d.querySelector('.learning-compare').hidden);
 button(d,'清空筛选').click();assert.equal(search.value,'');assert.equal(track.value,'');assert.equal(w.location.search,'?keep=1');assert.equal(d.querySelectorAll('.learning-card').length,12);assert.equal(w.localStorage.getItem(M.KEY),original);assert(!d.querySelector('.learning-compare').hidden,'reset must retain comparison');
 button(d,'信息通信基础').click();assert.equal(track.value,'信息通信基础');assert.equal(new URL(w.location.href).searchParams.get('track'),'信息通信基础');assert.equal(button(d,'信息通信基础').getAttribute('aria-pressed'),'true');
 search.value='no-such-course-zzzz';search.dispatchEvent(new w.Event('input'));assert(d.querySelector('.learning-empty'));assert(d.querySelector('.learning-more').hidden);
 button(d,'查看全部课程').click();assert.equal(d.activeElement,search);assert.equal(w.localStorage.getItem(M.KEY),original);
 button(d,'再显示 12 门课程').click();assert.equal(d.querySelectorAll('.learning-card').length,24);
 search.value='ＨＤＬＢｉｔｓ';search.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.learning-card').length,1);
 assert.equal(d.querySelector('.learning-course-links a:last-child').href,data.courses.find(c=>c.id==='ic-hdlbits').official);
 let copied='';Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async value=>{copied=value;}},configurable:true});
 button(d,'复制筛选链接').click();await new Promise(resolve=>setImmediate(resolve));assert.equal(new URL(copied).searchParams.get('courseQuery'),'ＨＤＬＢｉｔｓ');assert(!copied.includes('python'));assert(d.querySelector('.learning-share-fallback').hidden);
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true});button(d,'复制筛选链接').click();await new Promise(resolve=>setImmediate(resolve));
 const share=d.querySelector('[aria-label="当前课程筛选链接"]');assert(!d.querySelector('.learning-share-fallback').hidden);assert.equal(share.value,copied);assert.equal(d.activeElement,share);assert.equal(share.selectionEnd,share.value.length);
 w.history.pushState({},'','?q=MIT&level='+encodeURIComponent('基础'));w.dispatchEvent(new w.PopStateEvent('popstate'));assert.equal(search.value,'MIT');assert.equal(track.value,'');assert.equal(d.querySelector('[aria-label="难度"]').value,'基础');assert(d.querySelector('.learning-share-fallback').hidden);
 const reloaded=page('catalog/'+w.location.search,'course-catalog');assert.equal(reloaded.d.querySelector('[aria-label="搜索课程"]').value,'MIT');assert.equal(reloaded.d.querySelector('[aria-label="难度"]').value,'基础');reloaded.dom.window.close();
 w.localStorage.setItem(M.KEY,JSON.stringify({version:1,entries:{python:'done',math:'done'}}));w.dispatchEvent(new w.StorageEvent('storage',{key:M.KEY}));assert(d.querySelector('.learning-summary').textContent.includes('已完成 2 门'));assert.equal(search.value,'MIT');
 dom.window.close();
 const course=page('courses/python/','course-progress');assert(course.d.querySelector('[data-course-id="python"]'));assert.equal(course.d.querySelector('[data-course-id="python"]').value,'done');course.dom.window.close();
 const route=page('roadmap/','learning-route');assert(route.d.querySelector('.learning-route-list'));route.dom.window.close();
 console.log('Learning UI passed: shared filters, full-width search, paging, reset without data loss, original links, clipboard fallback, history, reload and course/route regression.');
})().catch(error=>{console.error(error);process.exitCode=1;});

const migration=fs.readFileSync(path.join(root,'site/catalog/index.html'),'utf8').match(/<script id="catalog-filter-legacy-url">([\s\S]*?)<\/script>/)[1];
for(const [query,expected]of [['?q=MIT&keep=1','MIT'],['?q=old&courseQuery=CMOS&keep=1','CMOS']]){const dom=new JSDOM('',{url:'https://example.test/study-garden/catalog/'+query+'#courses',runScripts:'outside-only'});dom.window.eval(migration);const url=new URL(dom.window.location.href);assert.equal(url.searchParams.get('courseQuery'),expected);assert.equal(url.searchParams.get('q'),null);assert.equal(url.searchParams.get('keep'),'1');assert.equal(url.hash,'#courses');dom.window.close();}
console.log('Legacy catalog links passed: early query migration avoids global-search query collisions and preserves the selected course query.');
