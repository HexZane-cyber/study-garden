(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KnowledgeChip=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const groups=[['note','笔记存储阵列','NOTE ARRAY'],['course','课程计算区','COURSE CORES'],['tool','工具接口区','TOOL I/O'],['guide','学习控制区','CONTROL']];
 function layout(data){
  const seen=new Set(),banks=groups.map(([group,title,label])=>{const nodes=data.nodes.filter(n=>n.group===group).filter(n=>{if(!n.id||seen.has(n.id))return false;seen.add(n.id);return true;}).sort((a,b)=>a.id.localeCompare(b.id));const cols=Math.max(2,Math.ceil(Math.sqrt(nodes.length))),rows=Math.max(1,Math.ceil(nodes.length/cols));return {group,title,label,nodes,cols,rows,w:cols*136+32,h:rows*78+62};});
  const left=Math.max(banks[0].w,banks[2].w),right=Math.max(banks[1].w,banks[3].w),top=Math.max(banks[0].h,banks[1].h),bottom=Math.max(banks[2].h,banks[3].h),width=left+right+200,height=top+bottom+200;
  banks.forEach((bank,i)=>{bank.x=i%2?left+136:64;bank.y=i<2?64:top+136;bank.nodes=bank.nodes.map((n,j)=>({...n,x:bank.x+16+(j%bank.cols)*136,y:bank.y+46+Math.floor(j/bank.cols)*78,w:112,h:48,bank:bank.group}));});
  const nodes=banks.flatMap(b=>b.nodes),byId=new Map(nodes.map(n=>[n.id,n])),byBank=new Map(banks.map(b=>[b.group,b])),keys=new Set(),edges=[];
  for(const raw of data.edges){const a=byId.get(raw.source),b=byId.get(raw.target);if(!a||!b||a===b)continue;const key=JSON.stringify([a.id,b.id].sort());if(keys.has(key))continue;keys.add(key);const i=edges.length,lane=(i%8)*3,sa=byBank.get(a.bank),sb=byBank.get(b.bank),p={x:a.x+a.w/2,y:a.y+a.h},q={x:b.x+b.w/2,y:b.y+b.h},ay=p.y+14,by=q.y+14,ax=sa.x+sa.w+12+lane,bx=sb.x+sb.w+12+lane,bus=top+100+(i%7)*3;
   const points=[p,{x:p.x,y:ay},{x:ax,y:ay}];if(sa===sb)points.push({x:ax,y:by});else points.push({x:ax,y:bus},{x:bx,y:bus},{x:bx,y:by});points.push({x:q.x,y:by},q);
   const clean=points.filter((v,j)=>!j||v.x!==points[j-1].x||v.y!==points[j-1].y),lengths=[0];for(let j=1;j<clean.length;j++)lengths.push(lengths[j-1]+Math.hypot(clean[j].x-clean[j-1].x,clean[j].y-clean[j-1].y));edges.push({id:i,a,b,points:clean,lengths,length:lengths[lengths.length-1]});
  }
  const neighbors=new Map(nodes.map((n,i)=>{n.address=i+1;return [n.id,new Set()];}));for(const edge of edges){neighbors.get(edge.a.id).add(edge.b.id);neighbors.get(edge.b.id).add(edge.a.id);edge.bounds={left:Math.min(...edge.points.map(p=>p.x)),right:Math.max(...edge.points.map(p=>p.x)),top:Math.min(...edge.points.map(p=>p.y)),bottom:Math.max(...edge.points.map(p=>p.y))};}
  return {banks,nodes,byId,edges,neighbors,width,height,notes:banks[0].nodes.length,capacity:banks.reduce((sum,b)=>sum+b.cols*b.rows,0)};
 }
 function pointOn(edge,t){const distance=Math.max(0,Math.min(1,t))*edge.length;let i=1;while(i<edge.lengths.length-1&&edge.lengths[i]<distance)i++;const a=edge.points[i-1],b=edge.points[i],part=edge.lengths[i]-edge.lengths[i-1],u=part?(distance-edge.lengths[i-1])/part:0;return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u};}
 return {layout,pointOn,groups};
});
