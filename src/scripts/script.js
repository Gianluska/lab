import "../styles/main.css";
import "../styles/reset.css";

import githubIcon from "../assets/images/github.png";
import arrowIcon from "../assets/images/arrow.png";

document.querySelector("#githubIcon").src = githubIcon;
document.querySelector("#arrowIcon").src = arrowIcon;

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("#webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

let character = null;
const fbxLoader = new FBXLoader();
let mixer = null;
fbxLoader.load("/models/Idle.fbx", (fbx) => {
  console.log(fbx)
  character = fbx;
  character.position.z = -1.3;
  character.position.y = -1.5;
  character.position.x = -0.6;
  character.scale.set(0.01, 0.01, 0.01);
  character.rotateY(0.6);
  character.rotateX(0.2);

  mixer = new THREE.AnimationMixer(character);
  const idle = mixer.clipAction(character.animations[0]);
  idle.play();
  scene.add(character);
});

// const gltfLoader = new GLTFLoader();
// gltfLoader.load('/models/character.glb', (gltf) => {
//   console.log(gltf)
//   scene.add(gltf.scene)
// })

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
  0xffffff,
  0.7
);
directionalLight.position.set(1, 0, 4);
scene.add(directionalLight);

/**
 * Objects
 */

const sphereGeometry = new THREE.SphereBufferGeometry(1, 2, 2);
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

const geometriesArray = [sphereGeometry, boxGeometry];
console.log(Math.random() * 4);

const boxMaterial = new THREE.MeshBasicMaterial({
  color: "#e57373",
  wireframe: true,
  opacity: 0.1,
  transparent: true,
});
let boxMeshArray = new Array(80);

const geometryGroup = new THREE.Group();

for (let i = 0; i < boxMeshArray.length; i++) {
  const geometry =
    geometriesArray[Math.floor(Math.random() * geometriesArray.length)];
  boxMeshArray[i] = new THREE.Mesh(geometry, boxMaterial);

  boxMeshArray[i].position.x = (Math.random() - 0.5) * 3;
  boxMeshArray[i].position.y = (Math.random() - 0.5) * 3;
  boxMeshArray[i].position.z = Math.min((Math.random() - 0.5) * 3, -2);
  boxMeshArray[i].scale.set(0.2, 0.2, 0.2);

  geometryGroup.add(boxMeshArray[i]);
}

scene.add(geometryGroup);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse move
 */

const mouse = new THREE.Vector2();
let previousMousePosition = 0;
console.log(sizes.width / 1000);

const onMouseMove = (event) => {
  mouse.x = event.clientX - sizes.width / 2;
  mouse.y = event.clientY - sizes.height / 2;

  // Move character
  if (character) {
    if (mouse.x > previousMousePosition) {
      character.rotateY(0.003);
      previousMousePosition = mouse.x;
    } else {
      character.rotateY(-0.003);
      previousMousePosition = mouse.x;
    }
  }
};

document.addEventListener("mousemove", onMouseMove, false);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#222626");
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.NoToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  for (let i = 0; i < boxMeshArray.length; i++) {
    boxMeshArray[i].rotateY(Math.cos(elapsedTime) * 0.00005 * i);
    boxMeshArray[i].rotateZ(Math.cos(elapsedTime) * 0.00005 * i);
    boxMeshArray[i].rotateX(Math.cos(elapsedTime) * 0.00005 * i);
    boxMeshArray[i].position.y += Math.sin(elapsedTime + i) * 0.0005;
  }

  if (mixer) {
    mixer.update(deltaTime);
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
