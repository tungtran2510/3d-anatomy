// Model Loading - GLB loading, mesh registry, material handling
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { state, setLoadingSystem } from '../state/store.js';
import { asset } from '../utils/paths.js';
import { getAnatomyRoot } from './orientationManager.js';
import { updateBodyEnvelopeAuto, realignIntegumentaryGeometry } from './bodyEnvelope.js';

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
      color: 0xD0C9BC, // Natural ivory fibrocartilage tone (chuẩn Visible Body, đặc đục không xuyên thấu)
      roughness: 0.62,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.35,
      sheen: 0.35,
      sheenColor: 0xe2e8f0,
      transparent: false,
      opacity: 1.0,
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

    // PBR Hydrogel Material (Chất nhầy gelatin ngà tự nhiên, không phát sáng neon)
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      name: 'PBR_NucleusPulposus',
      color: new THREE.Color(0xE8DEC8), // Gelatin ngà tự nhiên
      roughness: 0.35,
      metalness: 0.0,
      clearcoat: 0.30,
      clearcoatRoughness: 0.15,
      transmission: 0.15,
      ior: 1.45,
      transparent: true,
      opacity: 0.95,
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

function setupStomachAnatomy(model, systemId, viewer, nodes) {
  let stomachMesh = null;
  model.traverse((child) => {
    if (child.isMesh && child.name && /stomach/i.test(child.name)) {
      stomachMesh = child;
    }
  });

  if (!stomachMesh || !stomachMesh.geometry) return;

  const geom = stomachMesh.geometry;
  const pos = geom.attributes.position;
  const norm = geom.attributes.normal;
  const index = geom.index;
  if (!pos || !index) return;

  // Extract boundary edges to find the anterior wall window
  const idxArr = index.array;
  const edgeCount = new Map();
  function edgeKey(a, b) { return a < b ? a + '_' + b : b + '_' + a; }
  for (let i = 0; i < idxArr.length; i += 3) {
    const a = idxArr[i], b = idxArr[i+1], c = idxArr[i+2];
    edgeCount.set(edgeKey(a, b), (edgeCount.get(edgeKey(a, b)) || 0) + 1);
    edgeCount.set(edgeKey(b, c), (edgeCount.get(edgeKey(b, c)) || 0) + 1);
    edgeCount.set(edgeKey(c, a), (edgeCount.get(edgeKey(c, a)) || 0) + 1);
  }

  const boundaryEdges = [];
  for (const [k, count] of edgeCount.entries()) {
    if (count === 1) boundaryEdges.push(k.split('_').map(Number));
  }

  const adj = new Map();
  for (const [u, v] of boundaryEdges) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u).push(v);
    adj.get(v).push(u);
  }

  // Find the anterior window loop (>50 vertices, 78 vertices in Z-Anatomy)
  const visited = new Set();
  let holeLoop = null;
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    const loop = [start];
    visited.add(start);
    let curr = start;
    while (true) {
      const nbrs = adj.get(curr) || [];
      const next = nbrs.find(n => !visited.has(n));
      if (next !== undefined) {
        visited.add(next);
        loop.push(next);
        curr = next;
      } else {
        break;
      }
    }
    if (loop.length > 50) {
      holeLoop = loop;
      break;
    }
  }

  if (!holeLoop || holeLoop.length < 3) return;

  const N = holeLoop.length;
  // Boundary points with normals
  const bPts = holeLoop.map(vi => ({
    x: pos.getX(vi),
    y: pos.getY(vi),
    z: pos.getZ(vi),
    nx: norm ? norm.getX(vi) : 0,
    ny: norm ? norm.getY(vi) : 0,
    nz: norm ? norm.getZ(vi) : 1
  }));

  // Average center and outward normal
  let cx = 0, cy = 0, cz = 0, cnx = 0, cny = 0, cnz = 0;
  for (const p of bPts) {
    cx += p.x; cy += p.y; cz += p.z;
    cnx += p.nx; cny += p.ny; cnz += p.nz;
  }
  cx /= N; cy /= N; cz /= N;
  cnx /= N; cny /= N; cnz /= N;
  const nlen = Math.hypot(cnx, cny, cnz) || 1;
  cnx /= nlen; cny /= nlen; cnz /= nlen;

  // Gentle anatomical bulge (+Z anterior gastric wall contour)
  const bulge = 0.0035;
  const centerPt = {
    x: cx + cnx * bulge,
    y: cy + cny * bulge,
    z: cz + cnz * bulge,
    nx: cnx,
    ny: cny,
    nz: cnz
  };

  // Build concentric rings for smooth dome curvature matching stomach wall
  const rings = [bPts];
  const fractions = [0.66, 0.33];
  for (const f of fractions) {
    const ring = [];
    const ringBulge = bulge * Math.sin(Math.PI * f * 0.5);
    for (let i = 0; i < N; i++) {
      const bp = bPts[i];
      ring.push({
        x: cx + (bp.x - cx) * f + cnx * ringBulge,
        y: cy + (bp.y - cy) * f + cny * ringBulge,
        z: cz + (bp.z - cz) * f + cnz * ringBulge,
        nx: bp.nx * f + cnx * (1 - f),
        ny: bp.ny * f + cny * (1 - f),
        nz: bp.nz * f + cnz * (1 - f)
      });
    }
    rings.push(ring);
  }

  const patchVertices = [];
  const patchNormals = [];

  for (const p of rings[0]) {
    patchVertices.push(p.x, p.y, p.z);
    patchNormals.push(p.nx, p.ny, p.nz);
  }
  for (const p of rings[1]) {
    patchVertices.push(p.x, p.y, p.z);
    patchNormals.push(p.nx, p.ny, p.nz);
  }
  for (const p of rings[2]) {
    patchVertices.push(p.x, p.y, p.z);
    patchNormals.push(p.nx, p.ny, p.nz);
  }
  const centerIdx = 3 * N;
  patchVertices.push(centerPt.x, centerPt.y, centerPt.z);
  patchNormals.push(centerPt.nx, centerPt.ny, centerPt.nz);

  const patchIndices = [];
  for (let i = 0; i < N; i++) {
    const next = (i + 1) % N;
    patchIndices.push(i, next, N + i);
    patchIndices.push(next, N + next, N + i);
  }
  for (let i = 0; i < N; i++) {
    const next = (i + 1) % N;
    patchIndices.push(N + i, N + next, 2 * N + i);
    patchIndices.push(N + next, 2 * N + next, 2 * N + i);
  }
  for (let i = 0; i < N; i++) {
    const next = (i + 1) % N;
    patchIndices.push(2 * N + i, 2 * N + next, centerIdx);
  }

  const patchGeom = new THREE.BufferGeometry();
  patchGeom.setAttribute('position', new THREE.Float32BufferAttribute(patchVertices, 3));
  patchGeom.setAttribute('normal', new THREE.Float32BufferAttribute(patchNormals, 3));
  patchGeom.setIndex(patchIndices);
  patchGeom.computeVertexNormals();

  if (patchGeom.computeBoundsTree) {
    patchGeom.computeBoundsTree();
  }

  // Create PBR Material matching stomach perfectly
  const patchMat = stomachMesh.material ? stomachMesh.material.clone() : new THREE.MeshStandardMaterial({
    name: 'PBR_Stomach_AnteriorWall',
    color: 0xB86A64,
    roughness: 0.48,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
  patchMat.name = 'PBR_Stomach_AnteriorWall';
  patchMat.side = THREE.DoubleSide;

  const patchMesh = new THREE.Mesh(patchGeom, patchMat);
  patchMesh.name = 'Stomach_AnteriorWall';
  patchMesh.renderOrder = stomachMesh.renderOrder || 0;
  patchMesh.userData = {
    ...stomachMesh.userData,
    partId: 'Stomach_AnteriorWall',
    za_name: 'Stomach_AnteriorWall',
    system: systemId,
    isStomachPatch: true,
    isAnteriorWall: true,
    parentStomachId: 'Stomach',
    baseMaterial: patchMat
  };

  stomachMesh.add(patchMesh);

  // Register in structures and meshRegistry
  meshRegistry.set('Stomach_AnteriorWall', patchMesh);
  meshRegistry.set(patchMesh.name, patchMesh);
  structures.set('Stomach_AnteriorWall', {
    node: patchMesh,
    systemId,
    parentId: 'Stomach',
    childIds: [],
    ownMeshes: [patchMesh]
  });

  const stomachStruct = structures.get('Stomach');
  if (stomachStruct) {
    if (!stomachStruct.childIds) stomachStruct.childIds = [];
    if (!stomachStruct.childIds.includes('Stomach_AnteriorWall')) {
      stomachStruct.childIds.push('Stomach_AnteriorWall');
    }
    stomachStruct.ownMeshes = [stomachMesh];
  }

  if (nodes && !nodes.includes(patchMesh)) {
    nodes.push(patchMesh);
  }
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
  } else if (systemId === 'visceral') {
    setupStomachAnatomy(model, systemId, viewer, nodes);
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
  if (props.normalMap !== undefined) m.normalMap = props.normalMap;
  if (props.roughnessMap !== undefined) m.roughnessMap = props.roughnessMap;
  if (props.normalScale !== undefined) {
    if (m.normalScale) {
      if (typeof props.normalScale === 'number') m.normalScale.set(props.normalScale, props.normalScale);
      else if (props.normalScale.isVector2) m.normalScale.copy(props.normalScale);
      else if (Array.isArray(props.normalScale)) m.normalScale.set(props.normalScale[0], props.normalScale[1]);
    }
  }
  if (props.thickness !== undefined) m.thickness = props.thickness;
  if (props.attenuationDistance !== undefined) m.attenuationDistance = props.attenuationDistance;
  if (props.attenuationColor !== undefined) m.attenuationColor = new THREE.Color(props.attenuationColor);
  if (props.name) m.name = props.name;

  mesh.material = m;
  if (props.renderOrder) mesh.renderOrder = props.renderOrder;
}

let organicTexturesCache = null;

export function getOrganicTextures() {
  if (organicTexturesCache) return organicTexturesCache;
  if (typeof document === 'undefined') return null;

  try {
    // 1. Serosa / Peritoneum Micro-Noise Normal Map (128x128)
    const serosaCanvas = document.createElement('canvas');
    serosaCanvas.width = 128;
    serosaCanvas.height = 128;
    const sCtx = serosaCanvas.getContext('2d');
    if (sCtx) {
      const sImg = sCtx.createImageData(128, 128);
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          const nx = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 18;
          const ny = Math.cos(x * 0.35) * Math.sin(y * 0.35) * 18;
          sImg.data[idx] = Math.floor(128 + nx);
          sImg.data[idx + 1] = Math.floor(128 + ny);
          sImg.data[idx + 2] = 250;
          sImg.data[idx + 3] = 255;
        }
      }
      sCtx.putImageData(sImg, 0, 0);
    }
    const serosaMap = new THREE.CanvasTexture(serosaCanvas);
    serosaMap.wrapS = THREE.RepeatWrapping;
    serosaMap.wrapT = THREE.RepeatWrapping;
    serosaMap.repeat.set(16, 16);

    // 2. High-Definition Striated Muscle Fiber & Fascicle Normal Map (512x512)
    // Multi-scale biological striation synthesis: macro fascicular undulation + micro myofibrils + sarcomere banding
    const muscleCanvas = document.createElement('canvas');
    muscleCanvas.width = 512;
    muscleCanvas.height = 512;
    const mCtx = muscleCanvas.getContext('2d');

    const muscleCavityCanvas = document.createElement('canvas');
    muscleCavityCanvas.width = 256;
    muscleCavityCanvas.height = 256;
    const mcCtx = muscleCavityCanvas.getContext('2d');

    if (mCtx) {
      const mImg = mCtx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) {
        const ny = y / 512;
        for (let x = 0; x < 512; x++) {
          const nx = x / 512;
          const idx = (y * 512 + x) * 4;

          // Level 1: Macro fascicular wave (bó sợi cơ uốn lượn tự nhiên)
          const macroFascicle = Math.sin(nx * Math.PI * 18 + Math.cos(ny * Math.PI * 6) * 1.8) * 38;
          // Level 2: Micro myofibril bundles (vi sợi cơ song song)
          const microMyofibril = Math.sin(nx * Math.PI * 72 + Math.sin(ny * Math.PI * 14) * 0.9) * 16;
          // Level 3: Sarcomere periodic cross-striation (vân ngang kính hiển vi)
          const sarcomereBands = Math.sin(ny * Math.PI * 96) * 6;
          // Level 4: Inter-fascicular perimysium cleft (rãnh phân cách màng bao bó sợi)
          const perimysiumCleft = (((x * 19 + y * 7) % 31) - 15) * 1.6;

          const normalX = Math.floor(Math.max(0, Math.min(255, 128 + macroFascicle + microMyofibril)));
          const normalY = Math.floor(Math.max(0, Math.min(255, 128 + sarcomereBands + perimysiumCleft)));
          const normalZ = 238;

          mImg.data[idx] = normalX;
          mImg.data[idx + 1] = normalY;
          mImg.data[idx + 2] = normalZ;
          mImg.data[idx + 3] = 255;
        }
      }
      mCtx.putImageData(mImg, 0, 0);
    }
    const muscleMap = new THREE.CanvasTexture(muscleCanvas);
    muscleMap.wrapS = THREE.RepeatWrapping;
    muscleMap.wrapT = THREE.RepeatWrapping;
    muscleMap.repeat.set(8, 20);

    if (mcCtx) {
      const mcImg = mcCtx.createImageData(256, 256);
      for (let y = 0; y < 256; y++) {
        const ny = y / 256;
        for (let x = 0; x < 256; x++) {
          const nx = x / 256;
          const idx = (y * 256 + x) * 4;
          // Fascicular clefts absorb light (higher roughness), belly ridge reflects moist sheen (lower roughness)
          const fascicleWave = Math.sin(nx * Math.PI * 18 + Math.cos(ny * Math.PI * 6) * 1.8);
          const roughByte = Math.floor(120 + (1 - fascicleWave) * 26 + (((x * 13 + y * 23) % 17) - 8) * 1.2);
          const clamped = Math.max(90, Math.min(205, roughByte));
          mcImg.data[idx] = clamped;
          mcImg.data[idx + 1] = clamped;
          mcImg.data[idx + 2] = clamped;
          mcImg.data[idx + 3] = 255;
        }
      }
      mcCtx.putImageData(mcImg, 0, 0);
    }
    const muscleCavityMap = new THREE.CanvasTexture(muscleCavityCanvas);
    muscleCavityMap.wrapS = THREE.RepeatWrapping;
    muscleCavityMap.wrapT = THREE.RepeatWrapping;
    muscleCavityMap.repeat.set(8, 20);

    // 3. Dense Parallel Type-I Collagen Normal Map for Tendons & Ligaments (512x512)
    // Produces authentic glistening pearlescent collagen fiber highlights with longitudinal crimp
    const collagenCanvas = document.createElement('canvas');
    collagenCanvas.width = 512;
    collagenCanvas.height = 512;
    const colCtx = collagenCanvas.getContext('2d');
    if (colCtx) {
      const colImg = colCtx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) {
        const ny = y / 512;
        for (let x = 0; x < 512; x++) {
          const nx = x / 512;
          const idx = (y * 512 + x) * 4;
          const collagenCrimp = Math.sin(nx * Math.PI * 36 + Math.sin(ny * Math.PI * 8) * 0.7) * 32;
          const microFibrilSheen = Math.sin(nx * Math.PI * 110) * 14;
          const longitudinalGleam = (((x * 29 + y * 7) % 19) - 9) * 1.5;

          const cX = Math.floor(Math.max(0, Math.min(255, 128 + collagenCrimp + microFibrilSheen)));
          const cY = Math.floor(Math.max(0, Math.min(255, 128 + longitudinalGleam)));
          const cZ = 244;

          colImg.data[idx] = cX;
          colImg.data[idx + 1] = cY;
          colImg.data[idx + 2] = cZ;
          colImg.data[idx + 3] = 255;
        }
      }
      colCtx.putImageData(colImg, 0, 0);
    }
    const collagenMap = new THREE.CanvasTexture(collagenCanvas);
    collagenMap.wrapS = THREE.RepeatWrapping;
    collagenMap.wrapT = THREE.RepeatWrapping;
    collagenMap.repeat.set(10, 24);

    // 4. Living Human Epidermal Micro-Pore & Dermatoglyphic Normal Map (256x256)
    // Eliminates flat plastic mannequin look with subtle biological pore micro-relief
    const skinCanvas = document.createElement('canvas');
    skinCanvas.width = 256;
    skinCanvas.height = 256;
    const skinCtx = skinCanvas.getContext('2d');
    if (skinCtx) {
      const skinImg = skinCtx.createImageData(256, 256);
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
          const idx = (y * 256 + x) * 4;
          const isPore = ((x * 19 + y * 37) % 53) < 4;
          const poreRelief = isPore ? -26 : 0;
          const dermatoglyph = Math.sin(x * 0.35 + y * 0.25) * 10 + Math.cos(x * 0.25 - y * 0.35) * 8;
          skinImg.data[idx] = Math.floor(Math.max(0, Math.min(255, 128 + dermatoglyph + poreRelief)));
          skinImg.data[idx + 1] = Math.floor(Math.max(0, Math.min(255, 128 + dermatoglyph * 0.8 + poreRelief)));
          skinImg.data[idx + 2] = 248;
          skinImg.data[idx + 3] = 255;
        }
      }
      skinCtx.putImageData(skinImg, 0, 0);
    }
    const skinMap = new THREE.CanvasTexture(skinCanvas);
    skinMap.wrapS = THREE.RepeatWrapping;
    skinMap.wrapT = THREE.RepeatWrapping;
    skinMap.repeat.set(24, 24);

    // 5. Cortical Bone Micro-Porosity Mineral Normal Map (128x128)
    const boneCanvas = document.createElement('canvas');
    boneCanvas.width = 128;
    boneCanvas.height = 128;
    const bCtx = boneCanvas.getContext('2d');
    if (bCtx) {
      const bImg = bCtx.createImageData(128, 128);
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          const pore = ((x * 17 + y * 23) % 15) - 7;
          bImg.data[idx] = Math.floor(Math.max(0, Math.min(255, 128 + pore)));
          bImg.data[idx + 1] = Math.floor(Math.max(0, Math.min(255, 128 + pore)));
          bImg.data[idx + 2] = 252;
          bImg.data[idx + 3] = 255;
        }
      }
      bCtx.putImageData(bImg, 0, 0);
    }
    const boneMap = new THREE.CanvasTexture(boneCanvas);
    boneMap.wrapS = THREE.RepeatWrapping;
    boneMap.wrapT = THREE.RepeatWrapping;
    boneMap.repeat.set(12, 12);

    // 6. Spongy Alveolar Parenchyma Micro-Porosity Normal Map (128x128)
    const lungCanvas = document.createElement('canvas');
    lungCanvas.width = 128;
    lungCanvas.height = 128;
    const lCtx = lungCanvas.getContext('2d');
    if (lCtx) {
      const lImg = lCtx.createImageData(128, 128);
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          const alveolus = Math.sin(x * 0.7) * Math.sin(y * 0.7) * 20 + (((x * 19 + y * 31) % 11) - 5) * 2.5;
          lImg.data[idx] = Math.floor(Math.max(0, Math.min(255, 128 + alveolus)));
          lImg.data[idx + 1] = Math.floor(Math.max(0, Math.min(255, 128 + alveolus * 0.8)));
          lImg.data[idx + 2] = 248;
          lImg.data[idx + 3] = 255;
        }
      }
      lCtx.putImageData(lImg, 0, 0);
    }
    const lungMap = new THREE.CanvasTexture(lungCanvas);
    lungMap.wrapS = THREE.RepeatWrapping;
    lungMap.wrapT = THREE.RepeatWrapping;
    lungMap.repeat.set(16, 16);

    // 7. Procedural Organic Micro-Roughness / Cavity Variation Map (128x128)
    const cavityCanvas = document.createElement('canvas');
    cavityCanvas.width = 128;
    cavityCanvas.height = 128;
    const cCtx = cavityCanvas.getContext('2d');
    if (cCtx) {
      const cImg = cCtx.createImageData(128, 128);
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          // Micro-cellular organic grain with crevice variation
          const cellNoise = Math.sin(x * 0.45) * Math.cos(y * 0.45) * 40;
          const highFreq = (((x * 23 + y * 41) % 19) - 9) * 2.5;
          const roughVal = Math.floor(Math.max(70, Math.min(240, 135 + cellNoise + highFreq)));
          cImg.data[idx] = roughVal;
          cImg.data[idx + 1] = roughVal;
          cImg.data[idx + 2] = roughVal;
          cImg.data[idx + 3] = 255;
        }
      }
      cCtx.putImageData(cImg, 0, 0);
    }
    const cavityRoughnessMap = new THREE.CanvasTexture(cavityCanvas);
    cavityRoughnessMap.wrapS = THREE.RepeatWrapping;
    cavityRoughnessMap.wrapT = THREE.RepeatWrapping;
    cavityRoughnessMap.repeat.set(12, 12);

    organicTexturesCache = { serosaMap, muscleMap, muscleCavityMap, collagenMap, skinMap, boneMap, lungMap, cavityRoughnessMap };
    return organicTexturesCache;
  } catch (err) {
    console.warn('[organicTextures] Failed to create procedural textures:', err);
    return null;
  }
}

