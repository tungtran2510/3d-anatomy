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
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Medical Studio Environment Lighting for high-fidelity physiological reflections & realistic depth
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.20;

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

function createContactShadowPlane(scene) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // 1. Broad soft ambient occlusion under both legs & pelvis
    const ambientGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 240);
    ambientGrad.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
    ambientGrad.addColorStop(0.40, 'rgba(15, 23, 42, 0.12)');
    ambientGrad.addColorStop(0.75, 'rgba(15, 23, 42, 0.03)');
    ambientGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Helper to draw realistic foot contact imprint (heel, arch, ball of foot)
    const drawFootShadow = (cx, cy, rotationAngle) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotationAngle);

      // Heel contact (gót chân)
      const heelGrad = ctx.createRadialGradient(0, 45, 0, 0, 45, 38);
      heelGrad.addColorStop(0, 'rgba(15, 23, 42, 0.48)');
      heelGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.22)');
      heelGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = heelGrad;
      ctx.beginPath();
      ctx.ellipse(0, 45, 28, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ball of foot & metatarsal pads (ụ bàn chân & ngón chân)
      const ballGrad = ctx.createRadialGradient(0, -35, 0, 0, -35, 45);
      ballGrad.addColorStop(0, 'rgba(15, 23, 42, 0.44)');
      ballGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.18)');
      ballGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.ellipse(0, -35, 34, 46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Connecting lateral longitudinal arch contact (vòm ngoài bàn chân)
      const archGrad = ctx.createRadialGradient(10, 5, 0, 10, 5, 30);
      archGrad.addColorStop(0, 'rgba(15, 23, 42, 0.28)');
      archGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = archGrad;
      ctx.beginPath();
      ctx.ellipse(10, 5, 16, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Anatomical stance: Left foot slightly angled (-8 deg), Right foot slightly angled (+8 deg)
    drawFootShadow(192, 252, -0.12);
    drawFootShadow(320, 252, 0.12);
  }
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    toneMapped: false
  });
  const geometry = new THREE.PlaneGeometry(1.15, 1.15);
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -0.002, 0);
  plane.name = 'contactShadowPlane';
  plane.renderOrder = 0;
  scene.add(plane);
  return plane;
}

function createLights(scene) {
  const lights = {};

  // Ground Contact Shadow - anchors cadaver and human body to studio floor, preventing floating appearance
  lights.contactShadow = createContactShadowPlane(scene);

  // Medical Studio Ambient Light - subtle fill so deep anatomical crevices retain natural shadow depth
  lights.ambient = new THREE.AmbientLight(0xffffff, 0.16);
  scene.add(lights.ambient);

  // Key directional light - clinical examination light (4500K warm ivory) from upper front-right
  lights.key = new THREE.DirectionalLight(0xfffbf2, 1.08);
  lights.key.position.set(2.2, 3.4, 2.8);
  lights.key.target.position.set(0, 0.85, 0);
  scene.add(lights.key.target);
  lights.key.castShadow = true;
  lights.key.shadow.mapSize.width = 2048;
  lights.key.shadow.mapSize.height = 2048;
  lights.key.shadow.camera.near = 0.5;
  lights.key.shadow.camera.far = 10.0;
  lights.key.shadow.camera.left = -1.2;
  lights.key.shadow.camera.right = 1.2;
  lights.key.shadow.camera.top = 1.4;
  lights.key.shadow.camera.bottom = -1.4;
  lights.key.shadow.bias = -0.00025;
  lights.key.shadow.normalBias = 0.02;
  lights.key.shadow.radius = 1.8;
  scene.add(lights.key);

  // Fill light - soft cool-neutral fill (7000K daylight cyan tint) from lower front-left to soften harsh shadows
  lights.fill = new THREE.DirectionalLight(0xe8f0fe, 0.32);
  lights.fill.position.set(-2.6, 1.4, 2.2);
  lights.fill.target.position.set(0, 0.85, 0);
  scene.add(lights.fill.target);
  scene.add(lights.fill);

  // Dual Studio Rim Lights - sharp silhouette separation creating deep 3D sculptural volume
  // Rim Left: Crisp cool rim kicker from behind-left
  lights.rimLeft = new THREE.DirectionalLight(0x7dd3fc, 0.78);
  lights.rimLeft.position.set(-2.4, 2.0, -2.6);
  lights.rimLeft.target.position.set(0, 0.85, 0);
  scene.add(lights.rimLeft.target);
  scene.add(lights.rimLeft);

  // Rim Right: Warm golden rim kicker from behind-right
  lights.rimRight = new THREE.DirectionalLight(0xfef08a, 0.50);
  lights.rimRight.position.set(2.4, 1.8, -2.6);
  lights.rimRight.target.position.set(0, 0.85, 0);
  scene.add(lights.rimRight.target);
  scene.add(lights.rimRight);

  // Backward-compatible rim reference
  lights.rim = lights.rimLeft;

  // Organic upward bounce light - simulates light reflection from internal viscera & cavity base
  lights.underBounce = new THREE.DirectionalLight(0xffedd5, 0.14);
  lights.underBounce.position.set(0, -2.0, 1.0);
  lights.underBounce.target.position.set(0, 0.85, 0);
  scene.add(lights.underBounce.target);
  scene.add(lights.underBounce);

  // Front camera light: subtle fill, eliminating harsh direct flash reflection
  lights.front = new THREE.DirectionalLight(0xfffbf5, 0.05);
  lights.front.position.set(0, 5, 65);
  scene.add(lights.front);

  // Hemisphere light for ground-to-sky subtle organic bounce
  lights.hemi = new THREE.HemisphereLight(0xfffaf0, 0xd0dbe6, 0.15);
  scene.add(lights.hemi);

  return lights;
}

export function updateLightsForSystem(lights, system) {
  // Cinema-grade medical studio lighting balanced across all systems
  const configs = {
    muscular: { key: 1.05, fill: 0.30, ambient: 0.15, rimLeft: 0.78, rimRight: 0.48 },
    skeletal: { key: 1.02, fill: 0.32, ambient: 0.15, rimLeft: 0.75, rimRight: 0.45 },
    nervous: { key: 1.10, fill: 0.30, ambient: 0.14, rimLeft: 0.82, rimRight: 0.50 },
    visceral: { key: 1.12, fill: 0.28, ambient: 0.14, rimLeft: 0.80, rimRight: 0.48 },
    cardiovascular: { key: 1.15, fill: 0.28, ambient: 0.14, rimLeft: 0.82, rimRight: 0.50 },
    lymphatic: { key: 1.08, fill: 0.30, ambient: 0.15, rimLeft: 0.78, rimRight: 0.48 },
    integumentary: { key: 1.04, fill: 0.32, ambient: 0.15, rimLeft: 0.75, rimRight: 0.45 },
    default: { key: 1.05, fill: 0.30, ambient: 0.15, rimLeft: 0.78, rimRight: 0.48 }
  };

  const config = configs[system] || configs.default;
  if (lights.key) lights.key.intensity = config.key;
  if (lights.fill) lights.fill.intensity = config.fill;
  if (lights.ambient) lights.ambient.intensity = config.ambient;
  if (lights.rimLeft) lights.rimLeft.intensity = config.rimLeft;
  if (lights.rimRight) lights.rimRight.intensity = config.rimRight;
}

export function setSceneBackground(scene, color) {
  scene.background = new THREE.Color(color);
}