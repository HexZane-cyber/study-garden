const assert=require('node:assert/strict');
const V=require('../frontend/graph-visuals.cjs'),A=require('../docs/assets/graph-appearance.js');
for(let i=0;i<40;i++){const theta=i*.31,phi=.1+(i%20)*.145,x=Math.cos(theta)*Math.sin(phi),y=Math.cos(phi),z=Math.sin(theta)*Math.sin(phi),seed=.7,phase=1.2;
 const expected=1+.16*Math.sin(theta+seed)*Math.sin(phi)+.09*Math.cos(3*theta+phase)*Math.sin(phi)**2+.065*Math.sin(2*phi+seed);
 assert(Math.abs(V.radial(x,y,z,seed,phase)-expected)<1e-7,'optimized distance field must preserve the original drop shape');}
const a={x:0,y:0,z:0},b={x:3,y:2,z:1};
assert.deepEqual(V.curvePoint(a,b,0),a);assert.deepEqual(V.curvePoint(a,b,1),b);
const mid=V.curvePoint(a,b,.5,2,1,.3);assert(Math.hypot(mid.x-1.5,mid.y-1,mid.z-.5)>.1);
const stronger=V.curvePoint(a,b,.5,2,1,.6);assert(Math.hypot(stronger.x-1.5,stronger.y-1,stronger.z-.5)>Math.hypot(mid.x-1.5,mid.y-1,mid.z-.5)*1.5);
const straight=V.curvePoint(a,b,.5,2,1,0);assert.deepEqual(straight,{x:1.5,y:1,z:.5});
const next=V.curvePoint(a,b,.5,2,1.01,.3);assert(Math.hypot(mid.x-next.x,mid.y-next.y,mid.z-next.z)<.01);
assert(Object.values(V.curvePoint(a,a,.5)).every(Number.isFinite));
const res=48,field=new Float32Array(res**3),palette=new Float32Array(res**3*3),center={x:0,y:0,z:0};
const drop=(x,color)=>({x,y:0,z:0,sx:.5,sy:.5,sz:.5,round:true,color});
const index=(res/2*res+res/2)*res+res/2;
V.fillUnion(field,palette,res,center,2,[drop(-.5,[1,0,0]),drop(.5,[0,0,1])],.2);
assert(field[index]>0,'contact must create one continuous neck');
assert(Math.abs(palette[index*3]-.5)<.01&&Math.abs(palette[index*3+2]-.5)<.01,'surface colors blend continuously at contact');
V.fillUnion(field,palette,res,center,2,[drop(-.8,[1,0,0]),drop(.8,[0,0,1])],.2);
assert(field[index]<0,'separated drops must not have a fabricated tube');assert(field.every(Number.isFinite));
const storage=new Map(),fake={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
let config=A.defaults();config=A.apply(config,'course','#123abc');assert.equal(A.colorFor(config,{id:'a',group:'course'}),'#123abc');
config=A.apply(config,'node','#00ff88','a');assert.equal(A.colorFor(config,{id:'a',group:'course'}),'#00ff88');assert.equal(A.colorFor(config,{id:'b',group:'course'}),'#123abc');
config=A.apply(config,'line','#abcdef');assert.equal(config.line,'#abcdef');assert(A.save(fake,config));assert.deepEqual(A.load(fake),config);
assert.throws(()=>A.apply(config,'node','#ffffff',null));assert.throws(()=>A.apply(config,'line','url(javascript:bad)'));
storage.set(A.KEY,'broken');assert.deepEqual(A.load(fake),A.defaults());
console.log('Graph visuals passed: curved paths and endpoints, smooth surface union/separation, contact color blending, palette scope, validation and persistence.');

// Execute the actual rendering deformation path to catch runtime-only regressions.
{
 const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../frontend/graph3d.js'),'utf8');
 const body=source.split('function deform(shape){')[1].split('  function fusion(')[0].trim().replace(/}$/, '');
 const deform=new Function('shape','Visuals','model','state',body);
 const base=new Float32Array([1,0,0,0,1,0,0,0,1]);const output=[];
 const shape={n:{seed:1,localFlow:1},base,radii:new Float32Array(3),weights:new Float32Array([1,.01,1]),geometry:{attributes:{position:{setXYZ(i,x,y,z){output.push(x,y,z);}}},computeVertexNormals(){},computeBoundingSphere(){}}};
 deform(shape,require('../frontend/graph-visuals.cjs'),{time:1},{flow:.55});
 assert.equal(output.length,9);assert(output.every(Number.isFinite));assert(shape.norm>0);
}

// Near-contact motion must not alternate between individual and merged surfaces.
{
 const {contactGroups}=require('../frontend/graph-visuals.cjs');
 const a={id:'front',x:0,y:0,z:0,radius:.4},b={id:'back',x:0,y:0,z:1.3,radius:.4};
 let state=contactGroups([a,b]);assert.equal(state.groups.length,2,'visibly separated drops must not enter a fusion group');
 b.z=.79;state=contactGroups([a,b],state.contacts);assert.equal(state.groups.length,1);
 for(let i=0;i<120;i++){b.z=.82+Math.sin(i)*.015;state=contactGroups([a,b],state.contacts);assert.equal(state.groups.length,1);}
 b.z=.9;state=contactGroups([a,b],state.contacts);assert.equal(state.groups.length,2);
 b.z=.82;state=contactGroups([a,b],state.contacts);assert.equal(state.groups.length,2);
 b.z=.79;state=contactGroups([a,b],state.contacts);assert.equal(state.groups.length,1);
 b.z=3;assert.equal(contactGroups([a,b],state.contacts).groups.length,2,'screen overlap alone must not merge depth-separated nodes');
 assert.equal(contactGroups([a],state.contacts).contacts.size,0,'filtered nodes cannot retain stale contacts');
}

