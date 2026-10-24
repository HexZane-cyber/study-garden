const assert=require('node:assert/strict'),Circuit=require('../docs/assets/graph-circuit.js'),Interaction=require('../docs/assets/graph-interaction.js');
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
for(const dimensions of [2,3]){
 const a={x:-3,y:-2,z:dimensions===2?0:1,r:.4},b={x:4,y:3,z:dimensions===2?0:-2,r:.7},route=Circuit.create(),points=route.points;
 Circuit.update(route,a,b,0,{dimensions,corner:.1});assert(route.count>=6&&route.count<=14);assert(route.length>0);
 near(distance(route.points[0],a),a.r);near(distance(route.points[route.count-1],b),b.r);assert.deepEqual(Circuit.sample(route,0),route.points[0]);assert.deepEqual(Circuit.sample(route,1),route.points[route.count-1]);
 // Between radial pins, un-beveled runs follow only one world axis at a time.
 for(let i=2;i<(dimensions===3?6:5);i++){const prev=route.raw[i-1],next=route.raw[i];assert(['x','y','z'].filter(k=>Math.abs(prev[k]-next[k])>1e-9).length<=1);}
 const axis=route.axis,previous=Circuit.sample(route,.5);b.x+=.0001;Circuit.update(route,a,b,0,{dimensions,corner:.1});assert.equal(route.axis,axis);assert.equal(route.points,points);assert(distance(previous,Circuit.sample(route,.5))<.001);
 const copy=JSON.stringify(route.points.slice(0,route.count));Circuit.update(route,a,b,0,{dimensions,corner:.1});assert.equal(JSON.stringify(route.points.slice(0,route.count)),copy,'stationary endpoints never wobble with time');
 for(let frame=0;frame<2000;frame++){b.x=4*Math.cos(frame*.01);b.y=4*Math.sin(frame*.01);Circuit.update(route,a,b,0,{dimensions,corner:.08});assert.equal(route.axis,axis);assert(route.count<=14);for(const p of route.points.slice(0,route.count))assert(Number.isFinite(p.x+p.y+p.z));}
}
const a={x:0,y:0,z:0,r:1},b={x:1,y:0,z:0,r:1},route=Circuit.create();Circuit.update(route,a,b);assert.equal(route.count,0,'overlapping balls have no line through their interiors');b.x=2.001;Circuit.update(route,a,b);assert(route.count>0);for(const p of route.points.slice(0,route.count))assert(p.x>=1-1e-9&&p.x<=1.001+1e-9,'pins must not reverse into nearly touching balls');
const flat=Circuit.update(Circuit.create(),{x:20,y:40,r:8},{x:200,y:160,r:12},0,{dimensions:2,corner:8});
const flatPaths=[{id:7,points:flat.points.slice(0,flat.count)}],middle=Circuit.sample(flat,.5);assert.equal(Interaction.hitEdge(flatPaths,middle.x,middle.y,3),7,'the exact drawn polyline remains clickable');
const out={};assert.equal(Circuit.sample(flat,.7,out),out);assert.equal(Circuit.update(route,a,{...a,x:NaN}),route);assert.equal(route.count,0);
console.log('Circuit routing passed: surface terminals, short pins, axis-aligned runs, beveled corners, stable topology, 2D/3D motion, overlap recovery and exact polyline hit testing.');
