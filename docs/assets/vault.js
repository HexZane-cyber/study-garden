(() => {
  'use strict';
  const host=document.getElementById('vault-locked');if(!host)return;
  const V=window.PrivateVault,$=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let db,key=null,space=null,files=[],active=null,busy=false,lastActivity=Date.now(),urls=[],generation=0;
  let editor=null,importing=false,cancelImport=false;
  const stale=()=>Object.assign(Error('空间已锁定，操作已停止'),{name:'AbortError'});
  const ensureSession=gen=>{if(gen!==generation||!key)throw stale();};
  const dirty=()=>editor&&editor.input.value!==editor.original;
  const canLeave=()=>!dirty()||confirm('笔记有尚未加密保存的修改。确定放弃这些修改吗？');
  const F=window.VaultFormats;
  $('#vault-file-input').accept=F.accept;
  const uuid=/^[a-f0-9-]{36}$/i;
  const message=text=>{$('#vault-status').textContent=text;};
  const request=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  const completed=tx=>new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||Error('存储操作中止'));tx.onerror=()=>{};});
  function store(name,mode='readonly'){return db.transaction(name,mode).objectStore(name);}
  async function put(name,record){const tx=db.transaction(name,'readwrite');const done=completed(tx);tx.objectStore(name).put(record);await done;}
  const get=(name,id)=>request(store(name).get(id));
  const all=(name,index,value)=>request(index?store(name).index(index).getAll(value):store(name).getAll());
  function revoke(){document.querySelectorAll('#vault-reader audio,#vault-reader video').forEach(media=>{media.pause();media.removeAttribute('src');media.load();});for(const url of urls)URL.revokeObjectURL(url);urls=[];}
  function blobURL(blob){const url=URL.createObjectURL(blob);urls.push(url);return url;}
  function download(name,blob){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function formatSize(n){return n<1024*1024?`${Math.round(n/1024)} KB`:`${(n/1024/1024).toFixed(1)} MB`;}
  function type(f){return F.kind(f.path);}
  function controls(){
    document.querySelectorAll('#vault-create button,#vault-unlock button,#vault-open button,#vault-restore').forEach(b=>{
      b.disabled=busy&&b.id!=='vault-lock'&&b.id!=='vault-cancel-import';
    });
    $('#vault-open').setAttribute('aria-busy',String(busy));
    if(editor)editor.input.readOnly=busy;
  }
  async function run(task){
    if(busy)return;
    busy=true;controls();
    try{await task();}
    catch(error){
      if(error.name!=='AbortError')message(error.name==='QuotaExceededError'?'浏览器存储空间不足，请先导出备份或删除不需要的资料。':`操作未完成：${error.message||'请重试'}`);
    }finally{busy=false;controls();}
  }
  async function spaces(){const list=await all('spaces');const select=$('#vault-unlock').elements.space;select.replaceChildren();for(const s of list){const option=document.createElement('option');option.value=s.id;option.textContent=s.name;select.append(option);}if(!list.length){const option=document.createElement('option');option.value='';option.textContent='还没有空间，请先创建';select.append(option);} }
  async function loadFiles(){
    const gen=generation,currentSpace=space,currentKey=key;
    const records=await all('files','space',currentSpace.id),result=[];
    for(const record of records){
      ensureSession(gen);
      const meta=JSON.parse(V.decoder.decode(await V.decrypt(currentKey,record.meta,`${currentSpace.id}|${record.id}|meta`)));
      if(meta.chunks!==record.chunks||typeof meta.path!=='string'||!Number.isSafeInteger(meta.size)||meta.size<0||meta.size>V.MAX_FILE)throw Error('资料完整性校验失败');
      result.push({...meta,id:record.id});
    }
    ensureSession(gen);files=result;renderFiles();
  }
  function readerEmpty(){
    $('#vault-reader').innerHTML='<div class="vault-empty"><strong>给知识留一张书桌</strong><p>从左侧选择课本或笔记，或者新建一篇笔记开始记录。</p><p class="reading-meta">导入 Obsidian 文件夹后，可以通过笔记中的双链跳转。</p></div>';
  }
  async function storageStatus(){
    const gen=generation;
    try{
      const retained=await navigator.storage?.persisted?.();
      if(gen!==generation)return;
      $('#vault-storage-hint').textContent=retained?'浏览器已允许持久保留。手动清除站点数据仍会删除资料，请定期导出备份。':'可请求浏览器保留本机资料，减少自动清理的可能；请继续定期导出备份。';
      $('#vault-persist').hidden=Boolean(retained)||!navigator.storage?.persist;
    }catch{$('#vault-storage-hint').textContent='无法读取浏览器保留状态，请定期导出加密备份。';}
  }
  async function open(s,k){
    space=s;key=k;generation++;files=[];active=null;editor=null;lastActivity=Date.now();
    $('#vault-name').textContent=s.name;$('#vault-locked').hidden=true;$('#vault-open').hidden=false;
    readerEmpty();await loadFiles();await storageStatus();
    if(key)message('空间已解锁。资料仅在本浏览器中解密阅读。');
  }
  function setFocus(enabled){
    $('#vault-open').classList.toggle('vault-focus',enabled);
    $('#vault-focus').setAttribute('aria-pressed',String(enabled));
    $('#vault-focus').textContent=enabled?'退出专注阅读':'专注阅读';
  }
  function lock(){
    generation++;cancelImport=true;key=null;space=null;files=[];active=null;
    if(editor)editor.input.value='';editor=null;revoke();setFocus(false);
    $('#vault-open').hidden=true;$('#vault-locked').hidden=false;
    $('#vault-reader').replaceChildren();$('#vault-files').replaceChildren();
    $('#vault-name').textContent='';$('#vault-count').textContent='';$('#vault-storage').textContent='';$('#vault-result-count').textContent='';
    $('#vault-search').value='';$('#vault-type').value='all';$('#vault-sort').value='name';$('#vault-directory').replaceChildren(new Option('全部文件夹',''));
    $('#vault-progress').hidden=true;$('#vault-progress-label').textContent='';
    $('#vault-unlock').elements.password.value='';message('空间已锁定。');
  }
  function renderFiles(){
    if(!key)return;
    const directory=$('#vault-directory'),selected=directory.value,folders=new Set();
    for(const f of files){const parts=f.path.split('/');parts.pop();for(let i=1;i<=parts.length;i++)folders.add(parts.slice(0,i).join('/'));}
    directory.replaceChildren(new Option('全部文件夹',''));
    for(const folder of [...folders].sort((a,b)=>a.localeCompare(b,'zh-CN')))directory.append(new Option(folder,folder));
    directory.value=folders.has(selected)?selected:'';
    const list=$('#vault-files');list.replaceChildren();
    const q=$('#vault-search').value.trim().toLowerCase(),kind=$('#vault-type').value,folder=directory.value;
    const filtered=files.filter(f=>f.path.toLowerCase().includes(q)&&(kind==='all'||type(f)===kind)&&(!folder||f.path.startsWith(folder+'/')));
    const order=$('#vault-sort').value;
    filtered.sort((a,b)=>(order==='size'?b.size-a.size:order==='recent'?String(b.updated||b.added).localeCompare(String(a.updated||a.added)):0)||a.path.localeCompare(b.path,'zh-CN',{numeric:true}));
    const size=files.reduce((sum,f)=>sum+f.size,0);
    $('#vault-count').textContent=`${files.length} 份资料`;
    $('#vault-storage').textContent=`${formatSize(size)} / 256 MB`;
    $('#vault-capacity').value=size/V.MAX_TOTAL*100;
    $('#vault-result-count').textContent=`显示 ${filtered.length} / ${files.length} 份资料`;
    if(!filtered.length){
      const p=document.createElement('div');p.className='vault-empty';p.textContent=files.length?'没有匹配的资料。试试其他关键词或清除筛选。':'还没有资料，拖入文件或新建笔记开始使用。';
      if(files.length){const reset=document.createElement('button');reset.type='button';reset.className='md-button';reset.textContent='清除筛选';reset.onclick=()=>{$('#vault-search').value='';$('#vault-type').value='all';directory.value='';renderFiles();};p.append(reset);}
      list.append(p);return;
    }
    const fragment=document.createDocumentFragment();
    for(const f of filtered){
      const b=document.createElement('button');b.type='button';b.className='vault-file'+(active===f.id?' active':'');b.setAttribute('aria-current',String(active===f.id));
      const title=document.createElement('strong'),small=document.createElement('small');title.textContent=f.path.split('/').pop();
      small.textContent=`${F.labels[type(f)]} · ${f.path} · ${formatSize(f.size)}`;
      b.append(title,small);b.onclick=()=>{if(canLeave())run(()=>read(f));};fragment.append(b);
    }
    list.append(fragment);controls();
  }
  async function removeFile(id){const keys=await request(store('chunks').index('file').getAllKeys(id));const tx=db.transaction(['files','chunks'],'readwrite'),done=completed(tx);tx.objectStore('files').delete(id);for(const k of keys)tx.objectStore('chunks').delete(k);await done;}
  async function saveFile(file,path,replace=null,onProgress=null){
    const currentSpace=space,currentKey=key,gen=generation;ensureSession(gen);
    if(file.size>V.MAX_FILE)throw Error(`${file.name} 超过 128 MB`);
    if(files.reduce((s,f)=>s+f.size,0)-(replace?.size||0)+file.size>V.MAX_TOTAL)throw Error('空间超过 256 MB 上限，请先备份并整理资料');
    const id=crypto.randomUUID(),chunks=Math.max(1,Math.ceil(file.size/V.CHUNK_SIZE));let committed=false;
    const check=()=>{ensureSession(gen);if(importing&&cancelImport)throw Object.assign(Error('导入已取消'),{name:'ImportCancelled'});};
    try{
      for(let i=0;i<chunks;i++){
        check();const data=new Uint8Array(await file.slice(i*V.CHUNK_SIZE,(i+1)*V.CHUNK_SIZE).arrayBuffer());
        const encrypted=await V.encrypt(currentKey,data,`${currentSpace.id}|${id}|${i}`);check();
        await put('chunks',{id:`${id}:${i}`,space:currentSpace.id,file:id,index:i,...encrypted});
        onProgress?.(Math.min(file.size,(i+1)*V.CHUNK_SIZE));
      }
      const now=new Date().toISOString(),metadata={path:V.normalizePath(path),name:file.name,mime:file.type||'',size:file.size,chunks,added:replace?.added||now,updated:now};
      const meta=await V.encrypt(currentKey,V.encoder.encode(JSON.stringify(metadata)),`${currentSpace.id}|${id}|meta`);
      const oldChunks=replace?await request(store('chunks').index('file').getAllKeys(replace.id)):[];check();
      // Commit the new metadata and remove the old revision in one transaction.
      const tx=db.transaction(['files','chunks'],'readwrite'),done=completed(tx);
      tx.objectStore('files').put({id,space:currentSpace.id,chunks,meta});
      if(replace){tx.objectStore('files').delete(replace.id);for(const old of oldChunks)tx.objectStore('chunks').delete(old);}
      await done;committed=true;ensureSession(gen);
      files=files.filter(f=>f.id!==replace?.id);files.push({...metadata,id});return id;
    }catch(error){if(!committed)await removeFile(id);throw error;}
  }
  async function importFiles(incoming,folder=false){
    const gen=generation;ensureSession(gen);let skipped=0,added=0,processed=0;
    const known=new Set(files.map(f=>f.path)),accepted=[];
    for(const file of [...incoming]){
      const source=folder?file.webkitRelativePath||file.name:file.name;
      const path=V.normalizePath(folder?source.split('/').slice(1).join('/')||file.name:source);
      if(!F.supported(file.name)||source.split('/').some(s=>s.startsWith('.'))||known.has(path)){skipped++;continue;}
      if(file.size>V.MAX_FILE)throw Error(`${file.name} 超过 128 MB，本批尚未导入`);
      known.add(path);accepted.push({file,path});
    }
    if(accepted.length>1000)throw Error('一次最多导入 1000 个文件，请分批导入');
    const size=accepted.reduce((s,x)=>s+x.file.size,0);
    if(size+files.reduce((s,f)=>s+f.size,0)>V.MAX_TOTAL)throw Error('导入后会超过 256 MB，请分批整理');
    importing=true;cancelImport=false;$('#vault-progress').hidden=false;$('#vault-progress-bar').value=0;
    try{
      for(const {file,path} of accepted){
        ensureSession(gen);if(cancelImport)break;
        const label=`正在加密 ${added+1}/${accepted.length}：${file.name}`;message(label);$('#vault-progress-label').textContent=label;
        await saveFile(file,path,null,bytes=>{if(gen===generation)$('#vault-progress-bar').value=size?(processed+bytes)/size*100:100;});
        processed+=file.size;added++;renderFiles();
      }
      ensureSession(gen);
      message(cancelImport?`导入已取消，已完成的 ${added} 个文件已保留。`:`已加密导入 ${added} 个文件，跳过 ${skipped} 个重复、隐藏或不支持的文件。`);
    }catch(error){
      if(error.name==='ImportCancelled')message(`导入已取消，已完成的 ${added} 个文件已保留，未完成的文件已清理。`);
      else if(error.name==='AbortError')throw error;
      else throw Error(`${error.message}；本批已完成 ${added} 个文件，已保留。`);
    }finally{importing=false;$('#vault-progress').hidden=true;$('#vault-progress-label').textContent='';if(gen===generation)renderFiles();}
  }
  async function fileBlob(f){
    const gen=generation,currentKey=key,currentSpace=space;ensureSession(gen);const parts=[];
    for(let i=0;i<f.chunks;i++){
      const chunk=await get('chunks',`${f.id}:${i}`);ensureSession(gen);
      if(!chunk)throw Error('文件分块缺失，请从备份恢复');
      parts.push(await V.decrypt(currentKey,chunk,`${currentSpace.id}|${f.id}|${i}`));ensureSession(gen);
    }
    const blob=new Blob(parts,{type:f.mime||(/\.pdf$/i.test(f.path)?'application/pdf':'application/octet-stream')});
    if(blob.size!==f.size)throw Error('文件大小校验失败');return blob;
  }
  function markdown(text,current){
    const inline=s=>esc(s).replace(/!\[\[([^\]]+)\]\]/g,(_,ref)=>{const target=V.resolveLink(ref,current.path,files);return target&&type(target)==='image'?`<img data-vault-image="${esc(target.id)}" alt="${esc(ref)}">`:`<span class="vault-missing">附件未找到：${esc(ref)}</span>`;}).replace(/\[\[([^\]]+)\]\]/g,(_,ref)=>{const target=V.resolveLink(ref,current.path,files),label=ref.split('|')[1]||ref;return target?`<button class="vault-wikilink" data-vault-open="${esc(target.id)}">${esc(label)}</button>`:`<span class="vault-missing">${esc(label)}（链接未找到）</span>`;}).replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,label,url)=>{if(/^https?:\/\//i.test(url))return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;const target=V.resolveLink(url,current.path,files);return target?`<button class="vault-wikilink" data-vault-open="${esc(target.id)}">${label}</button>`:label;}).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    const out=[];let code=false,buffer=[],list=false;for(const line of text.split('\n')){if(line.startsWith('```')){if(list){out.push('</ul>');list=false;}if(code){out.push(`<pre><code>${esc(buffer.join('\n'))}</code></pre>`);buffer=[];}code=!code;continue;}if(code){buffer.push(line);continue;}const h=line.match(/^(#{1,6})\s+(.+)/);if(/^\s*[-*]\s/.test(line)){if(!list){out.push('<ul>');list=true;}out.push(`<li>${inline(line.replace(/^\s*[-*]\s/,''))}</li>`);continue;}if(list){out.push('</ul>');list=false;}if(h)out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);else if(line.trim())out.push(`<p>${inline(line)}</p>`);}if(list)out.push('</ul>');if(code)out.push(`<pre><code>${esc(buffer.join('\n'))}</code></pre>`);return out.join('');
  }
  async function saveEditor(){
    if(!editor)return;
    const gen=generation,current=editor;
    const edited=new File([current.input.value],current.file.name,{type:current.file.mime||'text/markdown'});
    const newId=await saveFile(edited,current.file.path,current.file);ensureSession(gen);
    editor=null;await loadFiles();await read(files.find(x=>x.id===newId));
    message('笔记已加密保存。');
  }
  function editNote(f,text,article){
    if(editor){editor.input.focus();return;}
    const textarea=document.createElement('textarea');textarea.className='vault-editor';textarea.value=text;
    textarea.setAttribute('aria-label','编辑笔记正文');textarea.spellcheck=false;
    const actions=document.createElement('div');actions.className='vault-editor-actions';
    const save=document.createElement('button');save.type='button';save.className='md-button md-button--primary';save.textContent='加密保存修改';save.onclick=()=>run(saveEditor);
    const cancel=document.createElement('button');cancel.type='button';cancel.className='md-button';cancel.textContent='返回阅读';cancel.onclick=()=>{if(canLeave())run(()=>read(f));};
    const state=document.createElement('p');state.className='vault-editor-state';state.setAttribute('role','status');
    editor={input:textarea,original:text,file:f};
    textarea.oninput=()=>{state.textContent=dirty()?'有未保存的修改 · Ctrl / ⌘ + S 加密保存':'尚未修改 · Ctrl / ⌘ + S 加密保存';};textarea.oninput();
    textarea.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();run(saveEditor);}};
    actions.append(save,cancel);article.replaceChildren(actions,state,textarea);textarea.focus();
  }
  async function read(f){
    const gen=generation;message('正在解密资料…');const blob=await fileBlob(f);ensureSession(gen);
    // Complete asynchronous text decoding before installing any new reader state.
    const text=F.text(f.path)&&f.size<=4*1024*1024?await blob.text():null;ensureSession(gen);
    active=f.id;editor=null;revoke();const reader=$('#vault-reader');reader.replaceChildren();
    const h=document.createElement('h2');h.textContent=f.path;reader.append(h);
    const actions=document.createElement('div');actions.className='vault-toolbar';
    function button(label,action){const b=document.createElement('button');b.type='button';b.className='md-button';b.textContent=label;b.onclick=()=>run(action);actions.append(b);return b;}
    button('下载原文件',()=>download(f.name,blob));
    button('删除资料',async()=>{
      if(!confirm(`删除「${f.path}」？${dirty()?'尚未保存的修改也会丢弃。':''}请确认已有需要的备份。`))return;
      await removeFile(f.id);ensureSession(gen);active=null;editor=null;revoke();readerEmpty();await loadFiles();message('资料已从本浏览器删除。');
    });reader.append(actions);
    if(F.text(f.path)){
      if(text===null){const p=document.createElement('p');p.textContent='笔记超过 4 MB，请下载后用编辑器阅读。';reader.append(p);}
      else{
        const article=document.createElement('article');article.className='vault-markdown';if(F.markdown(f.path))article.innerHTML=markdown(text,f);else{const pre=document.createElement('pre');pre.textContent=text;article.append(pre);}reader.append(article);
        if(type(f)==='note')button('编辑笔记',()=>editNote(f,text,article));
        for(const image of article.querySelectorAll('[data-vault-image]')){
          const target=files.find(x=>x.id===image.dataset.vaultImage);
          if(target){const imageBlob=await fileBlob(target);ensureSession(gen);image.src=blobURL(imageBlob);}
        }
      }
    }else if(type(f)==='pdf'){
      const iframe=document.createElement('iframe');iframe.title=f.name;iframe.src=blobURL(new Blob([blob],{type:'application/pdf'}));iframe.className='vault-pdf';reader.append(iframe);
      const p=document.createElement('p');p.className='reading-meta';p.textContent='若浏览器不支持 PDF 内嵌预览，请使用“下载原文件”在本机阅读。';reader.append(p);
    }else if(type(f)==='image'){const image=document.createElement('img');image.alt=f.name;image.src=blobURL(new Blob([blob],{type:F.mime(f.path)}));image.className='vault-image';reader.append(image);
    }else if(['audio','video'].includes(type(f))){
      const media=document.createElement(type(f));media.controls=true;media.preload='metadata';media.src=blobURL(new Blob([blob],{type:F.mime(f.path)}));media.style.maxWidth='100%';media.setAttribute('aria-label',f.name);reader.append(media);
      const hint=document.createElement('p');hint.textContent='播放支持取决于浏览器及文件编码，无法播放时可下载原文件。';reader.append(hint);
    }else{const hint=document.createElement('p');hint.textContent='原文件已加密保存。此格式暂不提供网页预览，请点击“下载原文件”，使用本机应用打开。压缩包仅保存原件，不自动解压。';reader.append(hint);}
    renderFiles();message('资料已在本机解密，使用后请锁定空间。');
  }
  async function backup(){
    const gen=generation,currentSpace=space;ensureSession(gen);
    if(dirty()){message('请先加密保存笔记修改，再导出备份。');return;}
    message('正在生成加密备份…');
    const tx=db.transaction(['files','chunks'],'readonly');
    const [records,chunks]=await Promise.all([request(tx.objectStore('files').index('space').getAll(currentSpace.id)),request(tx.objectStore('chunks').index('space').getAll(currentSpace.id))]);ensureSession(gen);
    const manifest={format:'study-garden-encrypted-vault',version:V.VERSION,space:{...currentSpace,salt:V.base64(currentSpace.salt),check:V.packRecord(currentSpace.check)},files:records.map(f=>({...f,meta:V.packRecord(f.meta)}))};
    const output=[];let zipError=null;const zip=new fflate.Zip((error,data)=>{if(error)zipError=error;else output.push(data);});
    const header=new fflate.ZipPassThrough('manifest.json');zip.add(header);header.push(V.encoder.encode(JSON.stringify(manifest)),true);
    const ids=new Set(records.map(f=>f.id));
    for(const chunk of chunks){if(!ids.has(chunk.file))continue;const entry=new fflate.ZipPassThrough(`chunks/${chunk.file}/${chunk.index}.bin`);zip.add(entry);const bytes=new Uint8Array(12+chunk.data.byteLength);bytes.set(V.bytes(chunk.iv));bytes.set(V.bytes(chunk.data),12);entry.push(bytes,true);}
    zip.end();if(zipError)throw zipError;
    download(`study-garden-${new Date().toISOString().slice(0,10)}.sgvault`,new Blob(output,{type:'application/octet-stream'}));message('加密备份已生成。请保存好备份和空间口令。');
  }
  async function restore(file){if(file.size>V.MAX_TOTAL+16*1024*1024)throw Error('备份超过容量限制');message('正在检查加密备份…');const entries=new Map();let bytes=0,error=null,count=0;const unzip=new fflate.Unzip(entry=>{if(++count>6000||entry.compression!==0||!/^manifest\.json$|^chunks\/[a-f0-9-]{36}\/\d+\.bin$/i.test(entry.name)){error=Error('不是支持的加密备份文件');return;}const parts=[];entry.ondata=(err,data,final)=>{if(err){error=err;return;}bytes+=data.length;if(bytes>V.MAX_TOTAL+16*1024*1024){error=Error('备份内容超过容量限制');return;}parts.push(data);if(final){const length=parts.reduce((n,p)=>n+p.length,0);if(entry.name==='manifest.json'&&length>4*1024*1024){error=Error('备份目录过大');return;}if(entry.name!=='manifest.json'&&length>V.CHUNK_SIZE+28){error=Error('备份分块损坏');return;}const merged=new Uint8Array(length);let offset=0;for(const part of parts){merged.set(part,offset);offset+=part.length;}if(entries.has(entry.name)){error=Error('备份含重复条目');return;}entries.set(entry.name,merged);}};entry.start();});for(let offset=0;offset<file.size;offset+=V.CHUNK_SIZE){if(error)throw error;unzip.push(new Uint8Array(await file.slice(offset,offset+V.CHUNK_SIZE).arrayBuffer()),offset+V.CHUNK_SIZE>=file.size);}if(error)throw error;const header=entries.get('manifest.json');if(!header)throw Error('备份缺少目录');const manifest=JSON.parse(V.decoder.decode(header));if(manifest.format!=='study-garden-encrypted-vault'||manifest.version!==V.VERSION||!Array.isArray(manifest.files))throw Error('备份格式不正确');const raw=manifest.space;if(!raw||!uuid.test(raw.id)||typeof raw.name!=='string'||raw.name.length>50||raw.iterations!==V.ITERATIONS)throw Error('空间记录不正确');if(await get('spaces',raw.id))throw Error('此空间已存在，请直接解锁；恢复不会覆盖现有空间');const restored={id:raw.id,name:raw.name,version:V.VERSION,iterations:V.ITERATIONS,created:String(raw.created||''),salt:V.unbase64(raw.salt),check:V.unpackRecord(raw.check)};if(restored.salt.length!==16)throw Error('备份密钥参数损坏');const fileIds=new Set(),records=[],recordsChunks=[];for(const f of manifest.files){if(!uuid.test(f.id)||fileIds.has(f.id)||!Number.isSafeInteger(f.chunks)||f.chunks<1||f.chunks>128)throw Error('备份文件记录损坏');fileIds.add(f.id);records.push({id:f.id,space:raw.id,chunks:f.chunks,meta:V.unpackRecord(f.meta)});for(let i=0;i<f.chunks;i++){const value=entries.get(`chunks/${f.id}/${i}.bin`);if(!value||value.length<28)throw Error('备份分块缺失');recordsChunks.push({id:`${f.id}:${i}`,space:raw.id,file:f.id,index:i,iv:value.slice(0,12),data:value.slice(12).buffer});}}if(entries.size!==recordsChunks.length+1)throw Error('备份含多余或未识别的内容');const tx=db.transaction(['spaces','files','chunks'],'readwrite'),done=completed(tx);tx.objectStore('spaces').add(restored);for(const r of records)tx.objectStore('files').add(r);for(const r of recordsChunks)tx.objectStore('chunks').add(r);try{await done;}catch(error){if(error?.name==='ConstraintError')throw Error('备份与现有资料冲突，未覆盖任何空间');throw error;}await spaces();$('#vault-unlock').elements.space.value=restored.id;message('加密备份已恢复。请使用原空间口令解锁；资料尚未解密。');}
  $('#vault-create').onsubmit=e=>{e.preventDefault();run(async()=>{const gen=generation,f=e.currentTarget;if(f.elements.password.value!==f.elements.confirm.value)throw Error('两次口令不一致');message('正在创建加密空间…');const result=await V.createSpace(f.elements.name.value,f.elements.password.value);await put('spaces',result.space);f.reset();await spaces();if(gen!==generation)throw stale();await open(result.space,result.key);});};
  $('#vault-unlock').onsubmit=e=>{e.preventDefault();run(async()=>{const gen=generation,f=e.currentTarget,s=await get('spaces',f.elements.space.value);if(!s)throw Error('请先选择空间');message('正在验证空间口令…');let k;try{k=await V.unlock(s,f.elements.password.value);}catch{f.elements.password.value='';throw Error('口令不正确或空间记录已损坏');}f.elements.password.value='';if(gen!==generation)throw stale();try{await open(s,k);}catch(error){lock();throw error;}});};
  $('#vault-lock').onclick=()=>{if(canLeave())lock();};$('#vault-import').onclick=()=>$('#vault-file-input').click();$('#vault-folder').onclick=()=>$('#vault-folder-input').click();$('#vault-restore').onclick=()=>$('#vault-backup-input').click();
  $('#vault-file-input').onchange=e=>run(async()=>{try{await importFiles(e.target.files);}finally{e.target.value='';}});$('#vault-folder-input').onchange=e=>run(async()=>{try{await importFiles(e.target.files,true);}finally{e.target.value='';}});$('#vault-backup-input').onchange=e=>run(async()=>{if(e.target.files[0])await restore(e.target.files[0]);e.target.value='';});
  $('#vault-new').onclick=()=>run(async()=>{if(!canLeave())return;const name=prompt('新笔记文件名（例如：notes/my-note.md）','新笔记.md');if(!name)return;let path=V.normalizePath(name);if(!/\.(md|markdown|txt)$/i.test(path))path+='.md';if(files.some(f=>f.path===path))throw Error('同名笔记已存在，请打开后编辑');const filename=path.split('/').pop();const file=new File([`# ${filename.replace(/\.[^.]+$/,'')}\n\n从这里记录你的想法。\n`],filename,{type:'text/markdown'});const newId=await saveFile(file,path);await loadFiles();await read(files.find(f=>f.id===newId));});
  $('#vault-cancel-import').onclick=()=>{cancelImport=true;};
  $('#vault-directory').onchange=renderFiles;$('#vault-sort').onchange=renderFiles;
  $('#vault-focus').onclick=()=>setFocus(!$('#vault-open').classList.contains('vault-focus'));
  $('#vault-persist').onclick=()=>run(async()=>{const gen=generation;const allowed=await navigator.storage?.persist?.();ensureSession(gen);await storageStatus();message(allowed?'浏览器已允许保留本机资料，请继续定期备份。':'浏览器未授予保留权限，现有资料仍可使用，请定期备份。');});
  const drop=$('#vault-dropzone');
  drop.onclick=()=>{if(!busy&&key)$('#vault-file-input').click();};
  drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();drop.click();}};
  drop.ondragover=e=>{e.preventDefault();if(key&&!busy)drop.classList.add('is-dragover');};
  drop.ondragleave=()=>drop.classList.remove('is-dragover');
  drop.ondrop=e=>{e.preventDefault();drop.classList.remove('is-dragover');if(!key||busy)return;const incoming=[...(e.dataTransfer?.files||[])];if(incoming.length)run(()=>importFiles(incoming));};
  window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
  $('#vault-backup').onclick=()=>run(backup);$('#vault-search').oninput=renderFiles;$('#vault-type').onchange=renderFiles;
  $('#vault-reader').onclick=e=>{const target=e.target.closest('[data-vault-open]');if(target){const f=files.find(f=>f.id===target.dataset.vaultOpen);if(f&&canLeave())run(()=>read(f));}};
  $('#vault-delete-space').onclick=()=>run(async()=>{if(prompt(`输入空间名「${space.name}」确认删除本机全部资料。此操作无法撤销。`)!==space.name)return;const fid=space.id,records=await all('files','space',fid),chunks=await request(store('chunks').index('space').getAllKeys(fid));const tx=db.transaction(['spaces','files','chunks'],'readwrite'),done=completed(tx);tx.objectStore('spaces').delete(fid);for(const f of records)tx.objectStore('files').delete(f.id);for(const c of chunks)tx.objectStore('chunks').delete(c);await done;lock();await spaces();message('空间已从本浏览器删除。');});
  for(const event of ['pointerdown','keydown','input'])document.addEventListener(event,()=>{lastActivity=Date.now();},{passive:true});setInterval(()=>{if(key&&Date.now()-lastActivity>10*60*1000){lock();message('长时间未操作，空间已自动锁定。');}},10000);window.addEventListener('pagehide',lock);
  if(!window.isSecureContext||!crypto.subtle||!indexedDB){message('此浏览器无法提供加密存储，请使用现代浏览器通过 HTTPS 或 localhost 打开。');document.querySelectorAll('#vault-locked button').forEach(b=>b.disabled=true);return;}
  const opening=indexedDB.open('study-garden-private-vaults',1);opening.onupgradeneeded=()=>{const database=opening.result;database.createObjectStore('spaces',{keyPath:'id'});const f=database.createObjectStore('files',{keyPath:'id'});f.createIndex('space','space');const c=database.createObjectStore('chunks',{keyPath:'id'});c.createIndex('space','space');c.createIndex('file','file');};opening.onsuccess=async()=>{db=opening.result;db.onversionchange=()=>{lock();db.close();message('存储版本已更新，请刷新页面。');};try{await spaces();message('选择空间解锁，或创建新的本机加密空间。');}catch{message('无法访问本机存储，请检查浏览器设置。');}};opening.onerror=()=>message('浏览器未允许持久化存储，请检查隐私模式或站点设置。');
})();
