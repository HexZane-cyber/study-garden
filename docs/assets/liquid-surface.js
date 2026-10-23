(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LiquidSurface=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  // A compact Gaussian density field gives adjacent drops one continuous surface.
  // Work in CSS pixels so zoom and large screens cannot create unbounded grids.
  const LEVEL=Math.exp(-1.5);
  function contours(particles,width,height,step=4){
    if(!particles.length||width<=0||height<=0)return [];
    const cols=Math.ceil(width/step)+1,rows=Math.ceil(height/step)+1;
    const field=new Float32Array(cols*rows);
    for(const p of particles){
      if(!Number.isFinite(p.x+p.y+p.rx+p.ry)||p.rx<=0||p.ry<=0)continue;
      const c=Math.cos(p.angle||0),s=Math.sin(p.angle||0),reach=2.5*Math.max(p.rx,p.ry);
      const left=Math.max(0,Math.floor((p.x-reach)/step)),right=Math.min(cols-1,Math.ceil((p.x+reach)/step));
      const top=Math.max(0,Math.floor((p.y-reach)/step)),bottom=Math.min(rows-1,Math.ceil((p.y+reach)/step));
      for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
        const dx=x*step-p.x,dy=y*step-p.y,u=(dx*c+dy*s)/p.rx,v=(-dx*s+dy*c)/p.ry,q=u*u+v*v;
        if(q<6.25)field[y*cols+x]+=Math.exp(-1.5*q);
      }
    }
    // Close surfaces at the viewport border; offscreen nodes remain harmless.
    for(let x=0;x<cols;x++){field[x]=0;field[(rows-1)*cols+x]=0;}
    for(let y=0;y<rows;y++){field[y*cols]=0;field[y*cols+cols-1]=0;}
    const vertices=new Map(),neighbors=new Map();
    function join(a,b){
      if(!neighbors.has(a.id))neighbors.set(a.id,[]);if(!neighbors.has(b.id))neighbors.set(b.id,[]);
      neighbors.get(a.id).push(b.id);neighbors.get(b.id).push(a.id);
    }
    for(let y=0;y<rows-1;y++)for(let x=0;x<cols-1;x++){
      const values=[field[y*cols+x],field[y*cols+x+1],field[(y+1)*cols+x+1],field[(y+1)*cols+x]];
      const mask=values.reduce((m,v,i)=>m|(v>=LEVEL?1<<i:0),0);if(mask===0||mask===15)continue;
      const edges=[];
      for(let e=0;e<4;e++){
        const next=(e+1)%4;if((values[e]>=LEVEL)===(values[next]>=LEVEL))continue;
        const corners=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]],a=corners[e],b=corners[next];
        const id=e===0?`h${x},${y}`:e===1?`v${x+1},${y}`:e===2?`h${x},${y+1}`:`v${x},${y}`;
        if(!vertices.has(id)){
          const t=(LEVEL-values[e])/(values[next]-values[e]);
          vertices.set(id,{id,x:(a[0]+(b[0]-a[0])*t)*step,y:(a[1]+(b[1]-a[1])*t)*step});
        }
        edges[e]=vertices.get(id);
      }
      const present=edges.filter(Boolean);
      if(present.length===2)join(present[0],present[1]);
      else if(present.length===4){
        // Bilinear saddle decision prevents arbitrary flipping of thin necks.
        const determinant=(values[0]-LEVEL)*(values[2]-LEVEL)-(values[1]-LEVEL)*(values[3]-LEVEL);
        if(determinant>=0){join(edges[0],edges[1]);join(edges[2],edges[3]);}
        else{join(edges[0],edges[3]);join(edges[1],edges[2]);}
      }
    }
    const used=new Set(),loops=[];
    for(const start of neighbors.keys()){
      if(used.has(start))continue;
      const points=[];let current=start,previous=null;
      while(!used.has(current)){
        used.add(current);points.push(vertices.get(current));
        const links=neighbors.get(current),next=links?.find(id=>id!==previous);if(!next)break;
        previous=current;current=next;
      }
      if(current===start&&points.length>=6)loops.push(points);
    }
    return loops;
  }
  return {contours};
});
