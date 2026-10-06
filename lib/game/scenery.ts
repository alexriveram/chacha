import * as T from 'three';
import {box,ball,cylinder,mat} from './models';
import {MAPS,obstacles,SPAWNS} from './maps';
import {TEAM_COLORS,TEAMS} from './roster';
import {addDetailedFloor} from './floors';
export function label(text:string,color='#ffffff',size=256){const cv=document.createElement('canvas');cv.width=size;cv.height=64;const ctx=cv.getContext('2d')!;ctx.fillStyle='rgba(7,12,24,.75)';ctx.fillRect(0,0,size,64);ctx.font='bold 28px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,size/2,33,size-12);const tx=new T.CanvasTexture(cv);const sprite=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false}));sprite.scale.set(4,1,1);return sprite;}
function roof(g:T.Object3D,x:number,y:number,z:number,w:number,d:number,color:string){const r=new T.Mesh(new T.ConeGeometry(1,1,4),mat(color));r.position.set(x,y,z);r.rotation.y=Math.PI/4;r.scale.set(w*.8,2.5,d*.8);g.add(r)}
function tree(g:T.Object3D,x:number,z:number,h=6){cylinder(g,x,h*.3,z,.35,.5,h*.6,'#70533b');ball(g,x,h*.8,z,h*.35,'#466e45',1,1.2,1);}
function cone(g:T.Object3D,x:number,y:number,z:number,r:number,h:number,color:string){const m=new T.Mesh(new T.ConeGeometry(r,h,12),mat(color));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
// Scenery is static and uses a small shared palette so Arena can batch it.
// Decorative landmarks stay beyond the engine's ±49 × ±45 movement bounds.
const sceneryMaterials=new Map<string,T.MeshStandardMaterial>();
function surface(color:string,glow=0){
 const key=color+':'+glow;let m=sceneryMaterials.get(key);
 if(!m){m=new T.MeshStandardMaterial({color,roughness:.82,metalness:0,emissive:color,emissiveIntensity:glow});sceneryMaterials.set(key,m)}
 return m;
}
function solid(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string,glow=0){
 const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),surface(color,glow));mesh.position.set(x,y,z);g.add(mesh);return mesh;
}
function orb(g:T.Object3D,x:number,y:number,z:number,r:number,color:string,sx=1,sy=1,sz=1){
 const mesh=new T.Mesh(new T.SphereGeometry(r,12,8),surface(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);g.add(mesh);return mesh;
}
function pillar(g:T.Object3D,x:number,y:number,z:number,r1:number,r2:number,h:number,color:string,sides=12){
 const mesh=new T.Mesh(new T.CylinderGeometry(r1,r2,h,sides),surface(color));mesh.position.set(x,y,z);g.add(mesh);return mesh;
}
function ring(g:T.Object3D,x:number,z:number,inner:number,outer:number,color:string,y=.05){
 const mesh=new T.Mesh(new T.RingGeometry(inner,outer,64),surface(color,.2));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);g.add(mesh);return mesh;
}
function pitchedRoof(g:T.Object3D,x:number,y:number,z:number,w:number,d:number,color:string){
 const mesh=new T.Mesh(new T.ConeGeometry(1,1,4),surface(color));mesh.rotation.y=Math.PI/4;mesh.position.set(x,y,z);mesh.scale.set(w*.76,2.8,d*.76);g.add(mesh);
 solid(g,x,y-1.25,z,w*1.09,.28,d*1.09,'#493d3a');
}
function canopyTree(g:T.Object3D,x:number,z:number,h:number){
 pillar(g,x,h*.35,z,.35,.7,h*.7,'#655648',7);
 orb(g,x,h*.8,z,h*.31,'#536d47',1.15,1,1);
 orb(g,x-1.8,h*.67,z+.7,h*.24,'#77834f',1.15,.8,1);
}
const graphicMaterials=new Map<string,T.MeshStandardMaterial>();
function graphic(kind:string){
 const cached=graphicMaterials.get(kind);if(cached)return cached;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
 const c=canvas.getContext('2d')!;
 if(kind==='windows'){
  c.fillStyle='#172237';c.fillRect(0,0,512,512);
  for(let row=0;row<12;row++)for(let col=0;col<9;col++){
   const n=(row*31+col*17)%11;c.fillStyle=n<4?'#769da8':n===5?'#d0bba6':'#263749';
   c.fillRect(12+col*56,9+row*42,34,23);
   c.fillStyle='#344356';c.fillRect(12+col*56,35+row*42,41,2);
  }
 }else if(kind==='panel'){
  c.fillStyle='#27313e';c.fillRect(0,0,512,512);
  c.strokeStyle='#526172';c.lineWidth=5;c.strokeRect(16,16,480,480);
  for(let row=0;row<4;row++){c.strokeStyle='#131c29';c.strokeRect(35,40+row*116,440,88);c.fillStyle='#6f7f8d';c.fillRect(45,51+row*116,45,4)}
  c.fillStyle='#b0d9e3';for(let i=0;i<5;i++)c.fillRect(352+i*20,64,8,48);
 }else{
  const warm=kind==='sunrise',cyan=kind==='crossing';
  c.fillStyle=warm?'#e59b4e':cyan?'#273761':'#644b91';c.fillRect(0,0,512,512);
  c.fillStyle=warm?'#f4d1a1':cyan?'#5ac3d6':'#a08fd0';
  c.beginPath();c.arc(warm?410:390,140,warm?175:135,0,Math.PI*2);c.fill();
  c.strokeStyle=warm?'#ac473c':cyan?'#203947':'#d7b5dc';c.lineWidth=18;
  for(let i=0;i<6;i++){c.beginPath();c.moveTo(-80,100+i*82);c.lineTo(590,330+i*82);c.stroke()}
  c.fillStyle='#fff5f2';c.font='900 88px Arial';c.textAlign='left';
  c.fillText(warm?'東京':cyan?'SHIBUYA':'夜の街',26,285);
  c.font='700 23px Arial';c.fillText(warm?'TOKYO / AFTER HOURS':cyan?'CROSSING // 109':'NEON DISTRICT',30,332);
  c.fillRect(30,380,104,7);c.font='16px Arial';c.fillText('CHACHA  •  CITY OF WORLDS',30,432);
 }
 const tx=new T.CanvasTexture(canvas);tx.colorSpace=T.SRGBColorSpace;
 const material=new T.MeshStandardMaterial({map:tx,roughness:1,emissiveMap:tx,emissive:'#ffffff',emissiveIntensity:kind==='windows'?.12:kind==='panel'?.025:.5});
 graphicMaterials.set(kind,material);return material;
}
function panel(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,kind:string,rotation=0){
 const mesh=new T.Mesh(new T.PlaneGeometry(w,h),graphic(kind));mesh.position.set(x,y,z);mesh.rotation.y=rotation;g.add(mesh);return mesh;
}
function cityTower(g:T.Object3D,x:number,z:number,w:number,d:number,h:number,index:number,landmark=false){
 solid(g,x,h/2,z,w,h,d,index%2?'#24324c':'#30354b');
 for(const side of [-1,1]){
  panel(g,x,h*.52,z+side*(d/2+.025),w*.88,h*.87,'windows',side<0?Math.PI:0);
  panel(g,x+side*(w/2+.025),h*.52,z,d*.86,h*.87,'windows',side*Math.PI/2);
 }
 solid(g,x,h+.25,z,w+.6,.5,d+.6,'#465069');
 solid(g,x-w*.2,h+1.1,z+1,w*.27,1.5,d*.3,'#222b3c');
 if(landmark){
  const facing=z>0?-1:1;
  panel(g,x,h*.65,z+facing*(d/2+.08),w*.92,h*.38,['night','crossing','sunrise'][index%3],facing<0?Math.PI:0);
  solid(g,x-w*.48,h*.65,z+facing*(d/2+.1),.15,h*.4,.1,['#ef859f','#77cbd9','#b99bd4'][index%3],.7);
 }
}
function leafHouse(g:T.Object3D,x:number,z:number,w:number,d:number,h:number,index:number){
 solid(g,x,h/2,z,w,h,d,index%2?'#c6aa85':'#d0b494');
 solid(g,x,h*.6,z,w+.12,.32,d+.12,'#a38463');
 pitchedRoof(g,x,h+1,z,w,d,index%2?'#687c69':'#ad6550');
 for(const facing of [-1,1]){
  const zz=z+facing*(d/2+.04);
  solid(g,x,1.4,zz,1.35,2.8,.09,'#5c5548');
  for(const dx of [-w*.28,w*.28]){
   solid(g,x+dx,h*.61,zz,1.55,1.65,.09,'#51646a');
   solid(g,x+dx,h*.61,zz+facing*.06,1.55,.09,.06,'#ceb994');
  }
 }
 solid(g,x+w*.27,h+1.8,z,.75,2.8,.75,'#856c5b');
}
function tieFighter(g:T.Object3D,x:number,y:number,z:number,size=1){
 orb(g,x,y,z,1.5*size,'#768494');
 orb(g,x,y,z+1.23*size,.8*size,'#182333',1,1,.42);
 solid(g,x,y,z,7*size,.6*size,.8*size,'#8a97a4');
 for(const side of [-1,1]){
  const wing=new T.Mesh(new T.CylinderGeometry(4*size,4*size,.32*size,6),surface('#202836'));
  wing.rotation.z=Math.PI/2;wing.position.set(x+side*3.4*size,y,z);g.add(wing);
  // The flat spokes give the hexagonal solar panels their TIE silhouette.
  for(let i=0;i<3;i++){
   const spoke=solid(g,x+side*3.59*size,y,z,.12*size,7.3*size,.12*size,'#70808f');
   spoke.rotation.x=i*Math.PI/3;
  }
 }
}
function buildCity(g:T.Object3D){
 for(const z of [-62,62])for(let i=0;i<7;i++){
  const x=(i-3)*20,h=28+((i*19+(z>0?7:0))%28);
  cityTower(g,x,z,15,15,h,i,true);
 }
 for(const x of [-65,65])for(let i=0;i<4;i++)cityTower(g,x,(i-1.5)*26,17,19,30+(i*11)%24,i+3,true);
 // 109 tower is visible above the western skyline.
 pillar(g,-57,28,-50,7.8,8.3,56,'#57506b',24);
 for(let y=5;y<56;y+=7){const trim=new T.Mesh(new T.TorusGeometry(8,.1,4,24),surface('#b9accb',.25));trim.rotation.x=Math.PI/2;trim.position.set(-57,y,-50);g.add(trim)}
 panel(g,-57,49,-41.6,12,8,'crossing');
 // Curbs, lamps and trees are outside the collision boundary.
 for(const side of [-1,1]){
  solid(g,side*51,.16,0,2,.32,96,'#65707c');
  solid(g,0,.16,side*47,102,.32,2,'#65707c');
  for(const z of [-38,-16,16,38]){
   pillar(g,side*52,4.5,z,.10,.15,9,'#3c4657',6);
   solid(g,side*51,8.8,z,2.5,.16,.25,'#b6dfef',.8);
  }
 }
}
function buildHangar(g:T.Object3D){
 // Tall enclosing architecture, far above and outside the shared field.
 for(const side of [-1,1]){
  solid(g,side*55,14,0,7,28,126,'#25303e');
  for(let z=-52;z<=52;z+=13){
   solid(g,side*50.8,13,z,1.2,26,1.5,'#647487');
   panel(g,side*51.2,12,z,10,21,'panel',-side*Math.PI/2);
   solid(g,side*50.05,12,z-.8,.15,13,.23,'#b4d7e7',.8);
  }
  solid(g,side*43,.09,0,.12,.12,88,'#bba37a',.3);
 }
 solid(g,0,16,59,116,32,5,'#202c3b');
 for(let x=-48;x<=48;x+=16)panel(g,x,16,56.4,14,27,'panel',Math.PI);
 // Giant open spaceport aperture. No invisible ceiling across the battlefield.
 for(const x of [-49,49])solid(g,x,21,-60,9,42,8,'#5b6b7c');
 solid(g,0,41,-60,105,6,8,'#5b6b7c');
 solid(g,0,38,-55.8,96,.25,.22,'#b7e6ee',1);
 for(const x of [-44,44])solid(g,x,20,-55.8,.25,36,.22,'#b7e6ee',1);
 for(const z of [-53,51]){
  solid(g,0,28,z,105,2,3,'#2e3c4b');
  for(const x of [-32,0,32])solid(g,x,26.9,z,17,.13,1,'#c5d7e6',.8);
 }
 for(const x of [-36,36]){
  tieFighter(g,x,10,-76,1.4);
  solid(g,x,2.5,51,18,5,10,'#303d4d');
  solid(g,x,5.1,51,18,.18,10,'#718397');
 }
 const positions:number[]=[];
 for(let i=0;i<240;i++){const a=Math.sin(i*73.17)*43758.5453,b=Math.sin(i*39.43+7)*19642.349;positions.push((a-Math.floor(a)-.5)*260,12+(b-Math.floor(b))*110,-142-(i%17)*2)}
 const stars=new T.BufferGeometry();stars.setAttribute('position',new T.Float32BufferAttribute(positions,3));
 g.add(new T.Points(stars,new T.PointsMaterial({color:'#e1efff',size:.3,sizeAttenuation:true})));
 orb(g,26,43,-147,23,'#668b9f',1,1,1);
 orb(g,20,47,-130,12,'#9db6bd',1.2,.45,.35);
}
function hokageFace(g:T.Object3D,x:number,y:number,z:number,index:number){
 orb(g,x,y,z,4.2,'#b29579',.85,1.3,.5);
 orb(g,x,y-1.4,z+1.2,3,'#b29579',.85,.9,.55);
 solid(g,x,y+1,z+2.18,5.6,.6,.30,'#92745c');
 solid(g,x,y+1.65,z+1.94,5.9,.6,.35,'#bda285');
 for(const side of [-1,1]){
  solid(g,x+side*1.35,y+.35,z+2.22,1.15,.24,.20,'#735e4e');
  orb(g,x+side*3.3,y-.2,z+.4,.8,'#a4886b',.55,1,.65);
 }
 orb(g,x,y-.6,z+2.1,.9,'#c1a285',.5,1.4,.65);
 solid(g,x,y-2.1,z+1.93,2.1,.22,.20,'#87705a');
 // Monument hairstyles are carved silhouettes, not separate floating portraits.
 if(index===0||index===2)for(const side of [-1,1])orb(g,x+side*3.0,y+.6,z-.2,1.3,'#93765e',.6,3.2,.65);
 else for(let spike=0;spike<5;spike++){const hair=pillar(g,x+(spike-2)*1.1,y+4.7+Math.abs(spike-2)*.15,z,0,1.3,3.5,'#997b60',5);hair.rotation.z=(2-spike)*.22}
}
function buildLeaf(g:T.Object3D){
 // A layered cliff gives Hokage Rock real depth from the arena.
 for(let i=-5;i<=5;i++){
  const h=29+((i*i+11)%6)*2.8;
  solid(g,i*12,h/2,-76,13,h,23,'#98785c');
  orb(g,i*12,h-2,-75,7,'#b39370',1.2,.6,1.3);
  for(let j=0;j<3;j++)solid(g,i*12+(j-1)*3.5,h*.48,-63.9,.20,h*.69,.14,'#80664f');
 }
 for(let i=0;i<5;i++)hokageFace(g,(i-2)*13,25,-60.5,i);
 // Village gate beyond the north edge, with layered roof and carved emblem.
 for(const x of [-10,10]){pillar(g,x,6,-53,.65,.85,12,'#88584b',8);solid(g,x,1,-53,2,2,2,'#786754')}
 solid(g,0,8.9,-53,22,1.3,2.6,'#986c52');
 pitchedRoof(g,0,11,-53,25,8,'#56796d');
 const leafSign=ring(g,0,-53,1.1,1.35,'#d4b688',0);leafSign.rotation.x=0;leafSign.position.set(0,9,-51.6);
 for(const side of [-1,1]){
  for(let i=0;i<7;i++){
   const z=(i-3)*17;canopyTree(g,side*(56+(i%2)*8),z,9+(i%3)*2);
   if(i%2===0)leafHouse(g,side*73,z,12,11,8+(i%3)*3,i);
  }
  for(let i=0;i<5;i++)leafHouse(g,(i-2)*22,side>0?65:-97,14,12,8+(i*7)%8,i+1);
  // Walled boundary defines the traversal limit without cluttering lanes.
  solid(g,side*51,1.25,0,1.5,2.5,94,'#b39b79');
  solid(g,side*51,2.65,0,2,.3,94,'#63715c');
 }
 // Hokage residence and distant tree-covered foothills.
 pillar(g,37,9,-54,6.5,7.5,18,'#b66f54',16);
 pillar(g,37,18.2,-54,8,8,.7,'#ccaa7c',16);
 const dome=pillar(g,37,21,-54,0,9,5,'#916450',16);dome.rotation.y=.2;
 for(let x=-90;x<=90;x+=30)orb(g,x,15,-121,28,'#7c8864',1.4,.75,1);
}
export function buildScenery(scene:T.Scene,mapId:string){
 mapId=MAPS.find(m=>m.id===mapId)?.id||MAPS[0].id;
 const leaf=mapId==='leaf',hangar=mapId==='deathstar';
 scene.background=new T.Color(leaf?'#dfb28c':hangar?'#07111f':'#181e36');
 scene.fog=new T.Fog(scene.background,100,220);
 const g=new T.Group();g.name='battlefield-scenery';scene.add(g);
 solid(g,0,-.28,0,104,.5,96,leaf?'#b99b78':hangar?'#445260':'#303947');
 addDetailedFloor(g,mapId);
 if(mapId==='shibuya'){
  // The central crossing remains readable; stripes stop outside the hill.
  for(const side of [-1,1])for(let i=-6;i<=6;i++){
   solid(g,i*1.6,.036,side*18,.75,.025,10,'#b9c5d1');
   solid(g,side*19,.036,i*1.6,10,.025,.75,'#b9c5d1');
  }
  for(const side of [-1,1])solid(g,side*9,.032,side*35,.1,.03,16,'#c2b786');
  buildCity(g);
 }else if(hangar){
  for(let x=-45;x<=45;x+=10)solid(g,x,.025,0,.045,.025,88,'#748594');
  for(let z=-40;z<=40;z+=10)solid(g,0,.025,z,98,.025,.045,'#748594');
  buildHangar(g);
 }else{
  for(const side of [-1,1])for(let i=0;i<6;i++)solid(g,side*(15+i*5),.025,0,3.9,.022,6.8,'#cab08d');
  buildLeaf(g);
 }
 pillar(g,0,.023,0,10.3,10.3,.036,leaf?'#b79974':hangar?'#364657':'#30384d',64);
 ring(g,0,0,9.6,9.76,leaf?'#ead3ac':hangar?'#b6d7e5':'#b6bce4',.052);
 ring(g,0,0,11.15,11.23,leaf?'#97744e':'#6c8197',.048);
 for(const side of [-1,1]){
  solid(g,side*12.7,.044,0,2,.025,.18,leaf?'#e2c79e':'#b9cee0');
  solid(g,0,.044,side*12.7,.18,.025,2,leaf?'#e2c79e':'#b9cee0');
 }
 for(const [index,o]of obstacles(mapId).entries()){
  if(o.style==='building')cityTower(g,o.x,o.z,o.w,o.d,o.h,index,true);
  else if(o.style==='house')leafHouse(g,o.x,o.z,o.w,o.d,o.h,index);
  else if(o.style==='ship'){
   // The cargo platform matches its collidable box; TIE detail sits on it.
   solid(g,o.x,.35,o.z,o.w,.7,o.d,'#637183');
   tieFighter(g,o.x,2.8,o.z,.64);
  }else if(o.style==='bus'){
   solid(g,o.x,1.5,o.z,o.w,3,o.d,'#668c91');
   solid(g,o.x,2.15,o.z,o.w+.04,1,o.d*.85,'#24374c');
   for(const side of [-1,1])for(const zz of [-1,1])orb(g,o.x+side*o.w/2,.6,o.z+zz*o.d*.3,.58,'#202936',.38,1,1);
   solid(g,o.x,2.05,o.z+o.d/2+.03,o.w*.86,.85,.05,'#829caf');
  }else{
   solid(g,o.x,o.h/2,o.z,o.w,o.h,o.d,'#596d80');
   for(const side of [-1,1]){
    panel(g,o.x,o.h*.51,o.z+side*(o.d/2+.035),o.w*.93,o.h*.89,'panel',side<0?Math.PI:0);
    solid(g,o.x,o.h*.73,o.z+side*(o.d/2+.065),o.w*.65,.12,.035,'#b3d6df',.5);
   }
  }
 }
 // Inlaid boundary markers and team spawn pads use no extra collision.
 for(const side of [-1,1]){
  solid(g,side*48.7,.04,0,.1,.04,89,leaf?'#8a795d':'#7d8d9b');
  solid(g,0,.04,side*44.7,97,.04,.1,leaf?'#8a795d':'#7d8d9b');
 }
 for(let t=0;t<4;t++){
  const s=SPAWNS[t];ring(g,s.x,s.z,3.7,3.85,TEAM_COLORS[t],.065);
  const tag=label(TEAMS[t].toUpperCase(),TEAM_COLORS[t]);tag.position.set(s.x,3,s.z);g.add(tag);
 }
 return g;
}
export function buildBackdrop(scene:T.Scene,kind:string){const g=new T.Group();scene.add(g);scene.background=new T.Color(['jade','greenhill','mushroom','tournament','palace'].includes(kind)?'#90b8be':'#131e35');scene.fog=new T.Fog(scene.background,28,80);box(g,0,-.2,0,70,.3,70,['jade','greenhill','mushroom'].includes(kind)?'#689b6b':'#28364b');
 if(kind==='jade'||kind==='palace'||kind==='tournament'||kind==='leaf'){for(let i=0;i<4;i++){box(g,0,1+i*2,-13,15-i*2,2,8-i,'#d1b577');roof(g,0,2+i*2,-13,18-i*2,11-i,'#487c66')}for(const x of [-12,12])tree(g,x,-10,9)}
 else if(kind==='ring'){box(g,0,.5,-12,15,1,12,'#576c8b');for(const x of [-7,7])for(const z of [-17,-7]){cylinder(g,x,2,z,.14,.14,3,'#d3d9e0')}for(let y=1.5;y<3.6;y+=.7){box(g,0,y,-17,14,.04,.04,'#eb4e57');box(g,0,y,-7,14,.04,.04,'#6ca8fa')}for(let x=-20;x<=20;x+=4)box(g,x,5,-22,3,10,3,'#242c48');}
 else if(kind==='greenhill'||kind==='mushroom'){for(let i=-2;i<=2;i++){ball(g,i*9,1,-15,5,'#68a96d',1,1.8,1);if(kind==='mushroom'){cylinder(g,i*7,2,-8,1,1,4,'#eddfb3');ball(g,i*7,4,-8,2.7,i%2?'#d5474e':'#4cab8d',1,.5,1)}else tree(g,i*8,-8,7)}}
 else if(kind==='sewer'){scene.background=new T.Color('#142523');scene.fog=new T.Fog('#142523',18,58);box(g,0,-.05,0,70,.2,70,'#39433e');box(g,0,8,-23,70,16,3,'#283530');for(let x=-27;x<=27;x+=9){const pipe=cylinder(g,x,7,-19,.48,.48,15,x%18?'#7d5641':'#65736b');pipe.rotation.x=Math.PI/2;ball(g,x,10,-21,3.5,'#303d37',1,1,.35)}box(g,0,.03,-7,70,.04,4,'#5ea98a');for(let x=-30;x<=30;x+=5)box(g,x,.05,-7,2.5,.05,3.5,'#8bc6aa')}
 else if(kind==='cosmic'){scene.background=new T.Color('#07091d');scene.fog=null;const stars=new T.BufferGeometry(),positions=[];for(let i=0;i<380;i++)positions.push((Math.random()-.5)*90,Math.random()*45-4,-12-Math.random()*45);stars.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.add(new T.Points(stars,new T.PointsMaterial({color:'#f3f3ff',size:.12})));ball(g,15,12,-32,8,'#6c73d9');ball(g,-19,5,-40,4,'#e1a177')}
 else if(kind==='hell'||kind==='mustafar'){scene.background=new T.Color('#240b0a');scene.fog=new T.Fog('#38100d',16,58);box(g,0,-.05,0,70,.2,70,'#211719');for(let i=-5;i<=5;i++){const rock=cone(g,i*6,2,-17,2.5,6,'#382426');rock.rotation.z=(i%2)*.15;box(g,i*6,.08,-8,.28,.08,16,'#ff5a1f').material=mat('#ff5a1f',0,1.8)}}
 else if(kind==='asgard'){scene.background=new T.Color('#8bc5df');box(g,0,-.05,0,70,.2,70,'#d6c290');for(let i=-3;i<=3;i++){cylinder(g,i*8,7,-19,.7,1.1,14,'#d2bc74');cone(g,i*8,15,-19,1.5,4,'#f1d982')}box(g,0,1,-14,28,2,14,'#b89d5e');for(let i=-3;i<=3;i++)box(g,i*8,.1,-2,1,.06,25,['#e34f6f','#e6c44f','#66a9de'][Math.abs(i)%3])}
 else if(kind==='mansion'){scene.background=new T.Color('#8db3c8');box(g,0,-.05,0,70,.2,70,'#6e925e');box(g,0,8,-22,30,16,8,'#b98d69');for(let x=-12;x<=12;x+=6)box(g,x,9,-17.9,2.5,4,.1,'#89c5da');box(g,0,3,-17.7,4,6,.2,'#503f37');for(const x of [-18,18])tree(g,x,-12,10)}
 else if(['forest','swamp','jungle'].includes(kind)){scene.background=new T.Color(kind==='swamp'?'#536852':'#79a586');scene.fog=new T.Fog(scene.background,20,65);box(g,0,-.05,0,70,.2,70,kind==='swamp'?'#34463b':'#527a4c');for(let i=-5;i<=5;i++){tree(g,i*6+(i%2)*2,-12-Math.abs(i%3)*4,8+Math.abs(i%4)*2);if(kind==='jungle')ball(g,i*6,2,-9,2,'#315c3a',1.4,.8,1)}}
 else if(kind==='desert'){scene.background=new T.Color('#e0b47e');scene.fog=new T.Fog('#e0b47e',35,85);box(g,0,-.05,0,70,.2,70,'#c99d67');for(let i=-4;i<=4;i++)ball(g,i*8,-.1,-15-(i%2)*5,4,'#bb8959',2,.5,1)}
 else if(kind==='reactor'){scene.background=new T.Color('#101521');box(g,0,-.05,0,70,.2,70,'#232c3a');for(let i=-4;i<=4;i++){cylinder(g,i*6,6,-20,.4,.4,12,'#697b91');box(g,i*6,6,-16,.12,9,.12,'#77d8ff').material=mat('#77d8ff',0,1.5)}for(let y=1;y<12;y+=2)box(g,0,y,-22,60,.05,.2,'#405066')}
 else if(kind==='dojo'){scene.background=new T.Color('#4a2632');box(g,0,-.05,0,70,.2,70,'#4b3532');box(g,0,7,-22,70,14,3,'#251d26');for(let x=-24;x<=24;x+=8){cylinder(g,x,5,-18,.35,.5,10,'#6b2934');box(g,x,7,-16.4,3,5,.1,'#b8a079')}box(g,0,.04,-6,12,.04,12,'#80664e')}
 else if(['manhattan','gotham','metropolis','centralcity','genosha','titan'].includes(kind)){const night=['gotham','titan'].includes(kind);scene.background=new T.Color(night?'#172238':'#76afcf');scene.fog=new T.Fog(scene.background,35,90);box(g,0,-.05,0,70,.2,70,'#424953');for(let i=-5;i<=5;i++){const h=10+Math.abs(Math.sin(i*13))*15;const col=kind==='metropolis'?'#c5d3dd':kind==='genosha'?'#7f7a91':night?'#283446':'#647789';box(g,i*6,h/2,-22,5,h,7,col,.25);for(let y=3;y<h;y+=3)box(g,i*6,y,-18.45,2.4,.2,.05,night?'#d7c76d':'#bde8f4')}if(kind==='manhattan'){const tower=box(g,11,16,-30,5,32,6,'#70869a',.35);tower.rotation.z=-.02;box(g,11,32,-30,.25,8,.25,'#92dafa')}}
 else if(kind==='wall'||kind==='ruins'){for(let i=-3;i<=3;i++){box(g,i*7,8,-20,6,16,5,'#847e74');if(kind==='ruins')cylinder(g,i*5,4,-10,.7,.9,8,'#a1a4ac')}}
 else {for(let i=-4;i<=4;i++){const h=8+Math.abs(Math.sin(i*31))*13;box(g,i*6,h/2,-20,4,h,6,kind==='cybertron'?'#526180':'#26364e',.3);for(let y=3;y<h;y+=3)box(g,i*6,y,-16.9,2.5,.12,.05,i%2?'#78c2eb':'#b490ec')}if(kind==='deathstar')ball(g,8,16,-40,7,'#abb8c9')}
 const platform=cylinder(g,0,-.05,0,2.5,2.7,.2,'#3b4c65');return {g,platform};}
