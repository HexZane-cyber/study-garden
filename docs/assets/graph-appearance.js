(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphAppearance=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const KEY='study-garden-graph-colors-v1',GROUPS={course:'#ef5467',note:'#ff9a81',tool:'#d69767',guide:'#9e919b'};
  const valid=color=>typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color);
  const defaults=()=>({groups:{...GROUPS},nodes:{},line:'#a94f6b'});
  function load(storage){const result=defaults();try{const raw=JSON.parse(storage.getItem(KEY)||'{}');for(const group of Object.keys(GROUPS))if(valid(raw.groups?.[group]))result.groups[group]=raw.groups[group].toLowerCase();if(valid(raw.line))result.line=raw.line.toLowerCase();for(const [id,color]of Object.entries(raw.nodes||{}).slice(0,500))if(id.length<300&&valid(color))result.nodes[id]=color.toLowerCase();}catch{}return result;}
  function save(storage,config){try{storage.setItem(KEY,JSON.stringify(config));return true;}catch{return false;}}
  const colorFor=(config,node)=>(valid(config.nodes[node.id])?config.nodes[node.id]:null)||config.groups[node.group]||GROUPS.guide;
  function apply(config,target,color,id){if(!valid(color))throw Error('请输入有效的六位颜色，例如 #ef5467');const next={groups:{...config.groups},nodes:{...config.nodes},line:config.line};color=color.toLowerCase();if(target==='node'){if(!id)throw Error('请先选择一个节点');next.nodes[id]=color;}else if(target==='line')next.line=color;else if(Object.hasOwn(GROUPS,target))next.groups[target]=color;else throw Error('请选择要修改的对象');return next;}
  return {KEY,valid,defaults,load,save,colorFor,apply};
});
