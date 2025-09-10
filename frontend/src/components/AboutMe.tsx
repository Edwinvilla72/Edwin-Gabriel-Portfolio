import React, { useEffect, useRef, useState } from "react";

export type LevelId = "about" | "projects" | "work" | "education" | "contact";

const LEVELS: Array<{ id: LevelId; title: string; details: React.ReactNode }> = [
  {
    id: "about",
    title: "W1-1  About",
    details: (
      <div>
        <p>
          I'm Edwin — UCF CS + AI software intern at Command Post Technologies. I
          love playful UIs, AI red-teaming, and shipping MERN/Python tools that
          feel like games.
        </p>
      </div>
    ),
  },
  { id: "projects", title: "W1-2  Projects", details: (
      <ul>
        <li><b>AIR-SHADE:</b> AI red-teaming + blue-team VM sim</li>
        <li><b>FitGame:</b> Fitness quests, XP, leaderboards</li>
        <li><b>Wii Portfolio:</b> 3D carousel + map UI</li>
      </ul>
  )},
  { id: "work", title: "W1-3  Work", details: <p><b>Command Post Technologies — AI Software Developer (Intern).</b></p> },
  { id: "education", title: "W1-4  Education", details: <p>University of Central Florida — B.S. Computer Science</p> },
  { id: "contact", title: "W1-Castle  Contact", details: (
      <ul>
        <li>Email: you@example.com</li>
        <li>GitHub: github.com/your-handle</li>
      </ul>
  )},
];

const POS_X = (i: number) => (i - (LEVELS.length - 1) / 2) * 3.6;

// ---------- tiny mat4 helpers ----------
function m4(){ return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); }
function m4mul(a: Float32Array, b: Float32Array){ const o=new Float32Array(16); for(let c=0;c<4;c++) for(let r=0;r<4;r++) o[c*4+r]=a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3]; return o; }
function m4translate(x:number,y:number,z:number){ const o=m4(); o[12]=x;o[13]=y;o[14]=z; return o; }
function m4scale(x:number,y:number,z:number){ const o=m4(); o[0]=x;o[5]=y;o[10]=z; return o; }
function m4rotY(a:number){ const c=Math.cos(a), s=Math.sin(a); return new Float32Array([c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1]); }
function m4persp(fov:number, aspect:number, near:number, far:number){ const f=1/Math.tan(fov/2), nf=1/(near-far); return new Float32Array([ f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0 ]); }
function m4lookAt(eye:[number,number,number],center:[number,number,number],up:[number,number,number]){
  const [ex,ey,ez]=eye,[cx,cy,cz]=center; let[ux,uy,uz]=up;
  let zx=ex-cx,zy=ey-cy,zz=ez-cz; const zl=1/Math.hypot(zx,zy,zz); zx*=zl; zy*=zl; zz*=zl;
  let xx=uy*zz-uz*zy,xy=uz*zx-ux*zz,xz=ux*zy-uy*zx; const xl=1/Math.hypot(xx,xy,xz); xx*=xl; xy*=xl; xz*=xl;
  let yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
  return new Float32Array([
    xx,yx,zx,0,  xy,yy,zy,0,  xz,yz,zz,0,
    -(xx*ex+xy*ey+xz*ez), -(yx*ex+yy*ey+yz*ez), -(zx*ex+zy*ey+zz*ez), 1
  ]);
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string){
  const compile = (type:number, src:string) => {
    const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)||"shader error");
    return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, `
    attribute vec3 position; attribute vec3 color;
    uniform mat4 uMVP; varying vec3 vColor;
    void main(){ vColor=color; gl_Position=uMVP*vec4(position,1.0); }
  `));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, `
    precision mediump float; varying vec3 vColor; uniform float uAlpha;
    void main(){ gl_FragColor=vec4(vColor,uAlpha); }
  `));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)||"link error");
  return prog;
}

