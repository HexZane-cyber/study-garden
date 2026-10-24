(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphTransfer=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const LIMIT=12;
 function createEmitter(){
  let clock=0,scan=0,nextLaunch=0,serial=0,particles=[];const cooldown=new Map();
  function reset(){clock=scan=nextLaunch=serial=0;particles=[];cooldown.clear();}
  function step(nodes,delta,{enabled=true,paused=false,reduced=false}={}){
   if(!enabled||reduced){reset();return particles;}
   if(paused)return particles;
   const dt=Math.max(0,Math.min(.05,Number.isFinite(delta)?delta:0));if(!dt)return particles;
   clock+=dt;scan-=dt;const byId=new Map(nodes.map(n=>[n.id,n]));
   particles=particles.filter(p=>{
    const a=byId.get(p.source),b=byId.get(p.target);if(!a||!b)return false;
    const distance=Math.hypot(b.x-a.x,b.y-a.y,(b.z||0)-(a.z||0));if(distance>a.r+b.r+8*Math.min(a.r,b.r))return false;
    p.t+=dt/p.duration;if(p.t>=1)return false;
    const u=1-p.t,t=p.t,bx=b.x-p.nx*b.r*.35,by=b.y-p.ny*b.r*.35,bz=(b.z||0)-p.nz*b.r*.35;
    p.x=u*u*p.startX+2*u*t*p.controlX+t*t*bx;p.y=u*u*p.startY+2*u*t*p.controlY+t*t*by;p.z=u*u*p.startZ+2*u*t*p.controlZ+t*t*bz;
    // Grow out of the sender, then taper inside the receiver.
    p.size=p.radius*Math.min(1,t/.16)*Math.min(1,(1-t)/.22);p.stretch=1+.65*Math.sin(t*Math.PI);
    return true;
   });
   if(scan<=0){scan=.1;for(const [key,until]of cooldown)if(until<=clock)cooldown.delete(key);
    if(clock>=nextLaunch&&particles.length<LIMIT){
     let chosen=null,best=Infinity;
     for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],r=Math.min(a.r,b.r);if(!(r>0))continue;
      const dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-(a.z||0),d=Math.hypot(dx,dy,dz),gap=d-a.r-b.r,key=JSON.stringify([a.id,b.id].sort());
      if(gap<r*.12||gap>r*2.8||cooldown.has(key))continue;
      if(gap/r<best){best=gap/r;chosen={a,b,key,d};}
     }
     if(chosen){let {a,b,key,d}=chosen;if((a.flowFactor||.2)<(b.flowFactor||.2)||((a.flowFactor||.2)===(b.flowFactor||.2)&&serial%2))[a,b]=[b,a];
      const nx=(b.x-a.x)/d,ny=(b.y-a.y)/d,nz=((b.z||0)-(a.z||0))/d,radius=Math.min(a.r,b.r)*.2;
      const x=a.x+nx*a.r*.9,y=a.y+ny*a.r*.9,z=(a.z||0)+nz*a.r*.9,side=Math.hypot(nx,ny)||1,arc=Math.min(a.r,b.r)*.25*(serial%2?1:-1);
      particles.push({source:a.id,target:b.id,t:0,duration:.72+Math.min(.25,best*.08),radius,size:0,stretch:1,nx,ny,nz,x,y,z,startX:x,startY:y,startZ:z,controlX:(x+b.x)/2-ny/side*arc,controlY:(y+b.y)/2+nx/side*arc,controlZ:(z+(b.z||0))/2});
      serial++;cooldown.set(key,clock+2.2);nextLaunch=clock+.28;
     }
    }
   }
   return particles;
  }
  return {step,reset,get particles(){return particles;}};
 }
 return {createEmitter,LIMIT};
});
