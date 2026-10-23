(() => {
 'use strict';
 const host=document.getElementById('review-workspace');if(!host)return;
 const R=window.ReviewModel,base=new URL('../',document.currentScript.src);
 document.body.classList.add('planner-page');
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=fn;return b;};
 const status=el('p','','planner-status');status.setAttribute('role','status');host.append(status);
 let state=R.blank(),current=null,revealed=false,removed=null,reviewed=0,shown=50,query='',deck='',wake;
 function read(){try{state=R.load(localStorage);return true;}catch{status.textContent='读取失败，未覆盖任何数据。请检查浏览器存储设置或原始备份。';return false;}}
 function commit(change,message){if(!read())return false;try{const next=change(state);R.save(localStorage,next);state=next;render();status.textContent=message;return true;}catch(error){status.textContent='未保存：'+error.message;return false;}}
 const stats=el('div',undefined,'study-stats'),grid=el('div',undefined,'study-grid');host.append(stats,grid);
 const practice=el('section',undefined,'study-panel review-practice'),deckSelect=el('select'),cardHost=el('div');deckSelect.setAttribute('aria-label','复习分组');deckSelect.onchange=()=>{deck=deckSelect.value;current=null;revealed=false;render();};practice.append(el('h2','今天记起一点什么'),deckSelect,cardHost);grid.append(practice);
 const editor=el('section',undefined,'study-panel review-editor'),form=el('form'),editorTitle=el('h2','创建复习卡');editor.append(editorTitle,form);grid.append(editor);
 function field(label,tag,max){const wrapper=el('label',label),input=el(tag);input.maxLength=max;input.setAttribute('aria-label',label);wrapper.append(input);form.append(wrapper);return input;}
 const question=field('问题','textarea',300),answer=field('答案','textarea',4000),group=field('分组（可选）','input',40),source=el('p','','study-caption');question.required=answer.required=true;question.rows=2;answer.rows=5;question.placeholder='一个你想真正记住的问题';answer.placeholder='用自己的话写下答案';
 let editId=null,sourcePath='';
 const save=el('button','保存卡片','study-primary');save.type='submit';const cancel=button('清空草稿',resetForm);form.append(source,save,cancel);
 function resetForm(){editId=null;sourcePath='';form.reset();source.textContent='';editorTitle.textContent='创建复习卡';save.textContent='保存卡片';cancel.textContent='清空草稿';}
 form.onsubmit=e=>{e.preventDefault();const id=editId||crypto.randomUUID();if(commit(s=>{if(editId&&!s.cards.some(c=>c.id===id))throw Error('这张卡片已在其他页面删除，请取消编辑后重新创建');return R.upsert(s,{id,question:question.value,answer:answer.value,deck:group.value,source:sourcePath});},editId?'卡片已更新，保留原有复习进度。':'卡片已保存，现在可以开始回忆。'))resetForm();};
 function edit(card){editId=card.id;sourcePath=card.source;question.value=card.question;answer.value=card.answer;group.value=card.deck;source.textContent=card.source?'来源：'+card.source:'';editorTitle.textContent='编辑复习卡';save.textContent='保存修改';cancel.textContent='取消编辑';question.focus();}
 const collection=el('section',undefined,'study-panel review-library'),search=el('input'),list=el('div'),more=button('再显示 50 张',()=>{shown+=50;renderList();});search.type='search';search.placeholder='搜索问题、答案、分组…';search.setAttribute('aria-label','搜索复习卡');search.oninput=()=>{query=search.value.trim().toLowerCase();shown=50;renderList();};collection.append(el('h2','我的卡片'),search,list,more);grid.append(collection);
 const actions=el('div',undefined,'study-data-actions'),file=el('input');file.type='file';file.accept='.json,application/json';file.hidden=true;
 const exportButton=button('导出复习卡（明文 JSON）',()=>{if(!read())return;const url=URL.createObjectURL(new Blob([R.backup(state)],{type:'application/json'})),a=el('a');a.href=url;a.download='zhixin-review-cards.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 const importButton=button('导入并合并备份',()=>file.click());file.onchange=async()=>{const chosen=file.files[0];if(!chosen)return;try{if(chosen.size>2*1024*1024)throw Error('备份超过 2 MB');const text=await chosen.text();commit(s=>R.merge(s,text),'已合并复习卡，较新的同编号版本已保留。');}catch(error){status.textContent=error.message;}finally{file.value='';}};
 const undo=button('撤销上次删除',()=>{if(!removed)return;const restore=removed;if(commit(s=>s.cards.some(c=>c.id===restore.id)?s:R.clean({...s,cards:[restore,...s.cards]}),'已恢复卡片。')){removed=null;undo.hidden=true;}});undo.hidden=true;actions.append(exportButton,importButton,file,undo);host.append(actions);
 function mark(rating){if(!revealed||!current)return;const id=current;if(commit(s=>{if(!s.cards.some(c=>c.id===id&&c.due<=Date.now()))throw Error('这张卡片已在其他页面处理，请刷新后继续');return R.rate(s,id,rating);},'已安排下次复习。')){reviewed++;current=null;revealed=false;render();}}
 function sourceLink(card){if(!card.source)return null;const a=el('a','回到来源文章 ↗');a.href=new URL(card.source,base).href;return a;}
 function renderPractice(){
  clearTimeout(wake);const now=Date.now(),due=R.due(state,now,deck),selected=due.find(c=>c.id===current)||due[0];if(current!==selected?.id)revealed=false;current=selected?.id||null;cardHost.replaceChildren();
  if(!selected){cardHost.append(el('p',state.cards.length?'当前分组的到期卡片已复习完。可以休息一下，或创建新卡。':'先创建一张卡片，从一个小问题开始。','review-empty'));const next=state.cards.filter(c=>!deck||c.deck===deck).sort((a,b)=>a.due-b.due)[0];if(next){cardHost.append(el('p','下次到期：'+new Date(next.due).toLocaleString(),'study-caption'));} }
  else{
   cardHost.append(el('small',selected.deck||'未分组','review-deck'),el('h3',selected.question,'review-question'));
   const reveal=button('揭示答案 · 空格',()=>{revealed=true;renderPractice();});reveal.hidden=revealed;cardHost.append(reveal);
   if(revealed){cardHost.append(el('div',selected.answer,'review-answer'));const choices=el('div',undefined,'review-ratings');for(const [value,title]of [['again','1 再想想 · 10分钟'],['hard','2 有点难 · 1天'],['good','3 记住了'],['easy','4 很轻松']]){const b=button(title,()=>mark(value));b.dataset.rating=value;if(['good','easy'].includes(value)){const updated=R.rate(state,selected.id,value,now).cards.find(c=>c.id===selected.id);b.textContent+=' · '+Math.round((updated.due-now)/R.DAY)+'天';}choices.append(b);}cardHost.append(choices);}
   const a=sourceLink(selected);if(a)cardHost.append(a);cardHost.append(el('p','本次已复习 '+reviewed+' 张 · 当前分组剩余 '+due.length+' 张','study-caption'));
  }
  // One wake-up per minute at most, with no animation loop or hidden-tab work.
  if(!document.hidden){const nextDelay=state.cards.filter(c=>c.due>now).reduce((n,c)=>Math.min(n,c.due-now),60000);wake=setTimeout(()=>{if(read())render();},Math.max(1000,nextDelay));}
 }
 function renderList(){list.replaceChildren();const matches=state.cards.filter(c=>(!deck||c.deck===deck)&&[c.question,c.answer,c.deck].some(t=>t.toLowerCase().includes(query)));for(const card of matches.slice(0,shown)){const row=el('div',undefined,'review-row'),body=el('div'),title=el('strong',card.question),meta=el('small',(card.deck||'未分组')+' · '+(card.due<=Date.now()?'已到期':new Date(card.due).toLocaleDateString())+' · 复习 '+card.reps+' 次'),buttons=el('div');body.append(title,meta);buttons.append(button('编辑',()=>edit(card)),button('删除',()=>{if(commit(s=>({...s,cards:s.cards.filter(c=>c.id!==card.id)}),'卡片已删除，可在下方撤销。')){removed=card;undo.hidden=false;}}));row.append(body,buttons);list.append(row);}if(!matches.length)list.append(el('p',query?'没有匹配的卡片。':'这里暂时没有卡片。','study-caption'));more.hidden=matches.length<=shown;}
 function render(){const now=Date.now();stats.replaceChildren();for(const [count,label]of [[R.due(state,now).length,'现在到期'],[state.cards.length,'全部卡片'],[state.cards.filter(c=>c.reps>0).length,'已经复习过']]){const n=el('div');n.append(el('strong',String(count)),el('span',label));stats.append(n);}deckSelect.replaceChildren();const all=el('option','全部分组');all.value='';deckSelect.append(all);for(const name of [...new Set(state.cards.map(c=>c.deck).filter(Boolean))].sort()){const o=el('option',name);o.value=name;deckSelect.append(o);}if(deck&&![...deckSelect.options].some(o=>o.value===deck))deck='';deckSelect.value=deck;renderPractice();renderList();}
 document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.repeat||event.isComposing||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey||event.target.closest?.('input,textarea,select,button,a,[contenteditable="true"]')||document.querySelector('dialog[open]'))return;if(event.code==='Space'&&!revealed&&current){event.preventDefault();revealed=true;renderPractice();}else if(revealed&&['1','2','3','4'].includes(event.key)){event.preventDefault();mark(['again','hard','good','easy'][Number(event.key)-1]);}});
 addEventListener('storage',event=>{if(event.key===R.KEY||event.key===null){revealed=false;current=null;if(read())render();}});
 document.addEventListener('visibilitychange',()=>{clearTimeout(wake);if(!document.hidden&&read())render();});addEventListener('pagehide',()=>clearTimeout(wake));
 read();render();
 try{const draft=JSON.parse(sessionStorage.getItem(R.DRAFT)||'null');if(draft&&typeof draft.question==='string'&&typeof draft.answer==='string'){question.value=draft.question.slice(0,300);answer.value=draft.answer.slice(0,4000);sourcePath=R.source(draft.source);source.textContent=sourcePath?'来源：'+sourcePath:'';status.textContent='文章摘录已带入草稿，补充问题后点击保存；尚未创建卡片。';sessionStorage.removeItem(R.DRAFT);}}catch{}
})();
