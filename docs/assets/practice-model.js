(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PracticeModel=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const KEY='zhixin-practice-v1',HANDOFF_KEY='zhixin-ai-exercise-v1',LIMIT=256*1024;
 function evaluate(q,answer){
  const text=String(answer??'').normalize('NFKC').replace(/−/g,'-').trim();
  if(!text)return {valid:false,correct:false,message:'先填写答案，再检查。'};
  if(q.kind==='explain')return {valid:true,correct:false,manual:true,message:'解释题不自动判分。请按参考要点自查，或让本地 AI 检查推理。'};
  if(q.kind==='choice')return /^\d+$/.test(text)&&Number(text)<q.options.length?{valid:true,correct:Number(text)===q.correct,message:Number(text)===q.correct?'选择正确。再试着解释为什么其他选项不成立。':'暂不正确。可以先看提示，再独立重试。'}:{valid:false,correct:false,message:'请选择一个选项。'};
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)||!Number.isFinite(Number(text)))return {valid:false,correct:false,message:'只填写有限数值，单位按题目要求；可用科学计数法，例如 3.2e-3。'};
  const correct=Math.abs(Number(text)-q.expected)<=Math.max(q.absTolerance||0,Math.abs(q.expected)*(q.relTolerance||0));
  return {valid:true,correct,message:correct?'数值在本题允许误差内。请再检查单位和适用条件。':'数值暂不匹配。先检查单位、正负号和模型条件，再看提示。'};
 }
 function clean(records,questions){
  if(!records||typeof records!=='object'||Array.isArray(records))throw Error('练习记录格式不正确。');
  const out={},byId=new Map(questions.map(q=>[q.id,q]));
  for(const [id,r]of Object.entries(records)){
   if(!byId.has(id))continue;
   if(!r||typeof r!=='object'||typeof r.answer!=='string'||r.answer.length>2000||typeof r.checked!=='boolean'||typeof r.revealed!=='boolean'||!Number.isInteger(r.hints)||r.hints<0||r.hints>byId.get(id).hints.length)throw Error('练习记录含无效字段。');
   out[id]={answer:r.answer,checked:r.checked,revealed:r.revealed,hints:r.hints};
  }
  return out;
 }
 function read(storage,questions){try{const raw=storage.getItem(KEY);if(raw===null)return {records:{},writable:true};if(raw.length>LIMIT)throw Error('练习记录过大。');const data=JSON.parse(raw);if(data.version!==1)throw Error('练习记录版本不支持。');return {records:clean(data.records,questions),writable:true};}catch{return {records:{},writable:false,error:'无法读取原有练习记录，已停止覆盖。可导出原始记录后再处理；本次仍可临时作答。'};}}
 function save(storage,records,questions){if(!read(storage,questions).writable)return false;try{storage.setItem(KEY,JSON.stringify({version:1,records:clean(records,questions)}));return true;}catch{return false;}}
 function state(q,record){
  if(!record?.answer.trim())return 'unanswered';
  if(q.kind==='explain')return 'manual';
  const result=evaluate(q,record.answer);
  if(!record.checked||!result.valid)return 'draft';
  return result.correct?'correct':'wrong';
 }
 function counts(questions,records){const out={all:questions.length,unanswered:0,draft:0,wrong:0,correct:0,manual:0};for(const q of questions)out[state(q,records[q.id])]++;return out;}
 function filter(questions,records,criteria={}){
  const terms=String(criteria.query||'').normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
  return questions.filter(q=>(!criteria.id||q.id===criteria.id)&&(!criteria.topic||q.topic===criteria.topic)&&(!criteria.level||q.level===criteria.level)&&(!criteria.state||state(q,records[q.id])===criteria.state)&&terms.every(t=>[q.title,q.prompt,q.topic].join(' ').normalize('NFKC').toLowerCase().includes(t)));
 }
 function progress(questions,records){const c=counts(questions,records);return {attempted:c.all-c.unanswered,correct:c.correct,total:c.all};}
 function backup(records,questions){return JSON.stringify({format:'zhixin-practice',version:1,records:clean(records,questions)},null,2);}
 function restore(text,questions){if(text.length>LIMIT)throw Error('备份不能超过 256 KB。');let data;try{data=JSON.parse(text);}catch{throw Error('不是有效的 JSON 文件。');}if(data.format!=='zhixin-practice'||data.version!==1)throw Error('不是之芯练习记录备份。');return clean(data.records,questions);}
 function merge(current,incoming){const out={...incoming,...current};for(const [id,r]of Object.entries(incoming))if(!current[id]?.answer.trim()&&r.answer.trim())out[id]=r;return out;}
 function blank(){return {answer:'',checked:false,revealed:false,hints:0};}
 return {KEY,HANDOFF_KEY,LIMIT,evaluate,clean,read,save,state,counts,filter,progress,backup,restore,merge,blank};
});
