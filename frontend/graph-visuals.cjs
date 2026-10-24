'use strict';
function prepareCurve(a,b,seed=0,time=0,bend=.18,out=new Float64Array(9)){
  const dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-(a.z||0),length=Math.hypot(dx,dy,dz);
  let nx=-dy,ny=dx,nz=0;if(Math.hypot(nx,ny)<length*.01){nx=-dz;ny=0;nz=dx;}
  const n=Math.hypot(nx,ny,nz)||1;nx/=n;ny/=n;nz/=n;
  const divisor=length||1,ux=dx/divisor,uy=dy/divisor,uz=dz/divisor;
  const bx=uy*nz-uz*ny,by=uz*nx-ux*nz,bz=ux*ny-uy*nx;
  const phase=seed*.71+Math.sin(time*.35+seed)*.18,amplitude=Math.min(length*.65,length*bend);
  const cx=(a.x+b.x)/2+amplitude*(nx*Math.cos(phase)+bx*Math.sin(phase));
  const cy=(a.y+b.y)/2+amplitude*(ny*Math.cos(phase)+by*Math.sin(phase));
  const cz=((a.z||0)+(b.z||0))/2+amplitude*(nz*Math.cos(phase)+bz*Math.sin(phase));
  out[0]=a.x;out[1]=a.y;out[2]=a.z||0;out[3]=cx;out[4]=cy;out[5]=cz;out[6]=b.x;out[7]=b.y;out[8]=b.z||0;return out;
}
function sampleCurve(curve,t,out={}){const u=1-t,p=u*u,q=2*u*t,r=t*t;out.x=p*curve[0]+q*curve[3]+r*curve[6];out.y=p*curve[1]+q*curve[4]+r*curve[7];out.z=p*curve[2]+q*curve[5]+r*curve[8];return out;}
function curvePoint(a,b,t,seed=0,time=0,bend=.18){return sampleCurve(prepareCurve(a,b,seed,time,bend),t);}
// A capillary neck is narrow at first contact and relaxes when surfaces separate.
function neckTarget(drops){let target=.004;for(let i=0;i<drops.length;i++)for(let j=i+1;j<drops.length;j++){const a=drops[i],b=drops[j],dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d=Math.hypot(dx,dy,dz)||1e-9,nx=dx/d,ny=dy/d,nz=dz/d,gap=d-supportRadius(a,nx,ny,nz)-supportRadius(b,-nx,-ny,-nz),t=Math.max(0,Math.min(1,(.012-gap)/.12));target=Math.max(target,.004+.058*t*t*(3-2*t));}return target;}
function relaxNeck(current,target,dt){return current+(target-current)*(1-Math.exp(-(target>current?7:16)*Math.max(0,Math.min(.05,dt))));}
function canRebuildSurface(updated,now,used){return used<1&&now-updated>=1000/30;}
function radialFast(x,y,z,trig){
  const [cs,ss,cp,sp]=trig,sinPhi=Math.sqrt(Math.max(0,1-y*y));
  const triple=((x*x*x-3*x*z*z)*cp-(3*x*x*z-z*z*z)*sp)/Math.max(1e-7,sinPhi);
  return 1+.16*(z*cs+x*ss)+.09*triple+.065*(2*y*sinPhi*cs+(2*y*y-1)*ss);
}
function radial(x,y,z,seed,phase){return radialFast(x,y,z,[Math.cos(seed),Math.sin(seed),Math.cos(phase),Math.sin(phase)]);}

