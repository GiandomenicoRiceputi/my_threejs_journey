import * as THREE from 'three'

/**
 * Function to calculate horizontal field of view
 * @param {number} verticalFOV - The vertical field of view in degrees
 * @param {number} aspectRatio - The aspect ratio (width / height)
 * @returns {number} - The calculated horizontal field of view in degrees
 */
function calculateHorizontalFOV(verticalFOV, aspectRatio) {
    const verticalFOVInRadians = verticalFOV * (Math.PI / 180)
    const horizontalFOVInRadians = 2 * Math.atan(Math.tan(verticalFOVInRadians / 2) * aspectRatio)
    const horizontalFOV = horizontalFOVInRadians * (180 / Math.PI)
    return horizontalFOV
}

/**
 * Scene class that wraps the THREE.Scene
 */
class Scene {
    constructor() {
        this.scene = new THREE.Scene()
    }

    /**
     * Adds an object to the scene
     * @param {THREE.Object3D} object - The object to add
     */
    add(object) {
        this.scene.add(object)
    }

    /**
     * Returns the underlying THREE.Scene
     * @returns {THREE.Scene}
     */
    get() {
        return this.scene
    }
}

/**
 * Box class that wraps the creation of a THREE.Mesh with a box geometry and basic material
 */
class Box {
    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: "deeppink" })
        this.mesh = new THREE.Mesh(geometry, material)
    }

    /**
     * Returns the underlying THREE.Mesh
     * @returns {THREE.Mesh}
     */
    get() {
        return this.mesh
    }
}

/**
 * Camera class that wraps the THREE.PerspectiveCamera
 */
class Camera {
    constructor(width, height) {
        this.aspectRatio = width / height
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio)
        this.camera.position.z = 3
    }

    /**
     * Updates the aspect ratio of the camera
     * @param {number} width - The new width
     * @param {number} height - The new height
     */
    updateAspectRatio(width, height) {
        this.aspectRatio = width / height
        this.camera.aspect = this.aspectRatio
        this.camera.fov = calculateHorizontalFOV(75, this.aspectRatio)
        this.camera.updateProjectionMatrix()
    }

    /**
     * Returns the underlying THREE.PerspectiveCamera
     * @returns {THREE.PerspectiveCamera}
     */
    get() {
        return this.camera
    }
}

/**
 * Renderer class that wraps the THREE.WebGLRenderer
 */
class Renderer {
    constructor(canvas, width, height) {
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas })
        this.updateSize(width, height)
    }

    /**
     * Updates the size of the renderer
     * @param {number} width - The new width
     * @param {number} height - The new height
     */
    updateSize(width, height) {
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    /**
     * Renders the scene with the camera
     * @param {THREE.Scene} scene - The scene to render
     * @param {THREE.PerspectiveCamera} camera - The camera to use for rendering
     */
    render(scene, camera) {
        this.renderer.render(scene, camera)
    }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new Scene()

// Box
const box = new Box()
scene.add(box.get())

// Camera
const camera = new Camera(sizes.width, sizes.height)
scene.add(camera.get())

// Renderer
const renderer = new Renderer(canvas, sizes.width, sizes.height)

// Render
renderer.render(scene.get(), camera.get())

// Resize Event
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.updateAspectRatio(sizes.width, sizes.height)

    // Update renderer
    renderer.updateSize(sizes.width, sizes.height)

    // Render
    renderer.render(scene.get(), camera.get())
})