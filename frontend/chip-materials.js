import * as THREE from 'three';
// Fine cells and metal levels stay in shared textures, keeping draw calls bounded.
export function chipTextures(layerCount){
 const textures=[];
 function texture(width,height,paint){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;paint(canvas.getContext('2d'),width,height);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;textures.push(map);return map;}
 let seed=173;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function cells(c,x,y,w,h,kind){
  c.fillStyle={die:'#80776a',memory:'#687a79',logic:'#726a7f',io:'#847653'}[kind];c.fillRect(x,y,w,h);
  c.strokeStyle='#b5b1a0';c.lineWidth=.65;c.strokeRect(x+.5,y+.5,w-1,h-1);
  const pitch=kind==='memory'?5:kind==='io'?12:7;
  for(let yy=y+4;yy<y+h-3;yy+=pitch){c.fillStyle=kind==='memory'?'#c8b996':'#a29c89';c.fillRect(x+3,yy,w-6,.8);for(let xx=x+4;xx<x+w-4;xx+=kind==='memory'?14:9){c.fillStyle=random()>.7?'#c1beaa':'#515967';c.fillRect(xx,yy+1,kind==='memory'?10:5,Math.min(pitch-2,y+h-yy-2));}}
  if(kind==='io')for(let xx=x+7;xx<x+w-3;xx+=16){c.fillStyle='#c6b997';c.fillRect(xx,y+h-9,7,5);}
 }
 const blocks=Object.fromEntries(['die','memory','logic','io'].map(kind=>[kind,texture(512,256,(c,w,h)=>{c.fillStyle='#313b48';c.fillRect(0,0,w,h);const cols=kind==='memory'?4:kind==='logic'?3:2,rows=kind==='io'?2:3;for(let r=0;r<rows;r++)for(let col=0;col<cols;col++)cells(c,5+col*(w-10)/cols,5+r*(h-10)/rows,(w-10)/cols-3,(h-10)/rows-3,kind);})]));
 const silicon=texture(1536,896,(c,w,h)=>{
  c.fillStyle='#27333f';c.fillRect(0,0,w,h);
  for(let y=20;y<h-20;y+=5){c.strokeStyle=y%15?'#59656c':'#a49270';c.lineWidth=.7;c.beginPath();c.moveTo(18,y);c.lineTo(w-18,y);c.stroke();}
  for(let x=20;x<w-20;x+=9){c.strokeStyle=x%27?'#465565':'#b1a68b';c.lineWidth=.6;c.beginPath();c.moveTo(x,18);c.lineTo(x,h-18);c.stroke();}
  for(let r=0;r<6;r++)for(let col=0;col<10;col++)cells(c,24+col*148,22+r*140,132,120,['die','memory','logic','io'][(r*7+col)%4]);
  c.strokeStyle='#d6cbb4';c.lineWidth=2;c.strokeRect(7,7,w-14,h-14);c.strokeStyle='#9c998e';c.lineWidth=1;c.strokeRect(13,13,w-26,h-26);
  for(let x=24;x<w-24;x+=18){c.fillStyle='#d4bd88';c.fillRect(x,8,8,5);c.fillRect(x,h-13,8,5);}for(let y=22;y<h-22;y+=18){c.fillStyle='#d4bd88';c.fillRect(8,y,5,8);c.fillRect(w-13,y,5,8);}
 });
 const substrate=texture(1024,640,(c,w,h)=>{c.fillStyle='#12382e';c.fillRect(0,0,w,h);c.strokeStyle='#225247';c.lineWidth=1;for(let i=0;i<38;i++){const x=22+i*26;c.beginPath();c.moveTo(x,24);c.lineTo(x,86);c.lineTo(x+5,91);c.lineTo(x+5,h-91);c.lineTo(x,h-86);c.lineTo(x,h-24);c.stroke();}c.strokeStyle='#c4b07d';c.strokeRect(9,9,w-18,h-18);c.fillStyle='#d6d8ba';c.font='12px monospace';c.fillText('ZHIXIN  /  BGA  /  PIN 1',20,h-17);c.beginPath();c.moveTo(19,20);c.lineTo(32,20);c.lineTo(19,33);c.fill();});
 const lid=texture(1024,640,(c,w,h)=>{c.fillStyle='#c0c4c8';c.fillRect(0,0,w,h);for(let y=0;y<h;y++){const v=150+Math.floor(random()*45);c.strokeStyle='rgba('+v+','+v+','+v+',.12)';c.beginPath();c.moveTo(0,y+.5);c.lineTo(w,y+.5);c.stroke();}c.fillStyle='#596066';c.font='bold 58px monospace';c.fillText('ZHIXIN',110,235);c.font='21px monospace';c.fillText('3D STACKED KNOWLEDGE PROCESSOR',112,285);c.font='18px monospace';c.fillText(String(layerCount).padStart(2,'0')+' DIE / BGA / ENGINEERING VIEW',112,325);c.fillText('ZX-01    26 / 10',112,360);const cell=7;for(let y=0;y<17;y++)for(let x=0;x<17;x++)if(random()>.5)c.fillRect(772+x*cell,410+y*cell,cell-1,cell-1);c.beginPath();c.arc(58,58,9,0,Math.PI*2);c.fill();});
 const shadow=texture(128,128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,10,w/2,h/2,w/2);g.addColorStop(0,'rgba(0,0,0,.65)');g.addColorStop(.6,'rgba(0,0,0,.25)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,w,h);});
 return {silicon,blocks,substrate,lid,shadow,dispose(){textures.forEach(t=>t.dispose());}};
}