for(const squeeze of [0,.01,.08,.2,.28])for(const speed of [0,1,6]){const scale=V.contactScale(.44,speed,squeeze,1);assert(Math.abs(scale.x*scale.y*scale.z-.44**3)<1e-10,'contact squash must preserve volume');if(squeeze>.05){assert(scale.y<.44);assert(scale.x>.44);}}
assert(Math.abs(V.supportRadius({sx:.3,sy:.7,sz:.4,round:true},0,1,0)-.7)<1e-10);assert(Math.abs(V.supportRadius({sx:.3,sy:.7,sz:.4,round:true},1,0,0)-.3)<1e-10);

// Prepared curves retain exact endpoints and shape while reusing output storage.
for(let i=0;i<80;i++){
 const t=i/79,curve=V.prepareCurve(a,b,3,.4,.28),out={};
 assert.equal(V.sampleCurve(curve,t,out),out);assert.deepEqual(out,V.curvePoint(a,b,t,3,.4,.28));
 const shortened=V.prepareCurve(a,b,3,.4,.14);
 if(t>.1&&t<.9){const p=V.sampleCurve(shortened,t),line=V.curvePoint(a,b,t,3,.4,0);assert(Math.hypot(p.x-line.x,p.y-line.y,p.z-line.z)<Math.hypot(out.x-line.x,out.y-line.y,out.z-line.z));}
}
const round=x=>({x,y:0,z:0,sx:.4,sy:.4,sz:.4,round:true});
const thin=V.neckTarget([round(0),round(.8)]),thick=V.neckTarget([round(0),round(.7)]);
assert(thin<thick&&thin<.01&&thick<=.062);assert.equal(V.neckTarget([round(0),round(1)]),.004);
let neck=.004;for(let i=0;i<30;i++){const next=V.relaxNeck(neck,thick,1/60);assert(next>=neck&&next<=thick);neck=next;}
const atRelease=neck;for(let i=0;i<12;i++)neck=V.relaxNeck(neck,.004,1/60);assert(neck<atRelease*.12,'pulling apart must quickly thin the neck');
assert(!V.canRebuildSurface(0,16,0));assert(V.canRebuildSurface(0,34,0));assert(!V.canRebuildSurface(0,34,1));

// Execute the renderer's real scheduling path with two simultaneous contacts.
{
 class Vec{constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z});}clone(){return new Vec(this.x,this.y,this.z);}copy(v){Object.assign(this,{x:v.x,y:v.y,z:v.z});return this;}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}addScalar(v){this.x+=v;this.y+=v;this.z+=v;return this;}divideScalar(v){this.x/=v;this.y/=v;this.z/=v;return this;}setScalar(v){this.x=this.y=this.z=v;return this;}}
 class Box{constructor(){this.min=new Vec(Infinity,Infinity,Infinity);this.max=new Vec(-Infinity,-Infinity,-Infinity);}expandByPoint(v){for(const k of ['x','y','z']){this.min[k]=Math.min(this.min[k],v[k]);this.max[k]=Math.max(this.max[k],v[k]);}}getCenter(v){return v.copy(this.min).add(this.max).divideScalar(2);}getSize(v){return v.copy(this.max).sub(this.min);}}
 let rebuilt=0;class Cubes{constructor(res){this.field=[];this.palette=[];this.position=new Vec();this.scale=new Vec();this.geometry={dispose(){}};this.count=3;}reset(){}update(){rebuilt++;}}
 const shapes=[0,.7,4,4.7].map((x,i)=>({n:{id:String(i),x,y:0,z:0,seed:0},phase:0,norm:1,glass:{color:{r:1,g:0,b:0}},mesh:{visible:true,position:new Vec(x),scale:new Vec(.4,.4,.4),quaternion:{x:0,y:0,z:0,w:1}}}));
 const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../frontend/graph3d.js'),'utf8');
 const body=source.split('function fusion(now,dt=0){')[1].split('  function labels()')[0].trim().replace(/}$/, '');
 const run=new Function('THREE','Visuals','MarchingCubes','shapes',`const fused=new Map(),state={liquid:true,contactMode:'merge',nodeColors:{}},scene={add(){},remove(){}},fusionMaterial={},shown=()=>true;let contacts=new Set();return {fused,frame(now,dt){for(const s of shapes)s.mesh.visible=true;${body}}};`)({Vector3:Vec,Box3:Box},{...V,fillUnion(){}},Cubes,shapes);
 run.frame(0,0);assert.equal(rebuilt,1);run.frame(8,1/120);assert.equal(rebuilt,2,'second contact is serviced on the next frame');
 const first=run.fused.values().next().value,origin=first.effect.position.x;
 for(const s of shapes){s.n.x+=.03;s.mesh.position.x+=.03;}
 run.frame(16,1/120);assert.equal(rebuilt,2,'dragging cannot bypass the 30 Hz surface cap');assert(Math.abs(first.effect.position.x-origin-.03)<1e-9,'cached surface must follow translation between rebuilds');
 run.frame(34,1/60);assert.equal(rebuilt,3,'one frame cannot rebuild both contacts');run.frame(42,1/120);assert.equal(rebuilt,4);
 shapes[1].n.x=shapes[1].mesh.position.x=2;run.frame(50,1/120);assert(shapes[0].mesh.visible&&shapes[1].mesh.visible,'separation restores individual surfaces without a stale bridge');
}
console.log('Connection refinement passed: reusable curves, pressure-dependent necks, separation relaxation, rebuild frequency, fair scheduling and cached translation.');
