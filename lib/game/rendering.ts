import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Obstacle} from './maps';

// Camera looks toward +Z at yaw=0, so screen-right is world -X.
export function cameraMovement(yaw:number,side:number,forward:number){
 return {dx:-Math.cos(yaw)*side+Math.sin(yaw)*forward,dz:Math.sin(yaw)*side+Math.cos(yaw)*forward};
}

// Batch only static siblings with identical opaque materials. Animated limb
// groups stay independent, and transparent geometry keeps its sorting.
export function batchMeshes(root:T.Object3D){
 for(const child of [...root.children])if(!(child instanceof T.Mesh))batchMeshes(child);
 const groups=new Map<T.Material,T.Mesh[]>();
 for(const child of root.children){
  if(!(child instanceof T.Mesh)||Array.isArray(child.material)||child.material.transparent||child instanceof T.SkinnedMesh)continue;
  const list=groups.get(child.material)||[];list.push(child);groups.set(child.material,list);
 }
 for(const [material,meshes] of groups){
  if(meshes.length<2)continue;
  const parts=meshes.map(mesh=>{mesh.updateMatrix();const geometry=mesh.geometry.clone().applyMatrix4(mesh.matrix);const flat=geometry.index?geometry.toNonIndexed():geometry;if(flat!==geometry)geometry.dispose();for(const name of Object.keys(flat.attributes))if(!['position','normal','uv'].includes(name))flat.deleteAttribute(name);return flat});
  const merged=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());if(!merged)continue;
  const combined=new T.Mesh(merged,material);combined.castShadow=meshes.some(m=>m.castShadow);combined.receiveShadow=meshes.some(m=>m.receiveShadow);combined.name='batched-static';
  for(const mesh of meshes){root.remove(mesh);mesh.geometry.dispose()}
  root.add(combined);
 }
}

// Segment vs obstacle boxes: no raycasts against decorative windows, trees,
// painted ground strips or thousands of triangles.
export function cameraDistance(origin:T.Vector3,direction:T.Vector3,maxDistance:number,boxes:readonly T.Box3[]){
 let closest=maxDistance;
 for(const box of boxes){
  if(box.containsPoint(origin))continue;
  let near=0,far=maxDistance;
  for(const axis of ['x','y','z'] as const){
   const d=direction[axis],o=origin[axis];
   if(Math.abs(d)<1e-8){if(o<box.min[axis]||o>box.max[axis]){far=-1;break}continue}
   const a=(box.min[axis]-o)/d,b=(box.max[axis]-o)/d;
   near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));
  }
  if(near<=far&&far>=0)closest=Math.min(closest,Math.max(.7,near-.6));
 }
 return closest;
}
export function cameraBoxes(obstacles:readonly Obstacle[]){return obstacles.map(o=>new T.Box3(new T.Vector3(o.x-o.w/2,0,o.z-o.d/2),new T.Vector3(o.x+o.w/2,o.h,o.z+o.d/2)))}

export function disposeObject(root:T.Object3D){root.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();if(o instanceof T.Sprite){o.material.map?.dispose();o.material.dispose()}})}
