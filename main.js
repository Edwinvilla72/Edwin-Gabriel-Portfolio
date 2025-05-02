// Import Three.js core methods and classes

import * as THREE from 'three'; // three is a free open soursce library used to create and display animated 3d graphics in a web browser
// a 3d model format that is suitable for web applications because it only contains the model relevant data 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// global variables
let scene, camera, renderer;
let models = [];
let angle = 0;
const radius = 5;
const centerOffset = 2;
let targetAngle = 0;
let hoverLight = null;
let time = 0; // Track time for float animation
let currentFrontModel = null; // Track the front-most model

// hover sound effect: 3DS-ui6.ogg
const hoverSound = new Audio('assets/sounds/3DS-ui6.wav');
hoverSound.onerror = () => console.error('Failed to load hover sound');

// Button click sound effect
const buttonSound = new Audio('assets/sounds/+-click.wav');
buttonSound.onerror = () => console.error('Failed to load button click sound');

// home menu music (for now )
const homeMusic = new Audio('assets/sounds/wiiMenu.wav');
homeMusic.onerror = () => console.error('Failed to load menu music');

// Load sound effects for each model
const selectSounds = [
    //TODO new Audio('assets/sounds/aboutMe.wav'),
    new Audio('select-sound2.mp3'),
    new Audio('select-sound3.mp3'),
    new Audio('select-sound4.mp3'),
    new Audio('select-sound5.mp3')
];

// Initialize the scene
function init() {
    // creating a THREE.js scene
    scene = new THREE.Scene();

    // plays home music on opening the application
    homeMusic.play();

    // creates a camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    // renders the models
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renders shadows
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.addEventListener('pointerdown', (event) => {
        renderer.domElement.setPointerCapture(event.pointerId);
    });
    document.body.appendChild(renderer.domElement);

    camera.position.z = 8;  // how far the camera is from the objects
    camera.position.y = 1.2; // Raise camera height for better visibility
    camera.lookAt(0, 0, 0);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xaaaaa, 1); // Increase brightness
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8); // Increase intensity
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create hover light
    hoverLight = new THREE.PointLight(0xffffff, 0, 10); // Start with intensity 0
    hoverLight.userData.targetIntensity = 0; // Initialize targetIntensity
    scene.add(hoverLight);

    // Create placeholder models (boxes in this case)
    const geometry = new THREE.BoxGeometry();
    // Use THREE.DoubleSide so that raycasting detects all faces
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    const urls = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3',
        'https://example.com/page4',
        'https://example.com/page5'
    ];

    for (let i = 0; i < 5; i++) {
        const model = new THREE.Mesh(geometry, material);
        model.scale.set(1, 1, 1); // Ensure all models start at the same size
        model.userData.originalScale = new THREE.Vector3(1, 1, 1);
        model.userData.targetScale = new THREE.Vector3(1, 1, 1);
        model.userData.targetRotationY = null; // Start with no target rotation
        model.userData.baseRotationY = Math.random() * Math.PI * 2; // Random starting rotation
        model.userData.url = urls[i]; // Assign URL
        model.userData.sound = selectSounds[i]; // Assign unique sound
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        models.push(model);
    }

    // Set initial positions
    updateModelPositions();

    // Add HTML buttons
    const leftButton = document.createElement('button');
    leftButton.innerText = '-';
    leftButton.style.position = 'absolute';
    leftButton.style.left = '350px';
    leftButton.style.top = '50%';
    leftButton.style.transform = 'translateY(-50%)';
    document.body.appendChild(leftButton);

    const rightButton = document.createElement('button');
    rightButton.innerText = '+';
    rightButton.style.position = 'absolute';
    rightButton.style.right = '350px';
    rightButton.style.top = '50%';
    rightButton.style.transform = 'translateY(-50%)';
    document.body.appendChild(rightButton);

    leftButton.addEventListener('click', () => {
        buttonSound.currentTime = 0;
        buttonSound.play();
        rotateModels(1);
    });
    rightButton.addEventListener('click', () => {
        buttonSound.currentTime = 0;
        buttonSound.play();
        rotateModels(-1);
    });

    // Add raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(models);

        models.forEach((model) => {
            if (intersects.some((intersect) => intersect.object === model)) {
                // Play hover sound only once when the model is first hovered over
                if (!model.userData.isHovered) {
                    model.userData.isHovered = true;
                    hoverSound.currentTime = 0; // Reset playback position
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
                model.userData.isHovered = false; // Reset flag when not hovered
            }
        });
    });

    // Add click handling
    window.addEventListener('click', (event) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(models);

        if (intersects.length > 0) {
            const clickedModel = intersects[0].object;
            if (clickedModel.userData.url) {
                window.open(clickedModel.userData.url, '_blank');
            }
        }
    });

    animate();
}

// Update the positions based on the angle
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
            model.userData.sound.play();
        }
    });
}

function rotateModels(direction) {
    targetAngle += direction * (Math.PI * 2) / models.length;
    if (direction === -1) {
        models.push(models.shift());
    } else {
        models.unshift(models.pop());
    }
}

function animate() {
    requestAnimationFrame(animate);
    angle += (targetAngle - angle) * 0.05;
    time += 0.02;
    updateModelPositions();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
