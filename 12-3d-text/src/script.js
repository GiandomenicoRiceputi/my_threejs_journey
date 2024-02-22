import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

// Constants
const DONUT_COUNT = 100;

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/8.png");
matcapTexture.encoding = THREE.sRGBEncoding;

// Fonts
const fontLoader = new FontLoader();

// Create an array to store the donuts and the letters
let donuts = [];
let letters = [];

// Create donut
function createDonut(geometry, material) {
  const donut = new THREE.Mesh(geometry, material);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  scene.add(donut);
  donuts.push(donut); // Add the donut to the array
}

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  for (let i = 0; i < DONUT_COUNT; i++) {
    createDonut(donutGeometry, material);
  }

  const text = "Iris Rocks!";
  const letterPositions = Array.from(text).map(
    (_, i) => i - (text.length / 2) * 0.6,
  );

  Array.from(text).forEach((char, i) => {
    const letterGeometry = new TextGeometry(char, {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 3,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
    });

    letterGeometry.computeBoundingBox();
    letterGeometry.center();

    const letter = new THREE.Mesh(letterGeometry, material);
    letter.position.x = letterPositions[i];
    scene.add(letter);
    letters.push(letter);
  });
});

// Sizes
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate donuts
  for (let donut of donuts) {
    donut.rotation.x += Math.sin(elapsedTime) * 0.01;
    donut.rotation.y += Math.cos(elapsedTime) * 0.01;
  }

  // Animate letters
  for (let letter of letters) {
    letter.rotation.y += 0.01;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
