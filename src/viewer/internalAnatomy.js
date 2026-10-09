import * as THREE from 'three';

/**
 * Procedural Anatomical Generator: Internal Renal Architecture (Thận Bổ Dọc)
 * Creates authentic clinical renal parenchyma: Cortex, 7 Pyramids of Malpighi,
 * Minor/Major Calyces, Renal Pelvis, and Clinical Nephrolithiasis (Sỏi thận).
 */
export function setupKidneyInternalAnatomy(model, systemId, viewer, nodes, meshRegistry, structures) {
  let kidneyLeft = null;
  model.traverse((child) => {
    if (child.isMesh && child.name && /kidneyl|kidney\.l/i.test(child.name)) {
      kidneyLeft = child;
    }
  });

  if (!kidneyLeft || !kidneyLeft.geometry) return;

  if (!kidneyLeft.geometry.boundingBox) kidneyLeft.geometry.computeBoundingBox();
  const box = kidneyLeft.geometry.boundingBox;
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const internalGroup = new THREE.Group();
  internalGroup.name = 'Kidney_Internal_Coronal_Group';
  internalGroup.visible = false; // Visible in dedicated coronal views

  // 1. Renal Cortex Coronal Cross-Section (Diện cắt Vỏ thận)
  // Bean-shaped outer shell with thickness ~8mm
  const cortexShape = new THREE.Shape();
  // Generate kidney bean profile in XY plane
  const W = size.x * 0.46;
  const H = size.y * 0.48;
  const cx = center.x;
  const cy = center.y;

  // Outer kidney contour
  const pts = 36;
  for (let i = 0; i <= pts; i++) {
    const t = (i / pts) * Math.PI * 2;
    // Mathematical kidney bean curve
    const r = (1 - 0.28 * Math.cos(t)) * (1 + 0.12 * Math.sin(t * 2));
    const px = cx + Math.cos(t) * W * r;
    const py = cy + Math.sin(t) * H;
    if (i === 0) cortexShape.moveTo(px, py);
    else cortexShape.lineTo(px, py);
  }

  // Inner sinus hole (Renal sinus cavity)
  const sinusHole = new THREE.Path();
  const sW = W * 0.55;
  const sH = H * 0.60;
  for (let i = 0; i <= pts; i++) {
    const t = (i / pts) * Math.PI * 2;
    const r = (1 - 0.25 * Math.cos(t));
    const px = cx + Math.cos(t) * sW * r - (W * 0.08);
    const py = cy + Math.sin(t) * sH;
    if (i === 0) sinusHole.moveTo(px, py);
    else sinusHole.lineTo(px, py);
  }
  cortexShape.holes.push(sinusHole);

  const cortexGeom = new THREE.ShapeGeometry(cortexShape, 32);
  cortexGeom.computeVertexNormals();

  const cortexMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_RenalCortex',
    color: new THREE.Color(0x943C34), // Rich vascular cortical red-brown
    roughness: 0.42,
    metalness: 0.01,
    clearcoat: 0.38,
    clearcoatRoughness: 0.20,
    sheen: 0.45,
    sheenColor: new THREE.Color(0xdc2626),
    side: THREE.DoubleSide
  });

  const cortexMesh = new THREE.Mesh(cortexGeom, cortexMat);
  cortexMesh.name = 'Kidney_Coronal_Cortex.l';
  cortexMesh.position.set(0, 0, center.z + 0.001); // Right at the coronal dissection plane
  cortexMesh.renderOrder = 4;
  cortexMesh.userData = {
    partId: 'Kidney_Coronal_Cortex.l',
    za_name: 'Renal cortex of left kidney',
    system: systemId,
    baseMaterial: cortexMat
  };
  internalGroup.add(cortexMesh);

  // 2. 7 Renal Pyramids of Malpighi (Tháp tủy Malpighi)
  const pyramidsGroup = new THREE.Group();
  pyramidsGroup.name = 'Renal_Pyramids.l';

  const pyramidMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_RenalPyramid',
    color: new THREE.Color(0x6A1922), // Deep striated medulla purplish-crimson
    roughness: 0.36,
    metalness: 0.01,
    clearcoat: 0.42,
    clearcoatRoughness: 0.18,
    sheen: 0.55,
    sheenColor: new THREE.Color(0x991b1b),
    side: THREE.DoubleSide
  });

  const pyramidAngles = [-2.1, -1.5, -0.8, -0.1, 0.6, 1.3, 2.0];
  const pyrGeom = new THREE.ConeGeometry(0.0075, 0.016, 16);
  pyrGeom.computeVertexNormals();

  pyramidAngles.forEach((ang, pIdx) => {
    const pMesh = new THREE.Mesh(pyrGeom, pyramidMat);
    const rad = W * 0.72;
    const px = cx + Math.cos(ang) * rad;
    const py = cy + Math.sin(ang) * H * 0.78;
    pMesh.position.set(px, py, center.z + 0.001);
    // Point apex toward hilum
    pMesh.rotation.z = ang - Math.PI / 2;
    pMesh.scale.set(1.0, 1.0, 0.4); // Flattened along coronal plane
    pMesh.renderOrder = 5;
    pyramidsGroup.add(pMesh);
  });

  pyramidsGroup.userData = {
    partId: 'Renal_Pyramids.l',
    za_name: 'Renal pyramids of left kidney',
    system: systemId,
    baseMaterial: pyramidMat
  };
  internalGroup.add(pyramidsGroup);

  // 3. Renal Calyces & Pelvis (Hệ thống Đài - Bể thận)
  const calycesGroup = new THREE.Group();
  calycesGroup.name = 'Renal_Calyces.l';

  const calyxMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_RenalCalyces',
    color: new THREE.Color(0xEFEAD6), // Pearlescent urinary mucosa ivory
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.48,
    clearcoatRoughness: 0.15,
    transmission: 0.12,
    ior: 1.40,
    side: THREE.DoubleSide
  });

  // Minor calyx cups wrapping pyramid papillae
  pyramidAngles.forEach((ang) => {
    const cupGeom = new THREE.CylinderGeometry(0.0042, 0.0028, 0.007, 12, 1, true);
    const cupMesh = new THREE.Mesh(cupGeom, calyxMat);
    const rad = W * 0.48;
    cupMesh.position.set(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * H * 0.52, center.z + 0.001);
    cupMesh.rotation.z = ang - Math.PI / 2;
    cupMesh.scale.set(1.0, 1.0, 0.5);
    cupMesh.renderOrder = 6;
    calycesGroup.add(cupMesh);
  });

  calycesGroup.userData = {
    partId: 'Renal_Calyces.l',
    za_name: 'Renal calyces of left kidney',
    system: systemId,
    baseMaterial: calyxMat
  };
  internalGroup.add(calycesGroup);

  // 4. Clinical Nephrolithiasis Sample (Sỏi thận mẫu ở đài dưới)
  const calculusGeom = new THREE.DodecahedronGeometry(0.0035, 1);
  const calculusMat = new THREE.MeshStandardMaterial({
    name: 'PBR_RenalCalculus',
    color: new THREE.Color(0xD97706), // Calcium oxalate jagged amber-brown calculus
    roughness: 0.82,
    metalness: 0.05
  });
  const calculusMesh = new THREE.Mesh(calculusGeom, calculusMat);
  calculusMesh.name = 'Renal_Calculus_Model';
  // Positioned in lower pole calyx (common clinical dependent stagnation site)
  calculusMesh.position.set(cx - 0.008, cy - H * 0.58, center.z + 0.002);
  calculusMesh.renderOrder = 7;
  calculusMesh.userData = {
    partId: 'Renal_Calculus_Model',
    za_name: 'Renal calculus (Inferior calyx)',
    system: systemId,
    baseMaterial: calculusMat
  };
  internalGroup.add(calculusMesh);

  // Add internalGroup to kidneyLeft
  kidneyLeft.add(internalGroup);

  // Register in meshRegistry & structures
  meshRegistry.set('Kidney_Coronal_Cortex.l', cortexMesh);
  meshRegistry.set('Renal_Pyramids.l', pyramidsGroup);
  meshRegistry.set('Renal_Calyces.l', calycesGroup);
  meshRegistry.set('Renal_Calculus_Model', calculusMesh);
  meshRegistry.set('Kidney_Internal_Coronal_Group', internalGroup);

  structures.set('Kidney_Coronal_Cortex.l', {
    node: cortexMesh,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: [cortexMesh]
  });

  structures.set('Renal_Pyramids.l', {
    node: pyramidsGroup,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: pyramidsGroup.children
  });

  structures.set('Renal_Calyces.l', {
    node: calycesGroup,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: calycesGroup.children
  });

  structures.set('Renal_Calculus_Model', {
    node: calculusMesh,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: [calculusMesh]
  });

  const kidneyStruct = structures.get('Kidney.l');
  if (kidneyStruct) {
    if (!kidneyStruct.childIds) kidneyStruct.childIds = [];
    kidneyStruct.childIds.push('Kidney_Coronal_Cortex.l', 'Renal_Pyramids.l', 'Renal_Calyces.l', 'Renal_Calculus_Model');
  }

  if (nodes) {
    nodes.push(cortexMesh, pyramidsGroup, calycesGroup, calculusMesh);
  }
}

