"use client";
import {useEffect,useRef} from 'react';
import {MAPS} from '@/lib/game/maps';

export default function MapHoverWorld(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=host.current;if(!el)return;
    let leaveTimer:ReturnType<typeof setTimeout>|undefined;
    const activate=(id:string)=>{clearTimeout(leaveTimer);el.dataset.active=id};
    const deactivate=()=>{clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>delete el.dataset.active,90)};
    const cards=Array.from(document.querySelectorAll<HTMLElement>('.map-card'));
    const cleanup:(()=>void)[]=[];
    cards.forEach((card,i)=>{
      const enter=()=>activate(MAPS[i]?.id||MAPS[0].id);
      card.addEventListener('pointerenter',enter);card.addEventListener('focusin',enter);
      card.addEventListener('pointerleave',deactivate);card.addEventListener('focusout',deactivate);
      cleanup.push(()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('focusin',enter);card.removeEventListener('pointerleave',deactivate);card.removeEventListener('focusout',deactivate)});
    });
    return()=>{clearTimeout(leaveTimer);cleanup.forEach(fn=>fn())};
  },[]);
  return <div ref={host} className="map-hover-world" aria-hidden="true"/>;
}
