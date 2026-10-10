import {trace, type Point} from './geometry';
export type DrawingPath = {points: Point[]; closed: boolean};
export type Raster = {width: number; height: number; data: Uint8ClampedArray};

// Suppressed Sobel edges preserve local contrast (including features inside a dark subject).
export function imagePaths(image: Raster, mode: 'outline' | 'details', threshold: number, sensitivity: number): DrawingPath[] {
 const {width:w,height:h,data}=image, gray=new Float32Array(w*h);
 for(let i=0;i<gray.length;i++){const k=i*4,a=data[k+3]/255;gray[i]=(.299*data[k]+.587*data[k+1]+.114*data[k+2])*a+255*(1-a);}
 if(mode==='outline')return trace(Uint8Array.from(gray,v=>v<threshold?1:0),w,h).map(points=>({points,closed:true}));
 const smooth=new Float32Array(w*h),magnitude=new Float32Array(w*h),direction=new Uint8Array(w*h);
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let v=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)v+=gray[(y+dy)*w+x+dx]*(dx===0?2:1)*(dy===0?2:1);smooth[y*w+x]=v/16;}
 for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const i=y*w+x;const gx=-smooth[i-w-1]+smooth[i-w+1]-2*smooth[i-1]+2*smooth[i+1]-smooth[i+w-1]+smooth[i+w+1];const gy=-smooth[i-w-1]-2*smooth[i-w]-smooth[i-w+1]+smooth[i+w-1]+2*smooth[i+w]+smooth[i+w+1];magnitude[i]=Math.hypot(gx,gy);direction[i]=Math.round((Math.atan2(gy,gx)*180/Math.PI+180)%180/45)%4;}
 const thin=new Float32Array(w*h),offsets=[1,w+1,w,w-1];
 for(let y=3;y<h-3;y++)for(let x=3;x<w-3;x++){const i=y*w+x,d=offsets[direction[i]];if(magnitude[i]>=magnitude[i-d]&&magnitude[i]>magnitude[i+d])thin[i]=magnitude[i];}
 const high=140-sensitivity*1.25,low=high*.4,mask=new Uint8Array(w*h),stack:number[]=[];
 for(let i=0;i<thin.length;i++)if(thin[i]>=high){mask[i]=1;stack.push(i);}
 while(stack.length){const i=stack.pop()!;for(const d of [-w-1,-w,-w+1,-1,1,w-1,w,w+1]){const n=i+d;if(n>=0&&n<mask.length&&!mask[n]&&thin[n]>=low){mask[n]=1;stack.push(n);}}}
 return edgePaths(mask,w,h);
}

// Trace actual edge chains; an open mouth or whisker must not acquire a closing line.
export function edgePaths(mask: Uint8Array,w: number,h: number): DrawingPath[] {
 const graph=new Map<number,number[]>();
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!mask[i])continue;const neighbors:number[]=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const n=i+dy*w+dx;if(!mask[n])continue;if(dx&&dy&&(mask[i+dx]||mask[i+dy*w]))continue;neighbors.push(n);}graph.set(i,neighbors);}
 const seen=new Set<string>(),paths:DrawingPath[]=[];
 const key=(a:number,b:number)=>a<b?`${a}:${b}`:`${b}:${a}`;
 function walk(start:number,next:number){const points:Point[]=[[start%w,Math.floor(start/w)]];let prev=start,current=next,closed=false;
 while(true){seen.add(key(prev,current));points.push([current%w,Math.floor(current/w)]);if(current===start){closed=true;points.pop();break;}const ns=graph.get(current)||[];if(ns.length!==2)break;const n=ns.find(n=>n!==prev&&!seen.has(key(current,n)));if(n===undefined)break;prev=current;current=n;}
 if(points.length>=12)paths.push({points,closed});
 }
 for(const [i,ns]of graph)if(ns.length!==2)for(const n of ns)if(!seen.has(key(i,n)))walk(i,n);
 for(const [i,ns]of graph)for(const n of ns)if(!seen.has(key(i,n)))walk(i,n);
 return paths.sort((a,b)=>b.points.length-a.points.length);
}
