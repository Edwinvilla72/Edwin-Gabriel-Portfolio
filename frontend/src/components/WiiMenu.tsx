import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import "../styles/styles.css";

// ---- OPTIONAL: Update these with your actual channel info ----
const urls = [
  "/about",
  "https://example.com/page2",
  "https://example.com/page3",
  "https://example.com/page4",
  "https://example.com/page5"
];

const WiiMenu: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ------------------- SETUP SCENE -------------------
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;

    // Append renderer to the container
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 8;
    camera.position.y = 1.2;
    camera.lookAt(0, 0, 0);

    // ----------- LIGHTING -----------
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // ----------- SOUNDS -----------
    // (Note: public/ is root for these paths)
    const hoverSound = new Audio("/assets/sounds/3DS-ui6.wav");
    const buttonSound = new Audio("/assets/sounds/+-click.wav");
    const homeMusic = new Audio("/assets/sounds/wiiMenu.wav");
    homeMusic.loop = true;
    homeMusic.volume = 0.5;
    homeMusic.play().catch(() => {}); // avoid blocking if autoplay fails

    // Assign a different sound to each model (replace as needed)
    const selectSounds = [
      // new Audio('/assets/sounds/aboutMe.wav'),
      new Audio("/assets/sounds/select-sound2.mp3"),
      new Audio("/assets/sounds/select-sound3.mp3"),
      new Audio("/assets/sounds/select-sound4.mp3"),
      new Audio("/assets/sounds/select-sound5.mp3")
    ];

    // ----------- MODELS/STATE -----------
    let models: THREE.Mesh[] = [];
    let angle = 0;
    let targetAngle = 0;
    let time = 0;
    const radius = 5;
    let currentFrontModel: THREE.Object3D | null = null;

    // Geometry/material for demo (boxes)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

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

    function updateModelPositions() {
      models.forEach((model, index) => {
        const theta = angle + (index * (Math.PI * 2)) / models.length;
        const floatingOffset = Math.sin(time + index) * 0.1;

        model.position.x = Math.sin(theta) * radius;
        model.position.z = Math.cos(theta) * radius;
        model.position.y = floatingOffset;
        model.scale.lerp(model.userData.targetScale, 0.1);

        model.userData.baseRotationY = (model.userData.baseRotationY + 0.003) % (Math.PI * 2);

        if (model.userData.targetRotationY !== null) {
          model.rotation.y = (model.rotation.y + (model.userData.targetRotationY - model.rotation.y) * 0.1) % (Math.PI * 2);
        } else {
          model.rotation.y = model.userData.baseRotationY;
        }

        // Play sound when model comes to the front
        if (index === 0 && currentFrontModel !== model) {
          currentFrontModel = model;
          if (model.userData.sound) model.userData.sound.play();
        }
      });
    }

    function rotateModels(direction: number) {
      targetAngle += direction * (Math.PI * 2) / models.length;
      if (direction === -1) {
        models.push(models.shift() as THREE.Mesh);
      } else {
        models.unshift(models.pop() as THREE.Mesh);
      }
    }

    // ----------- ANIMATION LOOP -----------
    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      angle += (targetAngle - angle) * 0.05;
      time += 0.02;
      updateModelPositions();
      renderer.render(scene, camera);
    }
    animate();

    // ----------- RESIZE -----------
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // ----------- HOVER & CLICK INTERACTION -----------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handleMouseMove(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(models);

      models.forEach((model) => {
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
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    function handleClick() {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(models);
      if (intersects.length > 0) {
        const clickedModel = intersects[0].object as THREE.Mesh;
        if (clickedModel.userData.url) {
          window.open(clickedModel.userData.url, '_blank');
        }
      }
    }
    renderer.domElement.addEventListener('click', handleClick);

    // ----------- BUTTONS (React way!) -----------
    // (Buttons are rendered below as part of JSX)

    // ----------- CLEANUP -----------
    return () => {
      window.removeEventListener('resize', onWindowResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.clear();
      homeMusic.pause();
      homeMusic.currentTime = 0;
    };
  }, []);

  // Button handlers for rotation (these use refs for safety)
  const handleLeftClick = () => {
    const event = new Event("left-rotate");
    window.dispatchEvent(event);
  };
  const handleRightClick = () => {
    const event = new Event("right-rotate");
    window.dispatchEvent(event);
  };

  // Add window events to connect to rotateModels, inside useEffect
  useEffect(() => {
    function leftRotateListener() {
      const buttonSound = new Audio("/assets/sounds/+-click.wav");
      buttonSound.play();
      // These functions only exist inside the main useEffect. We can trigger rotation
      // using a ref or a cleaner stateful pattern if desired. For now, direct call:
      // But we need to find models, etc. So just put your rotation logic into a ref or context to share it.
    }
    function rightRotateListener() {
      const buttonSound = new Audio("/assets/sounds/+-click.wav");
      buttonSound.play();
    }
    window.addEventListener("left-rotate", leftRotateListener);
    window.addEventListener("right-rotate", rightRotateListener);
    return () => {
      window.removeEventListener("left-rotate", leftRotateListener);
      window.removeEventListener("right-rotate", rightRotateListener);
    };
  }, []);

    return (
    <div
        ref={mountRef}
        style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
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
            pointerEvents: "none", // So clicks pass through to 3D
        }}
        >
        <h1 style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            margin: "0 0 0.5rem 0",
            // color and font now come from styles.css (body rules)
        }}>
            Hi, I'm Edwin!
        </h1>
        <p style={{
            fontSize: "1.3rem",
            margin: 0,
            // color and font now come from styles.css
        }}>
            This site is under construction but check it out and lmk if you have any ideas! :)
        </p>
        </div>

        {/* Menu Buttons */}
        <button
        id="leftButton"
        onClick={() => {
            const buttonSound = new Audio("/assets/sounds/+-click.wav");
            buttonSound.play();
            // add rotation logic here
        }}
        >
        –
        </button>
        <button
        id="rightButton"
        onClick={() => {
            const buttonSound = new Audio("/assets/sounds/+-click.wav");
            buttonSound.play();
            // add rotation logic here
        }}
        >
        +
        </button>
    </div>
    );
}

export default WiiMenu;
