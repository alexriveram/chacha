"use client";

import {useEffect,useRef} from 'react';

const VERTEX=`
attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}
`;

const FRAGMENT=`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2 u_pointer;
uniform vec2 u_resolution;
uniform float u_strength;
uniform float u_zoom;
vec2 coverUV(vec2 uv,vec2 texSize,vec2 viewport){
  float texAspect=texSize.x/texSize.y;
  float viewAspect=viewport.x/viewport.y;
  vec2 outUV=uv;
  if(viewAspect>texAspect){float scale=texAspect/viewAspect;outUV.y=(uv.y-.5)*scale+.5;}
  else{float scale=viewAspect/texAspect;outUV.x=(uv.x-.5)*scale+.5;}
  return outUV;
}
void main(){
  vec2 uv=coverUV(v_uv,vec2(3840.0,2160.0),u_resolution);
  uv=(uv-.5)/u_zoom+.5;
  float depth=texture2D(u_depth,uv).r;
  vec2 displaced=uv-u_pointer*(depth-.22)*u_strength;
  vec4 nearColor=texture2D(u_image,displaced);
  vec4 softColor=texture2D(u_image,mix(uv,displaced,.55));
  vec3 color=mix(softColor.rgb,nearColor.rgb,.82)*(0.985+depth*.03);
  gl_FragColor=vec4(color,1.0);
}
`;

type SpatialHeroProps={
  image?:string;
  depth?:string;
  alt?:string;
  className?:string;
  strength?:number;
  eager?:boolean;
};

export default function SpatialHero({
  image='/spatial/spatial-image-4k.jpg',
  depth='/spatial/depth-map.png',
  alt='A smiling sloth hanging in a bright fantasy forest',
  className='home-fighter opening-forest',
  strength=.047,
  eager=true,
}:SpatialHeroProps){
  const host=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const el=host.current,node=canvas.current;
    if(!el||!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const gl=node.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
    if(!gl)return;

    const shader=(type:number,source:string)=>{const value=gl.createShader(type);if(!value)throw new Error('WebGL shader unavailable');gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(value)||'Shader compilation failed';gl.deleteShader(value);throw new Error(message)}return value};
    let vertex:WebGLShader,fragment:WebGLShader,program:WebGLProgram;
    try{
      vertex=shader(gl.VERTEX_SHADER,VERTEX);fragment=shader(gl.FRAGMENT_SHADER,FRAGMENT);
      const value=gl.createProgram();if(!value)throw new Error('WebGL program unavailable');program=value;
      gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'WebGL link failed');
    }catch(error){console.warn('Spatial hero disabled',error);return}
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const pointer=gl.getUniformLocation(program,'u_pointer'),resolution=gl.getUniformLocation(program,'u_resolution');
    gl.uniform1i(gl.getUniformLocation(program,'u_image'),0);gl.uniform1i(gl.getUniformLocation(program,'u_depth'),1);gl.uniform1f(gl.getUniformLocation(program,'u_strength'),strength);gl.uniform1f(gl.getUniformLocation(program,'u_zoom'),1.07);

    let stopped=false,visible=false,loading=false,loaded=false,raf=0,releaseTimer=0,targetX=0,targetY=0,currentX=0,currentY=0,textures:WebGLTexture[]=[];
    const resize=()=>{const rect=el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.35),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));if(node.width!==width||node.height!==height){node.width=width;node.height=height;gl.viewport(0,0,width,height);gl.uniform2f(resolution,width,height)}};
    const draw=()=>{raf=0;if(stopped||!visible||!loaded||document.hidden)return;resize();currentX+=(targetX-currentX)*.075;currentY+=(targetY-currentY)*.075;gl.uniform2f(pointer,currentX,currentY);gl.drawArrays(gl.TRIANGLES,0,6);if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.002)raf=requestAnimationFrame(draw)};
    const requestDraw=()=>{if(!raf&&!stopped&&loaded)raf=requestAnimationFrame(draw)};
    const move=(event:PointerEvent)=>{const rect=el.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));targetY=Math.max(-1,Math.min(1,-((event.clientY-rect.top)/rect.height*2-1)));requestDraw()};
    const tilt=(event:DeviceOrientationEvent)=>{if(event.gamma==null||event.beta==null)return;targetX=Math.max(-1,Math.min(1,event.gamma/24));targetY=Math.max(-1,Math.min(1,(event.beta-45)/30));requestDraw()};
    const load=(url:string,unit:number)=>new Promise<WebGLTexture>((resolve,reject)=>{const texture=gl.createTexture(),source=new Image();if(!texture){reject(new Error('Texture unavailable'));return}source.onload=()=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);resolve(texture)};source.onerror=()=>{gl.deleteTexture(texture);reject(new Error(`Could not load ${url}`))};source.src=url});
    const loadAssets=()=>{if(loading||loaded||stopped)return;loading=true;Promise.all([load(image,0),load(depth,1)]).then(values=>{loading=false;if(stopped){values.forEach(value=>gl.deleteTexture(value));return}textures=values;loaded=true;node.classList.add('ready');requestDraw()}).catch(error=>{loading=false;console.warn('Spatial hero assets unavailable',error)})};
    const releaseAssets=()=>{if(!loaded)return;textures.forEach(value=>gl.deleteTexture(value));textures=[];loaded=false;node.classList.remove('ready')};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){if(releaseTimer)window.clearTimeout(releaseTimer);loadAssets();requestDraw()}else if(loaded){releaseTimer=window.setTimeout(()=>{if(!visible&&!stopped)releaseAssets()},1500)}},{threshold:.02});observer.observe(el);
    const onResize=()=>requestDraw();
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('deviceorientation',tilt,true);window.addEventListener('resize',onResize,{passive:true});
    return()=>{stopped=true;if(raf)cancelAnimationFrame(raf);if(releaseTimer)window.clearTimeout(releaseTimer);observer.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('deviceorientation',tilt,true);window.removeEventListener('resize',onResize);releaseAssets();if(buffer)gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
  },[image,depth,strength]);

  return <div ref={host} className={`${className} spatial-hero`}><img src={image} alt={alt} fetchPriority={eager?'high':undefined} loading={eager?'eager':'lazy'}/><canvas ref={canvas} className="spatial-canvas" aria-hidden="true"/></div>;
}
