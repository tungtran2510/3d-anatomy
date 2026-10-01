// Model Loading - GLB loading, mesh registry, material handling
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { state, setLoadingSystem } from '../state/store.js';
import { asset } from '../utils/paths.js';
import { getAnatomyRoot } from './orientationManager.js';

// Without an acceleration structure, picking cost grows with the triangle
// count: 10.4M triangles tested per pointer event across seven systems.
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// The Z-Anatomy models are exported with Draco compression, so the decoder
// (copied into public/draco) is required to read them.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(asset('draco/'));
// Fetch the decoder alongside the first model instead of after it: otherwise
// the two requests are serialised on the critical path.
dracoLoader.preload();

let meshRegistry = new Map(); // Map<partId, node>
let structures = new Map(); // Map<partId, { node, systemId, parentId, childIds, ownMeshes }>
let systemRegistry = new Map(); // Map<systemId, node[]>
let modelRoots = new Map(); // Map<systemId, gltf.scene>
let loadingManager = new THREE.LoadingManager();

export function getMeshRegistry() {
  return meshRegistry;
}

export function getSystemRegistry() {
  return systemRegistry;
}

export function getStructure(partId) {
  return structures.get(partId);
}

// Roots of the loaded models. Raycasting against these instead of against the
// registry avoids re-testing shared subtrees once per nested structure.
export function getPickTargets() {
  return Array.from(modelRoots.values());
}

// The meshes a structure owns directly, i.e. excluding those belonging to a
// nested structure. 868 of the 2827 structures are descendants of another one,
// so "every mesh under this node" is not the same thing as "this structure".
export function ownMeshesOf(partId) {
  const entry = structures.get(partId);
  return entry ? entry.ownMeshes : [];
}

// A structure plus everything nested inside it, in document order.
export function withDescendants(partId) {
  const out = [];
  const walk = id => {
    const entry = structures.get(id);
    if (!entry) return;
    out.push(id);
    entry.childIds.forEach(walk);
  };
  walk(partId);
  return out;
}

export function getLoadedSystems() {
  return state.loadedSystems;
}

const inFlight = new Map();

// One model per system, however many callers ask for it. Two of them can ask
// at once — a shared link restoring its state while the opening batch is still
// in flight — and a second scene.add() would leave an unreachable copy of the
// whole system behind: rendered, counted twice in loadedSystems, and written
// twice into the link the next time it is serialised.
export function loadModel(systemId, viewer, options = {}) {
  if (state.loadedSystems.includes(systemId)) {
    return Promise.resolve({
      systemId,
      model: modelRoots.get(systemId),
      meshCount: systemRegistry.get(systemId)?.length || 0
    });
  }

  const running = inFlight.get(systemId);
  if (running) return running;

  const promise = loadModelOnce(systemId, viewer, options).finally(() => inFlight.delete(systemId));
  inFlight.set(systemId, promise);
  return promise;
}

async function loadModelOnce(systemId, viewer, options = {}) {
  const { scene, renderer, camera } = viewer;

  console.log(`[loadModel] Starting load of ${systemId}.glb`);

  const gltf = await new Promise((resolve, reject) => {
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);
    const modelPath = asset(`models/${systemId}.glb`);

    setLoadingSystem(systemId, false, 0);

    loader.load(
      modelPath,
      resolve,
      (xhr) => {
        // Bytes are reported even when the server sends no content-length, so
        // the UI can show something either way.
        setLoadingSystem(systemId, false, xhr.lengthComputable ? (xhr.loaded / xhr.total) * 100 : 0, {
          loaded: xhr.loaded,
          total: xhr.lengthComputable ? xhr.total : 0
        });
      },
      (error) => {
        console.error(`[loadModel] Error loading ${systemId}:`, error);
        setLoadingSystem(systemId, true, 100, { failed: true });
        reject(error);
      }
    );
  });

  const model = gltf.scene;
  processModel(model, systemId, viewer);

  // Compiling before the model joins the scene keeps the first frame after a
  // load from stalling on shader and buffer upload.
  if (renderer?.compileAsync) {
    try {
      await renderer.compileAsync(model, camera, scene);
    } catch {
      // Compilation is an optimisation; a failure must not block the load.
    }
  }

  const anatomyRoot = getAnatomyRoot(scene);
  anatomyRoot.add(model);
  modelRoots.set(systemId, model);

  state.loadedSystems.push(systemId);
  setLoadingSystem(systemId, true, 100);

  return { systemId, model, meshCount: systemRegistry.get(systemId)?.length || 0 };
}