function cubeMesh(size=1){
  const s=size/2;
  const p=[
    -s,-s, s,  s,-s, s,  s, s, s,  -s, s, s,
     s,-s,-s, -s,-s,-s, -s, s,-s,   s, s,-s,
    -s,-s,-s, -s,-s, s, -s, s, s,  -s, s,-s,
     s,-s, s,  s,-s,-s,  s, s,-s,   s, s, s,
    -s, s, s,  s, s, s,  s, s,-s,  -s, s,-s,
    -s,-s,-s,  s,-s,-s,  s,-s, s,  -s,-s, s
  ];
  const c=[
    ...Array(4).fill([0.85,0.93,0.99]).flat(),
    ...Array(4).fill([0.75,0.90,0.98]).flat(),
    ...Array(4).fill([0.70,0.88,0.96]).flat(),
    ...Array(4).fill([0.65,0.86,0.95]).flat(),
    ...Array(4).fill([0.92,0.98,1.00]).flat(),
    ...Array(4).fill([0.78,0.92,0.99]).flat(),
  ];
  const idx:number[]=[]; for(let f=0;f<6;f++){ const o=f*4; idx.push(o,o+1,o+2, o,o+2,o+3); }
  return {positions:new Float32Array(p), colors:new Float32Array(c), indices:new Uint16Array(idx)};
}

