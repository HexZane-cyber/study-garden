const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const Matter=require('../docs/assets/vendor/matter.min.js');
const root=path.join(__dirname,'..');
const GraphAppearance=require('../docs/assets/graph-appearance.js');
const ArticleActivity=require('../docs/assets/article-activity.js');
const LiquidSurface=require('../docs/assets/liquid-surface.js');
const GraphGravity=require('../docs/assets/graph-gravity.js');
const GraphInteraction=require('../docs/assets/graph-interaction.js');
const GraphLabelLayout=require('../docs/assets/graph-label-layout.js');
const source=fs.readFileSync(path.join(root,'docs/assets/graph.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'docs/assets/graph-data.json'),'utf8'));

async function simulation(graph=data,usage={},three){
  let engine,updates=0,now=0;
  const physics={...Matter,Engine:{...Matter.Engine,create:options=>(engine=Matter.Engine.create(options)),update:(...args)=>{updates++;return Matter.Engine.update(...args);}}};
  const gradient={addColorStop(){}};let labelBoxes=[];
  const classes=()=>({toggle(){},contains(){return false;}});
  const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,measureText:text=>({width:Array.from(text).length*8}),clearRect:()=>{labelBoxes=[];},fillRect:(x,y,w,h)=>{if(h===19)labelBoxes.push({x,y,w,h});}},{get:(obj,key)=>key in obj?obj[key]:()=>{}});
  const timers=new Map(),navigations=[];let timerId=0;
  const elements=new Map(),frames=[],documentEvents={},windowEvents={};
  function element(id){if(!elements.has(id))elements.set(id,{style:{},textContent:'',value:'',classList:classes(),closest:()=>element('graph-wrap'),focus(){},attributes:{},children:[],events:{},append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},setAttribute(name,value){this.attributes[name]=value;},addEventListener(type,fn){this.events[type]=fn;},getContext:()=>ctx,getBoundingClientRect:()=>({width:800,height:510,left:0,top:0}),setPointerCapture(){}});return elements.get(id);}
  const document={body:{classList:classes(),dataset:{mdColorScheme:'slate'}},hidden:false,currentScript:{src:'https://example.com/study-garden/assets/graph.js'},getElementById:element,createElement:()=>element(`generated-${Math.random()}`),createTextNode:s=>s,addEventListener:(type,fn)=>{documentEvents[type]=fn;}};
  const context=vm.createContext({console,URL,Math,LiquidSurface,ArticleActivity,GraphAppearance,GraphGravity,GraphLabelLayout,GraphInteraction,clearTimeout:id=>timers.delete(id),cancelAnimationFrame:()=>frames.splice(0),Graph3D:three,localStorage:{getItem:()=>JSON.stringify({version:1,entries:usage})}, Matter:physics,devicePixelRatio:1,window:{setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},location:{assign:url=>navigations.push(url)},Matter:physics,Graph3D:three,addEventListener(type,fn){windowEvents[type]=fn;}},document,matchMedia:()=>({matches:false}),ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame:fn=>frames.push(fn),fetch:async()=>({ok:true,json:async()=>graph})});
  vm.runInContext(source,context);await new Promise(resolve=>setImmediate(resolve));
  const frame=delta=>{now+=delta;assert(frames.length===1,'Only one animation loop should be scheduled');frames.shift()(now);};
  frame(0);
  return {engine,element,document,documentEvents,windowEvents,frame,navigations,flushTimers(){for(const fn of timers.values())fn();timers.clear();},get card(){return element('graph-wrap').children.find(e=>e.className==='graph-node-card');},get boxes(){return labelBoxes;},get updates(){return updates;},steps:(n,delta=1000/120)=>{for(let i=0;i<n;i++)frame(delta);},flow:value=>element('graph-flow').oninput({target:{value}})};
}
const minimal=count=>({nodes:Array.from({length:count},(_,i)=>({id:`node-${i}`,title:`Node ${i}`,group:'course',url:`notes/${i}/`})),edges:[]});
const kinetic=bodies=>bodies.reduce((energy,b)=>energy+b.mass*(b.velocity.x**2+b.velocity.y**2)/2,0);

