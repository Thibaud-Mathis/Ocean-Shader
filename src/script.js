import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

console.log(waterVertexShader);

/**
 * Loaders
 */
// conts glslLoader = 

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}
debugObject.depthColor = "#2477a7"
debugObject.surfaceColor = "#92dfdf"

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.u_DepthColor.value.set(debugObject.depthColor) }).name('depthColor')
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.u_SurfaceColor.value.set(debugObject.surfaceColor) }).name('surfaceColor')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: 
    {
        u_bigWavesElevations: { value: 0.2 },
        u_bigWavesFrequency: { value: new THREE.Vector2(3.0, 5.0) },
        u_time: { value: 0 },
        u_bigWaveSpeed: { value: 0.75 },

        u_DepthColor: { value: new THREE.Color('#2477a7')},
        u_SurfaceColor: { value: new THREE.Color('#92dfdf')},
        u_ColorMultiplier : { value: 5 },
        u_ColorOffset : { value: 0.5 },

        u_SmallWavesElevation: { value: 0.15 },
        u_SmallWavesFrequency: { value: 3 },
        u_SmallWavesSpeed: { value: 0.2 },
        u_SmallIterations: { value: 4.0 },
    }
})

gui.add(waterMaterial.uniforms.u_ColorMultiplier, 'value').min(0).max(10).step(0.001).name('color multiplier')
gui.add(waterMaterial.uniforms.u_ColorOffset, 'value').min(0).max(5).step(0.001).name('color offset')
gui.add(waterMaterial.uniforms.u_bigWavesElevations, 'value').min(0).max(1).step(0.00001).name('wave elevation')
gui.add(waterMaterial.uniforms.u_bigWavesFrequency.value, 'x').min(0).max(15).step(0.00001).name('wave frequency X')
gui.add(waterMaterial.uniforms.u_bigWavesFrequency.value, 'y').min(0).max(15).step(0.00001).name('wave frequency Y')
gui.add(waterMaterial.uniforms.u_bigWaveSpeed, 'value').min(0).max(5).step(0.00001).name('wave speed')
gui.add(waterMaterial.uniforms.u_SmallWavesElevation, 'value').min(0.0).max(1.0).step(0.00001).name('Small wave elevation')
gui.add(waterMaterial.uniforms.u_SmallWavesFrequency, 'value').min(0).max(10).step(0.00001).name('Small wave Frequency')
gui.add(waterMaterial.uniforms.u_SmallWavesSpeed, 'value').min(0).max(1).step(0.00001).name('Small wave Speed')
gui.add(waterMaterial.uniforms.u_SmallIterations, 'value').min(0).max(5).step(1.0).name('Small wave iteration')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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
    waterMaterial.uniforms.u_time.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()