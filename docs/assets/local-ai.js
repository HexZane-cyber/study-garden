(()=>{
 'use strict';
 const source=document.currentScript,host=document.getElementById('local-ai-app'),M=window.LocalAIModel;if(!host||!M)return;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const button=text=>{const b=el('button',text);b.type='button';return b;},label=(text,input)=>{const l=el('label',text);l.append(input);return l;};
 const select=(name,items)=>{const s=el('select');s.setAttribute('aria-label',name);for(const [value,text]of items){const o=el('option',text);o.value=value;s.append(o);}return s;};
 const questions=JSON.parse(document.getElementById('practice-data')?.textContent||'{"questions":[]}').questions,courses=JSON.parse(document.getElementById('ai-course-data')?.textContent||'{"courses":[]}').courses,base=new URL('../',source.src);
 let activeCourse=null,scope='free',scopeName='自由问答',previousScope='free';
 let session=null,ready=false,busy=false,epoch=0,controller=null,history=[],context=null,runtimePromise=null,profile=null,issue=null,phase='idle',previousDraft=null,lastPrompt='',lastFailed=false;
 const backend=select('AI 运行方式',[['browser','网页内运行 · WebGPU'],['ollama','连接本机 Ollama']]),models=select('网页模型',M.models.map(m=>[m.id,m.title]));
 const info=el('p',undefined,'local-ai-model-info'),gpu=button('检测 WebGPU'),load=button('下载并加载模型'),stop=button('停止 / 卸载'),cache=button('检查模型缓存'),remove=button('删除所选模型缓存');
 const devicePanel=el('details',undefined,'local-ai-device');devicePanel.hidden=true;
 const browserBox=el('div',undefined,'local-ai-backend'),browserActions=el('div',undefined,'practice-actions');browserActions.append(gpu,load,stop,cache,remove);browserBox.append(label('网页模型',models),info,browserActions,devicePanel);
 const address=el('input');address.type='url';address.value='http://127.0.0.1:11434';address.setAttribute('aria-label','本机 Ollama 地址');
 const installed=select('本机已安装模型',[]),connect=button('读取本机模型'),ollamaBox=el('div',undefined,'local-ai-backend');ollamaBox.hidden=true;
 ollamaBox.append(label('本机 Ollama 地址',address),connect,label('本机已安装模型',installed),el('p','仅连接本机回环地址。请自行启动服务、安装本地模型，并按下方说明允许当前网站来源。'));const ollamaStop=button('停止本次请求'),copyOrigin=button('复制当前网页来源'),originField=el('input');originField.readOnly=true;originField.hidden=true;originField.setAttribute('aria-label','当前网页来源');ollamaBox.append(ollamaStop,copyOrigin,originField);
 const status=el('p','尚未连接。模型只会在你点击“下载并加载”后下载；不会自动读取笔记。','local-ai-status');status.setAttribute('role','status');
 const progress=el('progress');progress.max=1;progress.value=0;progress.hidden=true;progress.setAttribute('aria-label','模型加载进度');
 const help=el('section',undefined,'local-ai-help'),helpTitle=el('h3'),helpList=el('ol');help.hidden=true;help.append(helpTitle,helpList);
 const scopeBox=el('div',undefined,'local-ai-scope'),scopeLabel=el('strong','当前讨论：自由问答'),newTopic=button('新建自由问答');scopeLabel.setAttribute('role','status');scopeBox.append(scopeLabel,newTopic);
 const courseBox=el('div',undefined,'local-ai-course'),coursePicker=select('选择讨论课程',[['','选择一门课程（可选）'],...courses.map(c=>[c.id,c.title])]),courseIntent=select('课程辅助方式',Object.entries(M.courseIntents)),prepareCourse=button('填入课程提问'),exitCourse=button('退出课程模式'),courseInfo=el('details',undefined,'local-ai-course-info'),courseFacts=el('p'),courseLink=el('a','打开课程指南 →');courseInfo.hidden=true;exitCourse.hidden=true;courseInfo.append(el('summary','发送时会带入的公开课程资料'),courseFacts,courseLink);courseBox.append(label('讨论哪门课程',coursePicker),label('希望怎样帮助',courseIntent),prepareCourse,exitCourse,courseInfo);
 const contextBox=el('div',undefined,'local-ai-context'),contextTitle=el('p'),mode=select('习题辅助方式',[['hint','只给提示'],['check','检查我的解答'],['explain','逐步讲解']]),answer=el('textarea');answer.rows=3;answer.maxLength=2000;answer.setAttribute('aria-label','交给 AI 的习题作答');
 const draft=button('把题目填入提问框'),leave=button('退出习题模式');contextBox.hidden=true;contextBox.append(contextTitle,label('辅助方式',mode),label('你的作答（可补充推理）',answer),draft,leave);
 const chat=el('div',undefined,'local-ai-chat');chat.setAttribute('role','log');chat.setAttribute('aria-label','本次本地 AI 对话');
 const input=el('textarea');input.rows=4;input.maxLength=2400;input.placeholder='例如：为什么采样定理不能直接推出信道容量？';input.setAttribute('aria-label','向本地 AI 提问');
 const quick=el('div',undefined,'local-ai-quick'),templateButtons=[];quick.append(el('p','先填入一个提问草稿：'));for(const template of M.templates){const b=button(template.title);b.onclick=()=>{if(busy||context||activeCourse)return;setDraft(template.text);status.textContent='模板已填入，补全【】里的内容后再发送。上一份草稿可以恢复。';};templateButtons.push(b);quick.append(b);}
 const counter=el('p','0 / 2400 字符','local-ai-footnote'),undoDraft=button('恢复上一份草稿'),recover=button('恢复上次提问'),diagnose=button('导出连接诊断');
 const send=button('发送给本地 AI'),clear=button('清空本次对话'),exportChat=button('导出本次对话'),actions=el('div',undefined,'practice-actions');actions.append(send,clear,exportChat,diagnose,undoDraft,recover);
 host.append(el('h2','本地 AI 学习助手'),scopeBox,label('运行方式',backend),browserBox,ollamaBox,status,progress,help,courseBox,contextBox,quick,chat,label('你的问题（Ctrl / ⌘ + Enter 发送）',input),counter,actions,el('p','对话只保留在当前页面内存中；刷新即清空，可主动导出。小模型可能算错，请用公式、教材与本站参考解析核对。','local-ai-footnote'));
 function refresh(){const browser=backend.value==='browser';models.disabled=busy||ready;backend.disabled=busy;load.disabled=busy||ready;gpu.disabled=busy;cache.disabled=busy||ready;remove.disabled=busy||ready;connect.disabled=busy;installed.disabled=busy;address.disabled=busy;send.disabled=busy||!ready;stop.disabled=!session&&!busy;ollamaStop.disabled=!busy;clear.disabled=busy;mode.disabled=busy;answer.disabled=busy;draft.disabled=busy;leave.disabled=busy;browserBox.hidden=!browser;ollamaBox.hidden=browser;quick.hidden=!!context||!!activeCourse;coursePicker.disabled=busy;courseIntent.disabled=busy;prepareCourse.disabled=busy||!coursePicker.value;exitCourse.disabled=busy;exitCourse.hidden=!activeCourse;newTopic.disabled=busy;templateButtons.forEach(b=>b.disabled=busy);undoDraft.hidden=previousDraft===null;undoDraft.disabled=busy;recover.hidden=!lastFailed;recover.disabled=busy;copyOrigin.disabled=busy;host.dataset.phase=phase;}
 function renderDevice(){if(!profile)return;devicePanel.hidden=false;devicePanel.replaceChildren(el('summary','设备与模型建议'));const list=el('ul');M.deviceAdvice(profile,models.value).forEach(text=>list.append(el('li',text)));devicePanel.append(list);}
 function modelInfo(){const m=M.models.find(x=>x.id===models.value);info.replaceChildren(el('span',m.download+' 下载量；'+m.memory+'（参考值，实际随设备变化）。首次需访问模型托管服务。 '));const a=el('a','模型来源与许可');a.href=m.url;a.target='_blank';a.rel='noopener';info.append(a);renderDevice();}
 function showIssue(error){issue=M.failure(error,backend.value);phase='error';helpTitle.textContent=issue.title;helpList.replaceChildren();issue.steps.forEach(text=>helpList.append(el('li',text)));help.hidden=false;}
 function clearIssue(){issue=null;help.hidden=true;}
 function countInput(){counter.textContent=input.value.length+' / 2400 字符';}
 function setDraft(text,originScope=scope){previousDraft=input.value;previousScope=originScope;input.value=text;countInput();refresh();input.focus({preventScroll:true});}
 undoDraft.onclick=()=>{if(previousDraft===null||busy)return;const value=previousDraft,crossTopic=previousScope!==scope;previousDraft=null;if(crossTopic)returnFree();input.value=value;countInput();refresh();status.textContent=crossTopic?'已恢复上一份草稿，并切换到自由问答。确认内容后再发送。':'已恢复上一份草稿，尚未发送。';};
 recover.onclick=()=>{if(!lastFailed||busy)return;setDraft(lastPrompt);lastFailed=false;refresh();status.textContent='已恢复上次提问。确认模型就绪后，可以修改内容再发送。';};
 input.oninput=countInput;
 copyOrigin.onclick=async()=>{originField.value=location.origin;try{await navigator.clipboard.writeText(location.origin);originField.hidden=true;status.textContent='已复制当前网页来源，用于核对 Ollama 的来源许可。';}catch{originField.hidden=false;originField.focus();originField.select();status.textContent='可手动复制上面的网页来源；它不含页面路径和参数。';}};
 diagnose.onclick=()=>{const data=M.diagnostic({backend:backend.value,model:backend.value==='browser'?models.value:installed.value,phase,issue,profile,origin:location.origin,endpoint:address.value,runtimeLoaded:!!window.ZhixinWebLLM}),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download='zhixin-ai-diagnostic.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='诊断已导出，只包含运行方式、模型、检测结果和错误分类，不含题目、作答或聊天文本。';};
 function message(role,text){const item=el('div',undefined,'local-ai-message '+role),name=el('strong',role==='user'?'你':'本地 AI'),topic=el('small',scopeName,'local-ai-message-scope'),body=el('p',text);item.dataset.scope=scope;item.append(name,topic,body);chat.append(item);return body;}
 function syncTopicURL(){
  if(!/\/local-ai\/(?:index.html)?$/.test(location.pathname))return;
  const url=new URL(location.href);for(const key of ['course','intent','exercise','mode'])url.searchParams.delete(key);
  if(activeCourse){url.searchParams.set('course',activeCourse.id);url.searchParams.set('intent',courseIntent.value);}else if(context){url.searchParams.set('exercise',context.id);url.searchParams.set('mode',mode.value);}
  try{window.history.replaceState(null,'',url);}catch{}
 }
 function activateScope(key,name,force=false){
  if(force||scope!==key){history=[];lastPrompt='';lastFailed=false;if(chat.children.length)chat.append(el('p','切换讨论：'+name+'。此前对话保留供导出，不带入新主题。','local-ai-divider'));}
  scope=key;scopeName=name;scopeLabel.textContent='当前讨论：'+name;
 }
 function returnFree(){context=null;activeCourse=null;contextBox.hidden=true;courseInfo.hidden=true;coursePicker.value='';activateScope('free','自由问答');syncTopicURL();}
 function receiveCourse(data){
  const course=courses.find(c=>c.id===data.id);if(!course)return;
  if(busy){status.textContent='助手正在处理当前操作。请先停止或等待完成，再选择课程。';return;}
  const oldScope=scope;activateScope('course:'+course.id,'课程：'+course.title);context=null;contextBox.hidden=true;activeCourse=course;coursePicker.value=course.id;courseIntent.value=Object.hasOwn(M.courseIntents,data.intent)?data.intent:'review';
  courseFacts.textContent=M.courseFacts(course,courses);courseLink.href=new URL(course.url,base).href;courseInfo.hidden=false;courseInfo.open=true;
  setDraft(M.coursePrompt(course,courseIntent.value),oldScope);syncTopicURL();status.textContent=ready?'已填入课程提问，发送时附带展开区域中的公开简介与先修列表。可编辑后再发送。':'已填入课程提问。先加载网页模型或连接本机服务，再确认发送；附带的公开资料可在下方核对。';
 }
 coursePicker.onchange=refresh;prepareCourse.onclick=()=>receiveCourse({id:coursePicker.value,intent:courseIntent.value});exitCourse.onclick=()=>{returnFree();input.value='';countInput();refresh();};
 newTopic.onclick=()=>{if(busy)return;const oldScope=scope;context=null;activeCourse=null;contextBox.hidden=true;courseInfo.hidden=true;coursePicker.value='';activateScope('free','自由问答',true);syncTopicURL();setDraft('',oldScope);status.textContent='已开始新的自由问答。旧对话仍可导出，新的请求使用新的上下文。';};
 addEventListener('zhixin:course',event=>receiveCourse(event.detail||{}));
 function errorText(error){return String(error.message||error).slice(0,500);}
 function reset(text){if(busy&&phase==='generating')lastFailed=!!lastPrompt;epoch++;controller?.abort();controller=null;session?.close();session=null;ready=false;busy=false;phase='idle';progress.hidden=true;clearIssue();status.textContent=text;refresh();}
 function runtime(){if(window.ZhixinWebLLM)return Promise.resolve(window.ZhixinWebLLM);if(runtimePromise)return runtimePromise;runtimePromise=new Promise((resolve,reject)=>{const script=el('script');script.src=source.dataset.runtime;script.onload=()=>{if(window.ZhixinWebLLM)resolve(window.ZhixinWebLLM);else{runtimePromise=null;reject(Error('运行库没有正确加载，请刷新重试。'));}};script.onerror=()=>{runtimePromise=null;script.remove();reject(Error('运行库下载失败，请检查网站连接后重试。'));};document.head.append(script);});return runtimePromise;}
 async function detect(){if(!isSecureContext||!navigator.gpu)throw Error('当前环境没有 WebGPU。请使用更新的桌面 Edge / Chrome 并开启浏览器硬件加速，或选择本机 Ollama。');let timer;const adapter=await Promise.race([navigator.gpu.requestAdapter(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('WebGPU 检测超时，可重试或使用本机 Ollama。')),10000);})]).finally(()=>clearTimeout(timer));if(!adapter)throw Error('没有可用的 WebGPU 显卡适配器，请选择本机 Ollama。');return adapter;}
 async function inspect(adapter){
  let estimate=null,timer;try{estimate=await Promise.race([Promise.resolve(navigator.storage?.estimate?.()),new Promise(resolve=>{timer=setTimeout(()=>resolve(null),2000);})]);}catch{}finally{clearTimeout(timer);}
  let adapterName='';try{const info=adapter.info||{};adapterName=[info.vendor,info.architecture,info.description].filter(Boolean).join(' / ').slice(0,180);}catch{}
  return {webgpu:true,f16:!!adapter.features?.has('shader-f16'),adapter:adapterName,quota:estimate?.quota,usage:estimate?.usage};
 }
 gpu.onclick=async()=>{const token=++epoch;busy=true;phase='detect';clearIssue();refresh();try{const adapter=await detect(),result=await inspect(adapter);if(token!==epoch)return;profile=result;renderDevice();devicePanel.open=true;phase=ready?'ready':'idle';status.textContent='设备检测完成。模型是否可运行仍以实际加载为准，建议先验证 0.5B。';}catch(error){if(token===epoch){showIssue(error);status.textContent=errorText(error);}}finally{if(token===epoch){busy=false;refresh();}}};
 load.onclick=async()=>{const token=++epoch;busy=true;phase='loading';clearIssue();progress.hidden=false;progress.removeAttribute('value');status.textContent='检查兼容性并加载运行库；随后按所选模型下载或读取缓存……';refresh();try{const adapter=await detect(),result=await inspect(adapter);if(token!==epoch)return;profile=result;renderDevice();devicePanel.open=true;const R=await runtime();if(token!==epoch)return;session=R.start(source.dataset.worker,models.value,p=>{if(token!==epoch)return;progress.value=Math.max(0,Math.min(1,Number(p.progress)||0));status.textContent=String(p.text||'加载模型……').slice(0,300);});await session.ready;if(token!==epoch)return;ready=true;phase='ready';devicePanel.open=false;status.textContent='模型已就绪，在本网页工作线程中运行。现在可提问或从习题卡片选择 AI 提示。';}catch(error){if(token===epoch){session?.close();session=null;ready=false;showIssue(error);status.textContent='加载失败：'+errorText(error)+' 失败不代表缓存已完整。';}}finally{if(token===epoch){busy=false;progress.hidden=true;refresh();}}};
 stop.onclick=()=>reset('已停止并卸载网页模型；已下载的缓存保留，可重新加载。');
 ollamaStop.onclick=()=>{if(phase==='generating')lastFailed=!!lastPrompt;epoch++;controller?.abort();controller=null;busy=false;phase=ready?'ready':'idle';status.textContent='已取消浏览器请求。本机服务是否停止计算由 Ollama 管理。';refresh();};
 for(const [b,type]of [[cache,'cached'],[remove,'remove']])b.onclick=async()=>{if(type==='remove'&&!confirm('删除所选模型在当前网站来源下的缓存？之后使用需要重新下载。'))return;const token=++epoch;busy=true;phase='cache';clearIssue();status.textContent='正在处理所选模型缓存……';refresh();try{const R=await runtime();if(token!==epoch)return;const result=await R[type](models.value,source.dataset.worker);if(token===epoch){phase='idle';status.textContent=type==='remove'?'已请求删除所选模型缓存。':'模型缓存'+(result?'已存在；完整可用性仍以加载结果为准。':'尚未就绪或不完整。');}}catch(error){if(token===epoch){showIssue(error);status.textContent='缓存操作失败：'+errorText(error);}}finally{if(token===epoch){busy=false;refresh();}}};
 async function request(path,body,timeout){const origin=M.endpoint(address.value),abort=new AbortController();controller=abort;const timer=setTimeout(()=>abort.abort(),timeout);try{const response=await fetch(origin+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:abort.signal,credentials:'omit',redirect:'error'});if(!response.ok)throw Error('本机服务返回 HTTP '+response.status);const text=await response.text();if(text.length>1024*1024)throw Error('本机服务回复过大。');return JSON.parse(text);}finally{clearTimeout(timer);if(controller===abort)controller=null;}}
 connect.onclick=async()=>{const token=++epoch;ready=false;busy=true;phase='connecting';clearIssue();refresh();status.textContent='正在读取本机模型……';try{const names=M.localModels(await request('/api/tags',null,10000));if(token!==epoch)return;installed.replaceChildren();names.forEach(name=>{const o=el('option',name);o.value=name;installed.append(o);});ready=names.length>0;phase=ready?'ready':'idle';status.textContent=ready?'已读取本机模型，发送时交给该服务运行；请确认所选模型已完整下载。':'没有检测到已安装的本地模型，请先按下方步骤下载。';if(!ready)showIssue(Error('没有已安装的本地模型。'));}catch(error){if(token===epoch){showIssue(error);status.textContent='未能连接：'+errorText(error);}}finally{if(token===epoch){busy=false;refresh();}}};
 backend.onchange=()=>reset('已切换运行方式，请先加载网页模型或读取本机模型。');models.onchange=()=>{modelInfo();};address.oninput=()=>{ready=false;phase='idle';clearIssue();installed.replaceChildren();refresh();};
 function fill(originScope=scope){if(context)setDraft(M.exercisePrompt(context,mode.value,answer.value),originScope);}
 function receive(data){const q=questions.find(q=>q.id===data.id);if(!q)return;if(busy){status.textContent='助手正在处理当前操作。请先停止或等待完成，再选择另一道题。';return;}const oldScope=scope;activateScope('exercise:'+q.id,'习题：'+q.title);activeCourse=null;courseInfo.hidden=true;coursePicker.value='';context=q;contextTitle.textContent='正在讨论：'+q.title+'（只传入这道公开题目与下方作答）';mode.value=['hint','check','explain'].includes(data.mode)?data.mode:'hint';answer.value=String(data.answer||'').slice(0,2000);contextBox.hidden=false;fill(oldScope);syncTopicURL();host.scrollIntoView?.({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?'auto':'smooth',block:'start'});input.focus({preventScroll:true});}
 draft.onclick=()=>fill();mode.onchange=()=>{fill();syncTopicURL();};leave.onclick=()=>{returnFree();input.value='';countInput();refresh();};addEventListener('zhixin:exercise',event=>receive(event.detail||{}));
 send.onclick=async()=>{
  if(busy||!ready)return;let messages;try{messages=M.messages(history,input.value,activeCourse?M.courseFacts(activeCourse,courses):M.exerciseFacts(context));}catch(error){status.textContent=errorText(error);return;}
  const text=input.value.trim(),token=++epoch;lastPrompt=text;lastFailed=false;busy=true;phase='generating';clearIssue();refresh();message('user',text);const output=message('assistant','正在思考……');status.textContent='本地模型正在生成，首次回复可能较慢。';input.value='';countInput();let result='';
  try{if(backend.value==='browser'){result=await session.generate(messages,value=>{if(token===epoch)output.textContent=value;});}else{const response=await request('/api/chat',{model:installed.value,messages,stream:false,options:{temperature:.3,num_ctx:4096,num_predict:512}},120000);result=response.message?.content;if(typeof result!=='string')throw Error('本机服务没有返回文字解答。');result=result.slice(0,6000);}if(token!==epoch){output.textContent+='\n[本次已停止，未加入后续上下文]';return;}if(!result.trim())throw Error('模型没有返回内容，请缩短问题后重试。');output.textContent=result;history.push({role:'user',content:text},{role:'assistant',content:result});if(history.length>20)history=history.slice(-20);phase='ready';lastFailed=false;status.textContent='生成完成。请核对条件、单位与计算；AI 回复不参与练习判分。';}
  catch(error){if(token===epoch){lastFailed=true;showIssue(error);output.textContent+='\n[未完成]';status.textContent='生成未完成：'+errorText(error);if(backend.value==='browser'){session?.close();session=null;ready=false;}}else output.textContent+='\n[已停止，未加入后续上下文]';}
  finally{if(token===epoch){busy=false;refresh();}}
 };
 input.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send.click();}};
 clear.onclick=()=>{history=[];lastPrompt='';lastFailed=false;previousDraft=null;chat.replaceChildren();refresh();status.textContent='本次对话已清空。';};
 exportChat.onclick=()=>{const text=[...chat.querySelectorAll('.local-ai-message')].map(n=>n.querySelector('strong').textContent+' · '+n.querySelector('.local-ai-message-scope').textContent+'\n'+n.querySelector('p').textContent).join('\n\n');if(!text){status.textContent='本次还没有可导出的对话。';return;}const url=URL.createObjectURL(new Blob(['之芯本地 AI 对话（请自行核验）\n\n'+text],{type:'text/plain;charset=utf-8'})),a=el('a');a.href=url;a.download='zhixin-local-ai.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 addEventListener('pagehide',()=>{controller?.abort();session?.close();});
 modelInfo();refresh();
 // Embedded exercise pages keep their own navigation; only explicit AI buttons activate this panel.
 const standalone=/\/local-ai\/(?:index\.html)?$/.test(location.pathname);
 if(standalone){
 const params=new URLSearchParams(location.search);let carried=null;
 try{const raw=sessionStorage.getItem('zhixin-ai-exercise-v1');carried=M.handoff(raw,questions);if(raw)sessionStorage.removeItem('zhixin-ai-exercise-v1');}catch{}
 const linkedCourse=courses.find(c=>c.id===params.get('course')),linkedExercise=questions.find(q=>q.id===params.get('exercise'));
 if(linkedCourse)receiveCourse({id:linkedCourse.id,intent:params.get('intent')});
 else if(linkedExercise)receive({id:linkedExercise.id,mode:params.get('mode'),answer:carried?.id===linkedExercise.id?carried.answer:''});
 else if(carried&&!params.has('course')&&!params.has('exercise'))receive(carried);
 else if(params.has('course')||params.has('exercise'))status.textContent='链接中的课程或题目不在当前目录中，可以手动选择课程或开始自由问答。';
 }

})();