function processModel(model, systemId, viewer) {
  const nodes = [];

  // The glTF carries the untouched Z-Anatomy name in `za_name`, because the
  // exporter rewrites object names (spaces, dots) and paired structures would
  // otherwise collapse onto the same name.
  model.traverse((child) => {
    const partId = child.userData?.za_name;
    if (!partId) return;

    child.userData.partId = partId;
    child.userData.system = systemId;
    child.userData.originalName = partId;

    // The glTF graph is nested: a structure can be the parent of another one.
    // Record that relation instead of flattening it, because three.js applies
    // `visible` down the whole subtree and hiding a parent would take its
    // children with it.
    const parentId = findAncestorPartId(child.parent);

    nodes.push(child);
    meshRegistry.set(partId, child);
    structures.set(partId, {
      node: child,
      systemId,
      parentId,
      childIds: [],
      ownMeshes: []
    });

    if (parentId) {
      const parent = structures.get(parentId);
      if (parent) parent.childIds.push(partId);
    }
  });

  // A nested structure is often a child of a node that is itself a mesh, so
  // hiding the parent would hide the child with it. Detach every nested
  // structure to the model root (attach preserves the world transform): the
  // anatomical nesting stays recorded above, but visibility becomes
  // independent per structure.
  model.updateMatrixWorld(true);
  nodes.forEach(node => {
    if (structures.get(node.userData.partId).parentId) {
      model.attach(node);
    }
  });

  // Assign every mesh to the closest structure above it, so a parent structure
  // never claims the geometry of a nested one.
  model.traverse((child) => {
    if (!child.isMesh) return;

    setupMesh(child, systemId, viewer);

    const ownerId = findAncestorPartId(child);
    const owner = ownerId && structures.get(ownerId);
    if (owner) owner.ownMeshes.push(child);
  });

  systemRegistry.set(systemId, nodes);
  console.log(`Loaded ${systemId}: ${nodes.length} structures`);
}

// Walks up from `node` (inclusive) to the closest node carrying a partId.
function findAncestorPartId(node) {
  let current = node;
  while (current) {
    if (current.userData?.partId) return current.userData.partId;
    current = current.parent;
  }
  return null;
}

// Procedural organic micro-bump texture cache to simulate living cellular surface
let organicBumpMap = null;
function getOrganicBumpMap() {
  if (organicBumpMap) return organicBumpMap;
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const idx = (y * 256 + x) * 4;
        const nx = x / 28;
        const ny = y / 28;
        const v1 = Math.sin(nx * 2.3 + Math.cos(ny * 1.9)) * 0.5 + 0.5;
        const v2 = Math.sin(nx * 5.7 - ny * 4.6) * 0.25 + 0.25;
        const v3 = (Math.random() - 0.5) * 0.15;
        const val = Math.min(255, Math.max(0, Math.floor((v1 * 0.65 + v2 * 0.35 + v3) * 255)));

        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    organicBumpMap = new THREE.CanvasTexture(canvas);
    organicBumpMap.wrapS = THREE.RepeatWrapping;
    organicBumpMap.wrapT = THREE.RepeatWrapping;
    organicBumpMap.repeat.set(10, 10);
    return organicBumpMap;
  } catch (err) {
    console.warn('[loadModel] Could not generate organic bump map:', err);
    return null;
  }
}

function applyCustomProps(mesh, props) {
  if (!mesh.material) return;
  const current = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (!current || !current.isMeshStandardMaterial) return;

  const m = current.clone();
  if (props.color !== undefined) m.color.set(props.color);
  if (props.roughness !== undefined) m.roughness = props.roughness;
  if (props.metalness !== undefined) m.metalness = props.metalness;
  if (props.transparent !== undefined) m.transparent = props.transparent;
  if (props.opacity !== undefined) m.opacity = props.opacity;
  if (props.depthWrite !== undefined) m.depthWrite = props.depthWrite;
  if (props.bumpMap !== undefined) m.bumpMap = props.bumpMap;
  if (props.bumpScale !== undefined) m.bumpScale = props.bumpScale;
  if (props.name) m.name = props.name;

  mesh.material = m;
  if (props.renderOrder) mesh.renderOrder = props.renderOrder;
}

