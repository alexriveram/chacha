import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {type Fighter} from './roster';
const mats=new Map<string,T.MeshStandardMaterial>();
export function mat(color:string,metal=0,emission=0){const key=color+metal+emission;if(!mats.has(key)){const material=new T.MeshPhysicalMaterial({color,roughness:metal?.28:.67,metalness:metal,emissive:color,emissiveIntensity:emission,clearcoat:metal?.72:.08,clearcoatRoughness:metal?.12:.55,sheen:metal?0:.16,sheenColor:new T.Color(color).offsetHSL(0,0,.12)});mats.set(key,material)}return mats.get(key)!}
export function box(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:string,metal=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c,metal));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
export function ball(g:T.Object3D,x:number,y:number,z:number,r:number,c:string,sx=1,sy=1,sz=1){const m=new T.Mesh(new T.SphereGeometry(r,24,18),mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m}
export function cylinder(g:T.Object3D,x:number,y:number,z:number,r1:number,r2:number,h:number,c:string){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,12),mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function cone(g:T.Object3D,x:number,y:number,z:number,r:number,h:number,c:string){return cylinder(g,x,y,z,0,r,h,c)}
function cape(g:T.Group,color:string){const geo=new T.PlaneGeometry(.78,1.18,12,16);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setXYZ(i,x*(1.2-y*.35),y,Math.cos(x*28)*.025-(.6-y)*.17)}geo.computeVertexNormals();const material=mat(color).clone();material.side=T.DoubleSide;const m=new T.Mesh(geo,material);m.position.set(0,.94,-.23);m.castShadow=true;g.add(m);}
function sculpt(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:string,metal=0){const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.25),mat(c,metal));mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh;}
function anatomicalTorso(g:T.Object3D,y:number,color:string,thick=1){const profile=[new T.Vector2(.165,y-.33),new T.Vector2(.20,y-.26),new T.Vector2(.225,y-.08),new T.Vector2(.285,y+.15),new T.Vector2(.255,y+.30),new T.Vector2(.165,y+.34)];const mesh=new T.Mesh(new T.LatheGeometry(profile,32),mat(color));mesh.scale.set(thick,1,.62);mesh.castShadow=true;g.add(mesh);return mesh}
function limb(g:T.Object3D,a:T.Vector3,b:T.Vector3,r1:number,r2:number,color:string){const delta=b.clone().sub(a);const m=new T.Mesh(new T.CylinderGeometry(r2,r1,delta.length(),16),mat(color));m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());m.castShadow=true;g.add(m);return m;}
function blade(g:T.Object3D,x:number,y:number,z:number,color:string,len=1){const m=new T.Mesh(new T.CylinderGeometry(.025,.025,len,6),new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:2}));m.position.set(x,y,z);g.add(m);return m}
function detailPlane(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,c:string,metal=0){const m=sculpt(g,x,y,z,w,h,.018,c,metal);m.castShadow=false;return m}
function makeOogway(c:Fighter){
 const g=new T.Group(),rig=new T.Group();g.add(rig);const legs:T.Group[]=[],arms:T.Group[]=[];
 // Oogway has a broad, old tortoise body, a long neck and a layered monk robe.
 const shell=ball(rig,0,.98,-.13,.43,'#443f32',.92,1.12,.52);shell.rotation.x=-.08;
 for(let ring=0;ring<3;ring++)for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ball(rig,Math.sin(a)*(.21+ring*.065),.98+Math.cos(a)*(.36-ring*.08),-.36,.035,'#77705a',1.3,.75,.35)}
 ball(rig,0,1.02,.04,.38,'#c5b98b',.88,1.08,.58);
 const robe=anatomicalTorso(rig,1.05,'#ddd8c5',1.1);robe.scale.z=.78;
 for(let i=0;i<5;i++){const fold=detailPlane(rig,(i-2)*.065,.97,.292,.022,.52,i%2?'#c7c1aa':'#eee9d8');fold.rotation.z=(i-2)*.025}
 const sash=detailPlane(rig,0,.94,.305,.62,.115,'#877d45');sash.rotation.z=-.16;
 limb(rig,new T.Vector3(0,1.33,0),new T.Vector3(0,1.63,.035),.105,.085,'#afa479');
 for(let i=0;i<4;i++)cylinder(rig,0,1.38+i*.07,.025,.09-i*.007,.096-i*.007,.035,i%2?'#918967':'#b8ad82');
 const head=ball(rig,0,1.72,.045,.19,'#aea477',.82,.66,1.18);
 ball(rig,0,1.68,.225,.12,'#c7bd8d',1.15,.54,1.08);ball(rig,0,1.66,.35,.055,'#5c513a',1.1,.55,1.25);
 for(const side of [-1,1]){ball(rig,side*.086,1.77,.205,.047,'#faf7e8',1,.78,.38);ball(rig,side*.086,1.77,.229,.017,'#20221d',.7,1,.35);sculpt(rig,side*.085,1.815,.203,.12,.025,.03,'#716849').rotation.z=side*.13}
 const smile=new T.Mesh(new T.TorusGeometry(.087,.009,8,24,Math.PI),mat('#6a4736'));smile.position.set(0,1.675,.355);smile.rotation.z=Math.PI;rig.add(smile);
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.16,.69,0);limb(leg,new T.Vector3(0,0,0),new T.Vector3(side*.015,-.28,.035),.095,.062,'#aaa071');ball(leg,side*.015,-.34,.10,.095,'#aaa071',1.1,.45,1.75);rig.add(leg);legs.push(leg);const arm=new T.Group();arm.position.set(side*.31,1.23,.02);limb(arm,new T.Vector3(0,0,0),new T.Vector3(side*.03,-.33,.08),.095,.052,'#aaa071');ball(arm,side*.03,-.39,.12,.075,'#aaa071',1,.72,1.3);for(let f=0;f<3;f++)ball(arm,side*.03+(f-1)*.035,-.43,.155,.024,'#aaa071',.65,1.8,.7);rig.add(arm);arms.push(arm)}
 const staff=cylinder(rig,.48,1.05,.15,.027,.038,1.72,'#6e4529');staff.rotation.z=-.09;const crook=new T.Mesh(new T.TorusGeometry(.105,.027,8,18,Math.PI*1.35),mat('#6e4529'));crook.position.set(.405,1.91,.15);crook.rotation.z=-.55;rig.add(crook);
 g.scale.setScalar(c.height/1.95);g.userData={rig,legs,arms,head,height:c.height};return g;
}
function makeOptimus(c:Fighter){
 const g=new T.Group(),rig=new T.Group();g.add(rig);const legs:T.Group[]=[],arms:T.Group[]=[];
 // Separate hard-surface build for the truck cab, grille, armor plates and helmet.
 sculpt(rig,0,1.11,0,.72,.64,.42,'#bd2f35',.72);for(const side of [-1,1]){const glass=sculpt(rig,side*.185,1.27,.226,.32,.21,.028,'#75d8f0',.75);glass.rotation.z=side*.035}
 sculpt(rig,0,1.04,.235,.39,.24,.035,'#c4cbd0',.9);for(let i=0;i<5;i++)detailPlane(rig,0,.955+i*.043,.258,.33,.014,'#6b747d',.9);
 sculpt(rig,0,.75,0,.48,.22,.32,'#d8dde0',.85);detailPlane(rig,0,.76,.177,.27,.11,'#f0ad22',.65);
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.18,.66,0);sculpt(leg,0,-.19,0,.27,.42,.3,'#31569c',.72);sculpt(leg,0,-.43,.04,.31,.24,.37,'#294b89',.72);for(let j=0;j<3;j++)detailPlane(leg,0,-.25-j*.055,.16,.19,.022,'#7790aa',.9);sculpt(leg,0,-.58,.09,.34,.16,.5,'#244679',.75);rig.add(leg);legs.push(leg);
 const arm=new T.Group();arm.position.set(side*.46,1.3,0);sculpt(arm,0,-.04,0,.34,.30,.38,'#c43238',.72);sculpt(arm,side*.015,-.30,.015,.25,.34,.29,'#bd3035',.72);sculpt(arm,side*.02,-.51,.07,.22,.18,.30,'#31569c',.72);for(let f=0;f<4;f++)sculpt(arm,side*(f-1.5)*.035,-.61,.14,.045,.13,.055,'#8796a7',.85);rig.add(arm);arms.push(arm)}
 sculpt(rig,0,1.62,0,.36,.35,.32,'#31569c',.8);sculpt(rig,0,1.66,.18,.28,.22,.05,'#aab6c2',.9);detailPlane(rig,0,1.61,.216,.18,.06,'#232b35',.7);for(const side of [-1,1]){detailPlane(rig,side*.072,1.69,.216,.10,.042,'#83efff',.75);const antenna=sculpt(rig,side*.20,1.81,0,.045,.36,.07,'#31569c',.8);antenna.rotation.z=side*.12;sculpt(rig,side*.32,1.42,-.12,.08,.49,.09,'#c7cdd3',.9)}
 const head=rig.children[rig.children.length-5] as T.Object3D;g.scale.setScalar(c.height/1.95);g.userData={rig,legs,arms,head,height:c.height};return g;
}
export function makeFighter(c:Fighter):T.Group{
 if(c.name==='Oogway')return makeOogway(c);
 if(c.name==='Optimus Prime')return makeOptimus(c);
 const g=new T.Group(),rig=new T.Group();g.add(rig);const kind=c.model;const metallic=['robot','armor','surfer','blades'].includes(kind);const skin=kind==='brute'?'#588e4c':kind==='yoda'?'#89a568':c.skin;const animal=['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju'].includes(kind);
 const thick=['brute','panda','ape','bowser','robot'].includes(kind)?1.32:kind==='titan'?1.15:.88;
 const bare=['wrestler','fighter','boxer','brute','kratos','titan'].includes(kind);const bodyColor=bare?skin:c.color;
 const torso=anatomicalTorso(rig,1.07,bodyColor,thick);const chest=ball(rig,0,1.20,.075,.18,bodyColor,1.34*thick,.68,.68);const waist=ball(rig,0,.84,0,.155,bodyColor,1.02*thick,.78,.68);const hip=sculpt(rig,0,.67,0,.34*thick,.19,.25,c.color);
 for(const side of [-1,1]){ball(rig,side*.205*thick,1.22,.01,.102,bodyColor,1,.92,.92);sculpt(rig,side*.10*thick,.98,.151,.13,.24,.028,bodyColor).rotation.z=side*.05}
 cylinder(rig,0,1.43,0,.075,.10,.16,skin);
 const legs:T.Group[]=[],arms:T.Group[]=[];
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.105*thick,.68,0);const legColor=bare?skin:c.color;
 limb(leg,new T.Vector3(0,0,0),new T.Vector3(side*.008,-.29,.012),.088*thick,.066*thick,legColor);ball(leg,side*.008,-.29,.012,.067*thick,legColor);limb(leg,new T.Vector3(side*.008,-.29,.012),new T.Vector3(side*.018,-.57,0),.064*thick,.048*thick,legColor);
 sculpt(leg,side*.018,-.61,.065,.135*thick,.11,.25,['plumber','hedgehog'].includes(kind)?kind==='hedgehog'?c.accent:'#392c29':c.accent);rig.add(leg);legs.push(leg);
 const arm=new T.Group();arm.position.set(side*.255*thick,1.27,0);const armColor=bare?skin:c.color;ball(arm,0,-.035,0,.09*thick,armColor,1,1.12,1);limb(arm,new T.Vector3(0,-.04,0),new T.Vector3(side*.025,-.25,.015),.075*thick,.055*thick,armColor);ball(arm,side*.025,-.25,.015,.057*thick,armColor);limb(arm,new T.Vector3(side*.025,-.25,.015),new T.Vector3(side*.025,-.47,.055),.057*thick,.042*thick,armColor);
 sculpt(arm,side*.025,-.475,.057,.105*thick,.075,.13,c.accent,metallic?.6:0);const handColor=kind==='boxer'?c.accent:metallic?c.accent:skin;ball(arm,side*.025,-.53,.07,.059*thick,handColor,.78,1.15,.7);for(let f=0;f<4;f++)ball(arm,side*.025+(f-1.5)*.021,-.575,.09,.014,handColor,.6,1.8,.78);ball(arm,side*.025-side*.054,-.53,.105,.019,handColor,.8,1.5,.8);rig.add(arm);arms.push(arm)}
 const head=ball(rig,0,1.62,0,.143,animal?kind==='panda'?'#f4eee3':c.color:metallic?c.color:skin,.91,1.17,.84);
 if(!animal&&!metallic&&!['mask','spider','vader','bat','maul','helmet'].includes(kind)){ball(rig,0,1.515,.026,.111,skin,.82,.70,.78);for(const side of [-1,1]){ball(rig,side*.151,1.60,0,.031,skin,.45,1,.66);ball(rig,side*.061,1.626,.134,.032,'#f5f1ec',1,.36,.16);ball(rig,side*.061,1.626,.142,.013,'#425e70',.72,1,.35);sculpt(rig,side*.061,1.659,.136,.065,.012,.018,'#3a2d2b');}ball(rig,0,1.585,.151,.022,skin,.55,1.45,1.25);sculpt(rig,0,1.535,.139,.061,.009,.013,'#8e5c59');sculpt(rig,0,1.49,.095,.19,.055,.09,skin);}
 const eyeColor=['vader','robot','armor','mask','spider','bat'].includes(kind)?'#b9f5ff':'#17202b';if(animal||metallic||['vader','robot','armor','mask','spider','bat','maul','helmet','luchador'].includes(kind))for(const side of [-1,1]){const eye=ball(rig,side*.059,1.63,.137,.034,eyeColor,1,.42,.18);eye.rotation.z=side*.08}
 box(rig,0,.78,.188,.40*thick,.045,.025,c.accent,metallic?.8:0);
 if(['cape','mustachecape','bat','vader','blondcape','scout','firelord','helmet'].includes(kind))cape(rig,c.accent);
 if(['ninja','longhair','swordsman','scout','mustache','mustachecape','akatsuki','bowl','silverhair','blond','blondcape','spiky','pinkhair','blindfold','tattoo','firelord'].includes(kind)){
  const hair=['blond','blondcape'].includes(kind)?'#edce50':['blindfold','silverhair'].includes(kind)?'#e6eef3':['pinkhair','tattoo'].includes(kind)?'#e59eac':c.name==='Pain'?'#d67c31':'#171a24';
  ball(rig,0,1.735,-.028,.18,hair,1,.6,1);if(kind!=='bowl'&&kind!=='mustache'&&kind!=='mustachecape'){for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const spike=cone(rig,Math.sin(a)*.13,1.81+((i%2)*.045),Math.cos(a)*.10,.064,.20,hair);spike.rotation.z=-Math.sin(a)*.45;}}if(kind==='longhair')box(rig,0,1.45,-.21,.35,.48,.11,hair);
  if(c.world==='Naruto'){box(rig,0,1.72,.22,.35,.08,.04,'#9aabb9',.7);box(rig,0,1.72,.247,.08,.03,.01,'#343a47')}
 }
 if(kind==='blindfold')sculpt(rig,0,1.635,.143,.335,.084,.065,'#0b0e17');cylinder(rig,0,1.36,0,.12,.17,.15,c.color);
 if(kind==='silverhair')box(rig,0,1.53,.20,.33,.15,.06,'#232e3e');
 if(kind==='goggles'){for(const side of [-1,1])box(rig,side*.1,1.63,.22,.17,.11,.04,'#d9edee');box(rig,0,1.63,.23,.045,.03,.04,'#242b35')}
 if(['mustache','mustachecape','plumber'].includes(kind)){box(rig,0,1.5,.23,.24,.06,.035,'#251e21')}
 if(kind==='plumber'){ball(rig,0,1.8,0,.25,c.color,1,.6,1);box(rig,0,1.77,.19,.40,.06,.24,c.color);ball(rig,0,1.57,.235,.075,skin);for(const side of [-1,1])box(rig,side*.14,1.1,.20,.07,.43,.03,c.accent);for(const side of [-1,1])ball(rig,side*.14,.95,.23,.035,'#f9d857')}
 if(kind==='armor'){box(rig,0,1.59,.20,.33,.31,.045,c.accent,.8);ball(rig,0,1.08,.19,.075,'#9feeff');for(const side of [-1,1])blade(arms[side<0?0:1],0,-.40,.11,'#72dcff',.08)}
 if(kind==='robot'){box(rig,0,1.64,0,.43,.40,.38,c.color,.7);for(const side of [-1,1]){box(rig,side*.15,1.68,.21,.13,.055,.035,'#70e8ff');box(rig,side*.43,1.25,0,.27,.32,.36,c.accent,.5);box(rig,side*.15,1.10,.235,.23,.24,.05,'#718fae',.8);cylinder(rig,side*.33,.75,-.19,.13,.13,.12,'#1b2531').rotation.z=Math.PI/2;}box(rig,0,1.52,.22,.26,.13,.06,'#abb6c5',.7);for(const side of [-1,1])box(rig,side*.24,1.87,0,.045,.31,.08,c.accent,.7)}
 if(['mask','spider','bat','luchador','claws','maul','vader','helmet','spiralmask'].includes(kind)){
 ball(rig,0,1.6,0,.18,kind==='maul'?'#b92b2e':kind==='spiralmask'?c.accent:c.color,1,1.08,1);for(const side of [-1,1])box(rig,side*.069,1.65,.169,.085,.031,.025,kind==='maul'?'#ffc757':'#e1f3fa');if(kind==='bat'||kind==='claws')for(const side of [-1,1])cone(rig,side*.17,1.88,0,.08,.3,c.color);if(kind==='vader'){cone(rig,0,1.72,0,.29,.40,'#171b23');box(rig,0,1.0,.2,.23,.24,.05,'#373c46');for(let i=0;i<3;i++)box(rig,-.07+i*.07,1.03,.235,.035,.04,.02,['#e74c4c','#81c1fa','#f1f1ed'][i])}if(kind==='maul')for(let i=-1;i<2;i++)cone(rig,i*.13,1.87,0,.035,.10,'#e4d9b3');}
 if(kind==='claws')for(let s=0;s<2;s++)for(let i=0;i<3;i++)blade(arms[s],(i-1)*.055,-.48,.15,'#c9d7e2',.40).rotation.x=Math.PI/2;
 if(['jedi','vader','maul','yoda'].includes(kind)){if(kind==='jedi')cape(rig,c.color);blade(arms[1],0,.13,.16,c.accent,1.2);box(arms[1],0,-.42,.16,.065,.23,.065,'#aeb8c6',.8);if(kind==='maul')blade(arms[1],0,-1.0,.16,c.accent,1.2);}
 if(['swordsman','scout','ninja','blades','turtle'].includes(kind)){blade(arms[1],0,.03,.13,'#d5e0e5',.8);if(kind==='scout'||c.name==='Leonardo')blade(arms[0],0,.03,.13,'#d5e0e5',.8)}
 if(kind==='yoda'){for(const side of [-1,1]){const ear=cone(rig,side*.34,1.64,0,.10,.48,skin);ear.rotation.z=side*-Math.PI/2}cape(rig,c.color)}
 if(['sage','kratos','firelord'].includes(kind)){ball(rig,0,1.48,.13,.19,kind==='kratos'?'#513930':'#d9d8c8',.8,.8,.7);if(kind==='kratos'){box(rig,-.08,1.63,.21,.045,.32,.03,'#a52d29');box(rig,-.15,1.12,.19,.09,.6,.03,'#a52d29');box(arms[1],0,-.1,.14,.07,1.2,.07,'#735239');box(arms[1],.12,.35,.14,.4,.35,.06,'#8abccc',.6)}}
 if(kind==='airbender'){box(rig,0,1.75,.20,.07,.15,.03,'#72c7e7');box(rig,0,1.68,.225,.14,.04,.02,'#72c7e7')}
 if(kind==='tattoo'){for(const side of [-1,1]){box(rig,side*.14,1.52,.205,.06,.025,.03,'#3b2731');box(rig,side*.17,1.69,.18,.025,.13,.03,'#3b2731')}}
 if(kind==='gourd')ball(rig,.1,1.05,-.36,.33,'#aa884f',.85,1.3,.8);
 if(kind==='akatsuki'){cape(rig,c.color);for(const side of [-1,1])ball(rig,side*.15,1.06,.18,.095,c.accent,1,.6,.2)}
 if(kind==='chair'){box(rig,0,.35,0,.8,.12,.75,'#58616d',.6);for(const side of [-1,1]){const wheel=cylinder(rig,side*.46,.35,0,.31,.31,.08,'#28333f');wheel.rotation.z=Math.PI/2}box(rig,0,.8,-.22,.65,.65,.1,c.color)}
 if(animal){
  ball(rig,0,1.53,.17,.16,kind==='panda'?'#ede8dd':c.accent,1,.8,1);ball(rig,0,1.59,.31,.055,'#222731');
  if(['panda','leopard','lion','tiger','rat','monkey','fox','ape'].includes(kind))for(const side of [-1,1])ball(rig,side*.22,1.80,0,.085,kind==='panda'?'#22262e':c.color);
  if(kind==='panda'){ball(rig,0,1.02,0,.43,'#e9e4db',1,1,.75);for(const side of [-1,1])ball(rig,side*.1,1.65,.18,.09,'#22252d',.8,1,.3)}
  if(['turtle','tortoise','bowser'].includes(kind)){ball(rig,0,1,-.23,.40,c.accent,1,1.2,.5);ball(rig,0,1,.1,.32,'#c6b279',.9,1.1,.6);if(kind==='turtle')box(rig,0,1.65,.205,.42,.09,.06,c.accent);if(kind==='bowser')for(let i=0;i<5;i++)cone(rig,(i%2?.18:-.18),.8+i*.12,-.38,.09,.21,'#e8dfc0').rotation.x=-1.4}
  if(kind==='hedgehog'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const sp=cone(rig,Math.sin(a)*.19,1.58+Math.cos(a)*.16,-.20,.17,.43,c.color);sp.rotation.x=-1.2;sp.rotation.z=-Math.sin(a)}ball(rig,0,1.57,.25,.08,'#20232b')}
  if(kind==='fox'){for(const side of [-1,1]){const tail=cone(rig,side*.2,.7,-.38,.19,.65,c.color);tail.rotation.x=-1;tail.rotation.z=side*.4;}}
  if(kind==='lion'){ball(rig,0,1.59,-.04,.33,'#e8e1d0');ball(rig,0,1.57,.18,.21,'#f3ede0')}
  if(kind==='kaiju'){g.rotation.x=0;torso.scale.set(1,1.25,1.6);head.position.z=.22;const tail=cone(rig,0,.48,-.65,.22,1.4,c.color);tail.rotation.x=-1.2;for(let i=0;i<6;i++){const fin=cone(rig,0,.62+i*.15,-.28,.12,.30,c.accent);fin.rotation.x=-.8;}}
 }
 if(kind==='flame'){head.material=mat('#f8dba0');for(let i=0;i<5;i++)cone(rig,(i-2)*.07,1.91+Math.abs(i-2)*.02,0,.08,.34,'#ff781d');for(let i=0;i<9;i++)ball(arms[1],Math.sin(i*.7)*.1,-.48-i*.075,.1,.035,'#93928a')}
 if(kind==='surfer'){const board=ball(g,0,.035,0,.7,'#b9cedb',.65,.06,1.5);board.material=mat('#b9cedb',.8)}
 if(kind==='volcano'){cylinder(rig,0,1.80,0,.16,.23,.23,'#786450');ball(rig,0,1.925,0,.12,'#ff6b22',1,.2,1)}
 if(c.name==='Thor'){box(arms[1],0,-.15,.1,.08,.65,.08,'#786349');box(arms[1],0,.14,.1,.36,.24,.24,'#9ba9b5',.7)}
 if(c.name==='Superman'){const emblem=sculpt(rig,0,1.14,.189,.22,.16,.025,'#eac72d');emblem.rotation.z=Math.PI/4;sculpt(rig,0,1.145,.21,.16,.028,.026,'#c42d3b');sculpt(rig,0,1.09,.21,.16,.028,.026,'#c42d3b');}
 if(kind==='blindfold'){for(let i=0;i<5;i++)sculpt(rig,.025,.92+i*.065,.149,.013,.013,.017,'#3e4552');sculpt(rig,.17,1.17,.118,.03,.13,.022,'#273047');}
 if(kind==='spider'){for(let j=0;j<4;j++){const y=.89+j*.085;sculpt(rig,0,y,.17,.39-j*.025,.009,.008,'#572335')}ball(rig,0,1.12,.187,.04,'#17232e',.7,1.5,.25);for(const sign of [-1,1])for(let j=0;j<4;j++){const line=sculpt(rig,sign*.066,1.08+j*.026,.185,.11,.009,.01,'#17232e');line.rotation.z=sign*(.5-j*.3)}}
 if(kind==='leopard'||kind==='tiger'){for(let side of [-1,1])for(let j=0;j<12;j++){const y=.83+(j%6)*.055;ball(rig,side*(.10+(j%3)*.047),y,.17,.020,'#333748',1.2,.75,.28)}for(let side of [-1,1]){ball(rig,side*.075,1.64,.164,.041,'#f7cf61',1,.42,.22);ball(rig,side*.075,1.64,.174,.014,'#24212b',.6,1,.3)}const tail=new T.CatmullRomCurve3([new T.Vector3(0,.70,-.14),new T.Vector3(.18,.55,-.5),new T.Vector3(.40,.62,-.65),new T.Vector3(.43,.9,-.65)]);rig.add(new T.Mesh(new T.TubeGeometry(tail,20,.052,8,false),mat(c.color)));}
 if(kind==='robot'){for(let side of [-1,1]){for(let j=0;j<4;j++)sculpt(rig,side*.16,.80+j*.06,.19,.20,.029,.03,'#78899a',.8);cylinder(rig,side*.39,1.48,-.09,.045,.045,.40,'#a5b3c2');for(let j=0;j<3;j++)sculpt(legs[side<0?0:1],0,-.1-j*.10,.085,.16,.07,.04,c.accent,.7)}}
 if(kind==='turtle'){for(let j=0;j<3;j++){const y=.82+j*.16;sculpt(rig,0,y,.297,.36,.013,.009,'#8e794c')}sculpt(rig,0,.75,.21,.43,.055,.04,'#6c4c35');for(let side of [-1,1]){sculpt(arms[side<0?0:1],side*.04,-.24,.068,.145,.09,.06,c.accent);sculpt(legs[side<0?0:1],0,-.25,.08,.16,.10,.04,c.accent)}}
 if(!animal&&!metallic&&!bare){sculpt(rig,0,1.355,.105,.33,.095,.16,bodyColor);sculpt(rig,0,1.075,.177,.018,.48,.02,c.accent);for(const side of [-1,1]){sculpt(rig,side*.285*thick,1.17,.025,.055,.22,.25,bodyColor);sculpt(legs[side<0?0:1],0,-.27,.058,.145,.095,.19,c.accent);sculpt(arms[side<0?0:1],side*.038,-.24,.04,.10,.075,.12,c.accent)}}
 for(const side of [-1,1]){sculpt(legs[side<0?0:1],side*.02,-.585,.09,.17*thick,.035,.27,'#171922');sculpt(arms[side<0?0:1],side*.035,-.365,.058,.115*thick,.018,.13,new T.Color(c.accent).offsetHSL(0,0,-.12).getStyle())}
 sculpt(rig,0,.72,.174,.42*thick,.075,.06,new T.Color(c.accent).offsetHSL(0,0,-.15).getStyle());sculpt(rig,0,.72,.215,.09,.105,.035,metallic?'#d8e2eb':'#8f754f',metallic?.8:0);
 if(c.name==='Naruto'){for(const side of [-1,1])for(let j=0;j<3;j++){const mark=sculpt(rig,side*.105,1.56-j*.022,.148,.075,.007,.009,'#7e584c');mark.rotation.z=side*(.18-j*.08)}}
 if(c.name==='Gojo'){sculpt(rig,0,1.39,.03,.34,.25,.27,'#0d1422');for(const side of [-1,1])sculpt(rig,side*.16,1.22,.166,.11,.025,.025,'#26344c')}
 if(c.name==='Spider-Man'){for(const side of [-1,1]){const stripe=sculpt(rig,side*.17,1.03,.174,.015,.46,.016,'#101a29');stripe.rotation.z=side*.18}}
 if(c.name==='Iron Man'){for(const side of [-1,1]){sculpt(rig,side*.20,1.22,.19,.15,.07,.035,'#e1b74e',.75);sculpt(legs[side<0?0:1],0,-.20,.12,.14,.22,.055,'#d6aa43',.7)}}
 if(c.name==='Po')hip.scale.x=1.4;
 g.scale.setScalar(c.height/1.95);g.userData={rig,legs,arms,head,height:c.height};return g;
}
// Lightweight match LOD. The collection uses makeFighter; remote combatants use
// this small rig because their screen-space details are only a few pixels wide.
export function makeCombatFighter(c:Fighter):T.Group{
 const g=new T.Group(),rig=new T.Group();g.add(rig);const legs:T.Group[]=[],arms:T.Group[]=[];
 const animal=['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju'].includes(c.model);
 const metal=['robot','armor','surfer','blades','vader'].includes(c.model);const bulky=['brute','panda','ape','bowser','robot','kaiju'].includes(c.model);const skin=c.model==='brute'?'#588e4c':c.model==='yoda'?'#89a568':c.skin;
 const mesh=(geo:T.BufferGeometry,color:string,metalness=0)=>{const m=new T.Mesh(geo,mat(color,metalness));m.castShadow=false;m.receiveShadow=false;rig.add(m);return m};
 const torso=mesh(new T.CapsuleGeometry(bulky?.28:.22,.50,4,8),c.color,metal?.55:0);torso.position.y=1.03;torso.scale.set(bulky?1.25:.92,1,.66);
 const hip=mesh(new T.CapsuleGeometry(bulky?.20:.16,.14,3,8),c.accent,metal?.55:0);hip.position.y=.69;hip.rotation.z=Math.PI/2;
 const head=mesh(new T.SphereGeometry(animal?.18:.145,12,8),animal?c.accent:metal?c.color:skin,metal?.5:0);head.position.y=1.58;head.scale.set(.92,1.1,.86);
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*(bulky?.15:.105),.65,0);const thigh=new T.Mesh(new T.CapsuleGeometry(bulky?.09:.065,.19,3,6),mat(c.color,metal?.45:0));thigh.position.y=-.14;const shin=new T.Mesh(new T.CapsuleGeometry(bulky?.075:.052,.19,3,6),mat(c.color,metal?.45:0));shin.position.y=-.41;const foot=new T.Mesh(new T.BoxGeometry(bulky?.20:.14,.09,.24),mat(c.accent,metal?.45:0));foot.position.set(0,-.57,.07);leg.add(thigh,shin,foot);rig.add(leg);legs.push(leg);
 const arm=new T.Group();arm.position.set(side*(bulky?.34:.245),1.25,0);const upper=new T.Mesh(new T.CapsuleGeometry(bulky?.095:.06,.17,3,6),mat(c.color,metal?.45:0));upper.position.y=-.13;const lower=new T.Mesh(new T.CapsuleGeometry(bulky?.075:.05,.17,3,6),mat(c.color,metal?.45:0));lower.position.y=-.38;const hand=new T.Mesh(new T.SphereGeometry(bulky?.07:.05,8,6),mat(metal?c.accent:skin));hand.position.set(0,-.53,.03);arm.add(upper,lower,hand);rig.add(arm);arms.push(arm)}
 if(['cape','mustachecape','bat','vader','blondcape','scout','firelord','helmet'].includes(c.model)){const cp=new T.Mesh(new T.PlaneGeometry(.58,.92),mat(c.accent));cp.position.set(0,1.03,-.18);cp.material.side=T.DoubleSide;rig.add(cp)}
 if(['blindfold','silverhair','blond','blondcape','spiky','ninja','akatsuki','bowl'].includes(c.model)){const hair=mesh(new T.ConeGeometry(.18,.27,7),['blindfold','silverhair'].includes(c.model)?'#e8eff4':['blond','blondcape'].includes(c.model)?'#edce50':'#171a24');hair.position.y=1.78}
 if(c.model==='blindfold'){const band=mesh(new T.BoxGeometry(.30,.065,.06),'#0b0e17');band.position.set(0,1.63,.125)}
 if(c.model==='robot'){const glass=mesh(new T.BoxGeometry(.48,.14,.04),'#78ddf1',.65);glass.position.set(0,1.23,.22);const grille=mesh(new T.BoxGeometry(.28,.19,.04),'#c7cdd3',.8);grille.position.set(0,1.03,.23)}
 if(c.model==='tortoise'){const neck=mesh(new T.CapsuleGeometry(.08,.27,3,7),'#afa479');neck.position.set(0,1.44,.02);const shell=mesh(new T.SphereGeometry(.34,12,8),'#514a37');shell.position.set(0,1,-.18);shell.scale.set(.92,1.1,.45)}
 g.scale.setScalar(c.height/1.95);g.userData={rig,legs,arms,head,height:c.height};return g;
}
export function animateFighter(g:T.Group,time:number,moving:number,attack=false,flying=false){const {rig,legs,arms}=g.userData;if(!rig)return;const stride=Math.sin(time*10)*.65*moving;legs[0].rotation.x=stride;legs[1].rotation.x=-stride;arms[0].rotation.x=flying?-1.1:-stride*.8;arms[1].rotation.x=attack?-1.5:flying?-1.1:stride*.8;rig.position.y=Math.abs(Math.sin(time*10))*.026*moving+Math.sin(time*2)*.006;rig.rotation.z=Math.sin(time*5)*.025*moving;legs[0].rotation.z=-.035;legs[1].rotation.z=.035;arms[0].rotation.z=.07;arms[1].rotation.z=-.07;}
