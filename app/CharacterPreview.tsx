"use client";
import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {Fighter,FIGHTER_SCENES,WORLD_SCENES} from '@/lib/game/roster';
import {makeFighter,animateFighter} from '@/lib/game/models';
import {batchMeshes,disposeObject} from '@/lib/game/rendering';
const PAINTED_WORLDS:Record<string,[string,string]>={
 shibuya:['/arena-atlas.png','0% 0%'],deathstar:['/arena-atlas.png','100% 0%'],leaf:['/arena-atlas.png','0% 100%'],jade:['/arena-atlas.png','100% 100%'],
 manhattan:['/world-atlas-city.jpg','0% 0%'],metropolis:['/world-atlas-city.jpg','0% 0%'],centralcity:['/world-atlas-city.jpg','0% 0%'],city:['/world-atlas-city.jpg','0% 0%'],mansion:['/world-atlas-city.jpg','0% 0%'],gotham:['/world-atlas-city.jpg','100% 0%'],genosha:['/world-atlas-city.jpg','100% 0%'],ring:['/world-atlas-city.jpg','0% 100%'],palace:['/world-atlas-city.jpg','100% 100%'],
 sewer:['/world-atlas-classic.jpg','0% 0%'],dojo:['/world-atlas-classic.jpg','0% 0%'],mushroom:['/world-atlas-classic.jpg','100% 0%'],greenhill:['/world-atlas-classic.jpg','0% 100%'],cybertron:['/world-atlas-classic.jpg','100% 100%'],reactor:['/world-atlas-classic.jpg','100% 100%'],
 wall:['/world-atlas-epic.jpg','0% 0%'],tournament:['/world-atlas-epic.jpg','100% 0%'],ruins:['/world-atlas-epic.jpg','0% 100%'],jungle:['/world-atlas-epic.jpg','100% 100%'],forest:['/world-atlas-epic.jpg','100% 100%'],swamp:['/world-atlas-epic.jpg','100% 100%'],titan:['/world-atlas-epic.jpg','100% 100%'],
 cosmic:['/world-atlas-mythic.jpg','0% 0%'],hell:['/world-atlas-mythic.jpg','100% 0%'],mustafar:['/world-atlas-mythic.jpg','100% 0%'],asgard:['/world-atlas-mythic.jpg','0% 100%'],desert:['/world-atlas-mythic.jpg','100% 100%']
};
export default function CharacterPreview({fighter,fullStage=false,alignRight=false,backgroundImage}:{fighter:Fighter;fullStage?:boolean;alignRight?:boolean;backgroundImage?:string}){
 const host=useRef<HTMLDivElement>(null),runtime=useRef<{renderer:T.WebGLRenderer;scene:T.Scene;camera:T.PerspectiveCamera;model:T.Group|null;rim:T.DirectionalLight;frame:()=>void}|null>(null);
 const [closeup,setCloseup]=useState(!fullStage);
 useEffect(()=>{const el=host.current;if(!el)return;let renderer:T.WebGLRenderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance',stencil:false})}catch{return}
 // Only one showcase canvas is visible, so it can spend more pixels on faces
 // without affecting the much heavier 24-player match renderer.
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;el.appendChild(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,150);scene.add(new T.HemisphereLight('#eaf3ff','#485064',3));const key=new T.DirectionalLight('#fff1da',4);key.position.set(4,9,7);scene.add(key);const rim=new T.DirectionalLight('#fff',3);rim.position.set(-4,4,-3);scene.add(rim);
 const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight,false);camera.aspect=el.clientWidth/el.clientHeight;camera.setViewOffset(el.clientWidth,el.clientHeight,fullStage&&alignRight&&el.clientWidth>800?el.clientWidth*-.19:0,0,el.clientWidth,el.clientHeight);camera.updateProjectionMatrix()};resize();const ro=new ResizeObserver(resize);ro.observe(el);
 const state={renderer,scene,camera,model:null as T.Group|null,rim,frame:resize};runtime.current=state;let frame=0,last=0,visible=true;const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting});io.observe(el);
 const tick=(t:number)=>{if(visible&&!document.hidden&&state.model&&t-last>=1000/30){last=t;state.model.rotation.y=Math.sin(t*.0002)*.24-.14;animateFighter(state.model,t*.001,0);renderer.render(scene,camera)}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
 return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();if(state.model)disposeObject(state.model);renderer.dispose();renderer.forceContextLoss();runtime.current=null;el.replaceChildren()};
 },[fullStage,alignRight]);
 useEffect(()=>{const state=runtime.current,el=host.current;if(!state||!el)return;const timer=setTimeout(()=>{if(state.model){state.scene.remove(state.model);disposeObject(state.model)}const model=makeFighter(fighter);batchMeshes(model);state.model=model;state.scene.add(model);state.rim.color.set(fighter.accent);
 const theme=(FIGHTER_SCENES[fighter.id]||WORLD_SCENES[fighter.world])?.scene||'city';const painted=PAINTED_WORLDS[theme]||PAINTED_WORLDS.city;
 el.style.backgroundImage=backgroundImage?`url('${backgroundImage}')`:`linear-gradient(0deg,#21122e99,transparent 75%),url('${painted[0]}')`;el.style.backgroundSize=backgroundImage?'cover':'100% 100%,200% 200%';el.style.backgroundPosition=backgroundImage?'center':'center,'+painted[1];
 const h=fighter.height;state.camera.position.set(h*(closeup?.20:fullStage?0:.65),h*(closeup?.87:.82),h*(closeup?1.3:fullStage?2.9:2.5));state.camera.lookAt(0,h*(closeup?.67:fullStage?.40:.54),0);state.frame();},90);return()=>clearTimeout(timer);
 },[fighter,closeup,backgroundImage,fullStage,alignRight]);
 return <><div ref={host} className="character-render" aria-label={`3D preview of ${fighter.name}`}/><button className="preview-framing" onClick={()=>setCloseup(!closeup)} aria-pressed={closeup}>{closeup?'Full fighter ↗':'Face detail ↗'}</button></>;
}
