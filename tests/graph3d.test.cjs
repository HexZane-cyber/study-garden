const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createModel}=require('../frontend/graph3d-physics.cjs');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/assets/graph-data.json'),'utf8'));
const full=createModel(data);
assert.equal(full.nodes.length,data.nodes.length);assert.equal(full.edges.length,data.edges.length);
assert(new Set(full.nodes.map(n=>n.z.toFixed(2))).size>5,'initial graph must occupy depth, not a flat plane');
for(let i=0;i<1800;i++)full.step(1/120,.55);
for(const n of full.nodes){assert(Number.isFinite(n.x+n.y+n.z+n.vx+n.vy+n.vz));assert(Math.hypot(n.x,n.y,n.z)<20);}
const pair=createModel({nodes:[{id:'a',group:'course'},{id:'b',group:'course'}],edges:[]});
for(const [i,n]of pair.nodes.entries()){n.x=i?.8:-.8;n.y=n.z=0;n.vx=i?-3:3;}
let closest=Infinity;for(let i=0;i<600;i++){pair.step(1/120,0);closest=Math.min(closest,Math.hypot(...['x','y','z'].map(a=>pair.nodes[0][a]-pair.nodes[1][a])));}
assert(closest>.5);assert(pair.nodes.every(n=>Math.hypot(n.vx,n.vy,n.vz)<.2),'contact should dissipate energy');
for(const n of pair.nodes){n.x=n.y=n.z=n.vx=n.vy=n.vz=0;}for(let i=0;i<240;i++)pair.step(1/120,0);
assert(Math.hypot(...['x','y','z'].map(a=>pair.nodes[0][a]-pair.nodes[1][a]))>.6,'coincident nodes must separate');
const single=createModel({nodes:[{id:'drag',group:'note'}],edges:[]}),n=single.nodes[0];n.x=n.y=n.z=0;
single.setDrag({id:n.id,x:2,y:1,z:-2});assert.equal(n.x,0,'setting the drag target must not teleport a node');
for(let i=0;i<50;i++)single.step(1/120,0);assert(n.x>.8&&n.z<-.8);
const velocity=Math.hypot(n.vx,n.vy,n.vz);assert(velocity>.1);single.setDrag(null);assert.equal(Math.hypot(n.vx,n.vy,n.vz),velocity,'release preserves inertia');
const frequent=createModel({nodes:[{id:'flow',flowFactor:1}],edges:[]}),rare=createModel({nodes:[{id:'flow',flowFactor:.2}],edges:[]});
for(const m of [frequent,rare]){Object.assign(m.nodes[0],{x:0,y:0,z:0});for(let i=0;i<120;i++)m.step(1/120,1);}
assert(Math.hypot(frequent.nodes[0].x,frequent.nodes[0].y,frequent.nodes[0].z)>Math.hypot(rare.nodes[0].x,rare.nodes[0].y,rare.nodes[0].z)*2);
single.reset();assert.equal(single.drag,null);assert(single.nodes.every(n=>n.vx===0&&n.vy===0&&n.vz===0));
console.log('3D physics passed: genuine depth, stable linked layout, soft contact, coincidence recovery, spring drag/release, adaptive flow and reset.');
