import * as T from 'three';
import type {Fighter} from './roster';

// Original painted facial maps. They are synchronous, cached and shared by the
// collection, portraits and match models, so there is no portrait loading race.
const textures = new Map<string,T.CanvasTexture>();
const humanSkins:Record<string,string>={
 'gojo':'#e9cbb5','sasuke':'#e1c4b2','itachi':'#d5b7a7','kakashi':'#dbc0a8',
 'naruto':'#e6b389','minato':'#e6b78f','sukuna':'#d8aa95','yuji':'#e5b493',
 'toji':'#d1ac94','geto':'#d9b29b','yuta':'#dcc0ae','megumi':'#d9b8a6',
 'levi':'#d6baa7','uncle-iroh':'#cca081','king-bumi':'#c6a180',
 'john-cena':'#ce9c7c','jon-jones':'#8e614b','the-rock':'#a47755',
 'randy-orton':'#c39879','the-undertaker':'#c6a68d','superman':'#d9ac8b',
 'goku':'#e0ac82','aang':'#dfb796','toph':'#dcc2a3','katara':'#b98969',
 'zuko':'#ddb395','ozai':'#cba58a','kratos':'#b6a89b',
};
const featured=new Set(['gojo','naruto','sasuke','sukuna','iron-man','spider-man','hulk','oogway','optimus-prime','itachi','kakashi','goku','superman','uncle-iroh','darth-vader','po']);
const animals=new Set(['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju']);
const mix=(a:string,b:string,t:number)=>new T.Color(a).lerp(new T.Color(b),t).getStyle();
type Point=[number,number];

