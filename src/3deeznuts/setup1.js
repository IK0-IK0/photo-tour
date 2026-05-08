import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Setup camera
export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 1.1
  return camera
}

// Setup renderer
export function setupRenderer() {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  return renderer
}

// Setup orbit controls
export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement)
  // General Stuff
  controls.target.set(0, 0, 1)
  controls.distance = 1
  controls.autoRotate = false
  controls.enableDamping = false
  controls.dampingFactor = 0.025
  controls.zoomSpeed = 5
  controls.panSpeed = 0
  
  
  // Horizontal rotation
  controls.minAzimuthAngle = -Math.PI / 8 
  controls.maxAzimuthAngle = Math.PI / 8

  // Vertical rotation
  controls.minPolarAngle = Math.PI / 3
  controls.maxPolarAngle = 2 * Math.PI / 3
  
  // Zoom
  controls.minDistance = 0.1
  controls.maxDistance = 1.5
  controls.rotateSpeed = 0.5

  controls.update()
  
  controls.dollyIn = function(zoomScale) {
    if (this.object.isPerspectiveCamera) {
      this.object.position.multiplyScalar(Math.pow(0.95, zoomScale));
    }
  };
  
  controls.dollyOut = function(zoomScale) {
    if (this.object.isPerspectiveCamera) {
      this.object.position.multiplyScalar(Math.pow(1.05, zoomScale));
    }
  };
  
  return controls
}


// Setup lighting
export function setupLighting(scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  scene.add(directionalLight)
  
  return { ambientLight, directionalLight }
}
