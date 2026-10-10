import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trace,sample} from './geometry';
test('foreground square produces a closed boundary and equally spaced points',()=>{const mask=new Uint8Array(100);for(let y=2;y<8;y++)for(let x=2;x<8;x++)mask[y*10+x]=1;const paths=trace(mask,10,10);assert.equal(paths.length,1);assert.equal(paths[0].length,24);assert.deepEqual(sample(paths[0],4),[[2,2],[8,2],[8,8],[2,8]]);});
test('empty image has no contours',()=>assert.deepEqual(trace(new Uint8Array(100),10,10),[]));
test('disconnected subjects remain separate groups',()=>{const mask=new Uint8Array(300);for(let y=2;y<7;y++)for(const base of [2,15])for(let x=base;x<base+5;x++)mask[y*30+x]=1;assert.equal(trace(mask,30,10).length,2);});

test('dot spacing scales with path length instead of a fixed group count',async()=>{const {spacedDots}=await import('./geometry');assert.equal(spacedDots([[0,0],[120,0]],24,false).length,6);assert.equal(spacedDots([[0,0],[24,0]],24,false).length,2);assert.deepEqual(spacedDots([[0,0],[10,0]],24,false),[]);});
test('tiny closed details are left drawn rather than crammed with three dots',async()=>{const {spacedDots}=await import('./geometry');assert.deepEqual(spacedDots([[0,0],[8,0],[8,8],[0,8]],24,true),[]);const dots=spacedDots([[0,0],[24,0],[24,24],[0,24]],24,true);assert.equal(dots.length,4);});
