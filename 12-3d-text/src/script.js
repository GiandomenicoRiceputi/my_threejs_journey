import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "../static/fonts/helvetiker_regular.typeface.json";

// Constants
const DONUT_COUNT = 100;
const DONUT_SIZE = 0.3;
const DONUT_THICKNESS = 0.2;
const DONUT_SEGMENTS = 32;
const DONUT_RINGS = 64;
const ROTATION_SPEED = 0.003; // Add this line

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/1.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// Fonts
const fontLoader = new FontLoader();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setClearColor(0xffffff);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

// Donuts array
let donuts = [];

// Functions
function createDonut(material) {
  const donutGeometry = new THREE.TorusGeometry(
    DONUT_SIZE,
    DONUT_THICKNESS,
    DONUT_SEGMENTS,
    DONUT_RINGS,
  );
  const donut = new THREE.Mesh(donutGeometry, material);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  return donut;
}

function createText(material, font) {
  const textGeometry = new TextGeometry("Iris Is Beautifull", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const text = new THREE.Mesh(textGeometry, material);
  return text;
}

function animateDonuts() {
  donuts.forEach((donut) => {
    donut.rotation.x += ROTATION_SPEED;
    donut.rotation.y += ROTATION_SPEED;
  });
}

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = createText(material, font);
  scene.add(text);

  for (let i = 0; i < DONUT_COUNT; i++) {
    const donut = createDonut(material);
    scene.add(donut);
    donuts.push(donut);
  }
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  animateDonuts();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