function paint(c:Fighter){
 const cached=textures.get(c.id);if(cached)return cached;
 const canvas=document.createElement('canvas');
 canvas.width=canvas.height=featured.has(c.id)?512:256;
 const x=canvas.getContext('2d')!;
 x.scale(canvas.width/512,canvas.height/512);
 const id=c.id,k=c.model,isAnimal=animals.has(k);
 const skin=k==='brute'?'#568346':k==='yoda'?'#98a779':k==='surfer'?'#b8c9d1':k==='flame'?'#ddc8a2':k==='maul'?'#b63732':id==='oogway'?'#b3a374':isAnimal?c.color:humanSkins[id]||c.skin;
 const ink='#302d34';
 const fill=(color:string)=>{x.fillStyle=color;x.fillRect(0,0,512,512)};
 const path=(points:Point[],color:string,stroke?:string,width=2)=>{
  x.beginPath();points.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fillStyle=color;x.fill();
  if(stroke){x.strokeStyle=stroke;x.lineWidth=width;x.lineJoin='round';x.stroke()}
 };
 const ellipse=(a:number,b:number,rx:number,ry:number,col:string,angle=0)=>{x.beginPath();x.ellipse(a,b,rx,ry,angle,0,Math.PI*2);x.fillStyle=col;x.fill()};
 const line=(p:Point[],color:string,width=3)=>{x.beginPath();p.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.strokeStyle=color;x.lineWidth=width;x.lineCap='round';x.lineJoin='round';x.stroke()};
 const curve=(p:number[],color:string,width=3)=>{x.beginPath();x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=6)x.bezierCurveTo(...p.slice(i,i+6) as [number,number,number,number,number,number]);x.strokeStyle=color;x.lineWidth=width;x.lineCap='round';x.stroke()};
 const soft=(cx:number,cy:number,rx:number,ry:number,color:string,alpha:number)=>{
  x.save();x.translate(cx,cy);x.scale(rx,ry);const g=x.createRadialGradient(0,0,.02,0,0,1);g.addColorStop(0,color);g.addColorStop(1,color+'00');x.globalAlpha=alpha;x.fillStyle=g;x.fillRect(-1,-1,2,2);x.restore();
 };
 const shape=(draw:()=>void,color:string,stroke?:string,width=2)=>{x.beginPath();draw();x.closePath();x.fillStyle=color;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=width;x.stroke()}};
 const metallic=['armor','robot','vader','surfer'].includes(k);
 const base=x.createLinearGradient(0,0,512,512);
 base.addColorStop(0,mix(skin,'#ffe6c8',.18));base.addColorStop(.45,skin);base.addColorStop(1,mix(skin,'#594943',.2));x.fillStyle=base;x.fillRect(0,0,512,512);
 // Soft painted planes keep the features dimensional at portrait size.
 soft(256,115,210,130,'#fff4da',.25);soft(256,303,62,149,'#f8ddbc',.27);
 soft(43,315,95,160,'#604638',.21);soft(474,321,91,160,'#604638',.24);
 soft(140,327,82,60,'#9e6050',.14);soft(372,327,82,60,'#9e6050',.14);
 soft(256,493,125,60,'#fff1d3',.22);

 const angry=['brute','tattoo','maul','kratos','leopard','lion','bat','vader','claws'].includes(k)||['sasuke','itachi','toji','levi','geto','megumi','thragg','omni-man','zuko','ozai'].includes(id);
 const anime=['Naruto','Jujutsu Kaisen','Dragon Ball','Attack on Titan','Avatar'].includes(c.world);
 const eyeColor=['naruto','minato','gojo','superman','thor','luke-skywalker'].includes(id)?'#43a8ca':['itachi','sasuke','sukuna','shadow'].includes(id)?'#a32936':k==='brute'?'#94af6b':id==='toph'?'#b0c5ac':id==='katara'?'#5598b5':'#675544';
 function eye(cx:number,side:number,options:{color?:string;small?:boolean;sharingan?:boolean;rinnegan?:boolean;lid?:boolean}={}){
  const yy=224,wide=anime?58:52,ry=anime?23:18,tilt=angry?side*9:side*2;
  soft(cx,yy-8,wide+23,45,'#5f463e',.24);
  shape(()=>{x.moveTo(cx-wide,yy+tilt);x.bezierCurveTo(cx-wide*.38,yy-ry*1.7,cx+wide*.35,yy-ry*1.3,cx+wide,yy-tilt);x.bezierCurveTo(cx+wide*.45,yy+ry*1.25,cx-wide*.38,yy+ry*1.15,cx-wide,yy+tilt)},'#efebe1',ink,anime?3.5:2.5);
  x.save();x.beginPath();x.ellipse(cx,yy,wide-3,ry+1,0,0,Math.PI*2);x.clip();
  const r=options.small?15:anime?21:18;
  const iris=x.createRadialGradient(cx-6,yy-6,1,cx,yy,r);iris.addColorStop(0,mix(options.color||eyeColor,'#d7ddc6',.38));iris.addColorStop(.45,options.color||eyeColor);iris.addColorStop(1,'#252b33');
  ellipse(cx,yy,r,r+4,iris as unknown as string);
  for(let j=0;j<16;j++){const a=j/16*Math.PI*2;line([[cx+Math.cos(a)*r*.54,yy+Math.sin(a)*r*.54],[cx+Math.cos(a)*r*.88,yy+Math.sin(a)*r*.88]],'#ffffff20',.8)}
  if(options.rinnegan)for(const rr of [7,12,17]){x.beginPath();x.arc(cx,yy,rr,0,Math.PI*2);x.strokeStyle='#3b294b';x.lineWidth=1.4;x.stroke()}
  ellipse(cx,yy,options.rinnegan?3:7,options.rinnegan?3:9,'#131b23');
  if(options.sharingan)for(let j=0;j<3;j++){const a=j*Math.PI*2/3+.25;ellipse(cx+Math.cos(a)*13,yy+Math.sin(a)*13,3.2,4.3,'#251c26',a)}
  ellipse(cx-7,yy-8,4,4,'#ffffff');ellipse(cx+5,yy+7,1.6,1.6,'#ffe8d0');x.restore();
  curve([cx-wide,yy+tilt,cx-23,yy-ry*1.65,cx+22,yy-ry*1.2,cx+wide,yy-tilt],ink,anime?4.5:3.3);
  curve([cx-wide+8,yy+11,cx-18,yy+ry*1.5,cx+21,yy+ry*1.5,cx+wide-8,yy+8],'#8c6554',1.8);
  const brow=['sage','yoda'].includes(k)?'#cfc4ad':['minato','naruto'].includes(id)?'#8a6039':'#302831';
  const y=yy-55;
  shape(()=>{x.moveTo(cx-wide,y-tilt);x.bezierCurveTo(cx-18,y-17,cx+24,y-10,cx+wide,y+tilt);x.lineTo(cx+wide-6,y+tilt+8);x.bezierCurveTo(cx+10,y+1,cx-18,y-4,cx-wide,y-tilt+6)},brow);
  if(options.lid)curve([cx-wide-4,yy-4,cx-14,yy-1,cx+13,yy-2,cx+wide+3,yy-4],skin,8);
 }
 eye(150,-1,{sharingan:id==='itachi'||id==='sasuke'});eye(362,1,{sharingan:id==='itachi',rinnegan:id==='sasuke',color:id==='sasuke'?'#9180b0':undefined});

 // Nose bridge, nostrils, philtrum, lips and chin, rather than a cartoon symbol.
 soft(235,286,23,66,'#80533e',.2);soft(270,321,25,22,'#674635',.17);
 curve([253,261,248,286,241,312,236,322,244,332,253,333,260,330],'#987056',2.4);
 curve([233,333,241,338,247,337,249,335],'#855843',2.5);curve([272,333,278,329,285,331,283,335],'#805541',2.5);
 ellipse(256,321,8,5,'#f6d7b044');curve([251,350,251,358,248,362,247,365],'#a77961',1.6);
 const smile=['gojo','naruto','goku','superman','john-cena','aang','minato'].includes(id);
 curve([205,387,226,smile?402:385,275,402,308,smile?377:388],'#6c4840',3);
 curve([222,403,241,412,266,414,288,402],'#f4d5b3',2.4);
 soft(258,446,70,20,'#fff0d2',.19);curve([227,458,245,465,271,465,287,455],'#80564133',2);

 function hairline(color:string,style='short'){
  if(style==='swept')shape(()=>{x.moveTo(0,0);x.lineTo(512,0);x.lineTo(512,139);x.bezierCurveTo(419,101,404,27,302,49);x.bezierCurveTo(264,71,155,150,37,134);x.lineTo(0,168)},color);
  else path([[0,0],[512,0],[512,133],[474,110],[458,77],[399,56],[331,57],[278,39],[185,58],[137,47],[83,73],[46,139],[0,174]],color);
  curve([44,91,161,32,304,17,442,70],mix(color,'#ffffff',.12),3);
 }
 if(['superman','john-cena','luke-skywalker','thor','obi-wan','randy-orton','little-mac','the-undertaker'].includes(id)){
  const hair=['luke-skywalker','thor'].includes(id)?'#7e5f3d':id==='obi-wan'?'#795239':'#262832';hairline(hair,id==='luke-skywalker'?'swept':'short');
  if(id==='superman')curve([288,52,264,99,302,112,304,136,291,153,270,142,280,131],hair,11);
  if(['thor','obi-wan','the-undertaker'].includes(id)){
   shape(()=>{x.moveTo(29,279);x.lineTo(87,340);x.bezierCurveTo(109,383,173,417,256,438);x.bezierCurveTo(337,417,393,378,431,330);x.lineTo(490,278);x.lineTo(462,478);x.lineTo(256,512);x.lineTo(50,478)},mix(hair,skin,.1));
   for(let j=0;j<15;j++)curve([110+j*21,411+Math.abs(j-7)*-4,116+j*20,444,132+j*17,471,148+j*15,503],mix(hair,skin,.3),1.1);
  }
 }
 if(['sasuke','toji','geto','yuta','levi','megumi'].includes(id)){
  const bangs:Point[]=[[0,0],[512,0],[510,87],[454,41],[445,147],[405,83],[372,49],[339,132],[325,49],[258,61],[219,140],[217,57],[158,73],[99,150],[120,76],[72,117],[21,170],[0,169]];path(bangs,'#212431');
  curve([95,24,135,52,134,70,110,115],'#464654',2);curve([280,17,299,47,298,72,281,94],'#424451',2);
 }
 function leafBand(slash=false,angle=0){
  x.save();x.translate(256,89);x.rotate(angle);x.translate(-256,-89);
  const cloth=x.createLinearGradient(0,25,0,130);cloth.addColorStop(0,'#222a38');cloth.addColorStop(.5,'#364358');cloth.addColorStop(1,'#1c2431');x.fillStyle=cloth;x.fillRect(0,27,512,105);
  const metal=x.createLinearGradient(0,33,0,122);metal.addColorStop(0,'#7d8a97');metal.addColorStop(.34,'#ccd4d7');metal.addColorStop(.65,'#9cabb5');metal.addColorStop(1,'#697889');
  shape(()=>{x.moveTo(132,38);x.quadraticCurveTo(256,29,380,38);x.lineTo(384,120);x.quadraticCurveTo(256,129,128,120)},metal as unknown as string,'#4d5b6c',2.5);
  for(const a of [144,368])for(const b of [51,108]){ellipse(a,b,4,4,'#4d5d70');ellipse(a-1,b-1,1.5,1.5,'#dce4e5')}
  x.beginPath();x.moveTo(275,77);x.bezierCurveTo(274,54,245,53,236,73);x.bezierCurveTo(226,97,257,106,270,89);x.bezierCurveTo(279,77,260,66,251,77);x.strokeStyle='#475668';x.lineWidth=4;x.stroke();
  line([[275,77],[300,64],[289,99],[243,103],[227,97]],'#475668',4);
  if(slash)line([[132,101],[380,60]],'#3e4754',4);
  curve([155,41,217,35,302,34,366,40],'#f4f4e4',1.5);x.restore();
 }
 if(['naruto','minato','itachi','rock-lee'].includes(id))leafBand(id==='itachi');
 if(id==='naruto')for(const side of [-1,1])for(let j=0;j<3;j++)curve([256+side*77,302+j*22,256+side*99,307+j*20,256+side*139,299+j*27,256+side*164,289+j*32],'#805c4b',2.8);
 if(id==='itachi')for(const side of [-1,1]){curve([256+side*65,250,256+side*58,278,256+side*45,293,256+side*31,316],'#947561',3);curve([256+side*69,258,256+side*83,275,256+side*98,276,256+side*120,274],'#a48371',1.5)}
 if(id==='toji'){curve([302,375,308,383,299,393,303,407],'#785144',2.5);for(const yy of [382,390,399])line([[298,yy],[306,yy+2]],'#eac3a0',1.2)}
 if(id==='gojo'){
  const band=x.createLinearGradient(0,131,0,273);band.addColorStop(0,'#161724');band.addColorStop(.36,'#262737');band.addColorStop(.55,'#090e19');band.addColorStop(1,'#171a28');
  shape(()=>{x.moveTo(0,135);x.bezierCurveTo(139,148,175,143,256,141);x.bezierCurveTo(337,143,398,147,512,136);x.lineTo(512,263);x.bezierCurveTo(401,278,329,263,256,270);x.bezierCurveTo(196,263,95,278,0,261)},band as unknown as string);
  curve([0,162,90,190,169,171,253,190,340,169,434,197,512,160],'#59596a',2);
  curve([12,193,85,209,127,217,198,208,241,203,310,219,349,209,402,197,461,211,502,195],'#2f3444',3);
  curve([17,251,98,266,171,250,241,257],'#747180',1.3);curve([278,257,348,247,426,263,497,250],'#4a4a5c',1.3);
  curve([214,387,246,406,281,399,313,377],'#765345',3.7);ellipse(316,376,2,3,'#714d43');
 }
 if(id==='kakashi'){
  // One eye remains exposed, with the iconic scar and a diagonal protector.
  leafBand(false,-.13);path([[286,101],[468,87],[474,180],[337,192]],'#344151');
  eye(362,1,{color:'#b3313c',sharingan:true});line([[360,168],[355,207],[365,262],[357,279]],'#9b6b62',2.5);
  const cloth=x.createLinearGradient(0,266,0,512);cloth.addColorStop(0,'#253342');cloth.addColorStop(.6,'#34404e');cloth.addColorStop(1,'#17222e');
  shape(()=>{x.moveTo(0,267);x.bezierCurveTo(95,279,175,286,256,304);x.bezierCurveTo(337,286,422,279,512,267);x.lineTo(512,512);x.lineTo(0,512)},cloth as unknown as string);
  curve([52,336,124,332,192,344,256,357,318,344,389,332,460,336],'#66717a',2);curve([55,446,148,464,368,464,457,446],'#4b5968',1.5);
 }
 if(id==='sukuna'){
  for(const s of [-1,1]){
   path([[256+s*16,73],[256+s*42,93],[256+s*19,125],[256+s*10,118],[256+s*28,95]],'#292530');
   path([[256+s*53,59],[256+s*78,81],[256+s*64,113],[256+s*80,141],[256+s*62,147],[256+s*47,112],[256+s*62,85]],'#292530');
   curve([256+s*91,279,256+s*115,300,256+s*146,308,256+s*181,304],'#302530',7);
   curve([256+s*111,318,256+s*126,336,256+s*155,343,256+s*181,338],'#302530',6);
   shape(()=>{x.moveTo(256+s*77,260);x.quadraticCurveTo(256+s*117,257,256+s*148,270);x.quadraticCurveTo(256+s*115,284,256+s*77,270)},'#eadbce','#342a31',2);ellipse(256+s*111,269,6,7,'#a12738');
  }
  path([[236,438],[256,452],[277,438],[271,465],[256,477],[242,465]],'#302530');
  curve([195,380,231,415,284,414,321,375],'#663d3f',4);
 }
 if(id==='goku'){
  for(const s of [-1,1])path([[256+s*48,167],[256+s*139,146],[256+s*190,176],[256+s*155,182],[256+s*58,181]],'#24242e');
  path([[208,391],[255,400],[307,385],[288,410],[230,416]],'#efe6d6','#80503e',2);
  for(const s of [-1,1]){line([[256+s*117,282],[256+s*151,274]],'#93684e',2.2);line([[256+s*119,297],[256+s*146,288]],'#93684e',2)}
 }
 if(id==='zuko'){
  shape(()=>{x.moveTo(292,151);x.bezierCurveTo(346,108,431,138,450,175);x.lineTo(465,279);x.bezierCurveTo(425,324,346,319,302,274);x.lineTo(283,221)},'#aa685c');
  eye(362,1,{color:'#9e7846',lid:true});curve([307,300,342,318,405,310,438,286],'#ce917a',2);
 }
 if(id==='gaara'){
  for(const a of [150,362])curve([a-63,219,a-42,188,a+26,193,a+61,218],'#4f3033',8);
  x.fillStyle='#983e39';x.font='bold 63px serif';x.fillText('愛',333,135);
 }
 if(k==='airbender'){
  const g=x.createLinearGradient(216,0,285,203);g.addColorStop(0,'#73b6c4');g.addColorStop(1,'#518caa');x.fillStyle=g;
  path([[230,0],[282,0],[282,131],[314,131],[256,190],[198,131],[230,131]],'#69a7bc');
  line([[240,0],[240,130]],'#a2d0d2',2);
 }
 function beard(color:string,elder=false){
  const g=x.createLinearGradient(130,330,350,512);g.addColorStop(0,mix(color,'#fcf1db',.2));g.addColorStop(.55,color);g.addColorStop(1,mix(color,'#514c49',.25));
  shape(()=>{x.moveTo(45,290);x.bezierCurveTo(92,306,85,374,118,390);x.bezierCurveTo(153,414,196,431,256,432);x.bezierCurveTo(317,431,361,414,394,390);x.bezierCurveTo(431,363,420,315,465,290);x.lineTo(455,429);x.bezierCurveTo(438,478,365,494,256,512);x.bezierCurveTo(146,494,76,478,58,429)},g as unknown as string);
  for(let j=0;j<22;j++){const a=69+j*17.5;curve([a,387+Math.sin(j*.35)*25,a+3,420,a+(256-a)*.06,460,a+(256-a)*.16,494],mix(color,j%2?'#322d2d':'#fffbe5',j%2?.18:.35),1.2)}
  shape(()=>{x.moveTo(256,355);x.bezierCurveTo(224,344,175,350,135,379);x.bezierCurveTo(173,401,214,393,256,374);x.bezierCurveTo(299,393,340,401,377,379);x.bezierCurveTo(337,350,286,344,256,355)},mix(color,'#f3e1ca',.14));
  if(elder){for(const a of [150,362]){curve([a-61,169,a-23,134,a+34,139,a+61,169],color,13);curve([a-56,175,a-14,153,a+30,154,a+61,174],mix(color,'#fff8df',.3),3)}for(let j=0;j<3;j++)curve([161,90+j*17,214,83+j*18,296,83+j*18,348,90+j*17],'#946d56',1.8)}
 }
 if(['uncle-iroh','king-bumi','kratos','ozai'].includes(id)){
  beard(id==='kratos'?'#514335':id==='ozai'?'#2b292b':'#c9c4b4',id==='uncle-iroh'||id==='king-bumi');
  if(id==='uncle-iroh'){for(const a of [150,362])curve([a-43,230,a-9,212,a+18,212,a+42,227],'#514033',3.5);curve([213,400,240,414,274,414,299,399],'#654432',3)}
 }
 if(id==='kratos')path([[100,0],[165,0],[203,237],[165,300],[96,464],[70,460],[122,292],[146,237]],'#973c36');
 if(['thragg','omni-man'].includes(id)){
  hairline(id==='thragg'?'#272b32':'#454347');
  shape(()=>{x.moveTo(178,356);x.quadraticCurveTo(218,342,256,355);x.quadraticCurveTo(294,342,334,356);x.lineTo(325,390);x.quadraticCurveTo(285,379,256,379);x.quadraticCurveTo(227,379,187,390)},'#333039');
  for(let j=0;j<11;j++)line([[190+j*12,358],[195+j*11,380]],'#767078',1);
 }
 if(k==='brute'){
  for(const s of [-1,1]){curve([256+s*23,128,256+s*38,146,256+s*43,162,256+s*40,181],'#354f30',6);curve([256+s*70,100,256+s*105,113,256+s*144,119,256+s*165,136],'#385a31',3);curve([256+s*69,298,256+s*84,331,256+s*101,345,256+s*131,355],'#3b5831',3)}
  hairline('#27322c');
  shape(()=>{x.moveTo(165,372);x.quadraticCurveTo(256,350,347,372);x.lineTo(330,428);x.quadraticCurveTo(256,447,182,427)},'#273728','#263426',3);
  shape(()=>{x.moveTo(176,376);x.quadraticCurveTo(256,362,336,376);x.lineTo(328,400);x.quadraticCurveTo(256,410,184,400)},'#dddbb9');
  shape(()=>{x.moveTo(188,415);x.quadraticCurveTo(256,425,325,414);x.lineTo(321,426);x.quadraticCurveTo(256,438,190,424)},'#b9bc95');
  for(let i=0;i<7;i++)line([[192+i*21,371],[197+i*20,402]],'#75846a',1.3);
  curve([170,352,222,326,292,326,342,351],'#2e4729',3);
 }

 // A helmet is painted as machined panels, not a generic human face in a mask.
 if(['armor','robot','vader'].includes(k)){
  fill(k==='vader'?'#121820':c.color);
  if(k==='armor'){
   const red=x.createLinearGradient(0,0,512,512);red.addColorStop(0,'#d35749');red.addColorStop(.5,'#98313b');red.addColorStop(1,'#501f2e');x.fillStyle=red;x.fillRect(0,0,512,512);
   const gold=x.createLinearGradient(64,45,405,481);gold.addColorStop(0,'#f4d494');gold.addColorStop(.25,'#d9b56e');gold.addColorStop(.56,'#f0d59d');gold.addColorStop(.78,'#a88243');gold.addColorStop(1,'#cbaa65');
   path([[107,20],[190,43],[216,80],[296,80],[322,43],[405,20],[430,108],[419,214],[460,277],[405,327],[387,421],[328,488],[184,488],[125,421],[108,327],[52,277],[93,214],[82,108]],gold as unknown as string,'#6e4b37',3);
   path([[93,214],[126,250],[220,264],[211,233]],'#664c34');path([[419,214],[386,250],[292,264],[301,233]],'#664c34');
   for(const s of [-1,1]){path([[256+s*39,237],[256+s*139,220],[256+s*151,237],[256+s*44,252]],'#6fe4f3','#304959',4);line([[256+s*43,239],[256+s*137,228]],'#ecffff',7);path([[256+s*57,277],[256+s*105,292],[256+s*107,366],[256+s*73,395]],'#b08a4d');line([[256+s*83,83],[256+s*108,138],[256+s*98,190]],'#fff0c3',3)}
   path([[206,347],[306,347],[334,380],[310,399],[202,399],[178,380]],'#82603b');
   line([[179,380],[205,373],[307,373],[333,380]],'#553e30',5);line([[194,400],[214,415],[298,415],[318,400]],'#f5d9a0',3);
   line([[210,459],[302,459]],'#725337',5);line([[188,482],[209,434],[303,434],[327,482]],'#775235',2.5);
  }else if(k==='robot'){
   const optimus=id==='optimus-prime',bumble=id==='bumblebee';
   const armor=optimus?'#294c83':bumble?'#dcb846':'#9ca4ad';
   const metal=x.createLinearGradient(65,0,440,512);metal.addColorStop(0,mix(armor,'#ffffff',.35));metal.addColorStop(.35,armor);metal.addColorStop(.55,mix(armor,'#ffffff',.2));metal.addColorStop(1,mix(armor,'#152137',.5));x.fillStyle=metal;x.fillRect(0,0,512,512);
   path([[139,0],[177,147],[335,147],[373,0]],optimus?'#244371':bumble?'#272d37':'#ccd1d6','#354454',3);
   path([[64,181],[151,167],[213,198],[299,198],[361,167],[448,181],[451,287],[384,337],[128,337],[61,287]],'#1b2b3d');
   for(const s of [-1,1]){path([[256+s*28,215],[256+s*116,187],[256+s*169,201],[256+s*133,230],[256+s*47,239]],id==='megatron'?'#d85752':'#83d9f3');line([[256+s*45,219],[256+s*134,204]],id==='megatron'?'#ffb09a':'#d2f8ff',5)}
   const silver=x.createLinearGradient(94,289,414,457);silver.addColorStop(0,'#aebcc5');silver.addColorStop(.45,'#dbe3e4');silver.addColorStop(.51,'#899da9');silver.addColorStop(1,'#c1ccd0');
   path([[119,293],[214,258],[256,287],[298,258],[393,293],[363,455],[310,494],[202,494],[149,455]],silver as unknown as string,'#465968',3);
   if(optimus){line([[256,289],[256,464]],'#f6f6e8',4);for(let j=0;j<4;j++){line([[164+j*14,325],[176+j*12,439]],'#62798b',2);line([[348-j*14,325],[336-j*12,439]],'#738794',2)}}
   else {line([[189,395],[224,407],[288,407],[323,395]],'#394a58',5);line([[215,439],[297,439]],'#edf0df',2)}
   for(const s of [-1,1])line([[256+s*157,45],[256+s*172,133]],'#dcecf4',3);
  }else{
   const gloss=x.createLinearGradient(0,0,512,512);gloss.addColorStop(0,'#151d2a');gloss.addColorStop(.24,'#455160');gloss.addColorStop(.40,'#0a101b');gloss.addColorStop(.78,'#212b38');gloss.addColorStop(1,'#0c111b');x.fillStyle=gloss;x.fillRect(0,0,512,512);
   path([[125,152],[224,178],[240,262],[153,285],[79,263],[88,195]],'#181823','#626373',3);path([[387,152],[288,178],[272,262],[359,285],[433,263],[424,195]],'#171822','#555c6a',3);
   curve([99,205,140,180,187,190,214,211],'#71636b',4);curve([300,211,328,190,375,180,413,205],'#68606a',4);
   path([[246,93],[267,93],[286,299],[256,327],[226,299]],'#253240','#65727b',2);
   path([[256,286],[352,422],[326,453],[186,453],[160,422]],'#0b1019','#727b80',3);
   for(let j=0;j<7;j++){const a=204+j*17;line([[a,369-Math.abs(j-3)*-6],[a,431]],'#a4afb1',5);line([[a+3,379],[a+3,425]],'#313b48',2)}
   for(const s of [-1,1]){path([[256+s*117,288],[256+s*181,297],[256+s*217,380],[256+s*177,449],[256+s*110,449],[256+s*144,398]],'#263543','#6b7683',2);ellipse(256+s*177,434,22,22,'#8b9293');ellipse(256+s*177,434,16,16,'#192532');ellipse(256+s*180,429,6,8,'#485a68')}
  }
 }
 if(k==='spider'){
  const red=x.createLinearGradient(0,0,512,512);red.addColorStop(0,'#dd4a47');red.addColorStop(.43,'#c53b40');red.addColorStop(1,'#8f2938');x.fillStyle=red;x.fillRect(0,0,512,512);
  // Curved radial webs follow the mask's surface, including the nose bridge.
  for(let j=0;j<12;j++){const a=j*Math.PI/6;curve([256,258,256+Math.cos(a)*150,258+Math.sin(a)*180,256+Math.cos(a)*310,258+Math.sin(a)*340,256+Math.cos(a)*470,258+Math.sin(a)*520],'#622630',2.4)}
  for(let ring=1;ring<6;ring++){const r=ring*63;for(let j=0;j<12;j++){const a=j*Math.PI/6,b=(j+1)*Math.PI/6,m=(a+b)/2;const ax=256+Math.cos(a)*r,ay=258+Math.sin(a)*r*1.17,bx=256+Math.cos(b)*r,by=258+Math.sin(b)*r*1.17;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(256+Math.cos(m)*r*.85,258+Math.sin(m)*r*1.00,bx,by);x.strokeStyle='#652630';x.lineWidth=2.4;x.stroke()}}
  for(const s of [-1,1]){
   shape(()=>{x.moveTo(256+s*33,243);x.bezierCurveTo(256+s*67,206,256+s*130,172,256+s*192,156);x.bezierCurveTo(256+s*186,258,256+s*151,307,256+s*102,316);x.bezierCurveTo(256+s*69,313,256+s*45,280,256+s*33,243)},'#181f2b');
   const lens=x.createLinearGradient(0,178,0,303);lens.addColorStop(0,'#ffffff');lens.addColorStop(.6,'#e7edf0');lens.addColorStop(1,'#b9cdd9');
   shape(()=>{x.moveTo(256+s*49,244);x.bezierCurveTo(256+s*81,211,256+s*131,192,256+s*171,180);x.bezierCurveTo(256+s*163,254,256+s*137,288,256+s*102,297);x.bezierCurveTo(256+s*76,294,256+s*60,270,256+s*49,244)},lens as unknown as string);
   curve([256+s*55,241,256+s*101,210,256+s*134,197,256+s*162,190],'#ffffff',3);
  }
  for(let row=0;row<42;row++)for(let col=0;col<42;col++)ellipse(col*13+(row%2?6:0),row*13,.6,.6,'#ffdbc015');
 }
 if(['mask','bat','claws','helmet','luchador'].includes(k)){
  const color=k==='bat'?'#303a49':k==='claws'?'#d7b241':c.color;
  path([[0,0],[512,0],[512,314],[391,360],[377,323],[331,342],[256,316],[180,342],[133,323],[121,360],[0,314]],color);
  for(const s of [-1,1]){
   path([[256+s*38,211],[256+s*172,187],[256+s*150,238],[256+s*66,248]],'#182634');
   path([[256+s*55,215],[256+s*155,199],[256+s*141,228],[256+s*71,237]],'#dee9e7');
   curve([256+s*42,257,256+s*76,283,256+s*103,289,256+s*148,288],mix(color,'#fffbdc',.25),2);
  }
  if(k==='bat')path([[232,255],[256,241],[280,255],[275,329],[256,346],[237,329]],'#24303d');
  if(k==='claws')for(const s of [-1,1])path([[256+s*100,0],[256+s*200,0],[256+s*159,152],[256+s*97,210],[256+s*37,241],[256+s*70,159]],'#2b3440');
  if(k==='helmet'){line([[83,0],[112,298],[179,310]],c.accent,9);line([[429,0],[400,298],[333,310]],c.accent,9)}
 }
 if(k==='maul'){
  for(const s of [-1,1]){
   path([[256+s*20,0],[256+s*70,0],[256+s*68,107],[256+s*34,138],[256+s*61,172],[256+s*47,202],[256+s*16,157]],'#242330');
   path([[256+s*135,0],[256+s*221,0],[256+s*180,120],[256+s*214,213],[256+s*152,245],[256+s*72,222],[256+s*131,183],[256+s*112,135]],'#242330');
   path([[256+s*198,284],[256+s*132,312],[256+s*138,357],[256+s*76,408],[256+s*66,473],[256+s*166,492],[256+s*199,426],[256+s*175,350]],'#242330');
   ellipse(256+s*105,224,18,21,'#ddad45');ellipse(256+s*105,224,6,15,'#1a1e25');ellipse(256+s*111,216,3,3,'#ffedbb');
  }path([[243,279],[269,279],[291,335],[270,348],[242,348],[221,335]],'#27232b');
 }

 if(isAnimal){
  // Each species has its own facial silhouette and landmarks.
  if(['panda','leopard','tiger','lion','rat','monkey','ape','bowser','kaiju'].includes(k)){
   const muzzle=k==='panda'?'#ede5cf':k==='leopard'?'#d3d0bf':k==='lion'?'#ede8d4':k==='rat'?'#af997d':k==='ape'?'#977e61':c.accent;
   soft(256,360,166,110,muzzle,.98);
   ellipse(212,343,79,65,muzzle);ellipse(300,343,79,65,muzzle);
   shape(()=>{x.moveTo(222,304);x.quadraticCurveTo(256,291,290,304);x.quadraticCurveTo(295,324,256,340);x.quadraticCurveTo(217,324,222,304)},'#383432');
   ellipse(247,304,13,5,'#a3a299',-.13);line([[256,338],[256,374]],'#524336',3);
   curve([187,376,204,394,236,391,256,374,276,391,308,395,325,376],'#594737',3);
  }
  if(k==='panda'){
   fill('#e4ddcd');soft(255,134,206,140,'#fff9e4',.7);soft(35,304,100,190,'#8b867d',.24);soft(480,306,100,180,'#8b867d',.24);
   for(const s of [-1,1]){
    ellipse(256+s*108,217,75,89,'#303236',s*.21);ellipse(256+s*103,228,42,34,'#e9e3d7');ellipse(256+s*99,230,21,27,'#786146');ellipse(256+s*99,230,10,19,'#1a2529');ellipse(256+s*107,220,6,7,'#fffff0');
    curve([256+s*160,181,256+s*129,147,256+s*92,143,256+s*57,166],'#202830',6);
   }
   soft(255,337,171,88,'#fff3db',.94);ellipse(256,312,39,26,'#34383c');ellipse(245,302,13,7,'#858987');line([[256,336],[256,363]],'#575249',3);
   curve([179,365,211,404,300,402,335,361],'#5d5045',4);curve([209,398,239,416,279,416,307,395],'#aaa083',2);
  }
  if(['leopard','tiger','lion'].includes(k)){
   for(const s of [-1,1]){
    eye(256+s*107,s,{color:'#dcbb5b',small:true});
    for(let j=0;j<3;j++)path([[256+s*177,238+j*40],[256+s*229,218+j*45],[256+s*205,251+j*42],[256+s*170,255+j*40]],'#373633');
    for(let j=0;j<4;j++)ellipse(256+s*(85+j%2*22),329+Math.floor(j/2)*22,3,3,'#665449');
   }
   if(k==='leopard')for(const s of [-1,1])for(let j=0;j<6;j++){const a=256+s*(48+j%3*54),b=56+Math.floor(j/3)*43;ellipse(a,b,10,13,'#626969');ellipse(a+2,b+1,5,6,c.color)}
   if(k==='tiger')for(const s of [-1,1])path([[256+s*24,0],[256+s*73,0],[256+s*64,112],[256+s*27,143],[256+s*43,88]],'#303235');
   if(k==='lion'){path([[184,378],[256,392],[328,376],[308,420],[204,420]],'#5a4441');path([[193,380],[214,409],[221,386]],'#f7ecd4');path([[319,380],[298,408],[291,386]],'#f7ecd4')}
  }
  if(k==='rat'){
   for(const s of [-1,1])for(let j=0;j<3;j++)curve([256+s*76,333+j*17,256+s*137,328+j*22,256+s*192,309+j*31,256+s*249,310+j*35],'#d5c6ac',1.8);
   for(const s of [-1,1])curve([256+s*45,160,256+s*97,147,256+s*140,153,256+s*169,178],'#b5a388',7);
   curve([212,433,230,452,240,477,247,498],'#ad9c81',3);curve([298,433,280,452,270,477,263,498],'#ad9c81',3);
  }
  if(k==='turtle'){
   fill(c.color);soft(256,352,231,130,'#b9bb80',.62);
   const band=x.createLinearGradient(0,161,0,273);band.addColorStop(0,mix(c.accent,'#fff3d0',.2));band.addColorStop(1,mix(c.accent,'#283043',.3));x.fillStyle=band;x.fillRect(0,158,512,122);
   for(const s of [-1,1]){eye(256+s*109,s,{color:'#6c764b'});curve([256+s*56,257,256+s*106,274,256+s*160,263,256+s*188,247],mix(c.accent,'#f6ebd0',.4),2)}
   curve([168,377,216,400,298,400,344,369],'#435744',4);ellipse(236,322,4,3,'#4c664a');ellipse(276,322,4,3,'#4c664a');
   if(id==='michelangelo')path([[219,391],[256,399],[313,383],[289,413],[240,419]],'#ece2bf','#536c48',2);
  }
  if(id==='oogway'){
   fill('#b5a579');soft(256,296,250,221,'#d8c799',.68);soft(65,141,110,161,'#66664c',.34);soft(445,141,110,161,'#64614a',.37);
   for(const s of [-1,1]){
    ellipse(256+s*106,200,75,95,'#797456');
    shape(()=>{x.moveTo(256+s*166,215);x.bezierCurveTo(256+s*136,186,256+s*80,184,256+s*47,215);x.bezierCurveTo(256+s*62,250,256+s*140,257,256+s*166,215)},'#e2e2cb');
    ellipse(256+s*98,223,21,28,'#415351');ellipse(256+s*98,226,11,19,'#162a30');ellipse(256+s*107,215,6,7,'#f6fff4');
    curve([256+s*171,197,256+s*133,158,256+s*84,164,256+s*45,191],'#bcad80',15);curve([256+s*173,193,256+s*133,154,256+s*84,161,256+s*45,187],'#ded2a8',2);
    curve([256+s*158,262,256+s*125,283,256+s*90,283,256+s*56,266],'#918465',2.5);
    for(let j=0;j<3;j++)curve([256+s*173,258+j*14,256+s*181,261+j*16,256+s*190,260+j*18,256+s*203,251+j*21],'#a28f68',2);
   }
   for(let j=0;j<4;j++)curve([229+j*18,84,221+j*19,108,236+j*17,132,230+j*18,153],'#887f5c',2);
   soft(256,351,202,95,'#e0d3aa',.8);ellipse(211,315,6,4,'#776d4a',-.12);ellipse(302,315,6,4,'#776d4a',.12);
   curve([129,365,187,407,297,427,389,361],'#6c573d',5);curve([136,367,208,402,309,416,380,363],'#f0ddae',2);
   for(let j=0;j<5;j++)curve([175+j*39,411,179+j*38,424,184+j*35,438,191+j*33,449],'#bba77b',1.6);
  }
  if(['hedgehog','fox'].includes(k)){
   fill(c.color);soft(256,358,223,166,c.accent,.92);
   for(const s of [-1,1]){
    shape(()=>{x.moveTo(256+s*8,266);x.bezierCurveTo(256+s*10,182,256+s*54,126,256+s*134,137);x.bezierCurveTo(256+s*194,153,256+s*183,275,256+s*117,296);x.bezierCurveTo(256+s*70,305,256+s*37,284,256+s*8,266)},'#f0e9d7');
    ellipse(256+s*97,237,16,38,id==='shadow'?'#b83c3d':'#3e886a');ellipse(256+s*97,239,7,28,'#1c2930');ellipse(256+s*103,224,4,7,'#fff9e8');
   }
   ellipse(256,302,39,28,'#252b33');ellipse(243,291,12,5,'#636871');curve([232,369,262,390,303,384,334,359],'#5e4a3b',3);
   if(id==='shadow'){path([[237,0],[275,0],[288,120],[256,146],[222,120]],'#c43440');for(const s of [-1,1])path([[256+s*142,77],[256+s*195,90],[256+s*127,197],[256+s*49,220],[256+s*77,176]],'#af3543')}
  }
 }
 if(k==='volcano'){
  fill('#b6b29c');soft(256,197,223,174,'#e6dfbe',.65);
  ellipse(256,223,119,106,'#747568');ellipse(256,222,100,78,'#e7e4cd');ellipse(256,230,40,52,'#493c35');ellipse(256,230,21,36,'#141f21');ellipse(242,212,11,13,'#f5f5df');
  curve([141,179,206,142,297,143,371,179],'#53594f',8);curve([164,396,215,378,297,378,348,396],'#555b51',5);
  for(let j=0;j<6;j++)ellipse(158+j*39,404,12,19,'#636b5d');
 }
 if(k==='flame'){
  fill('#d6c5a2');soft(256,109,186,124,'#ffedd0',.5);
  for(const s of [-1,1]){shape(()=>{x.moveTo(256+s*43,199);x.bezierCurveTo(256+s*93,172,256+s*156,181,256+s*180,224);x.bezierCurveTo(256+s*157,285,256+s*93,297,256+s*61,263)},'#4b3a30');soft(256+s*117,234,36,36,'#ff720d',.96);ellipse(256+s*117,234,10,12,'#ffe5a3');}
  path([[256,287],[224,345],[242,356],[256,344],[270,356],[288,345]],'#534037');
  path([[157,378],[256,397],[355,378],[334,449],[256,467],[178,449]],'#564135');
  for(let j=0;j<8;j++){const a=174+j*23;shape(()=>{x.moveTo(a,391);x.lineTo(a+18,394);x.lineTo(a+15,433);x.lineTo(a+2,431)},'#e9d5ac');line([[a+1,438],[a+15,440]],'#b9a37c',4)}
 }
 if(k==='plumber'){
  const wal=id==='waluigi',wario=id==='wario';
  const nose=x.createRadialGradient(245,283,2,256,311,60);nose.addColorStop(0,'#f0b397');nose.addColorStop(1,wario?'#cb7a78':'#c58e70');ellipse(256,310,wal?40:59,wal?67:49,nose as unknown as string);
  shape(()=>{x.moveTo(256,359);x.bezierCurveTo(218,325,187,334,163,355);x.lineTo(wal?128:145,wal?320:356);x.bezierCurveTo(143,399,199,402,256,375);x.bezierCurveTo(313,402,369,399,wal?384:367,wal?320:356);x.lineTo(349,355);x.bezierCurveTo(325,334,294,325,256,359)},'#353038');
  curve([220,419,247,432,277,429,297,412],'#734f42',3);
 }
 if(k==='goggles'){
  for(const s of [-1,1]){
   shape(()=>{x.moveTo(256+s*36,180);x.lineTo(256+s*189,162);x.lineTo(256+s*179,276);x.lineTo(256+s*39,263)},'#d9cd52','#283349',9);
   shape(()=>{x.moveTo(256+s*48,190);x.lineTo(256+s*174,177);x.lineTo(256+s*166,259);x.lineTo(256+s*49,251)},'#dbe6e6');ellipse(256+s*109,223,14,22,'#34475a');ellipse(256+s*114,213,4,5,'#f2ffff');
  }line([[229,210],[283,210]],'#334155',10);
 }
 if(id==='silver-surfer'){
  soft(135,150,55,230,'#f5fbf8',.36);soft(379,169,46,220,'#526c7c',.25);
  for(const s of [-1,1]){ellipse(256+s*106,222,36,15,'#e5f5fa');line([[256+s*62,219],[256+s*146,205]],'#788f9a',3)}
 }
 // Freckles/skin grain at subpixel scale, deliberately restrained for small faces.
 if(!isAnimal&&!metallic&&!['spider','mask','bat','claws','maul','flame','volcano'].includes(k)){
  for(let j=0;j<180;j++){const px=72+(j*53%369),py=286+(j*37%174);ellipse(px,py,.4,.35,'#5c3e2c0a')}
 }
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 texture.anisotropy=2;texture.name='chacha-painted-face-'+id;textures.set(id,texture);return texture;
}

