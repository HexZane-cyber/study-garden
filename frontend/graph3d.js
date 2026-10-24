import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import Visuals from './graph-visuals.cjs';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import Physics from './graph3d-physics.cjs';
import Gravity from '../docs/assets/graph-gravity.js';
import LabelLayout from '../docs/assets/graph-label-layout.js';
import Interaction from '../docs/assets/graph-interaction.js';

export function createScene(canvas,data,onSelect,onError,actions={}){
  const taps=Interaction.createTapTracker(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));
  renderer.transmissionResolutionScale=.5;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.05,120);
  camera.position.set(9,6,12);
  const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2.2;controls.maxDistance=50;
  const environment=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),envMap=pmrem.fromScene(environment,.04);
  scene.environment=envMap.texture;environment.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffe8ed,0x2a0c20,2.2));
  const keyLight=new THREE.DirectionalLight(0xffe9f0,3.5);keyLight.position.set(-4,7,6);scene.add(keyLight);
  const sideLight=new THREE.DirectionalLight(0xff607e,2);sideLight.position.set(5,1,-3);scene.add(sideLight);
  const model=Physics.createModel(data);
  const gravityField=Gravity.createField(),gravityWorld=new THREE.Vector3();
  for(let i=0;i<160;i++)model.step(1/120,0);
  for(const n of model.nodes){n.vx*=.15;n.vy*=.15;n.vz*=.15;}
  const palette={course:0xef5467,note:0xff9a81,tool:0xd69767,guide:0x9e919b};
  const state={paused:false,flow:.55,adaptive:true,transparency:.74,liquid:true,contactMode:'soft',selected:null,query:'',focusOnly:false,labels:'smart',activities:{},nodeColors:{},lineColor:'#a94f6b',bend:.28};
  const adjacency=new Map(model.nodes.map(n=>[n.id,new Set()]));for(const e of model.edges){adjacency.get(e.a.id).add(e.b.id);adjacency.get(e.b.id).add(e.a.id);}
  const glass=new THREE.MeshPhysicalMaterial({color:0xe9b1c3,roughness:.1,metalness:0,transmission:.93,thickness:.7,ior:1.33,clearcoat:.45,clearcoatRoughness:.08,attenuationColor:0xee6a8c,attenuationDistance:2,envMapIntensity:.48});
  const solidMaterials=new Map(Object.entries(palette).map(([group,color])=>[group,new THREE.MeshStandardMaterial({color,roughness:.36})]));
  const markerGeometry=new THREE.SphereGeometry(.045,8,6),markerMaterials=new Map(Object.entries(palette).map(([group,color])=>[group,new THREE.MeshBasicMaterial({color})]));
  const ringGeometry=new THREE.RingGeometry(1,1.035,40);
  const layer=document.createElement('div');layer.className='graph3d-labels';canvas.parentElement.append(layer);
  const measure=document.createElement('canvas').getContext('2d');measure.font='11px system-ui,"Microsoft YaHei",sans-serif';
  const shapes=model.nodes.map(n=>{
    const geometry=new THREE.SphereGeometry(1,24,16),base=geometry.attributes.position.array.slice();
    const liquidMaterial=glass.clone(),solid=(solidMaterials.get(n.group)||solidMaterials.get('guide')).clone();
    const mesh=new THREE.Mesh(geometry,liquidMaterial);mesh.userData.id=n.id;scene.add(mesh);
    const marker=new THREE.Mesh(markerGeometry,(markerMaterials.get(n.group)||markerMaterials.get('guide')).clone());scene.add(marker);
    const label=document.createElement('a');label.className='graph3d-label';label.textContent=n.title;label.href=n.url||'#';label.setAttribute('aria-label','打开 '+n.title);label.title='打开文章：'+n.title;label.onclick=()=>onSelect(n.id);layer.append(label);
    const ring=new THREE.Mesh(ringGeometry,new THREE.MeshBasicMaterial({color:0xf29ab5,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));ring.visible=false;scene.add(ring);
    return {n,mesh,marker,ring,feedback:Interaction.feedback(),geometry,base,label,glass:liquidMaterial,solid,norm:1,phase:n.seed,radii:new Float32Array(base.length/3),weights:Float32Array.from(base.filter((_,i)=>i%3===1),y=>Math.max(.01,Math.sqrt(Math.max(0,1-y*y)))),labelWidth:Math.min(250,measure.measureText(n.title).width+14),angle:new THREE.Quaternion()};
  });
  const segments=20,positionArray=new Float32Array(model.edges.length*segments*6),lineGeometry=new THREE.BufferGeometry();
  lineGeometry.setAttribute('position',new THREE.BufferAttribute(positionArray,3));
  const lineMaterial=new THREE.LineBasicMaterial({color:0x6c3b4d});
  const lines=new THREE.LineSegments(lineGeometry,lineMaterial);lines.frustumCulled=false;scene.add(lines);
  const beadGeometry=new THREE.SphereGeometry(.026,6,4),beadMaterial=new THREE.MeshBasicMaterial({color:0xf7adbf});
  const beads=model.edges.map(()=>{const bead=new THREE.Mesh(beadGeometry,beadMaterial);scene.add(bead);return bead;});
  const fused=new Map(),fusionMaterial=glass.clone();fusionMaterial.vertexColors=true;fusionMaterial.color.set(0xffffff);fusionMaterial.attenuationColor.set(0xffffff);
  let lastLabels=-1,contacts=new Set();const labelLayout=LabelLayout.createLayout();
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(),point=new THREE.Vector3(),dragOffset=new THREE.Vector3(),direction=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  let active=false,disposed=false,frameId=null,last=null,accumulator=0,hover=null,gesture=null,lastShape=-1,lastShapeTime=-1,width=1,height=1;
  const linked=n=>!state.selected||n.id===state.selected||adjacency.get(state.selected)?.has(n.id);
  const shown=n=>!state.focusOnly||linked(n);
  function resize(){const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;width=rect.width;height=rect.height;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  function fit(){
    resize();
    const nodes=model.nodes.filter(shown);if(!nodes.length)return;
    const center=new THREE.Vector3();for(const n of nodes)center.add(new THREE.Vector3(n.x,n.y,n.z));center.divideScalar(nodes.length);
    const radius=Math.max(1.4,...nodes.map(n=>center.distanceTo(new THREE.Vector3(n.x,n.y,n.z))+n.r+.45));
    const distance=radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))/Math.min(1,camera.aspect)*1.08;
    direction.subVectors(camera.position,controls.target).normalize();if(direction.lengthSq()<.1)direction.set(.5,.3,1).normalize();
    controls.target.copy(center);camera.position.copy(center).addScaledVector(direction,distance);controls.update();
  }
  function deform(shape){
    const {n,base,geometry}=shape,pos=geometry.attributes.position;
    const phase=n.seed+model.time*.2*state.flow*n.localFlow;let sum=0,weights=0;
    const radii=shape.radii;
    for(let i=0;i<base.length;i+=3){const x=base[i],y=base[i+1],z=base[i+2];
      const radius=Visuals.radial(x,y,z,n.seed,phase);
      radii[i/3]=radius;const w=shape.weights[i/3];sum+=radius**3*w;weights+=w;
    }
    const norm=Math.cbrt(sum/weights);shape.norm=norm;shape.phase=phase;
    for(let i=0;i<base.length;i+=3){const r=radii[i/3]/norm;pos.setXYZ(i/3,base[i]*r,base[i+1]*r,base[i+2]*r);}
    pos.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
  }
  function fusion(now,dt=0){
    if(!state.liquid||state.contactMode!=='merge'){for(const item of fused.values())item.effect.visible=false;contacts=new Set();return;}
    const available=shapes.filter(s=>shown(s.n));
    const grouped=Visuals.contactGroups(available.map(s=>{const q=s.mesh.quaternion;return {id:s.n.id,...s.mesh.position,sx:s.mesh.scale.x,sy:s.mesh.scale.y,sz:s.mesh.scale.z,inverse:[-q.x,-q.y,-q.z,q.w],seed:s.n.seed,phase:s.phase,norm:s.norm};}),contacts);
    contacts=grouped.contacts;
    const groups=grouped.groups.map(indices=>indices.map(i=>available[i]));
    const groupId=group=>group.map(s=>s.n.id).sort().join('|');
    // Oldest surfaces go first so several contacts share the rebuild budget fairly.
    groups.sort((a,b)=>(fused.get(groupId(a))?.updated??-Infinity)-(fused.get(groupId(b))?.updated??-Infinity));
    const live=new Set();let rebuilt=0;
    for(const group of groups){
      if(group.length<2)continue;
      const id=groupId(group);live.add(id);
      let item=fused.get(id);
      if(!item){if(rebuilt)continue;const res=group.length<=3?28:32;const effect=new MarchingCubes(res,fusionMaterial,false,true,16000);effect.isolation=0;effect.frustumCulled=false;scene.add(effect);item={effect,res,signature:'',updated:-Infinity,neck:.004};fused.set(id,item);}
      const drops=group.map(s=>{const q=s.mesh.quaternion,color=s.glass.color;return {x:s.n.x,y:s.n.y,z:s.n.z,sx:s.mesh.scale.x,sy:s.mesh.scale.y,sz:s.mesh.scale.z,inverse:[-q.x,-q.y,-q.z,q.w],seed:s.n.seed,phase:s.phase,norm:s.norm,color:[color.r,color.g,color.b]};});
      item.neck=Visuals.relaxNeck(item.neck,Visuals.neckTarget(drops),dt);
      const signature=group.map(s=>[s.mesh.position.x,s.mesh.position.y,s.mesh.position.z,s.mesh.quaternion.x,s.mesh.quaternion.y,s.mesh.quaternion.z,s.mesh.quaternion.w,s.mesh.scale.x,s.mesh.scale.y,s.mesh.scale.z,s.phase].map(v=>v.toFixed(3)).join(',')).join(';')+JSON.stringify(state.nodeColors)+item.neck.toFixed(3);
      const centroid=new THREE.Vector3();for(const s of group)centroid.add(s.mesh.position);centroid.divideScalar(group.length);
      if(item.signature&&(signature===item.signature||!Visuals.canRebuildSurface(item.updated,now,rebuilt))){
        // Cached geometry follows translation every frame, even between surface rebuilds.
        const shift=centroid.clone().sub(item.centroid);
        item.effect.visible=true;item.effect.position.copy(item.origin).add(shift);for(const shape of group)shape.mesh.visible=false;
        continue;
      }
      if(!Visuals.canRebuildSurface(item.updated,now,rebuilt))continue;
      rebuilt++;
      item.signature=signature;item.updated=now;
      const box=new THREE.Box3();
      for(const s of group){const reach=Math.max(s.mesh.scale.x,s.mesh.scale.y,s.mesh.scale.z)*1.7+.2;box.expandByPoint(s.mesh.position.clone().addScalar(reach));box.expandByPoint(s.mesh.position.clone().addScalar(-reach));}
      let center=box.getCenter(new THREE.Vector3());const extent=box.getSize(new THREE.Vector3());let half=Math.max(extent.x,extent.y,extent.z)/2;
      if(item.volume&&box.min.x>item.volume.center.x-item.volume.half&&box.max.x<item.volume.center.x+item.volume.half&&box.min.y>item.volume.center.y-item.volume.half&&box.max.y<item.volume.center.y+item.volume.half&&box.min.z>item.volume.center.z-item.volume.half&&box.max.z<item.volume.center.z+item.volume.half){center=item.volume.center;half=item.volume.half;}
      else {half*=1.12;item.volume={center:center.clone(),half};}
      item.effect.reset();Visuals.fillUnion(item.effect.field,item.effect.palette,item.res,center,half,drops,item.neck);
      item.effect.position.copy(center);item.effect.scale.setScalar(half);item.effect.update();
      item.origin=center.clone();item.centroid=centroid;
      item.effect.visible=item.effect.count>0;
      if(item.effect.visible)for(const shape of group)shape.mesh.visible=false;
    }
    for(const [id,item]of fused)if(!live.has(id)){scene.remove(item.effect);item.effect.geometry.dispose();fused.delete(id);}

  }
  function labels(){
    const focused=shapes.find(s=>s.label===document.activeElement)?.n.id;
    const occupied=[],rank=n=>(n.id===state.selected?10000:0)+(n.id===focused?9500:0)+(n.id===hover?9000:0)+(state.query&&n.title.toLowerCase().includes(state.query)?8000:0)+(state.selected&&linked(n)?100:0)+(adjacency.get(n.id)?.size||0);
    const sorted=shapes.slice().sort((a,b)=>rank(b.n)-rank(a.n)||a.n.id.localeCompare(b.n.id));
    for(const shape of sorted){
      const {n,label}=shape,important=n.id===state.selected||n.id===hover||n.id===focused;
      const match=!state.query||state.focusOnly||n.title.toLowerCase().includes(state.query);
      if(!shown(n)||!match||(state.labels==='off'&&!important)||(state.selected&&!linked(n))){label.hidden=true;continue;}
      const p=shape.mesh.position.clone().project(camera);if(p.z< -1||p.z>1){label.hidden=true;continue;}
      const x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height;
      const pixelRadius=n.r*1.45*height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.distanceTo(shape.mesh.position));
      const w=shape.labelWidth,h=22,r=pixelRadius+6;
      const box=labelLayout.place({id:n.id,x,y,w,h,r,width,height,smart:state.labels==='smart',important},occupied);
      if(!box){label.hidden=true;continue;}
      occupied.push(box);label.hidden=false;label.style.transform=`translate(${box.x}px,${box.y}px)`;label.style.maxWidth=box.w+'px';label.classList.toggle('is-selected',important);
      label.style.opacity=important?'1':String(Math.max(.6,Math.min(1,1-(p.z-.98)*16)));
    }
  }
  function render(now){
    frameId=null;if(disposed||!active)return;
    const dt=last===null?0:Math.max(0,Math.min((now-last)/1000,.05));last=now;
    if(!state.paused&&!document.hidden){accumulator+=dt;let steps=0;while(accumulator>=1/120&&steps<6){const gravity=gravityField.step(1/120);gravityWorld.set(gravity.x,-gravity.y,0).applyQuaternion(camera.quaternion);model.step(1/120,state.liquid?state.flow:0,state.adaptive,gravityWorld);accumulator-=1/120;steps++;}}else accumulator=0;
    controls.update(dt);const dark=document.body.dataset.mdColorScheme==='slate';scene.background=new THREE.Color(dark?0x141114:0xfffafc);
    glass.transmission=.7+state.transparency*.3;glass.attenuationDistance=1+state.transparency*3;
    const updateShape=lastShape<0||(model.time!==lastShapeTime&&now-lastShape>1000/30);
    for(const shape of shapes){const {n,mesh,marker}=shape;
      mesh.visible=marker.visible=shown(n);mesh.position.set(n.x,n.y,n.z);marker.position.copy(mesh.position);
      mesh.material=state.liquid?shape.glass:shape.solid;shape.glass.transmission=glass.transmission;shape.glass.attenuationDistance=glass.attenuationDistance;
      const speed=Math.hypot(n.vx,n.vy,n.vz),scale=Visuals.contactScale(n.r,speed,n.squeeze,n.seed);mesh.scale.set(scale.x,scale.y,scale.z);
      const feedback=Interaction.step(shape.feedback,gesture?.id===n.id,document.hidden?0:dt,reduced),press=1-.065*feedback.pressure;mesh.scale.x/=Math.sqrt(press);mesh.scale.y*=press;mesh.scale.z/=Math.sqrt(press);
      if(n.squeeze>.008)direction.set(n.contactX,n.contactY,n.contactZ);else direction.set(n.vx,n.vy,n.vz);if(direction.lengthSq()>.01)shape.angle.setFromUnitVectors(up,direction.normalize());else shape.angle.setFromAxisAngle(up,n.seed);
      mesh.quaternion.slerp(shape.angle,1-Math.exp(-4*dt));
      const pulse=feedback.pulse;shape.ring.visible=shown(n)&&(pulse>0||gesture?.id===n.id);shape.ring.position.copy(mesh.position);direction.subVectors(camera.position,mesh.position).normalize();shape.ring.position.addScaledVector(direction,n.r*1.75);shape.ring.quaternion.copy(camera.quaternion);shape.ring.scale.setScalar(n.r*(1.45+(gesture?.id===n.id?0:(1-pulse)*.8)));shape.ring.material.opacity=reduced?(gesture?.id===n.id?0.35:0):Math.max(pulse*.55,gesture?.id===n.id ? .35 : 0);shape.glass.emissive.set(0x9e3658).multiplyScalar(feedback.pressure*.1+pulse*.08);shape.solid.emissive.copy(shape.glass.emissive);
      if(updateShape)deform(shape);
    }
    if(updateShape){lastShape=now;lastShapeTime=model.time;}
    fusionMaterial.transmission=glass.transmission;fusionMaterial.attenuationDistance=glass.attenuationDistance;
    model.edges.forEach((e,i)=>{const visible=shown(e.a)&&shown(e.b),a=visible?e.a:{x:0,y:0,z:0},b=visible?e.b:a;
      const tension=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z)/3.2),curve=Visuals.prepareCurve(a,b,i,model.time,state.bend/tension,e.curve||(e.curve=new Float64Array(9))),p=e.point||(e.point={}),q=e.next||(e.next={});
      Visuals.sampleCurve(curve,0,p);
      for(let j=0;j<segments;j++){Visuals.sampleCurve(curve,(j+1)/segments,q);const offset=(i*segments+j)*6;positionArray[offset]=p.x;positionArray[offset+1]=p.y;positionArray[offset+2]=p.z;positionArray[offset+3]=q.x;positionArray[offset+4]=q.y;positionArray[offset+5]=q.z;p.x=q.x;p.y=q.y;p.z=q.z;}
      const t=(model.time*.13+i*.618)%1;Visuals.sampleCurve(curve,t,p);
      beads[i].visible=visible&&state.liquid;beads[i].position.set(p.x,p.y,p.z);
    });lineGeometry.attributes.position.needsUpdate=true;
    fusion(now,document.hidden?0:dt);
    renderer.render(scene,camera);if(now-lastLabels>1000/30){labels();lastLabels=now;}frameId=requestAnimationFrame(render);
  }
  function ray(event){const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);}
  function hit(event){ray(event);return raycaster.intersectObjects(shapes.filter(s=>shown(s.n)).map(s=>s.mesh),false)[0]?.object.userData.id||null;}
  function down(event){
    if(event.button!==0||gesture)return;const id=hit(event);gesture={id,pointerId:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
    if(id){event.stopImmediatePropagation();controls.enabled=false;canvas.setPointerCapture(event.pointerId);
      const n=model.byId.get(id);camera.getWorldDirection(direction);plane.setFromNormalAndCoplanarPoint(direction,new THREE.Vector3(n.x,n.y,n.z));raycaster.ray.intersectPlane(plane,point);dragOffset.set(n.x,n.y,n.z).sub(point);model.setDrag({id,x:n.x,y:n.y,z:n.z});
    }
  }
  function move(event){
    if(!gesture){if(event.timeStamp-(move.lastHover||0)<50)return;move.lastHover=event.timeStamp;hover=hit(event);canvas.style.cursor=hover?'grab':'move';return;}
    if(event.pointerId!==gesture.pointerId)return;
    if(Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>4)gesture.moved=true;
    if(gesture.id){event.stopImmediatePropagation();ray(event);if(raycaster.ray.intersectPlane(plane,point)){
      point.add(dragOffset);model.setDrag({id:gesture.id,x:point.x,y:point.y,z:point.z});
      if(state.paused){const n=model.byId.get(gesture.id);n.x=point.x;n.y=point.y;n.z=point.z;n.vx=n.vy=n.vz=0;}
    }}
  }
  function release(event){if(!gesture||gesture.pointerId!==event.pointerId)return;const old=gesture;gesture=null;model.setDrag(null);controls.enabled=true;const moved=old.moved||Number.isFinite(event.clientX)&&Math.hypot(event.clientX-old.x,event.clientY-old.y)>4,result=taps.finish({id:old.id,x:old.x,y:old.y,moved,cancelled:event.type!=='pointerup'});if(result!=='none'){const shape=shapes.find(s=>s.n.id===old.id);if(shape)shape.feedback.pulse=1;onSelect(old.id);if(result==='open')actions.onOpen?.(old.id);}}
  // Capture before OrbitControls so node dragging never rotates the camera too.
  canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',release,true);canvas.addEventListener('pointercancel',release,true);canvas.addEventListener('lostpointercapture',release,true);
  const lost=event=>{event.preventDefault();setVisible(false);onError('三维渲染已中断，已切回二维视图。');};canvas.addEventListener('webglcontextlost',lost);
  const keydown=event=>{
    const delta=event.key==='ArrowLeft'?.12:event.key==='ArrowRight'?-.12:0;
    if(delta){event.preventDefault();const offset=camera.position.clone().sub(controls.target).applyAxisAngle(up,delta);camera.position.copy(controls.target).add(offset);controls.update();}
    if(event.key==='+'||event.key==='='||event.key==='-'){event.preventDefault();const offset=camera.position.clone().sub(controls.target),distance=THREE.MathUtils.clamp(offset.length()*(event.key==='-'?1.12:.88),controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(offset.setLength(distance));controls.update();}
    if(event.key==='Enter'&&state.selected){event.preventDefault();actions.onOpen?.(state.selected);}if(event.key==='0')fit();
  };canvas.addEventListener('keydown',keydown);
  const visibility=()=>{last=null;accumulator=0;if(document.hidden){gesture=null;taps.reset();model.setDrag(null);controls.enabled=true;}};document.addEventListener('visibilitychange',visibility);
  function setVisible(value){taps.reset();active=value;layer.hidden=!value;last=null;accumulator=0;if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;if(value){resize();frameId=requestAnimationFrame(render);}else{gesture=null;model.setDrag(null);controls.enabled=true;}}
  function setState(patch){
    if(patch.contactMode!==undefined&&patch.contactMode!==state.contactMode){for(const item of fused.values()){scene.remove(item.effect);item.effect.geometry.dispose();}fused.clear();contacts=new Set();}
    if(patch.gravity)gravityField.configure(patch.gravity);
    if(patch.gravity&&Object.keys(patch).length===1)return;
    Object.assign(state,patch);for(const n of model.nodes)n.targetFlow=state.activities[n.id]||.2;
    const color=new THREE.Color();
    for(const shape of shapes){color.set(state.nodeColors[shape.n.id]||palette[shape.n.group]||palette.guide);shape.glass.attenuationColor.copy(color);shape.solid.color.copy(color);shape.marker.material.color.copy(color);shape.glass.color.copy(color).lerp(new THREE.Color(0xffffff),.67);}
    lineMaterial.color.set(state.lineColor).multiplyScalar(.6);beadMaterial.color.set(state.lineColor).lerp(new THREE.Color(0xffffff),.4);
  }
  function reset(){taps.reset();model.reset();for(let i=0;i<160;i++)model.step(1/120,0);for(const n of model.nodes){n.vx*=.15;n.vy*=.15;n.vz*=.15;}controls.target.set(0,0,0);camera.position.set(9,6,12);fit();}
  function dispose(){disposed=true;setVisible(false);observer.disconnect();canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.removeEventListener(type,release,true);canvas.removeEventListener('keydown',keydown);canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);controls.dispose();layer.remove();renderer.dispose();envMap.dispose();glass.dispose();ringGeometry.dispose();markerGeometry.dispose();lineGeometry.dispose();lineMaterial.dispose();beadGeometry.dispose();beadMaterial.dispose();fusionMaterial.dispose();for(const item of fused.values())item.effect.geometry.dispose();for(const shape of shapes){shape.geometry.dispose();shape.glass.dispose();shape.solid.dispose();shape.marker.material.dispose();shape.ring.material.dispose();}for(const m of [...solidMaterials.values(),...markerMaterials.values()])m.dispose();}
  function screenPosition(id){const n=model.byId.get(id);if(!n||!shown(n))return null;const p=new THREE.Vector3(n.x,n.y,n.z).project(camera);if(p.z< -1||p.z>1)return null;return {x:(p.x*.5+.5)*width,y:(-.5*p.y+.5)*height,r:n.r*1.45*height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.distanceTo(new THREE.Vector3(n.x,n.y,n.z)))};}
  resize();fit();return {setVisible,setState,fit,reset,dispose,model,screenPosition};
}
