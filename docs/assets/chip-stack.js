(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChipStack=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const capacity=12,groups=[['note','笔记'],['course','课程'],['tool','工具'],['guide','指南']];
 function layout(data){
  const layers=[],nodes=[],byId=new Map();
  for(const [group,title] of groups){const list=data.nodes.filter(n=>n.group===group).sort((a,b)=>a.id.localeCompare(b.id));for(let start=0;start<list.length;start+=capacity){const layer={index:layers.length,title:title+' · '+(Math.floor(start/capacity)+1),group,nodes:[]};for(const [slot,raw]of list.slice(start,start+capacity).entries()){if(byId.has(raw.id))continue;const n={...raw,layer:layer.index,x:(slot%4-1.5)*140,z:(Math.floor(slot/4)-1)*85};nodes.push(n);layer.nodes.push(n);byId.set(n.id,n);}layers.push(layer);}}
  return {layers,nodes,byId,width:640,depth:350,capacity};
 }
 const KEY='zhixin-chip-layout-v1',shapes=['die','memory','hex','round'];
 function shape(n){return shapes.includes(n.shape)?n.shape:({note:'die',course:'memory',tool:'round',guide:'hex'}[n.group]||'die');}
 function footprint(n){const size={die:[52,22],memory:[52,15],hex:[44.55,27],round:[26.4,24]}[shape(n)],scale=Number.isFinite(n.scale)&&n.scale>=.8&&n.scale<=1.15?n.scale:1;return {x:size[0]*scale,z:size[1]*scale,scale};}
 function placement(model,n,x,z,style={}){if(!Number.isFinite(x)||!Number.isFinite(z))return null;const candidate={...n,...style,x,z},r=footprint(candidate);candidate.x=Math.max(-290+r.x,Math.min(290-r.x,x));candidate.z=Math.max(-150+r.z,Math.min(150-r.z,z));for(const other of model.layers[n.layer].nodes){if(other.id===n.id)continue;const b=footprint(other);if(Math.abs(candidate.x-other.x)<r.x+b.x+8&&Math.abs(candidate.z-other.z)<r.z+b.z+8)return null;}return {x:candidate.x,z:candidate.z,shape:shape(candidate),scale:r.scale};}
 function load(storage,model){try{const raw=storage.getItem(KEY);if(!raw)return true;const data=JSON.parse(raw);if(data?.version!==1||!Array.isArray(data.nodes))return false;const proposed=new Map(model.nodes.map(n=>[n.id,{...n}]));for(const row of data.nodes.slice(0,10000)){const n=proposed.get(row?.id);if(!n||!shapes.includes(row.shape)||!Number.isFinite(row.scale)||row.scale<.8||row.scale>1.15||!Number.isFinite(row.x)||!Number.isFinite(row.z))continue;Object.assign(n,{x:row.x,z:row.z,shape:row.shape,scale:row.scale});}const draft={layers:model.layers.map(l=>({...l,nodes:l.nodes.map(n=>proposed.get(n.id))}))};for(const n of proposed.values()){const p=placement(draft,n,n.x,n.z);if(!p||p.x!==n.x||p.z!==n.z)return false;}for(const n of model.nodes)Object.assign(n,proposed.get(n.id));return true;}catch{return false;}}
 function save(storage,model){try{storage.setItem(KEY,JSON.stringify({version:1,nodes:model.nodes.map(n=>({id:n.id,x:n.x,z:n.z,shape:shape(n),scale:footprint(n).scale}))}));return true;}catch{return false;}}
 function route(a,b,index,gap,heights){
  const ar=footprint(a),br=footprint(b),ay=(heights?heights[a.layer]:a.layer*gap)+6,by=(heights?heights[b.layer]:b.layer*gap)+6,az=a.z+ar.z+14,bz=b.z+br.z+14,lane=294+(index%5)*5;
  const points=[{x:a.x,y:ay,z:a.z+ar.z},{x:a.x,y:ay,z:az},{x:lane,y:ay,z:az}];
  if(a.layer!==b.layer){const bus=332+(index%7)*7;points.push({x:lane,y:ay,z:195},{x:bus,y:ay,z:195},{x:bus,y:by,z:195},{x:lane,y:by,z:195});}
  points.push({x:lane,y:by,z:bz},{x:b.x,y:by,z:bz},{x:b.x,y:by,z:b.z+br.z});
  return points.filter((p,i)=>!i||p.x!==points[i-1].x||p.y!==points[i-1].y||p.z!==points[i-1].z);
 }
 function segments(points){const result=[];for(let i=1;i<points.length;i++)result.push(points[i-1].x,points[i-1].y,points[i-1].z,points[i].x,points[i].y,points[i].z);return result;}
 function sample(points,t){let total=0;const lengths=[0];for(let i=1;i<points.length;i++){total+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y,points[i].z-points[i-1].z);lengths.push(total);}const d=Math.max(0,Math.min(1,t))*total;let i=1;while(i<points.length-1&&lengths[i]<d)i++;const a=points[i-1],b=points[i],u=(d-lengths[i-1])/(lengths[i]-lengths[i-1]||1);return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,z:a.z+(b.z-a.z)*u};}
 function transition(from,gap,start,reduced=false){return {from:[...from],to:from.map((_,i)=>i*gap),start,duration:reduced?0:1040,stagger:reduced?0:Math.min(260,Math.max(0,from.length-1)*65),opening:(from.length-1)*gap>=(from.at(-1)||0)};}
 function ease(t){t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);}
 function advance(motion,now,out){const elapsed=Math.max(0,now-motion.start),n=motion.from.length;for(let i=0;i<n;i++){const rank=n>1?(motion.opening?n-1-i:i)/(n-1):0,progress=motion.duration?ease((elapsed-rank*motion.stagger)/motion.duration):1;out[i]=motion.from[i]+(motion.to[i]-motion.from[i])*progress;}return elapsed>=motion.duration+motion.stagger;}
 return {layout,route,segments,sample,capacity,transition,advance,ease,KEY,shapes,shape,footprint,placement,load,save};
});