export default function WiiWorld3D(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const idxRef = useRef(0);
  const targetXRef = useRef(POS_X(0));
  useEffect(()=>{ idxRef.current=index; targetXRef.current=POS_X(index); }, [index]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true })!;
    const program = createProgram(gl, "", "");
    gl.useProgram(program);

    const cube = cubeMesh(1);
    const pos = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.bufferData(gl.ARRAY_BUFFER, cube.positions, gl.STATIC_DRAW);
    const col = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, col); gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW);
    const idx = gl.createBuffer()!; gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "position"); gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,0,0); gl.enableVertexAttribArray(aPos);
    const aCol = gl.getAttribLocation(program, "color");    gl.bindBuffer(gl.ARRAY_BUFFER, col); gl.vertexAttribPointer(aCol,3,gl.FLOAT,false,0,0); gl.enableVertexAttribArray(aCol);

    const uMVP   = gl.getUniformLocation(program, "uMVP");
    const uAlpha = gl.getUniformLocation(program, "uAlpha");

    const resize=()=>{ const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
      const w=canvas.clientWidth||canvas.parentElement!.clientWidth, h=canvas.clientHeight||canvas.parentElement!.clientHeight;
      canvas.width=Math.max(1,Math.floor(w*dpr)); canvas.height=Math.max(1,Math.floor(h*dpr)); gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize(); const ro=new ResizeObserver(resize); ro.observe(canvas);

    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);  gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let t=0, camX=POS_X(0), playerX=POS_X(0);
    const MOVE_GAIN=4, CAM_GAIN=4, GROUND_ALPHA=0.3
    const BASE_SCALE=1.2, BASE_HEIGHT=0.6, HIGHLIGHT_SCALE=1.55, HIGHLIGHT_HEIGHT=0.85, SCALE_GAIN=10;
    const pedScale=new Float32Array(LEVELS.length).fill(BASE_SCALE);
    const pedHeight=new Float32Array(LEVELS.length).fill(BASE_HEIGHT);

    let prev=performance.now();
    const render=()=>{
      const now=performance.now(); const dt=Math.max(0.001,Math.min(0.05,(now-prev)/1000)); prev=now; t+=dt;
      const targetX=targetXRef.current;
      const aMove=1-Math.exp(-MOVE_GAIN*dt), aCam=1-Math.exp(-CAM_GAIN*dt);
      playerX+=(targetX-playerX)*aMove; camX+=(playerX-camX)*aCam;

      const sA=1-Math.exp(-SCALE_GAIN*dt);
      for(let k=0;k<LEVELS.length;k++){ const sel=k===idxRef.current;
        const tS=sel?HIGHLIGHT_SCALE:BASE_SCALE, tH=sel?HIGHLIGHT_HEIGHT:BASE_HEIGHT;
        pedScale[k]+= (tS-pedScale[k])*sA; pedHeight[k]+= (tH-pedHeight[k])*sA;
      }

      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const aspect=canvas.width/canvas.height;
      const P=m4persp(Math.PI/4,aspect,0.1,100);
      const V=m4lookAt([camX,2.2,7],[camX,0.6,0],[0,1,0]);

      // ground
      let M=m4mul(m4translate(0,-0.6,0), m4scale(20,0.2,20));
      let MVP=m4mul(m4mul(P,V),M);
      gl.uniformMatrix4fv(uMVP,false,MVP); gl.uniform1f(uAlpha,GROUND_ALPHA);
      gl.drawElements(gl.TRIANGLES,cube.indices.length,gl.UNSIGNED_SHORT,0);

      // pedestals
      gl.uniform1f(uAlpha,1.0);
      for(let k=0;k<LEVELS.length;k++){
        const x=POS_X(k); const z=-1; const y=0;
        M=m4mul(m4translate(x,y,z), m4scale(pedScale[k],pedHeight[k],pedScale[k]));
        MVP=m4mul(m4mul(P,V),M);
        gl.uniformMatrix4fv(uMVP,false,MVP);
        gl.drawElements(gl.TRIANGLES,cube.indices.length,gl.UNSIGNED_SHORT,0);
      }

      // player
      M=m4mul(m4translate(playerX,0.2,2), m4mul(m4rotY(t*0.8), m4scale(0.6,0.9,0.6)));
      MVP=m4mul(m4mul(P,V),M);
      gl.uniformMatrix4fv(uMVP,false,MVP); gl.uniform1f(uAlpha,1.0);
      gl.drawElements(gl.TRIANGLES,cube.indices.length,gl.UNSIGNED_SHORT,0);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const onClick=(e:MouseEvent)=>{
      const rect=canvas.getBoundingClientRect();
      const xN=((e.clientX-rect.left)/rect.width)*2-1;
      const aspect=canvas.width/canvas.height; const scale=Math.tan(Math.PI/8)*7;
      const worldX=camX+xN*scale*aspect;
      let best=0,dBest=Infinity;
      for(let k=0;k<LEVELS.length;k++){ const d=Math.abs(POS_X(k)-worldX); if(d<dBest){ dBest=d; best=k; } }
      idxRef.current=best; targetXRef.current=POS_X(best); setIndex(best);
    };
    canvas.addEventListener("click", onClick);
    return ()=>{ ro.disconnect(); canvas.removeEventListener("click", onClick); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex(k => { const v=Math.min(LEVELS.length-1,k+1); idxRef.current=v; targetXRef.current=POS_X(v); return v; });
      if (e.key === "ArrowLeft")  setIndex(k => { const v=Math.max(0,k-1); idxRef.current=v; targetXRef.current=POS_X(v); return v; });
      if (e.key === "Enter") setOpen(true);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mapWrap">
      <div className="mapBg" />
      <canvas ref={canvasRef} className="mapGL" />

      {/* Back to main menu (top-left) */}
      <button className="backBtn glass" onClick={() => window.history.back()} aria-label="Back to main menu">
        ← Main Menu
      </button>

      {/* HUD (bottom-center) */}
      <div className="mapHud glass">
        <div className="mapTitle">{LEVELS[index].title}</div>

        {/* Force 3 columns so buttons never overlap */}
        <div className="mapButtons">
          <button
            aria-label="Previous level"
            onClick={() => setIndex(k => { const v=Math.max(0,k-1); idxRef.current=v; targetXRef.current=POS_X(v); return v; })}
          >
            ← Prev
          </button>
          <button className="primary" onClick={() => setOpen(true)}>Open</button>
          <button
            aria-label="Next level"
            onClick={() => setIndex(k => { const v=Math.min(LEVELS.length-1,k+1); idxRef.current=v; targetXRef.current=POS_X(v); return v; })}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="mapModal" onClick={() => setOpen(false)}>
          <div className="mapCard pop glassStrong" onClick={(e)=>e.stopPropagation()}>
            <header className="cardHead">
              <span className="flag" aria-hidden />
              <h2 className="cardTitle">{LEVELS[index].title}</h2>
              <button className="mapClose" onClick={() => setOpen(false)} aria-label="Close">Close</button>
            </header>
            <div className="cardBody">{LEVELS[index].details}</div>
          </div>
        </div>
      )}

      <style>{`
        :root{
          --ink:#053b4b;
          --glass: rgba(255,255,255,.28);
          --glass-brd: rgba(255,255,255,.38);
          --safe-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
        }

        .mapWrap{ position:fixed; inset:0; z-index:50; overflow:hidden; }
        .mapGL{ position:absolute; inset:0; width:100%; height:100%; display:block; z-index:10; }

        .mapBg{ position:absolute; inset:0; z-index:0; background:url('/Images/FruAero.png') center/cover no-repeat;
          filter:saturate(1.05) hue-rotate(8deg); }

        .glass{ background: var(--glass); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border:1px solid var(--glass-brd); box-shadow: 0 10px 30px #0002; }

        /* Back button */
        .backBtn{
          position:fixed; top:16px; left:16px; z-index:45;
          padding:8px 12px; border-radius:12px; border:0; color:var(--ink);
          font-weight:800;
        }

        /* HUD */
        .mapHud{
          position:fixed; left:50%; transform:translateX(-50%);
          bottom: var(--safe-bottom); width: min(960px, 96vw);
          padding: 12px 14px; border-radius: 16px; z-index: 40; color: var(--ink);
          display:grid; grid-template-columns: 1fr auto; align-items:center; gap:10px;
        }
        .mapTitle{ font-weight:900; letter-spacing:0; text-shadow:0 1px 0 #fff; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* Force three columns to prevent overlap */
        .mapButtons{
          display:grid;
          grid-template-columns: repeat(3, minmax(110px, max-content));
          justify-content:end;
          align-items:center;
          gap:8px;
        }
        .mapButtons button{
          padding:8px 12px; border-radius:12px; border:0; background:#ffffffcc; color:var(--ink);
          font-weight:700; box-shadow: inset 0 1px 0 #fff8; line-height:1.1;
        }
        .mapButtons .primary{ background:linear-gradient(#fff,#e5f6ff); }

        /* Smaller screens: stack 2 per row then 1 */
        @media (max-width: 600px){
          .mapHud{ width:min(720px,94vw); grid-template-columns: 1fr; row-gap:8px; padding:10px 12px; }
          .mapButtons{ grid-template-columns: repeat(2, minmax(100px, 1fr)); }
          .mapButtons button:nth-child(3){ grid-column: 1 / -1; } /* center last button */
        }

        /* Modal */
        .mapModal{ position:fixed; inset:0; z-index:60; display:grid; place-items:center; background:#0a3d5e55; animation:fadeIn 140ms ease-out; padding: 20px; }
        .mapCard{ width:min(680px, 100%); border-radius:18px; box-shadow:0 18px 60px #0005; overflow:hidden; }

        .cardHead{
          display:grid; grid-template-columns: 20px 1fr auto;
          align-items:center; gap:12px;
          padding:16px 20px; /* more inset so Close isn't hugging edge */
          background:linear-gradient(180deg,#f3fbff,#e5f6ff); color:var(--ink);
        }
        .cardTitle{
          margin:0; font-size:1.25rem; font-weight:800; letter-spacing:0;
          font-kerning:normal; font-feature-settings:'kern' 1;
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }
        .mapClose{
          padding:6px 12px; border-radius:10px; border:0; background:#ffffffcc; color:var(--ink);
          font-weight:700; line-height:1; justify-self:end; margin-right:6px; /* small left shift from edge */
        }
        .flag{ width:16px; height:16px; background:#00d180; clip-path:polygon(0 0, 100% 30%, 0 60%); filter: drop-shadow(0 1px 0 #fff); }
        .cardBody{ padding:16px; color:#063b5c; background:linear-gradient(180deg,#f3fbff,#e9f8ff); letter-spacing:0; font-kerning:normal; font-feature-settings:'kern' 1; }

        .pop{ animation: popIn 180ms cubic-bezier(.2,1.2,.2,1); }
        @keyframes fadeIn{ from{opacity:0} to{opacity:1} }
        @keyframes popIn{ 0%{ transform:scale(.9); opacity:0 } 60%{ transform:scale(1.03); opacity:1 } 100%{ transform:scale(1) } }
      `}</style>
    </div>
  );
}
