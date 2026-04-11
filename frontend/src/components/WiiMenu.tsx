import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import meCasual from "../../assets/images/Me/Casual.jpeg";
import c_logo from "../../assets/images/Skills/languages/C_Logo.png";
import python_logo from "../../assets/images/Skills/languages/Python_Logo.png";
import ts_logo from "../../assets/images/Skills/languages/Typescript_Logo.png";
import js_logo from "../../assets/images/Skills/languages/Javascript_Logo.png";
import java_logo from "../../assets/images/Skills/languages/Java_Logo.png";
import cpp_logo from "../../assets/images/Skills/languages/C++_Logo.png";
import sql_logo from "../../assets/images/Skills/languages/Sql_Logo.png";
import php_logo from "../../assets/images/Skills/languages/Php_Logo.png";
import html_css_logo from "../../assets/images/Skills/languages/HTML_CSS_Logo.png";


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

type DashboardProject = {
  name: string;
  type: string;
  summary: string;
  route?: string;
  githubUrl: string;
  accent: string;
};

type SkillItem = {
  name: string;
  image?: string;
  imageAlt?: string;
};

// todo: play hover.wav for any menu item card that is hovered over
const MENU_ITEMS: MenuItem[] = [
  {
    id: "about",
    title: "About Me",
    eyebrow: "Profile",
    subtitle: "Learn about who I am and my educational/professional experience.",
    description:
      "A more personal overview of my work, long-term goals, and how I think about building software.",
    accent: "#5de2ff",
    route: "/about"
  },
  {
    id: "projects",
    title: "Projects",
    eyebrow: "Builds",
    subtitle: "An overview of my project experience so far.",
    description:
      "A tighter snapshot of the portfolio pieces that best represent how I solve problems and ship work.",
    accent: "#95ffbf",
    route: "/projects"
  },
  {
    id: "internship-portfolio",
    title: "Internship",
    eyebrow: "Portfolio Project",
    subtitle: "Rubric-aligned internship documentation, project evidence, and reflection.",
    description:
      "A dedicated final portfolio project page organized around internship details, project work, and learnings.",
    accent: "#7cc7ff",
    route: "/internship-portfolio"
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
    title: "Prototype",
    eyebrow: "Reference",
    subtitle: "The original Wii-inspired carousel, kept as a secondary experience.",
    description:
      "A stylized 3D channel view that is now simplified so the interaction model stays predictable.",
    accent: "#adadff",
    mode: "3d"
  }
];

const emailAddress = "edwin.villa2@icloud.com";
const githubUrl = "https://github.com/Edwinvilla72";
const knwURL = "https://knw.net/en"

const skillLanes: SkillItem[][] = [
  [
    { name: "C", image: c_logo },
    { name: "Python", image: python_logo },
    { name: "TypeScript", image: ts_logo },
    { name: "JavaScript", image: js_logo },
    { name: "Java", image: java_logo },
    { name: "C++", image: cpp_logo },
    { name: "SQL", image: sql_logo },
    { name: "PHP", image: php_logo },
    { name: "HTML/CSS", image: html_css_logo }
  ],
  [
    { name: "React" },
    { name: "Vite" },
    { name: "HTML" },
    { name: "CSS" },
    { name: "FastAPI" },
    { name: "Node" },
    { name: "REST APIs" },
    { name: "Auth" }
  ],
  [
    { name: "AWS" },
    { name: "Docker" },
    { name: "Git" },
    { name: "Linux" },
    { name: "CI/CD" },
    { name: "LLM APIs" },
    { name: "RAG" },
    { name: "Analytics" }
  ]
];

const featuredProjects: DashboardProject[] = [
  {
    name: "Wii Portfolio",
    type: "Personal build",
    summary: "A Nintendo-leaning portfolio that blends channel UI, motion, and a cleaner editorial homepage.",
    route: "/projects/wii-portfolio",
    githubUrl,
    accent: "#E60012"
  },
  {
    name: "knw.",
    type: "Professional product",
    summary: "Dashboard and analytics work for a live-event platform focused on audience attention and emotion signals.",
    route: "/projects/knw",
    githubUrl: knwURL,
    accent: "#E60012"
  },
  {
    name: "SHADE",
    type: "AI / security",
    summary: "Human-like cyber-defense simulation work built to make defensive testing more believable and useful.",
    route: "/projects/shade",
    githubUrl,
    accent: "#E60012"
  }
] as const;


