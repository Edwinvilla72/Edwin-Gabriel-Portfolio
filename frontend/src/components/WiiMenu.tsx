import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";


type MenuMode = "2d" | "3d";

type MenuItem = {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  accent: string;
  route?: string;
  mode?: MenuMode;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "about",
    title: "About Me",
    eyebrow: "Profile",
    subtitle: "Background, motivation, and current direction.",
    description:
      "A more personal overview of my work, long-term goals, and how I think about building software.",
    accent: "#5de2ff",
    route: "/about"
  },
  {
    id: "projects",
    title: "Projects",
    eyebrow: "Builds",
    subtitle: "Selected technical work across AI, apps, and interfaces.",
    description:
      "A tighter snapshot of the portfolio pieces that best represent how I solve problems and ship work.",
    accent: "#95ffbf",
    route: "/projects"
  },
  {
    id: "blog",
    title: "Blog",
    eyebrow: "Writing",
    subtitle: "Technical notes, progress updates, and personal reflections.",
    description:
      "A split between build logs and longer-form writing about growth, timing, and momentum.",
    accent: "#ffd36b",
    route: "/blog"
  },
  {
    id: "personal-blog",
    title: "Personal",
    eyebrow: "Notes",
    subtitle: "Longer-form personal writing and reflections.",
    description:
      "A more personal side of the portfolio, focused on growth, timing, and the path I am on.",
    accent: "#ffc17d",
    route: "/blog/personal"
  },
  {
    id: "contact",
    title: "Contact",
    eyebrow: "Reach Out",
    subtitle: "The cleanest ways to reach me or explore more work.",
    description:
      "Email, GitHub, and the practical next steps for continuing the conversation.",
    accent: "#ff96b1",
    route: "/contact"
  },
  {
    id: "mode-3d",
    title: "3D Mode",
    eyebrow: "Experimental",
    subtitle: "The original Wii-inspired carousel, kept as a secondary experience.",
    description:
      "A stylized 3D channel view that is now simplified so the interaction model stays predictable.",
    accent: "#adadff",
    mode: "3d"
  }
];

const DASHBOARD_SPOTLIGHT = [
  "Full Stack Software Developer at Entertainment Technology Partners",
  "Computer Science student at UCF",
];

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  words.forEach((word) => {
    const trial = `${line}${word} `;
    if (ctx.measureText(trial).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y);
      line = `${word} `;
      y += lineHeight;
      return;
    }
    line = trial;
  });

  if (line) {
    ctx.fillText(line.trim(), x, y);
  }
}

