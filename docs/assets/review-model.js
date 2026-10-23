(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ReviewModel=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const KEY='zhixin-review-v1',DRAFT='zhixin-review-draft-v1',DAY=86400000,LIMIT=1000,intervals=[1,3,7,14,30,60];
 const blank=()=>({version:1,cards:[]});
 const source=value=>typeof value==='string'&&value.length<=500&&/^[a-zA-Z0-9][a-zA-Z0-9/_-]*\/(?:#[^\s<>"']*)?$/.test(value)?value:'';
 function card(raw){
  if(!raw||typeof raw.id!=='string'||!raw.id||raw.id.length>80||typeof raw.question!=='string'||!raw.question.trim()||raw.question.length>300||typeof raw.answer!=='string'||!raw.answer.trim()||raw.answer.length>4000||typeof raw.deck!=='string'||raw.deck.length>40||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>=intervals.length||!Number.isInteger(raw.reps)||raw.reps<0||raw.reps>1000000||![raw.due,raw.updated].every(n=>Number.isSafeInteger(n)&&n>0&&n<8640000000000000))throw Error('卡片字段不完整或超出限制');
  return {id:raw.id,question:raw.question.trim(),answer:raw.answer.trim(),deck:raw.deck.trim(),source:source(raw.source),stage:raw.stage,reps:raw.reps,due:raw.due,updated:raw.updated};
 }
 function clean(raw){if(!raw||raw.version!==1||!Array.isArray(raw.cards)||raw.cards.length>LIMIT)throw Error('不是有效的复习卡数据');const seen=new Set();return {version:1,cards:raw.cards.map(c=>{const next=card(c);if(seen.has(next.id))throw Error('备份包含重复卡片编号');seen.add(next.id);return next;})};}
 function load(storage){const raw=storage.getItem(KEY);return raw?clean(JSON.parse(raw)):blank();}
 function save(storage,state){storage.setItem(KEY,JSON.stringify(state));}
 function upsert(state,input,now=Date.now()){
  const old=state.cards.find(c=>c.id===input.id);if(!old&&state.cards.length>=LIMIT)throw Error('最多保存 1000 张卡片，请先导出并整理');
  const next=card({...input,stage:old?.stage||0,reps:old?.reps||0,due:old?.due||now,updated:now});return {...state,cards:old?state.cards.map(c=>c.id===next.id?next:c):[next,...state.cards]};
 }
 function rate(state,id,rating,now=Date.now()){
  if(!['again','hard','good','easy'].includes(rating))throw Error('未知复习选项');const old=state.cards.find(c=>c.id===id);if(!old)throw Error('这张卡片已被移除');
  const stage=rating==='again'?0:rating==='hard'?Math.max(0,old.stage-1):Math.min(intervals.length-1,old.stage+(rating==='easy'?2:1));
  const delay=rating==='again'?600000:rating==='hard'?DAY:intervals[Math.min(intervals.length-1,old.stage+(rating==='easy'?1:0))]*DAY;
  return {...state,cards:state.cards.map(c=>c.id===id?{...c,stage,reps:Math.min(1000000,c.reps+1),due:now+delay,updated:now}:c)};
 }
 const due=(state,now=Date.now(),deck='')=>state.cards.filter(c=>c.due<=now&&(!deck||c.deck===deck)).sort((a,b)=>a.due-b.due||a.updated-b.updated||a.id.localeCompare(b.id));
 const backup=state=>JSON.stringify({format:'zhixin-review-cards',...state},null,2);
 function merge(state,text){if(text.length>2*1024*1024)throw Error('备份超过 2 MB');let raw;try{raw=JSON.parse(text);}catch{throw Error('不是有效的 JSON 文件');}if(raw.format!=='zhixin-review-cards')throw Error('不是之芯复习卡备份');const incoming=clean(raw),map=new Map(state.cards.map(c=>[c.id,c]));for(const c of incoming.cards){if(!map.has(c.id)||map.get(c.id).updated<c.updated)map.set(c.id,c);}if(map.size>LIMIT)throw Error('合并后超过 1000 张卡片，尚未导入');return {version:1,cards:[...map.values()]};}
 return {KEY,DRAFT,DAY,LIMIT,intervals,blank,source,card,clean,load,save,upsert,rate,due,backup,merge};
});
