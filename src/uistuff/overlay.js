import * as THREE from 'three'

const CONFIG = {
  // Border insets
  INSETS: [5, 7],
  
  // UI element positioning
  UI_PADDING: 15,
  FOV_OFFSET: 10,
  FLASH_OFFSET: 10,
  FLASH_TOP_SPACING: 40,
  
  // Scaling
  ZOOM_BAR_HEIGHT: 100,
  COMPASS_WIDTH: 150,
  SCALE_MIN: 0.7,
  SCALE_MAX: 1.2,
  COMPASS_SCALE_MAX: 1.5,
  SCALE_REFERENCE: 800,
  COMPASS_SCALE_REFERENCE: 1000,
  
  // Compass behavior
  COMPASS_SENSITIVITY: 3,
  COMPASS_OFFSET: 10,
  
  // Crosshair
  CROSSHAIR_SIZE: 40,
  CROSSHAIR_LINE_LENGTH: 20,
  
  // Corner markers
  CORNER_SIZE_FACTOR: 0.08
}

// Create camera overlay
const INSETS = CONFIG.INSETS

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
  
  // Add corner markers
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
  
  // Add inner border frame
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
    width: ${CONFIG.CROSSHAIR_SIZE}px;
    height: ${CONFIG.CROSSHAIR_SIZE}px;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    z-index: 11;
  `;
  
  // Add crosshair lines
  const crosshairH = document.createElement('div');
  crosshairH.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${CONFIG.CROSSHAIR_LINE_LENGTH}px;
    height: 1px;
    background: rgba(255, 255, 255, 0.6);
  `;
  crosshair.appendChild(crosshairH);
  
  const crosshairV = document.createElement('div');
  crosshairV.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1px;
    height: ${CONFIG.CROSSHAIR_LINE_LENGTH}px;
    background: rgba(255, 255, 255, 0.6);
  `;
  crosshair.appendChild(crosshairV);
  
  overlay.appendChild(crosshair);
  
  // Add center dot
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    z-index: 12;
  `;
  overlay.appendChild(dot);
  
  // Add visual zoom indicator (left side, vertical bar)
  const zoomContainer = document.createElement('div');
  zoomContainer.id = 'zoom-indicator';
  zoomContainer.className = 'camera-ui-element';
  zoomContainer.style.cssText = `
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 11;
  `;
  
  // Zoom icon using Font Awesome
  const zoomIcon = document.createElement('i');
  zoomIcon.className = 'fas fa-search-plus';
  zoomIcon.style.cssText = `
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  `;
  
  // Zoom bar container (vertical)
  const zoomBarContainer = document.createElement('div');
  zoomBarContainer.style.cssText = `
    width: 6px;
    height: ${CONFIG.ZOOM_BAR_HEIGHT}px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.4);
  `;
  
  const zoomBar = document.createElement('div');
  zoomBar.id = 'zoom-bar';
  zoomBar.style.cssText = `
    width: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));
    border-radius: 2px;
    height: 50%;
    transition: height 0.1s ease;
    position: absolute;
    bottom: 0;
  `;
  zoomBarContainer.appendChild(zoomBar);
  
  zoomContainer.appendChild(zoomIcon);
  zoomContainer.appendChild(zoomBarContainer);
  overlay.appendChild(zoomContainer);
  
  // Add flash indicator (top left, inside inner border)
  const flashIndicator = document.createElement('div');
  flashIndicator.id = 'flash-indicator';
  flashIndicator.className = 'camera-ui-element';
  flashIndicator.style.cssText = `
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 11;
  `;
  
  // Flash icon using Font Awesome
  const flashIcon = document.createElement('i');
  flashIcon.className = 'fas fa-bolt';
  flashIcon.style.cssText = `
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  `;
  
  const flashText = document.createElement('span');
  flashText.style.cssText = `
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
    font-size: 11px;
    letter-spacing: 0.5px;
  `;
  flashText.textContent = 'AUTO';
  
  flashIndicator.appendChild(flashIcon);
  flashIndicator.appendChild(flashText);
  overlay.appendChild(flashIndicator);
  
  // Add direction compass (bottom center, inside inner border)
  const compassContainer = document.createElement('div');
  compassContainer.id = 'compass-container';
  compassContainer.className = 'camera-ui-element';
  compassContainer.style.cssText = `
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    z-index: 11;
  `;
  
  // Compass dial (longer)
  const compassDial = document.createElement('div');
  compassDial.style.cssText = `
    width: ${CONFIG.COMPASS_WIDTH}px;
    height: 20px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  `;
  
  // Compass strip with lines instead of text
  const compassStrip = document.createElement('div');
  compassStrip.id = 'compass-strip';
  compassStrip.style.cssText = `
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    transform: translateX(${CONFIG.COMPASS_OFFSET}px);
  `;
  
  // Create tick marks (lines) for compass - start from center with a main direction
  // 360 degrees, tick every 5 degrees
  // Start with offset so first tick is a main direction (bigger line)
  for (let i = 0; i < 72; i++) {
    const tick = document.createElement('div');
    const isMainDirection = i % 9 === 0; // Every 45 degrees (8 main directions)
    const isMidDirection = i % 4.5 === 0 && !isMainDirection; // Every 22.5 degrees
    
    tick.style.cssText = `
      width: 1px;
      height: ${isMainDirection ? '12px' : isMidDirection ? '8px' : '5px'};
      background: rgba(255, 255, 255, ${isMainDirection ? '0.9' : isMidDirection ? '0.7' : '0.5'});
      margin: 0 4px;
    `;
    compassStrip.appendChild(tick);
  }
  
  compassDial.appendChild(compassStrip);
  
  // Center indicator
  const centerIndicator = document.createElement('div');
  centerIndicator.style.cssText = `
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid rgba(255, 100, 100, 0.9);
    z-index: 1;
  `;
  compassDial.appendChild(centerIndicator);
  
  compassContainer.appendChild(compassDial);
  overlay.appendChild(compassContainer);
  
  // Add camera info (top right, inside inner border)
  const cameraInfo = document.createElement('div');
  cameraInfo.id = 'camera-info';
  cameraInfo.className = 'camera-ui-element';
  cameraInfo.style.cssText = `
    position: absolute;
    color: rgba(255, 255, 255, 0.9);
    font-family: monospace;
    font-size: 14px;
    z-index: 11;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.9);
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  // FOV icon using Font Awesome
  const fovIcon = document.createElement('i');
  fovIcon.className = 'fas fa-eye';
  fovIcon.style.cssText = `
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  `;
  cameraInfo.appendChild(fovIcon);
  
  const fovText = document.createElement('span');
  fovText.id = 'fov-text';
  cameraInfo.appendChild(fovText);
  
  overlay.appendChild(cameraInfo);
  
  // Add grid lines (rule of thirds)
  for (let i = 1; i <= 2; i++) {
    const vLine = document.createElement('div');
    vLine.style.cssText = `
      position: absolute;
      top: 0;
      bottom: 0;
      left: ${(i * 33.33)}%;
      width: 1px;
      background: rgba(255, 255, 255, 0.15);
      z-index: 8;
    `;
    overlay.appendChild(vLine);
    
    const hLine = document.createElement('div');
    hLine.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      top: ${(i * 33.33)}%;
      height: 1px;
      background: rgba(255, 255, 255, 0.15);
      z-index: 8;
    `;
    overlay.appendChild(hLine);
  }
  
  document.body.appendChild(overlay);
  
  return overlay;
}

