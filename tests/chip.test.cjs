const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Chip=require('../docs/assets/chip-model.js'),Interaction=require('../docs/assets/graph-interaction.js');
const graph=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/assets/graph-data.json'),'utf8')),original=JSON.stringify(graph),board=Chip.layout(graph);
assert.equal(JSON.stringify(graph),original);assert.equal(board.nodes.length,graph.nodes.length);assert.equal(board.edges.length,graph.edges.length);assert.equal(board.notes,graph.nodes.filter(n=>n.group==='note').length);
for(const bank of board.banks)for(const n of bank.nodes){assert(n.x>=bank.x&&n.y>=bank.y&&n.x+n.w<=bank.x+bank.w&&n.y+n.h<=bank.y+bank.h);for(const other of bank.nodes)if(n!==other)assert(!(n.x<other.x+other.w&&n.x+n.w>other.x&&n.y<other.y+other.h&&n.y+n.h>other.y));}
for(const edge of board.edges){for(let i=1;i<edge.points.length;i++){const a=edge.points[i-1],b=edge.points[i];assert(a.x===b.x||a.y===b.y,'routing must use orthogonal circuit tracks');}assert.deepEqual(Chip.pointOn(edge,0),edge.points[0]);assert.deepEqual(Chip.pointOn(edge,1),edge.points.at(-1));for(const p of edge.points)assert(p.x>=0&&p.x<=board.width&&p.y>=0&&p.y<=board.height);}
let last=0;for(let count=0;count<=120;count++){const b=Chip.layout({nodes:Array.from({length:count},(_,i)=>({id:`notes/${i}`,title:String(i),group:'note',url:`notes/${i}/`})),edges:[]});assert.equal(b.notes,count);assert(b.capacity>=count);assert(b.width*b.height>=last,'adding notes must never shrink the package');last=b.width*b.height;}
assert(last>board.width*board.height);const dedup=Chip.layout({nodes:graph.nodes,edges:[...graph.edges,...graph.edges,{source:graph.nodes[0].id,target:graph.nodes[0].id},{source:'missing',target:'bad'}]});assert.equal(dedup.edges.length,board.edges.length);

// Run the real canvas controller with a small DOM/canvas facade.
async function ui(failure=false){
 const elements=new Map(),frames=new Map(),docEvents={},winEvents={},navigations=[];let serial=0;
 const context2d=new Proxy({measureText:text=>({width:String(text).length*6})},{get:(o,k)=>o[k]||(()=>{})});
 const el=id=>{if(!elements.has(id))elements.set(id,{id,children:[],events:{},value:'',textContent:'',hidden:false,style:{},classList:{toggle(){}},append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},setAttribute(k,v){this[k]=v;},closest(){return el('shell');},getContext:()=>context2d,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),setPointerCapture(){},addEventListener(name,fn){this.events[name]=fn;}});return elements.get(id);};
 const document={hidden:false,currentScript:{src:'https://example.test/study-garden/assets/chip.js'},getElementById:el,createElement:tag=>{const e=el('created-'+(++serial));e.tag=tag;return e;},addEventListener(name,fn){docEvents[name]=fn;}};
 const context=vm.createContext({console,URL,KnowledgeChip:Chip,GraphInteraction:Interaction,Math,devicePixelRatio:1,document,window:{location:{assign:url=>navigations.push(url)},addEventListener(name,fn){winEvents[name]=fn;}},matchMedia:()=>({matches:false}),ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame:fn=>{const id=++serial;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),fetch:async()=>({ok:!failure,json:async()=>graph})});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../docs/assets/chip.js'),'utf8'),context);await new Promise(resolve=>setImmediate(resolve));
 const paint=now=>{const callbacks=[...frames.values()];frames.clear();for(const fn of callbacks)fn(now);};paint(100);
 return {el,document,frames,docEvents,winEvents,navigations,paint};
}
(async()=>{
 const s=await ui();assert.equal(s.el('chip-articles').children.length,board.nodes.length);assert.equal(s.el('chip-nets').children.length,board.edges.length);assert.equal(s.frames.size,0,'unselected chip must not run a continuous animation loop');
 s.el('chip-articles').children[0].children[0].onclick();s.paint(120);assert(s.el('chip-panel').children.some(e=>e.tag==='a'&&e.href));
 s.el('chip-signals').onchange({target:{checked:false}});s.paint(160);assert.equal(s.frames.size,0,'disabling signals stops animation');
 s.el('chip-fit').onclick();s.el('knowledge-chip').events.keydown({key:'Escape'});s.paint(180);
 const zoom=Math.min(1.4,(900-42)/board.width,(600-42)/board.height),ox=(900-board.width*zoom)/2,oy=(600-board.height*zoom)/2;
 const edge=board.edges.find(e=>e.points.some((p,i)=>i&&Math.abs(p.y-e.points[i-1].y)>40)),segment=edge.points.findIndex((p,i)=>i&&Math.abs(p.y-edge.points[i-1].y)>40),a=edge.points[segment-1],b=edge.points[segment],x=ox+(a.x+b.x)/2*zoom,y=oy+(a.y+b.y)/2*zoom;
 const canvas=s.el('knowledge-chip'),pointer=(type,px=x,py=y)=>canvas.events[type]({type,button:0,pointerId:1,clientX:px,clientY:py});pointer('pointerdown');pointer('pointerup');assert.equal(s.el('chip-panel').children.filter(e=>e.tag==='a').length,2,'clicking a circuit track exposes both articles');
 canvas.events.keydown({key:'Escape'});pointer('pointerdown');pointer('pointermove',x+40,y+20);pointer('pointerup',x+40,y+20);assert.equal(s.el('chip-panel').children.filter(e=>e.tag==='a').length,0,'dragging from a track pans without selecting');
 const before=s.navigations.length;s.el('chip-articles').children[0].children[0].onclick();canvas.events.keydown({key:'Enter',preventDefault(){}});assert.equal(s.navigations.length,before+1);assert(s.navigations[0].startsWith('https://example.test/study-garden/'));
 s.document.hidden=true;s.docEvents.visibilitychange();assert.equal(s.frames.size,0);s.document.hidden=false;s.docEvents.visibilitychange();assert.equal(s.frames.size,1);
 const bad=await ui(true);assert.equal(bad.el('chip-status').hidden,false);assert(bad.el('chip-status').textContent.length>10);
 console.log('Knowledge chip passed: monotonic note growth, nonoverlapping modules, orthogonal routes, graph integrity, canvas edge selection, article links, drag safety, static idle, signals toggle, visibility and load failure.');
})().catch(error=>{console.error(error);process.exitCode=1;});
