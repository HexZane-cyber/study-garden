(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LearningModel=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';const KEY='zhixin-learning-progress-v1',states={todo:'未开始',planned:'已加入计划',learning:'正在学习',done:'已完成'};
 function clean(entries,courses,strict=false){const ids=new Set(courses.map(c=>c.id)),out={};if(!entries||typeof entries!=='object'||Array.isArray(entries))throw Error('学习状态格式不正确');
  for(const [id,value]of Object.entries(entries)){if(!ids.has(id))continue;if(!Object.hasOwn(states,value)){if(strict)throw Error('存在无法识别的学习状态');continue;}out[id]=value;}return out;
 }
 function read(storage,courses){try{const data=JSON.parse(storage.getItem(KEY)||'{}');return data.version===1?clean(data.entries,courses):{};}catch{return {};}}
 function save(storage,entries){try{storage.setItem(KEY,JSON.stringify({version:1,entries}));return true;}catch{return false;}}
 function missing(course,entries){return course.prerequisites.filter(id=>entries[id]!=='done');}
 function filter(courses,entries,{query='',category='',level='',status='',ready=false}={}){const q=query.trim().toLowerCase();return courses.filter(c=>(!q||[c.title,c.summary,c.provider,c.category].join(' ').toLowerCase().includes(q))&&(!category||c.category===category)&&(!level||c.level===level)&&(!status||(entries[c.id]||'todo')===status)&&(!ready||!missing(c,entries).length));}
 function route(data,track,entries){const ids=data.tracks[track]||[];const courses=ids.map(id=>data.courses.find(c=>c.id===id)).filter(Boolean);return {courses,done:courses.filter(c=>entries[c.id]==='done').length,next:courses.find(c=>entries[c.id]!=='done'&&!missing(c,entries).length)||courses.find(c=>entries[c.id]!=='done')||null};}
 function backup(entries){return JSON.stringify({format:'zhixin-learning-progress',version:1,entries},null,2);}
 function restore(text,courses){if(text.length>128*1024)throw Error('进度文件过大');let data;try{data=JSON.parse(text);}catch{throw Error('不是有效的 JSON 文件');}if(data.format!=='zhixin-learning-progress'||data.version!==1)throw Error('不是之芯学习进度备份');return clean(data.entries,courses,true);}
 return {KEY,states,read,save,missing,filter,route,backup,restore};
});
