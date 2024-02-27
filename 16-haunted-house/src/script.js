/**
 * Importing necessary modules from three.js and lil-gui
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base setup for the scene
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
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

bricksColorTexture.colorSpace = THREE.SRGBColorSpace

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
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
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

const door =  new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial(
        {
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughnessMap: doorRoughnessTexture
        }
    )
)

door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

house.add(doorLight)

/**
 *  Fog
 */
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

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
    new THREE.BoxGeometry(0.5, 0.1, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
alley.position.set(0, 0, 2) // Move the alley to the side of the house
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

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const y = Math.random() - 0.5

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, y, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true

    graves.add(grave)
}

// Floor
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.colorSpace = THREE.SRGBColorSpace
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Ghost
 */
const ghost1 = new THREE.PointLight('#ff00ff', 6, 3)
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 6, 3)
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 6, 3)
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

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
 * Here we are setting the position of the camera in the 3D space.
 * We are also adding the camera to the scene.
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

/**
 * Controls
 * Here we are creating controls for the camera using OrbitControls.
 * We are enabling damping which makes the controls smooth.
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 * Here we are creating a WebGL renderer.
 * We are setting the size of the renderer to the window size.
 * We are setting the pixel ratio to the minimum of the device pixel ratio and 2.
 * We are enabling shadow map and setting the type to PCFSoftShadowMap.
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 * Here we are creating a clock to keep track of time.
 * We are creating a function tick that will be called on every frame.
 * In this function, we are updating the positions of the ghosts based on the elapsed time.
 * We are also updating the controls and rendering the scene.
 * At the end of the function, we are requesting the next animation frame and calling tick again.
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