function enhanceMaterialForOrgan(mesh, systemId) {
  if (!mesh || !mesh.material) return;
  const textures = getOrganicTextures();

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
      // Liver & hepatic segments (I to VIII): rich living mahogany red-brown parenchymal tissue with natural moist Glisson's capsule sheen
      applyCustomProps(mesh, {
        name: 'PBR_Liver',
        color: 0x76241E,
        roughness: 0.42,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.38,
        clearcoatRoughness: 0.24,
        sheen: 0.50,
        sheenColor: 0x991b1b,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08]
      });
    } else if (partName.includes('gallbladder') || partName.includes('túi mật')) {
      // Gallbladder: deep olive-emerald cystic organ with smooth moist peritoneal surface
      applyCustomProps(mesh, {
        name: 'PBR_Gallbladder',
        color: 0x1E824C,
        roughness: 0.32,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.45,
        clearcoatRoughness: 0.20,
        sheen: 0.55,
        sheenColor: 0x34d399,
        ior: 1.36,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08]
      });
    } else if (partName.includes('bile duct') || partName.includes('cystic duct') || partName.includes('hepatic duct') || partName.includes('ống mật')) {
      // Bile ducts: smooth delicate green-teal ductal conduit
      applyCustomProps(mesh, {
        name: 'PBR_BileDuct',
        color: 0x2A8C74,
        roughness: 0.38,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.35,
        sheen: 0.35,
        sheenColor: 0x6ee7b7,
        ior: 1.37,
        transparent: true,
        opacity: 0.94,
        depthWrite: true
      });
    } else if (partName.includes('stomach') || partName.includes('dạ dày') || partName.includes('gastric')) {
      // Stomach: warm living gastric muscularis & serosa with subtle moist organic sheen (no plastic shine)
      applyCustomProps(mesh, {
        name: 'PBR_Stomach',
        color: 0xAF5E58,
        roughness: 0.44,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.35,
        clearcoatRoughness: 0.26,
        sheen: 0.50,
        sheenColor: 0xfca5a5,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.10, 0.10],
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        side: THREE.DoubleSide
      });
    } else if (partName.includes('duodenum') || partName.includes('tá tràng')) {
      // Duodenum: C-loop wrapping around pancreas head with living mucosal depth
      applyCustomProps(mesh, {
        name: 'PBR_Duodenum',
        color: 0xD0766B,
        roughness: 0.40,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.38,
        clearcoatRoughness: 0.22,
        sheen: 0.48,
        sheenColor: 0xfecdd3,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.10, 0.10],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('jejunum') || partName.includes('ileum') || partName.includes('ruột non') || partName.includes('hỗng tràng') || partName.includes('hồi tràng')) {
      // Small intestine: living delicate warm coral-pink peristaltic loops with moist serous sheen
      applyCustomProps(mesh, {
        name: 'PBR_SmallIntestine',
        color: 0xD96B5B,
        roughness: 0.38,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.42,
        clearcoatRoughness: 0.20,
        sheen: 0.52,
        sheenRoughness: 0.32,
        sheenColor: 0xfecdd3,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.10, 0.10],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('taenia')) {
      // Taenia coli: silvery-ivory longitudinal smooth muscle band
      applyCustomProps(mesh, {
        name: 'PBR_TaeniaColi',
        color: 0xEDE8D0,
        roughness: 0.55,
        metalness: 0.02
      });
    } else if (partName.includes('appendix') || partName.includes('ruột thừa')) {
      // Vermiform appendix: tapered vascular mucosal appendage hanging from cecum
      applyCustomProps(mesh, {
        name: 'PBR_Appendix',
        color: 0xAB5E55,
        roughness: 0.44,
        metalness: 0.02,
        clearcoat: 0.30,
        sheen: 0.35
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
        color: 0x98443A,
        roughness: 0.44,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
        sheen: 0.40,
        sheenColor: 0xfca5a5,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08],
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
        color: 0xD4A75E,
        roughness: 0.58,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.22,
        clearcoatRoughness: 0.32,
        sheen: 0.40,
        sheenColor: 0xfef08a,
        normalMap: textures?.serosaMap,
        normalScale: [0.12, 0.12]
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
        color: 0x7A2626,
        roughness: 0.36,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.44,
        clearcoatRoughness: 0.20,
        sheen: 0.48,
        sheenColor: 0xdc2626,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.06, 0.06]
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
        metalness: 0.02,
        clearcoat: 0.25,
        sheen: 0.30
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
      // Spleen: vascular lymphoid purplish-crimson with glistening serosal capsule
      applyCustomProps(mesh, {
        name: 'PBR_Spleen',
        color: 0x541824,
        roughness: 0.34,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.50,
        clearcoatRoughness: 0.18,
        sheen: 0.52,
        sheenColor: 0x881337,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.06, 0.06]
      });
    } else if (partName.includes('pleura') || matName.includes('pleura') || partName.includes('màng phổi')) {
      // Pleura: smooth delicate semi-transparent serous pleural sac
      applyCustomProps(mesh, {
        name: 'PBR_Pleura',
        color: 0xBAC3D2,
        roughness: 0.35,
        metalness: 0.01,
        clearcoat: 0.40,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        renderOrder: 7
      });
    } else if (partName.includes('lung') || matName.includes('lung') || partName.includes('phổi')) {
      // Lungs: living alveolar spongy roseate-slate parenchyma with subtle pleural sheen
      applyCustomProps(mesh, {
        name: 'PBR_Lung',
        color: 0x986E74,
        roughness: 0.62,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.0,
        clearcoat: 0.20,
        clearcoatRoughness: 0.35,
        sheen: 0.45,
        sheenColor: 0xBA8A90,
        normalMap: textures?.lungMap,
        normalScale: [0.08, 0.08]
      });
    } else if (partName.includes('trachea') || partName.includes('bronch') || matName.includes('bronchi')) {
      // Trachea & Bronchi: pearly bluish-ivory cartilaginous rings with living hyaline transmission
      applyCustomProps(mesh, {
        name: 'PBR_Trachea',
        color: 0xDCE4E9,
        roughness: 0.36,
        metalness: 0.01,
        clearcoat: 0.30,
        clearcoatRoughness: 0.22,
        transmission: 0.08,
        thickness: 0.008,
        attenuationColor: 0x93c5fd,
        attenuationDistance: 0.015,
        ior: 1.40
      });
    } else if (partName.includes('parathyroid') || partName.includes('cận giáp')) {
      // Parathyroid glands: caramel-amber parenchymal lentil bodies
      applyCustomProps(mesh, {
        name: 'PBR_Parathyroid',
        color: 0xB46A3C,
        roughness: 0.34,
        metalness: 0.02,
        clearcoat: 0.34,
        sheen: 0.45,
        sheenColor: 0xfcb97d
      });
    } else if (partName.includes('thyroid') || partName.includes('tuyến giáp')) {
      // Thyroid gland: highly vascular parenchymal gland, rich follicular colloid
      applyCustomProps(mesh, {
        name: 'PBR_Thyroid',
        color: 0x9E382B,
        roughness: 0.36,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.44,
        clearcoatRoughness: 0.22,
        sheen: 0.60,
        sheenColor: 0xf87171,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08]
      });
    } else if (partName.includes('suprarenal') || partName.includes('adrenal') || partName.includes('thượng thận')) {
      // Suprarenal / Adrenal glands: golden ochre steroid cortex with vascular medulla
      applyCustomProps(mesh, {
        name: 'PBR_Suprarenal',
        color: 0xD97706,
        roughness: 0.38,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.38,
        clearcoatRoughness: 0.26,
        sheen: 0.52,
        sheenColor: 0xfde047,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08]
      });
    } else if (partName.includes('pineal') || partName.includes('tuyến tùng') || partName.includes('pituitary') || partName.includes('hypophysis') || partName.includes('tuyến yên')) {
      // Pineal & Pituitary glands: delicate neuroendocrine glandular bodies
      applyCustomProps(mesh, {
        name: 'PBR_Neuroendocrine',
        color: 0xB56576,
        roughness: 0.36,
        metalness: 0.01,
        clearcoat: 0.38,
        sheen: 0.48,
        sheenColor: 0xfda4af
      });
    }
  } else if (systemId === 'lymphatic') {
    if (partName.includes('spleen') || partName.includes('lá lách')) {
      // Spleen: vascular lymphoid purplish-crimson with glistening serosal capsule
      applyCustomProps(mesh, {
        name: 'PBR_Spleen',
        color: 0x541824,
        roughness: 0.34,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.02,
        clearcoat: 0.50,
        clearcoatRoughness: 0.18,
        sheen: 0.52,
        sheenColor: 0x881337,
        ior: 1.38,
        normalMap: textures?.serosaMap,
        normalScale: [0.06, 0.06]
      });
    } else if (partName.includes('thymus') || partName.includes('tuyến ức')) {
      // Thymus: soft lobular warm amber-tan lymphoid tissue
      applyCustomProps(mesh, {
        name: 'PBR_Thymus',
        color: 0x9E6852,
        roughness: 0.44,
        metalness: 0.01,
        clearcoat: 0.34,
        clearcoatRoughness: 0.26,
        sheen: 0.42,
        sheenColor: 0xd8b4a0
      });
    } else if (partName.includes('tonsil') || partName.includes('amidan')) {
      // Palatine Tonsils: pinkish mucosa with lymphoid crypts
      applyCustomProps(mesh, {
        name: 'PBR_Tonsil',
        color: 0xC4727A,
        roughness: 0.40,
        metalness: 0.01,
        clearcoat: 0.38,
        sheen: 0.48,
        sheenColor: 0xf43f5e
      });
    } else {
      // Lymph nodes and vessels: Translucent living biological jade-emerald with thin-walled endothelial transmission
      applyCustomProps(mesh, {
        name: 'PBR_LymphNode',
        color: 0x22c55e,
        roughness: 0.20,
        metalness: 0.0,
        transmission: 0.45,
        thickness: 0.010,
        attenuationColor: 0x4ade80,
        attenuationDistance: 0.015,
        ior: 1.42,
        clearcoat: 0.68,
        clearcoatRoughness: 0.12,
        sheen: 0.80,
        sheenColor: 0x86efac,
        sheenRoughness: 0.22,
        transparent: true,
        opacity: 0.88,
        depthWrite: true
      });
    }
  } else if (systemId === 'muscular') {
    if (partName.includes('tendon') || matName.includes('tendon') || partName.includes('gân')) {
      // Tendons: silky pearlescent Type-I collagen fibrous bands with longitudinal fiber sheen
      applyCustomProps(mesh, {
        name: 'PBR_Tendon',
        color: 0xEFEAD8,
        roughness: 0.30,
        metalness: 0.01,
        clearcoat: 0.40,
        clearcoatRoughness: 0.22,
        sheen: 0.85,
        sheenColor: 0xFFFDF5,
        sheenRoughness: 0.20,
        normalMap: textures?.collagenMap,
        normalScale: [0.20, 0.20],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('bursa') || matName.includes('bursa') || partName.includes('túi hoạt dịch')) {
      // Synovial bursae: delicate fluid-filled cushioning sacs with pearlescent synovial sheath
      applyCustomProps(mesh, {
        name: 'PBR_Bursa',
        color: 0xE2ECE8,
        roughness: 0.28,
        metalness: 0.01,
        clearcoat: 0.58,
        clearcoatRoughness: 0.18,
        sheen: 0.70,
        sheenColor: 0xd1fae5,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        renderOrder: 6
      });
    } else if (
      partName.includes('iliotibial') ||
      partName.includes('thoracolumbar') ||
      partName.includes('plantar aponeurosis') ||
      partName.includes('palmar aponeurosis')
    ) {
      // Major investing fascial tracts & aponeuroses: iridescent pearlescent collagenous sheath
      applyCustomProps(mesh, {
        name: 'PBR_Fascia_Iridescent',
        color: 0xF4EFE6,
        roughness: 0.32,
        metalness: 0.01,
        clearcoat: 0.48,
        clearcoatRoughness: 0.20,
        sheen: 0.90,
        sheenColor: 0xFFFFFF,
        sheenRoughness: 0.18,
        normalMap: textures?.collagenMap,
        normalScale: [0.18, 0.18],
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        renderOrder: 5
      });
    } else if (partName.includes('aponeuros') || matName.includes('aponeuros') || partName.includes('cân')) {
      // Aponeuroses: broad flat pearlescent tendinous sheets
      applyCustomProps(mesh, {
        name: 'PBR_Aponeurosis',
        color: 0xF0ECE1,
        roughness: 0.34,
        metalness: 0.01,
        clearcoat: 0.42,
        clearcoatRoughness: 0.22,
        sheen: 0.80,
        sheenColor: 0xFFFDF5,
        normalMap: textures?.collagenMap,
        normalScale: [0.18, 0.18],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (partName.includes('fascia') || partName.includes('retinaculum') || matName.includes('fascia')) {
      // Fascia & retinacula: ultra-delicate glistening collagenous sheath
      applyCustomProps(mesh, {
        name: 'PBR_Fascia',
        color: 0xF2EFE8,
        roughness: 0.38,
        metalness: 0.0,
        clearcoat: 0.38,
        clearcoatRoughness: 0.25,
        sheen: 0.65,
        sheenColor: 0xffffff,
        transparent: true,
        opacity: 0.45,
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
      partName.includes('corrugator') ||
      partName.includes('risorius')
    ) {
      // Facial mimic muscles: delicate, highly vascular myoglobin tone with biological light transmission
      applyCustomProps(mesh, {
        name: 'PBR_FacialMimic',
        color: 0x8C262E,
        roughness: 0.45,
        roughnessMap: textures?.muscleCavityMap || textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.20,
        clearcoatRoughness: 0.35,
        sheen: 0.70,
        sheenColor: 0xd946ef,
        sheenRoughness: 0.32,
        transmission: 0.10,
        thickness: 0.020,
        attenuationColor: 0xa81c2d,
        attenuationDistance: 0.025,
        normalMap: textures?.muscleMap,
        normalScale: [0.14, 0.14],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (
      partName.includes('masseter') ||
      partName.includes('temporalis') ||
      partName.includes('pterygoid') ||
      partName.includes('platysma') ||
      partName.includes('sternocleidomastoid')
    ) {
      // Powerful masticatory & functional neck muscles: deep striated myoglobin
      applyCustomProps(mesh, {
        name: 'PBR_Masticatory_Neck',
        color: 0x821E26,
        roughness: 0.44,
        roughnessMap: textures?.muscleCavityMap || textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.22,
        clearcoatRoughness: 0.32,
        sheen: 0.65,
        sheenColor: 0xb91c1c,
        sheenRoughness: 0.30,
        transmission: 0.08,
        thickness: 0.030,
        attenuationColor: 0x991b1b,
        attenuationDistance: 0.035,
        normalMap: textures?.muscleMap,
        normalScale: [0.18, 0.18],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else {
      // Living skeletal muscle tissue (Chest, Back, Abdomen, Upper & Lower Limbs):
      // Rich physiological myoglobin ruby-crimson, SSS biological light transmission,
      // multi-scale fascicle striation normal map and moist epimysial sheen.
      applyCustomProps(mesh, {
        name: 'PBR_Muscle',
        color: 0x821E26,
        roughness: 0.44,
        roughnessMap: textures?.muscleCavityMap || textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.22,
        clearcoatRoughness: 0.32,
        sheen: 0.65,
        sheenColor: 0xb91c1c,
        sheenRoughness: 0.30,
        transmission: 0.08,
        thickness: 0.030,
        attenuationColor: 0x991b1b,
        attenuationDistance: 0.035,
        normalMap: textures?.muscleMap,
        normalScale: [0.18, 0.18],
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    }
  } else if (systemId === 'joints') {
    const isIntervertebral = partName.includes('intervertebral') || partName.includes('đĩa đệm') || (partName.includes('disc') && !partName.includes('temporomandibular') && !partName.includes('sternoclavicular') && !partName.includes('radio-ulnar') && !partName.includes('acromioclavicular'));
    if (isIntervertebral) {
      // Intervertebral disc anulus fibrosus: authentic fibrocartilaginous ivory tone with concentric collagen sheen, fully opaque
      applyCustomProps(mesh, {
        name: 'PBR_AnulusFibrosus',
        color: 0xD0C9BC,
        roughness: 0.62,
        metalness: 0.0,
        clearcoat: 0.08,
        clearcoatRoughness: 0.35,
        sheen: 0.35,
        sheenColor: 0xe2e8f0,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        renderOrder: 1
      });
    } else if (partName.includes('cartilage') || partName.includes('meniscus') || partName.includes('discus') || partName.includes('articular') || matName.includes('cartilage')) {
      // Joint articular cartilage & meniscus: opalescent pearly hyaline cartilage, opaque
      applyCustomProps(mesh, {
        name: 'PBR_JointCartilage',
        color: 0xD8E0E5,
        roughness: 0.40,
        metalness: 0.0,
        clearcoat: 0.25,
        clearcoatRoughness: 0.20,
        sheen: 0.38,
        sheenColor: 0xCBD5E1,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        renderOrder: 2
      });
    } else {
      // Joints & Ligaments (dây chằng, bao khớp, màng gian cốt): warm ivory-ochre dense collagen, fully opaque (đục đục lên, phân biệt rõ với nền sáng và thân xương)
      applyCustomProps(mesh, {
        name: 'PBR_Ligament',
        color: 0xD4C8B2,
        roughness: 0.52,
        metalness: 0.0,
        clearcoat: 0.15,
        clearcoatRoughness: 0.25,
        sheen: 0.45,
        sheenColor: 0xe6dac5,
        normalMap: textures?.collagenMap || textures?.serosaMap,
        normalScale: [0.12, 0.12],
        transparent: false,
        opacity: 1.0,
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
      // Intervertebral disc fibrocartilage: authentic fibrous collagen ivory-slate tone
      applyCustomProps(mesh, {
        name: 'PBR_IntervertebralDisc',
        color: 0xD0C9BC,
        roughness: 0.62,
        metalness: 0.0,
        clearcoat: 0.08,
        clearcoatRoughness: 0.35,
        sheen: 0.35,
        sheenColor: 0xe2e8f0,
        transparent: false,
        opacity: 1.0,
        depthWrite: true,
        renderOrder: 2
      });
    } else if (isCartilage) {
      // Costal, articular, and nasal cartilage: living pearly opalescent hyaline cartilage, fully opaque
      applyCustomProps(mesh, {
        name: 'PBR_HyalineCartilage',
        color: 0xD8E0E5,
        roughness: 0.40,
        metalness: 0.0,
        clearcoat: 0.25,
        clearcoatRoughness: 0.22,
        sheen: 0.38,
        sheenColor: 0xCBD5E1,
        transparent: false,
        opacity: 1.0,
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
        color: 0xFBF7EE,
        roughness: 0.26,
        metalness: 0.01,
        clearcoat: 0.44,
        clearcoatRoughness: 0.16
      });
    } else if (
      partName.includes('cranium') ||
      partName.includes('cranial') ||
      partName.includes('frontal') ||
      partName.includes('parietal') ||
      partName.includes('occipital') ||
      partName.includes('temporal') ||
      partName.includes('sphenoid') ||
      partName.includes('ethmoid') ||
      partName.includes('maxilla') ||
      partName.includes('mandible') ||
      partName.includes('zygomatic') ||
      partName.includes('nasal') ||
      partName.includes('lacrimal') ||
      partName.includes('palatine') ||
      partName.includes('vomer') ||
      partName.includes('sọ') ||
      partName.includes('hàm') ||
      partName.includes('gò má')
    ) {
      // Cranial & facial bones: clean cortical ivory tone with delicate suture clarity, eliminating muddy ghosting
      applyCustomProps(mesh, {
        name: 'PBR_CranialBone',
        color: 0xE2D9C8,
        roughness: 0.52,
        metalness: 0.01,
        clearcoat: 0.18,
        clearcoatRoughness: 0.35,
        sheen: 0.30,
        sheenColor: 0xfef9e7,
        normalMap: textures?.boneMap,
        normalScale: [0.06, 0.06]
      });
    } else {
      // Warm authentic natural aged-ivory cortical bone tone (matte organic bone texture, no plastic shine)
      applyCustomProps(mesh, {
        name: 'PBR_Bone',
        color: 0xDDD6C8,
        roughness: 0.62,
        metalness: 0.0,
        clearcoat: 0.08,
        clearcoatRoughness: 0.45,
        sheen: 0.20,
        sheenColor: 0xfaf5eb,
        normalMap: textures?.boneMap,
        normalScale: [0.08, 0.08]
      });
    }
  } else if (systemId === 'cardiovascular') {
    const mName = (mesh.material?.name || '').toLowerCase();
    if (mName.includes('artery') || partName.includes('artery') || partName.includes('aorta') || partName.includes('động mạch') || partName.includes('dong mach')) {
      // Arteries: Authentic living arterial blood crimson with soft fibrous adventitia diffusion (not plastic wire)
      applyCustomProps(mesh, {
        name: 'PBR_Artery',
        color: 0x8E1919,
        roughness: 0.46,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.28,
        clearcoatRoughness: 0.24,
        sheen: 0.55,
        sheenColor: 0xf87171,
        transmission: 0.05,
        thickness: 0.008,
        attenuationColor: 0xdc2626,
        attenuationDistance: 0.010
      });
    } else if (mName.includes('vein') || partName.includes('vein') || partName.includes('tĩnh mạch') || partName.includes('tinh mach') || partName.includes('cava')) {
      // Veins: Physiological deoxygenated venous blood deep slate navy (eliminates plastic blue wire look)
      applyCustomProps(mesh, {
        name: 'PBR_Vein',
        color: 0x1A385C,
        roughness: 0.48,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.26,
        clearcoatRoughness: 0.26,
        sheen: 0.45,
        sheenColor: 0x60a5fa,
        transmission: 0.08,
        thickness: 0.006,
        attenuationColor: 0x1e40af,
        attenuationDistance: 0.012
      });
    } else if (mName.includes('trapezius') || partName.includes('heart') || partName.includes('myocard') || partName.includes('tim') || partName.includes('ventric') || partName.includes('atrium')) {
      // Myocardium / Heart: Dense muscular cardiac parenchyma with natural biological texture & epicardial moist sheen
      applyCustomProps(mesh, {
        name: 'PBR_Heart',
        color: 0x78201C,
        roughness: 0.42,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.38,
        clearcoatRoughness: 0.22,
        sheen: 0.58,
        sheenColor: 0xb91c1c,
        ior: 1.38,
        normalMap: textures?.muscleMap || textures?.serosaMap,
        normalScale: [0.12, 0.12],
        thickness: 0.025,
        attenuationColor: 0x991b1b,
        attenuationDistance: 0.030
      });
    } else if (partName.includes('valve') || partName.includes('van tim')) {
      // Heart valves: Pearly fibrous endocardial leaflets
      applyCustomProps(mesh, {
        name: 'PBR_HeartValve',
        color: 0xD8D2C6,
        roughness: 0.38,
        metalness: 0.0,
        clearcoat: 0.25,
        clearcoatRoughness: 0.20,
        transmission: 0.30,
        thickness: 0.003,
        attenuationColor: 0xfef3c7,
        transparent: true,
        opacity: 0.88
      });
    }
  } else if (systemId === 'nervous') {
    const mName = (mesh.material?.name || '').toLowerCase();
    if (partName.includes('ventricle') || partName.includes('aqueduct')) {
      // Ventricular cavities (CSF fluid stream): sophisticated luxury royal navy translucency
      applyCustomProps(mesh, {
        name: 'PBR_VentricleCSF',
        color: 0x1E40AF,
        roughness: 0.12,
        metalness: 0.0,
        clearcoat: 0.70,
        clearcoatRoughness: 0.10,
        transmission: 0.45,
        ior: 1.333,
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
    } else if (partName.includes('cornea') || matName.includes('cornea')) {
      // Cornea: crystal-clear transparent refractive dome with physiological curvature
      applyCustomProps(mesh, {
        name: 'PBR_Cornea',
        color: 0xEEF6F8,
        roughness: 0.03,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        ior: 1.376,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        renderOrder: 10
      });
    } else if (partName.includes('lens') || matName.includes('lens')) {
      // Crystalline lens: transparent biconvex optical element
      applyCustomProps(mesh, {
        name: 'PBR_Lens',
        color: 0xE0F2FE,
        roughness: 0.06,
        metalness: 0.0,
        clearcoat: 0.95,
        transparent: true,
        opacity: 0.42,
        depthWrite: true,
        renderOrder: 9
      });
    } else if (partName.includes('iris') || matName.includes('iris')) {
      // Iris: rich pigmented circular diaphragm (authentic warm hazel-chestnut brown)
      applyCustomProps(mesh, {
        name: 'PBR_Iris',
        color: 0x3D2415,
        roughness: 0.38,
        metalness: 0.01,
        clearcoat: 0.35,
        clearcoatRoughness: 0.20,
        sheen: 0.40,
        sheenColor: 0x78350f
      });
    } else if (partName.includes('sclera') || partName.includes('segment_of_eyeball') || matName.includes('eye')) {
      // Sclera: clean, moist physiological white with hydrated scleral clearcoat
      applyCustomProps(mesh, {
        name: 'PBR_Sclera',
        color: 0xF4F6F9,
        roughness: 0.16,
        metalness: 0.0,
        clearcoat: 0.75,
        clearcoatRoughness: 0.08,
        sheen: 0.35,
        sheenColor: 0xe2e8f0,
        ior: 1.36
      });
    } else if (
      mName.includes('brain') || mName.includes('frontal') || mName.includes('cerebell') ||
      mName.includes('cortex') || mName.includes('thalam') || mName.includes('pons') ||
      partName.includes('brain') || partName.includes('falx') || partName.includes('tentorium') ||
      partName.includes('gyrus') || partName.includes('sulcus') || partName.includes('cortex') ||
      partName.includes('thalam') || partName.includes('hypothalam') || partName.includes('cerebell') ||
      partName.includes('pons') || partName.includes('medulla oblongata') || partName.includes('amygdal') ||
      partName.includes('hippocamp') || partName.includes('nucleus') || partName.includes('collicul') ||
      partName.includes('peduncle') || partName.includes('putamen') || partName.includes('caudate') ||
      partName.includes('pallidus') || partName.includes('striatum') || partName.includes('commissure') ||
      partName.includes('fornix') || partName.includes('mammillary') || partName.includes('pineal') ||
      partName.includes('não') || partName.includes('nao')
    ) {
      // Living cerebral cortex & gyri: rich warm physiological grey matter with moist leptomeningeal sheen & micro-normals
      applyCustomProps(mesh, {
        name: 'PBR_BrainTissue',
        color: 0xD8A28E,
        roughness: 0.38,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.01,
        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        sheen: 0.68,
        sheenRoughness: 0.28,
        sheenColor: 0xfca5a5,
        ior: 1.37,
        thickness: 0.020,
        attenuationColor: 0xf43f5e,
        attenuationDistance: 0.025,
        normalMap: textures?.serosaMap,
        normalScale: [0.08, 0.08]
      });
    } else if (
      partName.includes('spinal cord') || partName.includes('tủy sống') || partName.includes('tuy song') ||
      partName.includes('medulla spinalis') || partName.includes('cauda equina') || partName.includes('filum terminale')
    ) {
      // Spinal cord & cauda equina: warm alabaster-ivory myelinated white matter with moist CSF sheen
      applyCustomProps(mesh, {
        name: 'PBR_SpinalCord',
        color: 0xEDE2C8,
        roughness: 0.36,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.0,
        clearcoat: 0.42,
        clearcoatRoughness: 0.16,
        sheen: 0.72,
        sheenRoughness: 0.24,
        sheenColor: 0xfef3c7,
        transmission: 0.05,
        thickness: 0.010,
        attenuationColor: 0xfef08a,
        attenuationDistance: 0.018,
        normalMap: textures?.collagenMap,
        normalScale: [0.08, 0.08]
      });
    } else {
      // Peripheral nerves & innervation plexuses: authentic living warm-straw ivory with lubricated epineural sheath & longitudinal collagen fascicles
      applyCustomProps(mesh, {
        name: 'PBR_Nerve',
        color: 0xE4D49E,
        roughness: 0.36,
        roughnessMap: textures?.cavityRoughnessMap,
        metalness: 0.0,
        clearcoat: 0.38,
        clearcoatRoughness: 0.18,
        sheen: 0.72,
        sheenRoughness: 0.24,
        sheenColor: 0xfef9c3,
        transmission: 0.05,
        thickness: 0.006,
        attenuationColor: 0xfde047,
        attenuationDistance: 0.012,
        normalMap: textures?.collagenMap,
        normalScale: [0.12, 0.12]
      });
    }
  } else if (systemId === 'integumentary') {
    // Realign geometry for natural extremity coverage
    realignIntegumentaryGeometry(mesh);
    // Human Integumentary System (Hệ Da): authentic human living skin PBR with epidermal warmth & soft matte dermal finish
    applyCustomProps(mesh, {
      name: 'PBR_Skin',
      color: 0xD6A389,
      roughness: 0.72,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      sheen: 0.50,
      sheenRoughness: 0.65,
      sheenColor: 0xfecdd3,
      transmission: 0.0,
      thickness: 0.0,
      ior: 1.34,
      normalMap: null,
      flatShading: false,
      transparent: false,
      opacity: 1.0,
      depthWrite: true,
      side: THREE.DoubleSide
    });
  }
}

function setupMesh(mesh, systemId, viewer) {
  // Idempotent: a mesh must not be set up twice.
  if (mesh.userData.baseMaterial) return;

  if (systemId === 'integumentary' || mesh.name === 'Skin') {
    mesh.position.set(0, 0.002, 0.0095);
    realignIntegumentaryGeometry(mesh);
  }

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

  // Enable soft contact shadows with clinical accuracy (solid organs cast and receive shadows, translucent structures don't cast harsh shadows)
  const isVeryTranslucent = mesh.material && (Array.isArray(mesh.material) ? mesh.material.some(m => m.transparent && m.opacity < 0.5) : (mesh.material.transparent && mesh.material.opacity < 0.5));
  mesh.castShadow = !isVeryTranslucent;
  mesh.receiveShadow = true;

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