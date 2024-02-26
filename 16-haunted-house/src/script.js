import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
// House container
const house = new THREE.Group()
scene.add(house)
// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)

walls.position.y = 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)

roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
const door =  new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
)

door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)



// Alley
const alley = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 8),
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
alley.position.set(0, 0, 0) // Move the alley to the side of the house
scene.add(alley)

// Function to create a window with a frame
function createWindow(x, y, z, rotationY = 0) {
    // Window
    const windowGeometry = new THREE.PlaneGeometry(0.8, 1);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: '#007FFF', transparent: true, opacity: 1 }); // Increased opacity
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(x, y, z + 0.01); // Add a small offset to the z position
    window.rotation.y = rotationY;

    // Window frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#654321' }); // replace with your frame color
    const frameThickness = 0.05;
    const frame = new THREE.Group();
    const frameParts = ['top', 'bottom', 'left', 'right'];
    frameParts.forEach((part) => {
        const framePartGeometry = part === 'top' || part === 'bottom' ? new THREE.BoxGeometry(0.9, frameThickness, frameThickness) : new THREE.BoxGeometry(frameThickness, 1.1, frameThickness);
        const framePart = new THREE.Mesh(framePartGeometry, frameMaterial);
        if (part === 'top') framePart.position.y = 0.5;
        if (part === 'bottom') framePart.position.y = -0.5;
        if (part === 'left') framePart.position.x = -0.45;
        if (part === 'right') framePart.position.x = 0.45;
        frame.add(framePart);
    });
    frame.position.set(x, y, z + 0.01); // Add a small offset to the z position
    frame.rotation.y = rotationY;

    // Add window and frame to the house
    house.add(window, frame);
}

// Create windows for each face of the house
createWindow(1.3, 1, 1.99 + 0.05); // front top
createWindow(-1.3, 1, 1.99 + 0.05); // front bottom
createWindow(1.99 + 0.05, 1, 1, Math.PI / 2); // right top
createWindow(1.99 + 0.05, 1, -1, Math.PI / 2); // right bottom
createWindow(-1.99 + -0.05, 1, 1, -Math.PI / 2); // left top
createWindow(-1.99 + -0.05, 1, -1, -Math.PI / 2); // left bottom


// Chimney
const chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: '#3f3f3f' })
)
chimney.position.set(-1.5, 2.5, -1.5) // Move the chimney to the other side of the roof
house.add(chimney)

// Rocks
for(let i = 0; i < 10; i++) {
    const rock = new THREE.Mesh(
        new THREE.SphereGeometry(Math.random() * 0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: '#5a5a5a' })
    )
    rock.position.set(Math.random() * 10 - 5, 0.1, Math.random() * 10 - 5)
    scene.add(rock)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 1.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()