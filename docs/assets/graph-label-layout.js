(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphLabelLayout=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function overlap(a,b,gap=4){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
 function createLayout(){const memory=new Map();return {
  place({id,x,y,w,h,r,width,height,smart=true,important=false,obstacles=[]},occupied){
   if(!important&&(x<0||x>width||y<0||y>height))return null;
   w=Math.min(w,Math.max(1,width-8));const previous=memory.get(id),gap=previous?.visible?4:7;
   const choices=[{x:x-w/2,y:y+r},{x:x-w/2,y:y-r-h},{x:x+r,y:y-h/2},{x:x-r-w,y:y-h/2}].map(p=>({...p,w,h}));
   const inside=b=>b.x>=4&&b.y>=4&&b.x+w<=width-4&&b.y+h<=height-4;
   const clear=b=>!smart||!occupied.some(a=>overlap(a,b,gap))&&!obstacles.some(a=>a.id!==id&&overlap(a,b,gap));
   let slot=previous?.slot,box;
   if(slot!==undefined){box={...choices[slot]};box.x=Math.max(4,Math.min(width-w-4,box.x));box.y=Math.max(4,Math.min(height-h-4,box.y));}
   else{slot=choices.findIndex(b=>inside(b)&&clear(b));if(slot>=0)box=choices[slot];}
   if(!box&&important){slot=slot>=0?slot:0;box={...choices[slot],x:Math.max(4,Math.min(width-w-4,choices[slot].x)),y:Math.max(4,Math.min(height-h-4,choices[slot].y))};}
   // Once a title has a side, never flip it during motion. Occluded titles
   // temporarily hide; a larger re-entry gap prevents threshold flicker.
   if(!box||!important&&!clear(box)){if(previous)previous.visible=false;return null;}
   memory.set(id,{slot,visible:true});return box;
  },clear(){memory.clear();}
 };}
 return {overlap,createLayout};
});
