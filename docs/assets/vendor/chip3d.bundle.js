var Chip3D=(()=>{var Eu=Object.create;var Ir=Object.defineProperty;var Tu=Object.getOwnPropertyDescriptor;var wu=Object.getOwnPropertyNames;var Au=Object.getPrototypeOf,Ru=Object.prototype.hasOwnProperty;var yc=(i,t)=>()=>{try{return t||i((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},Cu=(i,t)=>{for(var e in t)Ir(i,e,{get:t[e],enumerable:!0})},vc=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of wu(t))!Ru.call(i,s)&&s!==e&&Ir(i,s,{get:()=>t[s],enumerable:!(n=Tu(t,s))||n.enumerable});return i};var Mc=(i,t,e)=>(e=i!=null?Eu(Au(i)):{},vc(t||!i||!i.__esModule?Ir(e,"default",{value:i,enumerable:!0}):e,i)),Pu=i=>vc(Ir({},"__esModule",{value:!0}),i);var vu=yc((lv,ko)=>{(function(i,t){let e=t();typeof ko=="object"&&ko.exports?ko.exports=e:i.ChipStack=e})(typeof window<"u"?window:globalThis,function(){"use strict";let t=[["note","\u7B14\u8BB0"],["course","\u8BFE\u7A0B"],["tool","\u5DE5\u5177"],["guide","\u6307\u5357"]];function e(f){let d=[],E=[],R=new Map;for(let[M,b]of t){let S=f.nodes.filter(A=>A.group===M).sort((A,x)=>A.id.localeCompare(x.id));for(let A=0;A<S.length;A+=12){let x={index:d.length,title:b+" \xB7 "+(Math.floor(A/12)+1),group:M,nodes:[]};for(let[T,C]of S.slice(A,A+12).entries()){if(R.has(C.id))continue;let F={...C,layer:x.index,x:(T%4-1.5)*140,z:(Math.floor(T/4)-1)*85};E.push(F),x.nodes.push(F),R.set(F.id,F)}d.push(x)}}return{layers:d,nodes:E,byId:R,width:640,depth:350,capacity:12}}let n="zhixin-chip-layout-v1",s=["die","memory","hex","round"];function r(f){return s.includes(f.shape)?f.shape:{note:"die",course:"memory",tool:"round",guide:"hex"}[f.group]||"die"}function a(f){let d={die:[52,22],memory:[52,15],hex:[44.55,27],round:[26.4,24]}[r(f)],E=Number.isFinite(f.scale)&&f.scale>=.8&&f.scale<=1.15?f.scale:1;return{x:d[0]*E,z:d[1]*E,scale:E}}function o(f,d,E,R,M={}){if(!Number.isFinite(E)||!Number.isFinite(R))return null;let b={...d,...M,x:E,z:R},S=a(b);b.x=Math.max(-290+S.x,Math.min(290-S.x,E)),b.z=Math.max(-150+S.z,Math.min(150-S.z,R));for(let A of f.layers[d.layer].nodes){if(A.id===d.id)continue;let x=a(A);if(Math.abs(b.x-A.x)<S.x+x.x+8&&Math.abs(b.z-A.z)<S.z+x.z+8)return null}return{x:b.x,z:b.z,shape:r(b),scale:S.scale}}function c(f,d){try{let E=f.getItem(n);if(!E)return!0;let R=JSON.parse(E);if(R?.version!==1||!Array.isArray(R.nodes))return!1;let M=new Map(d.nodes.map(S=>[S.id,{...S}]));for(let S of R.nodes.slice(0,1e4)){let A=M.get(S?.id);!A||!s.includes(S.shape)||!Number.isFinite(S.scale)||S.scale<.8||S.scale>1.15||!Number.isFinite(S.x)||!Number.isFinite(S.z)||Object.assign(A,{x:S.x,z:S.z,shape:S.shape,scale:S.scale})}let b={layers:d.layers.map(S=>({...S,nodes:S.nodes.map(A=>M.get(A.id))}))};for(let S of M.values()){let A=o(b,S,S.x,S.z);if(!A||A.x!==S.x||A.z!==S.z)return!1}for(let S of d.nodes)Object.assign(S,M.get(S.id));return!0}catch{return!1}}function l(f,d){try{return f.setItem(n,JSON.stringify({version:1,nodes:d.nodes.map(E=>({id:E.id,x:E.x,z:E.z,shape:r(E),scale:a(E).scale}))})),!0}catch{return!1}}function u(f,d,E,R,M){let b=a(f),S=a(d),A=(M?M[f.layer]:f.layer*R)+6,x=(M?M[d.layer]:d.layer*R)+6,T=f.z+b.z+14,C=d.z+S.z+14,F=294+E%5*5,O=[{x:f.x,y:A,z:f.z+b.z},{x:f.x,y:A,z:T},{x:F,y:A,z:T}];if(f.layer!==d.layer){let V=332+E%7*7;O.push({x:F,y:A,z:195},{x:V,y:A,z:195},{x:V,y:x,z:195},{x:F,y:x,z:195})}return O.push({x:F,y:x,z:C},{x:d.x,y:x,z:C},{x:d.x,y:x,z:d.z+S.z}),O.filter((V,N)=>!N||V.x!==O[N-1].x||V.y!==O[N-1].y||V.z!==O[N-1].z)}function m(f){let d=[];for(let E=1;E<f.length;E++)d.push(f[E-1].x,f[E-1].y,f[E-1].z,f[E].x,f[E].y,f[E].z);return d}function h(f,d){let E=0,R=[0];for(let T=1;T<f.length;T++)E+=Math.hypot(f[T].x-f[T-1].x,f[T].y-f[T-1].y,f[T].z-f[T-1].z),R.push(E);let M=Math.max(0,Math.min(1,d))*E,b=1;for(;b<f.length-1&&R[b]<M;)b++;let S=f[b-1],A=f[b],x=(M-R[b-1])/(R[b]-R[b-1]||1);return{x:S.x+(A.x-S.x)*x,y:S.y+(A.y-S.y)*x,z:S.z+(A.z-S.z)*x}}function p(f,d,E,R=!1){return{from:[...f],to:f.map((M,b)=>b*d),start:E,duration:R?0:1040,stagger:R?0:Math.min(260,Math.max(0,f.length-1)*65),opening:(f.length-1)*d>=(f.at(-1)||0)}}function _(f){return f=Math.max(0,Math.min(1,f)),f*f*f*(f*(f*6-15)+10)}function v(f,d,E){let R=Math.max(0,d-f.start),M=f.from.length;for(let b=0;b<M;b++){let S=M>1?(f.opening?M-1-b:b)/(M-1):0,A=f.duration?_((R-S*f.stagger)/f.duration):1;E[b]=f.from[b]+(f.to[b]-f.from[b])*A}return R>=f.duration+f.stagger}return{layout:e,route:u,segments:m,sample:h,capacity:12,transition:p,advance:v,ease:_,KEY:n,shapes:s,shape:r,footprint:a,placement:o,load:c,save:l}})});var Mu=yc((cv,Vo)=>{(function(i,t){let e=t();typeof Vo=="object"&&Vo.exports?Vo.exports=e:i.GraphInteraction=e})(typeof window<"u"?window:globalThis,function(){"use strict";function i(){let a=null;return{finish({id:o,x:c,y:l,time:u=Date.now(),moved:m=!1,cancelled:h=!1}){if(h||m||!o)return a=null,h||m?"none":"select";let p=a&&a.id===o&&u>=a.time&&u-a.time<=450&&Math.hypot(c-a.x,l-a.y)<=18;return a=p?null:{id:o,x:c,y:l,time:u},p?"open":"select"},reset(){a=null}}}let t=()=>({pressure:0,velocity:0,pulse:0});function e(a,o,c,l=!1){if(l)return a.pressure=0,a.velocity=0,a.pulse=0,a;c=Math.max(0,Math.min(.035,Number.isFinite(c)?c:0));let u=26;return a.velocity+=(u*u*((o?1:0)-a.pressure)-2*.8*u*a.velocity)*c,a.pressure=Math.max(0,Math.min(1.1,a.pressure+a.velocity*c)),!a.pressure&&a.velocity<0&&(a.velocity=0),a.pulse=Math.max(0,a.pulse-c*2.5),a}function n(a,o,c,l){let u=l.x-c.x,m=l.y-c.y,h=u*u+m*m,p=h?Math.max(0,Math.min(1,((a-c.x)*u+(o-c.y)*m)/h)):0;return(a-c.x-p*u)**2+(o-c.y-p*m)**2}function s(a,o,c,l=8){let u=null,m=l*l;for(let h of a)for(let p=1;p<h.points.length;p++){let _=h.points[p-1],v=h.points[p];if(!_||!v)continue;let f=n(o,c,_,v);f<m&&(m=f,u=h.id)}return u}function r(a,o,c,l=8){let u=l*l,m=[];return a.forEach((h,p)=>{let _=h.bounds;if(_&&(o<_.left-l||o>_.right+l||c<_.top-l||c>_.bottom+l))return;let v=1/0;for(let f=1;f<h.points.length;f++){let d=h.points[f-1],E=h.points[f];d&&E&&(v=Math.min(v,n(o,c,d,E)))}v<u&&m.push({id:h.id,distance:Math.sqrt(v),order:p})}),m.sort((h,p)=>h.distance-p.distance||h.order-p.order)}return{createTapTracker:i,feedback:t,step:e,segmentDistanceSquared:n,hitEdge:s,edgeCandidates:r}})});var D0={};Cu(D0,{create:()=>L0});var Mi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Si={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},th=0,El=1,eh=2;var mr=1,ka=2,bs=3,bi=0,Ge=1,Wn=2,Xn=0,Es=1,Tl=2,wl=3,Al=4,nh=5;var ki=100,ih=101,sh=102,rh=103,ah=104,oh=200,lh=201,ch=202,hh=203,Rl=204,Cl=205,uh=206,dh=207,fh=208,ph=209,mh=210,gh=211,_h=212,xh=213,yh=214,oa=0,la=1,ca=2,hs=3,ha=4,ua=5,da=6,fa=7,Va=0,vh=1,Mh=2,Cn=0,Pl=1,Il=2,Ll=3,gr=4,Dl=5,Nl=6,Ul=7;var Fl=300,Ei=301,Vi=302,Ga=303,Ha=304,_r=306,pa=1e3,On=1001,ma=1002,Be=1003,Sh=1004;var xr=1005;var ke=1006,Wa=1007;var Ti=1008;var sn=1009,Ol=1010,Bl=1011,Ts=1012,Xa=1013,Pn=1014,_n=1015,In=1016,qa=1017,Ya=1018,ws=1020,zl=35902,kl=35899,Vl=1021,Gl=1022,xn=1023,zn=1026,wi=1027,Za=1028,Ja=1029,Ai=1030,Ka=1031;var $a=1033,yr=33776,vr=33777,Mr=33778,Sr=33779,ja=35840,Qa=35841,to=35842,eo=35843,no=36196,io=37492,so=37496,ro=37488,ao=37489,br=37490,oo=37491,lo=37808,co=37809,ho=37810,uo=37811,fo=37812,po=37813,mo=37814,go=37815,_o=37816,xo=37817,yo=37818,vo=37819,Mo=37820,So=37821,bo=36492,Eo=36494,To=36495,wo=36283,Ao=36284,Er=36285,Ro=36286;var qs=2300,ga=2301,ra=2302,pl=2303,ml=2400,gl=2401,_l=2402;var bh=3200;var Tr=0,Eh=1,ai="",je="srgb",Ys="srgb-linear",Zs="linear",he="srgb";var aa=7680;var Th=519,wh=512,Ah=513,Rh=514,Co=515,Ch=516,Ph=517,Po=518,Ih=519,Lh=35044;var Hl="300 es",wn=2e3,us=2001;function Iu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Lu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Js(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dh(){let i=Js("canvas");return i.style.display="block",i}var Sc={},ds=null;function Wl(...i){let t="THREE."+i.shift();ds?ds("log",t,...i):console.log(t,...i)}function Nh(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ut(...i){i=Nh(i);let t="THREE."+i.shift();if(ds)ds("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ot(...i){i=Nh(i);let t="THREE."+i.shift();if(ds)ds("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Fi(...i){let t=i.join(" ");t in Sc||(Sc[t]=!0,Ut(...i))}function Uh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Fh={[oa]:la,[ca]:da,[ha]:fa,[hs]:ua,[la]:oa,[da]:ca,[fa]:ha,[ua]:hs},An=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bc=1234567,ls=Math.PI/180,fs=180/Math.PI;function As(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]).toLowerCase()}function jt(i,t,e){return Math.max(t,Math.min(e,i))}function Xl(i,t){return(i%t+t)%t}function Du(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Nu(i,t,e){return i!==t?(e-i)/(t-i):0}function Xs(i,t,e){return(1-e)*i+e*t}function Uu(i,t,e,n){return Xs(i,t,1-Math.exp(-e*n))}function Fu(i,t=1){return t-Math.abs(Xl(i,t*2)-t)}function Ou(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Bu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function zu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function ku(i,t){return i+Math.random()*(t-i)}function Vu(i){return i*(.5-Math.random())}function Gu(i){i!==void 0&&(bc=i);let t=bc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Hu(i){return i*ls}function Wu(i){return i*fs}function Xu(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function qu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Yu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Zu(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),u=a((t+n)/2),m=r((t-n)/2),h=a((t-n)/2),p=r((n-t)/2),_=a((n-t)/2);switch(s){case"XYX":i.set(o*u,c*m,c*h,o*l);break;case"YZY":i.set(c*h,o*u,c*m,o*l);break;case"ZXZ":i.set(c*m,c*h,o*u,o*l);break;case"XZX":i.set(o*u,c*_,c*p,o*l);break;case"YXY":i.set(c*p,o*u,c*_,o*l);break;case"ZYZ":i.set(c*_,c*p,o*u,o*l);break;default:Ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function os(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function $e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Rs={DEG2RAD:ls,RAD2DEG:fs,generateUUID:As,clamp:jt,euclideanModulo:Xl,mapLinear:Du,inverseLerp:Nu,lerp:Xs,damp:Uu,pingpong:Fu,smoothstep:Ou,smootherstep:Bu,randInt:zu,randFloat:ku,randFloatSpread:Vu,seededRandom:Gu,degToRad:Hu,radToDeg:Wu,isPowerOfTwo:Xu,ceilPowerOfTwo:qu,floorPowerOfTwo:Yu,setQuaternionFromProperEuler:Zu,normalize:$e,denormalize:os},Kl=class Kl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Kl.prototype.isVector2=!0;var Ft=Kl,Ve=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],u=n[s+2],m=n[s+3],h=r[a+0],p=r[a+1],_=r[a+2],v=r[a+3];if(m!==v||c!==h||l!==p||u!==_){let f=c*h+l*p+u*_+m*v;f<0&&(h=-h,p=-p,_=-_,v=-v,f=-f);let d=1-o;if(f<.9995){let E=Math.acos(f),R=Math.sin(E);d=Math.sin(d*E)/R,o=Math.sin(o*E)/R,c=c*d+h*o,l=l*d+p*o,u=u*d+_*o,m=m*d+v*o}else{c=c*d+h*o,l=l*d+p*o,u=u*d+_*o,m=m*d+v*o;let E=1/Math.sqrt(c*c+l*l+u*u+m*m);c*=E,l*=E,u*=E,m*=E}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=m}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],u=n[s+3],m=r[a],h=r[a+1],p=r[a+2],_=r[a+3];return t[e]=o*_+u*m+c*p-l*h,t[e+1]=c*_+u*h+l*m-o*p,t[e+2]=l*_+u*p+o*h-c*m,t[e+3]=u*_-o*m-c*h-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(s/2),m=o(r/2),h=c(n/2),p=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=h*u*m+l*p*_,this._y=l*p*m-h*u*_,this._z=l*u*_+h*p*m,this._w=l*u*m-h*p*_;break;case"YXZ":this._x=h*u*m+l*p*_,this._y=l*p*m-h*u*_,this._z=l*u*_-h*p*m,this._w=l*u*m+h*p*_;break;case"ZXY":this._x=h*u*m-l*p*_,this._y=l*p*m+h*u*_,this._z=l*u*_+h*p*m,this._w=l*u*m-h*p*_;break;case"ZYX":this._x=h*u*m-l*p*_,this._y=l*p*m+h*u*_,this._z=l*u*_-h*p*m,this._w=l*u*m+h*p*_;break;case"YZX":this._x=h*u*m+l*p*_,this._y=l*p*m+h*u*_,this._z=l*u*_-h*p*m,this._w=l*u*m-h*p*_;break;case"XZY":this._x=h*u*m-l*p*_,this._y=l*p*m-h*u*_,this._z=l*u*_+h*p*m,this._w=l*u*m+h*p*_;break;default:Ut("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],m=e[10],h=n+o+m;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>m){let p=2*Math.sqrt(1+n-o-m);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>m){let p=2*Math.sqrt(1+o-n-m);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+m-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-n*l,this._z=r*u+a*l+n*c-s*o,this._w=a*u-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},$l=class $l{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ec.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ec.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),u=2*(o*e-r*s),m=2*(r*n-a*e);return this.x=e+c*l+a*m-o*u,this.y=n+c*u+o*l-r*m,this.z=s+c*m+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xo.copy(this).projectOnVector(t),this.sub(Xo)}reflect(t){return this.sub(Xo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};$l.prototype.isVector3=!0;var U=$l,Xo=new U,Ec=new Ve,jl=class jl{constructor(t,e,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],m=n[7],h=n[2],p=n[5],_=n[8],v=s[0],f=s[3],d=s[6],E=s[1],R=s[4],M=s[7],b=s[2],S=s[5],A=s[8];return r[0]=a*v+o*E+c*b,r[3]=a*f+o*R+c*S,r[6]=a*d+o*M+c*A,r[1]=l*v+u*E+m*b,r[4]=l*f+u*R+m*S,r[7]=l*d+u*M+m*A,r[2]=h*v+p*E+_*b,r[5]=h*f+p*R+_*S,r[8]=h*d+p*M+_*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-n*r*u+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],m=u*a-o*l,h=o*c-u*r,p=l*r-a*c,_=e*m+n*h+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/_;return t[0]=m*v,t[1]=(s*l-u*n)*v,t[2]=(o*n-s*a)*v,t[3]=h*v,t[4]=(u*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=p*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return Fi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(qo.makeScale(t,e)),this}rotate(t){return Fi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(qo.makeRotation(-t)),this}translate(t,e){return Fi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(qo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};jl.prototype.isMatrix3=!0;var Vt=jl,qo=new Vt,Tc=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wc=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ju(){let i={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===he&&(s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(s.r=cs(s.r),s.g=cs(s.g),s.b=cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ai?Zs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Fi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Fi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ys]:{primaries:t,whitePoint:n,transfer:Zs,toXYZ:Tc,fromXYZ:wc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Tc,fromXYZ:wc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:je}}}),i}var ee=Ju();function ii(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Yi,_a=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Yi===void 0&&(Yi=Js("canvas")),Yi.width=t.width,Yi.height=t.height;let s=Yi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Yi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Js("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ii(e[n]/255)*255):e[n]=ii(e[n]);return{data:e,width:t.width,height:t.height}}else return Ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ku=0,ps=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=As(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Yo(s[a].image)):r.push(Yo(s[a]))}else r=Yo(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Yo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_a.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ut("Texture: Unable to serialize Texture."),{})}var $u=0,Zo=new U,tn=class i extends An{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=On,s=On,r=ke,a=Ti,o=xn,c=sn,l=i.DEFAULT_ANISOTROPY,u=ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=As(),this.name="",this.source=new ps(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ft(0,0),this.repeat=new Ft(1,1),this.center=new Ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Zo).x}get height(){return this.source.getSize(Zo).y}get depth(){return this.source.getSize(Zo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ut(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case pa:t.x=t.x-Math.floor(t.x);break;case On:t.x=t.x<0?0:1;break;case ma:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case pa:t.y=t.y-Math.floor(t.y);break;case On:t.y=t.y<0?0:1;break;case ma:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Fl;tn.DEFAULT_ANISOTROPY=1;var Ql=class Ql{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],u=c[4],m=c[8],h=c[1],p=c[5],_=c[9],v=c[2],f=c[6],d=c[10];if(Math.abs(u-h)<.01&&Math.abs(m-v)<.01&&Math.abs(_-f)<.01){if(Math.abs(u+h)<.1&&Math.abs(m+v)<.1&&Math.abs(_+f)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let R=(l+1)/2,M=(p+1)/2,b=(d+1)/2,S=(u+h)/4,A=(m+v)/4,x=(_+f)/4;return R>M&&R>b?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=S/n,r=A/n):M>b?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=S/s,r=x/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=A/r,s=x/r),this.set(n,s,r,e),this}let E=Math.sqrt((f-_)*(f-_)+(m-v)*(m-v)+(h-u)*(h-u));return Math.abs(E)<.001&&(E=1),this.x=(f-_)/E,this.y=(m-v)/E,this.z=(h-u)/E,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ql.prototype.isVector4=!0;var Me=Ql,xa=class extends An{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ke,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new tn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:ke,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ps(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},nn=class extends xa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ks=class extends tn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ya=class extends tn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var za=class za{constructor(t,e,n,s,r,a,o,c,l,u,m,h,p,_,v,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,u,m,h,p,_,v,f)}set(t,e,n,s,r,a,o,c,l,u,m,h,p,_,v,f){let d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=m,d[14]=h,d[3]=p,d[7]=_,d[11]=v,d[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new za().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Zi.setFromMatrixColumn(t,0).length(),r=1/Zi.setFromMatrixColumn(t,1).length(),a=1/Zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),m=Math.sin(r);if(t.order==="XYZ"){let h=a*u,p=a*m,_=o*u,v=o*m;e[0]=c*u,e[4]=-c*m,e[8]=l,e[1]=p+_*l,e[5]=h-v*l,e[9]=-o*c,e[2]=v-h*l,e[6]=_+p*l,e[10]=a*c}else if(t.order==="YXZ"){let h=c*u,p=c*m,_=l*u,v=l*m;e[0]=h+v*o,e[4]=_*o-p,e[8]=a*l,e[1]=a*m,e[5]=a*u,e[9]=-o,e[2]=p*o-_,e[6]=v+h*o,e[10]=a*c}else if(t.order==="ZXY"){let h=c*u,p=c*m,_=l*u,v=l*m;e[0]=h-v*o,e[4]=-a*m,e[8]=_+p*o,e[1]=p+_*o,e[5]=a*u,e[9]=v-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let h=a*u,p=a*m,_=o*u,v=o*m;e[0]=c*u,e[4]=_*l-p,e[8]=h*l+v,e[1]=c*m,e[5]=v*l+h,e[9]=p*l-_,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let h=a*c,p=a*l,_=o*c,v=o*l;e[0]=c*u,e[4]=v-h*m,e[8]=_*m+p,e[1]=m,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=p*m+_,e[10]=h-v*m}else if(t.order==="XZY"){let h=a*c,p=a*l,_=o*c,v=o*l;e[0]=c*u,e[4]=-m,e[8]=l*u,e[1]=h*m+v,e[5]=a*u,e[9]=p*m-_,e[2]=_*m-p,e[6]=o*u,e[10]=v*m+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ju,t,Qu)}lookAt(t,e,n){let s=this.elements;return ln.subVectors(t,e),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),hi.crossVectors(n,ln),hi.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),hi.crossVectors(n,ln)),hi.normalize(),Lr.crossVectors(ln,hi),s[0]=hi.x,s[4]=Lr.x,s[8]=ln.x,s[1]=hi.y,s[5]=Lr.y,s[9]=ln.y,s[2]=hi.z,s[6]=Lr.z,s[10]=ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],m=n[5],h=n[9],p=n[13],_=n[2],v=n[6],f=n[10],d=n[14],E=n[3],R=n[7],M=n[11],b=n[15],S=s[0],A=s[4],x=s[8],T=s[12],C=s[1],F=s[5],O=s[9],V=s[13],N=s[2],G=s[6],q=s[10],J=s[14],st=s[3],Y=s[7],nt=s[11],it=s[15];return r[0]=a*S+o*C+c*N+l*st,r[4]=a*A+o*F+c*G+l*Y,r[8]=a*x+o*O+c*q+l*nt,r[12]=a*T+o*V+c*J+l*it,r[1]=u*S+m*C+h*N+p*st,r[5]=u*A+m*F+h*G+p*Y,r[9]=u*x+m*O+h*q+p*nt,r[13]=u*T+m*V+h*J+p*it,r[2]=_*S+v*C+f*N+d*st,r[6]=_*A+v*F+f*G+d*Y,r[10]=_*x+v*O+f*q+d*nt,r[14]=_*T+v*V+f*J+d*it,r[3]=E*S+R*C+M*N+b*st,r[7]=E*A+R*F+M*G+b*Y,r[11]=E*x+R*O+M*q+b*nt,r[15]=E*T+R*V+M*J+b*it,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],m=t[6],h=t[10],p=t[14],_=t[3],v=t[7],f=t[11],d=t[15],E=c*p-l*h,R=o*p-l*m,M=o*h-c*m,b=a*p-l*u,S=a*h-c*u,A=a*m-o*u;return e*(v*E-f*R+d*M)-n*(_*E-f*b+d*S)+s*(_*R-v*b+d*A)-r*(_*M-v*S+f*A)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],u=t[10];return e*(a*u-o*l)-n*(r*u-o*c)+s*(r*l-a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],m=t[9],h=t[10],p=t[11],_=t[12],v=t[13],f=t[14],d=t[15],E=e*o-n*a,R=e*c-s*a,M=e*l-r*a,b=n*c-s*o,S=n*l-r*o,A=s*l-r*c,x=u*v-m*_,T=u*f-h*_,C=u*d-p*_,F=m*f-h*v,O=m*d-p*v,V=h*d-p*f,N=E*V-R*O+M*F+b*C-S*T+A*x;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/N;return t[0]=(o*V-c*O+l*F)*G,t[1]=(s*O-n*V-r*F)*G,t[2]=(v*A-f*S+d*b)*G,t[3]=(h*S-m*A-p*b)*G,t[4]=(c*C-a*V-l*T)*G,t[5]=(e*V-s*C+r*T)*G,t[6]=(f*M-_*A-d*R)*G,t[7]=(u*A-h*M+p*R)*G,t[8]=(a*O-o*C+l*x)*G,t[9]=(n*C-e*O-r*x)*G,t[10]=(_*S-v*M+d*E)*G,t[11]=(m*M-u*S-p*E)*G,t[12]=(o*T-a*F-c*x)*G,t[13]=(e*F-n*T+s*x)*G,t[14]=(v*R-_*b-f*E)*G,t[15]=(u*b-m*R+h*E)*G,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+n,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,u=a+a,m=o+o,h=r*l,p=r*u,_=r*m,v=a*u,f=a*m,d=o*m,E=c*l,R=c*u,M=c*m,b=n.x,S=n.y,A=n.z;return s[0]=(1-(v+d))*b,s[1]=(p+M)*b,s[2]=(_-R)*b,s[3]=0,s[4]=(p-M)*S,s[5]=(1-(h+d))*S,s[6]=(f+E)*S,s[7]=0,s[8]=(_+R)*A,s[9]=(f-E)*A,s[10]=(1-(h+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Zi.set(s[0],s[1],s[2]).length(),o=Zi.set(s[4],s[5],s[6]).length(),c=Zi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),bn.copy(this);let l=1/a,u=1/o,m=1/c;return bn.elements[0]*=l,bn.elements[1]*=l,bn.elements[2]*=l,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=m,bn.elements[9]*=m,bn.elements[10]*=m,e.setFromRotationMatrix(bn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,s,r,a,o=wn,c=!1){let l=this.elements,u=2*r/(e-t),m=2*r/(n-s),h=(e+t)/(e-t),p=(n+s)/(n-s),_,v;if(c)_=r/(a-r),v=a*r/(a-r);else if(o===wn)_=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===us)_=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=m,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=wn,c=!1){let l=this.elements,u=2/(e-t),m=2/(n-s),h=-(e+t)/(e-t),p=-(n+s)/(n-s),_,v;if(c)_=1/(a-r),v=a/(a-r);else if(o===wn)_=-2/(a-r),v=-(a+r)/(a-r);else if(o===us)_=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=m,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};za.prototype.isMatrix4=!0;var ne=za,Zi=new U,bn=new ne,ju=new U(0,0,0),Qu=new U(1,1,1),hi=new U,Lr=new U,ln=new U,Ac=new ne,Rc=new Ve,kn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],m=s[2],h=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-m,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-jt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(jt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ac.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ac,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Rc.setFromEuler(this),this.setFromQuaternion(Rc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};kn.DEFAULT_ORDER="XYZ";var ms=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},td=0,Cc=new U,Ji=new Ve,$n=new ne,Dr=new U,Bs=new U,ed=new U,nd=new Ve,Pc=new U(1,0,0),Ic=new U(0,1,0),Lc=new U(0,0,1),Dc={type:"added"},id={type:"removed"},Ki={type:"childadded",child:null},Jo={type:"childremoved",child:null},Ce=class i extends An{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=As(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new U,e=new kn,n=new Ve,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ne},normalMatrix:{value:new Vt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.multiply(Ji),this}rotateOnWorldAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.premultiply(Ji),this}rotateX(t){return this.rotateOnAxis(Pc,t)}rotateY(t){return this.rotateOnAxis(Ic,t)}rotateZ(t){return this.rotateOnAxis(Lc,t)}translateOnAxis(t,e){return Cc.copy(t).applyQuaternion(this.quaternion),this.position.add(Cc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Pc,t)}translateY(t){return this.translateOnAxis(Ic,t)}translateZ(t){return this.translateOnAxis(Lc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4($n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Dr.copy(t):Dr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$n.lookAt(Bs,Dr,this.up):$n.lookAt(Dr,Bs,this.up),this.quaternion.setFromRotationMatrix($n),s&&($n.extractRotation(s.matrixWorld),Ji.setFromRotationMatrix($n),this.quaternion.premultiply(Ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ot("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dc),Ki.child=t,this.dispatchEvent(Ki),Ki.child=null):Ot("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(id),Jo.child=t,this.dispatchEvent(Jo),Jo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),$n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),$n.multiply(t.parent.matrixWorld)),t.applyMatrix4($n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dc),Ki.child=t,this.dispatchEvent(Ki),Ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,t,ed),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,nd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let m=c[l];r(t.shapes,m)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),m=a(t.shapes),h=a(t.skeletons),p=a(t.animations),_=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),m.length>0&&(n.shapes=m),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ce.DEFAULT_UP=new U(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=class extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}},sd={type:"move"},gs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let v of t.hand.values()){let f=e.getJointPose(v,n),d=this._getHandJoint(l,v);f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=f.radius),d.visible=f!==null}let u=l.joints["index-finger-tip"],m=l.joints["thumb-tip"],h=u.position.distanceTo(m.position),p=.02,_=.005;l.inputState.pinching&&h>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sd)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Bn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Oh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function Ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Gt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ee.workingColorSpace){if(t=Xl(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ko(a,r,t+1/3),this.g=Ko(a,r,t),this.b=Ko(a,r,t-1/3)}return ee.colorSpaceToWorking(this,s),this}setStyle(t,e=je){function n(r){r!==void 0&&parseFloat(r)<1&&Ut("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ut("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){let n=Oh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ii(t.r),this.g=ii(t.g),this.b=ii(t.b),this}copyLinearToSRGB(t){return this.r=cs(t.r),this.g=cs(t.g),this.b=cs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return ee.workingToColorSpace(Xe.copy(this),t),Math.round(jt(Xe.r*255,0,255))*65536+Math.round(jt(Xe.g*255,0,255))*256+Math.round(jt(Xe.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.workingToColorSpace(Xe.copy(this),e);let n=Xe.r,s=Xe.g,r=Xe.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let m=a-o;switch(l=u<=.5?m/(a+o):m/(2-a-o),a){case n:c=(s-r)/m+(s<r?6:0);break;case s:c=(r-n)/m+2;break;case r:c=(n-s)/m+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ee.workingColorSpace){return ee.workingToColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=je){ee.workingToColorSpace(Xe.copy(this),t);let e=Xe.r,n=Xe.g,s=Xe.b;return t!==je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ui),this.setHSL(ui.h+t,ui.s+e,ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ui),t.getHSL(Nr);let n=Xs(ui.h,Nr.h,e),s=Xs(ui.s,Nr.s,e),r=Xs(ui.l,Nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Xe=new Gt;Gt.NAMES=Oh;var Oi=class extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},En=new U,jn=new U,$o=new U,Qn=new U,$i=new U,ji=new U,Nc=new U,jo=new U,Qo=new U,tl=new U,el=new Me,nl=new Me,il=new Me,ni=class i{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),En.subVectors(t,e),s.cross(En);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){En.subVectors(s,e),jn.subVectors(n,e),$o.subVectors(t,e);let a=En.dot(En),o=En.dot(jn),c=En.dot($o),l=jn.dot(jn),u=jn.dot($o),m=a*l-o*o;if(m===0)return r.set(0,0,0),null;let h=1/m,p=(l*c-o*u)*h,_=(a*u-o*c)*h;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Qn)===null?!1:Qn.x>=0&&Qn.y>=0&&Qn.x+Qn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Qn.x),c.addScaledVector(a,Qn.y),c.addScaledVector(o,Qn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return el.setScalar(0),nl.setScalar(0),il.setScalar(0),el.fromBufferAttribute(t,e),nl.fromBufferAttribute(t,n),il.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(el,r.x),a.addScaledVector(nl,r.y),a.addScaledVector(il,r.z),a}static isFrontFacing(t,e,n,s){return En.subVectors(n,e),jn.subVectors(t,e),En.cross(jn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),En.cross(jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;$i.subVectors(s,n),ji.subVectors(r,n),jo.subVectors(t,n);let c=$i.dot(jo),l=ji.dot(jo);if(c<=0&&l<=0)return e.copy(n);Qo.subVectors(t,s);let u=$i.dot(Qo),m=ji.dot(Qo);if(u>=0&&m<=u)return e.copy(s);let h=c*m-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector($i,a);tl.subVectors(t,r);let p=$i.dot(tl),_=ji.dot(tl);if(_>=0&&p<=_)return e.copy(r);let v=p*l-c*_;if(v<=0&&l>=0&&_<=0)return o=l/(l-_),e.copy(n).addScaledVector(ji,o);let f=u*_-p*m;if(f<=0&&m-u>=0&&p-_>=0)return Nc.subVectors(r,s),o=(m-u)/(m-u+(p-_)),e.copy(s).addScaledVector(Nc,o);let d=1/(f+v+h);return a=v*d,o=h*d,e.copy(n).addScaledVector($i,a).addScaledVector(ji,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Vn=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Tn):Tn.fromBufferAttribute(r,a),Tn.applyMatrix4(t.matrixWorld),this.expandByPoint(Tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ur.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ur.copy(n.boundingBox)),Ur.applyMatrix4(t.matrixWorld),this.union(Ur)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Tn),Tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(zs),Fr.subVectors(this.max,zs),Qi.subVectors(t.a,zs),ts.subVectors(t.b,zs),es.subVectors(t.c,zs),di.subVectors(ts,Qi),fi.subVectors(es,ts),Li.subVectors(Qi,es);let e=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Li.z,Li.y,di.z,0,-di.x,fi.z,0,-fi.x,Li.z,0,-Li.x,-di.y,di.x,0,-fi.y,fi.x,0,-Li.y,Li.x,0];return!sl(e,Qi,ts,es,Fr)||(e=[1,0,0,0,1,0,0,0,1],!sl(e,Qi,ts,es,Fr))?!1:(Or.crossVectors(di,fi),e=[Or.x,Or.y,Or.z],sl(e,Qi,ts,es,Fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ti),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ti=[new U,new U,new U,new U,new U,new U,new U,new U],Tn=new U,Ur=new Vn,Qi=new U,ts=new U,es=new U,di=new U,fi=new U,Li=new U,zs=new U,Fr=new U,Or=new U,Di=new U;function sl(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Di.fromArray(i,r);let o=s.x*Math.abs(Di.x)+s.y*Math.abs(Di.y)+s.z*Math.abs(Di.z),c=t.dot(Di),l=e.dot(Di),u=n.dot(Di);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var Re=new U,Br=new Ft,rd=0,qe=class extends An{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Lh,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Br.fromBufferAttribute(this,e),Br.applyMatrix3(t),this.setXY(e,Br.x,Br.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=os(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=$e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=os(e,this.array)),e}setX(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=os(e,this.array)),e}setY(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=os(e,this.array)),e}setZ(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=os(e,this.array)),e}setW(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),n=$e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),n=$e(n,this.array),s=$e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),n=$e(n,this.array),s=$e(s,this.array),r=$e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var $s=class extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var js=class extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var we=class extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}},ad=new Vn,ks=new U,rl=new U,Gn=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):ad.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ks.subVectors(t,this.center);let e=ks.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ks,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ks.copy(t.center).add(rl)),this.expandByPoint(ks.copy(t.center).sub(rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},od=0,mn=new ne,al=new Ce,ns=new U,cn=new Vn,Vs=new Vn,Oe=new U,Ae=class i extends An{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=As(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Iu(t)?js:$s)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return mn.makeRotationFromQuaternion(t),this.applyMatrix4(mn),this}rotateX(t){return mn.makeRotationX(t),this.applyMatrix4(mn),this}rotateY(t){return mn.makeRotationY(t),this.applyMatrix4(mn),this}rotateZ(t){return mn.makeRotationZ(t),this.applyMatrix4(mn),this}translate(t,e,n){return mn.makeTranslation(t,e,n),this.applyMatrix4(mn),this}scale(t,e,n){return mn.makeScale(t,e,n),this.applyMatrix4(mn),this}lookAt(t){return al.lookAt(t),al.updateMatrix(),this.applyMatrix4(al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new we(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];cn.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let n=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Vs.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(cn.min,Vs.min),cn.expandByPoint(Oe),Oe.addVectors(cn.max,Vs.max),cn.expandByPoint(Oe)):(cn.expandByPoint(Vs.min),cn.expandByPoint(Vs.max))}cn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Oe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Oe));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Oe.fromBufferAttribute(o,l),c&&(ns.fromBufferAttribute(t,l),Oe.add(ns)),s=Math.max(s,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new qe(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new U,c[x]=new U;let l=new U,u=new U,m=new U,h=new Ft,p=new Ft,_=new Ft,v=new U,f=new U;function d(x,T,C){l.fromBufferAttribute(n,x),u.fromBufferAttribute(n,T),m.fromBufferAttribute(n,C),h.fromBufferAttribute(r,x),p.fromBufferAttribute(r,T),_.fromBufferAttribute(r,C),u.sub(l),m.sub(l),p.sub(h),_.sub(h);let F=1/(p.x*_.y-_.x*p.y);isFinite(F)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(m,-p.y).multiplyScalar(F),f.copy(m).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(F),o[x].add(v),o[T].add(v),o[C].add(v),c[x].add(f),c[T].add(f),c[C].add(f))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let x=0,T=E.length;x<T;++x){let C=E[x],F=C.start,O=C.count;for(let V=F,N=F+O;V<N;V+=3)d(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let R=new U,M=new U,b=new U,S=new U;function A(x){b.fromBufferAttribute(s,x),S.copy(b);let T=o[x];R.copy(T),R.sub(b.multiplyScalar(b.dot(T))).normalize(),M.crossVectors(S,T);let F=M.dot(c[x])<0?-1:1;a.setXYZW(x,R.x,R.y,R.z,F)}for(let x=0,T=E.length;x<T;++x){let C=E[x],F=C.start,O=C.count;for(let V=F,N=F+O;V<N;V+=3)A(t.getX(V+0)),A(t.getX(V+1)),A(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);let s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,u=new U,m=new U;if(t)for(let h=0,p=t.count;h<p;h+=3){let _=t.getX(h+0),v=t.getX(h+1),f=t.getX(h+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,f),u.subVectors(a,r),m.subVectors(s,r),u.cross(m),o.fromBufferAttribute(n,_),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,f),o.add(u),c.add(u),l.add(u),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(f,l.x,l.y,l.z)}else for(let h=0,p=e.count;h<p;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),m.subVectors(s,r),u.cross(m),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,c){let l=o.array,u=o.itemSize,m=o.normalized,h=new l.constructor(c.length*u),p=0,_=0;for(let v=0,f=c.length;v<f;v++){o.isInterleavedBufferAttribute?p=c[v]*o.data.stride+o.offset:p=c[v]*u;for(let d=0;d<u;d++)h[_++]=l[p++]}return new qe(h,u,m)}if(this.index===null)return Ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,m=l.length;u<m;u++){let h=l[u],p=t(h,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let m=0,h=l.length;m<h;m++){let p=l[m];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],m=r[l];for(let h=0,p=m.length;h<p;h++)u.push(m[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,u=a.length;l<u;l++){let m=a[l];this.addGroup(m.start,m.count,m.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var ol=new U,ld=new U,cd=new Vt,Qe=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=ol.subVectors(n,e).cross(ld.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(ol),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||cd.getNormalMatrix(t),s=this.coplanarPoint(ol).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},hd=0,gn=class extends An{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=As(),this.name="",this.type="Material",this.blending=Es,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rl,this.blendDst=Cl,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Th,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=aa,this.stencilZFail=aa,this.stencilZPass=aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Ut(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Gt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Qe().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ft().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ft().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var ei=new U,ll=new U,zr=new U,kr=new U,si=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ei)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ei.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ei.copy(this.origin).addScaledVector(this.direction,e),ei.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ll.copy(t).add(e).multiplyScalar(.5),zr.copy(e).sub(t).normalize(),kr.copy(this.origin).sub(ll);let r=t.distanceTo(e)*.5,a=-this.direction.dot(zr),o=kr.dot(this.direction),c=-kr.dot(zr),l=kr.lengthSq(),u=Math.abs(1-a*a),m,h,p,_;if(u>0)if(m=a*c-o,h=a*o-c,_=r*u,m>=0)if(h>=-_)if(h<=_){let v=1/u;m*=v,h*=v,p=m*(m+a*h+2*o)+h*(a*m+h+2*c)+l}else h=r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*c)+l;else h=-r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*c)+l;else h<=-_?(m=Math.max(0,-(-a*r+o)),h=m>0?-r:Math.min(Math.max(-r,-c),r),p=-m*m+h*(h+2*c)+l):h<=_?(m=0,h=Math.min(Math.max(-r,-c),r),p=h*(h+2*c)+l):(m=Math.max(0,-(a*r+o)),h=m>0?r:Math.min(Math.max(-r,-c),r),p=-m*m+h*(h+2*c)+l);else h=a>0?-r:r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(ll).addScaledVector(zr,h),p}intersectSphere(t,e){if(t.radius<0)return null;ei.subVectors(t.center,this.origin);let n=ei.dot(this.direction),s=ei.dot(ei)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,m=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(o=(t.min.z-h.z)*m,c=(t.max.z-h.z)*m):(o=(t.max.z-h.z)*m,c=(t.min.z-h.z)*m),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ei)!==null}intersectTriangle(t,e,n,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,m=t.x-a.x,h=t.y-a.y,p=t.z-a.z,_=e.x-a.x,v=e.y-a.y,f=e.z-a.z,d=n.x-a.x,E=n.y-a.y,R=n.z-a.z,M=Math.abs(c),b=Math.abs(l),S=Math.abs(u),A,x,T,C,F,O,V,N,G,q,J,st;if(M>=b&&M>=S?(T=c,O=m,G=_,st=d,c>=0?(A=l,x=u,C=h,F=p,V=v,N=f,q=E,J=R):(A=u,x=l,C=p,F=h,V=f,N=v,q=R,J=E)):b>=S?(T=l,O=h,G=v,st=E,l>=0?(A=u,x=c,C=p,F=m,V=f,N=_,q=R,J=d):(A=c,x=u,C=m,F=p,V=_,N=f,q=d,J=R)):(T=u,O=p,G=f,st=R,u>=0?(A=c,x=l,C=m,F=h,V=_,N=v,q=d,J=E):(A=l,x=c,C=h,F=m,V=v,N=_,q=E,J=d)),T===0)return null;let Y=A/T,nt=x/T,it=1/T,Nt=C-Y*O,Pt=F-nt*O,me=V-Y*G,Kt=N-nt*G,se=q-Y*st,$=J-nt*st,et=se*Kt-$*me,wt=Nt*$-Pt*se,zt=me*Pt-Kt*Nt;if(s){if(et<0||wt<0||zt<0)return null}else if((et<0||wt<0||zt<0)&&(et>0||wt>0||zt>0))return null;let bt=et+wt+zt;if(bt===0)return null;let Bt=it*(et*O+wt*G+zt*st);return(bt>0?Bt<0:Bt>0)?null:this.at(Bt/bt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Bi=class extends gn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=Va,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Uc=new ne,Ni=new si,Vr=new Gn,Fc=new U,Gr=new U,Hr=new U,Wr=new U,cl=new U,Xr=new U,Oc=new U,qr=new U,oe=class extends Ce{constructor(t=new Ae,e=new Bi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Xr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],m=r[c];u!==0&&(cl.fromBufferAttribute(m,t),a?Xr.addScaledVector(cl,u):Xr.addScaledVector(cl.sub(e),u))}e.add(Xr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(r),Ni.copy(t.ray).recast(t.near),!(Vr.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(Vr,Fc)===null||Ni.origin.distanceToSquared(Fc)>(t.far-t.near)**2))&&(Uc.copy(r).invert(),Ni.copy(t.ray).applyMatrix4(Uc),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ni)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,m=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=h.length;_<v;_++){let f=h[_],d=a[f.materialIndex],E=Math.max(f.start,p.start),R=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));for(let M=E,b=R;M<b;M+=3){let S=o.getX(M),A=o.getX(M+1),x=o.getX(M+2);s=Yr(this,d,t,n,l,u,m,S,A,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{let _=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let f=_,d=v;f<d;f+=3){let E=o.getX(f),R=o.getX(f+1),M=o.getX(f+2);s=Yr(this,a,t,n,l,u,m,E,R,M),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,v=h.length;_<v;_++){let f=h[_],d=a[f.materialIndex],E=Math.max(f.start,p.start),R=Math.min(c.count,Math.min(f.start+f.count,p.start+p.count));for(let M=E,b=R;M<b;M+=3){let S=M,A=M+1,x=M+2;s=Yr(this,d,t,n,l,u,m,S,A,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{let _=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let f=_,d=v;f<d;f+=3){let E=f,R=f+1,M=f+2;s=Yr(this,a,t,n,l,u,m,E,R,M),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}}};function ud(i,t,e,n,s,r,a,o){let c;if(t.side===Ge?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===bi,o),c===null)return null;qr.copy(o),qr.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(qr);return l<e.near||l>e.far?null:{distance:l,point:qr.clone(),object:i}}function Yr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,Gr),i.getVertexPosition(c,Hr),i.getVertexPosition(l,Wr);let u=ud(i,t,e,n,Gr,Hr,Wr,Oc);if(u){let m=new U;ni.getBarycoord(Oc,Gr,Hr,Wr,m),s&&(u.uv=ni.getInterpolatedAttribute(s,o,c,l,m,new Ft)),r&&(u.uv1=ni.getInterpolatedAttribute(r,o,c,l,m,new Ft)),a&&(u.normal=ni.getInterpolatedAttribute(a,o,c,l,m,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new U,materialIndex:0};ni.getNormal(Gr,Hr,Wr,h.normal),u.face=h,u.barycoord=m}return u}var Qs=class extends tn{constructor(t=null,e=1,n=1,s,r,a,o,c,l=Be,u=Be,m,h){super(null,a,o,c,l,u,s,r,m,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var tr=class extends qe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},is=new ne,Bc=new ne,Zr=[],zc=new Vn,dd=new ne,Gs=new oe,Hs=new Gn,Rn=class extends oe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new tr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,dd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,is),zc.copy(t.boundingBox).applyMatrix4(is),this.boundingBox.union(zc)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,is),Hs.copy(t.boundingSphere).applyMatrix4(is),this.boundingSphere.union(Hs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Gs.geometry=this.geometry,Gs.material=this.material,Gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hs.copy(this.boundingSphere),Hs.applyMatrix4(n),t.ray.intersectsSphere(Hs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,is),Bc.multiplyMatrices(n,is),Gs.matrixWorld=Bc,Gs.raycast(t,Zr);for(let a=0,o=Zr.length;a<o;a++){let c=Zr[a];c.instanceId=r,c.object=this,e.push(c)}Zr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new tr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Qs(new Float32Array(s*this.count),s,this.count,Za,_n));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ui=new Gn,fd=new Ft(.5,.5),Jr=new U,_s=class{constructor(t=new Qe,e=new Qe,n=new Qe,s=new Qe,r=new Qe,a=new Qe){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=wn,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],m=r[5],h=r[6],p=r[7],_=r[8],v=r[9],f=r[10],d=r[11],E=r[12],R=r[13],M=r[14],b=r[15];if(s[0].setComponents(l-a,p-u,d-_,b-E).normalize(),s[1].setComponents(l+a,p+u,d+_,b+E).normalize(),s[2].setComponents(l+o,p+m,d+v,b+R).normalize(),s[3].setComponents(l-o,p-m,d-v,b-R).normalize(),n)s[4].setComponents(c,h,f,M).normalize(),s[5].setComponents(l-c,p-h,d-f,b-M).normalize();else if(s[4].setComponents(l-c,p-h,d-f,b-M).normalize(),e===wn)s[5].setComponents(l+c,p+h,d+f,b+M).normalize();else if(e===us)s[5].setComponents(c,h,f,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(t){Ui.center.set(0,0,0);let e=fd.distanceTo(t.center);return Ui.radius=.7071067811865476+e,Ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Jr.x=s.normal.x>0?t.max.x:t.min.x,Jr.y=s.normal.y>0?t.max.y:t.min.y,Jr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Jr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ri=class extends gn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Gt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},va=new U,Ma=new U,kc=new ne,Ws=new si,Kr=new Gn,hl=new U,Vc=new U,Sa=class extends Ce{constructor(t=new Ae,e=new ri){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)va.fromBufferAttribute(e,s-1),Ma.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=va.distanceTo(Ma);t.setAttribute("lineDistance",new we(n,1))}else Ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Kr.copy(n.boundingSphere),Kr.applyMatrix4(s),Kr.radius+=r,t.ray.intersectsSphere(Kr)===!1)return;kc.copy(s).invert(),Ws.copy(t.ray).applyMatrix4(kc);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let p=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let v=p,f=_-1;v<f;v+=l){let d=u.getX(v),E=u.getX(v+1),R=$r(this,t,Ws,c,d,E,v);R&&e.push(R)}if(this.isLineLoop){let v=u.getX(_-1),f=u.getX(p),d=$r(this,t,Ws,c,v,f,_-1);d&&e.push(d)}}else{let p=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let v=p,f=_-1;v<f;v+=l){let d=$r(this,t,Ws,c,v,v+1,v);d&&e.push(d)}if(this.isLineLoop){let v=$r(this,t,Ws,c,_-1,p,_-1);v&&e.push(v)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function $r(i,t,e,n,s,r,a){let o=i.geometry.attributes.position;if(va.fromBufferAttribute(o,s),Ma.fromBufferAttribute(o,r),e.distanceSqToSegment(va,Ma,hl,Vc)>n)return;hl.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(hl);if(!(l<t.near||l>t.far))return{distance:l,point:Vc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Gc=new U,Hc=new U,mi=class extends Sa{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Gc.fromBufferAttribute(e,s),Hc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Gc.distanceTo(Hc);t.setAttribute("lineDistance",new we(n,1))}else Ut("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var xs=class extends gn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Wc=new ne,xl=new si,jr=new Gn,Qr=new U,er=class extends Ce{constructor(t=new Ae,e=new xs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(s),jr.radius+=r,t.ray.intersectsSphere(jr)===!1)return;Wc.copy(s).invert(),xl.copy(t.ray).applyMatrix4(Wc);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,m=n.attributes.position;if(l!==null){let h=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let _=h,v=p;_<v;_++){let f=l.getX(_);Qr.fromBufferAttribute(m,f),Xc(Qr,f,c,s,t,e,this)}}else{let h=Math.max(0,a.start),p=Math.min(m.count,a.start+a.count);for(let _=h,v=p;_<v;_++)Qr.fromBufferAttribute(m,_),Xc(Qr,_,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Xc(i,t,e,n,s,r,a){let o=xl.distanceSqToPoint(i);if(o<e){let c=new U;xl.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var nr=class extends tn{constructor(t=[],e=Ei,n,s,r,a,o,c,l,u){super(t,e,n,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ir=class extends tn{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var gi=class extends tn{constructor(t,e,n=Pn,s,r,a,o=Be,c=Be,l,u=zn,m=1){if(u!==zn&&u!==wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:m};super(h,s,r,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ps(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},ba=class extends gi{constructor(t,e=Pn,n=Ei,s,r,a=Be,o=Be,c,l=zn){let u={width:t,height:t,depth:1},m=[u,u,u,u,u,u];super(t,t,e,n,s,r,a,o,c,l),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},sr=class extends tn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},hn=class i extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],m=[],h=0,p=0;_("z","y","x",-1,-1,n,e,t,a,r,0),_("z","y","x",1,-1,n,e,-t,a,r,1),_("x","z","y",1,1,t,n,e,s,a,2),_("x","z","y",1,-1,t,n,-e,s,a,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new we(l,3)),this.setAttribute("normal",new we(u,3)),this.setAttribute("uv",new we(m,2));function _(v,f,d,E,R,M,b,S,A,x,T){let C=M/A,F=b/x,O=M/2,V=b/2,N=S/2,G=A+1,q=x+1,J=0,st=0,Y=new U;for(let nt=0;nt<q;nt++){let it=nt*F-V;for(let Nt=0;Nt<G;Nt++){let Pt=Nt*C-O;Y[v]=Pt*E,Y[f]=it*R,Y[d]=N,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[f]=0,Y[d]=S>0?1:-1,u.push(Y.x,Y.y,Y.z),m.push(Nt/A),m.push(1-nt/x),J+=1}}for(let nt=0;nt<x;nt++)for(let it=0;it<A;it++){let Nt=h+it+G*nt,Pt=h+it+G*(nt+1),me=h+(it+1)+G*(nt+1),Kt=h+(it+1)+G*nt;c.push(Nt,Pt,Kt),c.push(Pt,me,Kt),st+=6}o.addGroup(p,st,T),p+=st,h+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var zi=class i extends Ae{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],m=[],h=[],p=[],_=0,v=[],f=n/2,d=0;E(),a===!1&&(t>0&&R(!0),e>0&&R(!1)),this.setIndex(u),this.setAttribute("position",new we(m,3)),this.setAttribute("normal",new we(h,3)),this.setAttribute("uv",new we(p,2));function E(){let M=new U,b=new U,S=0,A=(e-t)/n;for(let x=0;x<=r;x++){let T=[],C=x/r,F=C*(e-t)+t;for(let O=0;O<=s;O++){let V=O/s,N=V*c+o,G=Math.sin(N),q=Math.cos(N);b.x=F*G,b.y=-C*n+f,b.z=F*q,m.push(b.x,b.y,b.z),M.set(G,A,q).normalize(),h.push(M.x,M.y,M.z),p.push(V,1-C),T.push(_++)}v.push(T)}for(let x=0;x<s;x++)for(let T=0;T<r;T++){let C=v[T][x],F=v[T+1][x],O=v[T+1][x+1],V=v[T][x+1];(t>0||T!==0)&&(u.push(C,F,V),S+=3),(e>0||T!==r-1)&&(u.push(F,O,V),S+=3)}l.addGroup(d,S,0),d+=S}function R(M){let b=_,S=new Ft,A=new U,x=0,T=M===!0?t:e,C=M===!0?1:-1;for(let O=1;O<=s;O++)m.push(0,f*C,0),h.push(0,C,0),p.push(.5,.5),_++;let F=_;for(let O=0;O<=s;O++){let N=O/s*c+o,G=Math.cos(N),q=Math.sin(N);A.x=T*q,A.y=f*C,A.z=T*G,m.push(A.x,A.y,A.z),h.push(0,C,0),S.x=G*.5+.5,S.y=q*.5*C+.5,p.push(S.x,S.y),_++}for(let O=0;O<s;O++){let V=b+O,N=F+O;M===!0?u.push(N,N+1,V):u.push(N+1,N,V),x+=3}l.addGroup(d,x,M===!0?1:2),d+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ta=new U,ea=new U,ul=new U,na=new ni,rr=class extends Ae{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(ls*e),a=t.getIndex(),o=t.getAttribute("position"),c=a?a.count:o.count,l=[0,0,0],u=["a","b","c"],m=new Array(3),h={},p=[];for(let _=0;_<c;_+=3){a?(l[0]=a.getX(_),l[1]=a.getX(_+1),l[2]=a.getX(_+2)):(l[0]=_,l[1]=_+1,l[2]=_+2);let{a:v,b:f,c:d}=na;if(v.fromBufferAttribute(o,l[0]),f.fromBufferAttribute(o,l[1]),d.fromBufferAttribute(o,l[2]),na.getNormal(ul),m[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,m[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,m[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(m[0]===m[1]||m[1]===m[2]||m[2]===m[0]))for(let E=0;E<3;E++){let R=(E+1)%3,M=m[E],b=m[R],S=na[u[E]],A=na[u[R]],x=`${M}_${b}`,T=`${b}_${M}`;T in h&&h[T]?(ul.dot(h[T].normal)<=r&&(p.push(S.x,S.y,S.z),p.push(A.x,A.y,A.z)),h[T]=null):x in h||(h[x]={index0:l[E],index1:l[R],normal:ul.clone()})}}for(let _ in h)if(h[_]){let{index0:v,index1:f}=h[_];ta.fromBufferAttribute(o,v),ea.fromBufferAttribute(o,f),p.push(ta.x,ta.y,ta.z),p.push(ea.x,ea.y,ea.z)}this.setAttribute("position",new we(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var Hn=class i extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,u=c+1,m=t/o,h=e/c,p=[],_=[],v=[],f=[];for(let d=0;d<u;d++){let E=d*h-a;for(let R=0;R<l;R++){let M=R*m-r;_.push(M,-E,0),v.push(0,0,1),f.push(R/o),f.push(1-d/c)}}for(let d=0;d<c;d++)for(let E=0;E<o;E++){let R=E+l*d,M=E+l*(d+1),b=E+1+l*(d+1),S=E+1+l*d;p.push(R,M,S),p.push(M,b,S)}this.setIndex(p),this.setAttribute("position",new we(_,3)),this.setAttribute("normal",new we(v,3)),this.setAttribute("uv",new we(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var ys=class i extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,u=[],m=new U,h=new U,p=[],_=[],v=[],f=[];for(let d=0;d<=n;d++){let E=[],R=d/n,M=a+R*o,b=t*Math.cos(M),S=Math.sqrt(t*t-b*b),A=0;d===0&&a===0?A=.5/e:d===n&&c===Math.PI&&(A=-.5/e);for(let x=0;x<=e;x++){let T=x/e,C=s+T*r;m.x=-S*Math.cos(C),m.y=b,m.z=S*Math.sin(C),_.push(m.x,m.y,m.z),h.copy(m).normalize(),v.push(h.x,h.y,h.z),f.push(T+A,1-R),E.push(l++)}u.push(E)}for(let d=0;d<n;d++)for(let E=0;E<e;E++){let R=u[d][E+1],M=u[d][E],b=u[d+1][E],S=u[d+1][E+1];(d!==0||a>0)&&p.push(R,M,S),(d!==n-1||c<Math.PI)&&p.push(M,b,S)}this.setIndex(p),this.setAttribute("position",new we(_,3)),this.setAttribute("normal",new we(v,3)),this.setAttribute("uv",new we(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ar=class extends gn{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Gt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}};function Gi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(qc(s))s.isRenderTargetTexture?(Ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(qc(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function Ze(i){let t={};for(let e=0;e<i.length;e++){let n=Gi(i[e]);for(let s in n)t[s]=n[s]}return t}function qc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function pd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ql(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}var Bh={clone:Gi,merge:Ze},md=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,un=class extends gn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=md,this.fragmentShader=gd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gi(t.uniforms),this.uniformsGroups=pd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Gt().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ft().fromArray(s.value);break;case"v3":this.uniforms[n].value=new U().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Me().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Vt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ne().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ea=class extends un{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ye=class extends gn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tr,this.normalScale=new Ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var or=class extends gn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tr,this.normalScale=new Ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=Va,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ta=class extends gn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},wa=class extends gn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ss(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var _i=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Aa=class extends _i{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ml,endingEnd:ml}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gl:r=t,o=2*e-n;break;case _l:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case gl:a=t,c=2*n-e;break;case _l:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,u=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=this._offsetPrev,m=this._offsetNext,h=this._weightPrev,p=this._weightNext,_=(n-e)/(s-e),v=_*_,f=v*_,d=-h*f+2*h*v-h*_,E=(1+h)*f+(-1.5-2*h)*v+(-.5+h)*_+1,R=(-1-p)*f+(1.5+p)*v+.5*_,M=p*f-p*v;for(let b=0;b!==o;++b)r[b]=d*a[u+b]+E*a[l+b]+R*a[c+b]+M*a[m+b];return r}},Ra=class extends _i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=(n-e)/(s-e),m=1-u;for(let h=0;h!==o;++h)r[h]=a[l+h]*m+a[c+h]*u;return r}},Ca=class extends _i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Pa=class extends _i{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=this.inTangents,m=this.outTangents;if(!u||!m){let _=(n-e)/(s-e),v=1-_;for(let f=0;f!==o;++f)r[f]=a[l+f]*v+a[c+f]*_;return r}let h=o*2,p=t-1;for(let _=0;_!==o;++_){let v=a[l+_],f=a[c+_],d=p*h+_*2,E=m[d],R=m[d+1],M=t*h+_*2,b=u[M],S=u[M+1],A=xd(n,e,E,b,s);r[_]=zh(A,v,R,S,f)}return r}};function zh(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function _d(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function xd(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){let o=zh(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;let c=_d(r,t,e,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var dn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ss(e,this.TimeBufferType),this.values=ss(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ss(t.times,Array),values:ss(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),dl(t.settings)&&(n.settings={inTangents:ss(t.settings.inTangents,Array),outTangents:ss(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Ca(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ra(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Aa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Pa(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case qs:e=this.InterpolantFactoryMethodDiscrete;break;case ga:e=this.InterpolantFactoryMethodLinear;break;case ra:e=this.InterpolantFactoryMethodSmooth;break;case pl:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ut("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qs;case this.InterpolantFactoryMethodLinear:return ga;case this.InterpolantFactoryMethodSmooth:return ra;case this.InterpolantFactoryMethodBezier:return pl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;dl(this.settings)&&(Yc(this.settings.inTangents,t),Yc(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ot("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ot("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Ot("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){Ot("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&Lu(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){Ot("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ra,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],u=t[o+1];if(l!==u&&(o!==1||l!==t[0]))if(s)c=!0;else{let m=o*n,h=m-n,p=m+n;for(let _=0;_!==n;++_){let v=e[m+_];if(v!==e[h+_]||v!==e[p+_]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let m=o*n,h=a*n;for(let p=0;p!==n;++p)e[h+p]=e[m+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,dl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Yc(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}dn.prototype.ValueTypeName="";dn.prototype.TimeBufferType=Float32Array;dn.prototype.ValueBufferType=Float32Array;dn.prototype.DefaultInterpolation=ga;var xi=class extends dn{constructor(t,e,n){super(t,e,n)}};xi.prototype.ValueTypeName="bool";xi.prototype.ValueBufferType=Array;xi.prototype.DefaultInterpolation=qs;xi.prototype.InterpolantFactoryMethodLinear=void 0;xi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ia=class extends dn{constructor(t,e,n,s){super(t,e,n,s)}};Ia.prototype.ValueTypeName="color";var La=class extends dn{constructor(t,e,n,s){super(t,e,n,s)}};La.prototype.ValueTypeName="number";var Da=class extends _i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let u=l+o;l!==u;l+=4)Ve.slerpFlat(r,0,a,l-o,a,l,c);return r}},lr=class extends dn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Da(this.times,this.values,this.getValueSize(),t)}};lr.prototype.ValueTypeName="quaternion";lr.prototype.InterpolantFactoryMethodSmooth=void 0;var yi=class extends dn{constructor(t,e,n){super(t,e,n)}};yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=qs;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Na=class extends dn{constructor(t,e,n,s){super(t,e,n,s)}};Na.prototype.ValueTypeName="vector";var Ua=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,m){return l.push(u,m),this},this.removeHandler=function(u){let m=l.indexOf(u);return m!==-1&&l.splice(m,2),this},this.getHandler=function(u){for(let m=0,h=l.length;m<h;m+=2){let p=l[m],_=l[m+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},kh=new Ua,Fa=class{constructor(t){this.manager=t!==void 0?t:kh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Fa.DEFAULT_MATERIAL_NAME="__DEFAULT";var vs=class extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},cr=class extends vs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},fl=new ne,Zc=new U,Jc=new U,hr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ft(512,512),this.mapType=sn,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _s,this._frameExtents=new Ft(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Zc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Zc),Jc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jc),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){fl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(fl,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;t.coordinateSystem===us||t.reversedDepth?e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),e.multiply(fl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},ia=new U,sa=new Ve,Fn=new U,ur=class extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ia,sa,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,Fn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(ia,sa,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,Fn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},pi=new U,Kc=new Ft,$c=new Ft,ze=class extends ur{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(pi.x,pi.y).multiplyScalar(-t/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(pi.x,pi.y).multiplyScalar(-t/pi.z)}getViewSize(t,e){return this.getViewBounds(t,Kc,$c),e.subVectors($c,Kc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ls*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var yl=class extends hr{constructor(){super(new ze(90,1,.5,500)),this.isPointLightShadow=!0}},dr=class extends vs{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new yl}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Ms=class extends ur{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},vl=class extends hr{constructor(){super(new Ms(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ss=class extends vs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new vl}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var rs=-90,as=1,Oa=class extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ze(rs,as,t,e);s.layers=this.layers,this.add(s);let r=new ze(rs,as,t,e);r.layers=this.layers,this.add(r);let a=new ze(rs,as,t,e);a.layers=this.layers,this.add(a);let o=new ze(rs,as,t,e);o.layers=this.layers,this.add(o);let c=new ze(rs,as,t,e);c.layers=this.layers,this.add(c);let l=new ze(rs,as,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,m=t.getRenderTarget(),h=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;t.isWebGLRenderer===!0?f=t.state.buffers.depth.getReversed():f=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(m,h,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},Ba=class extends ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Yl="\\[\\]\\.:\\/",yd=new RegExp("["+Yl+"]","g"),Zl="[^"+Yl+"]",vd="[^"+Yl.replace("\\.","")+"]",Md=/((?:WC+[\/:])*)/.source.replace("WC",Zl),Sd=/(WCOD+)?/.source.replace("WCOD",vd),bd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zl),Ed=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zl),Td=new RegExp("^"+Md+Sd+bd+Ed+"$"),wd=["material","materials","bones","map"],Ml=class{constructor(t,e,n){let s=n||ye.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ye=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(yd,"")}static parseTrackName(t){let e=Td.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);wd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ut("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ot("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ot("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ot("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ot("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Ot("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;Ot("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ye.Composite=Ml;ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ye.prototype.GetterByBindingType=[ye.prototype._getValue_direct,ye.prototype._getValue_array,ye.prototype._getValue_arrayElement,ye.prototype._getValue_toArray];ye.prototype.SetterByBindingTypeAndVersioning=[[ye.prototype._setValue_direct,ye.prototype._setValue_direct_setNeedsUpdate,ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_array,ye.prototype._setValue_array_setNeedsUpdate,ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_arrayElement,ye.prototype._setValue_arrayElement_setNeedsUpdate,ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_fromArray,ye.prototype._setValue_fromArray_setNeedsUpdate,ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var U0=new Float32Array(1);var jc=new ne,fr=class{constructor(t,e,n=0,s=1/0){this.ray=new si(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Ot("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return jc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(jc),this}intersectObject(t,e=!0,n=[]){return Sl(t,this,n,e),n.sort(Qc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Sl(t[s],this,n,e);return n.sort(Qc),n}};function Qc(i,t){return i.distance-t.distance}function Sl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)Sl(r[a],t,e,!0)}}var vi=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=jt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(jt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var tc=class tc{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};tc.prototype.isMatrix2=!0;var bl=tc;var pr=class extends An{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Jl(i,t,e,n){let s=Ad(n);switch(e){case Vl:return i*t;case Za:return i*t/s.components*s.byteLength;case Ja:return i*t/s.components*s.byteLength;case Ai:return i*t*2/s.components*s.byteLength;case Ka:return i*t*2/s.components*s.byteLength;case Gl:return i*t*3/s.components*s.byteLength;case xn:return i*t*4/s.components*s.byteLength;case $a:return i*t*4/s.components*s.byteLength;case yr:case vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Mr:case Sr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qa:case eo:return Math.max(i,16)*Math.max(t,8)/4;case ja:case to:return Math.max(i,8)*Math.max(t,8)/2;case no:case io:case ro:case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case so:case br:case oo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case co:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case uo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case po:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case go:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case vo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Mo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case So:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case bo:case Eo:case To:return Math.ceil(i/4)*Math.ceil(t/4)*16;case wo:case Ao:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Er:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ad(i){switch(i){case sn:case Ol:return{byteLength:1,components:1};case Ts:case Bl:case In:return{byteLength:2,components:1};case qa:case Ya:return{byteLength:2,components:4};case Pn:case Xa:case _n:return{byteLength:4,components:1};case zl:case kl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function lu(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Cd(i){let t=new WeakMap;function e(o,c){let l=o.array,u=o.usage,m=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:m}}function n(o,c,l){let u=c.array,m=c.updateRanges;if(i.bindBuffer(l,o),m.length===0)i.bufferSubData(l,0,u);else{m.sort((p,_)=>p.start-_.start);let h=0;for(let p=1;p<m.length;p++){let _=m[h],v=m[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++h,m[h]=v)}m.length=h+1;for(let p=0,_=m.length;p<_;p++){let v=m[p];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Pd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Id=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ld=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ud=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Od=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,zd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Wd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Xd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,$d=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,jd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Qd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ef=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,nf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,af=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,of="gl_FragColor = linearToOutputTexel( gl_FragColor );",lf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,hf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,df=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ff=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,pf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_f=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,bf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Ef=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Cf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Pf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,If=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Df=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Nf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Of=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Vf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Zf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$f=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,tp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ep=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,np=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ip=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ap=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,up=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,pp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,mp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,_p=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,yp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Mp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ep=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,wp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ip=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Np=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Op=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,zp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Vp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$p=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,jp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Qp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,em=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,im=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,om=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:Pd,alphahash_pars_fragment:Id,alphamap_fragment:Ld,alphamap_pars_fragment:Dd,alphatest_fragment:Nd,alphatest_pars_fragment:Ud,aomap_fragment:Fd,aomap_pars_fragment:Od,batching_pars_vertex:Bd,batching_vertex:zd,begin_vertex:kd,beginnormal_vertex:Vd,bsdfs:Gd,iridescence_fragment:Hd,bumpmap_pars_fragment:Wd,clipping_planes_fragment:Xd,clipping_planes_pars_fragment:qd,clipping_planes_pars_vertex:Yd,clipping_planes_vertex:Zd,color_fragment:Jd,color_pars_fragment:Kd,color_pars_vertex:$d,color_vertex:jd,common:Qd,cube_uv_reflection_fragment:tf,defaultnormal_vertex:ef,displacementmap_pars_vertex:nf,displacementmap_vertex:sf,emissivemap_fragment:rf,emissivemap_pars_fragment:af,colorspace_fragment:of,colorspace_pars_fragment:lf,envmap_fragment:cf,envmap_common_pars_fragment:hf,envmap_pars_fragment:uf,envmap_pars_vertex:df,envmap_physical_pars_fragment:bf,envmap_vertex:ff,fog_vertex:pf,fog_pars_vertex:mf,fog_fragment:gf,fog_pars_fragment:_f,gradientmap_pars_fragment:xf,lightmap_pars_fragment:yf,lights_lambert_fragment:vf,lights_lambert_pars_fragment:Mf,lights_pars_begin:Sf,lights_toon_fragment:Ef,lights_toon_pars_fragment:Tf,lights_phong_fragment:wf,lights_phong_pars_fragment:Af,lights_physical_fragment:Rf,lights_physical_pars_fragment:Cf,lights_fragment_begin:Pf,lights_fragment_maps:If,lights_fragment_end:Lf,lightprobes_pars_fragment:Df,logdepthbuf_fragment:Nf,logdepthbuf_pars_fragment:Uf,logdepthbuf_pars_vertex:Ff,logdepthbuf_vertex:Of,map_fragment:Bf,map_pars_fragment:zf,map_particle_fragment:kf,map_particle_pars_fragment:Vf,metalnessmap_fragment:Gf,metalnessmap_pars_fragment:Hf,morphinstance_vertex:Wf,morphcolor_vertex:Xf,morphnormal_vertex:qf,morphtarget_pars_vertex:Yf,morphtarget_vertex:Zf,normal_fragment_begin:Jf,normal_fragment_maps:Kf,normal_pars_fragment:$f,normal_pars_vertex:jf,normal_vertex:Qf,normalmap_pars_fragment:tp,clearcoat_normal_fragment_begin:ep,clearcoat_normal_fragment_maps:np,clearcoat_pars_fragment:ip,iridescence_pars_fragment:sp,opaque_fragment:rp,packing:ap,premultiplied_alpha_fragment:op,project_vertex:lp,dithering_fragment:cp,dithering_pars_fragment:hp,roughnessmap_fragment:up,roughnessmap_pars_fragment:dp,shadowmap_pars_fragment:fp,shadowmap_pars_vertex:pp,shadowmap_vertex:mp,shadowmask_pars_fragment:gp,skinbase_vertex:_p,skinning_pars_vertex:xp,skinning_vertex:yp,skinnormal_vertex:vp,specularmap_fragment:Mp,specularmap_pars_fragment:Sp,tonemapping_fragment:bp,tonemapping_pars_fragment:Ep,transmission_fragment:Tp,transmission_pars_fragment:wp,uv_pars_fragment:Ap,uv_pars_vertex:Rp,uv_vertex:Cp,worldpos_vertex:Pp,background_vert:Ip,background_frag:Lp,backgroundCube_vert:Dp,backgroundCube_frag:Np,cube_vert:Up,cube_frag:Fp,depth_vert:Op,depth_frag:Bp,distance_vert:zp,distance_frag:kp,equirect_vert:Vp,equirect_frag:Gp,linedashed_vert:Hp,linedashed_frag:Wp,meshbasic_vert:Xp,meshbasic_frag:qp,meshlambert_vert:Yp,meshlambert_frag:Zp,meshmatcap_vert:Jp,meshmatcap_frag:Kp,meshnormal_vert:$p,meshnormal_frag:jp,meshphong_vert:Qp,meshphong_frag:tm,meshphysical_vert:em,meshphysical_frag:nm,meshtoon_vert:im,meshtoon_frag:sm,points_vert:rm,points_frag:am,shadow_vert:om,shadow_frag:lm,sprite_vert:cm,sprite_frag:hm},xt={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new Ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new Ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},Yn={basic:{uniforms:Ze([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:Ze([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},envMapIntensity:{value:1}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:Ze([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:Ze([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:Ze([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:Ze([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:Ze([xt.points,xt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:Ze([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:Ze([xt.common,xt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:Ze([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:Ze([xt.sprite,xt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distance:{uniforms:Ze([xt.common,xt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distance_vert,fragmentShader:Zt.distance_frag},shadow:{uniforms:Ze([xt.lights,xt.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};Yn.physical={uniforms:Ze([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new Ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new Ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new Ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};var Io={r:0,b:0,g:0},um=new ne,cu=new Vt;cu.set(-1,0,0,0,1,0,0,0,1);function dm(i,t,e,n,s,r){let a=new Gt(0),o=s===!0?0:1,c,l,u=null,m=0,h=null;function p(E){let R=E.isScene===!0?E.background:null;if(R&&R.isTexture){let M=E.backgroundBlurriness>0;R=t.get(R,M)}return R}function _(E){let R=!1,M=p(E);M===null?f(a,o):M&&M.isColor&&(f(M,1),R=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||R)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(E,R){let M=p(R);M&&(M.isCubeTexture||M.mapping===_r)?(l===void 0&&(l=new oe(new hn(1,1,1),new un({name:"BackgroundCubeMaterial",uniforms:Gi(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(um.makeRotationFromEuler(R.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(cu),l.material.toneMapped=ee.getTransfer(M.colorSpace)!==he,(u!==M||m!==M.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,m=M.version,h=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new oe(new Hn(2,2),new un({name:"BackgroundMaterial",uniforms:Gi(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,c.material.toneMapped=ee.getTransfer(M.colorSpace)!==he,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||m!==M.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=M,m=M.version,h=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,R){E.getRGB(Io,ql(i)),e.buffers.color.setClear(Io.r,Io.g,Io.b,R,r)}function d(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,R=1){a.set(E),o=R,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,f(a,o)},render:_,addToRenderList:v,dispose:d}}function fm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(F,O,V,N,G){let q=!1,J=m(F,N,V,O);r!==J&&(r=J,l(r.object)),q=p(F,N,V,G),q&&_(F,N,V,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(F,O,V,N),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(F){return i.bindVertexArray(F)}function u(F){return i.deleteVertexArray(F)}function m(F,O,V,N){let G=N.wireframe===!0,q=n[O.id];q===void 0&&(q={},n[O.id]=q);let J=F.isInstancedMesh===!0?F.id:0,st=q[J];st===void 0&&(st={},q[J]=st);let Y=st[V.id];Y===void 0&&(Y={},st[V.id]=Y);let nt=Y[G];return nt===void 0&&(nt=h(c()),Y[G]=nt),nt}function h(F){let O=[],V=[],N=[];for(let G=0;G<e;G++)O[G]=0,V[G]=0,N[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:V,attributeDivisors:N,object:F,attributes:{},index:null}}function p(F,O,V,N){let G=r.attributes,q=O.attributes,J=0,st=V.getAttributes();for(let Y in st)if(st[Y].location>=0){let it=G[Y],Nt=q[Y];if(Nt===void 0&&(Y==="instanceMatrix"&&F.instanceMatrix&&(Nt=F.instanceMatrix),Y==="instanceColor"&&F.instanceColor&&(Nt=F.instanceColor)),it===void 0||it.attribute!==Nt||Nt&&it.data!==Nt.data)return!0;J++}return r.attributesNum!==J||r.index!==N}function _(F,O,V,N){let G={},q=O.attributes,J=0,st=V.getAttributes();for(let Y in st)if(st[Y].location>=0){let it=q[Y];it===void 0&&(Y==="instanceMatrix"&&F.instanceMatrix&&(it=F.instanceMatrix),Y==="instanceColor"&&F.instanceColor&&(it=F.instanceColor));let Nt={};Nt.attribute=it,it&&it.data&&(Nt.data=it.data),G[Y]=Nt,J++}r.attributes=G,r.attributesNum=J,r.index=N}function v(){let F=r.newAttributes;for(let O=0,V=F.length;O<V;O++)F[O]=0}function f(F){d(F,0)}function d(F,O){let V=r.newAttributes,N=r.enabledAttributes,G=r.attributeDivisors;V[F]=1,N[F]===0&&(i.enableVertexAttribArray(F),N[F]=1),G[F]!==O&&(i.vertexAttribDivisor(F,O),G[F]=O)}function E(){let F=r.newAttributes,O=r.enabledAttributes;for(let V=0,N=O.length;V<N;V++)O[V]!==F[V]&&(i.disableVertexAttribArray(V),O[V]=0)}function R(F,O,V,N,G,q,J){J===!0?i.vertexAttribIPointer(F,O,V,G,q):i.vertexAttribPointer(F,O,V,N,G,q)}function M(F,O,V,N){v();let G=N.attributes,q=V.getAttributes(),J=O.defaultAttributeValues;for(let st in q){let Y=q[st];if(Y.location>=0){let nt=G[st];if(nt===void 0&&(st==="instanceMatrix"&&F.instanceMatrix&&(nt=F.instanceMatrix),st==="instanceColor"&&F.instanceColor&&(nt=F.instanceColor)),nt!==void 0){let it=nt.normalized,Nt=nt.itemSize,Pt=t.get(nt);if(Pt===void 0)continue;let me=Pt.buffer,Kt=Pt.type,se=Pt.bytesPerElement,$=Kt===i.INT||Kt===i.UNSIGNED_INT||nt.gpuType===Xa;if(nt.isInterleavedBufferAttribute){let et=nt.data,wt=et.stride,zt=nt.offset;if(et.isInstancedInterleavedBuffer){for(let bt=0;bt<Y.locationSize;bt++)d(Y.location+bt,et.meshPerAttribute);F.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let bt=0;bt<Y.locationSize;bt++)f(Y.location+bt);i.bindBuffer(i.ARRAY_BUFFER,me);for(let bt=0;bt<Y.locationSize;bt++)R(Y.location+bt,Nt/Y.locationSize,Kt,it,wt*se,(zt+Nt/Y.locationSize*bt)*se,$)}else{if(nt.isInstancedBufferAttribute){for(let et=0;et<Y.locationSize;et++)d(Y.location+et,nt.meshPerAttribute);F.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let et=0;et<Y.locationSize;et++)f(Y.location+et);i.bindBuffer(i.ARRAY_BUFFER,me);for(let et=0;et<Y.locationSize;et++)R(Y.location+et,Nt/Y.locationSize,Kt,it,Nt*se,Nt/Y.locationSize*et*se,$)}}else if(J!==void 0){let it=J[st];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(Y.location,it);break;case 3:i.vertexAttrib3fv(Y.location,it);break;case 4:i.vertexAttrib4fv(Y.location,it);break;default:i.vertexAttrib1fv(Y.location,it)}}}}E()}function b(){T();for(let F in n){let O=n[F];for(let V in O){let N=O[V];for(let G in N){let q=N[G];for(let J in q)u(q[J].object),delete q[J];delete N[G]}}delete n[F]}}function S(F){if(n[F.id]===void 0)return;let O=n[F.id];for(let V in O){let N=O[V];for(let G in N){let q=N[G];for(let J in q)u(q[J].object),delete q[J];delete N[G]}}delete n[F.id]}function A(F){for(let O in n){let V=n[O];for(let N in V){let G=V[N];if(G[F.id]===void 0)continue;let q=G[F.id];for(let J in q)u(q[J].object),delete q[J];delete G[F.id]}}}function x(F){for(let O in n){let V=n[O],N=F.isInstancedMesh===!0?F.id:0,G=V[N];if(G!==void 0){for(let q in G){let J=G[q];for(let st in J)u(J[st].object),delete J[st];delete G[q]}delete V[N],Object.keys(V).length===0&&delete n[O]}}}function T(){C(),a=!0,r!==s&&(r=s,l(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:C,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:f,disableUnusedAttributes:E}}function pm(i,t,e){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),e.update(l,n,u))}function o(c,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let p=0;p<u;p++)h+=l[p];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function mm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==xn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let x=A===In&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==sn&&A!==_n&&!x&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",u=c(l);u!==l&&(Ut("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let m=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:m,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:f,maxAttributes:d,maxVertexUniforms:E,maxVaryings:R,maxFragmentUniforms:M,maxSamples:b,samples:S}}function gm(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Qe,o=new Vt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(m,h){let p=m.length!==0||h||n!==0||s;return s=h,n=m.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,h){e=u(m,h,0)},this.setState=function(m,h,p){let _=m.clippingPlanes,v=m.clipIntersection,f=m.clipShadows,d=i.get(m);if(!s||_===null||_.length===0||r&&!f)r?u(null):l();else{let E=r?0:n,R=E*4,M=d.clippingState||null;c.value=M,M=u(_,h,R,p);for(let b=0;b!==R;++b)M[b]=e[b];d.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(m,h,p,_){let v=m!==null?m.length:0,f=null;if(v!==0){if(f=c.value,_!==!0||f===null){let d=p+v*4,E=h.matrixWorldInverse;o.getNormalMatrix(E),(f===null||f.length<d)&&(f=new Float32Array(d));for(let R=0,M=p;R!==v;++R,M+=4)a.copy(m[R]).applyMatrix4(E,o),a.normal.toArray(f,M),f[M+3]=a.constant}c.value=f,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,f}}var Ps=4,_m=6,xm=20,ym=256,wr=new Ms,Vh=new Gt,ec=null,nc=0,ic=0,sc=!1,vm=new U,Hi=new U,Ls=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=vm}=r;ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ec,nc,ic),this._renderer.xr.enabled=sc,t.scissorTest=!1,Cs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ei||t.mapping===Vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ke,minFilter:ke,generateMipmaps:!1,type:In,format:xn,colorSpace:Ys,depthBuffer:!1},s=Gh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gh(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Mm(r)),this._blurMaterial=bm(r,t,e),this._ggxMaterial=Sm(r,t,e)}return s}_compileMaterial(t){let e=new oe(new Ae,t);this._renderer.compile(e,wr)}_sceneToCubeUV(t,e,n,s,r){let c=new ze(90,1,e,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],m=this._renderer,h=m.autoClear,p=m.toneMapping;m.getClearColor(Vh),m.toneMapping=Cn,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(s),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new oe(new hn,new Bi({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,f=v.material,d=!1,E=t.background;E?E.isColor&&(f.color.copy(E),t.background=null,d=!0):(f.color.copy(Vh),d=!0);for(let R=0;R<6;R++){let M=R%3;M===0?(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[R],r.y,r.z)):M===1?(c.up.set(0,0,l[R]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[R],r.z)):(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[R]));let b=this._cubeSize;Cs(s,M*b,R>2?b:0,b,b),m.setRenderTarget(s),d&&m.render(v,c),m.render(t,c)}m.toneMapping=p,m.autoClear=h,t.background=E}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ei||t.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;Cs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,wr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),m=Math.sqrt(l*l-u*u),h=l*1.25,p=m*h,{_lodMax:_}=this,v=this._sizeLods[n],f=3*v*(n>_-Ps?n-_+Ps:0),d=4*(this._cubeSize-v);c.envMap.value=t.texture,c.roughness.value=p,c.mipInt.value=_-e,Cs(r,f,d,3*v,2*v),s.setRenderTarget(r),s.render(o,wr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=_-n,Cs(t,f,d,3*v,2*v),s.setRenderTarget(t),s.render(o,wr)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;let l=o.uniforms;l.envMap.value=t.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],m=3*u*(s>this._lodMax-Ps?s-this._lodMax+Ps:0),h=4*(this._cubeSize-u);Cs(e,m,h,3*u,2*u),a.setRenderTarget(e),a.render(c,wr)}};function Mm(i){let t=[],e=[],n=i,s=i-Ps+1+_m;for(let r=0;r<s;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),c=-o,l=1+o,u=[c,c,l,c,l,l,c,c,l,l,c,l],m=6,h=6,p=3,_=new Float32Array(p*h*m),v=new Float32Array(p*h*m);for(let d=0;d<m;d++){let E=d%3*2/3-1,R=d>2?0:-1,M=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];_.set(M,p*h*d);for(let b=0;b<h;b++){let S=u[b*2]*2-1,A=u[b*2+1]*2-1;d===0?Hi.set(1,A,S):d===1?Hi.set(-S,1,-A):d===2?Hi.set(-S,A,1):d===3?Hi.set(-1,A,-S):d===4?Hi.set(-S,-1,A):Hi.set(S,A,-1),Hi.toArray(v,(d*h+b)*p)}}let f=new Ae;f.setAttribute("position",new qe(_,p)),f.setAttribute("outputDirection",new qe(v,p)),e.push(new oe(f,null)),n>Ps&&n--}return{lodMeshes:e,sizeLods:t}}function Gh(i,t,e){let n=new nn(i,t,e);return n.texture.mapping=_r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Sm(i,t,e){return new un({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ym,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Uo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function bm(i,t,e){return new un({name:"SphericalGaussianBlur",defines:{SAMPLES:xm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Uo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Hh(){return new un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Uo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Wh(){return new un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Uo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Uo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Do=class extends nn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new nr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new hn(5,5,5),r=new un({name:"CubemapFromEquirect",uniforms:Gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:Xn});r.uniforms.tEquirect.value=e;let a=new oe(s,r),o=e.minFilter;return e.minFilter===Ti&&(e.minFilter=ke),new Oa(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function Em(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,p=!1){return h==null?null:p?a(h):r(h)}function r(h){if(h&&h.isTexture){let p=h.mapping;if(p===Ga||p===Ha)if(t.has(h)){let _=t.get(h).texture;return o(_,h.mapping)}else{let _=h.image;if(_&&_.height>0){let v=new Do(_.height);return v.fromEquirectangularTexture(i,h),t.set(h,v),h.addEventListener("dispose",l),o(v.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let p=h.mapping,_=p===Ga||p===Ha,v=p===Ei||p===Vi;if(_||v){let f=e.get(h),d=f!==void 0?f.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new Ls(i)),f=_?n.fromEquirectangular(h,f):n.fromCubemap(h,f),f.texture.pmremVersion=h.pmremVersion,e.set(h,f),f.texture;if(f!==void 0)return f.texture;{let E=h.image;return _&&E&&E.height>0||v&&E&&c(E)?(n===null&&(n=new Ls(i)),f=_?n.fromEquirectangular(h):n.fromCubemap(h),f.texture.pmremVersion=h.pmremVersion,e.set(h,f),h.addEventListener("dispose",u),f.texture):null}}}return h}function o(h,p){return p===Ga?h.mapping=Ei:p===Ha&&(h.mapping=Vi),h}function c(h){let p=0,_=6;for(let v=0;v<_;v++)h[v]!==void 0&&p++;return p===_}function l(h){let p=h.target;p.removeEventListener("dispose",l);let _=t.get(p);_!==void 0&&(t.delete(p),_.dispose())}function u(h){let p=h.target;p.removeEventListener("dispose",u);let _=e.get(p);_!==void 0&&(e.delete(p),_.dispose())}function m(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:m}}function Tm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Fi("WebGLRenderer: "+n+" extension not supported."),s}}}function wm(i,t,e,n){let s={},r=new WeakMap;function a(m){let h=m.target;h.index!==null&&t.remove(h.index);for(let _ in h.attributes)t.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete s[h.id];let p=r.get(h);p&&(t.remove(p),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(m,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function c(m){let h=m.attributes;for(let p in h)t.update(h[p],i.ARRAY_BUFFER)}function l(m){let h=[],p=m.index,_=m.attributes.position,v=0;if(_===void 0)return;if(p!==null){let E=p.array;v=p.version;for(let R=0,M=E.length;R<M;R+=3){let b=E[R+0],S=E[R+1],A=E[R+2];h.push(b,S,S,A,A,b)}}else{let E=_.array;v=_.version;for(let R=0,M=E.length/3-1;R<M;R+=3){let b=R+0,S=R+1,A=R+2;h.push(b,S,S,A,A,b)}}let f=new(_.count>=65535?js:$s)(h,1);f.version=v;let d=r.get(m);d&&t.remove(d),r.set(m,f)}function u(m){let h=r.get(m);if(h){let p=m.index;p!==null&&h.version<p.version&&l(m)}else l(m);return r.get(m)}return{get:o,update:c,getWireframeAttribute:u}}function Am(i,t,e){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function c(m,h){i.drawElements(n,h,r,m*a),e.update(h,n,1)}function l(m,h,p){p!==0&&(i.drawElementsInstanced(n,h,r,m*a,p),e.update(h,n,p))}function u(m,h,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,m,0,p);let v=0;for(let f=0;f<p;f++)v+=h[f];e.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Rm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Ot("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Cm(i,t,e){let n=new WeakMap,s=new Me;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,m=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==m){let T=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",T)};h!==void 0&&h.texture.dispose();let p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],E=o.morphAttributes.color||[],R=0;p===!0&&(R=1),_===!0&&(R=2),v===!0&&(R=3);let M=o.attributes.position.count*R,b=1;M>t.maxTextureSize&&(b=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let S=new Float32Array(M*b*4*m),A=new Ks(S,M,b,m);A.type=_n,A.needsUpdate=!0;let x=R*4;for(let C=0;C<m;C++){let F=f[C],O=d[C],V=E[C],N=M*b*4*C;for(let G=0;G<F.count;G++){let q=G*x;p===!0&&(s.fromBufferAttribute(F,G),S[N+q+0]=s.x,S[N+q+1]=s.y,S[N+q+2]=s.z,S[N+q+3]=0),_===!0&&(s.fromBufferAttribute(O,G),S[N+q+4]=s.x,S[N+q+5]=s.y,S[N+q+6]=s.z,S[N+q+7]=0),v===!0&&(s.fromBufferAttribute(V,G),S[N+q+8]=s.x,S[N+q+9]=s.y,S[N+q+10]=s.z,S[N+q+11]=V.itemSize===4?s.w:1)}}h={count:m,texture:A,size:new Ft(M,b)},n.set(o,h),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let p=0;for(let v=0;v<l.length;v++)p+=l[v];let _=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Pm(i,t,e,n,s){let r=new WeakMap;function a(l){let u=s.render.frame,m=l.geometry,h=t.get(l,m);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let p=l.skeleton;r.get(p)!==u&&(p.update(),r.set(p,u))}return h}function o(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}var Im={[Pl]:"LINEAR_TONE_MAPPING",[Il]:"REINHARD_TONE_MAPPING",[Ll]:"CINEON_TONE_MAPPING",[gr]:"ACES_FILMIC_TONE_MAPPING",[Nl]:"AGX_TONE_MAPPING",[Ul]:"NEUTRAL_TONE_MAPPING",[Dl]:"CUSTOM_TONE_MAPPING"};function Lm(i,t,e,n,s,r){let a=new nn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new Ae;l.setAttribute("position",new we([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new we([0,2,0,0,2,0],2));let u=new Ea({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),m=new oe(l,u),h=new Ms(-1,1,1,-1,0,1),p=null,_=null,v=!1,f,d=null,E=[],R=!1;this.setSize=function(M,b){a.setSize(M,b),o!==null&&o.setSize(M,b),c!==null&&c.setSize(M,b);for(let S=0;S<E.length;S++){let A=E[S];A.setSize&&A.setSize(M,b)}},this.setEffects=function(M){E=M,R=E.length>0&&E[0].isRenderPass===!0;let b=a.width,S=a.height;E.length>0&&o===null&&(o=new nn(b,S,{type:In,depthBuffer:!1,stencilBuffer:!1}),c=new nn(b,S,{type:In,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<E.length;A++){let x=E[A];x.setSize&&x.setSize(b,S)}},this.begin=function(M,b){if(v||M.toneMapping===Cn&&E.length===0)return!1;if(d=b,b!==null){let S=b.width,A=b.height;(a.width!==S||a.height!==A)&&this.setSize(S,A)}return R===!1&&M.setRenderTarget(a),f=M.toneMapping,M.toneMapping=Cn,!0},this.hasRenderPass=function(){return R},this.end=function(M,b){M.toneMapping=f,v=!0;let S=a,A=o;for(let x=0;x<E.length;x++){let T=E[x];T.enabled!==!1&&(T.render(M,A,S,b),T.needsSwap!==!1&&(S=A,A=A===o?c:o))}if(p!==M.outputColorSpace||_!==M.toneMapping){p=M.outputColorSpace,_=M.toneMapping,u.defines={},ee.getTransfer(p)===he&&(u.defines.SRGB_TRANSFER="");let x=Im[_];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=S.texture,M.setRenderTarget(d),M.render(m,h),d=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var hu=new tn,oc=new gi(1,1),uu=new Ks,du=new ya,fu=new nr,Xh=[],qh=[],Yh=new Float32Array(16),Zh=new Float32Array(9),Jh=new Float32Array(4);function Ds(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Xh[s];if(r===void 0&&(r=new Float32Array(s),Xh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Fo(i,t){let e=qh[t];e===void 0&&(e=new Int32Array(t),qh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Dm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Nm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function Um(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function Fm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function Om(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Jh.set(n),i.uniformMatrix2fv(this.addr,!1,Jh),De(e,n)}}function Bm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Zh.set(n),i.uniformMatrix3fv(this.addr,!1,Zh),De(e,n)}}function zm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Yh.set(n),i.uniformMatrix4fv(this.addr,!1,Yh),De(e,n)}}function km(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Vm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function Gm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function Hm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function Wm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Xm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function qm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function Ym(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function Zm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(oc.compareFunction=e.isReversedDepthBuffer()?Po:Co,r=oc):r=hu,e.setTexture2D(t||r,s)}function Jm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||du,s)}function Km(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||fu,s)}function $m(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||uu,s)}function jm(i){switch(i){case 5126:return Dm;case 35664:return Nm;case 35665:return Um;case 35666:return Fm;case 35674:return Om;case 35675:return Bm;case 35676:return zm;case 5124:case 35670:return km;case 35667:case 35671:return Vm;case 35668:case 35672:return Gm;case 35669:case 35673:return Hm;case 5125:return Wm;case 36294:return Xm;case 36295:return qm;case 36296:return Ym;case 35678:case 36198:case 36298:case 36306:case 35682:return Zm;case 35679:case 36299:case 36307:return Jm;case 35680:case 36300:case 36308:case 36293:return Km;case 36289:case 36303:case 36311:case 36292:return $m}}function Qm(i,t){i.uniform1fv(this.addr,t)}function tg(i,t){let e=Ds(t,this.size,2);i.uniform2fv(this.addr,e)}function eg(i,t){let e=Ds(t,this.size,3);i.uniform3fv(this.addr,e)}function ng(i,t){let e=Ds(t,this.size,4);i.uniform4fv(this.addr,e)}function ig(i,t){let e=Ds(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function sg(i,t){let e=Ds(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function rg(i,t){let e=Ds(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ag(i,t){i.uniform1iv(this.addr,t)}function og(i,t){i.uniform2iv(this.addr,t)}function lg(i,t){i.uniform3iv(this.addr,t)}function cg(i,t){i.uniform4iv(this.addr,t)}function hg(i,t){i.uniform1uiv(this.addr,t)}function ug(i,t){i.uniform2uiv(this.addr,t)}function dg(i,t){i.uniform3uiv(this.addr,t)}function fg(i,t){i.uniform4uiv(this.addr,t)}function pg(i,t,e){let n=this.cache,s=t.length,r=Fo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=oc:a=hu;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function mg(i,t,e){let n=this.cache,s=t.length,r=Fo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||du,r[a])}function gg(i,t,e){let n=this.cache,s=t.length,r=Fo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||fu,r[a])}function _g(i,t,e){let n=this.cache,s=t.length,r=Fo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||uu,r[a])}function xg(i){switch(i){case 5126:return Qm;case 35664:return tg;case 35665:return eg;case 35666:return ng;case 35674:return ig;case 35675:return sg;case 35676:return rg;case 5124:case 35670:return ag;case 35667:case 35671:return og;case 35668:case 35672:return lg;case 35669:case 35673:return cg;case 5125:return hg;case 36294:return ug;case 36295:return dg;case 36296:return fg;case 35678:case 36198:case 36298:case 36306:case 35682:return pg;case 35679:case 36299:case 36307:return mg;case 35680:case 36300:case 36308:case 36293:return gg;case 36289:case 36303:case 36311:case 36292:return _g}}var lc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=jm(e.type)}},cc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xg(e.type)}},hc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},rc=/(\w+)(\])?(\[|\.)?/g;function Kh(i,t){i.seq.push(t),i.map[t.id]=t}function yg(i,t,e){let n=i.name,s=n.length;for(rc.lastIndex=0;;){let r=rc.exec(n),a=rc.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Kh(e,l===void 0?new lc(o,i,t):new cc(o,i,t));break}else{let m=e.map[o];m===void 0&&(m=new hc(o),Kh(e,m)),e=m}}}var Is=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);yg(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function $h(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var vg=37297,Mg=0;function Sg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var jh=new Vt;function bg(i){ee._getMatrix(jh,ee.workingColorSpace,i);let t=`mat3( ${jh.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(i)){case Zs:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return Ut("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Qh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Sg(i.getShaderSource(t),o)}else return r}function Eg(i,t){let e=bg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Tg={[Pl]:"Linear",[Il]:"Reinhard",[Ll]:"Cineon",[gr]:"ACESFilmic",[Nl]:"AgX",[Ul]:"Neutral",[Dl]:"Custom"};function wg(i,t){let e=Tg[t];return e===void 0?(Ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Lo=new U;function Ag(){ee.getLuminanceCoefficients(Lo);let i=Lo.x.toFixed(4),t=Lo.y.toFixed(4),e=Lo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rr).join(`
`)}function Cg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Pg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Rr(i){return i!==""}function tu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function eu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ig=/^[ \t]*#include +<([\w\d./]+)>/gm;function uc(i){return i.replace(Ig,Dg)}var Lg=new Map;function Dg(i,t){let e=Zt[t];if(e===void 0){let n=Lg.get(t);if(n!==void 0)e=Zt[n],Ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return uc(e)}var Ng=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nu(i){return i.replace(Ng,Ug)}function Ug(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function iu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Fg={[mr]:"SHADOWMAP_TYPE_PCF",[bs]:"SHADOWMAP_TYPE_VSM"};function Og(i){return Fg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Bg={[Ei]:"ENVMAP_TYPE_CUBE",[Vi]:"ENVMAP_TYPE_CUBE",[_r]:"ENVMAP_TYPE_CUBE_UV"};function zg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Bg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var kg={[Vi]:"ENVMAP_MODE_REFRACTION"};function Vg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":kg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Gg={[Va]:"ENVMAP_BLENDING_MULTIPLY",[vh]:"ENVMAP_BLENDING_MIX",[Mh]:"ENVMAP_BLENDING_ADD"};function Hg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Gg[i.combine]||"ENVMAP_BLENDING_NONE"}function Wg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Xg(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=Og(e),l=zg(e),u=Vg(e),m=Hg(e),h=Wg(e),p=Rg(e),_=Cg(r),v=s.createProgram(),f,d,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Rr).join(`
`),f.length>0&&(f+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Rr).join(`
`),d.length>0&&(d+=`
`)):(f=[iu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rr).join(`
`),d=[iu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+m:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Cn?"#define TONE_MAPPING":"",e.toneMapping!==Cn?Zt.tonemapping_pars_fragment:"",e.toneMapping!==Cn?wg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,Eg("linearToOutputTexel",e.outputColorSpace),Ag(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Rr).join(`
`)),a=uc(a),a=tu(a,e),a=eu(a,e),o=uc(o),o=tu(o,e),o=eu(o,e),a=nu(a),o=nu(o),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,d=["#define varying in",e.glslVersion===Hl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let R=E+f+a,M=E+d+o,b=$h(s,s.VERTEX_SHADER,R),S=$h(s,s.FRAGMENT_SHADER,M);s.attachShader(v,b),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(F){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(v)||"",V=s.getShaderInfoLog(b)||"",N=s.getShaderInfoLog(S)||"",G=O.trim(),q=V.trim(),J=N.trim(),st=!0,Y=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(st=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,b,S);else{let nt=Qh(s,b,"vertex"),it=Qh(s,S,"fragment");Ot("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+G+`
`+nt+`
`+it)}else G!==""?Ut("WebGLProgram: Program Info Log:",G):(q===""||J==="")&&(Y=!1);Y&&(F.diagnostics={runnable:st,programLog:G,vertexShader:{log:q,prefix:f},fragmentShader:{log:J,prefix:d}})}s.deleteShader(b),s.deleteShader(S),x=new Is(s,v),T=Pg(s,v)}let x;this.getUniforms=function(){return x===void 0&&A(this),x};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(v,vg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Mg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=S,this}var qg=0,dc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new fc(t),e.set(t,n)),n}},fc=class{constructor(t){this.id=qg++,this.code=t,this.usedTimes=0}};function Yg(i){return i===Ai||i===br||i===Er}function Zg(i,t,e,n,s,r){let a=new ms,o=new dc,c=new Set,l=[],u=new Map,m=n.logarithmicDepthBuffer,h=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return c.add(x),x===0?"uv":`uv${x}`}function v(x,T,C,F,O,V){let N=F.fog,G=O.geometry,q=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?F.environment:null,J=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,st=t.get(x.envMap||q,J),Y=st&&st.mapping===_r?st.image.height:null,nt=p[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&Ut("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let it=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Nt=it!==void 0?it.length:0,Pt=0;G.morphAttributes.position!==void 0&&(Pt=1),G.morphAttributes.normal!==void 0&&(Pt=2),G.morphAttributes.color!==void 0&&(Pt=3);let me,Kt,se,$;if(nt){let re=Yn[nt];me=re.vertexShader,Kt=re.fragmentShader}else{me=x.vertexShader,Kt=x.fragmentShader;let re=o.getVertexShaderStage(x),ie=o.getFragmentShaderStage(x);o.update(x,re,ie),se=re.id,$=ie.id}let et=i.getRenderTarget(),wt=i.state.buffers.depth.getReversed(),zt=O.isInstancedMesh===!0,bt=O.isBatchedMesh===!0,Bt=!!x.map,xe=!!x.matcap,Ht=!!st,$t=!!x.aoMap,ue=!!x.lightMap,Jt=!!x.bumpMap&&x.wireframe===!1,le=!!x.normalMap,be=!!x.displacementMap,Pe=!!x.emissiveMap,de=!!x.metalnessMap,Ee=!!x.roughnessMap,I=x.anisotropy>0,Wt=x.clearcoat>0,Mt=x.dispersion>0,w=x.retroreflectivity>0,g=x.iridescence>0,B=x.sheen>0,H=x.transmission>0,X=I&&!!x.anisotropyMap,ot=Wt&&!!x.clearcoatMap,lt=Wt&&!!x.clearcoatNormalMap,Z=Wt&&!!x.clearcoatRoughnessMap,K=g&&!!x.iridescenceMap,ut=g&&!!x.iridescenceThicknessMap,It=B&&!!x.sheenColorMap,ft=B&&!!x.sheenRoughnessMap,ct=!!x.specularMap,yt=!!x.specularColorMap,Tt=!!x.specularIntensityMap,kt=H&&!!x.transmissionMap,D=H&&!!x.thicknessMap,pt=!!x.gradientMap,j=!!x.alphaMap,rt=x.alphaTest>0,_t=!!x.alphaHash,Q=!!x.extensions,Lt=Cn;x.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Lt=i.toneMapping);let Et={shaderID:nt,shaderType:x.type,shaderName:x.name,vertexShader:me,fragmentShader:Kt,defines:x.defines,customVertexShaderID:se,customFragmentShaderID:$,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:bt,batchingColor:bt&&O._colorsTexture!==null,instancing:zt,instancingColor:zt&&O.instanceColor!==null,instancingMorph:zt&&O.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ee.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Bt,matcap:xe,envMap:Ht,envMapMode:Ht&&st.mapping,envMapCubeUVHeight:Y,aoMap:$t,lightMap:ue,bumpMap:Jt,normalMap:le,displacementMap:be,emissiveMap:Pe,normalMapObjectSpace:le&&x.normalMapType===Eh,normalMapTangentSpace:le&&x.normalMapType===Tr,packedNormalMap:le&&x.normalMapType===Tr&&Yg(x.normalMap.format),metalnessMap:de,roughnessMap:Ee,anisotropy:I,anisotropyMap:X,clearcoat:Wt,clearcoatMap:ot,clearcoatNormalMap:lt,clearcoatRoughnessMap:Z,dispersion:Mt,retroreflection:w,iridescence:g,iridescenceMap:K,iridescenceThicknessMap:ut,sheen:B,sheenColorMap:It,sheenRoughnessMap:ft,specularMap:ct,specularColorMap:yt,specularIntensityMap:Tt,transmission:H,transmissionMap:kt,thicknessMap:D,gradientMap:pt,opaque:x.transparent===!1&&x.blending===Es&&x.alphaToCoverage===!1,alphaMap:j,alphaTest:rt,alphaHash:_t,combine:x.combine,mapUv:Bt&&_(x.map.channel),aoMapUv:$t&&_(x.aoMap.channel),lightMapUv:ue&&_(x.lightMap.channel),bumpMapUv:Jt&&_(x.bumpMap.channel),normalMapUv:le&&_(x.normalMap.channel),displacementMapUv:be&&_(x.displacementMap.channel),emissiveMapUv:Pe&&_(x.emissiveMap.channel),metalnessMapUv:de&&_(x.metalnessMap.channel),roughnessMapUv:Ee&&_(x.roughnessMap.channel),anisotropyMapUv:X&&_(x.anisotropyMap.channel),clearcoatMapUv:ot&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:lt&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:ut&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:It&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:ft&&_(x.sheenRoughnessMap.channel),specularMapUv:ct&&_(x.specularMap.channel),specularColorMapUv:yt&&_(x.specularColorMap.channel),specularIntensityMapUv:Tt&&_(x.specularIntensityMap.channel),transmissionMapUv:kt&&_(x.transmissionMap.channel),thicknessMapUv:D&&_(x.thicknessMap.channel),alphaMapUv:j&&_(x.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(le||I),vertexNormals:!!G.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!G.attributes.uv&&(Bt||j),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||G.attributes.normal===void 0&&le===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:wt,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Nt,morphTextureStride:Pt,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Lt,decodeVideoTexture:Bt&&x.map.isVideoTexture===!0&&ee.getTransfer(x.map.colorSpace)===he,decodeVideoTextureEmissive:Pe&&x.emissiveMap.isVideoTexture===!0&&ee.getTransfer(x.emissiveMap.colorSpace)===he,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Wn,flipSided:x.side===Ge,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Q&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Q&&x.extensions.multiDraw===!0||bt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Et.vertexUv1s=c.has(1),Et.vertexUv2s=c.has(2),Et.vertexUv3s=c.has(3),c.clear(),Et}function f(x){let T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(let C in x.defines)T.push(C),T.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(d(T,x),E(T,x),T.push(i.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function d(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numSunLights),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numSunLightShadows),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function E(x,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function R(x){let T=p[x.type],C;if(T){let F=Yn[T];C=Bh.clone(F.uniforms)}else C=x.uniforms;return C}function M(x,T){let C=u.get(T);return C!==void 0?++C.usedTimes:(C=new Xg(i,T,x,s),l.push(C),u.set(T,C)),C}function b(x){if(--x.usedTimes===0){let T=l.indexOf(x);l[T]=l[l.length-1],l.pop(),u.delete(x.cacheKey),x.destroy()}}function S(x){o.remove(x)}function A(){o.dispose()}return{getParameters:v,getProgramCacheKey:f,getUniforms:R,acquireProgram:M,releaseProgram:b,releaseShaderCache:S,programs:l,dispose:A}}function Jg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Kg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function su(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ru(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function o(h,p,_,v,f,d){let E=i[t];return E===void 0?(E={id:h.id,object:h,geometry:p,material:_,materialVariant:a(h),groupOrder:v,renderOrder:h.renderOrder,z:f,group:d},i[t]=E):(E.id=h.id,E.object=h,E.geometry=p,E.material=_,E.materialVariant=a(h),E.groupOrder=v,E.renderOrder=h.renderOrder,E.z=f,E.group=d),t++,E}function c(h,p,_,v,f,d,E){E.reversedDepth===!0&&(f=-f);let R=o(h,p,_,v,f,d);_.transmission>0?n.push(R):_.transparent===!0?s.push(R):e.push(R)}function l(h,p,_,v,f,d){let E=o(h,p,_,v,f,d);_.transmission>0?n.unshift(E):_.transparent===!0?s.unshift(E):e.unshift(E)}function u(h,p){e.length>1&&e.sort(h||Kg),n.length>1&&n.sort(p||su),s.length>1&&s.sort(p||su)}function m(){for(let h=t,p=i.length;h<p;h++){let _=i[h];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:m,sort:u}}function $g(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new ru,i.set(n,[a])):s>=r.length?(a=new ru,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function jg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new U,color:new Gt};break;case"SpotLight":e={position:new U,direction:new U,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function Qg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var t0=0;function e0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function n0(i){let t=new jg,e=Qg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);let s=new U,r=new ne,a=new ne;function o(l){let u=0,m=0,h=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let p=0,_=0,v=0,f=0,d=0,E=0,R=0,M=0,b=0,S=0,A=0,x=0,T=0,C=0;l.sort(e0);for(let O=0,V=l.length;O<V;O++){let N=l[O],G=N.color,q=N.intensity,J=N.distance,st=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Ai?st=N.shadow.map.texture:st=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=G.r*q,m+=G.g*q,h+=G.b*q;else if(N.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(N.sh.coefficients[Y],q);C++}else if(N.isSunLight){let Y=t.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let nt=N.shadow,it=e.get(N);it.shadowIntensity=nt.intensity,it.shadowBias=nt.bias,it.shadowNormalBias=nt.normalBias,it.shadowRadius=nt.radius,it.shadowMapSize.copy(nt.mapSize).multiply(nt.getFrameExtents()),n.sunShadow[_]=it,n.sunShadowMap[_]=st;let Nt=nt.getViewportCount();for(let Pt=0;Pt<Nt;Pt++)n.sunShadowMatrix[v+Pt]=nt.getMatrix(Pt),n.sunShadowCascade[v+Pt]=nt._cascadeData[Pt];v+=Nt,_++}n.sun[p]=Y,p++}else if(N.isDirectionalLight){let Y=t.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let nt=N.shadow,it=e.get(N);it.shadowIntensity=nt.intensity,it.shadowBias=nt.bias,it.shadowNormalBias=nt.normalBias,it.shadowRadius=nt.radius,it.shadowMapSize=nt.mapSize,n.directionalShadow[f]=it,n.directionalShadowMap[f]=st,n.directionalShadowMatrix[f]=N.shadow.matrix,b++}n.directional[f]=Y,f++}else if(N.isSpotLight){let Y=t.get(N);Y.position.setFromMatrixPosition(N.matrixWorld),Y.color.copy(G).multiplyScalar(q),Y.distance=J,Y.coneCos=Math.cos(N.angle),Y.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),Y.decay=N.decay,n.spot[E]=Y;let nt=N.shadow;if(N.map&&(n.spotLightMap[x]=N.map,x++,nt.updateMatrices(N),N.castShadow&&T++),n.spotLightMatrix[E]=nt.matrix,N.castShadow){let it=e.get(N);it.shadowIntensity=nt.intensity,it.shadowBias=nt.bias,it.shadowNormalBias=nt.normalBias,it.shadowRadius=nt.radius,it.shadowMapSize=nt.mapSize,n.spotShadow[E]=it,n.spotShadowMap[E]=st,A++}E++}else if(N.isRectAreaLight){let Y=t.get(N);Y.color.copy(G).multiplyScalar(q),Y.halfWidth.set(N.width*.5,0,0),Y.halfHeight.set(0,N.height*.5,0),n.rectArea[R]=Y,R++}else if(N.isPointLight){let Y=t.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),Y.distance=N.distance,Y.decay=N.decay,N.castShadow){let nt=N.shadow,it=e.get(N);it.shadowIntensity=nt.intensity,it.shadowBias=nt.bias,it.shadowNormalBias=nt.normalBias,it.shadowRadius=nt.radius,it.shadowMapSize=nt.mapSize,it.shadowCameraNear=nt.camera.near,it.shadowCameraFar=nt.camera.far,n.pointShadow[d]=it,n.pointShadowMap[d]=st,n.pointShadowMatrix[d]=N.shadow.matrix,S++}n.point[d]=Y,d++}else if(N.isHemisphereLight){let Y=t.get(N);Y.skyColor.copy(N.color).multiplyScalar(q),Y.groundColor.copy(N.groundColor).multiplyScalar(q),n.hemi[M]=Y,M++}}R>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xt.LTC_FLOAT_1,n.rectAreaLTC2=xt.LTC_FLOAT_2):(n.rectAreaLTC1=xt.LTC_HALF_1,n.rectAreaLTC2=xt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=m,n.ambient[2]=h;let F=n.hash;(F.sunLength!==p||F.directionalLength!==f||F.pointLength!==d||F.spotLength!==E||F.rectAreaLength!==R||F.hemiLength!==M||F.numSunShadows!==_||F.numDirectionalShadows!==b||F.numPointShadows!==S||F.numSpotShadows!==A||F.numSpotMaps!==x||F.numLightProbes!==C)&&(n.sun.length=p,n.directional.length=f,n.spot.length=E,n.rectArea.length=R,n.point.length=d,n.hemi.length=M,n.sunShadow.length=_,n.sunShadowMap.length=_,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+x-T,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=C,F.sunLength=p,F.directionalLength=f,F.pointLength=d,F.spotLength=E,F.rectAreaLength=R,F.hemiLength=M,F.numSunShadows=_,F.numDirectionalShadows=b,F.numPointShadows=S,F.numSpotShadows=A,F.numSpotMaps=x,F.numLightProbes=C,n.version=t0++)}function c(l,u){let m=0,h=0,p=0,_=0,v=0,f=0,d=u.matrixWorldInverse;for(let E=0,R=l.length;E<R;E++){let M=l[E];if(M.isSunLight){let b=n.sun[m];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(d),m++}else if(M.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),h++}else if(M.isSpotLight){let b=n.spot[_];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(d),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),_++}else if(M.isRectAreaLight){let b=n.rectArea[v];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(d),a.identity(),r.copy(M.matrixWorld),r.premultiply(d),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){let b=n.point[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(d),p++}else if(M.isHemisphereLight){let b=n.hemi[f];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(d),f++}}}return{setup:o,setupView:c,state:n}}function au(i){let t=new n0(i),e=[],n=[],s=[];function r(h){m.camera=h,e.length=0,n.length=0,s.length=0}function a(h){e.push(h)}function o(h){n.push(h)}function c(h){s.push(h)}function l(){t.setup(e)}function u(h){t.setupView(e,h)}let m={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:m,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function i0(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new au(i),t.set(s,[o])):r>=a.length?(o=new au(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var s0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,r0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,a0=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],o0=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],ou=new ne,Ar=new U,ac=new U;function l0(i,t,e){let n=new _s,s=new Ft,r=new Ft,a=new Me,o=new Ta,c=new wa,l={},u=e.maxTextureSize,m={[bi]:Ge,[Ge]:bi,[Wn]:Wn},h=new un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ft},radius:{value:4}},vertexShader:s0,fragmentShader:r0}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let _=new Ae;_.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new oe(_,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mr;let d=this.type;this.render=function(S,A,x){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||S.length===0)return;this.type===ka&&(Ut("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=mr);let T=i.getRenderTarget(),C=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Xn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let V=d!==this.type;V&&A.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(G=>G.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,G=S.length;N<G;N++){let q=S[N],J=q.shadow;if(J===void 0){Ut("WebGLShadowMap:",q,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let st=J.getFrameExtents();s.multiply(st),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/st.x),s.x=r.x*st.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/st.y),s.y=r.y*st.y,J.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if(J.camera._reversedDepth=Y,J.map===null||V===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===bs){if(q.isPointLight){Ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new nn(s.x,s.y,{format:Ai,type:In,minFilter:ke,magFilter:ke,generateMipmaps:!1}),J.map.texture.name=q.name+".shadowMap",J.map.depthTexture=new gi(s.x,s.y,_n),J.map.depthTexture.name=q.name+".shadowMapDepth",J.map.depthTexture.format=zn,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Be,J.map.depthTexture.magFilter=Be}else q.isPointLight?(J.map=new Do(s.x),J.map.depthTexture=new ba(s.x,Pn)):(J.map=new nn(s.x,s.y),J.map.depthTexture=new gi(s.x,s.y,Pn)),J.map.depthTexture.name=q.name+".shadowMap",J.map.depthTexture.format=zn,this.type===mr?(J.map.depthTexture.compareFunction=Y?Po:Co,J.map.depthTexture.minFilter=ke,J.map.depthTexture.magFilter=ke):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Be,J.map.depthTexture.magFilter=Be);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let nt=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();q.isPointLight!==!0&&J.updateMatrices(q,x);for(let it=0;it<nt;it++){let Nt=J.getCamera(it);if(q.isPointLight){let Pt=J.camera,me=J.matrix,Kt=q.distance||Pt.far;Kt!==Pt.far&&(Pt.far=Kt,Pt.updateProjectionMatrix()),Ar.setFromMatrixPosition(q.matrixWorld),Pt.position.copy(Ar),ac.copy(Pt.position),ac.add(a0[it]),Pt.up.copy(o0[it]),Pt.lookAt(ac),Pt.updateMatrixWorld(),me.makeTranslation(-Ar.x,-Ar.y,-Ar.z),ou.multiplyMatrices(Pt.projectionMatrix,Pt.matrixWorldInverse),J._frustum.setFromProjectionMatrix(ou,Pt.coordinateSystem,Pt.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)i.setRenderTarget(J.map,it),i.clear();else{it===0&&(i.setRenderTarget(J.map),i.clear());let Pt=J.getViewport(it);a.set(r.x*Pt.x,r.y*Pt.y,r.x*Pt.z,r.y*Pt.w),O.viewport(a)}n=J.getFrustum(it),M(A,x,Nt,q,this.type)}J.isPointLightShadow!==!0&&this.type===bs&&E(J,x),J.needsUpdate=!1}d=this.type,f.needsUpdate=!1,i.setRenderTarget(T,C,F)};function E(S,A){let x=t.update(v);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null?S.mapPass=new nn(s.x,s.y,{format:Ai,type:In}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),h.uniforms.shadow_pass.value=S.map.depthTexture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,x,h,v,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value.set(S.map.width,S.map.height),p.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,x,p,v,null)}function R(S,A,x,T){let C=null,F=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(F!==void 0)C=F;else if(C=x.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let O=C.uuid,V=A.uuid,N=l[O];N===void 0&&(N={},l[O]=N);let G=N[V];G===void 0&&(G=C.clone(),N[V]=G,A.addEventListener("dispose",b)),C=G}if(C.visible=A.visible,C.wireframe=A.wireframe,T===bs?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:m[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let O=i.properties.get(C);O.light=x}return C}function M(S,A,x,T,C){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===bs)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);let V=t.update(S),N=S.material;if(Array.isArray(N)){let G=V.groups;for(let q=0,J=G.length;q<J;q++){let st=G[q],Y=N[st.materialIndex];if(Y&&Y.visible){let nt=R(S,Y,T,C);S.onBeforeShadow(i,S,A,x,V,nt,st),i.renderBufferDirect(x,null,V,nt,S,st),S.onAfterShadow(i,S,A,x,V,nt,st)}}}else if(N.visible){let G=R(S,N,T,C);S.onBeforeShadow(i,S,A,x,V,G,null),i.renderBufferDirect(x,null,V,G,S,null),S.onAfterShadow(i,S,A,x,V,G,null)}}let O=S.children;for(let V=0,N=O.length;V<N;V++)M(O[V],A,x,T,C)}function b(S){S.target.removeEventListener("dispose",b);for(let x in l){let T=l[x],C=S.target.uuid;C in T&&(T[C].dispose(),delete T[C])}}}function c0(i,t){function e(){let D=!1,pt=new Me,j=null,rt=new Me(0,0,0,0);return{setMask:function(_t){j!==_t&&!D&&(i.colorMask(_t,_t,_t,_t),j=_t)},setLocked:function(_t){D=_t},setClear:function(_t,Q,Lt,Et,re){re===!0&&(_t*=Et,Q*=Et,Lt*=Et),pt.set(_t,Q,Lt,Et),rt.equals(pt)===!1&&(i.clearColor(_t,Q,Lt,Et),rt.copy(pt))},reset:function(){D=!1,j=null,rt.set(-1,0,0,0)}}}function n(){let D=!1,pt=!1,j=null,rt=null,_t=null;return{setReversed:function(Q){if(pt!==Q){let Lt=t.get("EXT_clip_control");Q?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),pt=Q;let Et=_t;_t=null,this.setClear(Et)}},getReversed:function(){return pt},setTest:function(Q){Q?et(i.DEPTH_TEST):wt(i.DEPTH_TEST)},setMask:function(Q){j!==Q&&!D&&(i.depthMask(Q),j=Q)},setFunc:function(Q){if(pt&&(Q=Fh[Q]),rt!==Q){switch(Q){case oa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case hs:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}rt=Q}},setLocked:function(Q){D=Q},setClear:function(Q){_t!==Q&&(_t=Q,pt&&(Q=1-Q),i.clearDepth(Q))},reset:function(){D=!1,j=null,rt=null,_t=null,pt=!1}}}function s(){let D=!1,pt=null,j=null,rt=null,_t=null,Q=null,Lt=null,Et=null,re=null;return{setTest:function(ie){D||(ie?et(i.STENCIL_TEST):wt(i.STENCIL_TEST))},setMask:function(ie){pt!==ie&&!D&&(i.stencilMask(ie),pt=ie)},setFunc:function(ie,Ue,fn){(j!==ie||rt!==Ue||_t!==fn)&&(i.stencilFunc(ie,Ue,fn),j=ie,rt=Ue,_t=fn)},setOp:function(ie,Ue,fn){(Q!==ie||Lt!==Ue||Et!==fn)&&(i.stencilOp(ie,Ue,fn),Q=ie,Lt=Ue,Et=fn)},setLocked:function(ie){D=ie},setClear:function(ie){re!==ie&&(i.clearStencil(ie),re=ie)},reset:function(){D=!1,pt=null,j=null,rt=null,_t=null,Q=null,Lt=null,Et=null,re=null}}}let r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap,u={},m={},h={},p=new WeakMap,_=[],v=null,f=!1,d=null,E=null,R=null,M=null,b=null,S=null,A=null,x=new Gt(0,0,0),T=0,C=!1,F=null,O=null,V=null,N=null,G=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,st=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(Y)[1]),J=st>=1):Y.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),J=st>=2);let nt=null,it={},Nt=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),me=new Me().fromArray(Nt),Kt=new Me().fromArray(Pt);function se(D,pt,j,rt){let _t=new Uint8Array(4),Q=i.createTexture();i.bindTexture(D,Q),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<j;Lt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,rt,0,i.RGBA,i.UNSIGNED_BYTE,_t):i.texImage2D(pt+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_t);return Q}let $={};$[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(hs),Jt(!1),le(El),et(i.CULL_FACE),$t(Xn);function et(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function wt(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function zt(D,pt){return h[D]!==pt?(i.bindFramebuffer(D,pt),h[D]=pt,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pt),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function bt(D,pt){let j=_,rt=!1;if(D){j=p.get(pt),j===void 0&&(j=[],p.set(pt,j));let _t=D.textures;if(j.length!==_t.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Lt=_t.length;Q<Lt;Q++)j[Q]=i.COLOR_ATTACHMENT0+Q;j.length=_t.length,rt=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,rt=!0);rt&&i.drawBuffers(j)}function Bt(D){return v!==D?(i.useProgram(D),v=D,!0):!1}let xe={[ki]:i.FUNC_ADD,[ih]:i.FUNC_SUBTRACT,[sh]:i.FUNC_REVERSE_SUBTRACT};xe[rh]=i.MIN,xe[ah]=i.MAX;let Ht={[oh]:i.ZERO,[lh]:i.ONE,[ch]:i.SRC_COLOR,[Rl]:i.SRC_ALPHA,[mh]:i.SRC_ALPHA_SATURATE,[fh]:i.DST_COLOR,[uh]:i.DST_ALPHA,[hh]:i.ONE_MINUS_SRC_COLOR,[Cl]:i.ONE_MINUS_SRC_ALPHA,[ph]:i.ONE_MINUS_DST_COLOR,[dh]:i.ONE_MINUS_DST_ALPHA,[gh]:i.CONSTANT_COLOR,[_h]:i.ONE_MINUS_CONSTANT_COLOR,[xh]:i.CONSTANT_ALPHA,[yh]:i.ONE_MINUS_CONSTANT_ALPHA};function $t(D,pt,j,rt,_t,Q,Lt,Et,re,ie){if(D===Xn){f===!0&&(wt(i.BLEND),f=!1);return}if(f===!1&&(et(i.BLEND),f=!0),D!==nh){if(D!==d||ie!==C){if((E!==ki||b!==ki)&&(i.blendEquation(i.FUNC_ADD),E=ki,b=ki),ie)switch(D){case Es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tl:i.blendFunc(i.ONE,i.ONE);break;case wl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Al:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ot("WebGLState: Invalid blending: ",D);break}else switch(D){case Es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case wl:Ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Al:Ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ot("WebGLState: Invalid blending: ",D);break}R=null,M=null,S=null,A=null,x.set(0,0,0),T=0,d=D,C=ie}return}_t=_t||pt,Q=Q||j,Lt=Lt||rt,(pt!==E||_t!==b)&&(i.blendEquationSeparate(xe[pt],xe[_t]),E=pt,b=_t),(j!==R||rt!==M||Q!==S||Lt!==A)&&(i.blendFuncSeparate(Ht[j],Ht[rt],Ht[Q],Ht[Lt]),R=j,M=rt,S=Q,A=Lt),(Et.equals(x)===!1||re!==T)&&(i.blendColor(Et.r,Et.g,Et.b,re),x.copy(Et),T=re),d=D,C=!1}function ue(D,pt){D.side===Wn?wt(i.CULL_FACE):et(i.CULL_FACE);let j=D.side===Ge;pt&&(j=!j),Jt(j),D.blending===Es&&D.transparent===!1?$t(Xn):$t(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);let rt=D.stencilWrite;o.setTest(rt),rt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Pe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):wt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(D){F!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),F=D)}function le(D){D!==th?(et(i.CULL_FACE),D!==O&&(D===El?i.cullFace(i.BACK):D===eh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):wt(i.CULL_FACE),O=D}function be(D){D!==V&&(J&&i.lineWidth(D),V=D)}function Pe(D,pt,j){D?(et(i.POLYGON_OFFSET_FILL),(N!==pt||G!==j)&&(N=pt,G=j,a.getReversed()&&(pt=-pt),i.polygonOffset(pt,j))):wt(i.POLYGON_OFFSET_FILL)}function de(D){D?et(i.SCISSOR_TEST):wt(i.SCISSOR_TEST)}function Ee(D){D===void 0&&(D=i.TEXTURE0+q-1),nt!==D&&(i.activeTexture(D),nt=D)}function I(D,pt,j){j===void 0&&(nt===null?j=i.TEXTURE0+q-1:j=nt);let rt=it[j];rt===void 0&&(rt={type:void 0,texture:void 0},it[j]=rt),(rt.type!==D||rt.texture!==pt)&&(nt!==j&&(i.activeTexture(j),nt=j),i.bindTexture(D,pt||$[D]),rt.type=D,rt.texture=pt)}function Wt(){let D=it[nt];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Mt(){try{i.compressedTexImage2D(...arguments)}catch(D){Ot("WebGLState:",D)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(D){Ot("WebGLState:",D)}}function g(){try{i.texSubImage2D(...arguments)}catch(D){Ot("WebGLState:",D)}}function B(){try{i.texSubImage3D(...arguments)}catch(D){Ot("WebGLState:",D)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Ot("WebGLState:",D)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Ot("WebGLState:",D)}}function ot(){try{i.texStorage2D(...arguments)}catch(D){Ot("WebGLState:",D)}}function lt(){try{i.texStorage3D(...arguments)}catch(D){Ot("WebGLState:",D)}}function Z(){try{i.texImage2D(...arguments)}catch(D){Ot("WebGLState:",D)}}function K(){try{i.texImage3D(...arguments)}catch(D){Ot("WebGLState:",D)}}function ut(D){return m[D]!==void 0?m[D]:i.getParameter(D)}function It(D,pt){m[D]!==pt&&(i.pixelStorei(D,pt),m[D]=pt)}function ft(D){me.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),me.copy(D))}function ct(D){Kt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Kt.copy(D))}function yt(D,pt){let j=l.get(pt);j===void 0&&(j=new WeakMap,l.set(pt,j));let rt=j.get(D);rt===void 0&&(rt=i.getUniformBlockIndex(pt,D.name),j.set(D,rt))}function Tt(D,pt){let rt=l.get(pt).get(D);c.get(pt)!==rt&&(i.uniformBlockBinding(pt,rt,D.__bindingPointIndex),c.set(pt,rt))}function kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},m={},nt=null,it={},h={},p=new WeakMap,_=[],v=null,f=!1,d=null,E=null,R=null,M=null,b=null,S=null,A=null,x=new Gt(0,0,0),T=0,C=!1,F=null,O=null,V=null,N=null,G=null,me.set(0,0,i.canvas.width,i.canvas.height),Kt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:wt,bindFramebuffer:zt,drawBuffers:bt,useProgram:Bt,setBlending:$t,setMaterial:ue,setFlipSided:Jt,setCullFace:le,setLineWidth:be,setPolygonOffset:Pe,setScissorTest:de,activeTexture:Ee,bindTexture:I,unbindTexture:Wt,compressedTexImage2D:Mt,compressedTexImage3D:w,texImage2D:Z,texImage3D:K,pixelStorei:It,getParameter:ut,updateUBOMapping:yt,uniformBlockBinding:Tt,texStorage2D:ot,texStorage3D:lt,texSubImage2D:g,texSubImage3D:B,compressedTexSubImage2D:H,compressedTexSubImage3D:X,scissor:ft,viewport:ct,reset:kt}}function h0(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ft,u=new WeakMap,m=new Set,h,p=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,g){return _?new OffscreenCanvas(w,g):Js("canvas")}function f(w,g,B){let H=1,X=Mt(w);if((X.width>B||X.height>B)&&(H=B/Math.max(X.width,X.height)),H<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let ot=Math.floor(H*X.width),lt=Math.floor(H*X.height);h===void 0&&(h=v(ot,lt));let Z=g?v(ot,lt):h;return Z.width=ot,Z.height=lt,Z.getContext("2d").drawImage(w,0,0,ot,lt),Ut("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+ot+"x"+lt+")."),Z}else return"data"in w&&Ut("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),w;return w}function d(w){return w.generateMipmaps}function E(w){i.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(w,g,B,H,X,ot=!1){if(w!==null){if(i[w]!==void 0)return i[w];Ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let lt;H&&(lt=t.get("EXT_texture_norm16"),lt||Ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=g;if(g===i.RED&&(B===i.FLOAT&&(Z=i.R32F),B===i.HALF_FLOAT&&(Z=i.R16F),B===i.UNSIGNED_BYTE&&(Z=i.R8),B===i.UNSIGNED_SHORT&&lt&&(Z=lt.R16_EXT),B===i.SHORT&&lt&&(Z=lt.R16_SNORM_EXT)),g===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.R8UI),B===i.UNSIGNED_SHORT&&(Z=i.R16UI),B===i.UNSIGNED_INT&&(Z=i.R32UI),B===i.BYTE&&(Z=i.R8I),B===i.SHORT&&(Z=i.R16I),B===i.INT&&(Z=i.R32I)),g===i.RG&&(B===i.FLOAT&&(Z=i.RG32F),B===i.HALF_FLOAT&&(Z=i.RG16F),B===i.UNSIGNED_BYTE&&(Z=i.RG8),B===i.UNSIGNED_SHORT&&lt&&(Z=lt.RG16_EXT),B===i.SHORT&&lt&&(Z=lt.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RG8UI),B===i.UNSIGNED_SHORT&&(Z=i.RG16UI),B===i.UNSIGNED_INT&&(Z=i.RG32UI),B===i.BYTE&&(Z=i.RG8I),B===i.SHORT&&(Z=i.RG16I),B===i.INT&&(Z=i.RG32I)),g===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),B===i.UNSIGNED_INT&&(Z=i.RGB32UI),B===i.BYTE&&(Z=i.RGB8I),B===i.SHORT&&(Z=i.RGB16I),B===i.INT&&(Z=i.RGB32I)),g===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),B===i.UNSIGNED_INT&&(Z=i.RGBA32UI),B===i.BYTE&&(Z=i.RGBA8I),B===i.SHORT&&(Z=i.RGBA16I),B===i.INT&&(Z=i.RGBA32I)),g===i.RGB&&(B===i.UNSIGNED_SHORT&&lt&&(Z=lt.RGB16_EXT),B===i.SHORT&&lt&&(Z=lt.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),g===i.RGBA){let K=ot?Zs:ee.getTransfer(X);B===i.FLOAT&&(Z=i.RGBA32F),B===i.HALF_FLOAT&&(Z=i.RGBA16F),B===i.UNSIGNED_BYTE&&(Z=K===he?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&lt&&(Z=lt.RGBA16_EXT),B===i.SHORT&&lt&&(Z=lt.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function b(w,g){let B;return w?g===null||g===Pn||g===ws?B=i.DEPTH24_STENCIL8:g===_n?B=i.DEPTH32F_STENCIL8:g===Ts&&(B=i.DEPTH24_STENCIL8,Ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===Pn||g===ws?B=i.DEPTH_COMPONENT24:g===_n?B=i.DEPTH_COMPONENT32F:g===Ts&&(B=i.DEPTH_COMPONENT16),B}function S(w,g){return d(w)===!0||w.isFramebufferTexture&&w.minFilter!==Be&&w.minFilter!==ke?Math.log2(Math.max(g.width,g.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?g.mipmaps.length:1}function A(w){let g=w.target;g.removeEventListener("dispose",A),T(g),g.isVideoTexture&&u.delete(g),g.isHTMLTexture&&m.delete(g)}function x(w){let g=w.target;g.removeEventListener("dispose",x),F(g)}function T(w){let g=n.get(w);if(g.__webglInit===void 0)return;let B=w.source,H=p.get(B);if(H){let X=H[g.__cacheKey];X.usedTimes--,X.usedTimes===0&&C(w),Object.keys(H).length===0&&p.delete(B)}n.remove(w)}function C(w){let g=n.get(w);i.deleteTexture(g.__webglTexture);let B=w.source,H=p.get(B);delete H[g.__cacheKey],a.memory.textures--}function F(w){let g=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(g.__webglFramebuffer[H]))for(let X=0;X<g.__webglFramebuffer[H].length;X++)i.deleteFramebuffer(g.__webglFramebuffer[H][X]);else i.deleteFramebuffer(g.__webglFramebuffer[H]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[H])}else{if(Array.isArray(g.__webglFramebuffer))for(let H=0;H<g.__webglFramebuffer.length;H++)i.deleteFramebuffer(g.__webglFramebuffer[H]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let H=0;H<g.__webglColorRenderbuffer.length;H++)g.__webglColorRenderbuffer[H]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[H]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let B=w.textures;for(let H=0,X=B.length;H<X;H++){let ot=n.get(B[H]);ot.__webglTexture&&(i.deleteTexture(ot.__webglTexture),a.memory.textures--),n.remove(B[H])}n.remove(w)}let O=0;function V(){O=0}function N(){return O}function G(w){O=w}function q(){let w=O;return w>=s.maxTextures&&Ut("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),O+=1,w}function J(w){let g=[];return g.push(w.wrapS),g.push(w.wrapT),g.push(w.wrapR||0),g.push(w.magFilter),g.push(w.minFilter),g.push(w.anisotropy),g.push(w.internalFormat),g.push(w.format),g.push(w.type),g.push(w.generateMipmaps),g.push(w.premultiplyAlpha),g.push(w.flipY),g.push(w.unpackAlignment),g.push(w.colorSpace),g.join()}function st(w,g){let B=n.get(w);if(w.isVideoTexture&&I(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){let H=w.image;if(H===null)Ut("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Ut("WebGLRenderer: Texture marked for update but image is incomplete");else{wt(B,w,g);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+g)}function Y(w,g){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){wt(B,w,g);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+g)}function nt(w,g){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){wt(B,w,g);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+g)}function it(w,g){let B=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){zt(B,w,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+g)}let Nt={[pa]:i.REPEAT,[On]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},Pt={[Be]:i.NEAREST,[Sh]:i.NEAREST_MIPMAP_NEAREST,[xr]:i.NEAREST_MIPMAP_LINEAR,[ke]:i.LINEAR,[Wa]:i.LINEAR_MIPMAP_NEAREST,[Ti]:i.LINEAR_MIPMAP_LINEAR},me={[wh]:i.NEVER,[Ih]:i.ALWAYS,[Ah]:i.LESS,[Co]:i.LEQUAL,[Rh]:i.EQUAL,[Po]:i.GEQUAL,[Ch]:i.GREATER,[Ph]:i.NOTEQUAL};function Kt(w,g){if(g.type===_n&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===ke||g.magFilter===Wa||g.magFilter===xr||g.magFilter===Ti||g.minFilter===ke||g.minFilter===Wa||g.minFilter===xr||g.minFilter===Ti)&&Ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Nt[g.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Nt[g.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Nt[g.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Pt[g.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Pt[g.minFilter]),g.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,me[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Be||g.minFilter!==xr&&g.minFilter!==Ti||g.type===_n&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function se(w,g){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,g.addEventListener("dispose",A));let H=g.source,X=p.get(H);X===void 0&&(X={},p.set(H,X));let ot=J(g);if(ot!==w.__cacheKey){X[ot]===void 0&&(X[ot]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),X[ot].usedTimes++;let lt=X[w.__cacheKey];lt!==void 0&&(X[w.__cacheKey].usedTimes--,lt.usedTimes===0&&C(g)),w.__cacheKey=ot,w.__webglTexture=X[ot].texture}return B}function $(w,g,B){return Math.floor(Math.floor(w/B)/g)}function et(w,g,B,H){let ot=w.updateRanges;if(ot.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,B,H,g.data);else{ot.sort((It,ft)=>It.start-ft.start);let lt=0;for(let It=1;It<ot.length;It++){let ft=ot[lt],ct=ot[It],yt=ft.start+ft.count,Tt=$(ct.start,g.width,4),kt=$(ft.start,g.width,4);ct.start<=yt+1&&Tt===kt&&$(ct.start+ct.count-1,g.width,4)===Tt?ft.count=Math.max(ft.count,ct.start+ct.count-ft.start):(++lt,ot[lt]=ct)}ot.length=lt+1;let Z=e.getParameter(i.UNPACK_ROW_LENGTH),K=e.getParameter(i.UNPACK_SKIP_PIXELS),ut=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let It=0,ft=ot.length;It<ft;It++){let ct=ot[It],yt=Math.floor(ct.start/4),Tt=Math.ceil(ct.count/4),kt=yt%g.width,D=Math.floor(yt/g.width),pt=Tt,j=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),e.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,kt,D,pt,j,B,H,g.data)}w.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,Z),e.pixelStorei(i.UNPACK_SKIP_PIXELS,K),e.pixelStorei(i.UNPACK_SKIP_ROWS,ut)}}function wt(w,g,B){let H=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(H=i.TEXTURE_3D);let X=se(w,g),ot=g.source;e.bindTexture(H,w.__webglTexture,i.TEXTURE0+B);let lt=n.get(ot);if(ot.version!==lt.__version||X===!0){if(e.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let j=ee.getPrimaries(ee.workingColorSpace),rt=g.colorSpace===ai?null:ee.getPrimaries(g.colorSpace),_t=g.colorSpace===ai||j===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t)}e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let K=f(g.image,!1,s.maxTextureSize);K=Wt(g,K);let ut=r.convert(g.format,g.colorSpace),It=r.convert(g.type),ft=M(g.internalFormat,ut,It,g.normalized,g.colorSpace,g.isVideoTexture);Kt(H,g);let ct,yt=g.mipmaps,Tt=g.isVideoTexture!==!0,kt=lt.__version===void 0||X===!0,D=ot.dataReady,pt=S(g,K);if(g.isDepthTexture)ft=b(g.format===wi,g.type),kt&&(Tt?e.texStorage2D(i.TEXTURE_2D,1,ft,K.width,K.height):e.texImage2D(i.TEXTURE_2D,0,ft,K.width,K.height,0,ut,It,null));else if(g.isDataTexture)if(yt.length>0){Tt&&kt&&e.texStorage2D(i.TEXTURE_2D,pt,ft,yt[0].width,yt[0].height);for(let j=0,rt=yt.length;j<rt;j++)ct=yt[j],Tt?D&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ct.width,ct.height,ut,It,ct.data):e.texImage2D(i.TEXTURE_2D,j,ft,ct.width,ct.height,0,ut,It,ct.data);g.generateMipmaps=!1}else Tt?(kt&&e.texStorage2D(i.TEXTURE_2D,pt,ft,K.width,K.height),D&&et(g,K,ut,It)):e.texImage2D(i.TEXTURE_2D,0,ft,K.width,K.height,0,ut,It,K.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Tt&&kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,ft,yt[0].width,yt[0].height,K.depth);for(let j=0,rt=yt.length;j<rt;j++)if(ct=yt[j],g.format!==xn)if(ut!==null)if(Tt){if(D)if(g.layerUpdates.size>0){let _t=Jl(ct.width,ct.height,g.format,g.type);for(let Q of g.layerUpdates){let Lt=ct.data.subarray(Q*_t/ct.data.BYTES_PER_ELEMENT,(Q+1)*_t/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Q,ct.width,ct.height,1,ut,Lt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ct.width,ct.height,K.depth,ut,ct.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,ft,ct.width,ct.height,K.depth,0,ct.data,0,0);else Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Tt?D&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ct.width,ct.height,K.depth,ut,It,ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,ft,ct.width,ct.height,K.depth,0,ut,It,ct.data);g.layerUpdates.size>0&&g.clearLayerUpdates()}else{Tt&&kt&&e.texStorage2D(i.TEXTURE_2D,pt,ft,yt[0].width,yt[0].height);for(let j=0,rt=yt.length;j<rt;j++)ct=yt[j],g.format!==xn?ut!==null?Tt?D&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,ct.width,ct.height,ut,ct.data):e.compressedTexImage2D(i.TEXTURE_2D,j,ft,ct.width,ct.height,0,ct.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?D&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ct.width,ct.height,ut,It,ct.data):e.texImage2D(i.TEXTURE_2D,j,ft,ct.width,ct.height,0,ut,It,ct.data)}else if(g.isDataArrayTexture)if(Tt){if(kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,ft,K.width,K.height,K.depth),D)if(g.layerUpdates.size>0){let j=Jl(K.width,K.height,g.format,g.type);for(let rt of g.layerUpdates){let _t=K.data.subarray(rt*j/K.data.BYTES_PER_ELEMENT,(rt+1)*j/K.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,rt,K.width,K.height,1,ut,It,_t)}g.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,ut,It,K.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ft,K.width,K.height,K.depth,0,ut,It,K.data);else if(g.isData3DTexture)Tt?(kt&&e.texStorage3D(i.TEXTURE_3D,pt,ft,K.width,K.height,K.depth),D&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,ut,It,K.data)):e.texImage3D(i.TEXTURE_3D,0,ft,K.width,K.height,K.depth,0,ut,It,K.data);else if(g.isFramebufferTexture){if(kt)if(Tt)e.texStorage2D(i.TEXTURE_2D,pt,ft,K.width,K.height);else{let j=K.width,rt=K.height;for(let _t=0;_t<pt;_t++)e.texImage2D(i.TEXTURE_2D,_t,ft,j,rt,0,ut,It,null),j>>=1,rt>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){let j=i.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),K.parentNode!==j){j.appendChild(K),m.add(g),j.onpaint=rt=>{let _t=rt.changedElements;for(let Q of m)_t.includes(Q.image)&&(Q.needsUpdate=!0)},j.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,K);else{let _t=i.RGBA,Q=i.RGBA,Lt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,_t,Q,Lt,K)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(yt.length>0){if(Tt&&kt){let j=Mt(yt[0]);e.texStorage2D(i.TEXTURE_2D,pt,ft,j.width,j.height)}for(let j=0,rt=yt.length;j<rt;j++)ct=yt[j],Tt?D&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ut,It,ct):e.texImage2D(i.TEXTURE_2D,j,ft,ut,It,ct);g.generateMipmaps=!1}else if(Tt){if(kt){let j=Mt(K);e.texStorage2D(i.TEXTURE_2D,pt,ft,j.width,j.height)}D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ut,It,K)}else e.texImage2D(i.TEXTURE_2D,0,ft,ut,It,K);d(g)&&E(H),lt.__version=ot.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function zt(w,g,B){if(g.image.length!==6)return;let H=se(w,g),X=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+B);let ot=n.get(X);if(X.version!==ot.__version||H===!0){e.activeTexture(i.TEXTURE0+B);let lt=ee.getPrimaries(ee.workingColorSpace),Z=g.colorSpace===ai?null:ee.getPrimaries(g.colorSpace),K=g.colorSpace===ai||lt===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let ut=g.isCompressedTexture||g.image[0].isCompressedTexture,It=g.image[0]&&g.image[0].isDataTexture,ft=[];for(let Q=0;Q<6;Q++)!ut&&!It?ft[Q]=f(g.image[Q],!0,s.maxCubemapSize):ft[Q]=It?g.image[Q].image:g.image[Q],ft[Q]=Wt(g,ft[Q]);let ct=ft[0],yt=r.convert(g.format,g.colorSpace),Tt=r.convert(g.type),kt=M(g.internalFormat,yt,Tt,g.normalized,g.colorSpace),D=g.isVideoTexture!==!0,pt=ot.__version===void 0||H===!0,j=X.dataReady,rt=S(g,ct);Kt(i.TEXTURE_CUBE_MAP,g);let _t;if(ut){D&&pt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,rt,kt,ct.width,ct.height);for(let Q=0;Q<6;Q++){_t=ft[Q].mipmaps;for(let Lt=0;Lt<_t.length;Lt++){let Et=_t[Lt];g.format!==xn?yt!==null?D?j&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt,0,0,Et.width,Et.height,yt,Et.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt,kt,Et.width,Et.height,0,Et.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt,0,0,Et.width,Et.height,yt,Tt,Et.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt,kt,Et.width,Et.height,0,yt,Tt,Et.data)}}}else{if(_t=g.mipmaps,D&&pt){_t.length>0&&rt++;let Q=Mt(ft[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,rt,kt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(It){D?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ft[Q].width,ft[Q].height,yt,Tt,ft[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,kt,ft[Q].width,ft[Q].height,0,yt,Tt,ft[Q].data);for(let Lt=0;Lt<_t.length;Lt++){let re=_t[Lt].image[Q].image;D?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt+1,0,0,re.width,re.height,yt,Tt,re.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt+1,kt,re.width,re.height,0,yt,Tt,re.data)}}else{D?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,yt,Tt,ft[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,kt,yt,Tt,ft[Q]);for(let Lt=0;Lt<_t.length;Lt++){let Et=_t[Lt];D?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt+1,0,0,yt,Tt,Et.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Lt+1,kt,yt,Tt,Et.image[Q])}}}d(g)&&E(i.TEXTURE_CUBE_MAP),ot.__version=X.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function bt(w,g,B,H,X,ot){let lt=r.convert(B.format,B.colorSpace),Z=r.convert(B.type),K=M(B.internalFormat,lt,Z,B.normalized,B.colorSpace),ut=n.get(g),It=n.get(B);if(It.__renderTarget=g,!ut.__hasExternalTextures){let ft=Math.max(1,g.width>>ot),ct=Math.max(1,g.height>>ot);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?e.texImage3D(X,ot,K,ft,ct,g.depth,0,lt,Z,null):e.texImage2D(X,ot,K,ft,ct,0,lt,Z,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Ee(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,X,It.__webglTexture,0,de(g)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,X,It.__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(w,g,B){if(i.bindRenderbuffer(i.RENDERBUFFER,w),g.depthBuffer){let H=g.depthTexture,X=H&&H.isDepthTexture?H.type:null,ot=b(g.stencilBuffer,X),lt=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ee(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de(g),ot,g.width,g.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,de(g),ot,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ot,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,w)}else{let H=g.textures;for(let X=0;X<H.length;X++){let ot=H[X],lt=r.convert(ot.format,ot.colorSpace),Z=r.convert(ot.type),K=M(ot.internalFormat,lt,Z,ot.normalized,ot.colorSpace);Ee(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de(g),K,g.width,g.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,de(g),K,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,K,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xe(w,g,B){let H=g.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let X=n.get(g.depthTexture);if(X.__renderTarget=g,(!X.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),H){if(X.__webglInit===void 0&&(X.__webglInit=!0,g.depthTexture.addEventListener("dispose",A)),X.__webglTexture===void 0){X.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Kt(i.TEXTURE_CUBE_MAP,g.depthTexture);let ut=r.convert(g.depthTexture.format),It=r.convert(g.depthTexture.type),ft;g.depthTexture.format===zn?ft=i.DEPTH_COMPONENT24:g.depthTexture.format===wi&&(ft=i.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,ft,g.width,g.height,0,ut,It,null)}}else st(g.depthTexture,0);let ot=X.__webglTexture,lt=de(g),Z=H?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,K=g.depthTexture.format===wi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===zn)Ee(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,Z,ot,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,K,Z,ot,0);else if(g.depthTexture.format===wi)Ee(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,Z,ot,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,K,Z,ot,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ht(w){let g=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==w.depthTexture){let H=w.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),H){let X=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,H.removeEventListener("dispose",X)};H.addEventListener("dispose",X),g.__depthDisposeCallback=X}g.__boundDepthTexture=H}if(w.depthTexture&&!g.__autoAllocateDepthBuffer)if(B)for(let H=0;H<6;H++)xe(g.__webglFramebuffer[H],w,H);else{let H=w.texture.mipmaps;H&&H.length>0?xe(g.__webglFramebuffer[0],w,0):xe(g.__webglFramebuffer,w,0)}else if(B){g.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[H]),g.__webglDepthbuffer[H]===void 0)g.__webglDepthbuffer[H]=i.createRenderbuffer(),Bt(g.__webglDepthbuffer[H],w,!1);else{let X=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=g.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ot)}}else{let H=w.texture.mipmaps;if(H&&H.length>0?e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Bt(g.__webglDepthbuffer,w,!1);else{let X=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ot)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function $t(w,g,B){let H=n.get(w);g!==void 0&&bt(H.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Ht(w)}function ue(w){let g=w.texture,B=n.get(w),H=n.get(g);w.addEventListener("dispose",x);let X=w.textures,ot=w.isWebGLCubeRenderTarget===!0,lt=X.length>1;if(lt||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=g.version,a.memory.textures++),ot){B.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0){B.__webglFramebuffer[Z]=[];for(let K=0;K<g.mipmaps.length;K++)B.__webglFramebuffer[Z][K]=i.createFramebuffer()}else B.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){B.__webglFramebuffer=[];for(let Z=0;Z<g.mipmaps.length;Z++)B.__webglFramebuffer[Z]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(lt)for(let Z=0,K=X.length;Z<K;Z++){let ut=n.get(X[Z]);ut.__webglTexture===void 0&&(ut.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Ee(w)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Z=0;Z<X.length;Z++){let K=X[Z];B.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[Z]);let ut=r.convert(K.format,K.colorSpace),It=r.convert(K.type),ft=M(K.internalFormat,ut,It,K.normalized,K.colorSpace,w.isXRRenderTarget===!0),ct=de(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,ft,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,B.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(B.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),Kt(i.TEXTURE_CUBE_MAP,g);for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)bt(B.__webglFramebuffer[Z][K],w,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,K);else bt(B.__webglFramebuffer[Z],w,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);d(g)&&E(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){for(let Z=0,K=X.length;Z<K;Z++){let ut=X[Z],It=n.get(ut),ft=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ft=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,It.__webglTexture),Kt(ft,ut),bt(B.__webglFramebuffer,w,ut,i.COLOR_ATTACHMENT0+Z,ft,0),d(ut)&&E(ft)}e.unbindTexture()}else{let Z=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Z,H.__webglTexture),Kt(Z,g),g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)bt(B.__webglFramebuffer[K],w,g,i.COLOR_ATTACHMENT0,Z,K);else bt(B.__webglFramebuffer,w,g,i.COLOR_ATTACHMENT0,Z,0);d(g)&&E(Z),e.unbindTexture()}w.depthBuffer&&Ht(w)}function Jt(w){let g=w.textures;for(let B=0,H=g.length;B<H;B++){let X=g[B];if(d(X)){let ot=R(w),lt=n.get(X).__webglTexture;e.bindTexture(ot,lt),E(ot),e.unbindTexture()}}}let le=[],be=[];function Pe(w){if(w.samples>0){if(Ee(w)===!1){let g=w.textures,B=w.width,H=w.height,X=i.COLOR_BUFFER_BIT,ot=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,lt=n.get(w),Z=g.length>1;if(Z)for(let ut=0;ut<g.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer);let K=w.texture.mipmaps;K&&K.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let ut=0;ut<g.length;ut++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,lt.__webglColorRenderbuffer[ut]);let It=n.get(g[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,It,0)}i.blitFramebuffer(0,0,B,H,0,0,B,H,X,i.NEAREST),c===!0&&(le.length=0,be.length=0,le.push(i.COLOR_ATTACHMENT0+ut),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(le.push(ot),be.push(ot),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,le))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let ut=0;ut<g.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,lt.__webglColorRenderbuffer[ut]);let It=n.get(g[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,It,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&c){let g=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function de(w){return Math.min(s.maxSamples,w.samples)}function Ee(w){let g=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function I(w){let g=a.render.frame;u.get(w)!==g&&(u.set(w,g),w.update())}function Wt(w,g){let B=w.colorSpace,H=w.format,X=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==Ys&&B!==ai&&(ee.getTransfer(B)===he?(H!==xn||X!==sn)&&Ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ot("WebGLTextures: Unsupported texture color space:",B)),g}function Mt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=q,this.resetTextureUnits=V,this.getTextureUnits=N,this.setTextureUnits=G,this.setTexture2D=st,this.setTexture2DArray=Y,this.setTexture3D=nt,this.setTextureCube=it,this.rebindTextures=$t,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=Jt,this.updateMultisampleRenderTarget=Pe,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Ee,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function u0(i,t){function e(n,s=ai){let r,a=ee.getTransfer(s);if(n===sn)return i.UNSIGNED_BYTE;if(n===qa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ya)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===kl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ol)return i.BYTE;if(n===Bl)return i.SHORT;if(n===Ts)return i.UNSIGNED_SHORT;if(n===Xa)return i.INT;if(n===Pn)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===In)return i.HALF_FLOAT;if(n===Vl)return i.ALPHA;if(n===Gl)return i.RGB;if(n===xn)return i.RGBA;if(n===zn)return i.DEPTH_COMPONENT;if(n===wi)return i.DEPTH_STENCIL;if(n===Za)return i.RED;if(n===Ja)return i.RED_INTEGER;if(n===Ai)return i.RG;if(n===Ka)return i.RG_INTEGER;if(n===$a)return i.RGBA_INTEGER;if(n===yr||n===vr||n===Mr||n===Sr)if(a===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ja||n===Qa||n===to||n===eo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===to)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===no||n===io||n===so||n===ro||n===ao||n===br||n===oo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===no||n===io)return a===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===so)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ro)return r.COMPRESSED_R11_EAC;if(n===ao)return r.COMPRESSED_SIGNED_R11_EAC;if(n===br)return r.COMPRESSED_RG11_EAC;if(n===oo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===yo||n===vo||n===Mo||n===So)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===lo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===co)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ho)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===uo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===po)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===mo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===go)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_o)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===yo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===vo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Mo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===So)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===bo||n===Eo||n===To)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===bo)return a===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Eo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wo||n===Ao||n===Er||n===Ro)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===wo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ao)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Er)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ws?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var d0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,pc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new sr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new un({vertexShader:d0,fragmentShader:f0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new oe(new Hn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},mc=class extends An{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,m=null,h=null,p=null,_=null,v=typeof XRWebGLBinding<"u",f=new pc,d={},E=e.getContextAttributes(),R=null,M=null,b=[],S=[],A=new Ft,x=null,T=null,C=new ze;C.viewport=new Me;let F=new ze;F.viewport=new Me;let O=[C,F],V=new Ba,N=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let et=b[$];return et===void 0&&(et=new gs,b[$]=et),et.getTargetRaySpace()},this.getControllerGrip=function($){let et=b[$];return et===void 0&&(et=new gs,b[$]=et),et.getGripSpace()},this.getHand=function($){let et=b[$];return et===void 0&&(et=new gs,b[$]=et),et.getHandSpace()};function q($){let et=S.indexOf($.inputSource);if(et===-1)return;let wt=b[et];wt!==void 0&&(wt.update($.inputSource,$.frame,l||a),wt.dispatchEvent({type:$.type,data:$.inputSource}))}function J(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",st);for(let $=0;$<b.length;$++){let et=S[$];et!==null&&(S[$]=null,b[$].disconnect(et))}N=null,G=null,f.reset();for(let $ in d)delete d[$];if(t.setRenderTarget(R),p=null,h=null,m=null,s=null,M=null,se.stop(),n.isPresenting=!1,t.setPixelRatio(x),t.setSize(A.width,A.height,!1),T!==null){let $=T.camera;$.fov=T.fov,$.zoom=T.zoom,$.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return m===null&&v&&(m=new XRWebGLBinding(s,e)),m},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(R=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",J),s.addEventListener("inputsourceschange",st),E.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,zt=null,bt=null;E.depth&&(bt=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=E.stencil?wi:zn,zt=E.stencil?ws:Pn);let Bt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};m=this.getBinding(),h=m.createProjectionLayer(Bt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new nn(h.textureWidth,h.textureHeight,{format:xn,type:sn,depthTexture:new gi(h.textureWidth,h.textureHeight,zt,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let wt={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,wt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new nn(p.framebufferWidth,p.framebufferHeight,{format:xn,type:sn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function st($){for(let et=0;et<$.removed.length;et++){let wt=$.removed[et],zt=S.indexOf(wt);zt>=0&&(S[zt]=null,b[zt].disconnect(wt))}for(let et=0;et<$.added.length;et++){let wt=$.added[et],zt=S.indexOf(wt);if(zt===-1){for(let Bt=0;Bt<b.length;Bt++)if(Bt>=S.length){S.push(wt),zt=Bt;break}else if(S[Bt]===null){S[Bt]=wt,zt=Bt;break}if(zt===-1)break}let bt=b[zt];bt&&bt.connect(wt)}}let Y=new U,nt=new U;function it($,et,wt){Y.setFromMatrixPosition(et.matrixWorld),nt.setFromMatrixPosition(wt.matrixWorld);let zt=Y.distanceTo(nt),bt=et.projectionMatrix.elements,Bt=wt.projectionMatrix.elements,xe=bt[14]/(bt[10]-1),Ht=bt[14]/(bt[10]+1),$t=(bt[9]+1)/bt[5],ue=(bt[9]-1)/bt[5],Jt=(bt[8]-1)/bt[0],le=(Bt[8]+1)/Bt[0],be=xe*Jt,Pe=xe*le,de=zt/(-Jt+le),Ee=de*-Jt;if(et.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Ee),$.translateZ(de),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),bt[10]===-1)$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let I=xe+de,Wt=Ht+de,Mt=be-Ee,w=Pe+(zt-Ee),g=$t*Ht/Wt*I,B=ue*Ht/Wt*I;$.projectionMatrix.makePerspective(Mt,w,g,B,I,Wt),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Nt($,et){et===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(et.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let et=$.near,wt=$.far;f.texture!==null&&(f.depthNear>0&&(et=f.depthNear),f.depthFar>0&&(wt=f.depthFar)),V.near=F.near=C.near=et,V.far=F.far=C.far=wt,(N!==V.near||G!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),N=V.near,G=V.far),V.layers.mask=$.layers.mask|6,C.layers.mask=V.layers.mask&-5,F.layers.mask=V.layers.mask&-3;let zt=$.parent,bt=V.cameras;Nt(V,zt);for(let Bt=0;Bt<bt.length;Bt++)Nt(bt[Bt],zt);bt.length===2?it(V,C,F):V.projectionMatrix.copy(C.projectionMatrix),T===null&&$.isPerspectiveCamera&&(T={camera:$,fov:$.fov,zoom:$.zoom}),Pt($,V,zt)};function Pt($,et,wt){wt===null?$.matrix.copy(et.matrixWorld):($.matrix.copy(wt.matrixWorld),$.matrix.invert(),$.matrix.multiply(et.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=fs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(V)},this.getCameraTexture=function($){return d[$]};let me=null;function Kt($,et){if(u=et.getViewerPose(l||a),_=et,u!==null){let wt=u.views;p!==null&&(t.setRenderTargetFramebuffer(M,p.framebuffer),t.setRenderTarget(M));let zt=!1;wt.length!==V.cameras.length&&(V.cameras.length=0,zt=!0);for(let Ht=0;Ht<wt.length;Ht++){let $t=wt[Ht],ue=null;if(p!==null)ue=p.getViewport($t);else{let le=m.getViewSubImage(h,$t);ue=le.viewport,Ht===0&&(t.setRenderTargetTextures(M,le.colorTexture,le.depthStencilTexture),t.setRenderTarget(M))}let Jt=O[Ht];Jt===void 0&&(Jt=new ze,Jt.layers.enable(Ht),Jt.viewport=new Me,O[Ht]=Jt),Jt.matrix.fromArray($t.transform.matrix),Jt.matrix.decompose(Jt.position,Jt.quaternion,Jt.scale),Jt.projectionMatrix.fromArray($t.projectionMatrix),Jt.projectionMatrixInverse.copy(Jt.projectionMatrix).invert(),Jt.viewport.set(ue.x,ue.y,ue.width,ue.height),Ht===0&&(V.matrix.copy(Jt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),zt===!0&&V.cameras.push(Jt)}let bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){m=n.getBinding();let Ht=m.getDepthInformation(wt[0]);Ht&&Ht.isValid&&Ht.texture&&f.init(Ht,s.renderState)}if(bt&&bt.includes("camera-access")&&v){t.state.unbindTexture(),m=n.getBinding();for(let Ht=0;Ht<wt.length;Ht++){let $t=wt[Ht].camera;if($t){let ue=d[$t];ue||(ue=new sr,d[$t]=ue);let Jt=m.getCameraImage($t);ue.sourceTexture=Jt}}}}for(let wt=0;wt<b.length;wt++){let zt=S[wt],bt=b[wt];zt!==null&&bt!==void 0&&bt.update(zt,et,l||a)}me&&me($,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),_=null}let se=new lu;se.setAnimationLoop(Kt),this.setAnimationLoop=function($){me=$},this.dispose=function(){}}},p0=new ne,pu=new Vt;pu.set(-1,0,0,0,1,0,0,0,1);function m0(i,t){function e(f,d){f.matrixAutoUpdate===!0&&f.updateMatrix(),d.value.copy(f.matrix)}function n(f,d){d.color.getRGB(f.fogColor.value,ql(i)),d.isFog?(f.fogNear.value=d.near,f.fogFar.value=d.far):d.isFogExp2&&(f.fogDensity.value=d.density)}function s(f,d,E,R,M){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?r(f,d):d.isMeshLambertMaterial?(r(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(f,d),m(f,d)):d.isMeshPhongMaterial?(r(f,d),u(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(f,d),h(f,d),d.isMeshPhysicalMaterial&&p(f,d,M)):d.isMeshMatcapMaterial?(r(f,d),_(f,d)):d.isMeshDepthMaterial?r(f,d):d.isMeshDistanceMaterial?(r(f,d),v(f,d)):d.isMeshNormalMaterial?r(f,d):d.isLineBasicMaterial?(a(f,d),d.isLineDashedMaterial&&o(f,d)):d.isPointsMaterial?c(f,d,E,R):d.isSpriteMaterial?l(f,d):d.isShadowMaterial?(f.color.value.copy(d.color),f.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(f,d){f.opacity.value=d.opacity,d.color&&f.diffuse.value.copy(d.color),d.emissive&&f.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(f.map.value=d.map,e(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,e(d.alphaMap,f.alphaMapTransform)),d.bumpMap&&(f.bumpMap.value=d.bumpMap,e(d.bumpMap,f.bumpMapTransform),f.bumpScale.value=d.bumpScale,d.side===Ge&&(f.bumpScale.value*=-1)),d.normalMap&&(f.normalMap.value=d.normalMap,e(d.normalMap,f.normalMapTransform),f.normalScale.value.copy(d.normalScale),d.side===Ge&&f.normalScale.value.negate()),d.displacementMap&&(f.displacementMap.value=d.displacementMap,e(d.displacementMap,f.displacementMapTransform),f.displacementScale.value=d.displacementScale,f.displacementBias.value=d.displacementBias),d.emissiveMap&&(f.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,f.emissiveMapTransform)),d.specularMap&&(f.specularMap.value=d.specularMap,e(d.specularMap,f.specularMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest);let E=t.get(d),R=E.envMap,M=E.envMapRotation;R&&(f.envMap.value=R,f.envMapRotation.value.setFromMatrix4(p0.makeRotationFromEuler(M)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(pu),f.reflectivity.value=d.reflectivity,f.ior.value=d.ior,f.refractionRatio.value=d.refractionRatio),d.lightMap&&(f.lightMap.value=d.lightMap,f.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,f.lightMapTransform)),d.aoMap&&(f.aoMap.value=d.aoMap,f.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,f.aoMapTransform))}function a(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,d.map&&(f.map.value=d.map,e(d.map,f.mapTransform))}function o(f,d){f.dashSize.value=d.dashSize,f.totalSize.value=d.dashSize+d.gapSize,f.scale.value=d.scale}function c(f,d,E,R){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.size.value=d.size*E,f.scale.value=R*.5,d.map&&(f.map.value=d.map,e(d.map,f.uvTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,e(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function l(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.rotation.value=d.rotation,d.map&&(f.map.value=d.map,e(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,e(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function u(f,d){f.specular.value.copy(d.specular),f.shininess.value=Math.max(d.shininess,1e-4)}function m(f,d){d.gradientMap&&(f.gradientMap.value=d.gradientMap)}function h(f,d){f.metalness.value=d.metalness,d.metalnessMap&&(f.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,f.metalnessMapTransform)),f.roughness.value=d.roughness,d.roughnessMap&&(f.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,f.roughnessMapTransform)),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)}function p(f,d,E){f.ior.value=d.ior,d.sheen>0&&(f.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),f.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(f.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,f.sheenColorMapTransform)),d.sheenRoughnessMap&&(f.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,f.sheenRoughnessMapTransform))),d.clearcoat>0&&(f.clearcoat.value=d.clearcoat,f.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(f.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,f.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(f.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ge&&f.clearcoatNormalScale.value.negate())),d.dispersion>0&&(f.dispersion.value=d.dispersion),d.retroreflectivity>0&&(f.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(f.iridescence.value=d.iridescence,f.iridescenceIOR.value=d.iridescenceIOR,f.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(f.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,f.iridescenceMapTransform)),d.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),d.transmission>0&&(f.transmission.value=d.transmission,f.transmissionSamplerMap.value=E.texture,f.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(f.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,f.transmissionMapTransform)),f.thickness.value=d.thickness,d.thicknessMap&&(f.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=d.attenuationDistance,f.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(f.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(f.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=d.specularIntensity,f.specularColor.value.copy(d.specularColor),d.specularColorMap&&(f.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,f.specularColorMapTransform)),d.specularIntensityMap&&(f.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,f.specularIntensityMapTransform))}function _(f,d){d.matcap&&(f.matcap.value=d.matcap)}function v(f,d){let E=t.get(d).light;f.referencePosition.value.setFromMatrixPosition(E.matrixWorld),f.nearDistance.value=E.shadow.camera.near,f.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function g0(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,b){let S=b.program;n.uniformBlockBinding(M,S)}function l(M,b){let S=s[M.id];S===void 0&&(f(M),S=u(M),s[M.id]=S,M.addEventListener("dispose",E));let A=b.program;n.updateUBOMapping(M,A);let x=t.render.frame;r[M.id]!==x&&(h(M),r[M.id]=x)}function u(M){let b=m();M.__bindingPointIndex=b;let S=i.createBuffer(),A=M.__size,x=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,A,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,S),S}function m(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){let b=s[M.id],S=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let x=0,T=S.length;x<T;x++){let C=S[x];if(Array.isArray(C))for(let F=0,O=C.length;F<O;F++)p(C[F],x,F,A);else p(C,x,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,b,S,A){if(v(M,b,S,A)===!0){let x=M.__offset,T=M.value;if(Array.isArray(T)){let C=0;for(let F=0;F<T.length;F++){let O=T[F],V=d(O);_(O,M.__data,C),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(C+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(T,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,M.__data)}}function _(M,b,S){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,S)}function v(M,b,S,A){let x=M.value,T=b+"_"+S;if(A[T]===void 0)return typeof x=="number"||typeof x=="boolean"?A[T]=x:ArrayBuffer.isView(x)?A[T]=x.slice():A[T]=x.clone(),!0;{let C=A[T];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return A[T]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function f(M){let b=M.uniforms,S=0,A=16;for(let T=0,C=b.length;T<C;T++){let F=Array.isArray(b[T])?b[T]:[b[T]];for(let O=0,V=F.length;O<V;O++){let N=F[O],G=Array.isArray(N.value)?N.value:[N.value];for(let q=0,J=G.length;q<J;q++){let st=G[q],Y=d(st),nt=S%A,it=nt%Y.boundary,Nt=nt+it;S+=it,Nt!==0&&A-Nt<Y.storage&&(S+=A-Nt),N.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=Y.storage}}}let x=S%A;return x>0&&(S+=A-x),M.__size=S,M.__cache={},this}function d(M){let b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?Ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):Ut("WebGLRenderer: Unsupported uniform value type.",M),b}function E(M){let b=M.target;b.removeEventListener("dispose",E);let S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function R(){for(let M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:R}}var _0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),qn=null;function x0(){return qn===null&&(qn=new Qs(_0,16,16,Ai,In),qn.name="DFG_LUT",qn.minFilter=ke,qn.magFilter=ke,qn.wrapS=On,qn.wrapT=On,qn.generateMipmaps=!1,qn.needsUpdate=!0),qn}var No=class{constructor(t={}){let{canvas:e=Dh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:h=!1,outputBufferType:p=sn}=t;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;let v=p,f=new Set([$a,Ka,Ja]),d=new Set([sn,Pn,Ts,ws,qa,Ya]),E=new Uint32Array(4),R=new Int32Array(4),M=new U,b=null,S=null,A=[],x=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Cn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,F=!1,O=null,V=null,N=null,G=null;this._outputColorSpace=je;let q=0,J=0,st=null,Y=-1,nt=null,it=new Me,Nt=new Me,Pt=null,me=new Gt(0),Kt=0,se=e.width,$=e.height,et=1,wt=null,zt=null,bt=new Me(0,0,se,$),Bt=new Me(0,0,se,$),xe=!1,Ht=new _s,$t=!1,ue=!1,Jt=new ne,le=new U,be=new Me,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},de=!1;function Ee(){return st===null?et:1}let I=n;function Wt(y,L){return e.getContext(y,L)}let Mt,w,g,B,H,X,ot,lt,Z,K,ut,It,ft,ct,yt,Tt,kt,D,pt,j,rt,_t,Q;try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:m};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",re,!1),e.addEventListener("webglcontextrestored",ie,!1),e.addEventListener("webglcontextcreationerror",Ue,!1),I===null){let L="webgl2";if(I=Wt(L,y),I===null)throw Wt(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Lt()}catch(y){throw e.removeEventListener("webglcontextlost",re,!1),e.removeEventListener("webglcontextrestored",ie,!1),e.removeEventListener("webglcontextcreationerror",Ue,!1),Ot("WebGLRenderer: "+y.message),y}function Lt(){Mt=new Tm(I),Mt.init(),rt=new u0(I,Mt),w=new mm(I,Mt,t,rt),g=new c0(I,Mt),w.reversedDepthBuffer&&h&&g.buffers.depth.setReversed(!0),V=I.createFramebuffer(),N=I.createFramebuffer(),G=I.createFramebuffer(),B=new Rm(I),H=new Jg,X=new h0(I,Mt,g,H,w,rt,B),ot=new Em(C),lt=new Cd(I),_t=new fm(I,lt),Z=new wm(I,lt,B,_t),K=new Pm(I,Z,lt,_t,B),D=new Cm(I,w,X),yt=new gm(H),ut=new Zg(C,ot,Mt,w,_t,yt),It=new m0(C,H),ft=new $g,ct=new i0(Mt),kt=new dm(C,ot,g,K,_,c),Tt=new l0(C,K,w),Q=new g0(I,B,w,g),pt=new pm(I,Mt,B),j=new Am(I,Mt,B),B.programs=ut.programs,C.capabilities=w,C.extensions=Mt,C.properties=H,C.renderLists=ft,C.shadowMap=Tt,C.state=g,C.info=B}v!==sn&&(T=new Lm(v,e.width,e.height,o,s,r));let Et=new mc(C,I);this.xr=Et,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let y=Mt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=Mt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(y){y!==void 0&&(et=y,this.setSize(se,$,!1))},this.getSize=function(y){return y.set(se,$)},this.setSize=function(y,L,W=!0){if(Et.isPresenting){Ut("WebGLRenderer: Can't change size while VR device is presenting.");return}se=y,$=L,e.width=Math.floor(y*et),e.height=Math.floor(L*et),W===!0&&(e.style.width=y+"px",e.style.height=L+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(se*et,$*et).floor()},this.setDrawingBufferSize=function(y,L,W){se=y,$=L,et=W,e.width=Math.floor(y*W),e.height=Math.floor(L*W),this.setViewport(0,0,y,L)},this.setEffects=function(y){if(v===sn){Ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let L=0;L<y.length;L++)if(y[L].isOutputPass===!0){Ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(it)},this.getViewport=function(y){return y.copy(bt)},this.setViewport=function(y,L,W,k){y.isVector4?bt.set(y.x,y.y,y.z,y.w):bt.set(y,L,W,k),g.viewport(it.copy(bt).multiplyScalar(et).round())},this.getScissor=function(y){return y.copy(Bt)},this.setScissor=function(y,L,W,k){y.isVector4?Bt.set(y.x,y.y,y.z,y.w):Bt.set(y,L,W,k),g.scissor(Nt.copy(Bt).multiplyScalar(et).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(y){g.setScissorTest(xe=y)},this.setOpaqueSort=function(y){wt=y},this.setTransparentSort=function(y){zt=y},this.getClearColor=function(y){return y.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(y=!0,L=!0,W=!0){let k=0;if(y){let z=!1;if(st!==null){let gt=st.texture.format;z=f.has(gt)}if(z){let gt=st.texture.type,St=d.has(gt),dt=kt.getClearColor(),At=kt.getClearAlpha(),Ct=dt.r,Xt=dt.g,Yt=dt.b;St?(E[0]=Ct,E[1]=Xt,E[2]=Yt,E[3]=At,I.clearBufferuiv(I.COLOR,0,E)):(R[0]=Ct,R[1]=Xt,R[2]=Yt,R[3]=At,I.clearBufferiv(I.COLOR,0,R))}else k|=I.COLOR_BUFFER_BIT}L&&(k|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(k|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&I.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),O=y},this.dispose=function(){e.removeEventListener("webglcontextlost",re,!1),e.removeEventListener("webglcontextrestored",ie,!1),e.removeEventListener("webglcontextcreationerror",Ue,!1),kt.dispose(),ft.dispose(),ct.dispose(),H.dispose(),ot.dispose(),K.dispose(),_t.dispose(),Q.dispose(),ut.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",Us),Et.removeEventListener("sessionend",Ci),Zn.stop()};function re(y){y.preventDefault(),Wl("WebGLRenderer: Context Lost."),F=!0}function ie(){Wl("WebGLRenderer: Context Restored."),F=!1;let y=B.autoReset,L=Tt.enabled,W=Tt.autoUpdate,k=Tt.needsUpdate,z=Tt.type;Lt(),B.autoReset=y,Tt.enabled=L,Tt.autoUpdate=W,Tt.needsUpdate=k,Tt.type=z}function Ue(y){Ot("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function fn(y){let L=y.target;L.removeEventListener("dispose",fn),Go(L)}function Go(y){Ho(y),H.remove(y)}function Ho(y){let L=H.get(y).programs;L!==void 0&&(L.forEach(function(W){ut.releaseProgram(W)}),y.isShaderMaterial&&ut.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,W,k,z,gt){L===null&&(L=Pe);let St=z.isMesh&&z.matrixWorld.determinantAffine()<0,dt=Os(y,L,W,k,z);g.setMaterial(k,St);let At=W.index,Ct=1;if(k.wireframe===!0){if(At=Z.getWireframeAttribute(W),At===void 0)return;Ct=2}let Xt=W.drawRange,Yt=W.attributes.position,Rt=Xt.start*Ct,Qt=(Xt.start+Xt.count)*Ct;gt!==null&&(Rt=Math.max(Rt,gt.start*Ct),Qt=Math.min(Qt,(gt.start+gt.count)*Ct)),At!==null?(Rt=Math.max(Rt,0),Qt=Math.min(Qt,At.count)):Yt!=null&&(Rt=Math.max(Rt,0),Qt=Math.min(Qt,Yt.count));let Te=Qt-Rt;if(Te<0||Te===1/0)return;_t.setup(z,k,dt,W,At);let fe,ce=pt;if(At!==null&&(fe=lt.get(At),ce=j,ce.setIndex(fe)),z.isMesh)k.wireframe===!0?(g.setLineWidth(k.wireframeLinewidth*Ee()),ce.setMode(I.LINES)):ce.setMode(I.TRIANGLES);else if(z.isLine){let Ie=k.linewidth;Ie===void 0&&(Ie=1),g.setLineWidth(Ie*Ee()),z.isLineSegments?ce.setMode(I.LINES):z.isLineLoop?ce.setMode(I.LINE_LOOP):ce.setMode(I.LINE_STRIP)}else z.isPoints?ce.setMode(I.POINTS):z.isSprite&&ce.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(Mt.get("WEBGL_multi_draw"))ce.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let Ie=z._multiDrawStarts,vt=z._multiDrawCounts,Fe=z._multiDrawCount,te=At?lt.get(At).bytesPerElement:1,en=H.get(k).currentProgram.getUniforms();for(let an=0;an<Fe;an++)en.setValue(I,"_gl_DrawID",an),ce.render(Ie[an]/te,vt[an])}else if(z.isInstancedMesh)ce.renderInstances(Rt,Te,z.count);else if(W.isInstancedBufferGeometry){let Ie=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,vt=Math.min(W.instanceCount,Ie);ce.renderInstances(Rt,Te,vt)}else ce.render(Rt,Te)};function Wi(y,L,W,k){O!==null&&y.isNodeMaterial&&O.setObject(k,y),$t===!0&&yt.setState(y,W,!1),y.transparent===!0&&y.side===Wn&&y.forceSinglePass===!1?(y.side=Ge,y.needsUpdate=!0,Dn(y,L,k),y.side=bi,y.needsUpdate=!0,Dn(y,L,k),y.side=Wn):Dn(y,L,k)}this.compile=function(y,L,W=null){W===null&&(W=y),O!==null&&O.renderStart(y,L,W),S=ct.get(W),S.init(L),x.push(S),W.traverseVisible(function(z){z.isLight&&z.layers.test(L.layers)&&(S.pushLight(z),z.castShadow&&S.pushShadow(z))}),y!==W&&y.traverseVisible(function(z){z.isLight&&z.layers.test(L.layers)&&(S.pushLight(z),z.castShadow&&S.pushShadow(z))}),S.setupLights(),O!==null&&O.updateLights(S.state.lightsArray),ue=this.localClippingEnabled,$t=yt.init(this.clippingPlanes,ue),$t===!0&&yt.setGlobalState(this.clippingPlanes,L),O!==null&&Tt.render(S.state.shadowsArray,W,L);let k=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let gt=z.material;if(gt)if(Array.isArray(gt))for(let St=0;St<gt.length;St++){let dt=gt[St];Wi(dt,W,L,z),k.add(dt)}else Wi(gt,W,L,z),k.add(gt)}),S=x.pop(),O!==null&&O.renderEnd(),k},this.compileAsync=function(y,L,W=null){let k=this.compile(y,L,W);return new Promise(z=>{function gt(){if(k.forEach(function(St){let At=H.get(St).currentProgram;(At===void 0||At.isReady())&&k.delete(St)}),k.size===0){z(y);return}setTimeout(gt,10)}Mt.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let Xi=null;function Wo(y){Xi&&Xi(y)}function Us(){Zn.stop()}function Ci(){Zn.start()}let Zn=new lu;Zn.setAnimationLoop(Wo),typeof self<"u"&&Zn.setContext(self),this.setAnimationLoop=function(y){Xi=y,Et.setAnimationLoop(y),y===null?Zn.stop():Zn.start()},Et.addEventListener("sessionstart",Us),Et.addEventListener("sessionend",Ci),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){Ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;O!==null&&O.renderStart(y,L);let W=Et.enabled===!0&&Et.isPresenting===!0,k=T!==null&&(st===null||W)&&T.begin(C,st);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(L),L=Et.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,L,st),S=ct.get(y,x.length),S.init(L),S.state.textureUnits=X.getTextureUnits(),x.push(S),Jt.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Ht.setFromProjectionMatrix(Jt,wn,L.reversedDepth),ue=this.localClippingEnabled,$t=yt.init(this.clippingPlanes,ue),b=ft.get(y,A.length),b.init(),A.push(b),Et.enabled===!0&&Et.isPresenting===!0){let St=C.xr.getDepthSensingMesh();St!==null&&Pi(St,L,-1/0,C.sortObjects)}Pi(y,L,0,C.sortObjects),b.finish(),O!==null&&O.updateLights(S.state.lightsArray),C.sortObjects===!0&&b.sort(wt,zt),de=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,de&&kt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$t===!0&&yt.beginShadows();let z=S.state.shadowsArray;if(Tt.render(z,y,L),$t===!0&&yt.endShadows(),(k&&T.hasRenderPass())===!1){let St=b.opaque,dt=b.transmissive;if(S.setupLights(),L.isArrayCamera){let At=L.cameras;if(dt.length>0)for(let Ct=0,Xt=At.length;Ct<Xt;Ct++){let Yt=At[Ct];Fs(St,dt,y,Yt)}de&&kt.render(y);for(let Ct=0,Xt=At.length;Ct<Xt;Ct++){let Yt=At[Ct];Ln(b,y,Yt,Yt.viewport)}}else dt.length>0&&Fs(St,dt,y,L),de&&kt.render(y),Ln(b,y,L)}st!==null&&J===0&&(X.updateMultisampleRenderTarget(st),X.updateRenderTargetMipmap(st)),k&&T.end(C),y.isScene===!0&&y.onAfterRender(C,y,L),_t.resetDefaultState(),Y=-1,nt=null,x.pop(),x.length>0?(S=x[x.length-1],X.setTextureUnits(S.state.textureUnits),$t===!0&&yt.setGlobalState(C.clippingPlanes,S.state.camera)):S=null,A.pop(),A.length>0?b=A[A.length-1]:b=null,O!==null&&O.renderEnd()};function Pi(y,L,W,k){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLightProbeGrid)S.pushLightProbeGrid(y);else if(y.isLight)S.pushLight(y),y.castShadow&&S.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(Ht)){k&&be.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Jt);let St=K.update(y),dt=y.material;dt.visible&&b.push(y,St,dt,W,be.z,null,L)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(Ht))){let St=K.update(y),dt=y.material;if(k&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),be.copy(y.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),be.copy(St.boundingSphere.center)),be.applyMatrix4(y.matrixWorld).applyMatrix4(Jt)),Array.isArray(dt)){let At=St.groups;for(let Ct=0,Xt=At.length;Ct<Xt;Ct++){let Yt=At[Ct],Rt=dt[Yt.materialIndex];Rt&&Rt.visible&&b.push(y,St,Rt,W,be.z,Yt,L)}}else dt.visible&&b.push(y,St,dt,W,be.z,null,L)}}let gt=y.children;for(let St=0,dt=gt.length;St<dt;St++)Pi(gt[St],L,W,k)}function Ln(y,L,W,k){let{opaque:z,transmissive:gt,transparent:St}=y;S.setupLightsView(W),$t===!0&&yt.setGlobalState(C.clippingPlanes,W),k&&g.viewport(it.copy(k)),z.length>0&&qi(z,L,W),gt.length>0&&qi(gt,L,W),St.length>0&&qi(St,L,W),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function Fs(y,L,W,k){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[k.id]===void 0){let Rt=Mt.has("EXT_color_buffer_half_float")||Mt.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[k.id]=new nn(1,1,{generateMipmaps:!0,type:Rt?In:sn,minFilter:Ti,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ee.workingColorSpace})}let gt=S.state.transmissionRenderTarget[k.id],St=k.viewport||it;gt.setSize(St.z*C.transmissionResolutionScale,St.w*C.transmissionResolutionScale);let dt=C.getRenderTarget(),At=C.getActiveCubeFace(),Ct=C.getActiveMipmapLevel();C.setRenderTarget(gt),C.getClearColor(me),Kt=C.getClearAlpha(),Kt<1&&C.setClearColor(16777215,.5),C.clear(),de&&kt.render(W);let Xt=C.toneMapping;C.toneMapping=Cn;let Yt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),S.setupLightsView(k),$t===!0&&yt.setGlobalState(C.clippingPlanes,k),qi(y,W,k),X.updateMultisampleRenderTarget(gt),X.updateRenderTargetMipmap(gt),Mt.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let Qt=0,Te=L.length;Qt<Te;Qt++){let fe=L[Qt],{object:ce,geometry:Ie,material:vt,group:Fe}=fe;if(vt.side===Wn&&ce.layers.test(k.layers)){let te=vt.side;vt.side=Ge,vt.needsUpdate=!0,oi(ce,W,k,Ie,vt,Fe),vt.side=te,vt.needsUpdate=!0,Rt=!0}}Rt===!0&&(X.updateMultisampleRenderTarget(gt),X.updateRenderTargetMipmap(gt))}C.setRenderTarget(dt,At,Ct),C.setClearColor(me,Kt),Yt!==void 0&&(k.viewport=Yt),C.toneMapping=Xt}function qi(y,L,W){let k=L.isScene===!0?L.overrideMaterial:null;for(let z=0,gt=y.length;z<gt;z++){let St=y[z],{object:dt,geometry:At,group:Ct}=St,Xt=St.material;Xt.allowOverride===!0&&k!==null&&(Xt=k),dt.layers.test(W.layers)&&oi(dt,L,W,At,Xt,Ct)}}function oi(y,L,W,k,z,gt){O!==null&&z.isNodeMaterial&&O.setObject(y,z),y.onBeforeRender(C,L,W,k,z,gt),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(C,L,W,k,y,gt),z.transparent===!0&&z.side===Wn&&z.forceSinglePass===!1?(z.side=Ge,z.needsUpdate=!0,C.renderBufferDirect(W,L,k,z,y,gt),z.side=bi,z.needsUpdate=!0,C.renderBufferDirect(W,L,k,z,y,gt),z.side=Wn):C.renderBufferDirect(W,L,k,z,y,gt),y.onAfterRender(C,L,W,k,z,gt)}function Dn(y,L,W){L.isScene!==!0&&(L=Pe);let k=H.get(y),z=S.state.lights,gt=S.state.shadowsArray,St=z.state.version,dt=ut.getParameters(y,z.state,gt,L,W,S.state.lightProbeGridArray),At=ut.getProgramCacheKey(dt),Ct=k.programs;k.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?L.environment:null,k.fog=L.fog;let Xt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;k.envMap=ot.get(y.envMap||k.environment,Xt),k.envMapRotation=k.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,Ct===void 0&&(y.addEventListener("dispose",fn),Ct=new Map,k.programs=Ct);let Yt=Ct.get(At);if(Yt!==void 0){if(k.currentProgram===Yt&&k.lightsStateVersion===St)return ci(y,dt),Yt}else dt.uniforms=ut.getUniforms(y),O!==null&&y.isNodeMaterial&&O.build(y,W,dt),y.onBeforeCompile(dt,C),Yt=ut.acquireProgram(dt,At),Ct.set(At,Yt),k.uniforms=dt.uniforms;let Rt=k.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Rt.clippingPlanes=yt.uniform),ci(y,dt),k.needsLights=He(y),k.lightsStateVersion=St,k.needsLights&&(Rt.ambientLightColor.value=z.state.ambient,Rt.lightProbe.value=z.state.probe,Rt.sunLights.value=z.state.sun,Rt.sunLightShadows.value=z.state.sunShadow,Rt.directionalLights.value=z.state.directional,Rt.directionalLightShadows.value=z.state.directionalShadow,Rt.spotLights.value=z.state.spot,Rt.spotLightShadows.value=z.state.spotShadow,Rt.rectAreaLights.value=z.state.rectArea,Rt.ltc_1.value=z.state.rectAreaLTC1,Rt.ltc_2.value=z.state.rectAreaLTC2,Rt.pointLights.value=z.state.point,Rt.pointLightShadows.value=z.state.pointShadow,Rt.hemisphereLights.value=z.state.hemi,Rt.sunShadowMatrix.value=z.state.sunShadowMatrix,Rt.sunShadowCascade.value=z.state.sunShadowCascade,Rt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Rt.spotLightMatrix.value=z.state.spotLightMatrix,Rt.spotLightMap.value=z.state.spotLightMap,Rt.pointShadowMatrix.value=z.state.pointShadowMatrix),k.lightProbeGrid=S.state.lightProbeGridArray.length>0,k.currentProgram=Yt,k.uniformsList=null,Yt}function li(y){if(y.uniformsList===null){let L=y.currentProgram.getUniforms();y.uniformsList=Is.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function ci(y,L){let W=H.get(y);W.outputColorSpace=L.outputColorSpace,W.batching=L.batching,W.batchingColor=L.batchingColor,W.instancing=L.instancing,W.instancingColor=L.instancingColor,W.instancingMorph=L.instancingMorph,W.skinning=L.skinning,W.morphTargets=L.morphTargets,W.morphNormals=L.morphNormals,W.morphColors=L.morphColors,W.morphTargetsCount=L.morphTargetsCount,W.numClippingPlanes=L.numClippingPlanes,W.numIntersection=L.numClipIntersection,W.vertexAlphas=L.vertexAlphas,W.vertexTangents=L.vertexTangents,W.toneMapping=L.toneMapping}function vn(y,L){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;M.setFromMatrixPosition(L.matrixWorld);for(let W=0,k=y.length;W<k;W++){let z=y[W];if(z.texture!==null&&z.boundingBox.containsPoint(M))return z}return null}function Os(y,L,W,k,z){L.isScene!==!0&&(L=Pe),X.resetTextureUnits();let gt=L.fog,St=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?L.environment:null,dt=st===null?C.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:ee.workingColorSpace,At=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ct=ot.get(k.envMap||St,At),Xt=k.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Yt=!!W.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Rt=!!W.morphAttributes.position,Qt=!!W.morphAttributes.normal,Te=!!W.morphAttributes.color,fe=Cn;k.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(fe=C.toneMapping);let ce=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ie=ce!==void 0?ce.length:0,vt=H.get(k),Fe=S.state.lights;if($t===!0&&(ue===!0||y!==nt)){let ge=y===nt&&k.id===Y;yt.setState(k,y,ge)}let te=!1;k.version===vt.__version?(vt.needsLights&&vt.lightsStateVersion!==Fe.state.version||vt.outputColorSpace!==dt||z.isBatchedMesh&&vt.batching===!1||!z.isBatchedMesh&&vt.batching===!0||z.isBatchedMesh&&vt.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&vt.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&vt.instancing===!1||!z.isInstancedMesh&&vt.instancing===!0||z.isSkinnedMesh&&vt.skinning===!1||!z.isSkinnedMesh&&vt.skinning===!0||z.isInstancedMesh&&vt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&vt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&vt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&vt.instancingMorph===!1&&z.morphTexture!==null||vt.envMap!==Ct||k.fog===!0&&vt.fog!==gt||vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==yt.numPlanes||vt.numIntersection!==yt.numIntersection)||vt.vertexAlphas!==Xt||vt.vertexTangents!==Yt||vt.morphTargets!==Rt||vt.morphNormals!==Qt||vt.morphColors!==Te||vt.toneMapping!==fe||vt.morphTargetsCount!==Ie||!!vt.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(te=!0):(te=!0,vt.__version=k.version);let en=vt.currentProgram;te===!0&&(en=Dn(k,L,z),O&&k.isNodeMaterial&&O.onUpdateProgram(k,en,vt));let an=!1,on=!1,Jn=!1,ae=en.getUniforms(),ve=vt.uniforms;if(g.useProgram(en.program)&&(an=!0,on=!0,Jn=!0),k.id!==Y&&(Y=k.id,on=!0),vt.needsLights){let ge=vn(S.state.lightProbeGridArray,z);vt.lightProbeGrid!==ge&&(vt.lightProbeGrid=ge,on=!0)}if(an||nt!==y){g.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ae.setValue(I,"projectionMatrix",y.projectionMatrix),ae.setValue(I,"viewMatrix",y.matrixWorldInverse);let Nn=ae.map.cameraPosition;Nn!==void 0&&Nn.setValue(I,le.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&ae.setValue(I,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ae.setValue(I,"isOrthographic",y.isOrthographicCamera===!0),nt!==y&&(nt=y,on=!0,Jn=!0)}if(vt.needsLights&&(Fe.state.sunShadowMap.length>0&&ae.setValue(I,"sunShadowMap",Fe.state.sunShadowMap,X),Fe.state.directionalShadowMap.length>0&&ae.setValue(I,"directionalShadowMap",Fe.state.directionalShadowMap,X),Fe.state.spotShadowMap.length>0&&ae.setValue(I,"spotShadowMap",Fe.state.spotShadowMap,X),Fe.state.pointShadowMap.length>0&&ae.setValue(I,"pointShadowMap",Fe.state.pointShadowMap,X)),z.isSkinnedMesh){ae.setOptional(I,z,"bindMatrix"),ae.setOptional(I,z,"bindMatrixInverse");let ge=z.skeleton;ge&&(ge.boneTexture===null&&ge.computeBoneTexture(),ae.setValue(I,"boneTexture",ge.boneTexture,X))}z.isBatchedMesh&&(ae.setOptional(I,z,"batchingTexture"),ae.setValue(I,"batchingTexture",z._matricesTexture,X),ae.setOptional(I,z,"batchingIdTexture"),ae.setValue(I,"batchingIdTexture",z._indirectTexture,X),ae.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&ae.setValue(I,"batchingColorTexture",z._colorsTexture,X));let Sn=W.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&D.update(z,W,en),(on||vt.receiveShadow!==z.receiveShadow)&&(vt.receiveShadow=z.receiveShadow,ae.setValue(I,"receiveShadow",z.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&L.environment!==null&&(ve.envMapIntensity.value=L.environmentIntensity),ve.dfgLUT!==void 0&&(ve.dfgLUT.value=x0()),on){if(ae.setValue(I,"toneMappingExposure",C.toneMappingExposure),vt.needsLights&&Ii(ve,Jn),gt&&k.fog===!0&&It.refreshFogUniforms(ve,gt),It.refreshMaterialUniforms(ve,k,et,$,S.state.transmissionRenderTarget[y.id]),vt.needsLights&&vt.lightProbeGrid){let ge=vt.lightProbeGrid;ve.probesSH.value=ge.texture,ve.probesMin.value.copy(ge.boundingBox.min),ve.probesMax.value.copy(ge.boundingBox.max),ve.probesResolution.value.copy(ge.resolution)}Is.upload(I,li(vt),ve,X)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Is.upload(I,li(vt),ve,X),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ae.setValue(I,"center",z.center),ae.setValue(I,"modelViewMatrix",z.modelViewMatrix),ae.setValue(I,"normalMatrix",z.normalMatrix),ae.setValue(I,"modelMatrix",z.matrixWorld),k.uniformsGroups!==void 0){let ge=k.uniformsGroups;for(let Nn=0,P=ge.length;Nn<P;Nn++){let tt=ge[Nn];Q.update(tt,en),Q.bind(tt,en)}}return en}function Ii(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.sunLights.needsUpdate=L,y.sunLightShadows.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function He(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return st},this.setRenderTargetTextures=function(y,L,W){let k=H.get(y);k.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),H.get(y.texture).__webglTexture=L,H.get(y.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:W,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,L){let W=H.get(y);W.__webglFramebuffer=L,W.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(y,L=0,W=0){st=y,q=L,J=W;let k=null,z=!1,gt=!1;if(y){let dt=H.get(y);if(dt.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(I.FRAMEBUFFER,dt.__webglFramebuffer),it.copy(y.viewport),Nt.copy(y.scissor),Pt=y.scissorTest,g.viewport(it),g.scissor(Nt),g.setScissorTest(Pt),Y=-1;return}else if(dt.__webglFramebuffer===void 0)X.setupRenderTarget(y);else if(dt.__hasExternalTextures)X.rebindTextures(y,H.get(y.texture).__webglTexture,H.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let Xt=y.depthTexture;if(dt.__boundDepthTexture!==Xt){if(Xt!==null&&H.has(Xt)&&(y.width!==Xt.image.width||y.height!==Xt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(y)}}let At=y.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(gt=!0);let Ct=H.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ct[L])?k=Ct[L][W]:k=Ct[L],z=!0):y.samples>0&&X.useMultisampledRTT(y)===!1?k=H.get(y).__webglMultisampledFramebuffer:Array.isArray(Ct)?k=Ct[W]:k=Ct,it.copy(y.viewport),Nt.copy(y.scissor),Pt=y.scissorTest}else it.copy(bt).multiplyScalar(et).floor(),Nt.copy(Bt).multiplyScalar(et).floor(),Pt=xe;if(W!==0&&(k=V),g.bindFramebuffer(I.FRAMEBUFFER,k)&&g.drawBuffers(y,k),g.viewport(it),g.scissor(Nt),g.setScissorTest(Pt),z){let dt=H.get(y.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+L,dt.__webglTexture,W)}else if(gt){let dt=L;for(let At=0;At<y.textures.length;At++){let Ct=H.get(y.textures[At]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+At,Ct.__webglTexture,W,dt)}}else if(y!==null&&W!==0){let dt=H.get(y.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,dt.__webglTexture,W)}Y=-1};function Mn(y){let L=H.get(y);return(L.__readFormat!==y.format||L.__readType!==y.type)&&(L.__readFormat=y.format,L.__readType=y.type,L.__formatReadable=w.textureFormatReadable(y.format),L.__typeReadable=w.textureTypeReadable(y.type)),L}this.readRenderTargetPixels=function(y,L,W,k,z,gt,St,dt=0){if(!(y&&y.isWebGLRenderTarget)){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=H.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At){g.bindFramebuffer(I.FRAMEBUFFER,At);try{let Ct=y.textures[dt],Xt=Ct.format,Yt=Ct.type;y.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+dt);let Rt=Mn(Ct);if(Rt.__formatReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Rt.__typeReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-k&&W>=0&&W<=y.height-z&&I.readPixels(L,W,k,z,rt.convert(Xt),rt.convert(Yt),gt)}finally{let Ct=st!==null?H.get(st).__webglFramebuffer:null;g.bindFramebuffer(I.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(y,L,W,k,z,gt,St,dt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=H.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At)if(L>=0&&L<=y.width-k&&W>=0&&W<=y.height-z){g.bindFramebuffer(I.FRAMEBUFFER,At);let Ct=y.textures[dt],Xt=Ct.format,Yt=Ct.type;y.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+dt);let Rt=Mn(Ct);if(Rt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Rt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Qt),I.bufferData(I.PIXEL_PACK_BUFFER,gt.byteLength,I.STREAM_READ),I.readPixels(L,W,k,z,rt.convert(Xt),rt.convert(Yt),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let Te=st!==null?H.get(st).__webglFramebuffer:null;g.bindFramebuffer(I.FRAMEBUFFER,Te);let fe=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Uh(I,fe,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Qt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,gt),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(Qt),I.deleteSync(fe),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,L=null,W=0){let k=Math.pow(2,-W),z=Math.floor(y.image.width*k),gt=Math.floor(y.image.height*k),St=L!==null?L.x:0,dt=L!==null?L.y:0;X.setTexture2D(y,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,St,dt,z,gt),g.unbindTexture()},this.copyTextureToTexture=function(y,L,W=null,k=null,z=0,gt=0){let St,dt,At,Ct,Xt,Yt,Rt,Qt,Te,fe=y.isCompressedTexture?y.mipmaps[gt]:y.image;if(W!==null)St=W.max.x-W.min.x,dt=W.max.y-W.min.y,At=W.isBox3?W.max.z-W.min.z:1,Ct=W.min.x,Xt=W.min.y,Yt=W.isBox3?W.min.z:0;else{let ve=Math.pow(2,-z);St=Math.floor(fe.width*ve),dt=Math.floor(fe.height*ve),y.isDataArrayTexture?At=fe.depth:y.isData3DTexture?At=Math.floor(fe.depth*ve):At=1,Ct=0,Xt=0,Yt=0}k!==null?(Rt=k.x,Qt=k.y,Te=k.z):(Rt=0,Qt=0,Te=0);let ce=rt.convert(L.format),Ie=rt.convert(L.type),vt;L.isData3DTexture?(X.setTexture3D(L,0),vt=I.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(X.setTexture2DArray(L,0),vt=I.TEXTURE_2D_ARRAY):(X.setTexture2D(L,0),vt=I.TEXTURE_2D),g.activeTexture(I.TEXTURE0),g.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,L.flipY),g.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),g.pixelStorei(I.UNPACK_ALIGNMENT,L.unpackAlignment);let Fe=g.getParameter(I.UNPACK_ROW_LENGTH),te=g.getParameter(I.UNPACK_IMAGE_HEIGHT),en=g.getParameter(I.UNPACK_SKIP_PIXELS),an=g.getParameter(I.UNPACK_SKIP_ROWS),on=g.getParameter(I.UNPACK_SKIP_IMAGES);g.pixelStorei(I.UNPACK_ROW_LENGTH,fe.width),g.pixelStorei(I.UNPACK_IMAGE_HEIGHT,fe.height),g.pixelStorei(I.UNPACK_SKIP_PIXELS,Ct),g.pixelStorei(I.UNPACK_SKIP_ROWS,Xt),g.pixelStorei(I.UNPACK_SKIP_IMAGES,Yt);let Jn=y.isDataArrayTexture||y.isData3DTexture,ae=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){let ve=H.get(y),Sn=H.get(L),ge=H.get(ve.__renderTarget),Nn=H.get(Sn.__renderTarget);g.bindFramebuffer(I.READ_FRAMEBUFFER,ge.__webglFramebuffer),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,Nn.__webglFramebuffer);for(let P=0;P<At;P++)Jn&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(y).__webglTexture,z,Yt+P),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(L).__webglTexture,gt,Te+P)),I.blitFramebuffer(Ct,Xt,St,dt,Rt,Qt,St,dt,I.DEPTH_BUFFER_BIT,I.NEAREST);g.bindFramebuffer(I.READ_FRAMEBUFFER,null),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||H.has(y)){let ve=H.get(y),Sn=H.get(L);g.bindFramebuffer(I.READ_FRAMEBUFFER,N),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,G);for(let ge=0;ge<At;ge++)Jn?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ve.__webglTexture,z,Yt+ge):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ve.__webglTexture,z),ae?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Sn.__webglTexture,gt,Te+ge):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Sn.__webglTexture,gt),z!==0?I.blitFramebuffer(Ct,Xt,St,dt,Rt,Qt,St,dt,I.COLOR_BUFFER_BIT,I.NEAREST):ae?I.copyTexSubImage3D(vt,gt,Rt,Qt,Te+ge,Ct,Xt,St,dt):I.copyTexSubImage2D(vt,gt,Rt,Qt,Ct,Xt,St,dt);g.bindFramebuffer(I.READ_FRAMEBUFFER,null),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ae?y.isDataTexture||y.isData3DTexture?I.texSubImage3D(vt,gt,Rt,Qt,Te,St,dt,At,ce,Ie,fe.data):L.isCompressedArrayTexture?I.compressedTexSubImage3D(vt,gt,Rt,Qt,Te,St,dt,At,ce,fe.data):I.texSubImage3D(vt,gt,Rt,Qt,Te,St,dt,At,ce,Ie,fe):y.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,gt,Rt,Qt,St,dt,ce,Ie,fe.data):y.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,gt,Rt,Qt,fe.width,fe.height,ce,fe.data):I.texSubImage2D(I.TEXTURE_2D,gt,Rt,Qt,St,dt,ce,Ie,fe);g.pixelStorei(I.UNPACK_ROW_LENGTH,Fe),g.pixelStorei(I.UNPACK_IMAGE_HEIGHT,te),g.pixelStorei(I.UNPACK_SKIP_PIXELS,en),g.pixelStorei(I.UNPACK_SKIP_ROWS,an),g.pixelStorei(I.UNPACK_SKIP_IMAGES,on),gt===0&&L.generateMipmaps&&I.generateMipmap(vt),g.unbindTexture()},this.initRenderTarget=function(y){H.get(y).__webglFramebuffer===void 0&&X.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?X.setTextureCube(y,0):y.isData3DTexture?X.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?X.setTexture2DArray(y,0):X.setTexture2D(y,0),g.unbindTexture()},this.resetState=function(){q=0,J=0,st=null,g.reset(),_t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}};var gu={type:"change"},_c={type:"start"},xu={type:"end"},Oo=new si,_u=new Qe,y0=Math.cos(70*Rs.DEG2RAD),Ne=new U,rn=2*Math.PI,pe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},gc=1e-6,Bo=class extends pr{constructor(t,e=null){super(t,e),this.state=pe.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Mi.ROTATE,MIDDLE:Mi.DOLLY,RIGHT:Mi.PAN},this.touches={ONE:Si.ROTATE,TWO:Si.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new Ve,this._lastTargetPosition=new U,this._quat=new Ve().setFromUnitVectors(t.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vi,this._sphericalDelta=new vi,this._scale=1,this._panOffset=new U,this._rotateStart=new Ft,this._rotateEnd=new Ft,this._rotateDelta=new Ft,this._panStart=new Ft,this._panEnd=new Ft,this._panDelta=new Ft,this._dollyStart=new Ft,this._dollyEnd=new Ft,this._dollyDelta=new Ft,this._dollyDirection=new U,this._mouse=new Ft,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=M0.bind(this),this._onPointerDown=v0.bind(this),this._onPointerUp=S0.bind(this),this._onContextMenu=C0.bind(this),this._onMouseWheel=T0.bind(this),this._onKeyDown=w0.bind(this),this._onTouchStart=A0.bind(this),this._onTouchMove=R0.bind(this),this._onMouseDown=b0.bind(this),this._onMouseMove=E0.bind(this),this._interceptControlDown=P0.bind(this),this._interceptControlUp=I0.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=pe.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(gu),this.update(),this.state=pe.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Ne.copy(e).sub(this.target),Ne.applyQuaternion(this._quat),this._spherical.setFromVector3(Ne),this.autoRotate&&this.state===pe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=rn:n>Math.PI&&(n-=rn),s<-Math.PI?s+=rn:s>Math.PI&&(s-=rn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ne.setFromSpherical(this._spherical),Ne.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ne),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Ne.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Ne.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Oo.origin.copy(this.object.position),Oo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Oo.direction))<y0?this.object.lookAt(this.target):(_u.setFromNormalAndCoplanarPoint(this.object.up,this.target),Oo.intersectPlane(_u,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>gc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>gc||this._lastTargetPosition.distanceToSquared(this.target)>gc?(this.dispatchEvent(gu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?rn/60*this.autoRotateSpeed*t:rn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ne.setFromMatrixColumn(e,0),Ne.multiplyScalar(-t),this._panOffset.add(Ne)}_panUp(t,e){this.screenSpacePanning===!0?Ne.setFromMatrixColumn(e,1):(Ne.setFromMatrixColumn(e,0),Ne.crossVectors(this.object.up,Ne)),Ne.multiplyScalar(t),this._panOffset.add(Ne)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ne.copy(s).sub(this.target);let r=Ne.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(rn*this._rotateDelta.x/e.clientHeight),this._rotateUp(rn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(rn*this._rotateDelta.x/e.clientHeight),this._rotateUp(rn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Ft,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function v0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function M0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function S0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(xu),this.state=pe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function b0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Mi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=pe.DOLLY;break;case Mi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pe.ROTATE}break;case Mi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pe.PAN}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(_c)}function E0(i){switch(this.state){case pe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case pe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case pe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function T0(i){this.enabled===!1||this.enableZoom===!1||this.state!==pe.NONE||(i.preventDefault(),this.dispatchEvent(_c),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(xu))}function w0(i){this.enabled!==!1&&this._handleKeyDown(i)}function A0(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Si.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=pe.TOUCH_ROTATE;break;case Si.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=pe.TOUCH_PAN;break;default:this.state=pe.NONE}break;case 2:switch(this.touches.TWO){case Si.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=pe.TOUCH_DOLLY_PAN;break;case Si.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=pe.TOUCH_DOLLY_ROTATE;break;default:this.state=pe.NONE}break;default:this.state=pe.NONE}this.state!==pe.NONE&&this.dispatchEvent(_c)}function R0(i){switch(this._trackPointer(i),this.state){case pe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case pe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case pe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case pe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=pe.NONE}}function C0(i){this.enabled!==!1&&i.preventDefault()}function P0(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function I0(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var zo=class extends Oi{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new hn;t.deleteAttribute("uv");let e=new Ye({side:Ge}),n=new Ye,s=new dr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new oe(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new Rn(t,n,6),o=new Ce;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let c=new oe(t,Ns(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new oe(t,Ns(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new oe(t,Ns(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let m=new oe(t,Ns(43));m.position.set(-.462,8.89,14.52),m.scale.set(4.38,5.441,.088),this.add(m);let h=new oe(t,Ns(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let p=new oe(t,Ns(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Ns(i){return new or({color:0,emissive:16777215,emissiveIntensity:i})}var Cr=new U;function yn(i,t,e,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Cr.copy(t),Cr[n]=0,Cr.normalize();let l=.5*a/(a+o),u=1-Cr.angleTo(i)/c;return Math.sign(Cr[e])===1?u*l:o/(a+o)+l+l*(1-u)}var Ri=class i extends hn{constructor(t=1,e=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new U,l=new U,u=new U(t,e,n).divideScalar(2).subScalar(r),m=this.attributes.position.array,h=this.attributes.normal.array,p=this.attributes.uv.array,_=m.length/6,v=new U,f=.5/a;for(let d=0,E=0;d<m.length;d+=3,E+=2)switch(c.fromArray(m,d),l.copy(c),l.x-=Math.sign(l.x)*f,l.y-=Math.sign(l.y)*f,l.z-=Math.sign(l.z)*f,l.normalize(),m[d+0]=u.x*Math.sign(c.x)+l.x*r,m[d+1]=u.y*Math.sign(c.y)+l.y*r,m[d+2]=u.z*Math.sign(c.z)+l.z*r,h[d+0]=l.x,h[d+1]=l.y,h[d+2]=l.z,Math.floor(d/_)){case 0:v.set(1,0,0),p[E+0]=yn(v,l,"z","y",r,n),p[E+1]=1-yn(v,l,"y","z",r,e);break;case 1:v.set(-1,0,0),p[E+0]=1-yn(v,l,"z","y",r,n),p[E+1]=1-yn(v,l,"y","z",r,e);break;case 2:v.set(0,1,0),p[E+0]=1-yn(v,l,"x","z",r,t),p[E+1]=yn(v,l,"z","x",r,n);break;case 3:v.set(0,-1,0),p[E+0]=1-yn(v,l,"x","z",r,t),p[E+1]=1-yn(v,l,"z","x",r,n);break;case 4:v.set(0,0,1),p[E+0]=1-yn(v,l,"x","y",r,t),p[E+1]=1-yn(v,l,"y","x",r,e);break;case 5:v.set(0,0,-1),p[E+0]=yn(v,l,"x","y",r,t),p[E+1]=1-yn(v,l,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};function yu(i){let t=[];function e(a,o,c){let l=document.createElement("canvas");l.width=a,l.height=o,c(l.getContext("2d"),a,o);let u=new ir(l);return u.colorSpace=je,u.anisotropy=4,t.push(u),u}let n=e(1024,512,(a,o,c)=>{a.fillStyle="#30323b",a.fillRect(0,0,o,c);let l=173,u=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296);for(let m=0;m<18e3;m++){let h=Math.floor(40+u()*35);a.fillStyle="rgba("+h+","+(h+3)+","+(h+10)+",.22)",a.fillRect(u()*o,u()*c,1,1)}for(let m=0;m<6;m++)for(let h=0;h<8;h++){let p=18+h*124,_=16+m*80;a.fillStyle=(m+h)%3?"#444550":"#4f4a43",a.fillRect(p,_,114,69),a.strokeStyle="#888071",a.lineWidth=.65,a.strokeRect(p+.5,_+.5,113,68);for(let v=0;v<15;v++)a.fillStyle=v%4?"#5a5b64":"#a69a75",a.fillRect(p+5+v*7,_+5,2,56);a.strokeStyle="#a08d71",a.beginPath(),a.moveTo(p+4,_+62),a.lineTo(p+105,_+62),a.lineTo(p+105,_+72),a.lineTo(p+120,_+72),a.stroke()}a.strokeStyle="#a8a19a",a.lineWidth=2,a.strokeRect(6,6,o-12,c-12)}),s=e(1024,640,(a,o,c)=>{a.fillStyle="#27232a",a.fillRect(0,0,o,c),a.strokeStyle="#51454b",a.lineWidth=1;for(let l=0;l<34;l++){let u=30+l*29;a.beginPath(),a.moveTo(u,42),a.lineTo(u,76),a.lineTo(u+8,84),a.lineTo(u+8,c-84),a.lineTo(u,c-76),a.lineTo(u,c-42),a.stroke()}a.strokeStyle="#ac9b88",a.lineWidth=2,a.strokeRect(12,12,o-24,c-24),a.fillStyle="#ccc4bb",a.font="bold 19px monospace",a.fillText("ZHIXIN  /  3D STACK",35,c-30),a.font="13px monospace",a.fillText(String(i).padStart(2,"0")+" DIE  \xB7  KNOWLEDGE PACKAGE",650,c-32),a.beginPath(),a.moveTo(30,30),a.lineTo(45,30),a.lineTo(30,45),a.fill();for(let l=0;l<24;l++)a.fillStyle=l%3?"#b6a694":"#4c3c39",a.fillRect(735+l*6,24,3,18)}),r=e(128,128,(a,o,c)=>{let l=a.createRadialGradient(o/2,c/2,10,o/2,c/2,o/2);l.addColorStop(0,"rgba(0,0,0,.65)"),l.addColorStop(.6,"rgba(0,0,0,.25)"),l.addColorStop(1,"rgba(0,0,0,0)"),a.fillStyle=l,a.fillRect(0,0,o,c)});return{silicon:n,substrate:s,shadow:r,dispose(){t.forEach(a=>a.dispose())}}}var Se=Mc(vu()),Su=Mc(Mu());function L0(i,t,e){let n=Se.default.layout(t),s=null;try{s=localStorage}catch{}let r=Se.default.load(s,n),a=new No({canvas:i,antialias:!0,powerPreference:"default"});a.setPixelRatio(Math.min(devicePixelRatio||1,1.5)),a.toneMapping=gr,a.toneMappingExposure=1.25,a.shadowMap.type=ka,a.shadowMap.autoUpdate=!1;let o=new Oi;o.background=new Gt("#100d15");let c=yu(n.layers.length),l=new zo,u=new Ls(a),m=u.fromScene(l,.04);o.environment=m.texture,o.environmentIntensity=.75,l.dispose(),u.dispose();let h=new ze(40,1,1,1e5),p=new Bo(h,i);p.enableDamping=!1,p.minDistance=100,p.maxDistance=5e4,p.maxPolarAngle=Math.PI*.88,p.target.set(0,0,0),o.add(new cr(15199487,3416364,.8));let _=new Ss(16773340,3.2);_.position.set(-400,1e3,600),_.castShadow=!0,_.shadow.mapSize.set(1024,1024),Object.assign(_.shadow.camera,{left:-560,right:560,top:560,bottom:-560,near:10,far:4e3}),_.shadow.bias=-2e-4,_.shadow.normalBias=.8,o.add(_,_.target);let v=new Ss(16733560,1.1);v.position.set(600,200,-700),o.add(v);let f={note:"#b9aaa9",course:"#b88c8e",tool:"#c4ad80",guide:"#a3a9b9"},d=new Ri(640,4,350,1,.65),E=new zi(27,27,2,6);E.scale(1.65,1,1);let R=new zi(24,24,2,32);R.scale(1.1,1,1);let M={die:new Ri(104,2,44,2,2),memory:new Ri(104,2,30,1,1),hex:E,round:R},b=new Ye({map:c.silicon,roughness:.31,metalness:.72}),S=new Ye({color:"#393d49",roughness:.22,metalness:.8}),A=new rr(d),x=new ri({color:"#6c6268"}),T=new ri({color:"#aa9c86"}),C=n.layers.map(P=>{let tt=new Bn,at=new oe(d,S),Dt=new mi(A,x),ht=Object.fromEntries(Se.default.shapes.map(_e=>{let qt=new Rn(M[_e],b,P.nodes.length);return qt.count=0,qt.castShadow=!0,qt.receiveShadow=!0,qt.userData.nodes=[],tt.add(qt),[_e,qt]})),mt=new Ae;return at.castShadow=!0,at.receiveShadow=!0,tt.add(at,Dt,new mi(mt,T)),o.add(tt),{group:tt,plate:at,meshes:ht,layer:P,pinGeo:mt}});function F(){for(let P of C){let tt=[];for(let ht of Object.values(P.meshes))ht.count=0,ht.userData.nodes=[];for(let ht of P.layer.nodes){let mt=Se.default.shape(ht),_e=P.meshes[mt],qt=Se.default.footprint(ht),pn=_e.count++;_e.userData.nodes.push(ht),_e.setMatrixAt(pn,new ne().compose(new U(ht.x,4,ht.z),new Ve,new U(qt.scale,1,qt.scale)));let Je=mt==="round"?24:mt==="hex"?6:4,Kn=mt==="round"||mt==="hex"?Array.from({length:Je},(Ke,Un)=>[Math.sin(Un/Je*Math.PI*2)*qt.x,Math.cos(Un/Je*Math.PI*2)*qt.z]):[[-qt.x,-qt.z],[qt.x,-qt.z],[qt.x,qt.z],[-qt.x,qt.z]];for(let Ke=0;Ke<Je;Ke++){let Un=Kn[Ke],Pr=Kn[(Ke+1)%Je];tt.push(ht.x+Un[0],5.2,ht.z+Un[1],ht.x+Pr[0],5.2,ht.z+Pr[1])}for(let Ke of[-1,1])for(let Un of[-.6,0,.6])tt.push(ht.x+Un*qt.x,6,ht.z+Ke*qt.z,ht.x+Un*qt.x,6,ht.z+Ke*(qt.z+7))}let at=new Float32Array(tt),Dt=P.pinGeo.getAttribute("position");Dt?.array.length===at.length?(Dt.array.set(at),Dt.needsUpdate=!0):P.pinGeo.setAttribute("position",new qe(at,3)),P.pinGeo.computeBoundingSphere();for(let ht of Object.values(P.meshes))ht.instanceMatrix.needsUpdate=!0,ht.computeBoundingSphere()}}F();let O=new Bn,V=new Ri(760,26,470,2,4),N=new Ye({color:"#292329",metalness:.15,roughness:.68}),G=new oe(V,N);G.position.set(0,-40,0),G.castShadow=!0,G.receiveShadow=!0,O.add(G),o.add(O);let q=new oe(new Ri(672,19,382,1,2),new Ye({color:"#37353b",metalness:.35,roughness:.45}));q.position.y=-17.5,q.castShadow=!0,q.receiveShadow=!0,O.add(q);let J=new oe(new Hn(752,462),new Ye({map:c.substrate,metalness:.3,roughness:.65}));J.rotation.x=-Math.PI/2,J.position.y=-26.9,J.receiveShadow=!0,O.add(J);let st=new oe(new Hn(1450,1100),new ar({color:"#000000",opacity:.35,depthWrite:!1}));st.rotation.x=-Math.PI/2,st.position.y=-64,st.receiveShadow=!0,O.add(st);let Y=new oe(new Hn(1050,750),new Bi({map:c.shadow,transparent:!0,depthWrite:!1}));Y.rotation.x=-Math.PI/2,Y.position.y=-63.8,O.add(Y);let nt=new ys(6,12,8),it=new Ye({color:"#c59477",metalness:.85,roughness:.25}),Nt=new Ye({color:"#b7bbc2",metalness:.95,roughness:.2}),Pt=new Rn(nt,Nt,160);for(let P=0;P<10;P++)for(let tt=0;tt<16;tt++)Pt.setMatrixAt(P*16+tt,new ne().makeTranslation((tt-7.5)*42,-57,(P-4.5)*42));Pt.castShadow=!0,O.add(Pt);let me=new hn(9,2,11),Kt=new Rn(me,it,64);for(let P=0;P<32;P++)for(let tt of[-1,1])Kt.setMatrixAt(P*2+(tt>0?1:0),new ne().makeTranslation((P-15.5)*22,-26,tt*222));O.add(Kt);let se=new Ye({color:"#19181e",roughness:.82}),$=new Ye({map:c.silicon,color:"#a9a9b0",metalness:.7,roughness:.32}),et=new Hn(628,338),wt=new hn(628,3,338),zt=new ys(2.2,6,4);for(let P of C){let tt=new oe(et,$);tt.rotation.x=-Math.PI/2,tt.position.y=2.05,tt.receiveShadow=!0;let at=new oe(wt,se);at.position.y=-3.5,at.castShadow=!0,P.group.add(tt,at);let Dt=new Rn(zt,it,64);for(let ht=0;ht<32;ht++)for(let mt of[-1,1])Dt.setMatrixAt(ht*2+(mt>0?1:0),new ne().makeTranslation((ht-15.5)*19,-7,mt*166));P.group.add(Dt)}let bt=new zi(2.6,2.6,1,8),Bt=new Rn(bt,it,24);o.add(Bt);let xe=new mi(new Ae,new ri({color:"#814355"})),Ht=new mi(new Ae,new ri({color:"#ffd0df"}));o.add(xe,Ht);let $t=new Ae,ue=new Float32Array(36);$t.setAttribute("position",new qe(ue,3)),$t.setDrawRange(0,0);let Jt=new er($t,new xs({color:"#fff0da",size:5,sizeAttenuation:!1}));Jt.frustumCulled=!1,o.add(Jt);let le=document.createElement("div");le.className="chip3d-labels",i.parentElement.append(le);let be=Array.from({length:20},()=>{let P=document.createElement("span");return P.hidden=!0,le.append(P),P}),Pe=document.getElementById("chip-layer-gap"),de=document.getElementById("chip-layer"),Ee=document.getElementById("chip-3d-status");for(let P of n.layers){let tt=document.createElement("option");tt.value=String(P.index),tt.textContent="L"+(P.index+1)+" \xB7 "+P.title+"\uFF08"+P.nodes.length+"\uFF09",de.append(tt)}let I=12,Wt=-1,Mt={selected:null,edge:null,matches:()=>!0,signals:!1},w=[],g=[],B=[],H=[],X=!0,ot=!document.hidden,lt=null,Z=!1,K=!0,ut=null,It=0,ft="",ct=n.layers.map((P,tt)=>tt*I),yt=null,Tt=null,kt=matchMedia("(prefers-reduced-motion: reduce)").matches,D=new fr,pt=new Ft,j=new U,rt=P=>ct[P]||0,_t=P=>Wt<0||P.layer===Wt;function Q(){!Z&&X&&ot&&lt===null&&(lt=requestAnimationFrame(Zn))}function Lt(P,tt){let at=P.geometry.getAttribute("position");at&&at.array.length===tt.length?(at.array.set(tt),at.needsUpdate=!0):(P.geometry.dispose(),P.geometry=new Ae,P.geometry.setAttribute("position",new we(tt,3))),P.geometry.computeBoundingSphere()}function Et(){O.visible=Wt<0,Bt.visible=Wt<0,a.shadowMap.enabled=!yt&&!He&&n.layers.length<=12&&I<=90&&Wt<0;let P=I+":"+Wt;ft!==P&&(a.shadowMap.needsUpdate=!0,ft=P),_.target.position.y=rt(n.layers.length-1)/2,_.position.y=_.target.position.y+1e3;let tt=Math.max(20,rt(n.layers.length-1)+32);for(let mt=0;mt<24;mt++){let _e=mt<12?-309:309,qt=(mt%12-5.5)*27,pn=new ne().compose(new U(_e,tt/2-26,qt),new Ve,new U(1,tt,1));Bt.setMatrixAt(mt,pn)}Bt.instanceMatrix.needsUpdate=!0,Bt.computeBoundingSphere();let at=[],Dt=[];B=[],H=[],w=[],g=[];let ht=new Set;if(Mt.selected){ht.add(Mt.selected);for(let mt of t.edges)(mt.source===Mt.selected||mt.target===Mt.selected)&&(ht.add(mt.source),ht.add(mt.target))}Mt.edge&&(ht.add(Mt.edge.source),ht.add(Mt.edge.target));for(let mt of C){mt.group.position.y=rt(mt.layer.index),mt.group.visible=Wt<0||Wt===mt.layer.index;for(let _e of Object.values(mt.meshes))_e.userData.nodes.forEach((qt,pn)=>{let Je=new Gt(f[qt.group]);(!Mt.matches(qt.id)||ht.size&&!ht.has(qt.id))&&Je.multiplyScalar(.22),(qt.id===Mt.selected||Mt.edge&&(Mt.edge.source===qt.id||Mt.edge.target===qt.id))&&Je.set("#ffe0ec"),_e.setColorAt(pn,Je)}),_e.instanceColor&&(_e.instanceColor.needsUpdate=!0)}t.edges.forEach((mt,_e)=>{let qt=n.byId.get(mt.source),pn=n.byId.get(mt.target);if(!qt||!pn||!_t(qt)||!_t(pn)||!Mt.matches(qt.id)&&!Mt.matches(pn.id))return;let Je=Se.default.route(qt,pn,_e,I,ct),Kn=Mt.edge?Mt.edge.source===mt.source&&Mt.edge.target===mt.target:Mt.selected&&(mt.source===Mt.selected||mt.target===Mt.selected),Ke={edge:mt,index:_e,points:Je,chosen:Kn};w.push(Ke);let Un=Se.default.segments(Je),Pr=Kn?Dt:at,bu=Kn?H:B;Pr.push(...Un);for(let xc=1;xc<Je.length;xc++)bu.push(_e);Kn&&g.push(Ke)}),Lt(xe,at),Lt(Ht,Dt),xe.material.color.set(ht.size?"#492b3b":"#814355"),Ee.textContent=n.layers.length+" \u5C42 \xB7 \u6BCF\u5C42\u6700\u591A "+n.capacity+" \u4E2A\u5143\u4EF6 \xB7 "+(Wt<0?"\u663E\u793A\u5168\u90E8\u5C42":"\u4EC5\u663E\u793A L"+(Wt+1)),Q()}function re(){K=!0;let P=Wt<0?rt(n.layers.length-1)/2:rt(Wt);p.target.set(0,P,0);let tt=new U(.85,.65,1.15).normalize();h.position.copy(p.target).addScaledVector(tt,1e3),h.lookAt(p.target);let at=h.quaternion.clone().invert(),Dt=Math.tan(Rs.degToRad(h.fov/2)),ht=Dt*h.aspect,mt=100,_e=Wt<0?-65:rt(Wt)-5,qt=Wt<0?rt(n.layers.length-1)+25:rt(Wt)+25;for(let pn of[-390,390])for(let Je of[_e,qt])for(let Kn of[-245,245]){let Ke=new U(pn,Je-P,Kn).applyQuaternion(at);mt=Math.max(mt,Ke.z+Math.max(Math.abs(Ke.x)/ht,Math.abs(Ke.y)/Dt))}h.position.copy(p.target).addScaledVector(tt,mt*1.1),h.updateProjectionMatrix(),p.update(),Q()}function ie(){if(!X)return;let P=i.getBoundingClientRect();!P.width||!P.height||(a.setSize(P.width,P.height,!1),h.aspect=P.width/P.height,h.updateProjectionMatrix(),K?re():Q())}function Ue(P){Ci(),Wt=P,de.value=String(P),ut=null,Et(),re()}function fn(P,tt){let at=n.byId.get(P);Wt>=0&&tt&&n.byId.get(tt.source)?.layer!==n.byId.get(tt.target)?.layer?Ue(-1):Wt>=0&&at&&at.layer!==Wt&&Ue(at.layer)}function Go(P){Mt=P,fn(Mt.selected,Mt.edge),y(),Et()}function Ho(P){let tt=n.byId.get(P);tt&&(Ue(tt.layer),p.target.set(tt.x,rt(tt.layer)+10,tt.z),h.position.copy(p.target).add(new U(220,310,360)),K=!1,p.update(),Q())}function Wi(P){Tt=null,K=!1,h.position.sub(p.target).multiplyScalar(1/P).clampLength(100,5e4).add(p.target),p.update(),Q()}function Xi(P,tt,at,Dt){return j.set(P,tt,at).project(h),{x:(j.x+1)*Dt.width/2,y:(1-j.y)*Dt.height/2,depth:j.z}}function Wo(){let P=i.getBoundingClientRect(),tt=[];for(let ht of n.nodes){if(!_t(ht))continue;let mt=Xi(ht.x,rt(ht.layer)+19,ht.z,P);if(mt.depth<0||mt.depth>1||mt.x<20||mt.x>P.width-20||mt.y<12||mt.y>P.height-12)continue;let _e=ht.id===Mt.selected||ht.id===ut||Mt.edge&&(Mt.edge.source===ht.id||Mt.edge.target===ht.id);!_e&&(!Mt.matches(ht.id)||Wt<0)||tt.push({text:ht.title,p:mt,priority:_e?0:1})}for(let ht of n.layers){if(Wt>=0&&ht.index!==Wt)continue;let mt=Xi(-330,rt(ht.index)+8,150,P);mt.depth>=0&&mt.depth<=1&&mt.x>0&&mt.x<P.width&&mt.y>10&&mt.y<P.height-10&&tt.push({text:"L"+(ht.index+1)+" \xB7 "+ht.title,p:mt,priority:2})}tt.sort((ht,mt)=>ht.priority-mt.priority||ht.p.depth-mt.p.depth);let at=[],Dt=0;for(let ht of tt){if(Dt===be.length)break;if(at.some(_e=>Math.abs(_e.x-ht.p.x)<110&&Math.abs(_e.y-ht.p.y)<24))continue;let mt=be[Dt++];mt.hidden=!1,mt.textContent=ht.text,mt.style.transform="translate("+Math.round(ht.p.x)+"px,"+Math.round(ht.p.y)+"px) translate(-50%,-100%)",at.push(ht.p)}for(let ht=Dt;ht<be.length;ht++)be[ht].hidden=!0}function Us(){for(let Dt of C)Dt.group.position.y=rt(Dt.layer.index);let P=Math.max(20,rt(n.layers.length-1)+32);for(let Dt=0;Dt<24;Dt++){let ht=Dt<12?-309:309,mt=(Dt%12-5.5)*27;Bt.setMatrixAt(Dt,new ne().compose(new U(ht,P/2-26,mt),new Ve,new U(1,P,1)))}Bt.instanceMatrix.needsUpdate=!0,Bt.computeBoundingSphere();let tt=[],at=[];for(let Dt of w)Dt.points=Se.default.route(n.byId.get(Dt.edge.source),n.byId.get(Dt.edge.target),Dt.index,I,ct),(Dt.chosen?at:tt).push(...Se.default.segments(Dt.points));Lt(xe,tt),Lt(Ht,at)}function Ci(){yt&&(a.setPixelRatio(Math.min(devicePixelRatio||1,1.5)),ct=yt.to.slice(),yt=null,Tt=null,Us(),ft="",Et())}function Zn(P){if(lt=null,!X||!ot||Z)return;let tt=Mt.signals&&!kt&&g.length;if((tt||yt)&&It&&P-It<1e3/(yt||He?60:30)){Q();return}if(It=P,yt){let Dt=Se.default.advance(yt,P,ct);if(Us(),Tt){let ht=Se.default.ease((P-yt.start)/(yt.duration+yt.stagger||1));h.position.lerpVectors(Tt.from,Tt.to,ht),h.position.y+=Math.sin(ht*Math.PI)*35,p.target.lerpVectors(Tt.fromTarget,Tt.toTarget,ht),p.update()}Dt&&(a.setPixelRatio(Math.min(devicePixelRatio||1,1.5)),yt=null,Tt&&(K=!0),Tt=null,ft="",Et())}let at=tt?Math.min(12,g.length):0;for(let Dt=0;Dt<at;Dt++){let ht=Se.default.sample(g[Dt].points,(P/5e3+Dt*.17)%1);ue.set([ht.x,ht.y+1,ht.z],Dt*3)}$t.setDrawRange(0,at),$t.attributes.position.needsUpdate=!0,a.render(o,h),Wo(),(tt||yt)&&Q()}function Pi(P){let tt=i.getBoundingClientRect();pt.set((P.clientX-tt.left)/tt.width*2-1,-(P.clientY-tt.top)/tt.height*2+1),D.setFromCamera(pt,h),D.params.Line.threshold=3;let at=C.filter(mt=>mt.group.visible).flatMap(mt=>[...Object.values(mt.meshes),mt.plate]);Wt<0&&at.push(G,q,Pt,Kt,Bt);let Dt=D.intersectObjects(at,!1)[0];if(Dt){let mt=Dt.object.userData.nodes?.[Dt.instanceId];if(mt&&(Mt.matches(mt.id)||mt.id===Mt.selected||Mt.edge&&(Mt.edge.source===mt.id||Mt.edge.target===mt.id)))return{id:mt.id}}let ht=D.intersectObjects([Ht,xe],!1);for(let mt of ht){if(Dt&&mt.distance>Dt.distance+5)continue;let qt=(mt.object===Ht?H:B)[Math.floor(mt.index/2)];if(qt!==void 0)return{edge:t.edges[qt]}}return{}}let Ln=document.getElementById("chip-edit"),Fs=document.getElementById("chip-editor"),qi=document.getElementById("chip-edit-name"),oi=document.getElementById("chip-shape"),Dn=document.getElementById("chip-scale"),li=document.getElementById("chip-position-x"),ci=document.getElementById("chip-position-z"),vn=document.getElementById("chip-edit-status"),Os=document.getElementById("chip-reset-module"),Ii=!1,He=null,Mn=null;function y(){if(!Fs)return;Fs.hidden=!Ii;let P=n.byId.get(Mt.selected);qi.textContent=P?P.title:"\u5148\u9009\u62E9\u4E00\u679A\u6A21\u5757";for(let tt of[oi,Dn,li,ci,Os])tt.disabled=!P;P&&(oi.value=Se.default.shape(P),Dn.value=String(Math.round(Se.default.footprint(P).scale*100)),li.value=String(Math.round(P.x*10)/10),ci.value=String(Math.round(P.z*10)/10))}function L(){vn.textContent=Se.default.save(s,n)?"\u5E03\u5C40\u5DF2\u4FDD\u5B58\u5728\u672C\u6D4F\u89C8\u5668":"\u6D4F\u89C8\u5668\u65E0\u6CD5\u4FDD\u5B58\uFF0C\u5F53\u524D\u5E03\u5C40\u4ECD\u53EF\u4F7F\u7528\uFF1B\u5237\u65B0\u540E\u53EF\u80FD\u6062\u590D\u9ED8\u8BA4\u3002"}function W(){F(),ft="",Et(),y()}function k(){let P=n.byId.get(Mt.selected);if(!P)return;let tt=Se.default.placement(n,P,Number(li.value),Number(ci.value),{shape:oi.value,scale:Number(Dn.value)/100});tt?(Object.assign(P,tt),W(),L()):(y(),vn.textContent="\u8FD9\u91CC\u4E0E\u5176\u4ED6\u6A21\u5757\u592A\u8FD1\uFF0C\u8BF7\u6362\u4E2A\u4F4D\u7F6E\u6216\u7F29\u5C0F\u6A21\u5757\u3002")}for(let P of[oi,Dn,li,ci])P.onchange=k;Ln.onchange=()=>{dt(!0),Ii=Ln.checked,i.classList.toggle("chip-layout-editing",Ii),y(),vn.textContent=r?"\u62D6\u52A8\u6A21\u5757\u5728\u672C\u5C42\u6446\u653E\uFF1B\u7A7A\u767D\u5904\u4ECD\u53EF\u65CB\u8F6C\u3002Esc \u64A4\u9500\u672C\u6B21\u62D6\u52A8\u3002":"\u4FDD\u5B58\u7684\u5E03\u5C40\u65E0\u6CD5\u8BFB\u53D6\uFF0C\u5F53\u524D\u4F7F\u7528\u9ED8\u8BA4\u5E03\u5C40\u3002"},Os.onclick=()=>{let P=n.byId.get(Mt.selected),tt=Se.default.layout(t).byId.get(P?.id);if(!P||!tt)return;let at=Se.default.placement(n,P,tt.x,tt.z,{shape:Se.default.shape(tt),scale:1});at?(Object.assign(P,at),W(),L()):vn.textContent="\u9ED8\u8BA4\u4F4D\u7F6E\u88AB\u5176\u4ED6\u6A21\u5757\u5360\u7528\uFF0C\u8BF7\u5148\u79FB\u5F00\u5B83\u3002"};let z=new Qe(new U(0,1,0)),gt=new U;function St(P){let tt=i.getBoundingClientRect();return pt.set((P.clientX-tt.left)/tt.width*2-1,-(P.clientY-tt.top)/tt.height*2+1),D.setFromCamera(pt,h),D.ray.intersectPlane(z,gt)}function dt(P){if(!He)return;let tt=He;He=null,Mn!==null&&(cancelAnimationFrame(Mn),Mn=null),P&&(Object.assign(tt.node,tt.before),W()),p.enabled=!0,ft="",Et(),i.hasPointerCapture(tt.pointer)&&i.releasePointerCapture(tt.pointer)}function At(P){if(!Ii||P.button!==0)return;if(He){dt(!0);return}let tt=Pi(P),at=n.byId.get(tt.id);at&&(Ci(),z.constant=-(rt(at.layer)+4),St(P)&&(P.preventDefault(),P.stopImmediatePropagation(),e.select(at.id),He={node:at,pointer:P.pointerId,before:{x:at.x,z:at.z,shape:Se.default.shape(at),scale:Se.default.footprint(at).scale},dx:at.x-gt.x,dz:at.z-gt.z,event:null},Tt=null,K=!1,p.enabled=!1,i.setPointerCapture(P.pointerId),i.focus(),vn.textContent="\u6B63\u5728\u6446\u653E \xB7 \u677E\u5F00\u4FDD\u5B58 \xB7 Esc \u64A4\u9500"))}function Ct(P){!He||P.pointerId!==He.pointer||(P.preventDefault(),P.stopImmediatePropagation(),He.event={clientX:P.clientX,clientY:P.clientY},Mn===null&&(Mn=requestAnimationFrame(Xt)))}function Xt(){Mn=null;let P=He;if(!P?.event||!St(P.event))return;let tt=document.getElementById("chip-snap").checked?5:1,at=Math.round((gt.x+P.dx)/tt)*tt,Dt=Math.round((gt.z+P.dz)/tt)*tt,ht=Se.default.placement(n,P.node,at,Dt);ht?(Object.assign(P.node,ht),W(),vn.textContent="\u6B63\u5728\u6446\u653E \xB7 \u677E\u5F00\u4FDD\u5B58 \xB7 Esc \u64A4\u9500"):vn.textContent="\u8BE5\u4F4D\u7F6E\u4E0E\u5176\u4ED6\u6A21\u5757\u91CD\u53E0\uFF0C\u8BF7\u7EE7\u7EED\u79FB\u52A8\u3002"}function Yt(P){!He||P.pointerId!==He.pointer||(P.preventDefault(),P.stopImmediatePropagation(),P.type==="pointerup"?(Mn!==null&&(cancelAnimationFrame(Mn),Xt()),dt(!1),L()):(dt(!0),vn.textContent="\u5DF2\u64A4\u9500\u672C\u6B21\u62D6\u52A8\u3002"))}function Rt(P){P.key==="Escape"&&He&&(P.preventDefault(),P.stopImmediatePropagation(),dt(!0),vn.textContent="\u5DF2\u64A4\u9500\u672C\u6B21\u62D6\u52A8\u3002")}i.addEventListener("pointerdown",At,!0),i.addEventListener("pointermove",Ct,!0);for(let P of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(P,Yt,!0);i.addEventListener("keydown",Rt,!0);let Qt=new Map,Te=Su.default.createTapTracker(),fe=!1;function ce(P){P.button===0&&(Qt.set(P.pointerId,{x:P.clientX,y:P.clientY,moved:!1}),Qt.size>1&&(fe=!0,Te.reset()))}function Ie(){ut=null,Q()}function vt(P){let tt=Qt.get(P.pointerId);if(tt)Math.hypot(P.clientX-tt.x,P.clientY-tt.y)>4&&(tt.moved=!0,K=!1);else if(P.pointerType!=="touch"){let at=Pi(P).id||null;at!==ut&&(ut=at,Q())}}function Fe(P){let tt=Qt.get(P.pointerId);if(Qt.delete(P.pointerId),!tt)return;if(fe){Qt.size||(fe=!1);return}let at=Pi(P),Dt=Te.finish({id:at.id,x:P.clientX,y:P.clientY,moved:tt.moved||Math.hypot(P.clientX-tt.x,P.clientY-tt.y)>4,cancelled:P.type!=="pointerup"});Dt!=="none"&&(at.id?(e.select(at.id),Dt==="open"&&e.open(at.id)):e.select(null,at.edge))}function te(P){if(Tt=null,P.key==="Enter"&&Mt.selected)e.open(Mt.selected),P.preventDefault();else if(P.key==="Escape")e.select(null);else if(P.key==="0")re(),P.preventDefault();else if(P.key==="+"||P.key==="=")Wi(1.2),P.preventDefault();else if(P.key==="-")Wi(1/1.2),P.preventDefault();else if(P.key.startsWith("Arrow")){let tt=h.position.clone().sub(p.target),at=new vi().setFromVector3(tt);at.theta+=P.key==="ArrowLeft"?.12:P.key==="ArrowRight"?-.12:0,at.phi=Rs.clamp(at.phi+(P.key==="ArrowUp"?-.1:P.key==="ArrowDown"?.1:0),.1,Math.PI*.88),h.position.copy(p.target).add(tt.setFromSpherical(at)),K=!1,p.update(),Q(),P.preventDefault()}}let en=()=>{Tt=null,K=!1};p.addEventListener("start",en),p.addEventListener("change",Q),i.addEventListener("pointerdown",ce),i.addEventListener("pointermove",vt),i.addEventListener("pointerleave",Ie);for(let P of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(P,Fe);i.addEventListener("keydown",te);let an=()=>{K=!1};i.addEventListener("wheel",an,{passive:!0});let on=document.getElementById("chip-explode");function Jn(P){let tt=K||!!Tt,at=h.position.clone(),Dt=p.target.clone();if(I=P,Pe.value=I,document.getElementById("chip-layer-gap-value").textContent=I,on.textContent=I>90?"\u6536\u7D27\u5C01\u88C5":"\u5C55\u5F00\u82AF\u7247",on.setAttribute("aria-pressed",String(I>90)),yt=Se.default.transition(ct,I,performance.now(),kt),Tt=null,kt){Ci(),tt&&re();return}if(tt){let ht=ct;ct=yt.to,re(),Tt={from:at,fromTarget:Dt,to:h.position.clone(),toTarget:p.target.clone()},ct=ht,h.position.copy(at),p.target.copy(Dt),p.update(),K=!1}a.setPixelRatio(Math.min(devicePixelRatio||1,1.25)),a.shadowMap.enabled=!1,Ee.textContent=yt.opening?"\u6B63\u5728\u9010\u5C42\u5C55\u5F00\u2026":"\u6B63\u5728\u9010\u5C42\u5408\u62E2\u2026",Q()}Pe.oninput=()=>Jn(Number(Pe.value)),on.onclick=()=>{Wt>=0&&Ue(-1),Jn(I>90?12:180)},de.onchange=()=>Ue(Number(de.value));function ae(){dt(!0),ot=!document.hidden,!ot&&lt!==null?(cancelAnimationFrame(lt),lt=null):Q()}document.addEventListener("visibilitychange",ae);let ve=new ResizeObserver(ie);ve.observe(i);function Sn(P){P.preventDefault(),e.error("\u4E09\u7EF4\u7ED8\u56FE\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u5DF2\u5207\u6362\u4E3A\u4E8C\u7EF4\u7535\u8DEF\u677F\u3002")}i.addEventListener("webglcontextlost",Sn);function ge(P){dt(!0),Ln&&(Ln.disabled=!P),P||(Ii=!1,i.classList.remove("chip-layout-editing"),Ln&&(Ln.checked=!1),y()),X=P,le.hidden=!P,!P&&lt!==null&&(cancelAnimationFrame(lt),lt=null),P&&ie()}function Nn(){if(Z)return;dt(!0),Z=!0,i.removeEventListener("pointerdown",At,!0),i.removeEventListener("pointermove",Ct,!0);for(let at of["pointerup","pointercancel","lostpointercapture"])i.removeEventListener(at,Yt,!0);i.removeEventListener("keydown",Rt,!0),Ln.onchange=null,Os.onclick=null;for(let at of[oi,Dn,li,ci])at.onchange=null;lt!==null&&cancelAnimationFrame(lt),ve.disconnect(),document.removeEventListener("visibilitychange",ae),p.dispose(),i.removeEventListener("pointerdown",ce),i.removeEventListener("pointermove",vt),i.removeEventListener("pointerleave",Ie);for(let at of["pointerup","pointercancel","lostpointercapture"])i.removeEventListener(at,Fe);i.removeEventListener("keydown",te),i.removeEventListener("wheel",an),i.removeEventListener("webglcontextlost",Sn),Pe.oninput=null,de.onchange=null,on.onclick=null,le.remove();let P=new Set,tt=new Set;o.traverse(at=>{if(at.isInstancedMesh&&at.dispose(),at.geometry&&P.add(at.geometry),at.material)for(let Dt of Array.isArray(at.material)?at.material:[at.material])tt.add(Dt)}),P.forEach(at=>at.dispose()),tt.forEach(at=>at.dispose()),c.dispose(),m.dispose(),_.shadow.dispose(),a.dispose()}return Et(),ie(),{update:Go,fit:()=>{Ci(),Wt>=0?Ue(-1):re()},locate:Ho,zoomBy:Wi,resize:ie,setActive:ge,dispose:Nn}}return Pu(D0);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
