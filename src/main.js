import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCamera, setupRenderer, setupScene } from './setup.js'

// Initialize
const scene = setupScene()
const camera = setupCamera()
const renderer = setupRenderer()

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
