import * as THREE from "three";

// Setup scene
export function setupScene() {
  const scene = new THREE.Scene();

  const cube = createResponsiveCube();
  scene.add(cube);
  
  scene.responsiveCube = cube;

  return scene;
}

// Create size adjusting cube
function createResponsiveCube() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const width = Math.min(window.innerWidth / 300);
  const height = Math.min(window.innerHeight / 300);
  const depth = 0.1;

  console.log(`Aspect Ratio: ${aspectRatio}, Cube Size: ${width} x ${height} x ${depth}`);
  
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.z = -1;
  
  return cube;
}

// Update cube scale on resize
export function updateCubeScale(scene) {
  if (scene.responsiveCube) {
    scene.remove(scene.responsiveCube);
    scene.responsiveCube = createResponsiveCube();
    scene.add(scene.responsiveCube);
  }
}
