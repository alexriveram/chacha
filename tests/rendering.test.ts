import assert from 'node:assert/strict';
import * as T from 'three';
import {cameraMovement,cameraBoxes,cameraDistance,batchMeshes} from '../lib/game/rendering';
import {buildScenery} from '../lib/game/scenery';
import {MAPS} from '../lib/game/maps';

for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2,.73]){
 const camera=new T.PerspectiveCamera();camera.position.set(-Math.sin(yaw)*15,6,-Math.cos(yaw)*15);camera.lookAt(Math.sin(yaw)*25,1.5,Math.cos(yaw)*25);camera.updateMatrixWorld();
 const right=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
 const d=cameraMovement(yaw,1,0),a=cameraMovement(yaw,-1,0),w=cameraMovement(yaw,0,1),s=cameraMovement(yaw,0,-1);
 assert(d.dx*right.x+d.dz*right.z>.99,'D moves screen-right');
 assert(a.dx*right.x+a.dz*right.z<-.99,'A moves screen-left');
 assert(w.dx*Math.sin(yaw)+w.dz*Math.cos(yaw)>.99,'W moves forward');
 assert(s.dx*Math.sin(yaw)+s.dz*Math.cos(yaw)<-.99,'S moves back');
}
const boxes=cameraBoxes([{x:0,z:-5,w:4,d:2,h:6,style:'crate'}]);
assert.equal(cameraDistance(new T.Vector3(0,2,0),new T.Vector3(0,0,-1),15,boxes),3.4);
assert.equal(cameraDistance(new T.Vector3(4,2,0),new T.Vector3(0,0,-1),15,boxes),15);
assert.equal(cameraDistance(new T.Vector3(0,8,0),new T.Vector3(0,0,-1),15,boxes),15);
// Scenery labels only need a canvas placeholder for geometry/draw-call checks.
Object.defineProperty(globalThis,'document',{value:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:()=>()=>{},set:()=>true})})},configurable:true});
for(const map of MAPS){
 const scene=new T.Scene(),world=buildScenery(scene,map.id);
 const count=()=>{let meshes=0,triangles=0;world.traverse(o=>{if(o instanceof T.Mesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3}});return {meshes,triangles}};
 const before=count();batchMeshes(world);const after=count();
 assert(after.meshes<before.meshes*.5,'static draw calls reduced at least 50%');
 assert.equal(after.triangles,before.triangles,'batching preserves map geometry');
 console.log(`${map.name}: ${before.meshes} → ${after.meshes} static mesh draws; ${after.triangles} triangles preserved`);
}
console.log('Camera-relative WASD, collision bounds, and all three map batching checks passed');
