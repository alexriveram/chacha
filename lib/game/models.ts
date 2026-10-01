import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {type Fighter} from './roster';
const mats=new Map<string,T.MeshStandardMaterial>();
export function mat(color:string,metal=0,emission=0){const key=color+metal+emission;if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness:metal?.38:.8,metalness:metal,emissive:color,emissiveIntensity:emission}));return mats.get(key)!}
export function box(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:string,metal=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c,metal));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
export function ball(g:T.Object3D,x:number,y:number,z:number,r:number,c:string,sx=1,sy=1,sz=1){const m=new T.Mesh(new T.SphereGeometry(r,24,18),mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m}
export function cylinder(g:T.Object3D,x:number,y:number,z:number,r1:number,r2:number,h:number,c:string){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,12),mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function cone(g:T.Object3D,x:number,y:number,z:number,r:number,h:number,c:string){return cylinder(g,x,y,z,0,r,h,c)}
function cape(g:T.Group,color:string){const geo=new T.PlaneGeometry(.78,1.18,12,16);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setXYZ(i,x*(1.2-y*.35),y,Math.cos(x*28)*.025-(.6-y)*.17)}geo.computeVertexNormals();const material=mat(color).clone();material.side=T.DoubleSide;const m=new T.Mesh(geo,material);m.position.set(0,.94,-.23);m.castShadow=true;g.add(m);}
function sculpt(g:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:string,metal=0){const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.25),mat(c,metal));mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh;}
function limb(g:T.Object3D,a:T.Vector3,b:T.Vector3,r1:number,r2:number,color:string){const delta=b.clone().sub(a);const m=new T.Mesh(new T.CylinderGeometry(r2,r1,delta.length(),16),mat(color));m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());m.castShadow=true;g.add(m);return m;}
function blade(g:T.Object3D,x:number,y:number,z:number,color:string,len=1){const m=new T.Mesh(new T.CylinderGeometry(.025,.025,len,6),new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:2}));m.position.set(x,y,z);g.add(m);return m}
export function makeFighter(c:Fighter):T.Group{
 const g=new T.Group(),rig=new T.Group();g.add(rig);const kind=c.model;const metallic=['robot','armor','surfer','blades'].includes(kind);const skin=kind==='brute'?'#588e4c':kind==='yoda'?'#89a568':c.skin;const animal=['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju'].includes(kind);
 const thick=['brute','panda','ape','bowser','robot'].includes(kind)?1.35:1;
 const bare=['wrestler','fighter','boxer','brute','kratos','titan'].includes(kind);const bodyColor=bare?skin:c.color;
 const torso=ball(rig,0,1.08,0,.3,bodyColor,thick,.99,.58);const hip=sculpt(rig,0,.69,0,.39*thick,.22,.25,c.color);ball(rig,0,.88,0,.23,bodyColor,.82*thick,1,.66);
 for(const side of [-1,1]){ball(rig,side*.13*thick,1.17,.065,.17,bodyColor,1,.72,.66);for(let n=0;n<3;n++)ball(rig,side*.065,.91+n*.065,.137,.065,bodyColor,1,.7,.3)}
 cylinder(rig,0,1.43,0,.075,.10,.16,skin);
 const legs:T.Group[]=[],arms:T.Group[]=[];
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.13*thick,.66,0);const legColor=bare?skin:c.color;
 limb(leg,new T.Vector3(0,0,0),new T.Vector3(side*.01,-.25,.012),.112*thick,.079*thick,legColor);ball(leg,side*.01,-.25,.012,.08*thick,legColor);limb(leg,new T.Vector3(side*.01,-.25,.012),new T.Vector3(side*.02,-.49,0),.075*thick,.058*thick,legColor);
 sculpt(leg,side*.02,-.53,.055,.155*thick,.13,.26,['plumber','hedgehog'].includes(kind)?kind==='hedgehog'?c.accent:'#392c29':c.accent);rig.add(leg);legs.push(leg);
 const arm=new T.Group();arm.position.set(side*.29*thick,1.26,0);const armColor=bare?skin:c.color;ball(arm,0,-.035,0,.118*thick,armColor,1,1.15,1);limb(arm,new T.Vector3(0,-.04,0),new T.Vector3(side*.04,-.235,.015),.093*thick,.063*thick,armColor);ball(arm,side*.04,-.235,.015,.066*thick,armColor);limb(arm,new T.Vector3(side*.04,-.235,.015),new T.Vector3(side*.035,-.41,.055),.066*thick,.049*thick,armColor);
 sculpt(arm,side*.035,-.425,.057,.13*thick,.08,.14,c.accent,metallic?.6:0);const handColor=kind==='boxer'?c.accent:metallic?c.accent:skin;ball(arm,side*.035,-.48,.06,.071*thick,handColor,.8,1.2,.66);for(let f=0;f<4;f++)ball(arm,side*.035+(f-1.5)*.025,-.52,.08,.016,handColor,.65,1.9,.8);ball(arm,side*.035-side*.065,-.48,.1,.022,handColor,.8,1.5,.8);rig.add(arm);arms.push(arm)}
 const head=ball(rig,0,1.60,0,.175,animal?kind==='panda'?'#f4eee3':c.color:metallic?c.color:skin,1,1.20,.89);
 if(!animal&&!metallic&&!['mask','spider','vader','bat','maul','helmet'].includes(kind)){ball(rig,0,1.51,.032,.123,skin,.9,.69,.83);for(const side of [-1,1]){ball(rig,side*.172,1.59,0,.038,skin,.48,1,.72);ball(rig,side*.07,1.628,.139,.038,'#f4eee8',1,.42,.2);ball(rig,side*.07,1.628,.147,.017,'#425e70',.7,1,.35);sculpt(rig,side*.071,1.668,.142,.071,.016,.022,'#3a2d2b');}ball(rig,0,1.584,.159,.026,skin,.64,1.3,1.4);sculpt(rig,0,1.527,.143,.07,.011,.015,'#9b6962');}
 const eyeColor=['vader','robot','armor','mask','spider','bat'].includes(kind)?'#b9f5ff':'#17202b';for(const side of [-1,1])box(rig,side*.066,1.63,.155,.054,.025,.015,eyeColor);
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
 if(c.name==='Po')hip.scale.x=1.4;
 g.scale.setScalar(c.height/1.95);g.userData={rig,legs,arms,head,height:c.height};return g;
}
export function animateFighter(g:T.Group,time:number,moving:number,attack=false,flying=false){const {rig,legs,arms}=g.userData;if(!rig)return;const stride=Math.sin(time*10)*.65*moving;legs[0].rotation.x=stride;legs[1].rotation.x=-stride;arms[0].rotation.x=flying?-1.1:-stride*.8;arms[1].rotation.x=attack?-1.5:flying?-1.1:stride*.8;rig.position.y=Math.abs(Math.sin(time*10))*.026*moving+Math.sin(time*2)*.006;rig.rotation.z=Math.sin(time*5)*.025*moving;legs[0].rotation.z=-.035;legs[1].rotation.z=.035;arms[0].rotation.z=.07;arms[1].rotation.z=-.07;}