function distance(x,y,z,drop){
  x-=drop.x;y-=drop.y;z-=drop.z;
  const q=drop.inverse||[0,0,0,1],tx=2*(q[1]*z-q[2]*y),ty=2*(q[2]*x-q[0]*z),tz=2*(q[0]*y-q[1]*x);
  const u=(x+q[3]*tx+q[1]*tz-q[2]*ty)/drop.sx,v=(y+q[3]*ty+q[2]*tx-q[0]*tz)/drop.sy,w=(z+q[3]*tz+q[0]*ty-q[1]*tx)/drop.sz;
  const length=Math.hypot(u,v,w);if(length<1e-9)return -Math.min(drop.sx,drop.sy,drop.sz);
  const radius=drop.round?1:radialFast(u/length,v/length,w/length,drop.trig||[Math.cos(drop.seed),Math.sin(drop.seed),Math.cos(drop.phase),Math.sin(drop.phase)])/(drop.norm||1);
  return (length-radius)*Math.min(drop.sx,drop.sy,drop.sz);
}
function fillUnion(field,palette,res,center,half,drops,k=.18){
  field.fill(-1000);palette.fill(0);const step=2*half/res;
  for(const original of drops){
    const drop={...original,trig:[Math.cos(original.seed||0),Math.sin(original.seed||0),Math.cos(original.phase||0),Math.sin(original.phase||0)]};
    const bound=Math.max(drop.sx,drop.sy,drop.sz)*1.65+k;
    const start=axis=>Math.max(1,Math.floor((drop[axis]-bound-center[axis]+half)/step));
    const end=axis=>Math.min(res-2,Math.ceil((drop[axis]+bound-center[axis]+half)/step));
    const x0=start('x'),x1=end('x'),y0=start('y'),y1=end('y'),z0=start('z'),z1=end('z');
    for(let z=z0;z<=z1;z++)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const index=(z*res+y)*res+x,b=distance(center.x-half+x*step,center.y-half+y*step,center.z-half+z*step,drop),a=-field[index];
      if(b>a+k)continue;
      const h=Math.max(k-Math.abs(a-b),0)/k,blend=Math.max(0,Math.min(1,.5+.5*(b-a)/k));
      field[index]=-(Math.min(a,b)-h*h*k*.25);
      for(let c=0;c<3;c++)palette[index*3+c]=palette[index*3+c]*blend+drop.color[c]*(1-blend);
    }
  }
}
function supportRadius(drop,nx,ny,nz){if(!drop.sx)return drop.radius;const q=drop.inverse||[0,0,0,1],tx=2*(q[1]*nz-q[2]*ny),ty=2*(q[2]*nx-q[0]*nz),tz=2*(q[0]*ny-q[1]*nx),x=(nx+q[3]*tx+q[1]*tz-q[2]*ty)/drop.sx,y=(ny+q[3]*ty+q[2]*tx-q[0]*tz)/drop.sy,z=(nz+q[3]*tz+q[0]*ty-q[1]*tx)/drop.sz,length=Math.hypot(x,y,z)||1;return (drop.round?1:radial(x/length,y/length,z/length,drop.seed||0,drop.phase||0)/(drop.norm||1))/length;}
function contactScale(radius,speed,squeeze,seed=0){const blend=Math.min(1,Math.max(0,squeeze)/.04),free=1+.08*Math.sin(seed)+Math.min(.24,Math.max(0,speed)*.05),y=free*(1-blend)+(1-Math.max(0,Math.min(.28,squeeze)))*blend,side=1/Math.sqrt(y);return {x:radius*side,y:radius*y,z:radius*side};}
// Surface distance, rather than an inflated bounding sphere, defines contact.
function contactGroups(drops,previous=new Set()){
 const parents=drops.map((_,i)=>i),contacts=new Set();
 const bounds=drops.map(drop=>drop.sx?Math.max(drop.sx,drop.sy,drop.sz)*1.65:drop.radius);
 const root=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
 for(let i=0;i<drops.length;i++)for(let j=i+1;j<drops.length;j++){
  const a=drops[i],b=drops[j],key=JSON.stringify([a.id,b.id].sort());
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  if(dx*dx+dy*dy+dz*dz>(bounds[i]+bounds[j]+.045)**2)continue;
  const d=Math.hypot(dx,dy,dz),nx=d?dx/d:1,ny=d?dy/d:0,nz=d?dz/d:0;
  const threshold=supportRadius(a,nx,ny,nz)+supportRadius(b,-nx,-ny,-nz)+(previous.has(key)?.045:.008);
  if(d<threshold){contacts.add(key);parents[root(j)]=root(i);}
 }
 const groups=new Map();drops.forEach((d,i)=>{const key=root(i);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);});
 return {groups:[...groups.values()],contacts};
}
module.exports={curvePoint,prepareCurve,sampleCurve,neckTarget,relaxNeck,canRebuildSurface,radial,distance,fillUnion,contactGroups,supportRadius,contactScale};