(async()=>{
  const actual=await simulation();
  assert.equal(actual.engine.world.bodies.length,data.nodes.length);
  assert.equal(actual.engine.world.constraints.length,data.edges.length);
  assert(actual.engine.world.bodies.every(b=>b.collisionFilter.group===-1&&b.restitution===0));
  actual.steps(600,1000/60);
  assert.equal(actual.updates,1200);
  assert(actual.engine.world.bodies.every(b=>Number.isFinite(b.position.x)&&Number.isFinite(b.position.y)&&Math.hypot(b.position.x,b.position.y)<2000));
  actual.element('graph-pause').onclick();const before=actual.updates;actual.steps(60,1000/60);assert.equal(actual.updates,before);
  actual.element('graph-mode').onclick({currentTarget:actual.element('graph-mode')});assert.equal(actual.element('graph-mode').textContent,'清晰模式');
  actual.element('graph-search').events.input({target:{value:'向量与矩阵'}});assert(actual.element('graph-info').children.length>1);

  // Smart labels stay inside the canvas and do not overlap one another.
  const labels=await simulation();labels.steps(120);
  assert(labels.boxes.length>0&&labels.boxes.length<=data.nodes.length);
  for(let i=0;i<labels.boxes.length;i++){
    const a=labels.boxes[i];assert(a.x>=0&&a.y>=0&&a.x+a.w<=800&&a.y+a.h<=510);
    for(const b of labels.boxes.slice(i+1))assert(!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y));
  }
  labels.element('graph-labels').onchange({target:{value:'off'}});labels.frame(1000/60);assert.equal(labels.boxes.length,0);
  labels.element('graph-labels').onchange({target:{value:'smart'}});
  labels.element('graph-search').events.input({target:{value:'向量与矩阵'}});
  assert(!labels.element('graph-focus').disabled);
  const related=labels.element('graph-info').children.find(x=>x.className==='graph-related');assert(related&&related.children.length>0);
  labels.element('graph-focus').onclick();assert.equal(labels.element('graph-focus').attributes['aria-pressed'],'true');
  labels.element('graph-fit').onclick();labels.frame(1000/60);assert(labels.boxes.length>=1);
  labels.element('graph-expand').onclick();assert.equal(labels.element('graph-expand').attributes['aria-pressed'],'true');
  labels.documentEvents.keydown({key:'Escape'});assert.equal(labels.element('graph-expand').attributes['aria-pressed'],'false');

  // Frequent local reads increase forcing without moving the user slider.
  const rare=await simulation(minimal(1)),frequent=await simulation(minimal(1),{'/study-garden/notes/0/':{count:20,last:Date.now()}});
  for(const s of [rare,frequent]){Matter.Body.setPosition(s.engine.world.bodies[0],{x:0,y:0});Matter.Body.setVelocity(s.engine.world.bodies[0],{x:0,y:0});s.steps(120);}
  const distance=s=>Math.hypot(s.engine.world.bodies[0].position.x,s.engine.world.bodies[0].position.y);
  assert(distance(frequent)>distance(rare)*2,'frequent articles should have stronger local flow');
  frequent.element('graph-activity').onchange({target:{checked:false}});
  assert.equal(frequent.element('graph-flow').value,'','activity control must not alter the global slider');

  // A failed WebGL constructor must leave a working 2D graph.
  const fallback=await simulation(minimal(2),{},{createScene(){throw Error('WebGL unavailable');}});
  assert.equal(fallback.element('graph-view').value,'2d');assert.equal(fallback.element('knowledge-graph').hidden,false);
  assert.equal(fallback.element('graph-render-status').hidden,false);fallback.steps(5);assert(fallback.updates>0);
  let sceneState={},sceneVisible=false,selected3d;
  const bridge=await simulation(minimal(2),{},{createScene(c,data,select){selected3d=select;return {setState:state=>sceneState=state,setVisible:value=>sceneVisible=value,fit(){},reset(){}};}});
  assert.equal(bridge.element('graph-view').value,'3d');assert(sceneVisible);bridge.steps(10);assert.equal(bridge.updates,0,'2D physics must stop while 3D is active');
  selected3d('node-0');assert.equal(sceneState.selected,'node-0');
  bridge.element('graph-pause').onclick();assert(sceneState.paused);
  bridge.windowEvents['graph-gravity-change']({detail:{mode:'manual',strength:.8,vector:{x:1,y:0}}});assert.equal(sceneState.gravity.vector.x,1);assert.equal(sceneState.gravity.strength,.8);
  bridge.element('graph-view').onchange({target:{value:'2d'}});assert(!sceneVisible);assert.equal(bridge.element('knowledge-graph-3d').hidden,true);

  // Identical simulated time at common refresh rates must produce the same state.
  const gravitySim=await simulation(minimal(1));gravitySim.flow(0);const falling=gravitySim.engine.world.bodies[0];Matter.Body.setPosition(falling,{x:0,y:0});Matter.Body.setVelocity(falling,{x:0,y:0});gravitySim.windowEvents['graph-gravity-change']({detail:{mode:'manual',strength:1,vector:{x:0,y:1}}});gravitySim.steps(240);assert(falling.position.y>50);gravitySim.steps(2400);assert(Math.hypot(falling.position.x,falling.position.y)<350);gravitySim.windowEvents['graph-gravity-change']({detail:{mode:'manual',strength:1,vector:{x:0,y:-1}}});gravitySim.steps(1200);assert(falling.position.y<-50);
  const states=[];
  for(const hz of [30,60,144]){const s=await simulation(minimal(3));s.steps(hz*3,1000/hz);assert.equal(s.updates,360);states.push(s.engine.world.bodies.map(b=>({...b.position})));}
  for(const state of states.slice(1))state.forEach((p,i)=>assert(Math.hypot(p.x-states[0][i].x,p.y-states[0][i].y)<1e-8));

  // A head-on approach must dissipate kinetic energy and retain distinct centers.
  const collision=await simulation(minimal(2));collision.flow(0);const [a,b]=collision.engine.world.bodies;
  Matter.Body.setPosition(a,{x:-34,y:0});Matter.Body.setPosition(b,{x:34,y:0});Matter.Body.setVelocity(a,{x:6,y:0});Matter.Body.setVelocity(b,{x:-6,y:0});
  const initialEnergy=kinetic([a,b]);let closest=Infinity,maxSpeed=0;
  for(let i=0;i<240;i++){collision.frame(1000/120);closest=Math.min(closest,Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y));maxSpeed=Math.max(maxSpeed,a.speed,b.speed);}
  assert(closest>15,`Contacts interpenetrated too far: ${closest}`);assert(maxSpeed<=6.1,`Contact added excess energy: ${maxSpeed}`);assert(kinetic([a,b])<initialEnergy*.02);
  // Exact coincident centers must separate without NaN or an arbitrary zero force.
  Matter.Body.setPosition(a,{x:0,y:0});Matter.Body.setPosition(b,{x:0,y:0});Matter.Body.setVelocity(a,{x:0,y:0});Matter.Body.setVelocity(b,{x:0,y:0});collision.steps(120);
  assert(Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)>20);

  // Drag follows a spring, keeps finite mass, and releases with damped inertia.
  const dragged=await simulation(minimal(1));dragged.flow(0);const body=dragged.engine.world.bodies[0],canvas=dragged.element('knowledge-graph'),origin={...body.position};
  const pointer=(type,x,y)=>canvas.events[type]({type,pointerId:1,clientX:400+x,clientY:255+y});
  pointer('pointerdown',origin.x,origin.y);pointer('pointermove',origin.x+100,origin.y);
  assert.equal(body.isStatic,false);assert.equal(body.position.x,origin.x,'Pointer events must not teleport dynamic bodies');
  for(let i=1;i<=30;i++){pointer('pointermove',origin.x+i*4,origin.y);dragged.frame(1000/120);}
  assert(body.position.x>origin.x+60);const releaseVelocity=body.velocity.x;assert(releaseVelocity>1&&releaseVelocity<=18);
  pointer('pointerup',origin.x+120,origin.y);assert.equal(body.velocity.x,releaseVelocity,'Release must preserve inertia');
  const releasedAt=body.position.x;dragged.steps(6);assert(body.position.x>releasedAt);dragged.steps(240);assert(Math.abs(body.velocity.x)<releaseVelocity*.1);
  const beforeGap=dragged.updates;dragged.frame(5000);assert(dragged.updates-beforeGap<=6,'Long stalls must not trigger unbounded catch-up');
  dragged.document.hidden=true;const beforeHidden=dragged.updates;dragged.frame(1000);assert.equal(dragged.updates,beforeHidden);

  // Actual canvas pointer events: native article card, direct double tap, no drag/cancel navigation.
  const clicks=await simulation(minimal(1));clicks.flow(0);clicks.element('graph-pause').onclick();
  const c=clicks.element('knowledge-graph'),center=clicks.engine.world.bodies[0].position;
  const tap=(type,dx=0,dy=0,id=7)=>c.events[type]({type,pointerId:id,clientX:400+center.x+dx,clientY:255+center.y+dy,preventDefault(){}});
  tap('pointerdown');tap('pointerup');clicks.frame(16);
  assert.equal(clicks.card.hidden,false);assert.equal(clicks.card.children[1].href,'https://example.com/study-garden/notes/0/');
  clicks.flushTimers();assert.equal(clicks.navigations.length,0,'single tap selects without an unexpected page change');
  tap('pointerdown');tap('pointerup');clicks.flushTimers();assert.deepEqual(clicks.navigations,['https://example.com/study-garden/notes/0/']);
  for(const end of ['pointercancel','lostpointercapture']){tap('pointerdown');tap(end);tap('pointerup');clicks.flushTimers();assert.equal(clicks.navigations.length,1);}
  tap('pointerdown');tap('pointerup',35,0);clicks.flushTimers();assert.equal(clicks.navigations.length,1,'release displacement without a move event still counts as a drag');
  c.events.keydown({key:'Enter',preventDefault(){}});clicks.flushTimers();assert.equal(clicks.navigations.length,2);
  c.events.keydown({key:'Enter',preventDefault(){}});clicks.windowEvents.pagehide();clicks.flushTimers();assert.equal(clicks.navigations.length,2,'leaving the page cancels deferred navigation');

  console.log(`Fluid graph passed: ${data.nodes.length} bodies, 120 Hz physics, refresh-rate invariance, dissipative contacts (minimum separation ${closest.toFixed(1)} px), coincidence recovery, spring drag, release inertia, bounded catch-up, pause and selection.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
