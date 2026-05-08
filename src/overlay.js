// Create camera overlay
const INSETS = [5, 7]

export function setupCameraOverlay(camera) {
  const overlay = document.createElement('div');
  overlay.id = 'camera-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 3px solid rgba(255, 255, 255, 0.8);
    box-sizing: border-box;
    z-index: 10;
  `;
  
  overlay.camera = camera;
  
  // Add corner markers (viewfinder corners)
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  corners.forEach(corner => {
    const cornerEl = document.createElement('div');
    cornerEl.className = 'camera-corner';
    cornerEl.style.cssText = `
      position: absolute;
      border: 2px solid rgba(255, 255, 255, 0.9);
      z-index: 11;
    `;
    
    if (corner === 'top-left') {
      cornerEl.style.cssText += `top: min(${INSETS[1]}vw, ${INSETS[1]}vh); left: min(${INSETS[1]}vw, ${INSETS[1]}vh); border-right: none; border-bottom: none;`;
    } else if (corner === 'top-right') {
      cornerEl.style.cssText += `top: min(${INSETS[1]}vw, ${INSETS[1]}vh); right: min(${INSETS[1]}vw, ${INSETS[1]}vh); border-left: none; border-bottom: none;`;
    } else if (corner === 'bottom-left') {
      cornerEl.style.cssText += `bottom: min(${INSETS[1]}vw, ${INSETS[1]}vh); left: min(${INSETS[1]}vw, ${INSETS[1]}vh); border-right: none; border-top: none;`;
    } else if (corner === 'bottom-right') {
      cornerEl.style.cssText += `bottom: min(${INSETS[1]}vw, ${INSETS[1]}vh); right: min(${INSETS[1]}vw, ${INSETS[1]}vh); border-left: none; border-top: none;`;
    }
    
    overlay.appendChild(cornerEl);
  });
  
  // Add inner border frame pushed up further
  const innerFrame = document.createElement('div');
  innerFrame.style.cssText = `
    position: absolute; 
    inset: min(${INSETS[0]}vw, ${INSETS[0]}vh);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    z-index: 9;
    pointer-events: none;
  `;
  overlay.appendChild(innerFrame);
  
  // Add center crosshair
  const crosshair = document.createElement('div');
  crosshair.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    z-index: 11;
  `;
  overlay.appendChild(crosshair);
  
  // Add center dot
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    z-index: 12;
  `;
  overlay.appendChild(dot);
  
  // Add zoom/distance display
  const zoomDisplay = document.createElement('div');
  zoomDisplay.id = 'zoom-display';
  zoomDisplay.style.cssText = `
    position: absolute;
    bottom: 1vh;
    left: 3vw;
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
    font-size: 12px;
    z-index: 11;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  `;
  overlay.appendChild(zoomDisplay);
  
  // Add camera info (top right)
  const cameraInfo = document.createElement('div');
  cameraInfo.id = 'camera-info';
  cameraInfo.style.cssText = `
    position: absolute;
    top: 1vh;
    right: 2vh;
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
    font-size: 12px;
    z-index: 11;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  `;
  overlay.appendChild(cameraInfo);
  
  document.body.appendChild(overlay);
  
  return overlay;
}

// Update overlay on resize and camera zoom
export function updateCameraOverlay(camera) {
  const overlay = document.getElementById('camera-overlay');
  if (overlay && camera) {
    const corners = overlay.querySelectorAll('.camera-corner');
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.08;
    
    corners.forEach(corner => {
      corner.style.width = `${size}px`;
      corner.style.height = `${size}px`;
    });
    
    // Update zoom display based on camera position
    const zoomDisplay = document.getElementById('zoom-display');
    if (zoomDisplay) {
      const distance = camera.position.length().toFixed(2);
      const zoomLevel = (1 / distance).toFixed(1);
      zoomDisplay.textContent = `DISTANCE: ${distance}\nZOOM: ${zoomLevel}x`;
    }
    
    // Update camera info
    const cameraInfo = document.getElementById('camera-info');
    if (cameraInfo) {
      const fov = camera.fov.toFixed(0);
      const aspect = (window.innerWidth / window.innerHeight).toFixed(2);
      cameraInfo.textContent = `FOV: ${fov}°\nASPECT: ${aspect}`;
    }
  }
}
