const assert=require('node:assert/strict'),R=require('../docs/assets/review-model.js');
const now=Date.UTC(2026,9,23,8),input={id:'one',question:'为什么二分查找需要有序？',answer:'才能根据比较结果排除一半区间。',deck:'算法',source:'courses/algorithms/'};
let state=R.upsert(R.blank(),input,now);assert.equal(R.due(state,now).length,1);assert.equal(R.due(state,now,'Python').length,0);
const again=R.rate(state,'one','again',now);assert.equal(again.cards[0].due,now+600000);assert.equal(R.due(again,now+599999).length,0);assert.equal(R.due(again,now+600000).length,1);
const hard=R.rate(state,'one','hard',now);assert.equal(hard.cards[0].due,now+R.DAY);
for(const days of [1,3,7,14,30,60,60]){const next=R.rate(state,'one','good',now);assert.equal(next.cards[0].due-now,days*R.DAY);state=next;}
assert.equal(state.cards[0].stage,5);assert.equal(state.cards[0].reps,7);
const edited=R.upsert(state,{...input,question:'修改后的问题'},now+100);assert.equal(edited.cards[0].due,state.cards[0].due);assert.equal(edited.cards[0].reps,7);
const easy=R.rate(R.upsert(R.blank(),input,now),'one','easy',now);assert.equal(easy.cards[0].due-now,3*R.DAY);assert.equal(easy.cards[0].stage,2);
const text=R.backup(state);assert.deepEqual(R.merge(R.blank(),text),state);assert.equal(R.merge(state,text).cards.length,1);assert.equal(R.merge(edited,text).cards[0].question,'修改后的问题');assert.equal(R.merge(state,R.backup(edited)).cards[0].question,'修改后的问题');
for(const raw of ['bad','{}',JSON.stringify({format:'zhixin-review-cards',version:1,cards:[{...state.cards[0],answer:5}]}),R.backup({...state,cards:[state.cards[0],state.cards[0]]})])assert.throws(()=>R.merge(state,raw));
assert.throws(()=>R.merge(state,' '.repeat(2*1024*1024+1)));assert.throws(()=>R.upsert(state,{...input,answer:' '},now));assert.throws(()=>R.upsert(state,{...input,question:'a'.repeat(301)},now));assert.throws(()=>R.rate(state,'missing','good',now));assert.throws(()=>R.rate(state,'one','random',now));
for(const source of ['javascript:alert(1)','https://evil.test/','//evil.test/','../private/','private/?secret=1','courses/../../../'])assert.equal(R.source(source),'');assert.equal(R.source('courses/python/#%E7%AC%94%E8%AE%B0'),'courses/python/#%E7%AC%94%E8%AE%B0');
let raw;const storage={getItem:()=>raw,setItem:(k,v)=>{raw=v;}};assert.deepEqual(R.load(storage),R.blank());R.save(storage,state);assert.deepEqual(R.load(storage),state);raw='bad';assert.throws(()=>R.load(storage));assert.throws(()=>R.save({setItem(){throw Error('quota');}},state));
const full={version:1,cards:Array.from({length:1000},(_,i)=>({...state.cards[0],id:'card-'+i}))};assert.throws(()=>R.upsert(full,input,now));assert.throws(()=>R.merge(full,text));assert.equal(R.upsert(full,{...input,id:'card-0'},now).cards.length,1000);
console.log('Review model passed: intervals, due boundaries, edit history, backup merge, validation, source safety, capacity and storage failures.');
