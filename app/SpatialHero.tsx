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

export default function SpatialHero(){
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
    gl.uniform1i(gl.getUniformLocation(program,'u_image'),0);gl.uniform1i(gl.getUniformLocation(program,'u_depth'),1);gl.uniform1f(gl.getUniformLocation(program,'u_strength'),.047);gl.uniform1f(gl.getUniformLocation(program,'u_zoom'),1.07);

    let stopped=false,visible=true,raf=0,targetX=0,targetY=0,currentX=0,currentY=0,textures:WebGLTexture[]=[];
    const resize=()=>{const rect=el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.35),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));if(node.width!==width||node.height!==height){node.width=width;node.height=height;gl.viewport(0,0,width,height);gl.uniform2f(resolution,width,height)}};
    const draw=()=>{raf=0;if(stopped||!visible||document.hidden)return;resize();currentX+=(targetX-currentX)*.075;currentY+=(targetY-currentY)*.075;gl.uniform2f(pointer,currentX,currentY);gl.drawArrays(gl.TRIANGLES,0,6);if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.002)raf=requestAnimationFrame(draw)};
    const requestDraw=()=>{if(!raf&&!stopped)raf=requestAnimationFrame(draw)};
    const move=(event:PointerEvent)=>{const rect=el.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));targetY=Math.max(-1,Math.min(1,-((event.clientY-rect.top)/rect.height*2-1)));requestDraw()};
    const tilt=(event:DeviceOrientationEvent)=>{if(event.gamma==null||event.beta==null)return;targetX=Math.max(-1,Math.min(1,event.gamma/24));targetY=Math.max(-1,Math.min(1,(event.beta-45)/30));requestDraw()};
    const load=(url:string,unit:number)=>new Promise<WebGLTexture>((resolve,reject)=>{const texture=gl.createTexture(),image=new Image();if(!texture){reject(new Error('Texture unavailable'));return}image.onload=()=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);resolve(texture)};image.onerror=()=>reject(new Error(`Could not load ${url}`));image.src=url});
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)requestDraw()},{threshold:.02});observer.observe(el);
    const onResize=()=>requestDraw();
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('deviceorientation',tilt,true);window.addEventListener('resize',onResize,{passive:true});
    Promise.all([load('/spatial/spatial-image-4k.jpg',0),load('/spatial/depth-map.png',1)]).then(values=>{if(stopped){values.forEach(value=>gl.deleteTexture(value));return}textures=values;node.classList.add('ready');requestDraw()}).catch(error=>console.warn('Spatial hero assets unavailable',error));
    return()=>{stopped=true;if(raf)cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('deviceorientation',tilt,true);window.removeEventListener('resize',onResize);textures.forEach(value=>gl.deleteTexture(value));if(buffer)gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
  },[]);

  return <div ref={host} className="home-fighter opening-forest spatial-hero"><img src="/spatial/spatial-image-4k.jpg" alt="A smiling sloth hanging in a bright fantasy forest" fetchPriority="high"/><canvas ref={canvas} className="spatial-canvas" aria-hidden="true"/></div>;
}
