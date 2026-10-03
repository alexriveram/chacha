import * as T from 'three';
import type {Fighter} from './roster';

// Painted face decals: one cached, small texture and one draw call per fighter.
// These are original illustrations, not downloaded portraits or game assets.
const textures = new Map<string,T.CanvasTexture>();
function paint(c:Fighter){
 const cached=textures.get(c.id);if(cached)return cached;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const x=canvas.getContext('2d')!;const n=c.name,k=c.model;
 const path=(p:number[][],fill:string,stroke?:string,w=5)=>{x.beginPath();p.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fillStyle=fill;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=w;x.stroke()}};
 const ellipse=(a:number,b:number,rx:number,ry:number,col:string)=>{x.beginPath();x.ellipse(a,b,rx,ry,0,0,Math.PI*2);x.fillStyle=col;x.fill()};
 const line=(p:number[][],col:string,w=5)=>{x.beginPath();p.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.strokeStyle=col;x.lineWidth=w;x.lineJoin='round';x.lineCap='round';x.stroke()};
 const animal=['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju'].includes(k);
 const mask=['armor','robot','vader','spider','mask','bat','claws','luchador','helmet'].includes(k);
 let skin=k==='brute'?'#619947':k==='yoda'?'#8fae73':k==='surfer'?'#bccbd8':k==='flame'?'#e6d6af':k==='maul'?'#bf3534':animal?c.color:c.skin;
 if(mask)skin=c.color;if(n==='Oogway')skin='#b9ac7e';
 const grad=x.createLinearGradient(0,0,460,440);grad.addColorStop(0,new T.Color(skin).offsetHSL(0,0,.12).getStyle());grad.addColorStop(.55,skin);grad.addColorStop(1,new T.Color(skin).offsetHSL(0,0,-.13).getStyle());
 x.fillStyle=grad;x.fillRect(0,0,512,512);
 // Jaw and cheek planes give even the simple head a readable shape.
 path([[12,260],[64,318],[100,455],[221,496],[68,480]],'#00000014');
 path([[500,260],[448,318],[412,455],[291,496],[444,480]],'#00000018');
 const iris=['Naruto','Minato','Gojo','Superman','Thor','Luke Skywalker'].includes(n)?'#4aa9d6':['Itachi','Sasuke','Sukuna','Shadow'].includes(n)?'#b6383e':k==='brute'?'#a9c67a':'#665548';
 const angry=['brute','tattoo','maul','kratos','leopard','lion','bat','vader','claws'].includes(k);
 function eye(cx:number,side:number){
  const yy=239;const tilt=angry?side*14:side*3;
  path([[cx-66,yy-14-tilt],[cx-29,yy-35],[cx+39,yy-28],[cx+65,yy+2+tilt],[cx+32,yy+22],[cx-29,yy+22]],'#f6f0e6','#322b2a',6);
  ellipse(cx,yy-2,20,27,iris);ellipse(cx,yy-1,9,22,'#151c24');ellipse(cx-6,yy-12,5,7,'#ffffff');
  line([[cx-64,yy-18-tilt],[cx-26,yy-38],[cx+37,yy-30],[cx+65,yy+tilt]],'#252326',8);
  line([[cx-57,yy-69-tilt],[cx,yy-75],[cx+57,yy-60+tilt]],['sage','yoda'].includes(k)?'#ddd7c8':'#302b2b',angry?17:11);
 }
 eye(151,-1);eye(361,1);
 if(['Superman','John Cena','Luke Skywalker','Thor','Obi-Wan','The Rock','Randy Orton','Little Mac'].includes(n)){
  const hair=['Luke Skywalker','Thor'].includes(n)?'#9c723f':n==='Obi-Wan'?'#805a3d':'#29282d';
  if(n!=='The Rock')path([[0,0],[512,0],[502,161],[437,126],[397,82],[262,101],[167,63],[83,110],[12,167]],hair);
  if(n==='Superman')line([[302,90],[274,134],[304,157],[330,140]],hair,13);
  if(n==='Obi-Wan'||n==='Thor')path([[66,298],[119,387],[200,451],[307,451],[392,387],[446,298],[415,466],[256,512],[97,466]],hair);
 }
 if(n==='Zuko'){path([[305,163],[411,151],[451,217],[427,301],[339,307],[300,264]],'#a65951');eye(361,1)}
 if(n==='Gaara'){x.fillStyle='#a3443b';x.font='bold 65px serif';x.fillText('愛',348,130);}
 line([[252,269],[238,329],[255,336],[276,326]],'#805b494f',5);
 line([[199,388],[241,398],[281,398],[316,380]],'#663b36',6);
 line([[231,421],[281,421]],'#ffffff35',4);
 if(['Naruto','Minato','Itachi','Sasuke','Kakashi','Rock Lee','Gaara'].includes(n)){
  x.fillStyle='#26303c';x.fillRect(0,32,512,110);x.fillStyle='#a9b9c3';x.fillRect(118,38,276,92);
  x.strokeStyle='#495563';x.lineWidth=5;x.strokeRect(124,44,264,80);
  x.beginPath();x.arc(250,83,23,0,Math.PI*1.7);x.stroke();line([[274,83],[300,64],[285,111],[242,111]],'#44515c',6);
  for(const a of [137,375])for(const b of [57,108])ellipse(a,b,4,4,'#e9f2f7');
  if(n==='Itachi')line([[123,97],[390,69]],'#38404b',7);
 }
 if(n==='Naruto')for(const s of [-1,1])for(let j=0;j<3;j++)line([[256+s*91,314+j*23],[256+s*192,299+j*33]],'#795448',5);
 if(n==='Itachi'){line([[177,262],[197,304],[224,324]],'#625048',5);line([[335,262],[315,304],[288,324]],'#625048',5)}
 if(n==='Toji')line([[306,374],[313,385],[302,397],[312,405]],'#935d55',4);
 if(n==='Gojo'){path([[0,150],[512,150],[512,269],[360,283],[256,266],[150,283],[0,269]],'#11121b');line([[20,178],[201,194],[345,174],[491,188]],'#3b3b49',7);line([[41,253],[183,261],[252,245]],'#50505a',3);line([[211,385],[270,400],[322,375]],'#5e3f3b',7)}
 if(n==='Kakashi'){path([[0,277],[178,283],[256,307],[331,283],[512,277],[512,512],[0,512]],'#263343');line([[200,338],[256,353],[315,338]],'#647285',4);line([[362,180],[350,283]],'#a26b68',5)}
 if(k==='tattoo'){for(const s of [-1,1]){line([[256+s*82,285],[256+s*118,315],[256+s*174,321]],'#332830',10);line([[256+s*126,342],[256+s*191,356]],'#332830',8);path([[256+s*20,92],[256+s*54,131],[256+s*25,160]],'#332830')}line([[240,441],[256,467],[273,440]],'#332830',9)}
 if(k==='airbender')path([[226,0],[286,0],[286,143],[322,143],[256,204],[190,143],[226,143]],'#68b6d4');
 if(k==='kratos')path([[93,0],[170,0],[218,256],[160,376],[83,465],[105,328],[153,244]],'#a83837');
 if(['sage','firelord','kratos','mustache','mustachecape','plumber'].includes(k)){
  const beard=['sage','firelord'].includes(k)?'#d8d4c9':'#382b28';
  path([[164,348],[244,352],[256,369],[270,352],[347,348],[319,384],[271,385],[256,377],[239,385],[190,384]],beard);
  if(['sage','firelord','kratos'].includes(k))path([[83,324],[126,386],[193,433],[256,447],[318,433],[386,382],[431,324],[399,468],[256,510],[111,468]],beard);
 }
 if(k==='brute'){path([[172,374],[337,374],[315,418],[197,418]],'#33302a');path([[185,379],[326,379],[314,394],[197,394]],'#ede4cc');for(let i=0;i<5;i++)line([[204+i*23,379],[204+i*23,395]],'#796e57',2);line([[228,155],[246,192]],'#354f2f',7);line([[284,155],[266,192]],'#354f2f',7)}
 if(k==='spider'){
  for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[256,269],[256+Math.cos(a)*420,269+Math.sin(a)*420]],'#512533',4)}
  for(const r of [80,155,230,310]){x.beginPath();x.ellipse(256,269,r,r*1.12,0,0,Math.PI*2);x.strokeStyle='#512533';x.lineWidth=4;x.stroke()}
  for(const s of [-1,1])path([[256+s*41,248],[256+s*190,163],[256+s*169,294],[256+s*98,324]],'#eef6f7','#182531',15);
 }
 if(k==='armor'||k==='robot'||k==='vader'){
  x.fillStyle=c.color;x.fillRect(0,0,512,512);
  const gold=k==='armor'?'#ddba65':k==='vader'?'#343b45':'#a9bbc5';
  path([[91,38],[209,68],[303,68],[421,38],[461,230],[405,277],[390,415],[328,483],[184,483],[122,415],[107,277],[51,230]],gold,'#252e3b',9);
  path([[111,205],[213,228],[219,256],[124,244]],k==='vader'?'#101016':'#a9f5ff','#344351',7);
  path([[401,205],[299,228],[293,256],[388,244]],k==='vader'?'#101016':'#a9f5ff','#344351',7);
  if(k==='vader'){path([[256,283],[173,414],[339,414]],'#111620','#677681',5);for(let j=0;j<5;j++)line([[222+j*17,363],[222+j*17,403]],'#65727e',6)}
  else {line([[153,369],[196,395],[316,395],[359,369]],'#39414a',8);line([[183,445],[329,445]],'#fff4c470',5)}
  line([[113,80],[102,174]],'#ffffff60',5);line([[399,80],[410,174]],'#ffffff60',5);
 }
 if(['mask','bat','claws','helmet','luchador'].includes(k)){
  path([[120,315],[256,331],[392,315],[381,462],[256,505],[131,462]],c.skin);
  line([[215,418],[300,418]],'#65463e',7);
  for(const s of [-1,1])path([[256+s*55,238],[256+s*176,205],[256+s*145,260],[256+s*65,262]],'#ecf4ef','#222a36',7);
 }
 if(k==='maul'){for(const s of [-1,1]){path([[256+s*35,0],[256+s*115,0],[256+s*80,182],[256+s*170,133],[256+s*207,225],[256+s*89,214]],'#25232b');path([[256+s*202,288],[256+s*127,338],[256+s*150,417],[256+s*62,467],[256+s*212,488]],'#25232b')}path([[239,307],[273,307],[286,354],[256,365],[226,354]],'#25232b')}
 if(animal){
  const muzzle=k==='panda'?'#eee9db':k==='tortoise'?'#dbd1a7':k==='turtle'?'#99b574':'#d7bd93';
  ellipse(256,360,150,92,muzzle);ellipse(256,322,42,27,'#32302e');line([[256,345],[256,381],[218,397]],'#514334',6);line([[256,381],[297,397]],'#514334',6);
  if(k==='panda')for(const a of [151,361]){ellipse(a,233,80,68,'#282b32');ellipse(a,236,35,29,'#ece7dc');ellipse(a,236,17,24,'#574c37');ellipse(a,235,8,17,'#171c22');ellipse(a-6,228,5,6,'white')}
  if(k==='turtle'){x.fillStyle=c.accent;x.fillRect(0,183,512,101);eye(151,-1);eye(361,1)}
  if(['leopard','tiger','lion'].includes(k))for(const s of [-1,1])for(let j=0;j<3;j++)line([[256+s*151,285+j*23],[256+s*228,260+j*35]],'#4a3a32',8);
  if(n==='Oogway'){x.fillStyle=skin;x.fillRect(0,0,512,512);for(const a of [150,362]){ellipse(a,201,73,91,'#756f55');ellipse(a,228,58,47,'#e7e7dc');ellipse(a+7,237,18,28,'#344954');ellipse(a+9,237,9,19,'#111e26');line([[a-58,187],[a,167],[a+56,197]],'#c2b792',17)}line([[112,360],[180,393],[269,405],[364,378]],'#66533d',9);for(let j=0;j<3;j++)line([[221+j*23,131],[230+j*23,173]],'#8c815f',4)}
 }
 if(k==='flame'){for(const a of [153,359]){ellipse(a,244,75,57,'#382b25');ellipse(a,251,23,24,'#ff9c20')}path([[256,294],[226,345],[281,345]],'#3c3129');x.fillStyle='#40332a';x.fillRect(159,383,194,54);for(let i=0;i<7;i++){x.fillStyle='#e7d7b4';x.fillRect(164+i*27,388,19,37)}}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=2;textures.set(c.id,texture);return texture;
}

