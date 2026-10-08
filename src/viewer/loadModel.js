// Model Loading - GLB loading, mesh registry, material handling
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { state, setLoadingSystem } from '../state/store.js';
import { asset } from '../utils/paths.js';
import { getAnatomyRoot } from './orientationManager.js';
import { updateBodyEnvelopeAuto } from './bodyEnvelope.js';

// Without an acceleration structure, picking cost grows with the triangle
// count: 10.4M triangles tested per pointer event across seven systems.
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// The Z-Anatomy models are exported with Draco compression, so the decoder
// (copied into public/draco) is required to read them.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(asset('draco/'));
if (typeof window !== 'undefined') {
  dracoLoader.preload();
}

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
// nested structure. Resilient fallbacks ensure meshes are always returned even for
// multi-primitive nodes.
export function ownMeshesOf(partId) {
  if (!partId) return [];
  const entry = structures.get(partId);
  if (entry && entry.ownMeshes && entry.ownMeshes.length > 0) {
    return entry.ownMeshes;
  }
  // Fallback 1: if entry has node, gather all descendant meshes
  if (entry?.node) {
    const meshes = [];
    if (entry.node.isMesh) meshes.push(entry.node);
    entry.node.traverse(c => {
      if (c.isMesh && !meshes.includes(c)) meshes.push(c);
    });
    if (meshes.length > 0) {
      entry.ownMeshes = meshes;
      return meshes;
    }
  }
  // Fallback 2: search meshRegistry directly or by normalized alphanumeric ID
  let node = meshRegistry.get(partId);
  if (!node) {
    const norm = String(partId).toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, val] of meshRegistry.entries()) {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normKey === norm || normKey.startsWith(norm)) {
        node = val;
        break;
      }
    }
  }
  if (node) {
    const meshes = [];
    if (node.isMesh) meshes.push(node);
    node.traverse(c => {
      if (c.isMesh && !meshes.includes(c)) meshes.push(c);
    });
    return meshes;
  }
  return [];
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

  updateBodyEnvelopeAuto(viewer);

  return { systemId, model, meshCount: systemRegistry.get(systemId)?.length || 0 };
}

let cachedAnulusTexture = null;
function createAnulusConcentricTexture() {
  if (cachedAnulusTexture) return cachedAnulusTexture;
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Neutral grey baseline for bump map
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // 15-20 Concentric lamellae rings (vòng sợi đồng tâm)
    for (let r = 14; r < 122; r += 5) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.08, r * 0.88, 0, 0, Math.PI * 2);
      ctx.strokeStyle = (r % 10 === 0) ? '#a8a8a8' : '#646464';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // Interlaced cross-hatched collagen fiber striations (đan chéo 30 độ)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 0.8;
    for (let i = -256; i < 512; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 140, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - 140, 256);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    cachedAnulusTexture = texture;
    return cachedAnulusTexture;
  } catch (e) {
    console.warn('[loadModel] Could not create anulus texture:', e);
    return null;
  }
}

