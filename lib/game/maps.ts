export type Obstacle={x:number;z:number;w:number;d:number;h:number;style:string};
export const MAPS=[{id:'shibuya',name:'Shibuya Crossing',tag:'TOKYO / NIGHTFALL',description:'Neon streets. Tight corners. Fight for the crossing.',tint:'#263951',sky:'#101929',ground:'#28313f',atlas:'0% 0%'},{id:'deathstar',name:'Death Star Hangar',tag:'OUTER RIM / ORBITAL',description:'Cargo cover. Open firing lanes. Control the hangar.',tint:'#4e687d',sky:'#080f20',ground:'#465362',atlas:'100% 0%'},{id:'leaf',name:'Hidden Leaf Village',tag:'LAND OF FIRE / SUNSET',description:'Village lanes. Rooftop silhouettes. Defend the Leaf.',tint:'#bf8862',sky:'#d6a275',ground:'#b8956b',atlas:'0% 100%'}];
export const POINTS=[{id:'A',x:-24,z:-12},{id:'B',x:0,z:8},{id:'C',x:24,z:-12}];
export const SPAWNS=[{x:-43,z:38},{x:43,z:38},{x:-43,z:-38},{x:43,z:-38}];
export function obstacles(map:string):Obstacle[]{
 const result:Obstacle[]=[];const add=(x:number,z:number,w:number,d:number,h:number,style:string)=>result.push({x,z,w,d,h,style});
 if(map==='shibuya'){for(const x of [-37,-15,15,37]){add(x,-28,12,12,18+Math.abs(x)*.4,'building');add(x,28,12,10,14+Math.abs(x)*.5,'building')}add(-14,-5,5,6,3,'bus');add(15,8,5,8,3,'bus');add(0,-30,5,5,4,'kiosk');}
 if(map==='deathstar'){for(const x of [-30,30])for(const z of [-26,24])add(x,z,13,7,5,'ship');for(const x of [-13,13]){add(x,-8,5,6,3,'crate');add(x,15,5,6,3,'crate')}add(0,-29,9,6,5,'console');}
 if(map==='leaf'){for(const x of [-36,-13,13,36]){add(x,-29,11,10,7+Math.abs(x)/8,'house');add(x,29,10,9,7+Math.abs(x)/10,'house')}add(-12,0,6,7,6,'house');add(13,-3,6,7,6,'house');add(0,-27,7,7,8,'house');}
 return result;
}
export function canStand(x:number,z:number,map:string,r=.8,flight=false){if(Math.abs(x)>49-r||Math.abs(z)>45-r)return false;return !obstacles(map).some(o=>Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r&&(!flight||o.h>6));}
export function lineClear(x:number,z:number,tx:number,tz:number,map:string,flight=false){const dist=Math.hypot(tx-x,tz-z),n=Math.ceil(dist);for(let i=1;i<n;i++)if(!canStand(x+(tx-x)*i/n,z+(tz-z)*i/n,map,.1,flight))return false;return true;}
