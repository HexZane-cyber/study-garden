(() => {
  'use strict';
  const canvas = document.getElementById('knowledge-graph');
  if (!canvas) return;
  const script = document.currentScript;
  const base = new URL('../', script.src);
  const ctx = canvas.getContext('2d');
  if (!window.Matter) {document.getElementById('graph-info').textContent='物理引擎加载失败，请刷新页面。';return;}
  const {Engine, Bodies, Body, Composite, Constraint, Sleeping} = Matter;
  const engine=Engine.create({enableSleeping:false,positionIterations:4,velocityIterations:4});
  engine.gravity.scale=0;
  const info = document.getElementById('graph-info');
  const colors = {course:'#ef5467',note:'#ff9a81',tool:'#d69767',guide:'#9e919b'};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,nodes=[],edges=[],selected=null,hover=null,drag=null,pan=null;
  let zoom=1,offset={x:0,y:0},paused=reduced,query='',running=true,last=null,accumulator=0;
  let liquid=true,flow=.55,phase=0,focusOnly=false,labelMode='smart',expanded=false;
  const wrap=canvas.closest('.graph-wrap');
  const STEP=1000/120,DT=STEP/1000,MAX_SPEED=18;
  const pauseButton=document.getElementById('graph-pause');
  const adjacency=new Map();
  let activityEnabled=true,activity={},transparency=.74;
  document.getElementById('graph-transparency').oninput=e=>{transparency=Math.max(.35,Math.min(.9,Number(e.target.value)/100||.74));document.getElementById('graph-transparency-value').textContent=`${Math.round(transparency*100)}%`;};
  function refreshActivity(){try{activity=ArticleActivity.read(localStorage);}catch{activity={};}for(const n of nodes){const path=ArticleActivity.pathKey(new URL(n.url,base).href,base.href);n.usage=path?activity[path]:null;n.flowFactor=ArticleActivity.strength(n.usage);}}
  document.getElementById('graph-activity').onchange=e=>{activityEnabled=e.target.checked;refreshActivity();if(selected)select(selected);};
  window.addEventListener('storage',e=>{if(e.key===ArticleActivity.KEY){refreshActivity();if(selected)select(selected);}});
  window.addEventListener('focus',refreshActivity);
  function drawLiquid(dark){
    ctx.lineCap='round';
    for(let i=0;i<edges.length;i++){
      const e=edges[i];if(!visible(e.a)||!visible(e.b))continue;const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.max(1,Math.hypot(dx,dy));
      const wave=Math.sin(phase*.4+i*.7)*Math.min(d*.12,24)*flow;
      const mx=(e.a.x+e.b.x)/2-dy/d*wave,my=(e.a.y+e.b.y)/2+dx/d*wave;
      const active=!selected||e.a===selected||e.b===selected;
      const gradient=ctx.createLinearGradient(e.a.x,e.a.y,e.b.x,e.b.y);
      gradient.addColorStop(0,colors[e.a.group]);gradient.addColorStop(1,colors[e.b.group]);
      ctx.strokeStyle=gradient;ctx.globalAlpha=active?(dark?.09:.07):.015;ctx.lineWidth=2/Math.sqrt(zoom);
      ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.quadraticCurveTo(mx,my,e.b.x,e.b.y);ctx.stroke();
      ctx.globalAlpha=active?.36:.05;ctx.lineWidth=.65/zoom;ctx.stroke();
      for(let j=0;j<1;j++){
        const t=(phase*(.07+flow*.08)+i*.618+j*.5)%1,u=1-t;
        const x=u*u*e.a.x+2*u*t*mx+t*t*e.b.x,y=u*u*e.a.y+2*u*t*my+t*t*e.b.y;
        ctx.globalAlpha=active?Math.sin(t*Math.PI)*.45:.03;ctx.fillStyle=colors[e.a.group];ctx.beginPath();ctx.arc(x,y,(1.1+flow)/Math.sqrt(zoom),0,Math.PI*2);ctx.fill();
      }
    }
    drawSurface(dark);
  }
  function drawSurface(dark){
    const drops=nodes.filter(visible).map(n=>{
      const velocity=Math.hypot(n.body.velocity.x,n.body.velocity.y);
      const contact=n.squeeze>.025,angle=contact?n.contactAngle:Math.atan2(n.body.velocity.y,n.body.velocity.x);
      const stretch=contact?1-n.squeeze:1+Math.min(.28,velocity*.025);
      const radius=(n.r+13)*zoom;
      return {x:width/2+offset.x+n.x*zoom,y:height/2+offset.y+n.y*zoom,rx:radius*stretch,ry:radius/stretch,angle};
    });
    const loops=LiquidSurface.contours(drops,width,height,3.5);
    if(!loops.length)return;
    const dpr=canvas.width/width;ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);
    function path(){
      ctx.beginPath();
      for(const points of loops){
        const last=points[points.length-1],first=points[0];ctx.moveTo((last.x+first.x)/2,(last.y+first.y)/2);
        for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];ctx.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);}ctx.closePath();
      }
    }
    ctx.save();path();ctx.clip('evenodd');
    for(const points of loops){
      const xs=points.map(p=>p.x),ys=points.map(p=>p.y),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
      ctx.beginPath();const last=points[points.length-1],first=points[0];ctx.moveTo((last.x+first.x)/2,(last.y+first.y)/2);
      for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];ctx.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);}ctx.closePath();
      // A solid, shaded interface replaces fuzzy halos and rigid inner spheres.
      const body=ctx.createLinearGradient(left,top,right,bottom);
      body.addColorStop(0,'#ffc5d2');body.addColorStop(.18,'#e67b96');body.addColorStop(.48,'#96294d');body.addColorStop(.75,dark?'#4b2438':'#bb6b87');body.addColorStop(1,'#f5b5ca');
      ctx.globalAlpha=(1-transparency)*(dark?1:.88);ctx.fillStyle=body;ctx.shadowColor='#08020933';ctx.shadowBlur=3;ctx.shadowOffsetY=1.5;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      const rim=ctx.createLinearGradient(left,top,right,bottom);rim.addColorStop(0,'#fff1f3dc');rim.addColorStop(.3,'#f5afc369');rim.addColorStop(.65,'#ef9fba18');rim.addColorStop(1,'#ffdae580');
      ctx.strokeStyle=rim;ctx.lineWidth=.85;ctx.globalAlpha=.75;ctx.stroke();
    }
    ctx.restore();
    // Highlights are clipped to the common liquid surface, including the neck.
    ctx.save();path();ctx.clip('evenodd');
    for(const p of drops){
      const glow=ctx.createRadialGradient(p.x-p.rx*.34,p.y-p.ry*.42,0,p.x-p.rx*.15,p.y-p.ry*.25,Math.max(p.rx,p.ry)*.88);
      glow.addColorStop(0,'#fff5f780');glow.addColorStop(.22,'#ffdce926');glow.addColorStop(1,'#ffcbd900');
      ctx.globalAlpha=.36;ctx.fillStyle=glow;ctx.fillRect(p.x-p.rx*2,p.y-p.ry*2,p.rx*4,p.ry*4);
    }
    ctx.restore();ctx.restore();
  }
  document.getElementById('graph-mode').onclick=e=>{liquid=!liquid;e.currentTarget.textContent=liquid?'液态模式':'清晰模式';e.currentTarget.setAttribute('aria-pressed',String(liquid));for(const n of nodes)Sleeping.set(n.body,false);};
  document.getElementById('graph-flow').oninput=e=>{flow=Number(e.target.value)/100;document.getElementById('graph-flow-value').textContent=`${Math.round(flow*100)}%`;for(const n of nodes)Sleeping.set(n.body,false);};
  function size(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function reset(){zoom=1;offset={x:0,y:0};drag=null;pan=null;accumulator=0;nodes.forEach((n,i)=>{const angle=i*2.39996,r=55+Math.sqrt(i)*30;n.x=Math.cos(angle)*r;n.y=Math.sin(angle)*r;n.squeeze=0;n.squeezeVelocity=0;n.contactAngle=0;if(n.body){Body.setPosition(n.body,{x:n.x,y:n.y});Body.setVelocity(n.body,{x:0,y:0});Sleeping.set(n.body,false);}});}
  function position(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left-width/2-offset.x)/zoom,y:(event.clientY-r.top-height/2-offset.y)/zoom};}
  function matchesQuery(n){return focusOnly||!query||n.title.toLowerCase().includes(query);}
  function visible(n){return !focusOnly||!selected||isLinked(n);}
  function hit(p){let found=null,best=Infinity;for(const n of nodes){if(!visible(n))continue;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<(liquid?n.r+15:n.r+10/zoom)&&d<best){found=n;best=d;}}return found;}
  function isLinked(n){return !selected||n===selected||adjacency.get(selected.id)?.has(n.id);}
  function fit(){
    const shown=nodes.filter(visible);if(!shown.length||!width||!height)return;
    const xs=shown.map(n=>n.x),ys=shown.map(n=>n.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    zoom=Math.max(.35,Math.min(2,(width-100)/Math.max(80,maxX-minX+60),(height-100)/Math.max(80,maxY-minY+60)));
    offset={x:-(minX+maxX)/2*zoom,y:-(minY+maxY)/2*zoom};
  }
  function select(n){
    selected=n;if(!n)focusOnly=false;
    const focus=document.getElementById('graph-focus');focus.disabled=!n;focus.setAttribute('aria-pressed',String(focusOnly));
    info.replaceChildren();
    if(!n){info.textContent=`${nodes.length} 篇文章 · ${edges.length} 条连接。拖动小球，探索知识之间的联系。`;return;}
    const linked=nodes.filter(other=>adjacency.get(n.id)?.has(other.id));
    const title=document.createElement('strong');title.textContent=n.title;
    info.append(title,document.createTextNode(` · ${linked.length} 篇直接关联文章`));
    const a=document.createElement('a');a.href=new URL(n.url,base).href;a.textContent='阅读全文 ↗';info.append(a);
    const list=document.createElement('div');list.className='graph-related';
    for(const other of linked){
      const item=document.createElement('span'),button=document.createElement('button'),link=document.createElement('a');
      button.type='button';button.textContent=other.title;button.title='在图中定位：'+other.title;
      button.onclick=()=>{query='';document.getElementById('graph-search').value='';select(other);fit();};link.href=new URL(other.url,base).href;link.textContent='阅读 ↗';link.setAttribute('aria-label','阅读 '+other.title);
      item.append(button,link);list.append(item);
    }
    if(!linked.length){const empty=document.createElement('p');empty.textContent='暂时没有直接关联，可在文章中添加 Markdown 链接。';list.append(empty);}
    info.append(list);
    const activityNote=document.createElement('p');activityNote.className='graph-activity-detail';
    activityNote.textContent=activityEnabled?`本机阅读 ${n.usage?.count||0} 次 · 流动权重 ${Math.round((n.flowFactor||.2)*100)}%（再乘整体强度）`:'已关闭按阅读频率调节，所有节点使用整体强度';info.append(activityNote);
  }
  function drawLabels(dark){
    ctx.save();ctx.font='11px system-ui,"Microsoft YaHei",sans-serif';ctx.textBaseline='middle';ctx.textAlign='center';ctx.lineJoin='round';
    const shown=nodes.filter(visible),boxes=[];
    const priority=n=>(n===selected?10000:0)+(n===hover?9000:0)+(query&&n.title.toLowerCase().includes(query)?8000:0)+(selected&&isLinked(n)?100:0)+(adjacency.get(n.id)?.size||0);
    const ordered=shown.slice().sort((a,b)=>priority(b)-priority(a)||a.id.localeCompare(b.id));
    const intersects=(a,b)=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+3&&a.y+a.h+3>b.y;
    const circles=shown.map(n=>({node:n,x:width/2+offset.x+n.x*zoom,y:height/2+offset.y+n.y*zoom,r:(liquid?n.r+13:n.r)*zoom+4}));
    for(const n of ordered){
      const important=n===selected||n===hover;
      if(labelMode==='off'&&!important)continue;
      if(selected&&!isLinked(n)&&!important)continue;
      if(!matchesQuery(n)&&!important)continue;
      let text=n.title,maxWidth=Math.min(260,width-24);
      while(text.length>1&&ctx.measureText(text).width>maxWidth)text=text.slice(0,-2)+'…';
      const w=ctx.measureText(text).width+10,h=19,x=width/2+offset.x+n.x*zoom,y=height/2+offset.y+n.y*zoom,r=(liquid?n.r+13:n.r)*zoom+7;
      const choices=[{x:x-w/2,y:y+r},{x:x-w/2,y:y-r-h},{x:x+r,y:y-h/2},{x:x-r-w,y:y-h/2}];
      let box;
      for(const candidate of choices){
        candidate.w=w;candidate.h=h;
        if(candidate.x<4||candidate.x+w>width-4||candidate.y<4||candidate.y+h>height-4)continue;
        if(labelMode==='smart'&&(boxes.some(b=>intersects(candidate,b))||circles.some(c=>c.node!==n&&candidate.x<c.x+c.r&&candidate.x+w>c.x-c.r&&candidate.y<c.y+c.r&&candidate.y+h>c.y-c.r)))continue;
        box=candidate;break;
      }
      if(!box&&important){box={x:Math.max(4,Math.min(width-w-4,x-w/2)),y:Math.max(4,Math.min(height-h-4,y+r)),w,h};}
      if(!box)continue;boxes.push(box);
      ctx.globalAlpha=important?1:.9;ctx.fillStyle=dark?'#171116ee':'#fffafbee';ctx.fillRect(box.x,box.y,box.w,box.h);
      ctx.fillStyle=important?(dark?'#ffe1e7':'#8e1c32'):(dark?'#d8cbd2':'#604850');ctx.fillText(text,box.x+box.w/2,box.y+box.h/2);
    }
    ctx.restore();
  }
  function expand(enabled){
    expanded=enabled;wrap.classList.toggle('graph-expanded',enabled);document.body.classList.toggle('graph-expanded',enabled);
    const button=document.getElementById('graph-expand');button.textContent=enabled?'退出大画布':'大画布';button.setAttribute('aria-pressed',String(enabled));
    wrap.setAttribute('role',enabled?'dialog':'region');wrap.setAttribute('aria-modal',String(enabled));wrap.setAttribute('aria-label','知识图谱探索');
    size();fit();if(enabled)document.getElementById('graph-search').focus();
  }
  document.getElementById('graph-labels').onchange=e=>{labelMode=e.target.value;};
  document.getElementById('graph-fit').onclick=fit;
  document.getElementById('graph-focus').onclick=()=>{if(!selected)return;focusOnly=!focusOnly;select(selected);fit();};
  document.getElementById('graph-expand').onclick=()=>expand(!expanded);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&expanded){expand(false);document.getElementById('graph-expand').focus();}
    if(e.key==='Tab'&&expanded){const items=[...wrap.querySelectorAll('input,button,select,a,[tabindex]')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  function physics(){
    // A fixed 120 Hz step keeps damping, pointer forces and contacts independent
    // of pointer-event frequency and monitor refresh rate. Velocities in Matter
    // are normalized to a 60 Hz frame; forces use milliseconds squared.
    for(const n of nodes){
      n.x=n.body.position.x;n.y=n.body.position.y;
      n.contactLoad=0;n.contactX=0;n.contactY=0;
      if(n===drag){
        const dx=drag.target.x-n.x,dy=drag.target.y-n.y,omega=.030;
        let ax=omega*omega*dx-2*.92*omega*n.body.velocity.x/(1000/60),ay=omega*omega*dy-2*.92*omega*n.body.velocity.y/(1000/60);
        const strength=Math.hypot(ax,ay);if(strength>.026){ax*=.026/strength;ay*=.026/strength;}
        Body.applyForce(n.body,n.body.position,{x:ax*n.body.mass,y:ay*n.body.mass});
      }
      const targetFlow=activityEnabled?(n.flowFactor||.2):1;n.localFlow+=(targetFlow-n.localFlow)*(1-Math.exp(-2*DT));
      if(liquid&&flow>0){const fx=Math.sin(n.y*.007+phase*.35)+Math.cos(n.x*.004-phase*.25),fy=Math.cos(n.x*.007-phase*.3)-Math.sin(n.y*.005+phase*.2);Body.applyForce(n.body,n.body.position,{x:fx*.000025*n.body.mass*flow*n.localFlow,y:fy*.000025*n.body.mass*flow*n.localFlow});}
      Body.applyForce(n.body,n.body.position,{x:-n.x*.00000013*n.body.mass,y:-n.y*.00000013*n.body.mass});
    }
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y;
      const d=Math.hypot(dx,dy),angle=d>.001?Math.atan2(dy,dx):(i+1)*2.39996+j;
      const nx=Math.cos(angle),ny=Math.sin(angle);
      if(d>400)continue;
      const mass=a.body.mass*b.body.mass/(a.body.mass+b.body.mass);
      const rest=a.r+b.r+28,overlap=Math.max(0,1-d/rest),w=Math.max(0,1-d/110);
      // Compliant Hertz contact: pressure rises continuously with compression.
      // Exponential viscous impulses dissipate energy without reversing velocity.
      const dvx=b.body.velocity.x-a.body.velocity.x,dvy=b.body.velocity.y-a.body.velocity.y;
      const vn=dvx*nx+dvy*ny,viscosity=1-Math.exp(-(liquid?5:1.5)*w*w*DT),contactDamping=vn<0?1-Math.exp(-22*Math.sqrt(overlap)*DT):0;
      const jx=mass*(dvx*viscosity+nx*vn*(1-viscosity)*contactDamping),jy=mass*(dvy*viscosity+ny*vn*(1-viscosity)*contactDamping);
      Body.setVelocity(a.body,{x:a.body.velocity.x+jx/a.body.mass,y:a.body.velocity.y+jy/a.body.mass});
      Body.setVelocity(b.body,{x:b.body.velocity.x-jx/b.body.mass,y:b.body.velocity.y-jy/b.body.mass});
      const pressure=.006*mass*Math.pow(overlap,1.5)+.04/Math.max(d*d,500);
      Body.applyForce(a.body,a.body.position,{x:-nx*pressure,y:-ny*pressure});
      Body.applyForce(b.body,b.body.position,{x:nx*pressure,y:ny*pressure});
      if(overlap>0){for(const n of [a,b]){n.contactLoad+=overlap;n.contactX+=Math.cos(2*angle)*overlap;n.contactY+=Math.sin(2*angle)*overlap;}}
    }
    Engine.update(engine,STEP);
    for(const n of nodes){
      // Spring-damper recovery avoids an instantaneous squish or snap-back.
      const target=Math.min(.28,n.contactLoad*.42),omega=18;
      n.squeezeVelocity+=(omega*omega*(target-n.squeeze)-2*.82*omega*n.squeezeVelocity)*DT;
      n.squeeze=Math.max(0,Math.min(.3,n.squeeze+n.squeezeVelocity*DT));
      if(n.contactLoad>.001){const targetAngle=Math.atan2(n.contactY,n.contactX)/2,diff=Math.atan2(Math.sin(2*(targetAngle-n.contactAngle)),Math.cos(2*(targetAngle-n.contactAngle)))/2;n.contactAngle+=diff*(1-Math.exp(-18*DT));}
      const speed=Math.hypot(n.body.velocity.x,n.body.velocity.y);if(speed>MAX_SPEED)Body.setVelocity(n.body,{x:n.body.velocity.x*MAX_SPEED/speed,y:n.body.velocity.y*MAX_SPEED/speed});
      n.x=n.body.position.x;n.y=n.body.position.y;
    }
  }
  function draw(now){if(!running)return;const delta=last===null?0:Math.max(0,Math.min(now-last,50));last=now;if(!paused&&!document.hidden){accumulator+=delta;let steps=0;while(accumulator+1e-7>=STEP&&steps<6){phase+=DT;physics();accumulator-=STEP;steps++;}}else accumulator=0;ctx.clearRect(0,0,width,height);const dark=document.body.dataset.mdColorScheme==='slate';ctx.save();ctx.translate(width/2+offset.x,height/2+offset.y);ctx.scale(zoom,zoom);if(liquid)drawLiquid(dark);if(!liquid)for(const e of edges){if(!visible(e.a)||!visible(e.b))continue;const active=selected&&(e.a===selected||e.b===selected);ctx.strokeStyle=active?'#ef5467':dark?'#673b45':'#e8c9cf';ctx.globalAlpha=selected && !active ? .18 : .65;ctx.lineWidth=(active?1.7:1)/zoom;ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.lineTo(e.b.x,e.b.y);ctx.stroke();}for(const n of nodes){if(!visible(n))continue;const match=matchesQuery(n);ctx.globalAlpha=match&&isLinked(n)?1:.16;ctx.fillStyle=colors[n.group];if(n===selected||n===hover){ctx.beginPath();ctx.arc(n.x,n.y,n.r+7/zoom,0,Math.PI*2);ctx.globalAlpha*=.18;ctx.fill();ctx.globalAlpha=match&&isLinked(n)?1:.16;}ctx.beginPath();ctx.ellipse(n.x,n.y,(liquid?2.1/zoom:n.r)*(1-n.squeeze),(liquid?2.1/zoom:n.r)/(1-n.squeeze),n.contactAngle,0,Math.PI*2);ctx.fill();if(n===selected){ctx.strokeStyle=dark?'#f4bdc7':'#a62b40';ctx.lineWidth=1.2/zoom;ctx.stroke();}}ctx.restore();drawLabels(dark);requestAnimationFrame(draw);}
  canvas.addEventListener('pointerdown',e=>{if(pan)return;canvas.setPointerCapture(e.pointerId);const p=position(e);drag=hit(p);pan={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y,moved:false,node:drag,pointerId:e.pointerId};if(drag){drag.dx=drag.x-p.x;drag.dy=drag.y-p.y;drag.target={x:drag.x,y:drag.y};for(const n of nodes)Sleeping.set(n.body,false);}});
  canvas.addEventListener('pointermove',e=>{const p=position(e);hover=hit(p);if(!pan||e.pointerId!==pan.pointerId)return;if(Math.hypot(e.clientX-pan.x,e.clientY-pan.y)>4)pan.moved=true;if(drag){drag.target={x:p.x+drag.dx,y:p.y+drag.dy};if(paused){Body.setPosition(drag.body,drag.target);Body.setVelocity(drag.body,{x:0,y:0});drag.x=drag.target.x;drag.y=drag.target.y;}}else{offset.x=pan.ox+e.clientX-pan.x;offset.y=pan.oy+e.clientY-pan.y;}});
  const up=e=>{if(!pan||(e&&e.pointerId!==pan.pointerId))return;const cancelled=e&&(e.type==='pointercancel'||e.type==='lostpointercapture');if(!cancelled&&!pan.moved)select(pan.node);if(drag&&(cancelled||paused))Body.setVelocity(drag.body,{x:0,y:0});drag=null;pan=null;};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);
  canvas.addEventListener('wheel',e=>{e.preventDefault();const p=position(e),old=zoom;zoom=Math.max(.35,Math.min(3,zoom*Math.exp(-e.deltaY*.001)));offset.x-=p.x*(zoom-old);offset.y-=p.y*(zoom-old);},{passive:false});
  canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!expanded)select(null);}else if(e.key==='0'){reset();}else if((e.key==='+'||e.key==='=')&&zoom<3){zoom*=1.1;e.preventDefault();}else if(e.key==='-'&&zoom>.35){zoom/=1.1;e.preventDefault();}});
  pauseButton.textContent=paused?'继续运动':'暂停运动';pauseButton.onclick=()=>{paused=!paused;pauseButton.textContent=paused?'继续运动':'暂停运动';};
  document.getElementById('graph-reset').onclick=()=>{reset();select(null);};
  document.getElementById('graph-search').addEventListener('input',e=>{query=e.target.value.toLowerCase();const matches=nodes.filter(n=>n.title.toLowerCase().includes(query));if(query&&matches.length===1)select(matches[0]);else select(null);if(query&&matches.length===1)fit();});
  new ResizeObserver(size).observe(canvas);
  fetch(new URL('assets/graph-data.json',base)).then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{nodes=data.nodes.map(n=>({...n,squeeze:0,squeezeVelocity:0,contactAngle:0,localFlow:.2,r:n.group==='course'?9:n.group==='note'?6:7}));const map=new Map(nodes.map(n=>[n.id,n]));edges=data.edges.map(e=>({a:map.get(e.source),b:map.get(e.target)})).filter(e=>e.a&&e.b);for(const n of nodes){n.body=Bodies.circle(0,0,n.r+13,{frictionAir:.045,restitution:0,friction:0,collisionFilter:{group:-1},sleepThreshold:90});Composite.add(engine.world,n.body);}for(const e of edges){Composite.add(engine.world,Constraint.create({bodyA:e.a.body,bodyB:e.b.body,length:175,stiffness:.0007,damping:.13}));if(!adjacency.has(e.a.id))adjacency.set(e.a.id,new Set());if(!adjacency.has(e.b.id))adjacency.set(e.b.id,new Set());adjacency.get(e.a.id).add(e.b.id);adjacency.get(e.b.id).add(e.a.id);}const list=document.getElementById('graph-links');for(const n of nodes){const li=document.createElement('li'),a=document.createElement('a');a.textContent=n.title;a.href=new URL(n.url,base).href;li.append(a);list.append(li);}refreshActivity();size();reset();select(null);requestAnimationFrame(draw);}).catch(()=>{info.textContent='图谱加载失败，请刷新页面重试。文章仍可通过左侧目录阅读。';});
  window.addEventListener('pagehide',()=>{running=false;});
  window.addEventListener('pageshow',e=>{if(e.persisted){last=null;accumulator=0;running=true;requestAnimationFrame(draw);}});
  document.addEventListener('visibilitychange',()=>{last=null;accumulator=0;if(document.hidden&&pan)up({pointerId:pan.pointerId,type:'pointercancel'});});
})();
