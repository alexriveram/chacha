import {ROSTER} from '@/lib/game/roster';

const portraits=Object.fromEntries(ROSTER.map(fighter=>[fighter.id,`/portraits/${fighter.id}.webp`])) as Record<string,string>;

/** Static, locally cached character portraits keep the roster recognizable without creating 81 WebGL scenes. */
export function usePortraits(enabled:boolean){return enabled?portraits:{}}
