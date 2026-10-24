const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Interaction=require('../docs/assets/graph-interaction.js');
const tracker=Interaction.createTapTracker();
const tap=(id='a',time=100,extra={})=>tracker.finish({id,x:20,y:30,time,...extra});
assert.equal(tap(),'select');assert.equal(tap('a',300),'open');
assert.equal(tap('a',350),'select','a third tap starts a new sequence');
assert.equal(tap('b',400),'select','different nodes must not form a double tap');
assert.equal(tap('b',900),'select');assert.equal(tap('b',950,{x:80}),'select','far apart gestures must not open');
assert.equal(tap('b',1000,{moved:true}),'none');assert.equal(tap('b',1100),'select');
assert.equal(tap('b',1150,{cancelled:true}),'none');assert.equal(tap('b',1200),'select');
assert.equal(tap(null,1250),'select');assert.equal(tap('b',1300),'select');
tracker.reset();assert.equal(tap('b',1350),'select');
assert.equal(tap('b',1300),'select','clock changes cannot synthesize a double tap');
for(const hz of [30,60,144]){
 const value=Interaction.feedback();
 for(let i=0;i<hz;i++)Interaction.step(value,true,1/hz);
 assert(Math.abs(value.pressure-1)<.005,'held pointer should settle to a mild press');
 value.pulse=1;
 for(let i=0;i<hz;i++)Interaction.step(value,false,1/hz);
 assert(value.pressure<.001&&value.pulse===0,'release should settle without endless animation');
 assert(Object.values(value).every(Number.isFinite));
}
const reduced={pressure:1,velocity:4,pulse:1};Interaction.step(reduced,true,1/60,true);assert.deepEqual(reduced,Interaction.feedback());

// Execute the real 3D release handler, including cancellation and a missing move event.
const source=fs.readFileSync(path.join(__dirname,'../frontend/graph3d.js'),'utf8');
const body=source.split('function release(event){')[1].split('  // Capture before OrbitControls')[0].trim().replace(/}$/, '');
const makeRelease=new Function('taps','onSelect','actions',`
 let gesture=null;const shapes=[{n:{id:'a'},feedback:{pulse:0}}],model={setDrag(){}},controls={enabled:false};
 const release=event=>{${body}};
 return {down(id='a',moved=false){gesture={id,pointerId:1,x:10,y:10,moved};},release,shapes,controls};`);
const selections=[],opens=[],r=makeRelease(Interaction.createTapTracker(),id=>selections.push(id),{onOpen:id=>opens.push(id)});
const up={type:'pointerup',pointerId:1,clientX:10,clientY:10};
r.down();r.release(up);assert.deepEqual(selections,['a']);assert.equal(r.shapes[0].feedback.pulse,1);
r.down();r.release(up);assert.deepEqual(opens,['a']);assert(r.controls.enabled);
for(const type of ['pointercancel','lostpointercapture']){r.down();r.release({...up,type});}
r.down();r.release({...up,clientX:50});r.down('a',true);r.release(up);
assert.equal(selections.length,2);assert.equal(opens.length,1,'dragging or cancelling must never activate a node');
r.down();r.release({...up,pointerId:2});assert.equal(selections.length,2);r.release(up);assert.equal(selections.length,3);
console.log('Graph interaction passed: double tap timing/target/distance, drag and cancellation, press settling, reduced motion and actual 3D release routing.');
