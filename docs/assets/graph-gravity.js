(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphGravity=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function vector(value){let x=Number.isFinite(value?.x)?value.x:0,y=Number.isFinite(value?.y)?value.y:0;const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}return {x,y};}
 function orientation(beta,gamma,angle=0){if(!Number.isFinite(beta)||!Number.isFinite(gamma))return null;const b=beta*Math.PI/180,g=gamma*Math.PI/180,a=(Number.isFinite(angle)?angle:0)*Math.PI/180,x=Math.sin(g)*Math.cos(b),y=Math.sin(b);return vector({x:x*Math.cos(a)+y*Math.sin(a),y:-x*Math.sin(a)+y*Math.cos(a)});}
 function createField(){let mode='off',strength=.5,target={x:0,y:1},current={x:0,y:0},phase=0;return {
  configure(options={}){const enteringOrbit=options.mode==='orbit'&&mode!=='orbit';if(['off','manual','orbit'].includes(options.mode))mode=options.mode;if(Number.isFinite(options.strength))strength=Math.max(0,Math.min(1,options.strength));if(options.vector){const next=vector(options.vector);if(next.x!==target.x||next.y!==target.y){target=next;phase=Math.atan2(target.y,target.x);}}if(enteringOrbit)phase=Math.atan2(target.y,target.x);},
  step(dt){dt=Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0));if(mode==='orbit')phase+=dt*Math.PI/12;const v=mode==='off'?{x:0,y:0}:mode==='orbit'?{x:Math.cos(phase),y:Math.sin(phase)}:target,k=1-Math.exp(-6*dt);current={x:current.x+(v.x*strength-current.x)*k,y:current.y+(v.y*strength-current.y)*k};return {...current};},
  reset(){current={x:0,y:0};},get value(){return {...current};}
 };}
 return {vector,orientation,createField};
});