function setupIntervertebralDiscs(model, systemId, viewer, nodes) {
  const anulusTexture = createAnulusConcentricTexture();
  const discMeshes = [];

  model.traverse((child) => {
    if (child.isMesh && child.name && /intervertebral[ _]disc/i.test(child.name)) {
      discMeshes.push(child);
    }
  });

  discMeshes.forEach((mesh) => {
    const rawId = mesh.userData?.partId || mesh.name.replace(/_/g, ' ');
    const match = rawId.match(/intervertebral disc\s+([A-Za-z0-9-]+)/i);
    const level = match ? match[1] : '';
    const discPartId = level ? `Intervertebral disc ${level}` : rawId;
    const nucleusPartId = level ? `Nucleus pulposus ${level}` : `Nucleus pulposus`;

    // 1. Style the outer mesh as Anulus Fibrosus (Vòng sợi ngoài)
    mesh.userData.partId = discPartId;
    mesh.userData.isAnulusFibrosus = true;
    mesh.userData.discLevel = level;

    applyCustomProps(mesh, {
      name: 'PBR_AnulusFibrosus',
      color: 0xDCD5C6, // Natural ivory fibrocartilage tone (chuẩn Visible Body)
      roughness: 0.52,
      metalness: 0.01,
      clearcoat: 0.38,
      clearcoatRoughness: 0.25,
      sheen: 0.45,
      sheenColor: 0xe2e8f0,
      transparent: true,
      opacity: 0.68, // Translucent fibrocartilage so inner nucleus is visible!
      depthWrite: true,
      renderOrder: 1,
      bumpMap: anulusTexture,
      bumpScale: 0.003
    });
    mesh.userData.baseMaterial = mesh.material;

    // 2. Generate the inner 3D Nucleus Pulposus (Nhân nhầy) mesh
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const bbox = mesh.geometry.boundingBox;
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    // Scale inner nucleus hydrogel core (~52% disc footprint, ~82% disc height)
    const radiusX = Math.max(0.004, size.x * 0.26);
    const radiusZ = Math.max(0.004, size.z * 0.26);
    const heightY = Math.max(0.002, size.y * 0.82);

    const nucleusGeom = new THREE.CylinderGeometry(radiusX, radiusX, heightY, 24, 1);
    if (radiusZ !== radiusX) {
      nucleusGeom.scale(1, 1, radiusZ / radiusX);
    }
    if (nucleusGeom.computeBoundsTree) {
      nucleusGeom.computeBoundsTree();
    }

    // PBR Hydrogel Material (Xanh lam ngọc mọng nước, phát quang sinh học)
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      name: 'PBR_NucleusPulposus',
      color: new THREE.Color(0x0ea5e9), // Lam ngọc mọng nước
      emissive: new THREE.Color(0x0284c7), // Phát quang sinh học
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.0,
      clearcoat: 0.92,
      clearcoatRoughness: 0.08,
      transmission: 0.55,
      ior: 1.48,
      transparent: true,
      opacity: 0.96,
      depthWrite: true
    });

    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMat);
    // Offset slightly posterior (-Z * 0.08) matching anatomical position towards spinal canal
    nucleusMesh.position.set(center.x, center.y, center.z - (size.z * 0.08));
    nucleusMesh.name = `Nucleus_pulposus_${level}`;
    nucleusMesh.renderOrder = 2;
    nucleusMesh.userData = {
      partId: nucleusPartId,
      za_name: nucleusPartId,
      system: systemId,
      isNucleusPulposus: true,
      parentDiscId: discPartId,
      baseMaterial: nucleusMat
    };

    // Attach nucleus to mesh as child so it moves and rotates with disc
    mesh.add(nucleusMesh);

    // Register in structures and meshRegistry
    meshRegistry.set(nucleusPartId, nucleusMesh);
    meshRegistry.set(nucleusMesh.name, nucleusMesh);
    structures.set(nucleusPartId, {
      node: nucleusMesh,
      systemId,
      parentId: discPartId,
      childIds: [],
      ownMeshes: [nucleusMesh]
    });

    const discStruct = structures.get(discPartId);
    if (discStruct) {
      if (!discStruct.childIds) discStruct.childIds = [];
      if (!discStruct.childIds.includes(nucleusPartId)) {
        discStruct.childIds.push(nucleusPartId);
      }
    }

    if (nodes && !nodes.includes(nucleusMesh)) {
      nodes.push(nucleusMesh);
    }
  });
}

