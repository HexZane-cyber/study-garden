const allowed=['Qwen2.5-0.5B-Instruct-q4f16_1-MLC','Qwen2.5-1.5B-Instruct-q4f16_1-MLC'];
function validate(id){if(!allowed.includes(id))throw Error('不支持的网页模型。');}
function client(url){
 const worker=new Worker(url),pending=new Map();let sequence=0,closed=false;
 function close(error=new DOMException('已停止并卸载模型。','AbortError')){if(closed)return;closed=true;worker.terminate();for(const task of pending.values())task.reject(error);pending.clear();}
 worker.onerror=e=>close(Error(e.message||'模型工作线程失败，请重试或使用本机 Ollama。'));
 worker.onmessage=({data:r})=>{const task=pending.get(r.id);if(!task)return;if(r.type==='progress')task.onProgress?.(r.value);else if(r.type==='text')task.onToken?.(r.value);else{pending.delete(r.id);r.type==='error'?task.reject(Error(r.value)):task.resolve(r.value);}};
 function call(type,value={},callbacks={}){return new Promise((resolve,reject)=>{if(closed){reject(new DOMException('模型已卸载。','AbortError'));return;}const id=++sequence;pending.set(id,{resolve,reject,...callbacks});try{worker.postMessage({id,type,...value});}catch(error){pending.delete(id);reject(error);}});}
 return {call,close};
}
export const version='0.2.86';
async function cacheTask(id,url,type){validate(id);const c=client(url);let timer;try{return await Promise.race([c.call(type,{model:id}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('缓存操作超时，请重试。')),60000);})]);}finally{clearTimeout(timer);c.close();}}
export function cached(id,url){return cacheTask(id,url,'cached');}
export function remove(id,url){return cacheTask(id,url,'remove');}
export function start(url,id,onProgress){
 validate(id);const c=client(url),ready=c.call('load',{model:id},{onProgress});
 return {ready,close:c.close,async generate(messages,onToken){await ready;let timer;try{return await Promise.race([c.call('chat',{messages},{onToken}),new Promise((_,reject)=>{timer=setTimeout(()=>{reject(Error('生成超过两分钟，已卸载模型；可重新加载后缩短提问。'));c.close();},120000);})]);}finally{clearTimeout(timer);}}};
}