function createMenuTexture(item: MenuItem) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `${item.accent}f0`);
  gradient.addColorStop(0.55, "#fcfeff");
  gradient.addColorStop(1, "#dbefff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.beginPath();
  ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 42);
  ctx.fill();

  ctx.fillStyle = "rgba(13, 33, 57, 0.44)";
  ctx.beginPath();
  ctx.roundRect(76, 76, 220, 56, 28);
  ctx.fill();

  ctx.fillStyle = "#f7fdff";
  ctx.font = "600 28px sans-serif";
  ctx.fillText(item.eyebrow.toUpperCase(), 108, 114);

  ctx.fillStyle = "#122b45";
  ctx.font = "700 88px sans-serif";
  ctx.fillText(item.title, 78, 252);

  ctx.fillStyle = "#325470";
  ctx.font = "500 34px sans-serif";
  wrapText(ctx, item.subtitle, 80, 324, 840, 44);

  ctx.fillStyle = "rgba(18, 43, 69, 0.09)";
  ctx.beginPath();
  ctx.roundRect(80, 466, 320, 92, 30);
  ctx.fill();

  ctx.fillStyle = "#122b45";
  ctx.font = "600 34px sans-serif";
  ctx.fillText(item.mode ? "Switch Modes" : "Open Section", 116, 523);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const WiiMenu: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<MenuMode>("2d");
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndexRef = useRef(0);
  const channelSectionRef = useRef<HTMLElement | null>(null);
  const detailsSectionRef = useRef<HTMLElement | null>(null);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<THREE.Mesh[]>([]);
  const animationRef = useRef<number>();
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const hoverIdRef = useRef<string | null>(null);

  const activeItem = MENU_ITEMS[activeIndex];
  const heroMenu = MENU_ITEMS.filter((item) => item.id !== "mode-3d");

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handleSelection = (item: MenuItem) => {
    if (item.mode) {
      setMode(item.mode);
      return;
    }

    if (item.route) {
      navigate(item.route);
    }
  };

  const rotateCarousel = (direction: number) => {
    setActiveIndex((previous) => {
      const total = MENU_ITEMS.length;
      const next = (previous + direction + total) % total;
      targetRotationRef.current = -next * ((Math.PI * 2) / total);
      return next;
    });
  };

  useEffect(() => {
    if (mode !== "3d") {
      return;
    }

    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    currentRotationRef.current = -activeIndex * ((Math.PI * 2) / MENU_ITEMS.length);
    targetRotationRef.current = currentRotationRef.current;
    hoverIdRef.current = null;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xd9eeff, 0.04);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.85, 9.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.4);
    directionalLight.position.set(6, 8, 8);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x90dfff, 26, 30);
    pointLight.position.set(0, 2.8, 5);
    scene.add(pointLight);

    const base = new THREE.Mesh(
      new THREE.CircleGeometry(5.9, 64),
      new THREE.MeshBasicMaterial({
        color: 0xaed7ef,
        transparent: true,
        opacity: 0.2
      })
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -1.85;
    scene.add(base);

    const hoverSound = new Audio("/assets/sounds/3DS-ui6.wav");
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    const homeMusic = new Audio("/assets/sounds/wiiMenu.wav");
    homeMusic.loop = true;
    homeMusic.volume = 0.28;
    homeMusic.play().catch(() => {});

    const geometry = new THREE.BoxGeometry(2.8, 1.7, 0.24);
    const meshes: THREE.Mesh[] = MENU_ITEMS.map((item) => {
      const texture = createMenuTexture(item);
      const edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: item.accent,
        emissive: item.accent,
        emissiveIntensity: 0.16,
        roughness: 0.4,
        metalness: 0.08
      });
      const frontMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.24,
        clearcoat: 0.72,
        clearcoatRoughness: 0.2
      });

      const mesh = new THREE.Mesh(geometry, [
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        frontMaterial,
        edgeMaterial
      ]);

      mesh.userData.item = item;
      mesh.userData.texture = texture;
      mesh.userData.baseTilt = (Math.random() - 0.5) * 0.12;
      mesh.userData.hoverSpin = Math.random() * Math.PI * 2;
      scene.add(mesh);
      return mesh;
    });

    modelsRef.current = meshes;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (event: MouseEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;
      const hitId = hit?.userData.item?.id ?? null;

      if (hitId && hoverIdRef.current !== hitId) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
      }

      hoverIdRef.current = hitId;
      renderer.domElement.style.cursor = hit ? "pointer" : "default";
    };

    const handlePointerLeave = () => {
      hoverIdRef.current = null;
      renderer.domElement.style.cursor = "default";
    };

    const handleClick = (event: MouseEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;

      if (!hit?.userData.item) {
        return;
      }

      const item = hit.userData.item as MenuItem;
      const hitIndex = MENU_ITEMS.findIndex((candidate) => candidate.id === item.id);
      if (hitIndex !== -1) {
        setActiveIndex(hitIndex);
        targetRotationRef.current = -hitIndex * ((Math.PI * 2) / MENU_ITEMS.length);
      }
      handleSelection(item);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
        rotateCarousel(-1);
      }
      if (event.key === "ArrowRight") {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
        rotateCarousel(1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelection(MENU_ITEMS[activeIndexRef.current]);
      }
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      currentRotationRef.current +=
        (targetRotationRef.current - currentRotationRef.current) * 0.09;
      const now = performance.now() * 0.001;

      meshes.forEach((mesh, index) => {
        const theta = currentRotationRef.current + index * ((Math.PI * 2) / MENU_ITEMS.length);
        const distanceFromFront = Math.abs(
          ((((index - activeIndexRef.current) % MENU_ITEMS.length) + MENU_ITEMS.length) % MENU_ITEMS.length)
        );
        const isHovered = hoverIdRef.current === mesh.userData.item.id;
        const isFront = index === activeIndexRef.current;
        const radius = 4.95;

        mesh.position.x = Math.sin(theta) * radius;
        mesh.position.z = Math.cos(theta) * 4.7;
        mesh.position.y = Math.sin(now * 1.5 + index * 0.85) * 0.12;
        mesh.rotation.y = -theta * 0.45;
        mesh.rotation.x = Math.sin(now * 0.9 + index) * 0.04 + mesh.userData.baseTilt;

        if (isHovered) {
          mesh.userData.hoverSpin += 0.06;
          mesh.rotation.y += mesh.userData.hoverSpin * 0.08;
        } else {
          mesh.userData.hoverSpin += (0 - mesh.userData.hoverSpin) * 0.08;
        }

        const targetScale = isHovered ? 1.12 : isFront ? 1.08 : 0.9;
        const currentScale = mesh.scale.x + (targetScale - mesh.scale.x) * 0.14;
        mesh.scale.setScalar(currentScale);

        mesh.renderOrder = MENU_ITEMS.length - distanceFromFront;
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", handleKeyDown);
    renderer.domElement.addEventListener("mousemove", handlePointerMove);
    renderer.domElement.addEventListener("mouseleave", handlePointerLeave);
    renderer.domElement.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", handleKeyDown);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      renderer.domElement.removeEventListener("mouseleave", handlePointerLeave);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.style.cursor = "default";

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      meshes.forEach((mesh) => {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
        (mesh.userData.texture as THREE.Texture | undefined)?.dispose();
      });

      geometry.dispose();
      (base.geometry as THREE.BufferGeometry).dispose();
      (base.material as THREE.Material).dispose();
      renderer.dispose();
      scene.clear();
      homeMusic.pause();
      homeMusic.currentTime = 0;

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [mode, navigate]);

  return (
    <div className={`wiiMenuShell ${mode === "3d" ? "mode3d" : "mode2d"}`}>
      <div className="wiiMenuBackdrop" />
      <div className="wiiMenuGlow wiiMenuGlowLeft" />
      <div className="wiiMenuGlow wiiMenuGlowRight" />

      {mode === "3d" && <div className="wiiMenuMount" ref={mountRef} />}

      <div className="wiiMenuOverlay">
        <header className="wiiHero interactiveLayer">


          <div className="wiiModeToggle" role="tablist" aria-label="Portfolio mode">
            <button
              type="button"
              className={mode === "2d" ? "active" : ""}
              onClick={() => setMode("2d")}
            >
              2D Dashboard
            </button>
            <button
              type="button"
              className={mode === "3d" ? "active" : ""}
              onClick={() => setMode("3d")}
            >
              3D Experiment
            </button>
          </div>
        </header>

        {mode === "2d" ? (
          <>
            <button
              type="button"
              className="channelMenuToggle interactiveLayer"
              aria-label="Open portfolio shortcuts"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>

            <aside className={`channelQuickMenu interactiveLayer ${menuOpen ? "open" : ""}`}>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  channelSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Channels
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  detailsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setMode("3d");
                }}
              >
                3D Mode
              </button>
            </aside>

            <section className="channelHome interactiveLayer">
              <div className="channelHero">
                <p className="wiiEyebrow">Portfolio</p>
                <h2>Edwin Gabriel Villanueva</h2>
                <p className="channelHeroTitle">
                  Computer Science Student and AI Software Engineering Intern
                </p>
                <p className="channelHeroCopy">
                  A cleaner portfolio home inspired by the Wii menu: select a channel,
                  or scroll for a little more context.
                </p>
              </div>

              <section className="channelGridWrap" ref={channelSectionRef}>
                <div className="channelGrid">
                  {heroMenu.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="channelCard"
                      onClick={() => handleSelection(item)}
                      style={{ "--portfolio-accent": item.accent } as React.CSSProperties}
                    >
                      <p>{item.eyebrow}</p>
                      <h3>{item.title}</h3>
                      <span>{item.subtitle}</span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="channelScrollHint">
                <span />
                <p>Scroll for more</p>
              </div>
            </section>

            <section className="channelDetails interactiveLayer" ref={detailsSectionRef}>
              <div className="channelDetailsIntro">
                <p className="wiiEyebrow">A Little More</p>
                <h3>Focused on building software with a stronger point of view.</h3>
                <p>
                  I want this portfolio to feel simple on the surface and more personal
                  as you move through it. The channel grid gets you in quickly, and the
                  rest of the site can carry the depth.
                </p>
              </div>

              <div className="channelDetailList">
                {DASHBOARD_SPOTLIGHT.map((line) => (
                  <div key={line} className="channelDetailPill">
                    {line}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="wiiFocusCard interactiveLayer">
              <p className="wiiFocusLabel">{activeItem.eyebrow}</p>
              <div className="wiiFocusHeader">
                <div>
                  <h2>{activeItem.title}</h2>
                  <p>{activeItem.subtitle}</p>
                </div>
                <span
                  className="wiiAccentDot"
                  style={{ backgroundColor: activeItem.accent }}
                />
              </div>
              <p className="wiiFocusDescription">{activeItem.description}</p>
              <div className="wiiFocusActions">
                <button type="button" onClick={() => handleSelection(activeItem)}>
                  {activeItem.mode ? "Switch to 2D" : "Open section"}
                </button>
                <span>Click a channel directly or use the arrow controls.</span>
              </div>
            </section>

            <div className="wiiControlDock interactiveLayer">
              <button
                type="button"
                className="wiiNavButton"
                onClick={() => rotateCarousel(-1)}
                aria-label="Rotate left"
              >
                <span>←</span>
              </button>
              <div className="wiiControlHint">The 3D view is now secondary to the channel home.</div>
              <button
                type="button"
                className="wiiNavButton"
                onClick={() => rotateCarousel(1)}
                aria-label="Rotate right"
              >
                <span>→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WiiMenu;
