(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VaultFormats=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const groups={note:['md','markdown','txt'],pdf:['pdf'],image:['png','jpg','jpeg','webp','gif','bmp','avif'],document:['doc','docx','odt','rtf'],slides:['ppt','pptx','odp'],sheet:['xls','xlsx','ods','csv','tsv'],ebook:['epub','mobi','azw3'],audio:['mp3','wav','ogg','m4a','flac','aac'],video:['mp4','webm','mov','m4v'],code:['py','ipynb','c','h','cpp','hpp','java','js','ts','tsx','jsx','json','yaml','yml','toml','xml','html','css','sql','sh','ps1','tex','log'],archive:['zip','7z','rar','tar','gz']};
 const labels={note:'笔记',pdf:'PDF',image:'图片',document:'文档',slides:'演示文稿',sheet:'表格',ebook:'电子书',audio:'音频',video:'视频',code:'代码 / 数据',archive:'压缩包',other:'其他文件'};
 const lookup=new Map(Object.entries(groups).flatMap(([kind,exts])=>exts.map(ext=>[ext,kind])));
 const extension=path=>String(path||'').split('/').pop().split('.').slice(1).pop()?.toLowerCase()||'';
 const kind=path=>lookup.get(extension(path))||'other';
 const supported=path=>kind(path)!=='other';
 const text=path=>['note','code'].includes(kind(path))||['csv','tsv'].includes(extension(path));
 const markdown=path=>['md','markdown'].includes(extension(path));
 const mime=path=>({pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',bmp:'image/bmp',avif:'image/avif',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',m4a:'audio/mp4',flac:'audio/flac',aac:'audio/aac',mp4:'video/mp4',webm:'video/webm',mov:'video/quicktime',m4v:'video/mp4'})[extension(path)]||'application/octet-stream';
 function planImport(incoming,existing,mode='keep',folder=false){
  if(!['keep','replace','skip'].includes(mode))throw Error('未知的重名处理方式');
  const known=new Map(existing.map(f=>[f.path,f])),accepted=new Map();let skipped=0,renamed=0;
  for(const file of incoming){
   const source=folder?file.webkitRelativePath||file.name:file.name;
   if(!supported(file.name)||source.split('/').some(p=>p.startsWith('.'))){skipped++;continue;}
   let path=(folder?source.split('/').slice(1).join('/')||file.name:source).replace(/\\/g,'/');
   if(path.split('/').some(p=>!p||p==='..'||p==='.')||path.includes('\0'))throw Error('文件路径不正确');
   const original=known.get(path);let replace=null;
   if(original||accepted.has(path)){
    if(mode==='skip'){skipped++;continue;}
    if(mode==='replace')replace=original||null;
    else{const dot=path.lastIndexOf('.'),slash=path.lastIndexOf('/'),stem=dot>slash?path.slice(0,dot):path,ext=dot>slash?path.slice(dot):'';let n=2;while(known.has(path)||accepted.has(path))path=stem+' ('+(n++)+')'+ext;renamed++;}
   }
   accepted.set(path,{file,path,replace});
  }
  return {accepted:[...accepted.values()],skipped,renamed};
 }
 return {groups,labels,kind,supported,text,markdown,mime,planImport,accept:[...lookup.keys()].map(ext=>'.'+ext).join(',')};
});
