// Three.js Viewer - Scene Creation
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log('[createScene] Module loaded');

export function createScene() {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);

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
  console.log('[createScene] Renderer created');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // updateStyle = false: only the drawing buffer, the stylesheet owns the box.
  renderer.setSize(Math.max(initialSize.width, 1), Math.max(initialSize.height, 1), false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = false; // Disabled for performance

  // Camera
  // The Z-Anatomy models are built to real scale: a body is roughly 1.7 units
  // (metres) tall, so near/far and the camera distance are in the same order.
  const camera = new THREE.PerspectiveCamera(
    50, // FOV
    Math.max(initialSize.width, 1) / Math.max(initialSize.height, 1), // aspect
    0.01, // near
    100 // far
  );
  camera.position.set(0, 0, 3);

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

  return {
    scene,
    camera,
    renderer,
    controls,
    lights,
    canvas,
    startRenderLoop,
    stopRenderLoop,
    render,
    invalidate,
    onFrame,
    dispose,
    onResize
  };
}

function createLights(scene) {
  const lights = {};

  // Ambient light - soft overall illumination
  lights.ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(lights.ambient);

  // Main directional light - key light
  lights.key = new THREE.DirectionalLight(0xffffff, 1.0);
  lights.key.position.set(50, 100, 50);
  scene.add(lights.key);

  // Fill light - softer, from opposite side
  lights.fill = new THREE.DirectionalLight(0x88aaff, 0.4);
  lights.fill.position.set(-50, 50, -50);
  scene.add(lights.fill);

  // Rim light - defines edges
  lights.rim = new THREE.DirectionalLight(0xffffee, 0.3);
  lights.rim.position.set(0, -50, -100);
  scene.add(lights.rim);

  // Hemisphere light for subtle ambient variation
  lights.hemi = new THREE.HemisphereLight(0x88ccff, 0x332211, 0.3);
  scene.add(lights.hemi);

  return lights;
}

export function updateLightsForSystem(lights, system) {
  // Adjust lighting based on visible system
  const configs = {
    muscular: { key: 1.0, fill: 0.4, ambient: 0.5 },
    skeletal: { key: 1.2, fill: 0.5, ambient: 0.6 },
    nervous: { key: 0.8, fill: 0.6, ambient: 0.5 },
    default: { key: 1.0, fill: 0.4, ambient: 0.6 }
  };

  const config = configs[system] || configs.default;
  if (lights.key) lights.key.intensity = config.key;
  if (lights.fill) lights.fill.intensity = config.fill;
  if (lights.ambient) lights.ambient.intensity = config.ambient;
}

export function setSceneBackground(scene, color) {
  scene.background = new THREE.Color(color);
}