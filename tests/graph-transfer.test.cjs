const assert=require('node:assert/strict'),T=require('../docs/assets/graph-transfer.js');
const pair=(distance=3)=>[{id:'sender',x:0,y:0,z:0,r:1,flowFactor:1},{id:'receiver',x:distance,y:0,z:0,r:1,flowFactor:.2}];
let e=T.createEmitter(),nodes=pair();e.step(nodes,1/60);assert.equal(e.particles.length,1);assert.equal(e.particles[0].source,'sender');assert.equal(e.particles[0].target,'receiver');
e.step(nodes,.05);assert(e.particles[0].size>0);const first={...e.particles[0]};assert(first.x>0&&first.x<3);assert(first.stretch>1);
const reference=T.createEmitter();reference.step(pair(),1/60);reference.step(pair(),.05);reference.step(pair(),.05);
nodes[1].y=.4;e.step(nodes,.05);assert(e.particles[0].y>reference.particles[0].y,'packet homes towards the current receiver position');
const frozen=JSON.stringify(e.particles);e.step(nodes,3,{paused:true});assert.equal(JSON.stringify(e.particles),frozen,'pause freezes progress and emission');
const pausedFilter=T.createEmitter();pausedFilter.step(pair(),.02);pausedFilter.step(pair(),.05);assert(pausedFilter.particles.length);pausedFilter.step(pair().slice(0,1),.05,{paused:true});assert.equal(pausedFilter.particles.length,0,'paused focus changes cannot leave packets from hidden nodes');
for(let i=0;i<30;i++)e.step(nodes,1/30);assert.equal(e.particles.length,0,'packet is absorbed and cooldown prevents immediate repeated spitting');
for(let i=0;i<80;i++)e.step(nodes,1/30);assert(e.particles.length<=1);
e.step(nodes,.02,{enabled:false});assert.equal(e.particles.length,0);e.step(nodes,.02,{reduced:true});assert.equal(e.particles.length,0);
for(const distance of [1,2,10]){e=T.createEmitter();e.step(pair(distance),.02);assert.equal(e.particles.length,0,'overlap, touching, or distant nodes cannot spit through empty space');}
e=T.createEmitter();e.step(pair(),.02);e.step(pair().slice(0,1),.02);assert.equal(e.particles.length,0,'filtering away a target cancels its packet');
e=T.createEmitter();e.step(pair(),.02);e.step(pair(20),.02);assert.equal(e.particles.length,0,'moving a target far away cancels rather than stretching the flight');
e=T.createEmitter();e.step(pair(),.02);e.reset();assert.equal(e.particles.length,0);
const many=Array.from({length:150},(_,i)=>({id:String(i),x:(i%15)*3,y:Math.floor(i/15)*3,z:0,r:1}));e=T.createEmitter();
for(let i=0;i<600;i++){e.step(many,1/60);assert(e.particles.length<=T.LIMIT);for(const p of e.particles)assert([p.x,p.y,p.z,p.size,p.stretch].every(Number.isFinite));}
// The same simulated time produces the same trajectory across common refresh rates.
const states=[];for(const hz of [30,60,120]){e=T.createEmitter();e.step(pair(),.01);for(let i=0;i<hz/2;i++)e.step(pair(),1/hz);states.push(e.particles[0]);}
for(const p of states.slice(1))assert(Math.abs(p.x-states[0].x)<1e-10&&Math.abs(p.t-states[0].t)<1e-10);
const twoD=pair().map(({z,...n})=>n);e=T.createEmitter();e.step(twoD,.02);e.step(twoD,.05);assert.equal(e.particles[0].z,0);
console.log('Droplet transfer passed: proximity, direction, moving target, absorption, cooldown, hard cap, pause, reduced motion, filtering, 2D/3D and refresh-rate invariance.');