export function addPaintedFace(rig:T.Group,c:Fighter,lowDetail=false){
 if(typeof document==='undefined')return;
 // Remove the old floating eye/mouth blocks; keep silhouette, hair and ears.
 for(const child of [...rig.children]){
  if(!(child instanceof T.Mesh))continue;
  const p=child.position;
  if(p.y>1.47&&p.y<1.78&&p.z>.075&&Math.abs(p.x)<.23){rig.remove(child);child.geometry.dispose()}
 }
 const robot=['armor','robot','vader'].includes(c.model);
 const animal=['panda','leopard','lion','tiger','rat','monkey','fox','hedgehog','turtle','tortoise','bowser','ape','kaiju'].includes(c.model);
 const w=robot?.34:animal?.35:.285,h=robot?.37:animal?.32:.345;
 const geo=new T.PlaneGeometry(w,h,12,12);const pos=geo.attributes.position;
 // A shallow curved surface wraps the image around the head rather than a floating card.
 for(let i=0;i<pos.count;i++){const a=pos.getX(i)/(w/2),b=pos.getY(i)/(h/2);const taper=1-.21*Math.pow(Math.abs(b),6);pos.setX(i,pos.getX(i)*taper);pos.setZ(i,-.050*a*a-.015*b*b)}geo.computeVertexNormals();
 // Keep painted lines legible under the collection's bright studio lighting.
 const material=new T.MeshBasicMaterial({map:paint(c),toneMapped:false});
 const face=new T.Mesh(geo,material);face.name='painted-face-'+c.id;
 const covered=['spider','mask','bat','claws','luchador','helmet','maul','spiralmask'].includes(c.model);
 face.position.set(0,lowDetail?1.58:c.name==='Oogway'?1.73:1.615,robot?.238:animal?.215:covered?.204:.153);
 if(c.name==='Oogway')face.scale.set(.88,.77,1);
 rig.add(face);
}
