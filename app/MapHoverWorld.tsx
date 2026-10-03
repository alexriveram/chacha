"use client";
import {useEffect,useRef} from 'react';
import * as T from 'three';
import {MAPS} from '@/lib/game/maps';
import {buildScenery} from '@/lib/game/scenery';

export default function MapHoverWorld(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=host.current;if(!el||matchMedia('(pointer:coarse)').matches)return;
    let renderer:T.WebGLRenderer;
    try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{return}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.15));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;el.appendChild(renderer.domElement);
    const scene=new T.Scene();const camera=new T.PerspectiveCamera(42,1,.1,230);scene.add(new T.HemisphereLight('#e6efff','#35435c',2.7));const sun=new T.DirectionalLight('#fff0dc',3.4);sun.position.set(-25,55,32);scene.add(sun);
    let world:T.Group|null=null,active='',leaveTimer:ReturnType<typeof setTimeout>|undefined;
    const disposeWorld=()=>{if(world){scene.remove(world);world.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}if(o instanceof T.Sprite){o.material.map?.dispose();o.material.dispose()}});world=null}for(const child of [...scene.children])if(child instanceof T.Points){scene.remove(child);child.geometry.dispose();child.material.dispose()}};
    const activate=(id:string)=>{clearTimeout(leaveTimer);if(active===id)return;disposeWorld();active=id;el.dataset.active=id;world=buildScenery(scene,id);const positions:Record<string,[number,number,number]>={shibuya:[34,27,47],deathstar:[38,24,54],leaf:[32,29,51]};camera.position.set(...positions[id]);camera.lookAt(0,2,0)};
    const deactivate=()=>{clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{active='';delete el.dataset.active},120)};
    const cards=Array.from(document.querySelectorAll<HTMLElement>('.map-card'));const cleanup:Function[]=[];cards.forEach((card,i)=>{const enter=()=>activate(MAPS[i]?.id||MAPS[0].id);card.addEventListener('pointerenter',enter);card.addEventListener('focusin',enter);card.addEventListener('pointerleave',deactivate);card.addEventListener('focusout',deactivate);cleanup.push(()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('focusin',enter);card.removeEventListener('pointerleave',deactivate);card.removeEventListener('focusout',deactivate)})});
    const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight,false);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix()};resize();const ro=new ResizeObserver(resize);ro.observe(el);
    let frame=0;const tick=(time:number)=>{if(active){const base=active==='deathstar'?54:active==='leaf'?51:47;const angle=time*.000035;camera.position.x=Math.cos(angle)*34;camera.position.z=base+Math.sin(angle)*7;camera.lookAt(0,2,0);renderer.render(scene,camera)}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
    return()=>{clearTimeout(leaveTimer);cancelAnimationFrame(frame);cleanup.forEach(fn=>fn());ro.disconnect();disposeWorld();renderer.dispose();el.replaceChildren()};
  },[]);
  return <div ref={host} className="map-hover-world" aria-hidden="true"/>;
}