function processModel(model, systemId, viewer) {
  const nodes = [];

  // Pass 1: Identify authentic anatomical structures from Z-Anatomy (carried in za_name).
  // Multi-material meshes exported from Blender have primitive sub-meshes created by GLTFLoader
  // without za_name. These primitives belong to their parent structure and must NOT be detached
  // or registered as separate independent structures.
  model.traverse((child) => {
    const isStructure = !!child.userData?.za_name || (child.isMesh && child.name && !findAncestorZaName(child.parent));
    if (!isStructure) return;

    let partId = child.userData?.za_name || child.name;
    const rawPartId = partId;
    if (partId === '????????') partId = 'Microvascular anastomosis';
    else if (partId === '?x.l') partId = 'Microvascular plexus.l';
    else if (partId === '?x.r') partId = 'Microvascular plexus.r';

    child.userData.partId = partId;
    child.userData.system = systemId;
    child.userData.originalName = rawPartId;

    const parentId = findAncestorPartId(child.parent);

    nodes.push(child);
    meshRegistry.set(partId, child);
    if (rawPartId && rawPartId !== partId) {
      meshRegistry.set(rawPartId, child);
    }
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

  // Only detach genuine nested structures (e.g. brain inside cranium, or nested nerves)
  // where BOTH parent and child are registered structures.
  // Primitive sub-meshes of a structure remain securely attached inside their parent node!
  model.updateMatrixWorld(true);
  nodes.forEach(node => {
    const entry = structures.get(node.userData.partId);
    if (entry?.parentId) {
      model.attach(node);
    }
  });

  // Pass 2: Assign every mesh to the closest structure above it
  model.traverse((child) => {
    if (!child.isMesh) return;

    setupMesh(child, systemId, viewer);

    const ownerId = findAncestorPartId(child);
    if (!child.userData.system) child.userData.system = systemId;
    if (ownerId) {
      child.userData.partId = ownerId;
      const owner = structures.get(ownerId);
      if (owner && !owner.ownMeshes.includes(child)) {
        owner.ownMeshes.push(child);
      }
      // Also register primitive mesh names as lookup aliases in meshRegistry
      if (child.name && child.name !== ownerId) {
        meshRegistry.set(child.name, child);
      }
    }
  });

  if (systemId === 'joints') {
    setupIntervertebralDiscs(model, systemId, viewer, nodes);
  }

  systemRegistry.set(systemId, nodes);
  console.log(`Loaded ${systemId}: ${nodes.length} structures`);
}

// Walks up to check if any ancestor has a za_name
function findAncestorZaName(node) {
  let current = node;
  while (current) {
    if (current.userData?.za_name) return current.userData.za_name;
    current = current.parent;
  }
  return null;
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

// Procedural bump map disabled to ensure pure smooth matte surface without bumpy shiny spots
function getOrganicBumpMap() {
  return null;
}

function applyCustomProps(mesh, props) {
  if (!mesh.material) return;
  const current = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (!current || (!current.isMeshStandardMaterial && !current.isMeshPhysicalMaterial)) return;

  // Upgrade to MeshPhysicalMaterial for cinema-grade medical PBR realism (clearcoat, sheen, IOR)
  const m = new THREE.MeshPhysicalMaterial();
  if (current.color) m.color.copy(current.color);
  m.roughness = current.roughness !== undefined ? current.roughness : 0.7;
  m.metalness = current.metalness !== undefined ? current.metalness : 0.0;
  if (current.map) m.map = current.map;
  if (current.normalMap) {
    m.normalMap = current.normalMap;
    if (current.normalScale && m.normalScale) m.normalScale.copy(current.normalScale);
  }
  if (current.roughnessMap) m.roughnessMap = current.roughnessMap;
  if (current.metalnessMap) m.metalnessMap = current.metalnessMap;
  if (current.aoMap) {
    m.aoMap = current.aoMap;
    m.aoMapIntensity = current.aoMapIntensity;
  }
  m.transparent = !!current.transparent;
  m.opacity = current.opacity !== undefined ? current.opacity : 1.0;
  m.depthWrite = current.depthWrite !== undefined ? current.depthWrite : true;
  if (current.side !== undefined) m.side = current.side;
  if (current.wireframe !== undefined) m.wireframe = current.wireframe;

  if (props.color !== undefined) m.color.set(props.color);
  if (props.roughness !== undefined) m.roughness = props.roughness;
  if (props.metalness !== undefined) m.metalness = props.metalness;
  if (props.clearcoat !== undefined) m.clearcoat = props.clearcoat;
  if (props.clearcoatRoughness !== undefined) m.clearcoatRoughness = props.clearcoatRoughness;
  if (props.sheen !== undefined) m.sheen = props.sheen;
  if (props.sheenRoughness !== undefined) m.sheenRoughness = props.sheenRoughness;
  if (props.sheenColor !== undefined) m.sheenColor = new THREE.Color(props.sheenColor);
  if (props.specularIntensity !== undefined) m.specularIntensity = props.specularIntensity;
  if (props.specularColor !== undefined) m.specularColor = new THREE.Color(props.specularColor);
  if (props.ior !== undefined) m.ior = props.ior;
  if (props.transmission !== undefined) m.transmission = props.transmission;
  if (props.transparent !== undefined) m.transparent = props.transparent;
  if (props.opacity !== undefined) m.opacity = props.opacity;
  if (props.depthWrite !== undefined) m.depthWrite = props.depthWrite;
  if (props.side !== undefined) m.side = props.side;
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

  if (systemId === 'visceral') {
    if (partName.includes('greater omentum') || partName.includes('lesser omentum') || partName.includes('mạc nối')) {
      // Greater / Lesser Omentum: Delicate physiological adipose veil (chuẩn Visible Body, matte)
      applyCustomProps(mesh, {
        name: 'PBR_Omentum',
        color: 0xE2D4B7,
        roughness: 0.82,
        metalness: 0.0,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        renderOrder: 10
      });
    } else if (partName.includes('mesocolon') || partName.includes('meso-appendix') || matName.includes('peritoneum')) {
      // Peritoneum & Mesentery: delicate matte peritoneal fold
      applyCustomProps(mesh, {
        name: 'PBR_Peritoneum',
        color: 0xE0D3B8,
        roughness: 0.80,
        metalness: 0.0,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        renderOrder: 8
      });
    } else if (partName.includes('liver') || partName.includes('gan')) {
      // Liver & hepatic segments (I to VIII): rich living mahogany red-brown parenchymal tissue with moist Glisson's capsule sheen
      applyCustomProps(mesh, {
        name: 'PBR_Liver',
        color: 0x5C1E1C,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
        sheen: 0.35,
        sheenColor: 0x991b1b
      });
    } else if (partName.includes('gallbladder') || partName.includes('túi mật')) {
      // Gallbladder: deep olive-teal cystic organ with smooth moist peritoneal surface
      applyCustomProps(mesh, {
        name: 'PBR_Gallbladder',
        color: 0x2E6456,
        roughness: 0.32,
        metalness: 0.03,
        clearcoat: 0.55,
        clearcoatRoughness: 0.16,
        sheen: 0.50,
        sheenColor: 0x34d399
      });
    } else if (partName.includes('bile duct') || partName.includes('cystic duct') || partName.includes('hepatic duct') || partName.includes('ống mật')) {
      // Bile ducts: smooth delicate green-teal ductal conduit
      applyCustomProps(mesh, {
        name: 'PBR_BileDuct',
        color: 0x3E7A6B,
        roughness: 0.38,
        metalness: 0.03,
        transparent: true,
        opacity: 0.94,
        depthWrite: true
      });
    } else if (partName.includes('stomach') || partName.includes('dạ dày') || partName.includes('gastric')) {
      // Stomach: warm living gastric muscularis & serosa with subtle moist organic sheen
      applyCustomProps(mesh, {
        name: 'PBR_Stomach',
        color: 0xB86A64,
        roughness: 0.48,
        metalness: 0.02,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        side: THREE.DoubleSide
      });
    } else if (partName.includes('duodenum') || partName.includes('tá tràng')) {
      // Duodenum: C-loop wrapping around pancreas head with living mucosal depth
      applyCustomProps(mesh, {
        name: 'PBR_Duodenum',
        color: 0xD0867D,
        roughness: 0.46,
        metalness: 0.02,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('jejunum') || partName.includes('ileum') || partName.includes('ruột non') || partName.includes('hỗng tràng') || partName.includes('hồi tràng')) {
      // Small intestine: living delicate warm coral-pink peristaltic loops with moist serous sheen
      applyCustomProps(mesh, {
        name: 'PBR_SmallIntestine',
        color: 0xD8958D,
        roughness: 0.46,
        metalness: 0.02,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('taenia')) {
      // Taenia coli: silvery-ivory longitudinal smooth muscle band
      applyCustomProps(mesh, {
        name: 'PBR_TaeniaColi',
        color: 0xD8D0BC,
        roughness: 0.60,
        metalness: 0.02
      });
    } else if (partName.includes('appendix') || partName.includes('ruột thừa')) {
      // Vermiform appendix: tapered vascular mucosal appendage hanging from cecum
      applyCustomProps(mesh, {
        name: 'PBR_Appendix',
        color: 0xAB5E55,
        roughness: 0.44,
        metalness: 0.02
      });
    } else if (partName.includes('rectum') || partName.includes('anal') || partName.includes('trực tràng') || partName.includes('hậu môn')) {
      // Rectum & anal canal: deeper muscular tone with longitudinal striations
      applyCustomProps(mesh, {
        name: 'PBR_Rectum',
        color: 0xA65850,
        roughness: 0.48,
        metalness: 0.02
      });
    } else if (partName.includes('colon') || partName.includes('caecum') || partName.includes('cecum') || partName.includes('đại tràng') || partName.includes('manh tràng')) {
      // Large intestine / Colon haustra: segmented mucosal muscular sacs with living moist sheen
      applyCustomProps(mesh, {
        name: 'PBR_Colon',
        color: 0xB87068,
        roughness: 0.48,
        metalness: 0.02,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('pancreatic duct') || partName.includes('ống tụy')) {
      // Pancreatic ducts (Wirsung, Santorini): fine pearly-white duct
      applyCustomProps(mesh, {
        name: 'PBR_PancreaticDuct',
        color: 0xEDE9DF,
        roughness: 0.55,
        metalness: 0.02
      });
    } else if (partName.includes('pancreas') || partName.includes('tụy')) {
      // Pancreas: textured granular ochre-yellow tan lobular gland
      applyCustomProps(mesh, {
        name: 'PBR_Pancreas',
        color: 0xC49F5E,
        roughness: 0.65,
        metalness: 0.02
      });
    } else if (partName.includes('esophagus') || partName.includes('oesophagus') || partName.includes('thực quản')) {
      // Esophagus: slender smooth mucosal muscular tube descending anterior to spine
      applyCustomProps(mesh, {
        name: 'PBR_Esophagus',
        color: 0xA25E64,
        roughness: 0.52,
        metalness: 0.02
      });
    } else if (partName.includes('parotid') || partName.includes('submandibular') || partName.includes('sublingual') || partName.includes('salivary') || partName.includes('tuyến nước bọt') || partName.includes('tuyến mang tai')) {
      if (partName.includes('duct') || partName.includes('ống')) {
        applyCustomProps(mesh, {
          name: 'PBR_SalivaryDuct',
          color: 0xD8D0C4,
          roughness: 0.80,
          metalness: 0.0
        });
      } else {
        // Salivary glands: lobular salmon-tan gland (matte)
        applyCustomProps(mesh, {
          name: 'PBR_SalivaryGland',
          color: 0xB87E6C,
          roughness: 0.85,
          metalness: 0.0
        });
      }
    } else if (partName.includes('tongue') || partName.includes('lưỡi')) {
      // Tongue: muscular mucosal tongue (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Tongue',
        color: 0xC26672,
        roughness: 0.82,
        metalness: 0.0
      });
    } else if (partName.includes('gingiva') || partName.includes('nướu') || partName.includes('palate') || partName.includes('khẩu cái')) {
      // Oral mucosa, gums & palate
      applyCustomProps(mesh, {
        name: 'PBR_OralMucosa',
        color: 0xBD6D78,
        roughness: 0.80,
        metalness: 0.0
      });
    } else if (partName.includes('pharynx') || partName.includes('hầu')) {
      // Pharynx: muscular mucosal funnel
      applyCustomProps(mesh, {
        name: 'PBR_Pharynx',
        color: 0xA8666C,
        roughness: 0.80,
        metalness: 0.0
      });
    } else if (partName.includes('kidney') || partName.includes('thận')) {
      // Kidneys: rich reddish-brown vascular renal parenchyma with smooth fibrous capsule sheen
      applyCustomProps(mesh, {
        name: 'PBR_Kidney',
        color: 0x6A2222,
        roughness: 0.40,
        metalness: 0.03
      });
    } else if (partName.includes('bladder') || partName.includes('ureter') || partName.includes('bàng quang')) {
      // Bladder & ureter: smooth muscular urinary reservoir
      applyCustomProps(mesh, {
        name: 'PBR_Bladder',
        color: 0xB87068,
        roughness: 0.44,
        metalness: 0.02
      });
    } else if (partName.includes('renal pelvis') || partName.includes('bể thận')) {
      // Renal pelvis: pearly mucosal funnel
      applyCustomProps(mesh, {
        name: 'PBR_RenalPelvis',
        color: 0xDCD5C6,
        roughness: 0.50,
        metalness: 0.02
      });
    } else if (partName.includes('penis') || partName.includes('cavernosum') || partName.includes('spongiosum')) {
      // Penis erectile tissue
      applyCustomProps(mesh, {
        name: 'PBR_Penis',
        color: partName.includes('glans') ? 0xC87B82 : 0x7E323E,
        roughness: 0.60,
        metalness: 0.01
      });
    } else if (partName.includes('testis') || partName.includes('tinh hoàn')) {
      // Testis: smooth pale lilac-grey parenchymal oval
      applyCustomProps(mesh, {
        name: 'PBR_Testis',
        color: 0x9E9BB0,
        roughness: 0.52,
        metalness: 0.02
      });
    } else if (partName.includes('epididymis') || partName.includes('deferens') || partName.includes('prostate') || partName.includes('seminal')) {
      // Epididymis, ductus deferens & prostate: smooth ivory-amber cords
      applyCustomProps(mesh, {
        name: 'PBR_GenitalDucts',
        color: 0xD6C6B2,
        roughness: 0.54,
        metalness: 0.02
      });
    } else if (partName.includes('spleen') || partName.includes('lá lách')) {
      // Spleen: vascular lymphoid purplish-crimson with glistening capsule
      applyCustomProps(mesh, {
        name: 'PBR_Spleen',
        color: 0x581F2C,
        roughness: 0.42,
        metalness: 0.03
      });
    } else if (partName.includes('pleura') || matName.includes('pleura') || partName.includes('màng phổi')) {
      // Pleura: smooth delicate semi-transparent bluish-lavender serous pleural sac
      applyCustomProps(mesh, {
        name: 'PBR_Pleura',
        color: 0x6573B8,
        roughness: 0.45,
        metalness: 0.02,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        renderOrder: 7
      });
    } else if (partName.includes('lung') || matName.includes('lung') || partName.includes('phổi')) {
      // Lungs: living soft aerated roseate-lavender tissue
      applyCustomProps(mesh, {
        name: 'PBR_Lung',
        color: 0xB87B88,
        roughness: 0.62,
        metalness: 0.01
      });
    } else if (partName.includes('trachea') || partName.includes('bronch') || matName.includes('bronchi')) {
      // Trachea & Bronchi: pearly bluish-ivory cartilaginous rings
      applyCustomProps(mesh, {
        name: 'PBR_Trachea',
        color: 0xCBD7DC,
        roughness: 0.52,
        metalness: 0.03
      });
    }
  } else if (systemId === 'lymphatic') {
    if (partName.includes('spleen') || partName.includes('lá lách')) {
      // Spleen: vascular lymphoid purplish-crimson (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Spleen',
        color: 0x58202E,
        roughness: 0.82,
        metalness: 0.0
      });
    } else if (partName.includes('thymus') || partName.includes('tuyến ức')) {
      // Thymus: soft warm amber glandular tissue (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Thymus',
        color: 0xA0684C,
        roughness: 0.82,
        metalness: 0.0
      });
    } else if (partName.includes('tonsil') || partName.includes('amidan')) {
      // Palatine Tonsils: pinkish mucosa (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Tonsil',
        color: 0xC87B82,
        roughness: 0.80,
        metalness: 0.0
      });
    } else {
      // Lymph nodes and vessels: Soft physiological moss-green (gentle translucent medical PBR)
      applyCustomProps(mesh, {
        name: 'PBR_LymphNode',
        color: 0x4A7C59,
        roughness: 0.65,
        metalness: 0.0,
        transparent: true,
        opacity: 0.75,
        depthWrite: true
      });
    }
  } else if (systemId === 'muscular') {
    if (partName.includes('tendon') || matName.includes('tendon') || partName.includes('gân')) {
      // Tendons: silvery-white fibrous bands (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Tendon',
        color: 0xF2ECE0,
        roughness: 0.75,
        metalness: 0.0
      });
    } else if (partName.includes('fascia') || partName.includes('retinaculum') || matName.includes('fascia')) {
      // Fascia & retinacula: ultra-delicate collagenous sheath
      applyCustomProps(mesh, {
        name: 'PBR_Fascia',
        color: 0xF4EFE6,
        roughness: 0.78,
        metalness: 0.0,
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
      // Facial mimic muscles: authentic striated red muscle tissue (matte)
      applyCustomProps(mesh, {
        name: 'PBR_FacialMimic',
        color: 0xB42820,
        roughness: 0.80,
        metalness: 0.0,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('masseter') || partName.includes('temporalis')) {
      // Masticatory muscles (Masseter, Temporalis): distinct striated living muscle (matte)
      applyCustomProps(mesh, {
        name: 'PBR_Masticatory',
        color: 0xB0241C,
        roughness: 0.80,
        metalness: 0.0,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('platysma') || partName.includes('sternocleidomastoid')) {
      // Functional neck muscles (matte)
      applyCustomProps(mesh, {
        name: 'PBR_NeckMuscle',
        color: 0xB0241C,
        roughness: 0.80,
        metalness: 0.0,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else {
      // Living skeletal muscle tissue: rich physiological crimson (màu cơ vân chuẩn y khoa với độ ẩm sinh lý)
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach(m => {
        if (m && m.isMeshStandardMaterial) {
          m.name = 'PBR_Muscle';
          m.roughness = 0.58;
          m.metalness = 0.02;
          m.color.set(0xB2241C);
          m.transparent = false;
          m.opacity = 1.0;
          m.depthWrite = true;
          if (m.bumpMap) {
            m.bumpMap = null;
            m.bumpScale = 0;
          }
        }
      });
    }
  } else if (systemId === 'joints') {
    const isIntervertebral = partName.includes('intervertebral') || partName.includes('đĩa đệm') || (partName.includes('disc') && !partName.includes('temporomandibular') && !partName.includes('sternoclavicular') && !partName.includes('radio-ulnar') && !partName.includes('acromioclavicular'));
    if (isIntervertebral) {
      // Intervertebral disc anulus fibrosus: authentic fibrocartilaginous ivory tone with concentric collagen sheen
      applyCustomProps(mesh, {
        name: 'PBR_AnulusFibrosus',
        color: 0xDCD5C6,
        roughness: 0.52,
        metalness: 0.01,
        clearcoat: 0.38,
        clearcoatRoughness: 0.25,
        sheen: 0.45,
        sheenColor: 0xe2e8f0,
        transparent: true,
        opacity: 0.68,
        depthWrite: true,
        renderOrder: 1
      });
    } else if (partName.includes('cartilage') || partName.includes('meniscus') || partName.includes('discus') || partName.includes('articular') || matName.includes('cartilage')) {
      // Joint articular cartilage & meniscus: sophisticated luminous medical cerulean blue
      applyCustomProps(mesh, {
        name: 'PBR_JointCartilage',
        color: 0x3897E6,
        roughness: 0.46,
        metalness: 0.04,
        transparent: true,
        opacity: 0.88,
        depthWrite: true,
        renderOrder: 2
      });
    } else {
      // Joints & Ligaments (dây chằng, bao khớp, màng gian cốt)
      applyCustomProps(mesh, {
        name: 'PBR_Ligament',
        color: 0xCAD4DC,
        roughness: 0.60,
        metalness: 0.02,
        transparent: true,
        opacity: 0.88,
        depthWrite: true,
        renderOrder: 2
      });
    }
  } else if (systemId === 'skeletal') {
    const parentName = (mesh.parent?.name || '').toLowerCase();
    const isIntervertebralDisc =
      partName.includes('intervertebral') ||
      partName.includes('đĩa đệm') ||
      partName.includes('dia dem') ||
      partName.includes('discus') ||
      partName.includes('nucleus') ||
      partName.includes('pulposus') ||
      partName.includes('annulus') ||
      partName.includes('fibrosus') ||
      (partName.includes('disc') && !partName.includes('discipline')) ||
      ((partName.includes('verteb') || parentName.includes('verteb') || partName.includes('sacrum') || partName.includes('atlas') || parentName.includes('axis')) && mesh.name.endsWith('_2'));

    const isCartilage =
      matName.includes('cartilage') ||
      partName.includes('cartilage') ||
      partName.includes('sụn') ||
      partName.includes('costal') ||
      partName.includes('chondro') ||
      partName.includes('articular') ||
      partName.includes('meniscus') ||
      partName.includes('larynx') ||
      partName.includes('epiglottis') ||
      partName.includes('cricoid') ||
      partName.includes('arytenoid') ||
      partName.includes('thyroid');

    if (isIntervertebralDisc) {
      // Intervertebral disc fibrocartilage: elegant sapphire medical azure with hydrated collagen sheen
      applyCustomProps(mesh, {
        name: 'PBR_IntervertebralDisc',
        color: 0x367ea8,
        roughness: 0.38,
        metalness: 0.03,
        clearcoat: 0.45,
        clearcoatRoughness: 0.20,
        sheen: 0.70,
        sheenColor: 0x60a5fa,
        transparent: true,
        opacity: 0.94,
        depthWrite: true,
        renderOrder: 2
      });
    } else if (isCartilage) {
      // Costal, articular, and nasal cartilage: sophisticated luminous hyaline cartilage with subsurface edge glow
      applyCustomProps(mesh, {
        name: 'PBR_HyalineCartilage',
        color: 0x3897E6,
        roughness: 0.40,
        metalness: 0.03,
        clearcoat: 0.40,
        clearcoatRoughness: 0.22,
        sheen: 0.75,
        sheenColor: 0x93c5fd,
        transparent: true,
        opacity: 0.88,
        depthWrite: true,
        renderOrder: 2
      });
    } else if (matName.includes('suture') || partName.includes('suture') || partName.includes('khớp sọ')) {
      // Cranial suture seams (khớp vành, khớp dọc, khớp vảy sọ)
      applyCustomProps(mesh, {
        name: 'PBR_Suture',
        color: 0x8C7762,
        roughness: 0.78,
        metalness: 0.01
      });
    } else if (matName.includes('teeth-roots') || partName.includes('root')) {
      // Tooth roots: warm ivory-amber dentine
      applyCustomProps(mesh, {
        name: 'PBR_TeethRoots',
        color: 0xD8C59A,
        roughness: 0.55,
        metalness: 0.02
      });
    } else if (matName.includes('teeth') || matName.includes('dentine') || partName.includes('tooth') || partName.includes('teeth')) {
      // Natural pearlescent enamel
      applyCustomProps(mesh, {
        name: 'PBR_TeethEnamel',
        color: 0xFAF6EA,
        roughness: 0.32,
        metalness: 0.03,
        clearcoat: 0.35,
        clearcoatRoughness: 0.20
      });
    } else {
      // Warm authentic natural aged-ivory bone tone (màu xương ngà ánh vàng ấm chuẩn Visible Body)
      applyCustomProps(mesh, {
        name: 'PBR_Bone',
        color: 0xD8CFBC,
        roughness: 0.65,
        metalness: 0.01,
        clearcoat: 0.12,
        clearcoatRoughness: 0.50,
        sheen: 0.25,
        sheenColor: 0xfef3c7
      });
    }
  } else if (systemId === 'cardiovascular') {
    const mName = (mesh.material?.name || '').toLowerCase();
    if (mName.includes('artery') || partName.includes('artery') || partName.includes('aorta') || partName.includes('động mạch') || partName.includes('dong mach')) {
      // Arteries: Authentic living arterial blood crimson with soft fibrous adventitia diffusion
      applyCustomProps(mesh, {
        name: 'PBR_Artery',
        color: 0x9E2020,
        roughness: 0.54,
        metalness: 0.0,
        clearcoat: 0.0,
        sheen: 0.35,
        sheenColor: 0x7F1D1D
      });
    } else if (mName.includes('vein') || partName.includes('vein') || partName.includes('tĩnh mạch') || partName.includes('tinh mach') || partName.includes('cava')) {
      // Veins: Physiological deoxygenated venous blood navy with soft adventitial tone
      applyCustomProps(mesh, {
        name: 'PBR_Vein',
        color: 0x24426E,
        roughness: 0.52,
        metalness: 0.0,
        clearcoat: 0.0,
        sheen: 0.30,
        sheenColor: 0x1E3A5F
      });
    } else if (mName.includes('trapezius') || partName.includes('heart') || partName.includes('myocard') || partName.includes('tim') || partName.includes('ventric') || partName.includes('atrium')) {
      // Myocardium / Heart: Dense muscular cardiac parenchyma with natural biological texture
      applyCustomProps(mesh, {
        name: 'PBR_Heart',
        color: 0x782422,
        roughness: 0.48,
        metalness: 0.0,
        clearcoat: 0.0,
        sheen: 0.25,
        sheenColor: 0x5C1D1D
      });
    } else if (partName.includes('valve') || partName.includes('van tim')) {
      // Heart valves: Pearly fibrous endocardial leaflets
      applyCustomProps(mesh, {
        name: 'PBR_HeartValve',
        color: 0xD4CDC0,
        roughness: 0.45,
        metalness: 0.0,
        clearcoat: 0.0,
        transparent: true,
        opacity: 0.90
      });
    }
  } else if (systemId === 'nervous') {
    const mName = (mesh.material?.name || '').toLowerCase();
    if (partName.includes('ventricle') || partName.includes('aqueduct')) {
      // Ventricular cavities (CSF fluid stream): sophisticated luxury royal navy translucency
      applyCustomProps(mesh, {
        name: 'PBR_VentricleCSF',
        color: 0x1E40AF,
        roughness: 0.15,
        metalness: 0.0,
        clearcoat: 0.60,
        clearcoatRoughness: 0.10,
        transparent: true,
        opacity: 0.82,
        depthWrite: true,
        renderOrder: 2
      });
    } else if (partName.includes('choroid')) {
      // Choroid plexus (CSF vascular factory): crimson-orange capillary fronds
      applyCustomProps(mesh, {
        name: 'PBR_ChoroidPlexus',
        color: 0xEA580C,
        roughness: 0.45,
        metalness: 0.02,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25
      });
    } else if (partName.includes('dura')) {
      // Spinal & cranial dura mater: protective pearlescent-silver sheath
      applyCustomProps(mesh, {
        name: 'PBR_DuraMater',
        color: 0xD9E2EC,
        roughness: 0.45,
        metalness: 0.04,
        clearcoat: 0.30,
        clearcoatRoughness: 0.30,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        renderOrder: 3
      });
    } else if (mName.includes('brain') || mName.includes('frontal') || mName.includes('cerebell') || partName.includes('brain') || partName.includes('falx') || partName.includes('tentorium') || partName.includes('não') || partName.includes('nao')) {
      applyCustomProps(mesh, {
        name: 'PBR_BrainTissue',
        color: 0xDFB8A2,
        roughness: 0.50,
        metalness: 0.01,
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
        sheen: 0.30,
        sheenColor: 0xfecdd3
      });
    } else if (mName.includes('nerve') || partName.includes('nerve') || partName.includes('thần kinh') || partName.includes('than kinh') || partName.includes('plexus')) {
      applyCustomProps(mesh, {
        name: 'PBR_Nerve',
        color: 0xECC236,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.32,
        clearcoatRoughness: 0.25,
        sheen: 0.80,
        sheenColor: 0xfef08a
      });
    }
  }
}

function setupMesh(mesh, systemId, viewer) {
  // Idempotent: a mesh must not be set up twice.
  if (mesh.userData.baseMaterial) return;

  if (mesh.material) {
    // Enhance mesh materials with medical PBR realism
    enhanceMaterialForOrgan(mesh, systemId);

    // Global safety guard for materials without dedicated PBR presets
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => {
      if (m && m.isMeshStandardMaterial) {
        // If material was not assigned a specific custom PBR preset, ensure reasonable dielectric organic bounds
        if (!m.name || !m.name.startsWith('PBR_')) {
          if (m.roughness < 0.45) m.roughness = 0.55;
          if (m.metalness > 0.08) m.metalness = 0.02;
        }
        if (m.bumpMap) {
          m.bumpMap = null;
          m.bumpScale = 0;
          m.needsUpdate = true;
        }
      }
    });

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

  // Responsive framing adapted for 35° telephoto medical lens
  // Ensures entire skeleton from skull to toes fits with comfortable breathing room on both mobile & desktop
  const aspect = camera.aspect || (window.innerWidth / window.innerHeight) || 1;
  const fovRad = THREE.MathUtils.degToRad(camera.fov || 35);
  const tanHalfFov = Math.tan(fovRad / 2);
  const distV = (size.y / 2) / tanHalfFov;
  const distH = (size.x / 2) / (tanHalfFov * aspect);
  const padding = aspect < 1.0 ? 1.25 : 1.15;
  const distance = Math.max(distV, distH) * padding;

  // Strict anterior front direction (no rotation or angle on initial launch)
  camera.position.set(center.x, center.y, center.z + distance);
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