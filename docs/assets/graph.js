(() => {
  'use strict';
  const canvas = document.getElementById('knowledge-graph');
  if (!canvas) return;
  const script = document.currentScript;
  const base = new URL('../', script.src);
  const ctx = canvas.getContext('2d');
  if (!window.Matter) {document.getElementById('graph-info').textContent='物理引擎加载失败，请刷新页面。';return;}
  const {Engine, Bodies, Body, Composite, Constraint, Sleeping} = Matter;
  const engine=Engine.create({enableSleeping:true,positionIterations:4,velocityIterations:4});
  engine.gravity.scale=0;
  const info = document.getElementById('graph-info');
  const colors = {course:'#ef5467',note:'#ff9a81',tool:'#d69767',guide:'#9e919b'};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,nodes=[],edges=[],selected=null,hover=null,drag=null,pan=null;
  let zoom=1,offset={x:0,y:0},paused=reduced,query='',running=true,last=0,accumulator=0;
  let liquid=true,flow=.55,phase=0;
  const pauseButton=document.getElementById('graph-pause');
  const adjacency=new Map();
  function drawLiquid(dark){
    // Translucent necks suggest coalescence without obscuring article identities.
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),reach=a.r+b.r+42;
      if(d>=reach)continue;
      const t=1-d/reach,gradient=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
      gradient.addColorStop(0,colors[a.group]);gradient.addColorStop(1,colors[b.group]);
      ctx.globalAlpha=(isLinked(a)&&isLinked(b)?.16:.025)*t;ctx.strokeStyle=gradient;ctx.lineWidth=(a.r+b.r+10)*Math.sqrt(t);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2+Math.sin(phase)*4,(a.y+b.y)/2,a.x+dx,a.y+dy);ctx.stroke();
    }
    ctx.lineCap='round';
    for(let i=0;i<edges.length;i++){
      const e=edges[i],dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.max(1,Math.hypot(dx,dy));
      const wave=Math.sin(phase*.4+i*.7)*Math.min(d*.12,24)*flow;
      const mx=(e.a.x+e.b.x)/2-dy/d*wave,my=(e.a.y+e.b.y)/2+dx/d*wave;
      const active=!selected||e.a===selected||e.b===selected;
      const gradient=ctx.createLinearGradient(e.a.x,e.a.y,e.b.x,e.b.y);
      gradient.addColorStop(0,colors[e.a.group]);gradient.addColorStop(1,colors[e.b.group]);
      ctx.strokeStyle=gradient;ctx.globalAlpha=active?(dark?.09:.07):.02;ctx.lineWidth=(4+flow*5)/Math.sqrt(zoom);
      ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.quadraticCurveTo(mx,my,e.b.x,e.b.y);ctx.stroke();
      ctx.globalAlpha=active?.33:.04;ctx.lineWidth=.8/zoom;ctx.stroke();
      for(let j=0;j<2;j++){
        const t=(phase*(.07+flow*.08)+i*.618+j*.5)%1,u=1-t;
        const x=u*u*e.a.x+2*u*t*mx+t*t*e.b.x,y=u*u*e.a.y+2*u*t*my+t*t*e.b.y;
        ctx.globalAlpha=active?Math.sin(t*Math.PI)*.8:.06;ctx.fillStyle=colors[e.a.group];ctx.beginPath();ctx.arc(x,y,(1.1+flow)/Math.sqrt(zoom),0,Math.PI*2);ctx.fill();
      }
    }
    for(const n of nodes){
      const active=isLinked(n)&&(!query||n.title.toLowerCase().includes(query));
      const r=n.r+10+flow*5;
      const glow=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*2.4);glow.addColorStop(0,colors[n.group]+'60');glow.addColorStop(1,colors[n.group]+'00');
      ctx.globalAlpha=active?.65:.08;ctx.fillStyle=glow;ctx.beginPath();ctx.arc(n.x,n.y,r*2.4,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=active?.16:.025;ctx.fillStyle=colors[n.group];ctx.beginPath();
      for(let k=0;k<=32;k++){const a=k*Math.PI*2/32,rr=r*(1+Math.sin(a*3+phase*1.2+n.x*.013)*.09*flow+Math.cos(a*2-phase*.8)*.08*flow);const deformation=1-n.squeeze*Math.cos(2*(a-n.contactAngle));const x=n.x+Math.cos(a)*rr*deformation,y=n.y+Math.sin(a)*rr*deformation;if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();
      ctx.globalAlpha=active?.38:.04;ctx.strokeStyle=colors[n.group];ctx.lineWidth=.7/zoom;ctx.stroke();
    }
  }
  document.getElementById('graph-mode').onclick=e=>{liquid=!liquid;e.currentTarget.textContent=liquid?'液态模式':'清晰模式';e.currentTarget.setAttribute('aria-pressed',String(liquid));for(const n of nodes)Sleeping.set(n.body,false);};
  document.getElementById('graph-flow').oninput=e=>{flow=Number(e.target.value)/100;document.getElementById('graph-flow-value').textContent=`${Math.round(flow*100)}%`;for(const n of nodes)Sleeping.set(n.body,false);};
  function size(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function reset(){zoom=1;offset={x:0,y:0};nodes.forEach((n,i)=>{const angle=i*2.39996,r=55+Math.sqrt(i)*30;n.x=Math.cos(angle)*r;n.y=Math.sin(angle)*r;if(n.body){Body.setStatic(n.body,false);Body.setPosition(n.body,{x:n.x,y:n.y});Body.setVelocity(n.body,{x:0,y:0});Sleeping.set(n.body,false);}});}
  function position(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left-width/2-offset.x)/zoom,y:(event.clientY-r.top-height/2-offset.y)/zoom};}
  function hit(p){let found=null,best=22/zoom;for(const n of nodes){const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<Math.max(n.r+7/zoom,best)){found=n;best=d;}}return found;}
  function isLinked(n){return !selected||n===selected||adjacency.get(selected.id)?.has(n.id);}
  function select(n){selected=n;info.replaceChildren();if(!n){info.textContent=`${nodes.length} 篇文章 · ${edges.length} 条连接。拖动小球，探索知识之间的联系。`;return;}const title=document.createElement('strong');title.textContent=n.title;info.append(title,document.createTextNode(` · ${adjacency.get(n.id)?.size||0} 篇关联文章`));const a=document.createElement('a');a.href=new URL(n.url,base).href;a.textContent='阅读全文 ↗';info.append(a);}
  function physics(){
    // Soft particle pressure and viscosity replace rigid collision impulses.
    // Matter.js still integrates bodies and solves graph spring constraints.
    for(const n of nodes){
      n.squeeze*=.94;
      if(n===drag)continue;
      if(liquid&&flow>0){const fx=Math.sin(n.y*.007+phase*.35)+Math.cos(n.x*.004-phase*.25),fy=Math.cos(n.x*.007-phase*.3)-Math.sin(n.y*.005+phase*.2);Body.applyForce(n.body,n.body.position,{x:fx*.000025*n.body.mass*flow,y:fy*.000025*n.body.mass*flow});}
      Body.applyForce(n.body,n.body.position,{x:-n.x*.00000013*n.body.mass,y:-n.y*.00000013*n.body.mass});
    }
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y;
      const d=Math.max(Math.hypot(dx,dy),.1),nx=dx/d,ny=dy/d;
      if(d>400)continue;
      const h=95,w=Math.max(0,1-d/h),mass=Math.min(a.body.mass,b.body.mass);
      const pressure=.0018*mass*w*w*w;
      const repulsion=.07/Math.max(d*d,500);
      const viscosity=(liquid?.00024:.00012)*mass*w*w;
      const dvx=b.body.velocity.x-a.body.velocity.x,dvy=b.body.velocity.y-a.body.velocity.y;
      const fx=-nx*(pressure+repulsion)+dvx*viscosity,fy=-ny*(pressure+repulsion)+dvy*viscosity;
      if(a!==drag)Body.applyForce(a.body,a.body.position,{x:fx,y:fy});
      if(b!==drag)Body.applyForce(b.body,b.body.position,{x:-fx,y:-fy});
      if(w>.15){const deformation=Math.min(.28,w*w*.7);a.squeeze=Math.max(a.squeeze,deformation);b.squeeze=Math.max(b.squeeze,deformation);a.contactAngle=Math.atan2(dy,dx);b.contactAngle=a.contactAngle;}
    }
    Engine.update(engine,1000/60);
    for(const n of nodes){n.x=n.body.position.x;n.y=n.body.position.y;}
  }
  function draw(now){if(!running)return;const delta=last?Math.min(now-last,50):0;last=now;if(!paused)phase+=delta/1000;if(!paused&&!document.hidden){accumulator+=delta;let steps=0;while(accumulator>=1000/60&&steps<3){physics();accumulator-=1000/60;steps++;}}else accumulator=0;ctx.clearRect(0,0,width,height);const dark=document.body.dataset.mdColorScheme==='slate';ctx.save();ctx.translate(width/2+offset.x,height/2+offset.y);ctx.scale(zoom,zoom);if(liquid)drawLiquid(dark);if(!liquid)for(const e of edges){const active=selected&&(e.a===selected||e.b===selected);ctx.strokeStyle=active?'#ef5467':dark?'#673b45':'#e8c9cf';ctx.globalAlpha=selected && !active ? .18 : .65;ctx.lineWidth=(active?1.7:1)/zoom;ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.lineTo(e.b.x,e.b.y);ctx.stroke();}for(const n of nodes){const match=!query||n.title.toLowerCase().includes(query);ctx.globalAlpha=match&&isLinked(n)?1:.16;ctx.fillStyle=colors[n.group];if(n===selected||n===hover){ctx.beginPath();ctx.arc(n.x,n.y,n.r+7/zoom,0,Math.PI*2);ctx.globalAlpha*=.18;ctx.fill();ctx.globalAlpha=match&&isLinked(n)?1:.16;}ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();if(n===selected){ctx.strokeStyle=dark?'#f4bdc7':'#a62b40';ctx.lineWidth=2/zoom;ctx.stroke();}ctx.fillStyle=dark?'#d1c4cc':'#65515a';ctx.font=`${11/Math.sqrt(zoom)}px system-ui,"Microsoft YaHei",sans-serif`;ctx.textAlign='center';ctx.globalAlpha=match&&isLinked(n)?1:.16;ctx.fillText(n.title,n.x,n.y+n.r+15/Math.sqrt(zoom));}ctx.restore();requestAnimationFrame(draw);}
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);const p=position(e);drag=hit(p);pan={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y,moved:false,node:drag};if(drag){drag.dx=drag.x-p.x;drag.dy=drag.y-p.y;Body.setStatic(drag.body,true);for(const n of nodes)Sleeping.set(n.body,false);}});
  canvas.addEventListener('pointermove',e=>{const p=position(e);hover=hit(p);if(!pan)return;if(Math.hypot(e.clientX-pan.x,e.clientY-pan.y)>4)pan.moved=true;if(drag){const movedX=p.x+drag.dx-drag.x,movedY=p.y+drag.dy-drag.y;drag.x=p.x+drag.dx;drag.y=p.y+drag.dy;if(liquid){for(const n of nodes){if(n===drag)continue;const d=Math.hypot(n.x-drag.x,n.y-drag.y);if(d<180){const strength=(1-d/180)*flow*.000035*n.body.mass;Body.applyForce(n.body,n.body.position,{x:movedX*strength,y:movedY*strength});Sleeping.set(n.body,false);}}}Body.setPosition(drag.body,{x:drag.x,y:drag.y});}else{offset.x=pan.ox+e.clientX-pan.x;offset.y=pan.oy+e.clientY-pan.y;}});
  const up=()=>{if(pan&&!pan.moved)select(pan.node);if(drag){Body.setStatic(drag.body,false);Body.setVelocity(drag.body,{x:0,y:0});}drag=null;pan=null;};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',e=>{e.preventDefault();const p=position(e),old=zoom;zoom=Math.max(.35,Math.min(3,zoom*Math.exp(-e.deltaY*.001)));offset.x-=p.x*(zoom-old);offset.y-=p.y*(zoom-old);},{passive:false});
  canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);}else if(e.key==='0'){reset();}else if((e.key==='+'||e.key==='=')&&zoom<3){zoom*=1.1;e.preventDefault();}else if(e.key==='-'&&zoom>.35){zoom/=1.1;e.preventDefault();}});
  pauseButton.textContent=paused?'继续运动':'暂停运动';pauseButton.onclick=()=>{paused=!paused;pauseButton.textContent=paused?'继续运动':'暂停运动';};
  document.getElementById('graph-reset').onclick=()=>{reset();select(null);};
  document.getElementById('graph-search').addEventListener('input',e=>{query=e.target.value.toLowerCase();const matches=nodes.filter(n=>n.title.toLowerCase().includes(query));if(query&&matches.length===1)select(matches[0]);else select(null);});
  new ResizeObserver(size).observe(canvas);
  fetch(new URL('assets/graph-data.json',base)).then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{nodes=data.nodes.map(n=>({...n,squeeze:0,contactAngle:0,r:n.group==='course'?9:n.group==='note'?6:7}));const map=new Map(nodes.map(n=>[n.id,n]));edges=data.edges.map(e=>({a:map.get(e.source),b:map.get(e.target)})).filter(e=>e.a&&e.b);for(const n of nodes){n.body=Bodies.circle(0,0,n.r+13,{frictionAir:.045,restitution:0,friction:0,collisionFilter:{group:-1},sleepThreshold:90});Composite.add(engine.world,n.body);}for(const e of edges){Composite.add(engine.world,Constraint.create({bodyA:e.a.body,bodyB:e.b.body,length:175,stiffness:.0007,damping:.13}));if(!adjacency.has(e.a.id))adjacency.set(e.a.id,new Set());if(!adjacency.has(e.b.id))adjacency.set(e.b.id,new Set());adjacency.get(e.a.id).add(e.b.id);adjacency.get(e.b.id).add(e.a.id);}const list=document.getElementById('graph-links');for(const n of nodes){const li=document.createElement('li'),a=document.createElement('a');a.textContent=n.title;a.href=new URL(n.url,base).href;li.append(a);list.append(li);}size();reset();select(null);requestAnimationFrame(draw);}).catch(()=>{info.textContent='图谱加载失败，请刷新页面重试。文章仍可通过左侧目录阅读。';});
  window.addEventListener('pagehide',()=>{running=false;});
  window.addEventListener('pageshow',e=>{if(e.persisted){running=true;requestAnimationFrame(draw);}});
})();