// Kept as a small integration point for the portrait preloader. The current face
// art is created synchronously and needs no network requests or image decodes.
export async function loadFaceAtlases():Promise<void>{}

export function addPaintedFace(rig:T.Group,c:Fighter,lowDetail=false){
 if(typeof document==='undefined')return;
 for(const child of [...rig.children]){
  if(!(child instanceof T.Mesh))continue;
  const p=child.position;
  // Remove only the old front facial primitives; retain skull, ears and hair.
  if(p.y>1.47&&p.y<1.78&&p.z>.075&&Math.abs(p.x)<.23){rig.remove(child);child.geometry.dispose()}
  else if(p.y>1.48&&p.y<1.56&&Math.abs(p.x)<.01&&p.z>=0&&p.z<.075&&child.geometry.type==='SphereGeometry'){rig.remove(child);child.geometry.dispose()}
 }
 const robot=['armor','robot','vader'].includes(c.model),animal=animals.has(c.model);
 const covered=['spider','mask','bat','claws','luchador','helmet','maul','spiralmask'].includes(c.model);
 const oogway=c.id==='oogway';
 // The entire front hemisphere is wrapped; the old rectangular floating card
 // caused especially obvious square borders at the chin and temples.
 const rx=robot?.181:lowDetail?(animal?.168:.137):oogway?.151:animal?.181:covered?.181:.131;
 const ry=robot?.199:lowDetail?(animal?.202:.162):oogway?.126:animal?.177:covered?.195:.168;
 const rz=robot?.095:lowDetail?(animal?.160:.129):oogway?.223:animal?.160:covered?.181:.122;
 const segments=lowDetail?16:28,rows=lowDetail?16:28;
 const geometry=new T.PlaneGeometry(2,2,segments,rows),p=geometry.attributes.position;
 for(let i=0;i<p.count;i++){
  const u=p.getX(i),v=p.getY(i),ellipse=Math.sqrt(Math.max(.001,1-v*v));
  // Wider temple, narrowing chin. A slight nose and brow relief catch light
  // without adding tiny individual meshes or extra draw calls.
  const jaw=v<-.2?1-.10*((-v-.2)/.8):1;
  const nx=u*rx*ellipse*jaw,ny=v*ry;
  let nz=rz*Math.sqrt(Math.max(.001,1-u*u))*ellipse;
  if(robot){const chamfer=1-.09*Math.pow(Math.abs(v),8);p.setXYZ(i,u*rx*chamfer,v*ry,.01-.047*Math.pow(Math.abs(u),4)-.007*v*v);continue}
  const nose=!animal&&!covered?Math.exp(-Math.pow(u/.17,2)-Math.pow((v+.12)/.31,2))*.020:0;
  const brow=!animal&&!covered?Math.exp(-Math.pow((Math.abs(u)-.44)/.25,2)-Math.pow((v-.24)/.12,2))*.006:0;
  nz+=nose+brow;p.setXYZ(i,nx,ny,nz);
 }
 geometry.computeVertexNormals();
 // Light the portrait map with the rest of the model.  The old unlit material
 // looked like a flat sticker even though the face geometry was curved.
 const material=new T.MeshStandardMaterial({map:paint(c),roughness:robot?.34:.72,metalness:robot?.36:0,toneMapped:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
 const face=new T.Mesh(geometry,material);face.name='painted-face-'+c.id;
 face.position.set(0,lowDetail?1.58:oogway?1.72:robot?1.62:covered?1.60:1.62,robot?.198:oogway?.050:.002);
 face.renderOrder=1;rig.add(face);
}
