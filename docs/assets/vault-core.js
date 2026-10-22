(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PrivateVault=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VERSION=1,ITERATIONS=600000,CHUNK_SIZE=1024*1024,MAX_FILE=128*1024*1024,MAX_TOTAL=256*1024*1024;
  const encoder=new TextEncoder(),decoder=new TextDecoder();
  function bytes(value){return value instanceof Uint8Array?value:new Uint8Array(value);}
  function base64(value){let str='';for(const n of bytes(value))str+=String.fromCharCode(n);return btoa(str);}
  function unbase64(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
  function random(size){return crypto.getRandomValues(new Uint8Array(size));}
  async function derive(password,salt,iterations=ITERATIONS){if(iterations!==ITERATIONS)throw Error('不支持的口令参数');const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(salt),iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
  async function encrypt(key,value,aad){const iv=random(12);const data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(aad)},key,bytes(value));return {iv,data};}
  async function decrypt(key,record,aad){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(record.iv),additionalData:encoder.encode(aad)},key,record.data));}
  async function createSpace(name,password){if(!name.trim()||name.length>50)throw Error('空间名称需为 1–50 字');if(password.length<10)throw Error('空间口令至少 10 个字符');const id=crypto.randomUUID(),salt=random(16),key=await derive(password,salt);const check=await encrypt(key,encoder.encode('study-garden-private-vault-v1'),`${id}|check`);return {space:{id,name:name.trim(),salt,iterations:ITERATIONS,check,version:VERSION,created:new Date().toISOString()},key};}
  async function unlock(space,password){if(space.version!==VERSION)throw Error('不支持的空间版本');const key=await derive(password,space.salt,space.iterations);const check=await decrypt(key,space.check,`${space.id}|check`);if(decoder.decode(check)!=='study-garden-private-vault-v1')throw Error('空间校验失败');return key;}
  function normalizePath(path){const parts=[];for(const p of String(path).replace(/\\/g,'/').split('/')){if(!p||p==='.')continue;if(p==='..')parts.pop();else parts.push(p);}return parts.join('/');}
  function resolveLink(reference,currentPath,files){const ref=reference.split('|')[0].split('#')[0].trim();if(!ref)return null;let decoded;try{decoded=decodeURIComponent(ref);}catch{decoded=ref;}const current=normalizePath(currentPath).split('/');current.pop();const targets=[normalizePath([...current,decoded].join('/')),normalizePath(decoded)];for(const target of targets){const match=files.find(f=>f.path===target||f.path===`${target}.md`);if(match)return match;}const name=normalizePath(decoded).split('/').pop();const candidates=files.filter(f=>f.path.split('/').pop()===name||f.path.split('/').pop()===`${name}.md`);return candidates.length===1?candidates[0]:null;}
  function packRecord(record){return {iv:base64(record.iv),data:base64(record.data)};}
  function unpackRecord(record){if(!record||typeof record.iv!=='string'||typeof record.data!=='string')throw Error('加密记录格式错误');const result={iv:unbase64(record.iv),data:unbase64(record.data)};if(result.iv.length!==12)throw Error('加密记录损坏');return result;}
  return {VERSION,ITERATIONS,CHUNK_SIZE,MAX_FILE,MAX_TOTAL,encoder,decoder,bytes,base64,unbase64,derive,encrypt,decrypt,createSpace,unlock,normalizePath,resolveLink,packRecord,unpackRecord};
});
