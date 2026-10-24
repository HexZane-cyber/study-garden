'use strict';
const axes=['x','y','z'];
function seed(id){let hash=2166136261;for(const c of id)hash=Math.imul(hash^c.codePointAt(0),16777619);return (hash>>>0)/4294967296*Math.PI*2;}
function createModel(data){
  const nodes=data.nodes.map(n=>({...n,r:n.group==='course'?.44:.35,mass:n.group==='course'?1.2:1,seed:seed(n.id),x:0,y:0,z:0,vx:0,vy:0,vz:0,squeeze:0,localFlow:n.flowFactor||.2,targetFlow:n.flowFactor||.2}));
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const edges=data.edges.map(e=>({a:byId.get(e.source),b:byId.get(e.target)})).filter(e=>e.a&&e.b);
  let time=0,drag=null;
  function reset(){
    time=0;drag=null;
    nodes.forEach((n,i)=>{const y=1-2*(i+.5)/Math.max(1,nodes.length),r=Math.sqrt(Math.max(0,1-y*y)),a=i*2.399963;
      n.x=Math.cos(a)*r*3.7;n.y=y*3.7;n.z=Math.sin(a)*r*3.7;n.vx=n.vy=n.vz=0;n.squeeze=0;
    });
  }
  reset();
  function step(dt=1/120,flow=.55,adaptive=true,gravity={x:0,y:0,z:0}){
    dt=Math.max(0,Math.min(dt,1/60));time+=dt;
    const forces=nodes.map(n=>({x:-n.x*.09*n.mass,y:-n.y*.09*n.mass,z:-n.z*.09*n.mass,load:0}));
    const index=new Map(nodes.map((n,i)=>[n,i]));const g=Object.fromEntries(axes.map(axis=>[axis,Number.isFinite(gravity?.[axis])?gravity[axis]:0])),gLength=Math.hypot(g.x,g.y,g.z),gScale=1/Math.max(1,gLength);
    for(let i=0;i<nodes.length;i++){
      const n=nodes[i],f=forces[i];n.localFlow+=((adaptive?n.targetFlow:1)-n.localFlow)*(1-Math.exp(-2*dt));
      for(const axis of axes)f[axis]+=g[axis]*gScale*4*n.mass;
      if(gLength>.00001){const distance=Math.hypot(n.x,n.y,n.z),excess=Math.max(0,distance-6),outward=distance?Math.max(0,axes.reduce((sum,axis)=>sum+n['v'+axis]*n[axis]/distance,0)):0,wall=excess*16+outward*4*Math.min(1,excess);if(distance)for(const axis of axes)f[axis]-=n[axis]/distance*wall*n.mass;f.load+=Math.min(.6,excess);}
      const amp=.9*flow*n.localFlow*n.mass;
      f.x+=(Math.sin(n.y*.5+time*.35)+Math.cos(n.z*.35-time*.2))*amp;
      f.y+=(Math.sin(n.z*.45+time*.27)-Math.cos(n.x*.4+time*.3))*amp;
      f.z+=(Math.sin(n.x*.4-time*.3)+Math.cos(n.y*.35+time*.2))*amp;
      if(drag?.id===n.id){
        const acceleration=axes.map(axis=>70*(drag[axis]-n[axis])-13*n['v'+axis]);
        const cap=Math.min(1,90/Math.max(1e-9,Math.hypot(...acceleration)));
        axes.forEach((axis,j)=>{f[axis]+=acceleration[j]*cap*n.mass;});
      }
    }
    for(const e of edges){
      const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,dz=e.b.z-e.a.z,d=Math.max(1e-6,Math.hypot(dx,dy,dz));
      const normal={x:dx/d,y:dy/d,z:dz/d},relative=axes.reduce((s,a)=>s+(e.b['v'+a]-e.a['v'+a])*normal[a],0);
      const force=2.8*(d-3.2)+.6*relative;
      for(const a of axes){forces[index.get(e.a)][a]+=normal[a]*force;forces[index.get(e.b)][a]-=normal[a]*force;}
    }
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d=Math.hypot(dx,dy,dz);
      if(d<1e-6){dx=Math.cos(a.seed+j);dy=Math.sin(a.seed+j);dz=.4;d=Math.hypot(dx,dy,dz);dx*=1e-5/d;dy*=1e-5/d;dz*=1e-5/d;d=1e-5;}
      if(d>6)continue;
      const normal={x:dx/d,y:dy/d,z:dz/d},rest=(a.r+b.r)*1.32,overlap=Math.max(0,rest-d);
      const mass=a.mass*b.mass/(a.mass+b.mass),vn=axes.reduce((s,axis)=>s+(b['v'+axis]-a['v'+axis])*normal[axis],0);
      const pressure=mass*(42*Math.pow(overlap,1.5)+Math.max(0,-vn)*Math.sqrt(overlap)*7)+.12/Math.max(.5,d*d);
      const viscosity=mass*(1-Math.exp(-2*Math.max(0,1-d/2.4)**2*dt));
      for(const axis of axes){
        forces[i][axis]-=normal[axis]*pressure;forces[j][axis]+=normal[axis]*pressure;
        const impulse=(b['v'+axis]-a['v'+axis])*viscosity;
        a['v'+axis]+=impulse/a.mass;b['v'+axis]-=impulse/b.mass;
      }
      forces[i].load+=overlap/rest;forces[j].load+=overlap/rest;
    }
    nodes.forEach((n,i)=>{
      for(const axis of axes)n['v'+axis]=(n['v'+axis]+forces[i][axis]/n.mass*dt)*Math.exp(-.9*dt);
      const speed=Math.hypot(n.vx,n.vy,n.vz);if(speed>12)for(const axis of axes)n['v'+axis]*=12/speed;
      for(const axis of axes)n[axis]+=n['v'+axis]*dt;
      n.squeeze+=(Math.min(.25,forces[i].load*.35)-n.squeeze)*(1-Math.exp(-12*dt));
    });
  }
  return {nodes,edges,byId,step,reset,get time(){return time;},setDrag(target){drag=target;},get drag(){return drag;}};
}
module.exports={createModel,seed};
