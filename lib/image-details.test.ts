import {test} from 'node:test';
import assert from 'node:assert/strict';
import {edgePaths,imagePaths} from './image-details';
import {sample} from './geometry';
test('local contrast recovers facial features swallowed by a silhouette threshold',()=>{
 const width=100,height=100,data=new Uint8ClampedArray(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){let v=x>=15&&x<85&&y>=15&&y<85?100:255; if(((x-35)**2+(y-40)**2<36)||((x-65)**2+(y-40)**2<36))v=30;const i=(y*width+x)*4;data.set([v,v,v,255],i);}
 const image={width,height,data};const silhouette=imagePaths(image,'outline',145,60);assert.equal(silhouette.length,1);
 const details=imagePaths(image,'details',145,60);const eyePaths=details.filter(p=>p.points.every(([x,y])=>x>20&&x<80&&y>25&&y<55));assert.ok(eyePaths.length>=2,'Both inner eye features must survive');
});
test('open edge chains and sampling preserve endpoints without a closing segment',()=>{const mask=new Uint8Array(40*40);for(let x=5;x<=30;x++)mask[20*40+x]=1;const paths=edgePaths(mask,40,40);assert.equal(paths.length,1);assert.equal(paths[0].closed,false);const dots=sample(paths[0].points,4,false);assert.deepEqual(dots[0],[5,20]);assert.deepEqual(dots.at(-1),[30,20]);});
test('blank images do not produce artificial frame edges',()=>{const data=new Uint8ClampedArray(40*40*4).fill(255);assert.deepEqual(imagePaths({width:40,height:40,data},'details',145,100),[]);});
