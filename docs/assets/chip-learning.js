(function(root,factory){const api=typeof module==='object'&&module.exports?factory(require('./learning-model.js')):factory(root.LearningModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.ChipLearning=api;})(typeof window!=='undefined'?window:globalThis,function(M){
 'use strict';
 const colors={todo:'#927b8b',planned:'#d5ac68',learning:'#ed718d',done:'#91bbaa'};
 function read(storage,courses){try{const text=storage.getItem(M.KEY);let entries={};if(text!==null){if(text.length>128*1024)throw Error('size');const data=JSON.parse(text);if(data.version!==1||!data.entries||typeof data.entries!=='object'||Array.isArray(data.entries))throw Error('format');entries=M.restore(JSON.stringify({format:'zhixin-learning-progress',version:1,entries:data.entries}),courses);}const counts={todo:0,planned:0,learning:0,done:0};for(const c of courses)counts[entries[c.id]||'todo']++;return {available:true,entries,counts};}catch{return {available:false,entries:{},counts:null};}}
 function index(courses){return new Map(courses.map(c=>[c.path,c]));}
 function state(report,course){return report.available&&course?(report.entries[course.id]||'todo'):null;}
 return {read,index,state,colors,states:M.states,KEY:M.KEY};
});
