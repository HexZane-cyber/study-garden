(() => {
 'use strict';
 const canvas=document.getElementById('knowledge-chip');if(!canvas)return;
 const base=new URL('../',document.currentScript.src),ctx=canvas.getContext('2d'),shell=canvas.closest('.chip-shell'),panel=document.getElementById('chip-panel'),status=document.getElementById('chip-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,colors={note:'#f395a0',course:'#e14c68',tool:'#d2a76e',guide:'#aa8fbc'};
 let board=null,width=1,height=1,zoom=1,ox=0,oy=0,selected=null,selectedEdge=null,query='',group='',signals=!reduced,expanded=false,drag=null,frame=null,last=0,time=0,dirty=true,visible=!document.hidden;
 document.getElementById('chip-signals').checked=signals;
 const url=n=>{try{const u=new URL(n.url,base);return u.origin===base.origin&&u.pathname.startsWith(base.pathname)?u.href:null;}catch{return null;}};
 const matches=n=>(!group||n.group===group)&&(!query||n.title.toLowerCase().includes(query));
 const related=n=>!selected||n===selected||board.neighbors.get(selected.id)?.has(n.id);
 function request(urgent=true){dirty=dirty||urgent;if(frame===null&&visible)frame=requestAnimationFrame(draw);}
 function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);request();}
 function fit(){if(!board)return;zoom=Math.max(.035,Math.min(1.4,(width-42)/board.width,(height-42)/board.height));ox=(width-board.width*zoom)/2;oy=(height-board.height*zoom)/2;request();}
 function changeZoom(value,x=width/2,y=height/2){const next=Math.max(.035,Math.min(3.5,value)),factor=next/zoom;ox=x-(x-ox)*factor;oy=y-(y-oy)*factor;zoom=next;request();}
 function locate(n){zoom=Math.max(.9,Math.min(1.5,zoom));ox=width/2-(n.x+n.w/2)*zoom;oy=height/2-(n.y+n.h/2)*zoom;request();}
 function link(n,label){const a=document.createElement('a');a.textContent=label||n.title+' ↗';const href=url(n);if(href)a.href=href;return a;}
 function select(n,edge=null){selected=n;selectedEdge=edge;panel.replaceChildren();if(!n&&!edge){const text=document.createElement('span');text.textContent='单击模块查看文章，单击走线查看两端关系。';panel.append(text);request();return;}
  const title=document.createElement('strong');title.textContent=edge?'已选中连接':n.title;panel.append(title);
  if(edge){panel.append(link(edge.a),link(edge.b));const text=document.createElement('span');text.textContent='这条走线来自文章之间的链接。';panel.append(text);}else{panel.append(link(n,'打开笔记 / 文章 ↗'));const connected=board.edges.filter(e=>e.a===n||e.b===n),text=document.createElement('span');text.textContent=connected.length+' 条直接连接';panel.append(text);for(const e of connected.slice(0,6)){const b=document.createElement('button');b.type='button';b.textContent=(e.a===n?e.b:e.a).title;b.onclick=()=>select(null,e);panel.append(b);}}
  const close=document.createElement('button');close.type='button';close.textContent='取消选择';close.onclick=()=>select(null);panel.append(close);request();
 }
 function route(points){ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);}
 function rect(x,y,w,h,cut=6){ctx.beginPath();ctx.moveTo(x+cut,y);ctx.lineTo(x+w-cut,y);ctx.lineTo(x+w,y+cut);ctx.lineTo(x+w,y+h-cut);ctx.lineTo(x+w-cut,y+h);ctx.lineTo(x+cut,y+h);ctx.lineTo(x,y+h-cut);ctx.lineTo(x,y+cut);ctx.closePath();}
 function label(text,x,y,maxWidth,fontSize=11){ctx.font=fontSize+'px system-ui,"Microsoft YaHei",sans-serif';let value=text;while(value.length>1&&ctx.measureText(value).width>maxWidth)value=value.slice(0,-1);ctx.fillText(value===text?value:value.slice(0,-1)+'…',x,y);}
 function draw(now){frame=null;if(!dirty&&last&&now-last<1000/30){request(false);return;}dirty=false;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(signals&&!reduced)time+=dt;
  ctx.clearRect(0,0,width,height);ctx.fillStyle='#100e14';ctx.fillRect(0,0,width,height);if(!board)return;
  ctx.save();ctx.translate(ox,oy);ctx.scale(zoom,zoom);ctx.textBaseline='middle';ctx.textAlign='left';
  const s=1/zoom,minX=-ox/zoom-10,maxX=(width-ox)/zoom+10,minY=-oy/zoom-10,maxY=(height-oy)/zoom+10;rect(-12,-12,board.width+24,board.height+24,22);ctx.fillStyle='#161019';ctx.fill();ctx.strokeStyle='#7a3146';ctx.lineWidth=1.2*s;ctx.stroke();
  // Fine package pins and routing corridors stay still while the user reads.
  ctx.strokeStyle='#6b3b4a';ctx.lineWidth=2*s;for(let x=28;x<board.width-20;x+=24){ctx.beginPath();ctx.moveTo(x,-12);ctx.lineTo(x,-22);ctx.moveTo(x,board.height+12);ctx.lineTo(x,board.height+22);ctx.stroke();}for(let y=28;y<board.height-20;y+=24){ctx.beginPath();ctx.moveTo(-12,y);ctx.lineTo(-22,y);ctx.moveTo(board.width+12,y);ctx.lineTo(board.width+22,y);ctx.stroke();}
  ctx.fillStyle='#d99aa9';label('ZHIXIN   /   KNOWLEDGE DIE',22,22,board.width-40,12*s);
  for(const bank of board.banks){rect(bank.x-8,bank.y-8,bank.w+16,bank.h+16,10);ctx.fillStyle='#1c131e';ctx.fill();ctx.strokeStyle='#48303f';ctx.lineWidth=s*.7;ctx.stroke();ctx.fillStyle=colors[bank.group];label(bank.title+'  ·  '+bank.nodes.length,bank.x+12,bank.y+18,bank.w-20,12*s);}
  const nets=selectedEdge?[selectedEdge]:selected?board.edges.filter(e=>e.a===selected||e.b===selected):[];
  for(const e of board.edges){if(e.bounds.right<minX||e.bounds.left>maxX||e.bounds.bottom<minY||e.bounds.top>maxY)continue;const active=nets.includes(e),dim=!matches(e.a)&&!matches(e.b);route(e.points);ctx.strokeStyle=active?'#ffb1bf':dim?'#392a36':'#743847';ctx.globalAlpha=active ? 1 : (selected||selectedEdge) ? .24 : .55;ctx.lineWidth=(active?2: .7)*s;ctx.lineJoin='round';ctx.stroke();}
  ctx.globalAlpha=1;
  for(const n of board.nodes){if(n.x+n.w<minX||n.x>maxX||n.y+n.h<minY||n.y>maxY)continue;const match=matches(n),active=n===selected||selectedEdge&&(selectedEdge.a===n||selectedEdge.b===n);ctx.globalAlpha=match&&related(n)?1:.22;
   rect(n.x,n.y,n.w,n.h,5);ctx.fillStyle=active?'#4c2032':'#251822';ctx.fill();ctx.strokeStyle=active?'#ffe0e7':colors[n.group];ctx.lineWidth=(active?1.7:.8)*s;ctx.stroke();
   ctx.fillStyle=colors[n.group];ctx.fillRect(n.x+7,n.y+8,3,n.h-16);ctx.strokeStyle='#b06579';ctx.lineWidth=s;for(let pin=0;pin<4;pin++){const px=n.x+20+pin*23;ctx.beginPath();ctx.moveTo(px,n.y-4);ctx.lineTo(px,n.y);ctx.moveTo(px,n.y+n.h);ctx.lineTo(px,n.y+n.h+5);ctx.stroke();}
   if(zoom>.22){ctx.fillStyle='#f2dfe6';label(n.title,n.x+16,n.y+18,n.w-24,Math.min(18,11*s));ctx.fillStyle='#ab8796';label(n.group.toUpperCase()+' / '+String(n.address).padStart(3,'0'),n.x+16,n.y+35,n.w-24,Math.min(14,8*s));}
  }
  ctx.globalAlpha=1;if(signals&&!reduced)for(const [i,e]of nets.slice(0,12).entries()){const p=KnowledgeChip.pointOn(e,(time*.22+i*.173)%1);ctx.fillStyle='#ffe1e8';ctx.fillRect(p.x-2.2*s,p.y-2.2*s,4.4*s,4.4*s);}
  ctx.restore();document.getElementById('chip-zoom').textContent=Math.round(zoom*100)+'%';if(signals&&!reduced&&nets.length&&visible)request(false);
 }
 function pick(event){if(!board)return {};const r=canvas.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top,wx=(x-ox)/zoom,wy=(y-oy)/zoom,node=board.nodes.find(n=>matches(n)&&wx>=n.x-4/zoom&&wx<=n.x+n.w+4/zoom&&wy>=n.y-4/zoom&&wy<=n.y+n.h+4/zoom);if(node)return {node};const paths=board.edges.filter(e=>matches(e.a)||matches(e.b)).map(e=>({id:e.id,points:e.points.map(p=>({x:p.x*zoom+ox,y:p.y*zoom+oy}))})),id=GraphInteraction.hitEdge(paths,x,y,event.pointerType==='touch'?14:8);return {edge:id===null?null:board.edges[id]};}
 const taps=GraphInteraction.createTapTracker();
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0||drag)return;canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox,oy,moved:false,pick:pick(e)};});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;if(e.pointerId!==drag.id)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4)drag.moved=true;if(drag.moved){ox=drag.ox+e.clientX-drag.x;oy=drag.oy+e.clientY-drag.y;request();}});
 const release=e=>{if(!drag||e.pointerId!==drag.id)return;const old=drag;drag=null;const moved=old.moved||Math.hypot(e.clientX-old.x,e.clientY-old.y)>4,result=taps.finish({id:old.pick.node?.id,x:old.x,y:old.y,moved,cancelled:e.type!=='pointerup'});if(result==='none')return;if(old.pick.node){select(old.pick.node);if(result==='open'){const href=url(old.pick.node);if(href)window.location.assign(href);}}else select(null,old.pick.edge);};
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,release);
 canvas.addEventListener('wheel',e=>{e.preventDefault();const r=canvas.getBoundingClientRect();changeZoom(zoom*Math.exp(-e.deltaY*.001),e.clientX-r.left,e.clientY-r.top);},{passive:false});
 canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);return;}if(e.key==='Enter'&&selected){const href=url(selected);if(href)window.location.assign(href);e.preventDefault();}else if(e.key==='+'||e.key==='='){changeZoom(zoom*1.2);e.preventDefault();}else if(e.key==='-'){changeZoom(zoom/1.2);e.preventDefault();}else if(e.key==='0')fit();else if(e.key.startsWith('Arrow')){ox+=e.key==='ArrowLeft'?40:e.key==='ArrowRight'?-40:0;oy+=e.key==='ArrowUp'?40:e.key==='ArrowDown'?-40:0;e.preventDefault();request();}});
 document.getElementById('chip-fit').onclick=fit;document.getElementById('chip-in').onclick=()=>changeZoom(zoom*1.2);document.getElementById('chip-out').onclick=()=>changeZoom(zoom/1.2);
 function filter(){query=document.getElementById('chip-search').value.trim().toLowerCase();group=document.getElementById('chip-group').value;select(null);if(board){const found=board.nodes.filter(matches);status.textContent=found.length+' 个匹配模块';status.hidden=!query&&!group;if(found.length===1){select(found[0]);locate(found[0]);}}request();}
 document.getElementById('chip-search').addEventListener('input',filter);document.getElementById('chip-group').onchange=filter;
 document.getElementById('chip-signals').onchange=e=>{signals=e.target.checked;last=0;request();};
 document.getElementById('chip-expand').onclick=()=>{expanded=!expanded;shell.classList.toggle('chip-expanded',expanded);document.getElementById('chip-expand').textContent=expanded?'退出大画布':'大画布';document.getElementById('chip-expand').setAttribute('aria-pressed',String(expanded));resize();fit();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&expanded)document.getElementById('chip-expand').onclick();});
 const visibility=()=>{visible=!document.hidden;last=0;drag=null;taps.reset();if(!visible&&frame!==null){cancelAnimationFrame(frame);frame=null;}if(visible)request();};document.addEventListener('visibilitychange',visibility);
 window.addEventListener('pagehide',()=>{visible=false;if(frame!==null)cancelAnimationFrame(frame);frame=null;});window.addEventListener('pageshow',()=>{visible=!document.hidden;last=0;request();});
 new ResizeObserver(resize).observe(canvas);document.getElementById('chip-publish').href=new URL('publish/',base).href;
 fetch(new URL('assets/graph-data.json',base)).then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{board=KnowledgeChip.layout(data);document.getElementById('chip-summary').textContent=board.notes+' 个笔记模块 · '+board.nodes.length+' 个总模块 · '+board.edges.length+' 条走线';document.getElementById('chip-size').textContent='芯片面积 '+Math.round(board.width)+' × '+Math.round(board.height)+' · 当前阵列容量 '+board.capacity+' 格';
  const articles=document.getElementById('chip-articles'),nets=document.getElementById('chip-nets');for(const n of board.nodes){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=n.title;button.onclick=()=>{select(n);locate(n);};li.append(button,link(n,'阅读全文 ↗'));articles.append(li);}for(const e of board.edges){const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=e.a.title+' ↔ '+e.b.title;b.onclick=()=>{select(null,e);fit();};li.append(b);nets.append(li);}status.hidden=true;resize();fit();filter();
 }).catch(()=>{status.hidden=false;status.textContent='芯片数据暂时未加载成功，请刷新重试。仍可通过左侧目录阅读文章。';});
})();
