const assert=require('node:assert/strict');
const {contours}=require('../docs/assets/liquid-surface.js');
const drop=(x,y=100,rx=22,ry=22,angle=0)=>({x,y,rx,ry,angle});
const area=loop=>Math.abs(loop.reduce((sum,p,i)=>{const q=loop[(i+1)%loop.length];return sum+p.x*q.y-q.x*p.y;},0)/2);
const single=contours([drop(100)],300,200,2);
assert.equal(single.length,1);assert(Math.abs(area(single[0])-Math.PI*22*22)/(Math.PI*22*22)<.02);
const squashed=contours([drop(100,100,15,22*22/15,.7)],300,200,2);
assert.equal(squashed.length,1);assert(Math.abs(area(squashed[0])-area(single[0]))/area(single[0])<.02,'compression should preserve approximate area');
assert.equal(contours([drop(80),drop(160)],300,200).length,2,'separated drops have separate surfaces');
const joined=contours([drop(80),drop(125)],300,200);
assert.equal(joined.length,1,'near drops must share one continuous liquid neck');
assert.equal(contours([drop(80),drop(160)],300,200).length,2,'pulling drops apart restores two surfaces');
const together=contours([drop(100),drop(100)],300,200);
assert.equal(together.length,1);assert(area(together[0])>area(single[0]));
for(const scenario of [joined,squashed,together,contours([drop(-5,20),drop(299,199)],300,200)]){
 for(const loop of scenario){assert(loop.length>=6);assert(new Set(loop.map(p=>p.id)).size===loop.length);assert(loop.every(p=>Number.isFinite(p.x+p.y)&&p.x>=0&&p.y>=0&&p.x<=304&&p.y<=204));}
}
assert.deepEqual(contours([],300,200),[]);
// An isolated node can remain asymmetric without relying on neighboring nodes.
for(const profile of [{skew:.22,wave2:.08,wave3:.05,phase:0},{skew:.03,wave2:.12,wave3:.16,phase:1.2},{skew:-.1,wave2:.15,wave3:.11,phase:2.1}]){
 const loops=contours([{...drop(100),...profile}],300,200,1.5);assert.equal(loops.length,1);
 assert(Math.abs(area(loops[0])-area(single[0]))/area(single[0])<.025,'arbitrary shapes preserve approximate area');
 const radii=loops[0].map(p=>Math.hypot(p.x-100,p.y-100));
 assert(Math.max(...radii)-Math.min(...radii)>6,'isolated shape must be visibly noncircular');
 const next=contours([{...drop(100),...profile,phase:profile.phase+.01}],300,200,1.5);
 assert.equal(next.length,1);assert(Math.abs(area(next[0])-area(loops[0]))/area(loops[0])<.01,'small parameter changes stay smooth');
}
console.log('Liquid surfaces passed: closed contours, merge/split topology, overlap, rotation, area-preserving compression and viewport edges.');
