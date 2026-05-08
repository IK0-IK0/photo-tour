import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCamera, setupRenderer, setupControls, setupLighting } from './3deeznuts/setup1.js'
import { setupScene, updateCubeScale } from './3deeznuts/scene1.js'
import { setupCameraOverlay, updateCameraOverlay } from './overlay.js'

// Initialize
const scene = setupScene()
const camera = setupCamera()
const renderer = setupRenderer()
const controls = setupControls(camera, renderer)
setupLighting(scene)
setupCameraOverlay(camera)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  updateCameraOverlay(camera)
  renderer.render(scene, camera)
}
animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  updateCubeScale(scene)
  updateCameraOverlay(camera)
})
