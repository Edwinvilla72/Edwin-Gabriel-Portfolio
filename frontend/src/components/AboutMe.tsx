import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/aboutMe.css";

export type LevelId = "about" | "projects" | "work" | "education" | "contact";

type Level = {
  id: LevelId;
  title: string;
  details: React.ReactNode;
};

const LEVELS: Level[] = [
  {
    id: "about",
    title: "About",
    details: (
      <p>
        I am Edwin, a Computer Science student at UCF and an AI Software Engineering
        Intern at Command Post Technologies. I build practical AI and web experiences
        with a focus on reliability, performance, and clean interaction design.
      </p>
    )
  },
  {
    id: "projects",
    title: "Projects",
    details: (
      <ul className="about-list">
        <li>
          <b>SHADE:</b> Realistic human-like network traffic generation.
        </li>
        <li>
          <b>FitGame:</b> Gamified fitness tracker with quests, XP, and leaderboards.
        </li>
        <li>
          <b>Personal Portfolio:</b> Interactive 3D carousel and map UI.
        </li>
        <li>
          <b>Legacy Site:</b> Earlier portfolio at edwinvilla72.github.io.
        </li>
      </ul>
    )
  },
  {
    id: "work",
    title: "Work",
    details: (
      <>
        <p>
          <b>Command Post Technologies - AI Software Engineer Intern</b>
        </p>
        <p>
          I design and evaluate AI agent workflows, internal tooling, and automation
          systems that support engineering execution.
        </p>
      </>
    )
  },
  {
    id: "education",
    title: "Education",
    details: <p>University of Central Florida - B.S. in Computer Science</p>
  },
  {
    id: "contact",
    title: "Contact",
    details: (
      <ul className="about-list">
        <li>
          Email: <a href="mailto:edwin.villa2@icloud.com">edwin.villa2@icloud.com</a>
        </li>
        <li>
          GitHub:{" "}
          <a href="https://github.com/Edwinvilla72" target="_blank" rel="noreferrer">
            github.com/Edwinvilla72
          </a>
        </li>
      </ul>
    )
  }
];

const POS_X = (i: number) => (i - (LEVELS.length - 1) / 2) * 3.6;

function m4() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function m4mul(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      o[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return o;
}

function m4translate(x: number, y: number, z: number) {
  const o = m4();
  o[12] = x;
  o[13] = y;
  o[14] = z;
  return o;
}

function m4scale(x: number, y: number, z: number) {
  const o = m4();
  o[0] = x;
  o[5] = y;
  o[10] = z;
  return o;
}

function m4rotY(a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
}

function m4persp(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0
  ]);
}

