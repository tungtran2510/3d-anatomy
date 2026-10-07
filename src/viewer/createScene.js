// Three.js Viewer - Scene Creation
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { engineManager } from './engineManager.js';

console.log('[createScene] Module loaded');

export function createScene() {
  // Scene
  const scene = new THREE.Scene();
  const isDark = typeof localStorage !== 'undefined' && localStorage.getItem('giao_dien') === 'dark';
  scene.background = new THREE.Color(isDark ? 0x0d1117 : 0xf8fafc);

  // Renderer
  const canvas = document.getElementById('threeCanvas');
  console.log('[createScene] Canvas:', canvas, canvas ? canvas.clientWidth + 'x' + canvas.clientHeight : 'none');
  
  if (!canvas) {
    throw new Error('Canvas element #threeCanvas not found');
  }

  // The canvas is laid out by CSS, at 100% of #viewerContainer. Measure the
  // container, never the canvas: renderer.setSize() must not be allowed to
  // write the element's style, or the viewer ends up observing a size it set
  // itself and can never recover from a first layout that measured zero.
  const container = canvas.parentElement || canvas;

  function viewportSize() {
    return { width: container.clientWidth, height: container.clientHeight };
  }

  const initialSize = viewportSize();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  const basePixelRatio = engineManager.drs.nativeRatio;
  renderer.setPixelRatio(basePixelRatio);
  // updateStyle = false: only the drawing buffer, the stylesheet owns the box.
  renderer.setSize(Math.max(initialSize.width, 1), Math.max(initialSize.height, 1), false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = false; // Disabled for performance

  // Medical Studio Environment Lighting for high-fidelity physiological reflections & realistic depth
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.85;

  // Camera
  // The Z-Anatomy models are built to real scale: a body is roughly 1.7 units
  // (metres) tall, so near/far and the camera distance are in the same order.
  // Medical telephoto portrait lens (FOV 35): eliminates wide-angle distortion,
  // preventing skulls and faces from looking vertically stretched or unnatural ("hơi dài / dại").
  const camera = new THREE.PerspectiveCamera(
    35, // FOV: 35 degrees matches clinical photography and 85mm-100mm medical lenses
    Math.max(initialSize.width, 1) / Math.max(initialSize.height, 1), // aspect
    0.01, // near
    100 // far
  );
  camera.position.set(0, 0, 3.6);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.autoRotate = false;
  controls.minDistance = 0.02;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI * 0.95; // Prevent camera flip
  controls.minPolarAngle = Math.PI * 0.05;
  controls.target.set(0, 0, 0);

  // Touch controls for mobile
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  // Lights
  const lights = createLights(scene);

  // Handle resize
  function onResize() {
    const { width, height } = viewportSize();
    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Re-read the ratio here: moving the window between displays changes it,
    // and on mobile it changes with zoom.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    invalidate();
  }

  // Keyboard orbit, so the viewer is operable without a pointer.
  canvas.addEventListener('keydown', event => {
    const step = event.shiftKey ? 0.25 : 0.08;
    // Move the camera directly rather than through OrbitControls' internal
    // deltas: those are consumed during a pointer gesture and update() would
    // undo the change.
    const handled = {
      ArrowLeft: () => rotate(-step, 0),
      ArrowRight: () => rotate(step, 0),
      ArrowUp: () => rotate(0, -step),
      ArrowDown: () => rotate(0, step),
      '+': () => dolly(0.9),
      '=': () => dolly(0.9),
      '-': () => dolly(1.1)
    }[event.key];

    if (!handled) return;
    event.preventDefault();
    handled();
    controls.update();
    invalidate();
  });

  function rotate(dTheta, dPhi) {
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= dTheta;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi - dPhi, 0.05, Math.PI - 0.05);
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
  }

  function dolly(factor) {
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
    const distance = THREE.MathUtils.clamp(offset.length(), controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setLength(distance));
  }

  // Watches the container, so opening or closing a panel resizes the view even
  // though the window did not change, and so a viewer built before its first
  // real layout — a page loaded in a background tab, a box still collapsed —
  // fills in as soon as the box has a size.
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);
  window.addEventListener('resize', onResize);

  // Animation loop. Frames are drawn on demand: continuously redrawing up to
  // 10.4M triangles while the user reads the page costs battery and fans for
  // an image that does not change.
  let animationId = null;
  let needsRender = true;
  let settleFrames = 0;

  // Damping keeps moving the camera for a while after input stops.
  const SETTLE_FRAMES = 30;

  function invalidate(frames = 1) {
    needsRender = true;
    settleFrames = Math.max(settleFrames, frames);
  }

  controls.addEventListener('change', () => invalidate(SETTLE_FRAMES));

  // Per-frame subscribers, used by overlays that must track a 3D point on
  // screen (the selection callout).
  const frameCallbacks = new Set();

  function onFrame(callback) {
    frameCallbacks.add(callback);
    return () => frameCallbacks.delete(callback);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    // `controls.update()` returns true while damping is still moving things.
    const moving = controls.update();
    if (moving) settleFrames = Math.max(settleFrames, 2);

    if (!needsRender && settleFrames <= 0) return;
    if (settleFrames > 0) settleFrames--;
    needsRender = false;

    renderer.render(scene, camera);
    frameCallbacks.forEach(cb => cb());
  }

  function startRenderLoop() {
    if (!animationId) {
      invalidate();
      animate();
    }
  }

  function stopRenderLoop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Anything that changes the scene without touching the camera (loading a
  // model, hiding a structure, highlighting) calls this to ask for a frame.
  function render() {
    invalidate();
  }

  // Cleanup
  function dispose() {
    stopRenderLoop();
    resizeObserver.disconnect();
    window.removeEventListener('resize', onResize);
    controls.dispose();
    renderer.dispose();
    scene.clear();
  }

  const viewerObj = {
    scene,
    camera,
    renderer,
    controls,
    lights,
    canvas,
    engine: engineManager,
    startRenderLoop,
    stopRenderLoop,
    render,
    invalidate,
    onFrame,
    dispose,
    onResize
  };

  engineManager.attachViewer(viewerObj);

  return viewerObj;
}

