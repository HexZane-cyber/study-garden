const assert=require('node:assert/strict'),{createLayout}=require('../docs/assets/graph-label-layout.js');
const p={id:'a',x:200,y:140,w:100,h:22,r:20,width:600,height:400},layout=createLayout();let first=layout.place(p,[]);assert.equal(first.y,160);
for(let i=1;i<=200;i++){const x=200+i*.1,y=140+Math.sin(i*.03)*2,box=layout.place({...p,x,y},[]);assert.equal(box.y,y+20);assert(Math.abs(box.x-(x-50))<1e-9);}
const block={x:150,y:158,w:100,h:30};assert.equal(layout.place(p,[block]),null,'an existing label must hide rather than jump to the opposite side');const restored=layout.place(p,[]);assert.equal(restored.y,160);
const above=createLayout(),initial=above.place(p,[block]);assert(initial.y<p.y);assert.equal(above.place(p,[]).y,initial.y,'clearing an obstacle must not flip a visible title back below');
let last;for(let y=330;y<=400;y+=.5){const box=layout.place({...p,y},[]);assert(box.y+box.h<=396);if(last)assert(Math.abs(box.y-last.y)<=.5+1e-9,'viewport clamping must remain continuous');last=box;}
const focused=layout.place(p,[block],);assert.equal(focused,null);const pinned=layout.place({...p,important:true},[block]);assert(pinned);assert.equal(pinned.y,160);
const hysteresis=createLayout();hysteresis.place(p,[]);const close={x:255,y:160,w:40,h:22};assert(hysteresis.place(p,[close]));const collision={...close,x:252};assert.equal(hysteresis.place(p,[collision]),null);assert.equal(hysteresis.place(p,[close]),null,'hidden labels require extra clearance to re-enter');assert(hysteresis.place(p,[{...close,x:260}]));
console.log('Label layout passed: persistent anchors, no opposite-side flips, smooth viewport clamping, focused visibility and re-entry hysteresis.');