function m4lookAt(
  eye: [number, number, number],
  center: [number, number, number],
  up: [number, number, number]
) {
  const [ex, ey, ez] = eye;
  const [cx, cy, cz] = center;
  let [ux, uy, uz] = up;

  let zx = ex - cx;
  let zy = ey - cy;
  let zz = ez - cz;
  const zl = 1 / Math.hypot(zx, zy, zz);
  zx *= zl;
  zy *= zl;
  zz *= zl;

  let xx = uy * zz - uz * zy;
  let xy = uz * zx - ux * zz;
  let xz = ux * zy - uy * zx;
  const xl = 1 / Math.hypot(xx, xy, xz);
  xx *= xl;
  xy *= xl;
  xz *= xl;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  return new Float32Array([
    xx,
    yx,
    zx,
    0,
    xy,
    yy,
    zy,
    0,
    xz,
    yz,
    zz,
    0,
    -(xx * ex + xy * ey + xz * ez),
    -(yx * ex + yy * ey + yz * ez),
    -(zx * ex + zy * ey + zz * ez),
    1
  ]);
}

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
    }
    return shader;
  };

  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create WebGL program");

  gl.attachShader(
    program,
    compile(
      gl.VERTEX_SHADER,
      `
      attribute vec3 position;
      attribute vec3 color;
      uniform mat4 uMVP;
      varying vec3 vColor;
      void main() {
        vColor = color;
        gl_Position = uMVP * vec4(position, 1.0);
      }
    `
    )
  );

  gl.attachShader(
    program,
    compile(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      varying vec3 vColor;
      uniform float uAlpha;
      void main() {
        gl_FragColor = vec4(vColor, uAlpha);
      }
    `
    )
  );

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link error");
  }

  return program;
}

function cubeMesh(size = 1) {
  const s = size / 2;
  const p = [
    -s, -s, s, s, -s, s, s, s, s, -s, s, s,
    s, -s, -s, -s, -s, -s, -s, s, -s, s, s, -s,
    -s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s,
    s, -s, s, s, -s, -s, s, s, -s, s, s, s,
    -s, s, s, s, s, s, s, s, -s, -s, s, -s,
    -s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s
  ];

  const c = [
    ...Array(4).fill([0.85, 0.93, 0.99]).flat(),
    ...Array(4).fill([0.75, 0.9, 0.98]).flat(),
    ...Array(4).fill([0.7, 0.88, 0.96]).flat(),
    ...Array(4).fill([0.65, 0.86, 0.95]).flat(),
    ...Array(4).fill([0.92, 0.98, 1.0]).flat(),
    ...Array(4).fill([0.78, 0.92, 0.99]).flat()
  ];

  const idx: number[] = [];
  for (let face = 0; face < 6; face += 1) {
    const o = face * 4;
    idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }

  return {
    positions: new Float32Array(p),
    colors: new Float32Array(c),
    indices: new Uint16Array(idx)
  };
}

const clampIndex = (value: number) => Math.max(0, Math.min(LEVELS.length - 1, value));

export default function AboutMe() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const idxRef = useRef(0);
  const targetXRef = useRef(POS_X(0));

  useEffect(() => {
    idxRef.current = index;
    targetXRef.current = POS_X(index);
  }, [index]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return undefined;

    const program = createProgram(gl);
    gl.useProgram(program);

    const cube = cubeMesh(1);
    const pos = gl.createBuffer();
    const col = gl.createBuffer();
    const idx = gl.createBuffer();
    if (!pos || !col || !idx) return undefined;

    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.bufferData(gl.ARRAY_BUFFER, cube.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, col);
    gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "position");
    const aCol = gl.getAttribLocation(program, "color");
    if (aPos < 0 || aCol < 0) return undefined;

    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, col);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aCol);

    const uMVP = gl.getUniformLocation(program, "uMVP");
    const uAlpha = gl.getUniformLocation(program, "uAlpha");
    if (!uMVP || !uAlpha) return undefined;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;
      const height = canvas.clientHeight || canvas.parentElement?.clientHeight || 0;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let t = 0;
    let camX = POS_X(0);
    let playerX = POS_X(0);
    const MOVE_GAIN = 4;
    const CAM_GAIN = 4;
    const GROUND_ALPHA = 0.3;
    const BASE_SCALE = 1.2;
    const BASE_HEIGHT = 0.6;
    const HIGHLIGHT_SCALE = 1.55;
    const HIGHLIGHT_HEIGHT = 0.85;
    const SCALE_GAIN = 10;
    const pedScale = new Float32Array(LEVELS.length).fill(BASE_SCALE);
    const pedHeight = new Float32Array(LEVELS.length).fill(BASE_HEIGHT);

    let prev = performance.now();
    const render = () => {
      const now = performance.now();
      const dt = Math.max(0.001, Math.min(0.05, (now - prev) / 1000));
      prev = now;
      t += dt;

      const targetX = targetXRef.current;
      const moveLerp = 1 - Math.exp(-MOVE_GAIN * dt);
      const camLerp = 1 - Math.exp(-CAM_GAIN * dt);
      playerX += (targetX - playerX) * moveLerp;
      camX += (playerX - camX) * camLerp;

      const scaleLerp = 1 - Math.exp(-SCALE_GAIN * dt);
      for (let i = 0; i < LEVELS.length; i += 1) {
        const selected = i === idxRef.current;
        const targetScale = selected ? HIGHLIGHT_SCALE : BASE_SCALE;
        const targetHeight = selected ? HIGHLIGHT_HEIGHT : BASE_HEIGHT;
        pedScale[i] += (targetScale - pedScale[i]) * scaleLerp;
        pedHeight[i] += (targetHeight - pedHeight[i]) * scaleLerp;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = canvas.width / canvas.height;
      const projection = m4persp(Math.PI / 4, aspect, 0.1, 100);
      const view = m4lookAt([camX, 2.2, 7], [camX, 0.6, 0], [0, 1, 0]);

      let model = m4mul(m4translate(0, -0.6, 0), m4scale(20, 0.2, 20));
      let mvp = m4mul(m4mul(projection, view), model);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.uniform1f(uAlpha, GROUND_ALPHA);
      gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);

      gl.uniform1f(uAlpha, 1.0);
      for (let i = 0; i < LEVELS.length; i += 1) {
        model = m4mul(
          m4translate(POS_X(i), 0, -1),
          m4scale(pedScale[i], pedHeight[i], pedScale[i])
        );
        mvp = m4mul(m4mul(projection, view), model);
        gl.uniformMatrix4fv(uMVP, false, mvp);
        gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);
      }

      model = m4mul(
        m4translate(playerX, 0.2, 2),
        m4mul(m4rotY(t * 0.8), m4scale(0.6, 0.9, 0.6))
      );
      mvp = m4mul(m4mul(projection, view), model);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.uniform1f(uAlpha, 1.0);
      gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);

      animationRef.current = requestAnimationFrame(render);
    };
    animationRef.current = requestAnimationFrame(render);

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xN = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const aspect = canvas.width / canvas.height;
      const scale = Math.tan(Math.PI / 8) * 7;
      const worldX = camX + xN * scale * aspect;

      let best = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < LEVELS.length; i += 1) {
        const distance = Math.abs(POS_X(i) - worldX);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }

      idxRef.current = best;
      targetXRef.current = POS_X(best);
      setIndex(best);
    };

    canvas.addEventListener("click", onClick);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("click", onClick);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      gl.deleteBuffer(pos);
      gl.deleteBuffer(col);
      gl.deleteBuffer(idx);
      gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setIndex((current) => {
          const next = clampIndex(current + 1);
          idxRef.current = next;
          targetXRef.current = POS_X(next);
          return next;
        });
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => {
          const next = clampIndex(current - 1);
          idxRef.current = next;
          targetXRef.current = POS_X(next);
          return next;
        });
      }
      if (event.key === "Enter") setOpen(true);
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const moveSelection = (delta: number) => {
    setIndex((current) => {
      const next = clampIndex(current + delta);
      idxRef.current = next;
      targetXRef.current = POS_X(next);
      return next;
    });
  };

  return (
    <div className="about-wrap">
      <div className="about-bg" />
      <canvas ref={canvasRef} className="about-canvas" />

      <button
        type="button"
        className="about-back-btn about-glass"
        onClick={() => navigate("/")}
        aria-label="Go back to main menu"
      >
        {"<- Main Menu"}
      </button>

      <section className="about-hud about-glass" aria-label="Section controls">
        <h1 className="about-title">{LEVELS[index].title}</h1>

        <div className="about-controls">
          <button
            type="button"
            aria-label="Previous section"
            onClick={() => moveSelection(-1)}
          >
            {"< Prev"}
          </button>
          <button type="button" className="about-primary" onClick={() => setOpen(true)}>
            Open
          </button>
          <button type="button" aria-label="Next section" onClick={() => moveSelection(1)}>
            {"Next >"}
          </button>
        </div>
      </section>

      {open && (
        <div className="about-modal" onClick={() => setOpen(false)}>
          <article
            className="about-card about-glass-strong"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="about-card-head">
              <span className="about-flag" aria-hidden />
              <h2 id="about-dialog-title" className="about-card-title">
                {LEVELS[index].title}
              </h2>
              <button
                type="button"
                className="about-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close details"
              >
                Close
              </button>
            </header>
            <div className="about-card-body">{LEVELS[index].details}</div>
          </article>
        </div>
      )}
    </div>
  );
}
