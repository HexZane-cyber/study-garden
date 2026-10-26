import {prebuiltAppConfig,CreateMLCEngine,hasModelInCache,deleteModelAllInfoInCache} from '@mlc-ai/web-llm';
const allowed=['Qwen2.5-0.5B-Instruct-q4f16_1-MLC','Qwen2.5-1.5B-Instruct-q4f16_1-MLC'];
const appConfig={model_list:prebuiltAppConfig.model_list.filter(m=>allowed.includes(m.model_id)),cacheBackend:'cache'};
let engine=null,busy=false;
self.onmessage=async({data:r})=>{
 const send=(type,value)=>self.postMessage({id:r.id,type,value});let owned=false;
 try{
  if(!['load','chat','cached','remove'].includes(r.type))throw Error('未知模型操作。');
  if(r.type!=='chat'&&!allowed.includes(r.model))throw Error('不支持的模型。');
  if(busy)throw Error('模型正在工作，请稍候。');busy=true;owned=true;
  if(r.type==='cached'){send('done',await hasModelInCache(r.model,appConfig));return;}
  if(r.type==='remove'){await deleteModelAllInfoInCache(r.model,appConfig);send('done',true);return;}
  if(r.type==='load'){engine=await CreateMLCEngine(r.model,{appConfig,logLevel:'WARN',initProgressCallback:p=>send('progress',p)},{context_window_size:4096});send('done',true);return;}
  if(!engine)throw Error('请先加载模型。');
  if(!Array.isArray(r.messages)||r.messages.length>40||r.messages.some(m=>!['system','user','assistant'].includes(m.role)||typeof m.content!=='string')||r.messages.reduce((n,m)=>n+m.content.length,0)>10000)throw Error('问题过长或格式错误。');
  const stream=await engine.chat.completions.create({messages:r.messages,temperature:.3,max_tokens:512,stream:true});let text='';
  for await(const chunk of stream){text+=chunk.choices[0]?.delta?.content||'';send('text',text.slice(0,6000));if(text.length>=6000){engine.interruptGenerate();break;}}
  send('done',text.slice(0,6000));
 }catch(error){send('error',String(error.message||error).slice(0,500));}finally{if(owned)busy=false;}
};
