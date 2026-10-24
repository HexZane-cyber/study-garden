(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphCircuit=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const axes=['x','y','z'];
 const point=()=>({x:0,y:0,z:0});
 function create(){return {axis:null,raw:Array.from({length:8},point),points:Array.from({length:16},point),lengths:new Float64Array(16),input:new Float64Array(10).fill(NaN),count:0,length:0};}
 function update(route,a,b,index=0,{dimensions=3,radiusA=a.r||0,radiusB=b.r||0,corner=.12}={}){
  const input=[a.x,a.y,a.z||0,b.x,b.y,b.z||0,dimensions,radiusA,radiusB,corner];let changed=false;for(let i=0;i<input.length;i++)if(route.input[i]!==input[i]){changed=true;route.input[i]=input[i];}if(!changed)return route;
  const dx=b.x-a.x,dy=b.y-a.y,dz=dimensions===2?0:(b.z||0)-(a.z||0),distance=Math.hypot(dx,dy,dz);
  route.count=0;route.length=0;if(!Number.isFinite(distance)||distance<=radiusA+radiusB+.00001)return route;
  // Choose the routing plane once. Motion changes coordinates, never the topology.
  if(route.axis===null)route.axis=Math.abs(dx)>=Math.abs(dy)?0:1;
  const primary=axes[route.axis],secondary=axes[1-route.axis],raw=route.raw;
  const unit={x:dx/distance,y:dy/distance,z:dz/distance},lead=Math.min((distance-radiusA-radiusB)*.22,distance*.08,Math.max(radiusA,radiusB)*.35+.02);
  let count=0;function add(v){Object.assign(raw[count++],v);}
  const start=point(),end=point(),from=point(),to=point();
  for(const k of axes){const av=k==='z'&&dimensions===2?0:(a[k]||0),bv=k==='z'&&dimensions===2?0:(b[k]||0);start[k]=av+unit[k]*radiusA;end[k]=bv-unit[k]*radiusB;from[k]=start[k]+unit[k]*lead;to[k]=end[k]-unit[k]*lead;}
  const middle=(from[primary]+to[primary])*.5,one={...from,[primary]:middle},two={...one,[secondary]:to[secondary]};
  add(start);add(from);add(one);add(two);if(dimensions===3)add({...two,z:to.z});add(to);add(end);
  // Small bevels give 45-degree corners on orthogonal runs, without spline wobble.
  function emit(v){const last=route.points[route.count-1];if(last&&Math.hypot(last.x-v.x,last.y-v.y,last.z-v.z)<1e-9)return;Object.assign(route.points[route.count],v);if(last)route.length+=Math.hypot(last.x-v.x,last.y-v.y,last.z-v.z);route.lengths[route.count]=route.length;route.count++;}
  emit(raw[0]);for(let i=1;i<count-1;i++){const prev=raw[i-1],v=raw[i],next=raw[i+1],before=Math.hypot(v.x-prev.x,v.y-prev.y,v.z-prev.z),after=Math.hypot(next.x-v.x,next.y-v.y,next.z-v.z),cut=Math.min(Math.max(0,corner),before*.28,after*.28);if(cut<1e-9){emit(v);continue;}const entry=point(),exit=point();for(const k of axes){entry[k]=v[k]+(prev[k]-v[k])*cut/before;exit[k]=v[k]+(next[k]-v[k])*cut/after;}emit(entry);emit(exit);}emit(raw[count-1]);return route;
 }
 function sample(route,t,out=point()){if(!route.count)return Object.assign(out,{x:0,y:0,z:0});const distance=Math.max(0,Math.min(1,t))*route.length;let i=1;while(i<route.count-1&&route.lengths[i]<distance)i++;if(route.count===1)return Object.assign(out,route.points[0]);const a=route.points[i-1],b=route.points[i],length=route.lengths[i]-route.lengths[i-1],u=length?(distance-route.lengths[i-1])/length:0;for(const k of axes)out[k]=a[k]+(b[k]-a[k])*u;return out;}
 return {create,update,sample};
});