function enhanceMaterialForOrgan(mesh, systemId) {
  if (!mesh || !mesh.material) return;

  const partName = (mesh.userData?.partId || mesh.userData?.za_name || mesh.name || '').toLowerCase();
  const matName = (mesh.material?.name || '').toLowerCase();
  const bump = getOrganicBumpMap();

  if (systemId === 'visceral') {
    if (partName.includes('greater omentum') || partName.includes('lesser omentum') || partName.includes('mạc nối')) {
      // Greater / Lesser Omentum: Delicate semi-translucent adipose veil
      applyCustomProps(mesh, {
        name: 'PBR_Omentum',
        color: 0xF3E7C4,
        roughness: 0.32,
        metalness: 0.02,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        bumpMap: bump,
        bumpScale: 0.0012,
        renderOrder: 10
      });
    } else if (partName.includes('mesocolon') || partName.includes('meso-appendix') || matName.includes('peritoneum')) {
      // Peritoneum & Mesentery
      applyCustomProps(mesh, {
        name: 'PBR_Peritoneum',
        color: 0xE5DAC0,
        roughness: 0.38,
        metalness: 0.01,
        transparent: true,
        opacity: 0.50,
        depthWrite: false,
        renderOrder: 8
      });
    } else if (partName.includes('liver') || partName.includes('gan')) {
      // Liver & hepatic segments: deep rich mahogany red-brown parenchymal tissue
      applyCustomProps(mesh, {
        name: 'PBR_Liver',
        color: 0x5A1A18,
        roughness: 0.22,
        metalness: 0.05,
        bumpMap: bump,
        bumpScale: 0.0008
      });
    } else if (partName.includes('gallbladder') || partName.includes('bile duct') || matName.includes('gallbladder')) {
      // Gallbladder & bile ducts: wet emerald green
      applyCustomProps(mesh, {
        name: 'PBR_Gallbladder',
        color: 0x1B4E28,
        roughness: 0.14,
        metalness: 0.08
      });
    } else if (partName.includes('stomach') || partName.includes('dạ dày')) {
      // Stomach: thick muscular mucosal wall
      applyCustomProps(mesh, {
        name: 'PBR_Stomach',
        color: 0xBA5A4E,
        roughness: 0.25,
        metalness: 0.03,
        bumpMap: bump,
        bumpScale: 0.0012
      });
    } else if (partName.includes('duodenum') || partName.includes('jejunum') || partName.includes('ileum')) {
      // Small intestine: living warm coral-pink loops
      applyCustomProps(mesh, {
        name: 'PBR_SmallIntestine',
        color: 0xCF6D62,
        roughness: 0.22,
        metalness: 0.04,
        bumpMap: bump,
        bumpScale: 0.0010
      });
    } else if (partName.includes('taenia')) {
      // Taenia coli: silvery-ivory longitudinal smooth muscle bands
      applyCustomProps(mesh, {
        name: 'PBR_TaeniaColi',
        color: 0xE4DEC8,
        roughness: 0.40,
        metalness: 0.02
      });
    } else if (partName.includes('colon') || partName.includes('caecum') || partName.includes('rectum') || partName.includes('appendix')) {
      // Large intestine / Colon haustra
      applyCustomProps(mesh, {
        name: 'PBR_Colon',
        color: 0xA65850,
        roughness: 0.25,
        metalness: 0.03,
        bumpMap: bump,
        bumpScale: 0.0012
      });
    } else if (partName.includes('kidney') || partName.includes('thận')) {
      // Kidneys: reddish-brown renal cortex
      applyCustomProps(mesh, {
        name: 'PBR_Kidney',
        color: 0x722624,
        roughness: 0.24,
        metalness: 0.04
      });
    } else if (partName.includes('bladder') || partName.includes('ureter') || partName.includes('bàng quang')) {
      // Bladder & ureter
      applyCustomProps(mesh, {
        name: 'PBR_Bladder',
        color: 0xB87068,
        roughness: 0.30,
        metalness: 0.02
      });
    } else if (partName.includes('spleen') || partName.includes('lá lách')) {
      // Spleen: vascular lymphoid purplish-crimson
      applyCustomProps(mesh, {
        name: 'PBR_Spleen',
        color: 0x662434,
        roughness: 0.25,
        metalness: 0.03
      });
    } else if (partName.includes('pancreas') || partName.includes('tụy')) {
      // Pancreas: lobular glandular warm yellowish-pink
      applyCustomProps(mesh, {
        name: 'PBR_Pancreas',
        color: 0xD4A284,
        roughness: 0.45,
        bumpMap: bump,
        bumpScale: 0.0020
      });
    } else if (partName.includes('pleura') || matName.includes('pleura') || partName.includes('màng phổi')) {
      // Pleura: smooth delicate semi-transparent bluish-lavender serous pleural sac (chuẩn Visible Body Atlas)
      applyCustomProps(mesh, {
        name: 'PBR_Pleura',
        color: 0x6573B8,
        roughness: 0.20,
        metalness: 0.04,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        renderOrder: 7
      });
    } else if (partName.includes('lung') || matName.includes('lung') || partName.includes('phổi')) {
      // Lungs: living soft aerated roseate-lavender tissue
      applyCustomProps(mesh, {
        name: 'PBR_Lung',
        color: 0xB87B88,
        roughness: 0.38,
        metalness: 0.02,
        bumpMap: bump,
        bumpScale: 0.0015
      });
    } else if (partName.includes('trachea') || partName.includes('bronch') || matName.includes('bronchi')) {
      // Trachea & Bronchi: pearly bluish-ivory cartilaginous rings
      applyCustomProps(mesh, {
        name: 'PBR_Trachea',
        color: 0xCBD7DC,
        roughness: 0.30,
        metalness: 0.02
      });
    }
  } else if (systemId === 'muscular') {
    if (partName.includes('tendon') || matName.includes('tendon') || partName.includes('gân')) {
      // Tendons: glistening silvery-white
      applyCustomProps(mesh, {
        name: 'PBR_Tendon',
        color: 0xF5F0E6,
        roughness: 0.24,
        metalness: 0.04
      });
    } else if (partName.includes('fascia') || partName.includes('retinaculum') || matName.includes('fascia')) {
      // Fascia & retinacula: ultra-delicate glistening collagenous sheath
      // Subtle opacity so vibrant underlying crimson muscle is clearly visible
      applyCustomProps(mesh, {
        name: 'PBR_Fascia',
        color: 0xF4EFE6,
        roughness: 0.30,
        metalness: 0.02,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
        renderOrder: 5
      });
    } else if (
      partName.includes('frontalis') ||
      partName.includes('orbicularis') ||
      partName.includes('zygomaticus') ||
      partName.includes('buccinator') ||
      partName.includes('nasalis') ||
      partName.includes('mentalis') ||
      partName.includes('levator') ||
      partName.includes('depressor') ||
      partName.includes('procerus') ||
      partName.includes('corrugator')
    ) {
      // Facial mimic muscles: authentic striated red muscle tissue
      applyCustomProps(mesh, {
        name: 'PBR_FacialMimic',
        color: 0xB42820,
        roughness: 0.32,
        metalness: 0.03,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('masseter') || partName.includes('temporalis')) {
      // Masticatory muscles (Masseter, Temporalis): distinct striated living muscle
      applyCustomProps(mesh, {
        name: 'PBR_Masticatory',
        color: 0xB0241C,
        roughness: 0.28,
        metalness: 0.03,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        bumpMap: bump,
        bumpScale: 0.0012
      });
    } else if (partName.includes('platysma') || partName.includes('sternocleidomastoid')) {
      // Functional neck muscles: prominent striated fiber sheen
      applyCustomProps(mesh, {
        name: 'PBR_NeckMuscle',
        color: 0xB0241C,
        roughness: 0.28,
        metalness: 0.03,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        bumpMap: bump,
        bumpScale: 0.0014
      });
    } else {
      // Living skeletal muscle tissue: rich physiological crimson with fascicle sheen (màu cơ vân chuẩn y khoa)
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach(m => {
        if (m && m.isMeshStandardMaterial) {
          m.roughness = 0.30;
          m.metalness = 0.03;
          m.color.set(0xB2241C);
          m.transparent = false;
          m.opacity = 1.0;
          m.depthWrite = true;
          if (bump) {
            m.bumpMap = bump;
            m.bumpScale = 0.0012;
          }
        }
      });
    }
  } else if (systemId === 'skeletal') {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => {
      if (m && m.isMeshStandardMaterial) {
        const mName = m.name || '';
        if (mName.includes('Cartilage') || partName.includes('cartilage') || partName.includes('sụn')) {
          // Costal, articular, and nasal cartilage: authentic semi-translucent bluish-ivory
          m.roughness = 0.28;
          m.metalness = 0.01;
          m.transparent = true;
          m.opacity = 0.88;
          m.color.set(0xB6C8CE);
        } else if (mName.includes('Suture')) {
          // Cranial suture seams (khớp vành, khớp dọc, khớp vảy sọ)
          m.roughness = 0.80;
          m.metalness = 0.01;
          m.color.set(0x8A7660);
        } else if (mName.includes('Teeth-roots')) {
          m.roughness = 0.45;
          m.metalness = 0.01;
          m.color.set(0xD6C298);
        } else if (mName.includes('Teeth')) {
          // Bright natural pearlescent enamel
          m.roughness = 0.15;
          m.metalness = 0.02;
          m.color.set(0xFBF8EE);
        } else {
          // Refined authentic warm ivory bone tone (màu trắng ngà ánh vàng ấm chuẩn Complete Anatomy)
          m.roughness = 0.50;
          m.metalness = 0.01;
          m.color.set(0xE8DFCA);
          if (bump) {
            m.bumpMap = bump;
            m.bumpScale = 0.0006;
          }
        }
      }
    });
  } else if (systemId === 'cardiovascular') {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => {
      if (m && m.isMeshStandardMaterial) {
        const mName = m.name || '';
        if (mName.includes('Artery') || partName.includes('artery') || partName.includes('aorta')) {
          m.roughness = 0.24;
          m.metalness = 0.03;
          m.color.set(0xB81E1E);
        } else if (mName.includes('Vein') || partName.includes('vein')) {
          m.roughness = 0.24;
          m.metalness = 0.03;
          m.color.set(0x224C8C);
        } else if (mName.includes('Trapezius') || partName.includes('heart') || partName.includes('myocard')) {
          m.roughness = 0.25;
          m.metalness = 0.04;
          m.color.set(0x7D1E1C);
        }
      }
    });
  } else if (systemId === 'nervous') {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => {
      if (m && m.isMeshStandardMaterial) {
        const mName = m.name || '';
        if (mName.includes('Brain') || mName.includes('Frontal') || mName.includes('Cerebell')) {
          m.roughness = 0.32;
          m.metalness = 0.02;
          m.color.set(0xDFB8A2);
          if (bump) {
            m.bumpMap = bump;
            m.bumpScale = 0.0018;
          }
        } else if (mName.includes('Nerve') || partName.includes('nerve')) {
          m.roughness = 0.35;
          m.metalness = 0.02;
          m.color.set(0xEAC63E);
        }
      }
    });
  }
}

