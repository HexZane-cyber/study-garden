'use strict';
function curvePoint(a,b,t,seed=0,time=0,bend=.18){
  const dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-(a.z||0),length=Math.hypot(dx,dy,dz);
  if(length<1e-9)return {x:a.x,y:a.y,z:a.z||0};
  let nx=-dy,ny=dx,nz=0;if(Math.hypot(nx,ny)<length*.01){nx=-dz;ny=0;nz=dx;}
  const n=Math.hypot(nx,ny,nz)||1;nx/=n;ny/=n;nz/=n;
  const ux=dx/length,uy=dy/length,uz=dz/length;
  const bx=uy*nz-uz*ny,by=uz*nx-ux*nz,bz=ux*ny-uy*nx;
  const phase=seed*.71+Math.sin(time*.35+seed)*.18,amplitude=Math.min(length*.65,length*bend);
  const cx=(a.x+b.x)/2+amplitude*(nx*Math.cos(phase)+bx*Math.sin(phase));
  const cy=(a.y+b.y)/2+amplitude*(ny*Math.cos(phase)+by*Math.sin(phase));
  const cz=((a.z||0)+(b.z||0))/2+amplitude*(nz*Math.cos(phase)+bz*Math.sin(phase));
  const u=1-t;return {x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y,z:u*u*(a.z||0)+2*u*t*cz+t*t*(b.z||0)};
}
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
module.exports={curvePoint,radial,distance,fillUnion};