// Update overlay on resize and camera zoom
export function updateCameraOverlay(camera) {
  const overlay = document.getElementById('camera-overlay');
  if (overlay && camera) {
    const corners = overlay.querySelectorAll('.camera-corner');
    const size = Math.min(window.innerWidth, window.innerHeight) * CONFIG.CORNER_SIZE_FACTOR;
    
    corners.forEach(corner => {
      corner.style.width = `${size}px`;
      corner.style.height = `${size}px`;
    });
    
    // Calculate inner border offset dynamically
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const insetValue = (INSETS[0] / 100) * viewportMin;
    const cornerInsetValue = (INSETS[1] / 100) * viewportMin;
    const padding = CONFIG.UI_PADDING;
    
    // Scale factor based on viewport size
    const scaleFactor = Math.max(CONFIG.SCALE_MIN, Math.min(CONFIG.SCALE_MAX, viewportMin / CONFIG.SCALE_REFERENCE));
    
    // Position UI elements relative to inner border
    const zoomIndicator = document.getElementById('zoom-indicator');
    if (zoomIndicator) {
      const leftPos = insetValue + padding;
      const topPos = window.innerHeight / 2 - (60 * scaleFactor); // Center vertically
      zoomIndicator.style.left = `${leftPos}px`;
      zoomIndicator.style.top = `${topPos}px`;
      
      // Scale zoom bar height
      const zoomBarContainer = zoomIndicator.querySelector('div:last-child');
      if (zoomBarContainer) {
        zoomBarContainer.style.height = `${CONFIG.ZOOM_BAR_HEIGHT * scaleFactor}px`;
      }
    }
    
    const flashIndicator = document.getElementById('flash-indicator');
    if (flashIndicator) {
      // Position inside the inner border
      const rightPos = insetValue + padding + CONFIG.FLASH_OFFSET;
      const topPos = insetValue + padding + (CONFIG.FLASH_TOP_SPACING * scaleFactor) + CONFIG.FLASH_OFFSET; // Below FOV
      flashIndicator.style.right = `${rightPos}px`;
      flashIndicator.style.top = `${topPos}px`;
    }
    
    const compassContainer = document.getElementById('compass-container');
    if (compassContainer) {
      const bottomPos = insetValue + padding;
      compassContainer.style.bottom = `${bottomPos}px`;
      compassContainer.style.left = '50%';
      compassContainer.style.transform = 'translateX(-50%)';
      
      // Scale compass width based on screen width
      const widthScaleFactor = Math.max(CONFIG.SCALE_MIN, Math.min(CONFIG.COMPASS_SCALE_MAX, window.innerWidth / CONFIG.COMPASS_SCALE_REFERENCE));
      const compassDial = compassContainer.querySelector('div');
      if (compassDial) {
        compassDial.style.width = `${CONFIG.COMPASS_WIDTH * widthScaleFactor}px`;
      }
    }
    
    const cameraInfo = document.getElementById('camera-info');
    if (cameraInfo) {
      // Position inside the inner border
      const rightPos = insetValue + padding + CONFIG.FOV_OFFSET;
      const topPos = insetValue + padding + (CONFIG.FOV_OFFSET * scaleFactor);
      cameraInfo.style.right = `${rightPos}px`;
      cameraInfo.style.top = `${topPos}px`;
    }
    
    // Update zoom bar based on camera distance from target
    const zoomBar = document.getElementById('zoom-bar');
    if (zoomBar) {
      // Calculate distance from camera to target (0, 0, 1)
      const target = new THREE.Vector3(0, 0, 1);
      const distance = camera.position.distanceTo(target);
      
      // Map distance to zoom percentage based on OrbitControls limits
      const minDist = 0.1;  // minDistance from controls
      const maxDist = 1.5;  // maxDistance from controls
      const normalizedDist = Math.max(0, Math.min(1, (distance - minDist) / (maxDist - minDist)));
      const zoomPercent = (1 - normalizedDist) * 100; // Invert so closer = higher percentage
      zoomBar.style.height = `${zoomPercent}%`;
    }
    
    // Update compass direction based on camera rotation
    const compassStrip = document.getElementById('compass-strip');
    if (compassStrip) {
      // Get camera's azimuth angle (horizontal rotation)
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      
      // Calculate angle in degrees (0 = North, 90 = East, etc.)
      let angle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
      angle = (angle + 360) % 360; // Normalize to 0-360
      
      // Map angle to compass position with higher sensitivity
      // 72 ticks, 5px per tick (1px width + 4px margin)
      const pixelsPerDegree = (72 * 5) / 360;
      const offset = -(angle * pixelsPerDegree * CONFIG.COMPASS_SENSITIVITY) + CONFIG.COMPASS_OFFSET;
      compassStrip.style.transform = `translateX(${offset}px)`;
    }
    
    // Update FOV display
    const fovText = document.getElementById('fov-text');
    if (fovText) {
      const fov = camera.fov.toFixed(0);
      fovText.textContent = `${fov}°`;
    }
  }
}