function createLights(scene) {
  const lights = {};

  // Medical Studio Ambient Light - balanced fill so crevices and anatomical contours retain physiological depth
  lights.ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(lights.ambient);

  // Key directional light - clinical examination light from upper front-right
  lights.key = new THREE.DirectionalLight(0xfff8f2, 0.75);
  lights.key.position.set(28, 65, 45);
  scene.add(lights.key);

  // Fill light - soft cool-neutral fill to preserve tissue contrast
  lights.fill = new THREE.DirectionalLight(0xf0f5ff, 0.45);
  lights.fill.position.set(-30, 25, -25);
  scene.add(lights.fill);

  // Rim light - subtle back-light highlighting organ boundaries, tissue silhouettes, and anatomical edges
  lights.rim = new THREE.DirectionalLight(0xfff2e6, 0.45);
  lights.rim.position.set(10, -25, -65);
  scene.add(lights.rim);

  // Front camera light for soft anatomical definition
  lights.front = new THREE.DirectionalLight(0xfffbf5, 0.25);
  lights.front.position.set(0, 5, 65);
  scene.add(lights.front);

  // Hemisphere light for ground-to-sky subtle bounce
  lights.hemi = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.30);
  scene.add(lights.hemi);

  return lights;
}

export function updateLightsForSystem(lights, system) {
  // Balanced medical studio lighting across all systems (calibrated for RoomEnvironment IBL)
  const configs = {
    muscular: { key: 0.75, fill: 0.45, ambient: 0.45 },
    skeletal: { key: 0.75, fill: 0.45, ambient: 0.45 },
    nervous: { key: 0.75, fill: 0.45, ambient: 0.45 },
    visceral: { key: 0.75, fill: 0.45, ambient: 0.45 },
    default: { key: 0.75, fill: 0.45, ambient: 0.45 }
  };

  const config = configs[system] || configs.default;
  if (lights.key) lights.key.intensity = config.key;
  if (lights.fill) lights.fill.intensity = config.fill;
  if (lights.ambient) lights.ambient.intensity = config.ambient;
}

export function setSceneBackground(scene, color) {
  scene.background = new THREE.Color(color);
}