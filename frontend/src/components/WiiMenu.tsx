import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const urls = [
  "/about",
  "/blog",
  "https://example.com/page3",
  "https://example.com/page4",
  "https://example.com/page5"
];

const WiiMenu: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<THREE.Mesh[]>([]);
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const currentFrontModelRef = useRef<THREE.Object3D | null>(null);
  const rotateModelsRef = useRef<(dir: number) => void>(() => {});

  const navigate = useNavigate();

  useEffect(() => {
    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;

    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 8;
    camera.position.y = 1.2;
    camera.lookAt(0, 0, 0);

    // LIGHTING
    scene.add(new THREE.AmbientLight(0xaaaaaa, 1.2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // SOUNDS
    const hoverSound = new Audio("/assets/sounds/3DS-ui6.wav");
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    const homeMusic = new Audio("/assets/sounds/wiiMenu.wav");
    homeMusic.loop = true;
    homeMusic.volume = 0.5;
    homeMusic.play().catch(() => {});
    const selectSounds = [
      new Audio("/assets/sounds/select-sound2.mp3"),
      new Audio("/assets/sounds/select-sound3.mp3"),
      new Audio("/assets/sounds/select-sound4.mp3"),
      new Audio("/assets/sounds/select-sound5.mp3"),
      new Audio("/assets/sounds/select-sound5.mp3")
    ];

    // MODELS
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const models: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const model = new THREE.Mesh(geometry, material);
      model.scale.set(1, 1, 1);
      model.userData.originalScale = new THREE.Vector3(1, 1, 1);
      model.userData.targetScale = new THREE.Vector3(1, 1, 1);
      model.userData.targetRotationY = null;
      model.userData.baseRotationY = Math.random() * Math.PI * 2;
      model.userData.url = urls[i];
      model.userData.sound = selectSounds[i];
      scene.add(model);
      models.push(model);
    }
    modelsRef.current = models;

    // -------- ROTATION LOGIC --------
    function updateModelPositions() {
      const angle = angleRef.current;
      const time = timeRef.current;
      modelsRef.current.forEach((model, index) => {
        const theta = angle + (index * (Math.PI * 2)) / models.length;
        const floatingOffset = Math.sin(time + index) * 0.1;

        model.position.x = Math.sin(theta) * 5;
        model.position.z = Math.cos(theta) * 5;
        model.position.y = floatingOffset;

        model.scale.lerp(model.userData.targetScale, 0.1);

        model.userData.baseRotationY =
          (model.userData.baseRotationY + 0.003) % (Math.PI * 2);

        if (model.userData.targetRotationY !== null) {
          model.rotation.y =
            (model.rotation.y +
              (model.userData.targetRotationY - model.rotation.y) * 0.1) %
            (Math.PI * 2);
        } else {
          model.rotation.y = model.userData.baseRotationY;
        }

        // Play sound when model comes to the front
        if (index === 0 && currentFrontModelRef.current !== model) {
          currentFrontModelRef.current = model;
          if (model.userData.sound) model.userData.sound.play();
        }
      });
    }

    function rotateModels(direction: number) {
      const models = modelsRef.current;
      targetAngleRef.current += (direction * Math.PI * 2) / models.length;
      if (direction === -1) {
        models.push(models.shift() as THREE.Mesh);
      } else {
        models.unshift(models.pop() as THREE.Mesh);
      }
    }

    // Save to ref for button handlers
    rotateModelsRef.current = rotateModels;

    // -------- ANIMATION LOOP --------
    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      angleRef.current += (targetAngleRef.current - angleRef.current) * 0.05;
      timeRef.current += 0.02;
      updateModelPositions();
      renderer.render(scene, camera);
    }
    animate();

    // -------- RESIZE --------
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // -------- HOVER & CLICK INTERACTION --------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handleMouseMove(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelsRef.current);

      modelsRef.current.forEach((model) => {
        if (intersects.some((intersect) => intersect.object === model)) {
          // Play hover sound only once when first hovered
          if (!model.userData.isHovered) {
            model.userData.isHovered = true;
            hoverSound.currentTime = 0;
            hoverSound.play();
          }
          model.userData.targetScale.set(1.2, 1.2, 1.2);
          if (model.userData.targetRotationY === null) {
            model.userData.targetRotationY = camera.rotation.y;
          }
        } else {
          model.userData.targetScale.set(1, 1, 1);
          model.userData.baseRotationY = model.rotation.y;
          model.userData.targetRotationY = null;
          model.userData.isHovered = false;
        }
      });
    }
    renderer.domElement.addEventListener("mousemove", handleMouseMove);

    function handleClick() {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelsRef.current);
      if (intersects.length > 0) {
        const clickedModel = intersects[0].object as THREE.Mesh;
        if (clickedModel.userData.url) {
          const url: string = clickedModel.userData.url;
          if (url.startsWith("/")) {
            navigate(url);
          } else {
            window.open(url, "_blank");
          }
        }
      }
    }
    renderer.domElement.addEventListener("click", handleClick);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      scene.clear();
      homeMusic.pause();
      homeMusic.currentTime = 0;
    };
  }, [navigate]);

  // Button handlers for rotation
  const handleLeftClick = () => {
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    buttonSound.play();
    rotateModelsRef.current(1); // Move carousel left
  };
  const handleRightClick = () => {
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    buttonSound.play();
    rotateModelsRef.current(-1); // Move carousel right
  };

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Overlay content */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          width: "100%",
          textAlign: "center",
          zIndex: 2,
          pointerEvents: "none"
        }}
      >
        <h1
          style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            margin: "0 0 0.5rem 0"
          }}
        >
          Hi, I'm Edwin!
        </h1>
        <p style={{ fontSize: "1.3rem", margin: 0 }}>
          This site is under construction but check it out and lmk if you have any ideas! :)
        </p>
      </div>

      {/* Menu Buttons */}
      <button id="leftButton" onClick={handleLeftClick} style={{
        position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", zIndex: 5
      }}>–</button>
      <button id="rightButton" onClick={handleRightClick} style={{
        position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", zIndex: 5
      }}>+</button>
    </div>
  );
};

export default WiiMenu;
