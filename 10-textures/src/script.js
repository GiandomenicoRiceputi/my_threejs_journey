import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * This script is used to create a 3D scene using THREE.js.
 * It includes the creation of a 3D object, loading textures, setting up a camera and rendering the scene.
 */

/**
 * Base
 */
// Canvas
// Select the canvas with the class 'webgl'
const canvas = document.querySelector('canvas.webgl')

// Scene
// Create a new THREE.js scene
const scene = new THREE.Scene()

/**
 * Textures
 */
// Create a loading manager to handle the loading of textures
const loadingManager = new THREE.LoadingManager()
// Log when the loading starts
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
// Log when the loading finishes
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
// Log the progress of the loading
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
// Log if there is an error during loading
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}

// Create a texture loader with the loading manager
const textureLoader = new THREE.TextureLoader(loadingManager)

// Load a texture and log the progress and completion
const colorTexture = textureLoader.load(
    '/textures/minecraft.png',
    () =>
    {
        console.log('textureLoader: loading finished')
    },
    () =>
    {
        console.log('textureLoader: loading progressing')
    },
    () =>
    {
        console.log('textureLoader: loading error')
    }
)

// Set the properties of the texture
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

// Load additional textures
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Object
 */
// Create a box geometry and a material with the color texture
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
// Create a mesh with the geometry and material and add it to the scene
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
// Set the initial sizes based on the window's inner width and height
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Update the sizes, camera and renderer when the window is resized
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
// Create a perspective camera and add it to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Create controls for the camera
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
// Create a WebGL renderer with the canvas
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
// Set the size and pixel ratio of the renderer
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// Create a clock to handle time
const clock = new THREE.Clock()

// Create a function to animate the scene
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render the scene with the camera
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// Start the animation
tick()