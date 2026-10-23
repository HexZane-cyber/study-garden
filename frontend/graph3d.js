import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import Physics from './graph3d-physics.cjs';

export function createScene(canvas,data,onSelect,onError){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
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
  for(let i=0;i<160;i++)model.step(1/120,0);
  for(const n of model.nodes){n.vx*=.15;n.vy*=.15;n.vz*=.15;}
  const palette={course:0xef5467,note:0xff9a81,tool:0xd69767,guide:0x9e919b};
  const state={paused:false,flow:.55,adaptive:true,transparency:.74,liquid:true,selected:null,query:'',focusOnly:false,labels:'smart',activities:{}};
  const adjacency=new Map(model.nodes.map(n=>[n.id,new Set()]));for(const e of model.edges){adjacency.get(e.a.id).add(e.b.id);adjacency.get(e.b.id).add(e.a.id);}
  const glass=new THREE.MeshPhysicalMaterial({color:0xe9b1c3,roughness:.1,metalness:0,transmission:.93,thickness:.7,ior:1.33,clearcoat:.45,clearcoatRoughness:.08,attenuationColor:0xee6a8c,attenuationDistance:2,envMapIntensity:.48});
  const solidMaterials=new Map(Object.entries(palette).map(([group,color])=>[group,new THREE.MeshStandardMaterial({color,roughness:.36})]));
  const markerGeometry=new THREE.SphereGeometry(.045,8,6),markerMaterials=new Map(Object.entries(palette).map(([group,color])=>[group,new THREE.MeshBasicMaterial({color})]));
  const layer=document.createElement('div');layer.className='graph3d-labels';canvas.parentElement.append(layer);
  const measure=document.createElement('canvas').getContext('2d');measure.font='11px system-ui,"Microsoft YaHei",sans-serif';
  const shapes=model.nodes.map(n=>{
    const geometry=new THREE.SphereGeometry(1,24,16),base=geometry.attributes.position.array.slice();
    const mesh=new THREE.Mesh(geometry,glass);mesh.userData.id=n.id;scene.add(mesh);
    const marker=new THREE.Mesh(markerGeometry,markerMaterials.get(n.group)||markerMaterials.get('guide'));scene.add(marker);
    const label=document.createElement('button');label.type='button';label.className='graph3d-label';label.textContent=n.title;label.setAttribute('aria-label','选择 '+n.title);label.onclick=()=>onSelect(n.id);layer.append(label);
    return {n,mesh,marker,geometry,base,label,labelWidth:Math.min(250,measure.measureText(n.title).width+14),angle:new THREE.Quaternion()};
  });
  const positionArray=new Float32Array(model.edges.length*6),lineGeometry=new THREE.BufferGeometry();
  lineGeometry.setAttribute('position',new THREE.BufferAttribute(positionArray,3));
  const lineMaterial=new THREE.LineBasicMaterial({color:0x6c3b4d});
  const lines=new THREE.LineSegments(lineGeometry,lineMaterial);lines.frustumCulled=false;scene.add(lines);
  const beadGeometry=new THREE.SphereGeometry(.026,6,4),beadMaterial=new THREE.MeshBasicMaterial({color:0xf7adbf});
  const beads=model.edges.map(()=>{const bead=new THREE.Mesh(beadGeometry,beadMaterial);scene.add(bead);return bead;});
  const bridges=new Map(),bridgeGeometry=new THREE.CylinderGeometry(1,1,1,12,1,true);
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
    const radii=new Float32Array(base.length/3);
    for(let i=0;i<base.length;i+=3){const x=base[i],y=base[i+1],z=base[i+2],theta=Math.atan2(z,x),phi=Math.acos(Math.max(-1,Math.min(1,y)));
      const radius=1+.16*Math.sin(theta+n.seed)*Math.sin(phi)+.09*Math.cos(3*theta+phase)*Math.sin(phi)**2+.065*Math.sin(2*phi+n.seed);
      radii[i/3]=radius;const w=Math.max(.01,Math.sin(phi));sum+=radius**3*w;weights+=w;
    }
    const norm=Math.cbrt(sum/weights);
    for(let i=0;i<base.length;i+=3){const r=radii[i/3]/norm;pos.setXYZ(i/3,base[i]*r,base[i+1]*r,base[i+2]*r);}
    pos.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
  }
  function labels(){
    const occupied=[],rank=n=>(n.id===state.selected?10000:0)+(n.id===hover?9000:0)+(state.query&&n.title.toLowerCase().includes(state.query)?8000:0)+(state.selected&&linked(n)?100:0)+(adjacency.get(n.id)?.size||0);
    const sorted=shapes.slice().sort((a,b)=>rank(b.n)-rank(a.n)||camera.position.distanceTo(a.mesh.position)-camera.position.distanceTo(b.mesh.position));
    for(const shape of sorted){
      const {n,label}=shape,important=n.id===state.selected||n.id===hover;
      const match=!state.query||state.focusOnly||n.title.toLowerCase().includes(state.query);
      if(!shown(n)||!match||(state.labels==='off'&&!important)||(state.selected&&!linked(n))){label.hidden=true;continue;}
      const p=shape.mesh.position.clone().project(camera);if(p.z< -1||p.z>1){label.hidden=true;continue;}
      const x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height;
      const pixelRadius=n.r*1.45*height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.distanceTo(shape.mesh.position));
      const w=shape.labelWidth,h=22,r=pixelRadius+6;
      const candidates=[{x:x-w/2,y:y+r},{x:x-w/2,y:y-r-h},{x:x+r,y:y-h/2},{x:x-r-w,y:y-h/2}];
      let box=candidates.find(b=>b.x>=3&&b.y>=3&&b.x+w<width-3&&b.y+h<height-3&&(state.labels!=='smart'||!occupied.some(a=>b.x<a.x+a.w+4&&b.x+w+4>a.x&&b.y<a.y+a.h+3&&b.y+h+3>a.y)));
      if(!box&&important)box={x:Math.max(3,Math.min(width-w-3,x-w/2)),y:Math.max(3,Math.min(height-h-3,y+r))};
      if(!box){label.hidden=true;continue;}
      occupied.push({...box,w,h});label.hidden=false;label.style.transform=`translate(${box.x}px,${box.y}px)`;label.style.maxWidth=w+'px';label.classList.toggle('is-selected',important);
      label.style.opacity=important?'1':String(Math.max(.6,Math.min(1,1-(p.z-.98)*16)));
    }
  }
  function render(now){
    frameId=null;if(disposed||!active)return;
    const dt=last===null?0:Math.max(0,Math.min((now-last)/1000,.05));last=now;
    if(!state.paused&&!document.hidden){accumulator+=dt;let steps=0;while(accumulator>=1/120&&steps<6){model.step(1/120,state.liquid?state.flow:0,state.adaptive);accumulator-=1/120;steps++;}}else accumulator=0;
    controls.update(dt);const dark=document.body.dataset.mdColorScheme==='slate';scene.background=new THREE.Color(dark?0x141114:0xfffafc);
    glass.transmission=.7+state.transparency*.3;glass.attenuationDistance=1+state.transparency*3;
    const updateShape=lastShape<0||(model.time!==lastShapeTime&&now-lastShape>1000/30);
    for(const shape of shapes){const {n,mesh,marker}=shape;
      mesh.visible=marker.visible=shown(n);mesh.position.set(n.x,n.y,n.z);marker.position.copy(mesh.position);
      mesh.material=state.liquid?glass:(solidMaterials.get(n.group)||solidMaterials.get('guide'));
      const speed=Math.hypot(n.vx,n.vy,n.vz),stretch=1+.12*Math.sin(n.seed)+Math.min(.3,speed*.07);
      mesh.scale.set(n.r*stretch,n.r*(1-n.squeeze)/Math.sqrt(stretch),n.r/((1-n.squeeze)*Math.sqrt(stretch)));
      direction.set(n.vx,n.vy,n.vz);if(direction.lengthSq()>.01)shape.angle.setFromUnitVectors(up,direction.normalize());else shape.angle.setFromAxisAngle(up,n.seed);
      mesh.quaternion.slerp(shape.angle,1-Math.exp(-4*dt));
      if(updateShape)deform(shape);
    }
    if(updateShape){lastShape=now;lastShapeTime=model.time;}
    model.edges.forEach((e,i)=>{const visible=shown(e.a)&&shown(e.b),a=visible?e.a:{x:0,y:0,z:0},b=visible?e.b:a;
      positionArray.set([a.x,a.y,a.z,b.x,b.y,b.z],i*6);const t=(model.time*.13+i*.618)%1;
      beads[i].visible=visible&&state.liquid;beads[i].position.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);
    });lineGeometry.attributes.position.needsUpdate=true;
    // Short liquid necks appear only at nearby surfaces, independently of article links.
    const live=new Set();if(state.liquid)for(let i=0;i<shapes.length;i++)for(let j=i+1;j<shapes.length;j++){
      const a=shapes[i],b=shapes[j];if(!a.mesh.visible||!b.mesh.visible)continue;
      const distance=a.mesh.position.distanceTo(b.mesh.position),reach=(a.n.r+b.n.r)*1.48;if(distance>=reach||distance<.001)continue;
      const id=i+':'+j;live.add(id);let bridge=bridges.get(id);if(!bridge){bridge=new THREE.Mesh(bridgeGeometry,glass);scene.add(bridge);bridges.set(id,bridge);}
      bridge.visible=true;bridge.position.addVectors(a.mesh.position,b.mesh.position).multiplyScalar(.5);direction.subVectors(b.mesh.position,a.mesh.position).normalize();bridge.quaternion.setFromUnitVectors(up,direction);
      const radius=Math.min(a.n.r,b.n.r)*.7*Math.sqrt(1-distance/reach);bridge.scale.set(radius,distance,radius);
    }for(const [id,bridge] of bridges)if(!live.has(id))bridge.visible=false;
    renderer.render(scene,camera);labels();frameId=requestAnimationFrame(render);
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
    if(!gesture){hover=hit(event);canvas.style.cursor=hover?'grab':'move';return;}
    if(event.pointerId!==gesture.pointerId)return;
    if(Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>4)gesture.moved=true;
    if(gesture.id){event.stopImmediatePropagation();ray(event);if(raycaster.ray.intersectPlane(plane,point)){
      point.add(dragOffset);model.setDrag({id:gesture.id,x:point.x,y:point.y,z:point.z});
      if(state.paused){const n=model.byId.get(gesture.id);n.x=point.x;n.y=point.y;n.z=point.z;n.vx=n.vy=n.vz=0;}
    }}
  }
  function release(event){if(!gesture||gesture.pointerId!==event.pointerId)return;const old=gesture;gesture=null;model.setDrag(null);controls.enabled=true;if(event.type==='pointerup'&&!old.moved)onSelect(old.id);}
  // Capture before OrbitControls so node dragging never rotates the camera too.
  canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',release,true);canvas.addEventListener('pointercancel',release,true);canvas.addEventListener('lostpointercapture',release,true);
  const lost=event=>{event.preventDefault();setVisible(false);onError('三维渲染已中断，已切回二维视图。');};canvas.addEventListener('webglcontextlost',lost);
  const keydown=event=>{
    const delta=event.key==='ArrowLeft'?.12:event.key==='ArrowRight'?-.12:0;
    if(delta){event.preventDefault();const offset=camera.position.clone().sub(controls.target).applyAxisAngle(up,delta);camera.position.copy(controls.target).add(offset);controls.update();}
    if(event.key==='+'||event.key==='='||event.key==='-'){event.preventDefault();const offset=camera.position.clone().sub(controls.target),distance=THREE.MathUtils.clamp(offset.length()*(event.key==='-'?1.12:.88),controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(offset.setLength(distance));controls.update();}
    if(event.key==='0')fit();
  };canvas.addEventListener('keydown',keydown);
  const visibility=()=>{last=null;accumulator=0;if(document.hidden){gesture=null;model.setDrag(null);controls.enabled=true;}};document.addEventListener('visibilitychange',visibility);
  function setVisible(value){active=value;layer.hidden=!value;last=null;accumulator=0;if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;if(value){resize();frameId=requestAnimationFrame(render);}else{gesture=null;model.setDrag(null);controls.enabled=true;}}
  function setState(patch){Object.assign(state,patch);for(const n of model.nodes)n.targetFlow=state.activities[n.id]||.2;}
  function reset(){model.reset();for(let i=0;i<160;i++)model.step(1/120,0);for(const n of model.nodes){n.vx*=.15;n.vy*=.15;n.vz*=.15;}controls.target.set(0,0,0);camera.position.set(9,6,12);fit();}
  function dispose(){disposed=true;setVisible(false);observer.disconnect();canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.removeEventListener(type,release,true);canvas.removeEventListener('keydown',keydown);canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);controls.dispose();layer.remove();renderer.dispose();envMap.dispose();glass.dispose();markerGeometry.dispose();lineGeometry.dispose();lineMaterial.dispose();beadGeometry.dispose();beadMaterial.dispose();bridgeGeometry.dispose();for(const shape of shapes)shape.geometry.dispose();for(const m of [...solidMaterials.values(),...markerMaterials.values()])m.dispose();}
  resize();fit();return {setVisible,setState,fit,reset,dispose,model};
}
