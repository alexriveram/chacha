import {env} from 'cloudflare:workers';
export function gameDb(){if(!env.DB)throw Error('Game storage is temporarily unavailable. Please retry.');return env.DB;}
