// Trace the boundary of thresholded foreground pixels into closed paths.
export type Point = [number, number];
export function trace(mask: Uint8Array,w: number,h: number): Point[][]{
 const edges=new Map<string, Point[]>(); const add=(x: number,y: number,a: number,b: number)=>{const k=x+','+y; if(!edges.has(k))edges.set(k,[]);edges.get(k)!.push([a,b]);};
 const ink=(x: number,y: number)=>x>=0&&y>=0&&x<w&&y<h&&mask[y*w+x];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(ink(x,y)){
 if(!ink(x,y-1))add(x,y,x+1,y);if(!ink(x+1,y))add(x+1,y,x+1,y+1);if(!ink(x,y+1))add(x+1,y+1,x,y+1);if(!ink(x-1,y))add(x,y+1,x,y);
 }
 const paths: Point[][]=[];while(edges.size){const start=edges.keys().next().value!;let key=start;const p: Point[]=[];
 while(edges.has(key)){const [x,y]=key.split(',').map(Number);p.push([x,y]);const list=edges.get(key)!,next=list.pop()!;if(!list.length)edges.delete(key);key=next.join(',');if(key===start)break;}
 if(p.length>=16)paths.push(p);
 }return paths.sort((a,b)=>b.length-a.length);
}
export function sample(points: Point[],count: number, closed = true): Point[]{if(!points.length||count<=0)return [];const lengths=[0];for(let i=1;i<(closed?points.length+1:points.length);i++){const a=points[i-1],b=points[i%points.length];lengths.push(lengths[lengths.length-1]+Math.hypot(b[0]-a[0],b[1]-a[1]));}const out: Point[]=[];let j=1;for(let i=0;i<count;i++){const d=i*lengths[lengths.length-1]/(closed?count:Math.max(1,count-1));while(j<lengths.length-1&&lengths[j]<d)j++;const a=points[j-1],b=points[j%points.length],t=(d-lengths[j-1])/(lengths[j]-lengths[j-1]||1);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}return out;}