/**
 * Procedural Anatomical Generator: Duodenum D2 Lumen & Major Duodenal Papilla (Bóng Vater & Nhú Tá Lớn)
 */
export function setupDuodenumAnatomy(model, systemId, viewer, nodes, meshRegistry, structures) {
  let duodenumMesh = null;
  model.traverse((child) => {
    if (child.isMesh && child.name && /duodenum/i.test(child.name)) {
      duodenumMesh = child;
    }
  });

  if (!duodenumMesh || !duodenumMesh.geometry) return;

  if (!duodenumMesh.geometry.boundingBox) duodenumMesh.geometry.computeBoundingBox();
  const box = duodenumMesh.geometry.boundingBox;
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);

  const lumenGroup = new THREE.Group();
  lumenGroup.name = 'Duodenum_Ampulla_Vater_Lumen';
  lumenGroup.visible = false; // Visible in dedicated ampulla/biliary views

  // 1. Mucosal Window & Circular Folds (Plicae circulares) at D2 descending segment
  // D2 is located on the right side of C-loop: x in [0.015, 0.035], y near center.y
  const d2X = center.x + size.x * 0.28;
  const d2Y = center.y;
  const d2Z = center.z + size.z * 0.12;

  // Create Papilla Duodeni Major (Nhú tá lớn / Ampulla of Vater)
  const papillaGeom = new THREE.ConeGeometry(0.0042, 0.0075, 20);
  papillaGeom.computeVertexNormals();

  const papillaMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_MajorDuodenalPapilla',
    color: new THREE.Color(0xE66A5D), // Living mucosal roseate-coral
    roughness: 0.32,
    metalness: 0.01,
    clearcoat: 0.58, // Glistening digestive mucosal secretion sheen
    clearcoatRoughness: 0.16,
    sheen: 0.65,
    sheenColor: new THREE.Color(0xfecdd3),
    transmission: 0.08,
    ior: 1.38
  });

  const papillaMesh = new THREE.Mesh(papillaGeom, papillaMat);
  papillaMesh.name = 'Major_Duodenal_Papilla';
  // Pointing inward-anteriorly into duodenum lumen
  papillaMesh.position.set(d2X, d2Y, d2Z);
  papillaMesh.rotation.set(0.3, 0.2, -Math.PI / 2);
  papillaMesh.renderOrder = 8;
  papillaMesh.userData = {
    partId: 'Major_Duodenal_Papilla',
    za_name: 'Major duodenal papilla (Ampulla of Vater)',
    system: systemId,
    baseMaterial: papillaMat
  };
  lumenGroup.add(papillaMesh);

  // 2. Sphincter of Oddi orifice (Lỗ cơ vòng Oddi ở đỉnh nhú)
  const sphincterGeom = new THREE.TorusGeometry(0.0016, 0.0006, 12, 24);
  const sphincterMat = new THREE.MeshStandardMaterial({
    name: 'PBR_SphincterOddi',
    color: new THREE.Color(0x9E2B2B), // Muscular sphincter ring
    roughness: 0.45,
    metalness: 0.02
  });
  const sphincterMesh = new THREE.Mesh(sphincterGeom, sphincterMat);
  sphincterMesh.name = 'Sphincter_of_Oddi';
  sphincterMesh.position.set(d2X - 0.0035, d2Y, d2Z + 0.001);
  sphincterMesh.rotation.y = Math.PI / 2;
  sphincterMesh.renderOrder = 9;
  sphincterMesh.userData = {
    partId: 'Sphincter_of_Oddi',
    za_name: 'Sphincter of ampulla (Sphincter of Oddi)',
    system: systemId,
    baseMaterial: sphincterMat
  };
  lumenGroup.add(sphincterMesh);

  // 3. Plicae circulares (Nếp gấp niêm mạc tá tràng quanh nhú)
  for (let f = -2; f <= 2; f++) {
    if (f === 0) continue; // Leave room for papilla
    const foldGeom = new THREE.TorusGeometry(0.007, 0.001, 8, 16, Math.PI * 0.85);
    const foldMesh = new THREE.Mesh(foldGeom, papillaMat);
    foldMesh.position.set(d2X + 0.002, d2Y + f * 0.006, d2Z);
    foldMesh.rotation.set(0, 0, Math.PI / 2);
    foldMesh.renderOrder = 7;
    lumenGroup.add(foldMesh);
  }

  duodenumMesh.add(lumenGroup);

  // Register in meshRegistry & structures
  meshRegistry.set('Major_Duodenal_Papilla', papillaMesh);
  meshRegistry.set('Sphincter_of_Oddi', sphincterMesh);
  meshRegistry.set('Duodenum_Ampulla_Vater_Lumen', lumenGroup);

  structures.set('Major_Duodenal_Papilla', {
    node: papillaMesh,
    systemId,
    parentId: 'Duodenum',
    childIds: [],
    ownMeshes: [papillaMesh]
  });

  structures.set('Sphincter_of_Oddi', {
    node: sphincterMesh,
    systemId,
    parentId: 'Duodenum',
    childIds: [],
    ownMeshes: [sphincterMesh]
  });

  const duodStruct = structures.get('Duodenum');
  if (duodStruct) {
    if (!duodStruct.childIds) duodStruct.childIds = [];
    duodStruct.childIds.push('Major_Duodenal_Papilla', 'Sphincter_of_Oddi');
  }

  if (nodes) {
    nodes.push(papillaMesh, sphincterMesh);
  }
}