function setupMesh(mesh, systemId, viewer) {
  // Idempotent: a mesh must not be set up twice.
  if (mesh.userData.baseMaterial) return;

  if (mesh.material) {
    // Enhance mesh materials with medical PBR realism
    enhanceMaterialForOrgan(mesh, systemId);
    mesh.userData.baseMaterial = mesh.material;
  }

  if (mesh.geometry && !mesh.geometry.boundsTree) {
    mesh.geometry.computeBoundsTree();
  }

  // Enable shadows if needed (disabled for performance in v1)
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  // Frustum culling
  mesh.frustumCulled = true;

  // Set render order for transparent objects
  if (mesh.material && (Array.isArray(mesh.material) ? mesh.material.some(m => m.transparent) : mesh.material.transparent)) {
    mesh.renderOrder = 1;
  }
}

export async function loadSystems(systemIds, viewer, options = {}) {
  const { sequential = false } = options;

  if (sequential) {
    for (const systemId of systemIds) {
      try {
        await loadModel(systemId, viewer);
      } catch (error) {
        console.error(`Failed to load ${systemId}:`, error);
      }
    }
  } else {
    // Parallel loading with a concurrency limit: one worker per slot, each
    // taking the next system off the queue until it runs dry. The queue used
    // to be driven from two places at once — the .finally of every load and a
    // Promise.race chain whose result was discarded — which oversubscribed the
    // limit and, from six systems up, returned while the last ones were still
    // loading. Whoever awaited it then restored a shared link against a scene
    // that was not finished.
    const concurrency = 2;
    const queue = [...systemIds];

    const worker = async () => {
      while (queue.length) {
        const systemId = queue.shift();
        try {
          await loadModel(systemId, viewer);
        } catch (error) {
          // A model that will not load costs its own system and nothing else,
          // exactly as in the sequential branch above.
          console.error(`Failed to load ${systemId}:`, error);
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  }

  // Center camera on all loaded models
  centerCamera(viewer);

  return meshRegistry;
}

function centerCamera(viewer) {
  const { scene, camera, controls } = viewer;

  const box = new THREE.Box3();
  let hasGeometry = false;

  scene.traverse(child => {
    if (child.isMesh && child.visible) {
      box.expandByObject(child);
      hasGeometry = true;
    }
  });

  if (!hasGeometry || box.isEmpty()) return;

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // Position camera adapted for 35° telephoto medical lens
  const distance = maxDim * 1.8;
  const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
  camera.position.copy(center).add(direction.multiplyScalar(distance));
  controls.target.copy(center);
  controls.update();

  // Store initial camera state for reset
  camera.userData.initialPosition = camera.position.clone();
  camera.userData.initialTarget = controls.target.clone();
  camera.userData.initialZoom = controls.zoom;
}

export function getMeshesBySystem(systemId) {
  return systemRegistry.get(systemId) || [];
}

// Walks the structures rather than the nodes, so meshes shared with a nested
// structure are not counted twice.
export function getAllMeshes() {
  return Array.from(structures.values()).flatMap(entry => entry.ownMeshes);
}

// Frees a system's GPU buffers. Without this, memory only ever grows: seven
// systems is roughly 187 MB that a mobile tab never gets back.
export function unloadSystem(systemId) {
  const model = modelRoots.get(systemId);
  if (!model) return false;

  model.removeFromParent();

  const seenMaterials = new Set();
  model.traverse(object => {
    if (!object.isMesh) return;

    object.geometry?.disposeBoundsTree?.();
    object.geometry?.dispose();

    const materials = [object.material, object.userData.baseMaterial]
      .flatMap(entry => (Array.isArray(entry) ? entry : [entry]))
      .filter(Boolean);

    materials.forEach(material => {
      if (seenMaterials.has(material)) return;
      seenMaterials.add(material);
      material.dispose();
    });
  });

  structures.forEach((entry, partId) => {
    if (entry.systemId !== systemId) return;
    structures.delete(partId);
    meshRegistry.delete(partId);
    state.partStates.delete(partId);
  });

  systemRegistry.delete(systemId);
  modelRoots.delete(systemId);
  state.loadedSystems = state.loadedSystems.filter(id => id !== systemId);

  return true;
}

// Visibility, transparency and highlighting all live in viewer/visibility.js,
// which is the single owner of material state.

export function getModelStats() {
  let totalMeshes = 0;
  let totalTriangles = 0;

  getAllMeshes().forEach(mesh => {
    totalMeshes++;
    if (mesh.geometry && mesh.geometry.index) {
      totalTriangles += mesh.geometry.index.count / 3;
    } else if (mesh.geometry && mesh.geometry.attributes.position) {
      totalTriangles += mesh.geometry.attributes.position.count / 3;
    }
  });

  return { totalMeshes, totalTriangles };
}

// Cleanup
export function dispose() {
  getAllMeshes().forEach(mesh => {
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(mat => mat.dispose());
    }
  });
  meshRegistry.clear();
  structures.clear();
  systemRegistry.clear();
  modelRoots.clear();
  state.loadedSystems = [];
}