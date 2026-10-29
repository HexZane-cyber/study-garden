const assert=require('node:assert/strict'),P=require('../docs/assets/planner-model.js'),B=require('../docs/assets/backup-model.js');
const now=new Date('2026-10-28T12:00:00').getTime(),today=P.day(now),task={id:'task-a',title:'核对 RC 电路',date:today,course:'ee-circuits',done:false};
const original={...P.blank(),tasks:[task,{...task,id:'task-b',title:'复习采样'}]},running=P.startTask(original,task.id,now,task);
assert.equal(original.timer,null);assert.equal(running.timer.course,task.course);assert.equal(running.timer.taskTitle,task.title);assert.equal(running.timer.taskId,task.id);assert(!running.tasks[0].done);
assert.throws(()=>P.startTask(running,'task-b',now+1),/已有专注/);assert.throws(()=>P.startTask(original,'gone',now),/完成或被删除/);assert.throws(()=>P.startTask({...original,tasks:[{...task,done:true}]},task.id,now),/完成或被删除/);assert.throws(()=>P.startTask({...original,tasks:[{...task,title:'另页新标题'}]},task.id,now,task),/其他页面修改/);
const paused=P.toggleTimer(running,'python',now+65000),resumed=P.toggleTimer(paused,'python',now+100000),ended=P.finish({...resumed,tasks:[]},'fallback',now+165000);
assert.equal(ended.sessions[0].minutes,2);assert.equal(ended.sessions[0].taskTitle,task.title);assert.equal(ended.sessions[0].course,task.course);assert.equal(ended.sessions[0].taskId,task.id);assert.equal(ended.timer,null);
const store={value:JSON.stringify(ended),getItem(){return this.value;},setItem(k,v){this.value=v;}};
assert.deepEqual(P.load(store,[task.course]),ended);assert.deepEqual(P.merge(P.blank(),P.backup(ended),[task.course]).sessions,ended.sessions);
const prepared=B.prepare(JSON.stringify({format:'zhixin-local-data',version:1,sections:{planner:ended}}),[{id:task.course}],'https://test.invalid/');assert.equal(prepared.sections.planner.sessions[0].taskTitle,task.title);
const old={...P.blank(),sessions:[{id:'old',date:today,minutes:15,course:''}]};assert.equal(P.clean(old,[]).sessions[0].taskId,undefined);for(const bad of [{taskId:'x'},{taskId:'x',taskTitle:''},{taskId:'x'.repeat(81),taskTitle:'a'},{taskId:'x',taskTitle:'a'.repeat(121)}]){assert.throws(()=>P.clean({...ended,sessions:[{...ended.sessions[0],...bad,taskTitle:bad.taskTitle}]},[task.course]),/关联格式/);}
const dates=[[-7,100,'ee-circuits'],[-6,10,'ee-circuits'],[-1,20,'python'],[0,30,'ee-circuits'],[1,200,'ee-circuits']];const historyState={...running,sessions:dates.map(([offset,minutes,course],i)=>({id:'s'+i,date:P.shiftDay(today,offset),minutes,course}))};const before=JSON.stringify(historyState),all=P.sessionHistory(historyState,'',now),filtered=P.sessionHistory(historyState,'ee-circuits',now);
assert.equal(all.minutes,60);assert.equal(all.sessions.length,3);assert.equal(filtered.minutes,40);assert.deepEqual(filtered.sessions.map(s=>s.minutes),[30,10]);assert.equal(JSON.stringify(historyState),before);assert.equal(P.sessionHistory({...old,sessions:[...old.sessions,{...old.sessions[0],id:'new'}]},'',now).sessions[0].id,'new');
console.log('Task focus model passed: explicit starts, stale/completed/deleted task guards, no timer replacement, pause/resume totals, historical title retention, legacy and unified backup compatibility, invalid metadata refusal and local-day history bounds.');

{
 const a={id:'remove-a',date:today,minutes:12,course:task.course,taskId:task.id,taskTitle:task.title},b={id:'keep-b',date:today,minutes:8,course:''},state={...running,sessions:[a,b]},before=JSON.stringify(state);
 const removed=P.removeSession(state,a);assert.equal(JSON.stringify(state),before);assert.deepEqual(removed.sessions,[b]);assert.equal(removed.timer,state.timer);assert.equal(removed.tasks,state.tasks);assert.throws(()=>P.removeSession(state,{...a,minutes:13}),/其他页面变化/);assert.throws(()=>P.removeSession(removed,a),/其他页面移除/);
 const extra={id:'new',date:today,minutes:3,course:''},concurrent={...removed,sessions:[b,extra]},restored=P.restoreSession(concurrent,a,0);assert.deepEqual(restored.sessions,[a,b,extra]);assert.equal(restored.timer,state.timer);assert.equal(P.restoreSession({...concurrent,sessions:[{...a,minutes:14},b]},a,0).sessions[0].minutes,14);
 const full={...removed,sessions:Array.from({length:2000},(_,i)=>({...b,id:'full-'+i}))};assert.throws(()=>P.restoreSession(full,a,0),/2000/);assert.equal(full.sessions.length,2000);
 const range={...state,sessions:[a,{...b,date:P.shiftDay(today,-20)},{...extra,date:P.shiftDay(today,-60)}]};assert.equal(P.sessionHistory(range,'',now).minutes,12);assert.equal(P.sessionHistory(range,'',now,30).minutes,20);assert.equal(P.sessionHistory(range,'',now,0).minutes,23);assert.throws(()=>P.sessionHistory(range,'',now,99));
 console.log('Focus record management passed: stale-delete refusal, isolated removal, timer preservation, merge-safe undo, no eviction and 7/30/all-date ranges.');
}

{
 const session={id:'reflect',date:P.day(),minutes:25,course:'python'},state={...P.blank(),sessions:[session],timer:{id:'still-running',elapsed:1,started:Date.now(),course:'python'}},reflection={learned:'能解释采样条件',blocker:'混叠频率还容易出错',next:'重做一道采样题'};
 const next=P.saveReflection(state,session,reflection);assert(!state.sessions[0].reflection);assert.deepEqual(next.sessions[0].reflection,reflection);assert.equal(next.timer,state.timer);
 const round=P.merge(P.blank(),P.backup(next),['python']);assert.deepEqual(round.sessions[0].reflection,reflection);const removed=P.removeSession(next,next.sessions[0]);assert.deepEqual(P.restoreSession(removed,next.sessions[0],0).sessions[0].reflection,reflection);
 assert.throws(()=>P.removeSession(next,session),/变化/);assert.throws(()=>P.saveReflection(next,session,reflection),/其他页面/);assert.throws(()=>P.saveReflection({...state,sessions:[]},session,reflection),/删除/);
 for(const invalid of [null,[],{...reflection,learned:3},{...reflection,next:'a'.repeat(121)},{...reflection,future:'unknown'}])assert.throws(()=>P.clean({...state,sessions:[{...session,reflection:invalid}]},['python']));
 const full={...P.blank(),sessions:Array.from({length:1500},(_,i)=>({...session,id:'reflection-'+i,reflection:{learned:'中'.repeat(400),blocker:'文'.repeat(400),next:'下一步'}}))};const text=P.backup(full);assert(text.length>1024*1024);assert.equal(P.merge(P.blank(),text,['python']).sessions.length,1500);
 console.log('Learning reflection model passed: strict optional schema, legacy compatibility, unchanged timer, backup/undo preservation, conflict guards and large valid backups.');
}
