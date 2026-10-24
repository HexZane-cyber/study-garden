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
  let appearance=GraphAppearance.defaults();try{appearance=GraphAppearance.load(localStorage);}catch{}
  const colors={...appearance.groups};
  const colorOf=n=>GraphAppearance.colorFor(appearance,n);
  function mixColor(a,b,t){const out=[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0'));return '#'+out.join('');}
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,nodes=[],edges=[],selected=null,selectedEdge=null,hover=null,drag=null,pan=null;
  let zoom=1,offset={x:0,y:0},paused=reduced,query='',running=true,last=null,accumulator=0;
  let liquid=true,flow=.55,phase=0,focusOnly=false,labelMode='smart',expanded=false,contactMode='soft';
  const wrap=canvas.closest('.graph-wrap');
  let drawFrame=null;
  function requestDraw(){if(drawFrame===null)drawFrame=requestAnimationFrame(draw);}
  const STEP=1000/120,DT=STEP/1000,MAX_SPEED=18;
  const pauseButton=document.getElementById('graph-pause');
  const labelLayout=GraphLabelLayout.createLayout();
  const taps=GraphInteraction.createTapTracker();let labelHitAreas=[],navigationTimer=null;
  const transferEmitter=GraphTransfer.createEmitter();let transferEnabled=true;
  document.getElementById('graph-transfer').onchange=e=>{transferEnabled=e.target.checked;if(!transferEnabled)transferEmitter.reset();sync3D();};
  const card=document.createElement('div'),cardTitle=document.createElement('strong'),cardLink=document.createElement('a'),cardClose=document.createElement('button');card.className='graph-node-card';card.hidden=true;card.setAttribute('role','group');card.setAttribute('aria-label','节点快捷入口');cardLink.textContent='打开笔记 →';cardClose.type='button';cardClose.textContent='×';cardClose.setAttribute('aria-label','关闭节点快捷入口');cardClose.onclick=()=>select(null);card.append(cardTitle,cardLink,cardClose);canvas.closest('.graph-stage').append(card);let cardPinned=false,cardPosition=null,lastCardTime=0;
  card.addEventListener('pointerenter',()=>{cardPinned=true;});card.addEventListener('pointerleave',()=>{cardPinned=Boolean(card.contains?.(document.activeElement));});card.addEventListener('focusin',()=>{cardPinned=true;});card.addEventListener('focusout',()=>{cardPinned=false;});
  const edgeCard=document.createElement('div'),edgeTitle=document.createElement('strong'),edgeSource=document.createElement('a'),edgeTarget=document.createElement('a'),edgeClose=document.createElement('button');edgeCard.className='graph-node-card graph-edge-card';edgeCard.hidden=true;edgeCard.setAttribute('role','group');edgeCard.setAttribute('aria-label','连接快捷入口');edgeTitle.textContent='已选中连接';edgeClose.type='button';edgeClose.textContent='×';edgeClose.setAttribute('aria-label','关闭连接快捷入口');edgeClose.onclick=()=>select(null);edgeCard.append(edgeTitle,edgeSource,edgeTarget,edgeClose);canvas.closest('.graph-stage').append(edgeCard);
  function selectRelation(edge){select(null);if(!edge)return;selectedEdge=edge;for(const [link,n]of [[edgeSource,edge.a],[edgeTarget,edge.b]]){link.textContent=n.title+' ↗';link.href=articleURL(n)||'#';}edgeCard.hidden=false;const title=document.createElement('strong');title.textContent=edge.a.title+' ↔ '+edge.b.title;info.replaceChildren();info.append(title,document.createTextNode(' · 文章之间的链接。点击右上方入口阅读任意一端。'));sync3D();}
  function hitRelation(event){const rect=canvas.getBoundingClientRect(),paths=[];edges.forEach((edge,i)=>{if(!visible(edge.a)||!visible(edge.b))return;const dx=edge.b.x-edge.a.x,dy=edge.b.y-edge.a.y,d=Math.max(1,Math.hypot(dx,dy)),wave=liquid?Math.min(d*.35,90)*bend/Math.max(1,d/175)*(i%2?1:-1)*(.8+.2*Math.sin(phase*.4+i*.7)*flow):Math.min(d*.35,90)*bend,mx=(edge.a.x+edge.b.x)/2-dy/d*wave,my=(edge.a.y+edge.b.y)/2+dx/d*wave,points=[];for(let j=0;j<=20;j++){const t=j/20,u=1-t;points.push({x:width/2+offset.x+(u*u*edge.a.x+2*u*t*mx+t*t*edge.b.x)*zoom,y:height/2+offset.y+(u*u*edge.a.y+2*u*t*my+t*t*edge.b.y)*zoom});}paths.push({id:i,points});});const id=GraphInteraction.hitEdge(paths,event.clientX-rect.left,event.clientY-rect.top,event.pointerType==='touch'?14:8);return id===null?null:edges[id];}
  function articleURL(n){try{const url=new URL(n.url,base);return url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&!url.username&&!url.password?url.href:null;}catch{return null;}}
  function openNode(n){const url=n&&articleURL(n);if(!url||navigationTimer!==null)return;cardLink.textContent='正在打开…';navigationTimer=window.setTimeout(()=>{navigationTimer=null;window.location.assign(url);},reduced?0:100);}
  function positionCard(now){if(!selected){card.hidden=true;cardPosition=null;return;}const p=view==='3d'?scene3D?.screenPosition?.(selected.id):{x:width/2+offset.x+selected.x*zoom,y:height/2+offset.y+selected.y*zoom,r:(selected.r+13)*zoom};if(!p||p.x<0||p.x>width||p.y<0||p.y>height){card.hidden=true;return;}card.hidden=false;if(cardPinned)return;const target={x:Math.max(8,Math.min(width-Math.min(240,width-16)-8,p.x-120)),y:Math.max(8,Math.min(height-90,p.y+p.r+16))},dt=Math.max(0,Math.min(.05,(now-lastCardTime)/1000));lastCardTime=now;if(!cardPosition||reduced)cardPosition=target;else{const k=1-Math.exp(-16*dt);cardPosition.x+=(target.x-cardPosition.x)*k;cardPosition.y+=(target.y-cardPosition.y)*k;}card.style.transform=`translate(${cardPosition.x}px,${cardPosition.y}px)`;}
  const adjacency=new Map();
  let view='2d',scene3D=null;
  let gravityOptions={mode:'off',strength:.5,vector:{x:0,y:1}};const gravityField=GraphGravity.createField();
  window.addEventListener('graph-gravity-change',event=>{gravityOptions={...event.detail};gravityField.configure(gravityOptions);scene3D?.setState({gravity:gravityOptions});});
  function sync3D(){if(scene3D)scene3D.setState({selected:selected?.id||null,edge:selectedEdge?edges.indexOf(selectedEdge):-1,query,focusOnly,paused,flow,adaptive:activityEnabled,transparency,liquid,transfer:transferEnabled,contactMode,labels:labelMode,nodeColors:Object.fromEntries(nodes.map(n=>[n.id,colorOf(n)])),lineColor:appearance.line,bend,gravity:gravityOptions,activities:Object.fromEntries(nodes.map(n=>[n.id,n.flowFactor||.2]))});}
  function setView(next){
    taps.reset();transferEmitter.reset();cardPosition=null;
    const c3=document.getElementById('knowledge-graph-3d'),status=document.getElementById('graph-render-status');
    if(next==='3d'){
      c3.hidden=false;canvas.hidden=true;
      try{if(!window.Graph3D)throw Error('三维组件未加载');if(!scene3D)scene3D=Graph3D.createScene(c3,{nodes:nodes.map(n=>({id:n.id,title:n.title,group:n.group,url:articleURL(n),flowFactor:n.flowFactor||.2})),edges:edges.map(e=>({source:e.a.id,target:e.b.id}))},id=>select(nodes.find(n=>n.id===id)||null),text=>{const failed=scene3D;scene3D=null;failed?.dispose();setView('2d');status.hidden=false;status.textContent=text;},{onOpen:id=>openNode(nodes.find(n=>n.id===id)),onEdge:index=>selectRelation(edges[index])});view='3d';scene3D.setVisible(true);status.hidden=true;}
      catch(error){view='2d';c3.hidden=true;canvas.hidden=false;status.hidden=false;status.textContent='当前浏览器未能开启三维渲染，已显示二维液面。';}
    }else{view='2d';c3.hidden=true;canvas.hidden=false;scene3D?.setVisible(false);status.hidden=true;}
    document.getElementById('graph-view').value=view;document.getElementById('graph-hint').textContent=view==='3d'?'单击选中 · 双击打开笔记 · 拖动液滴移动':'单击选中 · 双击打开笔记 · 拖动空白平移';
    last=null;accumulator=0;sync3D();size();
  }
  document.getElementById('graph-view').onchange=e=>setView(e.target.value);document.getElementById('graph-contact').onchange=e=>{contactMode=e.target.value==='merge'?'merge':'soft';sync3D();};
  function shapeSeed(id){let hash=2166136261;for(const ch of id)hash=Math.imul(hash^ch.codePointAt(0),16777619);return (hash>>>0)/4294967296*Math.PI*2;}
  let activityEnabled=true,activity={},transparency=.74,bend=.28;
  document.getElementById('graph-bend').oninput=e=>{bend=Math.max(0,Math.min(.6,Number(e.target.value)/100||0));document.getElementById('graph-bend-value').textContent=`${Math.round(bend*100)}%`;sync3D();};
  document.getElementById('graph-transparency').oninput=e=>{transparency=Math.max(.35,Math.min(.9,Number(e.target.value)/100||.74));document.getElementById('graph-transparency-value').textContent=`${Math.round(transparency*100)}%`;sync3D();};
  function refreshActivity(){try{activity=ArticleActivity.read(localStorage);}catch{activity={};}for(const n of nodes){const path=ArticleActivity.pathKey(new URL(n.url,base).href,base.href);n.usage=path?activity[path]:null;n.flowFactor=ArticleActivity.strength(n.usage);}sync3D();}
  document.getElementById('graph-activity').onchange=e=>{activityEnabled=e.target.checked;refreshActivity();if(selected)select(selected);};
  window.addEventListener('storage',e=>{if(e.key===ArticleActivity.KEY){refreshActivity();if(selected)select(selected);}});
  window.addEventListener('focus',refreshActivity);
  function updateColorPicker(){
    const target=document.getElementById('graph-color-target').value||'node',disabled=target==='node'&&!selected;
    const color=target==='node'?(selected?colorOf(selected):appearance.groups.course):target==='line'?appearance.line:appearance.groups[target];
    for(const id of ['graph-color-wheel','graph-color-hex','graph-color-apply'])document.getElementById(id).disabled=disabled;
    document.getElementById('graph-color-inherit').disabled=!selected||!Object.hasOwn(appearance.nodes,selected.id);
    document.getElementById('graph-color-wheel').value=color||'#ef5467';document.getElementById('graph-color-hex').value=color||'#ef5467';
  }
  function refreshColors(){
    Object.assign(colors,appearance.groups);
    for(const icon of document.querySelectorAll?.('[data-graph-group]')||[])icon.style.backgroundColor=appearance.groups[icon.dataset.graphGroup];
    updateColorPicker();sync3D();
  }
  function applyColor(value){
    const status=document.getElementById('graph-color-status');
    try{appearance=GraphAppearance.apply(appearance,document.getElementById('graph-color-target').value||'node',value,selected?.id);let saved=false;try{saved=GraphAppearance.save(localStorage,appearance);}catch{}refreshColors();status.textContent=saved?'颜色已应用并保存在本浏览器。':'颜色已应用，但浏览器未允许保存设置。';}
    catch(error){status.textContent=error.message;}
  }
  document.getElementById('graph-color-target').onchange=()=>{updateColorPicker();document.getElementById('graph-color-status').textContent='选择调色盘颜色即可应用，也可以输入十六进制颜色值。';};
  document.getElementById('graph-color-wheel').oninput=e=>applyColor(e.target.value);
  document.getElementById('graph-color-apply').onclick=()=>applyColor(document.getElementById('graph-color-hex').value.trim());
  document.getElementById('graph-color-hex').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();applyColor(e.target.value.trim());}};
  document.getElementById('graph-color-inherit').onclick=()=>{if(!selected)return;delete appearance.nodes[selected.id];try{GraphAppearance.save(localStorage,appearance);}catch{}refreshColors();document.getElementById('graph-color-status').textContent='当前节点已跟随分类默认色。';};
  document.getElementById('graph-color-reset').onclick=()=>{appearance=GraphAppearance.defaults();try{GraphAppearance.save(localStorage,appearance);}catch{}refreshColors();document.getElementById('graph-color-status').textContent='已恢复默认配色。';};
  window.addEventListener('storage',e=>{if(e.key===GraphAppearance.KEY){try{appearance=GraphAppearance.load(localStorage);}catch{}refreshColors();}});
  refreshColors();
  function drawLiquid(dark){
    ctx.lineCap='round';
    for(let i=0;i<edges.length;i++){
      const e=edges[i];if(!visible(e.a)||!visible(e.b))continue;const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.max(1,Math.hypot(dx,dy));
      const wave=Math.min(d*.35,90)*bend/Math.max(1,d/175)*(i%2?1:-1)*(.8+.2*Math.sin(phase*.4+i*.7)*flow);
      const mx=(e.a.x+e.b.x)/2-dy/d*wave,my=(e.a.y+e.b.y)/2+dx/d*wave;
      const active=selectedEdge?e===selectedEdge:!selected||e.a===selected||e.b===selected;
      const gradient=ctx.createLinearGradient(e.a.x,e.a.y,e.b.x,e.b.y);
      gradient.addColorStop(0,appearance.line);gradient.addColorStop(1,mixColor(appearance.line,'#ffffff',.2));
      ctx.strokeStyle=gradient;ctx.globalAlpha=active?(dark?.09:.07):.015;ctx.lineWidth=2/Math.sqrt(zoom);
      ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.quadraticCurveTo(mx,my,e.b.x,e.b.y);ctx.stroke();
      ctx.globalAlpha=e===selectedEdge ? .95 : active ? .36 : .05;ctx.lineWidth=(e===selectedEdge?2.5:.65)/zoom;ctx.stroke();
      for(let j=0;j<1;j++){
        const t=(phase*(.07+flow*.08)+i*.618+j*.5)%1,u=1-t;
        const x=u*u*e.a.x+2*u*t*mx+t*t*e.b.x,y=u*u*e.a.y+2*u*t*my+t*t*e.b.y;
        ctx.globalAlpha=active?Math.sin(t*Math.PI)*.45:.03;ctx.fillStyle=appearance.line;ctx.beginPath();ctx.arc(x,y,(1.1+flow)/Math.sqrt(zoom),0,Math.PI*2);ctx.fill();
      }
    }
    drawSurface(dark);
  }
  function drawSurface(dark){
    const drops=nodes.filter(visible).map(n=>{
      const velocity=Math.hypot(n.body.velocity.x,n.body.velocity.y),seed=n.shapeSeed;
      const radius=(n.r+13)*zoom,press=1-.06*(n.feedback?.pressure||0);
      const breathe=phase*.55*flow*n.localFlow;
      return {color:colorOf(n),x:width/2+offset.x+n.x*zoom,y:height/2+offset.y+n.y*zoom,
        rx:radius*n.surfaceStretch/press,ry:radius/n.surfaceStretch*press,angle:n.surfaceAngle,
        skew:.14*Math.sin(seed)+Math.min(.17,velocity*.018),
        wave2:.08+.05*Math.sin(seed*1.7+breathe),
        wave3:.02+.10*(.5+.5*Math.cos(seed*2.1+breathe*.8)),phase:seed*.7+breathe*.25};
    });
    const loops=LiquidSurface.contours(drops,width,height,3.5,{merge:contactMode==='merge'});
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
      // Translucent shading follows the shared, deforming surface.
      const body=ctx.createLinearGradient(left,top,right,bottom),mid={x:(left+right)/2,y:(top+bottom)/2};
      const nearest=drops.reduce((a,b)=>Math.hypot(a.x-mid.x,a.y-mid.y)<Math.hypot(b.x-mid.x,b.y-mid.y)?a:b),tint=nearest.color;
      body.addColorStop(0,mixColor(tint,'#ffffff',.7));body.addColorStop(.18,mixColor(tint,'#ffffff',.25));body.addColorStop(.48,tint);body.addColorStop(.75,mixColor(tint,dark?'#141114':'#ffffff',.45));body.addColorStop(1,mixColor(tint,'#ffffff',.55));
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
  document.getElementById('graph-mode').onclick=e=>{liquid=!liquid;e.currentTarget.textContent=liquid?'液态模式':'清晰模式';e.currentTarget.setAttribute('aria-pressed',String(liquid));for(const n of nodes)Sleeping.set(n.body,false);sync3D();};
  document.getElementById('graph-flow').oninput=e=>{flow=Number(e.target.value)/100;document.getElementById('graph-flow-value').textContent=`${Math.round(flow*100)}%`;for(const n of nodes)Sleeping.set(n.body,false);sync3D();};
  function size(){const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function reset(){transferEmitter.reset();taps.reset();if(view==='3d')scene3D?.reset();zoom=1;offset={x:0,y:0};drag=null;pan=null;accumulator=0;nodes.forEach((n,i)=>{const angle=i*2.39996,r=55+Math.sqrt(i)*30;n.x=Math.cos(angle)*r;n.y=Math.sin(angle)*r;n.squeeze=0;n.squeezeVelocity=0;n.contactAngle=0;n.surfaceAngle=n.shapeSeed;n.surfaceStretch=1+.12*Math.sin(n.shapeSeed);if(n.body){Body.setPosition(n.body,{x:n.x,y:n.y});Body.setVelocity(n.body,{x:0,y:0});Sleeping.set(n.body,false);}});}
  function position(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left-width/2-offset.x)/zoom,y:(event.clientY-r.top-height/2-offset.y)/zoom};}
  function matchesQuery(n){return focusOnly||!query||n.title.toLowerCase().includes(query);}
  function visible(n){return !focusOnly||!selected||isLinked(n);}
  function hit(p){let found=null,best=Infinity;for(const n of nodes){if(!visible(n))continue;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<(liquid?(n.r+13)*Math.max(n.surfaceStretch,1/n.surfaceStretch)*1.25:n.r+10/zoom)&&d<best){found=n;best=d;}}return found;}
  function isLinked(n){return !selected||n===selected||adjacency.get(selected.id)?.has(n.id);}
  function fit(){
    if(view==='3d'){scene3D?.fit();return;}
    const shown=nodes.filter(visible);if(!shown.length||!width||!height)return;
    const xs=shown.map(n=>n.x),ys=shown.map(n=>n.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    zoom=Math.max(.35,Math.min(2,(width-100)/Math.max(80,maxX-minX+60),(height-100)/Math.max(80,maxY-minY+60)));
    offset={x:-(minX+maxX)/2*zoom,y:-(minY+maxY)/2*zoom};
  }
  function select(n){
    selectedEdge=null;edgeCard.hidden=true;
    selected=n;if(!n)focusOnly=false;updateColorPicker();sync3D();
    cardPinned=false;cardPosition=null;card.hidden=!n;if(n){cardTitle.textContent=n.title;cardLink.href=articleURL(n)||'#';cardLink.textContent='打开笔记 →';cardLink.setAttribute('aria-label','打开笔记 '+n.title);}else cardLink.removeAttribute?.('href');
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
    const shown=nodes.filter(visible),boxes=[];labelHitAreas=[];
    const priority=n=>(n===selected?10000:0)+(n===hover?9000:0)+(query&&n.title.toLowerCase().includes(query)?8000:0)+(selected&&isLinked(n)?100:0)+(adjacency.get(n.id)?.size||0);
    const ordered=shown.slice().sort((a,b)=>priority(b)-priority(a)||a.id.localeCompare(b.id));
    const circles=shown.map(n=>({node:n,x:width/2+offset.x+n.x*zoom,y:height/2+offset.y+n.y*zoom,r:(liquid?(n.r+13)*1.3:n.r)*zoom+4}));
    const obstacles=circles.map(c=>({id:c.node.id,x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2}));
    for(const n of ordered){
      const important=n===selected||n===hover;
      if(labelMode==='off'&&!important)continue;
      if(selected&&!isLinked(n)&&!important)continue;
      if(!matchesQuery(n)&&!important)continue;
      let text=n.title,maxWidth=Math.min(260,width-24);
      while(text.length>1&&ctx.measureText(text).width>maxWidth)text=text.slice(0,-2)+'…';
      const w=ctx.measureText(text).width+10,h=19,x=width/2+offset.x+n.x*zoom,y=height/2+offset.y+n.y*zoom,r=(liquid?(n.r+13)*1.3:n.r)*zoom+7;
      const box=labelLayout.place({id:n.id,x,y,w,h,r,width,height,smart:labelMode==='smart',important,obstacles},boxes);
      if(!box)continue;boxes.push(box);labelHitAreas.push({...box,node:n});
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
  document.getElementById('graph-labels').onchange=e=>{labelMode=e.target.value;sync3D();};
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
    const gravity=gravityField.step(DT),pull=Math.hypot(gravity.x,gravity.y);
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
      if(pull>.00001){const distance=Math.hypot(n.x,n.y),limit=230,excess=Math.max(0,distance-limit),outward=distance?Math.max(0,(n.body.velocity.x*n.x+n.body.velocity.y*n.y)/distance):0,wall=excess*.000007+outward*.00012*Math.min(1,excess/25);Body.applyForce(n.body,n.body.position,{x:(gravity.x*.00025-(distance?n.x/distance*wall:0))*n.body.mass,y:(gravity.y*.00025-(distance?n.y/distance*wall:0))*n.body.mass});}
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
      const moving=speed>.08,contact=n.squeeze>.025;
      const targetAngle=contact?n.contactAngle:moving?Math.atan2(n.body.velocity.y,n.body.velocity.x):n.shapeSeed;
      const diff=Math.atan2(Math.sin(targetAngle-n.surfaceAngle),Math.cos(targetAngle-n.surfaceAngle));
      n.surfaceAngle+=diff*(1-Math.exp(-4*DT));
      const targetStretch=contact?1-n.squeeze:1+.12*Math.sin(n.shapeSeed)+Math.min(.32,speed*.03);
      n.surfaceStretch+=(targetStretch-n.surfaceStretch)*(1-Math.exp(-5*DT));
    }
  }
  function drawTransfers(dt){
    const packets=transferEmitter.step(nodes.filter(visible).map(n=>({id:n.id,x:n.x,y:n.y,r:n.r+13,flowFactor:n.flowFactor})),document.hidden?0:dt,{enabled:liquid&&transferEnabled,paused,reduced});
    for(const p of packets){const a=nodes.find(n=>n.id===p.source),b=nodes.find(n=>n.id===p.target);if(!a||!b)continue;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.ny,p.nx));ctx.globalAlpha=.9;ctx.fillStyle=mixColor(colorOf(a),colorOf(b),p.t);ctx.beginPath();ctx.ellipse(0,0,p.size*p.stretch,p.size/Math.sqrt(p.stretch),0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.65;ctx.fillStyle='#fff3f6';ctx.beginPath();ctx.ellipse(-p.size*.2,-p.size*.25,p.size*.35,p.size*.17,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  }
  function draw(now){drawFrame=null;if(!running)return;if(view==='3d'){positionCard(now);requestDraw();return;}const delta=last===null?0:Math.max(0,Math.min(now-last,50));last=now;if(!paused&&!document.hidden){accumulator+=delta;let steps=0;while(accumulator+1e-7>=STEP&&steps<6){phase+=DT;physics();accumulator-=STEP;steps++;}}else accumulator=0;for(const n of nodes)GraphInteraction.step(n.feedback,n===drag,document.hidden?0:delta/1000,reduced);ctx.clearRect(0,0,width,height);const dark=document.body.dataset.mdColorScheme==='slate';ctx.save();ctx.translate(width/2+offset.x,height/2+offset.y);ctx.scale(zoom,zoom);if(liquid)drawLiquid(dark);if(!liquid)for(const e of edges){if(!visible(e.a)||!visible(e.b))continue;const active=selectedEdge?e===selectedEdge:selected&&(e.a===selected||e.b===selected);ctx.strokeStyle=appearance.line;ctx.globalAlpha=(selected||selectedEdge)&&!active ? .12 : e===selectedEdge ? .95 : .65;ctx.lineWidth=(e===selectedEdge?2.5:active?1.7:1)/zoom;ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.max(1,Math.hypot(dx,dy)),wave=Math.min(d*.35,90)*bend;ctx.quadraticCurveTo((e.a.x+e.b.x)/2-dy/d*wave,(e.a.y+e.b.y)/2+dx/d*wave,e.b.x,e.b.y);ctx.stroke();}for(const n of nodes){if(!visible(n))continue;const match=matchesQuery(n);if(n.feedback.pulse>0||n===drag){ctx.beginPath();ctx.arc(n.x,n.y,(n.r+15)*(1+(n===drag?0:(1-n.feedback.pulse)*.6)),0,Math.PI*2);ctx.strokeStyle=colorOf(n);ctx.globalAlpha=reduced ? .4 : Math.max(n.feedback.pulse*.55,n===drag ? .35 : 0);ctx.lineWidth=1.5/zoom;ctx.stroke();}ctx.globalAlpha=match&&isLinked(n)?1:.16;ctx.fillStyle=colorOf(n);if(n===selected||n===hover){ctx.beginPath();ctx.arc(n.x,n.y,n.r+7/zoom,0,Math.PI*2);ctx.globalAlpha*=.18;ctx.fill();ctx.globalAlpha=match&&isLinked(n)?1:.16;}ctx.beginPath();ctx.ellipse(n.x,n.y,(liquid?2.1/zoom:n.r)*(1-n.squeeze)/(1-.065*n.feedback.pressure),(liquid?2.1/zoom:n.r)/(1-n.squeeze)*(1-.065*n.feedback.pressure),n.contactAngle,0,Math.PI*2);ctx.fill();if(n===selected){ctx.strokeStyle=dark?'#f4bdc7':'#a62b40';ctx.lineWidth=1.2/zoom;ctx.stroke();}}drawTransfers(delta/1000);ctx.restore();drawLabels(dark);positionCard(now);requestDraw();}
  canvas.addEventListener('pointerdown',e=>{if(pan||e.button!==undefined&&e.button!==0)return;canvas.setPointerCapture(e.pointerId);const p=position(e),rect=canvas.getBoundingClientRect(),label=labelHitAreas.find(b=>e.clientX-rect.left>=b.x&&e.clientX-rect.left<=b.x+b.w&&e.clientY-rect.top>=b.y&&e.clientY-rect.top<=b.y+b.h);drag=label?null:hit(p);pan={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y,moved:false,node:label?.node||drag,edge:label||drag?null:hitRelation(e),label:Boolean(label),pointerId:e.pointerId};if(drag){drag.dx=drag.x-p.x;drag.dy=drag.y-p.y;drag.target={x:drag.x,y:drag.y};for(const n of nodes)Sleeping.set(n.body,false);}});
  canvas.addEventListener('pointermove',e=>{const p=position(e);hover=hit(p);if(!pan||e.pointerId!==pan.pointerId)return;if(Math.hypot(e.clientX-pan.x,e.clientY-pan.y)>4)pan.moved=true;if(drag){drag.target={x:p.x+drag.dx,y:p.y+drag.dy};if(paused){Body.setPosition(drag.body,drag.target);Body.setVelocity(drag.body,{x:0,y:0});drag.x=drag.target.x;drag.y=drag.target.y;}}else{offset.x=pan.ox+e.clientX-pan.x;offset.y=pan.oy+e.clientY-pan.y;}});
  const up=e=>{if(!pan||(e&&e.pointerId!==pan.pointerId))return;const cancelled=e&&(e.type==='pointercancel'||e.type==='lostpointercapture');const moved=pan.moved||Number.isFinite(e?.clientX)&&Math.hypot(e.clientX-pan.x,e.clientY-pan.y)>4,result=taps.finish({id:pan.node?.id,x:pan.x,y:pan.y,moved,cancelled});if(result!=='none'&&pan.edge)selectRelation(pan.edge);else if(result!=='none'){if(pan.node)pan.node.feedback.pulse=1;select(pan.node);if(result==='open'||pan.label)openNode(pan.node);}if(drag&&(cancelled||paused))Body.setVelocity(drag.body,{x:0,y:0});drag=null;pan=null;};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);
  canvas.addEventListener('wheel',e=>{e.preventDefault();const p=position(e),old=zoom;zoom=Math.max(.35,Math.min(3,zoom*Math.exp(-e.deltaY*.001)));offset.x-=p.x*(zoom-old);offset.y-=p.y*(zoom-old);},{passive:false});
  canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){if(navigationTimer!==null){clearTimeout(navigationTimer);navigationTimer=null;}if(!expanded||selectedEdge)select(null);}else if(e.key==='Enter'&&selected){e.preventDefault();openNode(selected);}else if(e.key==='0'){reset();}else if((e.key==='+'||e.key==='=')&&zoom<3){zoom*=1.1;e.preventDefault();}else if(e.key==='-'&&zoom>.35){zoom/=1.1;e.preventDefault();}});
  pauseButton.textContent=paused?'继续运动':'暂停运动';pauseButton.onclick=()=>{paused=!paused;pauseButton.textContent=paused?'继续运动':'暂停运动';sync3D();};
  document.getElementById('graph-reset').onclick=()=>{reset();select(null);};
  document.getElementById('graph-search').addEventListener('input',e=>{query=e.target.value.toLowerCase();const matches=nodes.filter(n=>n.title.toLowerCase().includes(query));if(query&&matches.length===1)select(matches[0]);else select(null);if(query&&matches.length===1)fit();});
  new ResizeObserver(size).observe(canvas);
  fetch(new URL('assets/graph-data.json',base)).then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{nodes=data.nodes.map(n=>({...n,feedback:GraphInteraction.feedback(),shapeSeed:shapeSeed(n.id),surfaceAngle:shapeSeed(n.id),surfaceStretch:1+.12*Math.sin(shapeSeed(n.id)),squeeze:0,squeezeVelocity:0,contactAngle:0,localFlow:.2,r:n.group==='course'?9:n.group==='note'?6:7}));const map=new Map(nodes.map(n=>[n.id,n]));edges=data.edges.map(e=>({a:map.get(e.source),b:map.get(e.target)})).filter(e=>e.a&&e.b);for(const n of nodes){n.body=Bodies.circle(0,0,n.r+13,{frictionAir:.045,restitution:0,friction:0,collisionFilter:{group:-1},sleepThreshold:90});Composite.add(engine.world,n.body);}for(const e of edges){Composite.add(engine.world,Constraint.create({bodyA:e.a.body,bodyB:e.b.body,length:175,stiffness:.0007,damping:.13}));if(!adjacency.has(e.a.id))adjacency.set(e.a.id,new Set());if(!adjacency.has(e.b.id))adjacency.set(e.b.id,new Set());adjacency.get(e.a.id).add(e.b.id);adjacency.get(e.b.id).add(e.a.id);}const relations=document.getElementById('graph-edge-links');for(const edge of edges){const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=edge.a.title+' ↔ '+edge.b.title;button.onclick=()=>selectRelation(edge);item.append(button);relations.append(item);}const list=document.getElementById('graph-links');for(const n of nodes){const li=document.createElement('li'),a=document.createElement('a');a.textContent=n.title;a.href=new URL(n.url,base).href;li.append(a);list.append(li);}refreshActivity();size();reset();select(null);setView('3d');requestDraw();}).catch(()=>{info.textContent='图谱加载失败，请刷新页面重试。文章仍可通过左侧目录阅读。';});
  window.addEventListener('pagehide',()=>{running=false;taps.reset();if(navigationTimer!==null){clearTimeout(navigationTimer);navigationTimer=null;}if(drawFrame!==null){cancelAnimationFrame(drawFrame);drawFrame=null;}scene3D?.setVisible(false);});
  window.addEventListener('pageshow',e=>{if(e.persisted){last=null;accumulator=0;running=true;if(view==='3d')scene3D?.setVisible(true);requestDraw();}});
  document.addEventListener('visibilitychange',()=>{last=null;accumulator=0;if(document.hidden&&pan)up({pointerId:pan.pointerId,type:'pointercancel'});});
})();