const WiiMenu: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<MenuMode>("2d");
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndexRef = useRef(0);
  const channelSectionRef = useRef<HTMLElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const skillsSectionRef = useRef<HTMLElement | null>(null);
  const projectsSectionRef = useRef<HTMLElement | null>(null);
  const contactSectionRef = useRef<HTMLElement | null>(null);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<THREE.Mesh[]>([]);
  const animationRef = useRef<number>();
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const timeRef = useRef(0);
  const currentFrontModelRef = useRef<THREE.Mesh | null>(null);
  const hoverModelRef = useRef<THREE.Mesh | null>(null);
  const channelHoverSoundRef = useRef<HTMLAudioElement | null>(null);

  const carouselItems = useMemo(() => MENU_ITEMS.filter((item) => !item.mode), []);
  const activeItem = carouselItems[activeIndex % carouselItems.length] ?? carouselItems[0];
  const heroMenu = MENU_ITEMS.filter((item) => item.id !== "mode-3d");

  const scrollToSection = (section: React.RefObject<HTMLElement | null>) => {
    setMenuOpen(false);
    section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const hoverSound = new Audio("/assets/sounds/hover.wav");
    hoverSound.volume = 0.6;
    channelHoverSoundRef.current = hoverSound;

    return () => {
      hoverSound.pause();
      hoverSound.currentTime = 0;
      channelHoverSoundRef.current = null;
    };
  }, []);

  const handleSelection = (item: MenuItem) => {
    if (item.mode) {
      setMode(item.mode);
      return;
    }

    if (item.route) {
      navigate(item.route);
    }
  };

  const playChannelHoverSound = () => {
    const sound = channelHoverSoundRef.current;
    if (!sound) {
      return;
    }
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };

  const rotateCarousel = (direction: number) => {
    const total = carouselItems.length;
    targetAngleRef.current += (direction * Math.PI * 2) / total;
    if (direction === -1) {
      modelsRef.current.push(modelsRef.current.shift() as THREE.Mesh);
    } else {
      modelsRef.current.unshift(modelsRef.current.pop() as THREE.Mesh);
    }
    setActiveIndex((previous) => (previous + direction + total) % total);
  };

  useEffect(() => {
    if (mode !== "3d") {
      return;
    }

    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    angleRef.current = 0;
    targetAngleRef.current = 0;
    timeRef.current = 0;
    currentFrontModelRef.current = null;
    hoverModelRef.current = null;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    camera.position.y = 1.2;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xaaaaaa, 1.2));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const hoverSound = new Audio("/assets/sounds/3DS-ui6.wav");
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    const homeMusic = new Audio("/assets/sounds/wiiMenu.wav");
    homeMusic.loop = true;
    homeMusic.volume = 0.5;
    homeMusic.play().catch(() => {});
    const selectSounds = carouselItems.map(() => new Audio("/assets/sounds/select-sound5.mp3"));
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const meshes: THREE.Mesh[] = carouselItems.map((item, index) => {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      mesh.userData.item = item;
      mesh.userData.sound = selectSounds[index];
      mesh.userData.baseRotationY = Math.random() * Math.PI * 2;
      mesh.userData.targetRotationY = null;
      mesh.userData.targetScale = new THREE.Vector3(1, 1, 1);
      scene.add(mesh);
      return mesh;
    });

    modelsRef.current = meshes;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!isInside) {
        return false;
      }
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return true;
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!updatePointer(event)) {
        hoverModelRef.current = null;
        renderer.domElement.style.cursor = "default";
        meshes.forEach((mesh) => {
          mesh.userData.targetScale.set(1, 1, 1);
          mesh.userData.baseRotationY = mesh.rotation.y;
          mesh.userData.targetRotationY = null;
        });
        return;
      }
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;

      if (hit && hoverModelRef.current !== hit) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
      }

      hoverModelRef.current = hit ?? null;
      renderer.domElement.style.cursor = hit ? "pointer" : "default";
      meshes.forEach((mesh) => {
        if (mesh === hit) {
          mesh.userData.targetScale.set(1.2, 1.2, 1.2);
          if (mesh.userData.targetRotationY === null) {
            mesh.userData.targetRotationY = camera.rotation.y;
          }
        } else {
          mesh.userData.targetScale.set(1, 1, 1);
          mesh.userData.baseRotationY = mesh.rotation.y;
          mesh.userData.targetRotationY = null;
        }
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!updatePointer(event)) {
        return;
      }
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;

      if (!hit?.userData.item) {
        return;
      }

      const item = hit.userData.item as MenuItem;
      handleSelection(item);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
        rotateCarousel(1);
      }
      if (event.key === "ArrowRight") {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
        rotateCarousel(-1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const currentItem = carouselItems[activeIndexRef.current];
        if (currentItem) {
          handleSelection(currentItem);
        }
      }
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      angleRef.current += (targetAngleRef.current - angleRef.current) * 0.05;
      timeRef.current += 0.02;

      modelsRef.current.forEach((mesh, index) => {
        const theta = angleRef.current + (index * (Math.PI * 2)) / modelsRef.current.length;
        const floatingOffset = Math.sin(timeRef.current + index) * 0.1;

        mesh.position.x = Math.sin(theta) * 5;
        mesh.position.z = Math.cos(theta) * 5;
        mesh.position.y = floatingOffset;
        mesh.scale.lerp(mesh.userData.targetScale, 0.1);

        mesh.userData.baseRotationY =
          (mesh.userData.baseRotationY + 0.003) % (Math.PI * 2);

        if (mesh.userData.targetRotationY !== null) {
          mesh.rotation.y =
            (mesh.rotation.y +
              (mesh.userData.targetRotationY - mesh.rotation.y) * 0.1) %
            (Math.PI * 2);
        } else {
          mesh.rotation.y = mesh.userData.baseRotationY;
        }

        if (index === 0 && currentFrontModelRef.current !== mesh) {
          currentFrontModelRef.current = mesh;
          (mesh.userData.sound as HTMLAudioElement | undefined)?.play().catch(() => {});
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      renderer.domElement.style.cursor = "default";

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      meshes.forEach((mesh) => {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
      });

      geometry.dispose();
      renderer.dispose();
      scene.clear();
      homeMusic.pause();
      homeMusic.currentTime = 0;

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [carouselItems, mode, navigate]);

  return (
    <div className={`wiiMenuShell ${mode === "3d" ? "mode3d" : "mode2d"}`}>
      <div className="wiiMenuBackdrop" />
      <div className="wiiMenuGlow wiiMenuGlowLeft" />
      <div className="wiiMenuGlow wiiMenuGlowRight" />

      {mode === "3d" && <div className="wiiMenuMount" ref={mountRef} />}

      <div className="wiiMenuOverlay">
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
                  scrollToSection(aboutSectionRef);
                }}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  scrollToSection(skillsSectionRef);
                }}
              >
                Skills
              </button>
              <button
                type="button"
                onClick={() => {
                  scrollToSection(projectsSectionRef);
                }}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => {
                  scrollToSection(contactSectionRef);
                }}
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setMode("3d");
                }}
              >
                Prototype
              </button>
            </aside>

            <section className="channelHome interactiveLayer">
              <div className="dashboardHeroBand">
                <div className="dashboardHeroMain">
                  <p className="wiiEyebrow">Home Menu</p>
                  <h1>Edwin Gabriel Villanueva</h1>
                  <p className="channelHeroCopy">
                    Full-stack developer focused on product UI, cloud-backed software, and
                    practical AI systems. The first screen keeps the Wii channel feel, and the
                    rest of the page scrolls like a condensed Nintendo-style homepage.
                  </p>

                  <div className="dashboardHeroActions">
                    <button type="button" onClick={() => scrollToSection(projectsSectionRef)}>
                      View projects
                    </button>
                    <button type="button" onClick={() => scrollToSection(contactSectionRef)}>
                      Contact
                    </button>
                  </div>
                </div>

                <aside className="dashboardHeroAside dashboardHeroProfileCard">
                  <div className="dashboardHeroPhotoFrame">
                    <img
                      src={meCasual}
                      alt="Portrait of Edwin Gabriel Villanueva"
                      className="dashboardHeroPhoto"
                    />
                  </div>

                  <div className="dashboardHeroProfileMeta">
                    <p className="dashboardHeroAsideLabel">At a glance</p>
                    <ul className="dashboardHeroFacts">
                      <li>Full Stack Software Developer at Entertainment Technology Partners</li>
                      <li>Computer Science student at UCF</li>
                      <li>Interested in backend systems, AI-enabled products, and user experience</li>
                    </ul>
                  </div>
                </aside>
              </div>

              <div className="channelHero">
                <h2>Open a channel.</h2>
                <p className="channelHeroTitle">
                  Wii-inspired menu first, full portfolio summary underneath
                </p>
              </div>

              <section className="channelGridWrap" ref={channelSectionRef}>
                <div className="channelGrid">
                  {heroMenu.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="channelCard"
                      onMouseEnter={playChannelHoverSound}
                      onFocus={playChannelHoverSound}
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
                <p>Scroll for the full portfolio summary</p>
              </div>
            </section>

            <section className="dashboardSection interactiveLayer" ref={aboutSectionRef}>
              <div className="dashboardSectionIntro">
                <p className="wiiEyebrow">About</p>
                <h2>Short version first.</h2>
                <p>
                  I build software with a product mindset: clear interfaces, useful data, and
                  systems that feel intentional rather than improvised. Most of my recent work sits
                  at the intersection of frontend dashboards, backend services, and AI-assisted
                  tooling.
                </p>
              </div>

              <div className="dashboardAboutGrid">
                <article className="dashboardFeatureCard dashboardFeaturePrimary">
                  <span className="dashboardFeatureTag">Current focus</span>
                  <h3>Shipping software that translates complex behavior into readable interfaces.</h3>
                  <p>
                    That means analytics surfaces, platform workflows, and portfolio builds that put
                    clarity ahead of noise.
                  </p>
                </article>

                <article className="dashboardFeatureCard">
                  <span className="dashboardFeatureTag">Working style</span>
                  <h3>Structured, visual, and pragmatic.</h3>
                  <p>
                    I like products that are easy to navigate, pleasant to use, and grounded in real
                    implementation constraints.
                  </p>
                </article>
              </div>
            </section>

            <section className="dashboardSection interactiveLayer" ref={skillsSectionRef}>
              <div className="dashboardSectionIntro">
                <p className="wiiEyebrow">Skills</p>
                <h2>Core lanes.</h2>
                <p>
                  The portfolio is strongest where interface work, backend logic, and deployment
                  realities meet.
                </p>
              </div>

              <div className="dashboardSkillsShell">
                <div className="aboutSkillsBelt dashboardSkillsBelt" aria-label="Skills conveyor belt">
                  {skillLanes.map((lane, laneIndex) => (
                    <div
                      key={`dashboard-lane-${laneIndex}`}
                      className={`aboutSkillsLane aboutSkillsLane${laneIndex + 1}`}
                    >
                      {[0, 1].map((copyIndex) => (
                        <div
                          key={`dashboard-lane-${laneIndex}-copy-${copyIndex}`}
                          className="aboutSkillsTrack"
                          aria-hidden={copyIndex === 1}
                        >
                          {[0, 1].map((laneRepeat) =>
                            lane.map((item) => (
                              <article
                                key={`${laneIndex}-${copyIndex}-${laneRepeat}-${item.name}`}
                                className="aboutSkillBadge dashboardSkillBadge"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.imageAlt ?? `${item.name} logo`}
                                    className="aboutSkillBadgeImage"
                                  />
                                ) : null}
                                <span>{item.name}</span>
                              </article>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboardSection interactiveLayer" ref={projectsSectionRef}>
              <div className="dashboardSectionHeaderRow">
                <div className="dashboardSectionIntro">
                  <p className="wiiEyebrow">Featured Projects</p>
                  <h2>Selected work.</h2>
                  <p>
                    A quick row of projects for visitors who want the portfolio summary before
                    diving into dedicated pages.
                  </p>
                </div>

                <button
                  type="button"
                  className="dashboardSectionRouteButton"
                  onClick={() => navigate("/projects")}
                >
                  Open projects page
                </button>
              </div>

              <div className="dashboardProjectRow">
                {featuredProjects.map((project) => (
                  <article
                    key={project.name}
                    className="dashboardProjectCard"
                    style={{ "--portfolio-accent": project.accent } as React.CSSProperties}
                  >
                    <p>{project.type}</p>
                    <h3>{project.name}</h3>
                    <span>{project.summary}</span>
                    <div className="dashboardProjectActions">
                      {project.route ? (
                        <button type="button" onClick={() => navigate(project.route ?? "/projects")}>
                          Learn more
                        </button>
                      ) : null}
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboardSection dashboardContactSection interactiveLayer" ref={contactSectionRef}>
              <div className="dashboardSectionIntro">
                <p className="wiiEyebrow">Contact</p>
                <h2>Let&apos;s talk.</h2>
                <p>
                  If you want to discuss a role, a product, or a build direction, these are the
                  fastest ways to reach me.
                </p>
              </div>

              <div className="dashboardContactCard">
                <div>
                  <p className="dashboardContactLabel">Email</p>
                  <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                </div>
                <div>
                  <p className="dashboardContactLabel">GitHub</p>
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    github.com/Edwinvilla72
                  </a>
                </div>
                <button type="button" onClick={() => navigate("/contact")}>
                  Open full contact page
                </button>
              </div>
            </section>

          </>
        ) : (
          <>
            <section
              className="interactiveLayer"
              style={{
                position: "absolute",
                top: "8%",
                width: "100%",
                textAlign: "center",
                zIndex: 2,
                pointerEvents: "none"
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: "2.5rem", margin: "0 0 0.5rem 0" }}>
                Hi, I&apos;m Edwin!
              </h2>
              <p style={{ fontSize: "1.3rem", margin: 0 }}>
                This site is under construction but check it out and lmk if you have any ideas! :)
              </p>
            </section>

            <div
              className="wiiControlDock interactiveLayer"
              style={{ background: "transparent", border: "none", boxShadow: "none" }}
            >
              <button
                type="button"
                className="wiiNavButton"
                onClick={() => rotateCarousel(1)}
                aria-label="Rotate left"
              >
                <span>-</span>
              </button>
              <div className="wiiControlHint">{activeItem?.title ?? "Channel"}</div>
              <button
                type="button"
                className="wiiNavButton"
                onClick={() => rotateCarousel(-1)}
                aria-label="Rotate right"
              >
                <span>+</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WiiMenu;
