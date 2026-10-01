"use client";
import {useEffect,useRef} from 'react';
import * as T from 'three';
import {FIGHTERS,TEAM_COLORS} from '@/lib/game/roster';
import {makeFighter,animateFighter} from '@/lib/game/models';

export default function HomeHero3D(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=host.current;if(!el)return;
    const coarse=matchMedia('(pointer:coarse)').matches;
    let renderer:T.WebGLRenderer;
    try{renderer=new T.WebGLRenderer({alpha:true,antialias:!coarse,powerPreference:'high-performance'});}catch{return}
    renderer.setPixelRatio(Math.min(devicePixelRatio,coarse?1:1.25));
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.outputColorSpace=T.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,3.7,12.5);
    scene.add(new T.HemisphereLight('#fff8ff','#8d79bb',3.2));
    const key=new T.DirectionalLight('#fff4fb',5);key.position.set(5,8,8);scene.add(key);
    const rim=new T.DirectionalLight('#9edcff',4);rim.position.set(-6,4,-2);scene.add(rim);
    const group=new T.Group();scene.add(group);
    const fighter=makeFighter(FIGHTERS['gojo']);fighter.scale.setScalar(1.16);fighter.position.y=-2.65;group.add(fighter);
    const glass=new T.MeshPhysicalMaterial({color:'#d8c9ff',roughness:.13,metalness:.04,transmission:.38,thickness:1.4,transparent:true,opacity:.82,iridescence:.45,iridescenceIOR:1.55});
    const portal=new T.Mesh(new T.TorusGeometry(3.42,.2,18,96),glass);portal.rotation.x=.09;portal.position.y=.25;group.add(portal);
    const portal2=new T.Mesh(new T.TorusGeometry(4.02,.035,8,96),new T.MeshBasicMaterial({color:'#ffd3e9',transparent:true,opacity:.66}));portal2.rotation.set(.08,.22,.04);portal2.position.y=.25;group.add(portal2);
    const platform=new T.Mesh(new T.CylinderGeometry(2.8,3.25,.34,64),new T.MeshPhysicalMaterial({color:'#efe8ff',roughness:.18,metalness:.08,transmission:.18,clearcoat:1,clearcoatRoughness:.1}));platform.position.y=-2.62;group.add(platform);
    const platformRing=new T.Mesh(new T.TorusGeometry(2.95,.08,12,64),new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.9}));platformRing.rotation.x=Math.PI/2;platformRing.position.y=-2.42;group.add(platformRing);
    const orbGeometry=new T.SphereGeometry(.34,24,24);
    const orbs=TEAM_COLORS.map((color,i)=>{const material=new T.MeshPhysicalMaterial({color,roughness:.12,metalness:.08,transmission:.18,clearcoat:1,emissive:new T.Color(color),emissiveIntensity:.08});const orb=new T.Mesh(orbGeometry,material);const a=i*Math.PI/2+.55;orb.position.set(Math.cos(a)*4.25,(i%2?1.5:-.1),Math.sin(a)*1.1);group.add(orb);return orb});
    const shards:Array<T.Mesh>=[];
    for(let i=0;i<10;i++){const shard=new T.Mesh(new T.OctahedronGeometry(.13+i%3*.05,0),new T.MeshPhysicalMaterial({color:i%2?'#f7bddc':'#b8ddf5',roughness:.18,metalness:.12,clearcoat:1}));const a=i/10*Math.PI*2;shard.position.set(Math.cos(a)*(4.2+(i%2)*.45),-1.8+(i%5)*.85,Math.sin(a)*1.8);group.add(shard);shards.push(shard)}
    const pointer={x:0,y:0};const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5};el.addEventListener('pointermove',move,{passive:true});
    const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight,false);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix()};resize();const ro=new ResizeObserver(resize);ro.observe(el);
    let frame=0,visible=true;const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});io.observe(el);
    const tick=(time:number)=>{if(visible&&!document.hidden){const t=time*.001;group.rotation.y+=(pointer.x*.16-group.rotation.y)*.035;group.rotation.x+=(-pointer.y*.07-group.rotation.x)*.035;portal.rotation.z=t*.1;portal2.rotation.z=-t*.075;orbs.forEach((orb,i)=>{orb.position.y=(i%2?1.35:-.15)+Math.sin(t*1.35+i)*.22;orb.scale.setScalar(1+Math.sin(t*2+i)*.08)});shards.forEach((shard,i)=>{shard.rotation.x=t*(.25+i*.015);shard.rotation.y=t*(.35+i*.02)});animateFighter(fighter,t,0);renderer.render(scene,camera)}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);renderer.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});el.replaceChildren()};
  },[]);
  return <div ref={host} className="home-hero-3d" aria-hidden="true"/>;
}
