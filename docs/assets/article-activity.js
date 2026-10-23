(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArticleActivity=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const KEY='study-garden-article-activity-v1',DAY=86400000;
  function pathKey(value,base){
    try{const u=new URL(value,base),b=new URL(base);if(u.origin!==b.origin||!u.pathname.startsWith(b.pathname))return null;
      const relative=u.pathname.slice(b.pathname.length).replace(/index\.html$/,'').replace(/\/$/,'');
      if(/^(private|graph|library|contribute|workbench|discussion|publish)(\/|$)/.test(relative))return null;
      return b.pathname+relative+(relative?'/':'');
    }catch{return null;}
  }
  function read(storage,now=Date.now()){
    const clean={};try{const raw=JSON.parse(storage.getItem(KEY)||'{}');if(raw.version!==1||!raw.entries||typeof raw.entries!=='object')return clean;
      for(const [path,item] of Object.entries(raw.entries).slice(0,500)){
        if(!path.startsWith('/')||!item||!Number.isInteger(item.count)||item.count<1||item.count>100000||!Number.isFinite(item.last)||item.last<0||item.last>now+DAY)continue;
        clean[path]={count:item.count,last:item.last};
      }
    }catch{}return clean;
  }
  function record(storage,value,base,now=Date.now()){
    const path=pathKey(value,base);if(!path)return false;
    const entries=read(storage,now),previous=entries[path];
    // Refreshes and rapid back/forward navigation are one reading visit.
    if(previous&&now-previous.last<5*60000)return false;
    entries[path]={count:Math.min(100000,(previous?.count||0)+1),last:now};
    const retained=Object.fromEntries(Object.entries(entries).sort((a,b)=>b[1].last-a[1].last).slice(0,500));
    try{storage.setItem(KEY,JSON.stringify({version:1,entries:retained}));return true;}catch{return false;}
  }
  function strength(item,now=Date.now()){
    if(!item)return .2;
    const recent=item.count*Math.pow(.5,Math.max(0,now-item.last)/(14*DAY));
    return .2+.8*(1-Math.exp(-recent/4));
  }
  return {KEY,pathKey,read,record,strength};
});
