(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphInteraction=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function createTapTracker(){let last=null;return {finish({id,x,y,time=Date.now(),moved=false,cancelled=false}){if(cancelled||moved||!id){last=null;return cancelled||moved?'none':'select';}const open=last&&last.id===id&&time>=last.time&&time-last.time<=450&&Math.hypot(x-last.x,y-last.y)<=18;last=open?null:{id,x,y,time};return open?'open':'select';},reset(){last=null;}};}
 const feedback=()=>({pressure:0,velocity:0,pulse:0});
 function step(value,pressed,dt,reduced=false){if(reduced){value.pressure=0;value.velocity=0;value.pulse=0;return value;}dt=Math.max(0,Math.min(.035,Number.isFinite(dt)?dt:0));const omega=26;value.velocity+=(omega*omega*((pressed?1:0)-value.pressure)-2*.8*omega*value.velocity)*dt;value.pressure=Math.max(0,Math.min(1.1,value.pressure+value.velocity*dt));if(!value.pressure&&value.velocity<0)value.velocity=0;value.pulse=Math.max(0,value.pulse-dt*2.5);return value;}
 function segmentDistanceSquared(x,y,a,b){const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/length)):0;return (x-a.x-t*dx)**2+(y-a.y-t*dy)**2;}
 function hitEdge(paths,x,y,tolerance=8){let chosen=null,best=tolerance*tolerance;for(const path of paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i];if(!a||!b)continue;const d=segmentDistanceSquared(x,y,a,b);if(d<best){best=d;chosen=path.id;}}return chosen;}
 return {createTapTracker,feedback,step,segmentDistanceSquared,hitEdge};
});
