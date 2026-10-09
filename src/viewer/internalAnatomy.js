import * as THREE from 'three';

/**
 * Procedural Medical Texture Generator: High-Resolution Master-Grade Renal Parenchyma (1024x1024)
 * Synthesizes an authentic clinical cross-section of the human left kidney:
 * - Fibrous Renal Capsule (Bao xơ thận) with glistening subcapsular rim
 * - Granular Vascular Renal Cortex (Vỏ thận) rich in glomeruli capillary networks
 * - Renal Columns of Bertin (Cột thận Bertin) dipping deep between pyramids
 * - 7 Striated Pyramids of Malpighi (Tháp tủy Malpighi) with radiating medullary rays converging to pointed Papillae
 * - Corticomedullary junction with crisp Arcuate Arteries (ĐM cung) and Veins (TM cung)
 * - Lobulated Renal Sinus Adipose Tissue (Mỡ xoang thận) cushioning the calyces
 */
function createRenalParenchymaTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 1024, 1024);

  // Define Anatomical Left Kidney Contour (Medial Hilum at left, Lateral convex border at right)
  function traceKidneyPath() {
    ctx.beginPath();
    ctx.moveTo(512, 70); // Superior pole
    ctx.bezierCurveTo(720, 75, 870, 240, 890, 512); // Lateral upper & mid convexity
    ctx.bezierCurveTo(890, 760, 730, 940, 512, 954); // Lateral lower to inferior pole
    ctx.bezierCurveTo(340, 950, 300, 780, 350, 640); // Inferior medial border
    ctx.bezierCurveTo(385, 570, 425, 540, 435, 512); // Medial hilum notch (concavity)
    ctx.bezierCurveTo(425, 480, 385, 450, 350, 380); // Superior medial hilum lip
    ctx.bezierCurveTo(300, 240, 340, 75, 512, 70); // Superior medial border to pole
    ctx.closePath();
  }

  // 1. Fill Base Cortex Parenchyma with rich vascular red-brown gradient
  ctx.save();
  traceKidneyPath();
  const cortexGrad = ctx.createRadialGradient(680, 512, 100, 680, 512, 450);
  cortexGrad.addColorStop(0.0, '#8E2822'); // Rich perfused renal cortex
  cortexGrad.addColorStop(0.65, '#992B24');
  cortexGrad.addColorStop(0.96, '#751D18'); // Peripheral subcapsular zone
  cortexGrad.addColorStop(1.0, '#5A1410');
  ctx.fillStyle = cortexGrad;
  ctx.fill();

  // Subtle Glomerular Granulation (Tiểu cầu thận dạng hạt mịn)
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let y = 0; y < 1024; y += 2) {
    for (let x = 0; x < 1024; x += 2) {
      const idx = (y * 1024 + x) * 4;
      if (data[idx + 3] > 100) {
        const grain = (Math.random() - 0.5) * 26;
        data[idx] = Math.max(0, Math.min(255, data[idx] + grain));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + grain * 0.5));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + grain * 0.3));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  ctx.restore();

  // 2. Draw 7 Renal Pyramids of Malpighi (Tháp tủy Malpighi) with distinct papillae and radiating medullary rays
  // Bases along outer corticomedullary border, apices (papillae) pointing toward medial hilum (x ~ 440)
  const pyramids = [
    { base: [530, 150], apex: [475, 330], width: 95 }, // 1. Superior Pole
    { base: [720, 240], apex: [515, 385], width: 105 }, // 2. Anterosuperior
    { base: [830, 390], apex: [535, 460], width: 110 }, // 3. Upper Lateral
    { base: [860, 512], apex: [540, 512], width: 115 }, // 4. Mid Lateral
    { base: [830, 634], apex: [535, 564], width: 110 }, // 5. Lower Lateral
    { base: [720, 784], apex: [515, 639], width: 105 }, // 6. Anteroinferior
    { base: [530, 874], apex: [475, 694], width: 95 }  // 7. Inferior Pole
  ];

  pyramids.forEach((pyr) => {
    ctx.save();
    const bx = pyr.base[0], by = pyr.base[1];
    const ax = pyr.apex[0], ay = pyr.apex[1];
    const dx = ax - bx, dy = ay - by;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const perpX = -uy, perpY = ux;
    const halfW = pyr.width * 0.5;

    // Pyramid Body Gradient: Medullary base to apical papilla
    const pGrad = ctx.createLinearGradient(bx, by, ax, ay);
    pGrad.addColorStop(0.0, '#7F1D1D'); // Corticomedullary border
    pGrad.addColorStop(0.5, '#5B1218'); // Deep medullary body
    pGrad.addColorStop(1.0, '#450A0A'); // Apical papilla

    ctx.beginPath();
    ctx.moveTo(bx - perpX * halfW, by - perpY * halfW);
    ctx.quadraticCurveTo(bx + ux * (len * 0.08), by + uy * (len * 0.08), bx + perpX * halfW, by + perpY * halfW);
    ctx.lineTo(ax + perpX * 12, ay + perpY * 12);
    ctx.quadraticCurveTo(ax + ux * 8, ay + uy * 8, ax - perpX * 12, ay - perpY * 12);
    ctx.closePath();
    ctx.fillStyle = pGrad;
    ctx.fill();

    // Radiating Medullary Rays (Tia tủy Malpighi)
    ctx.strokeStyle = 'rgba(248, 113, 113, 0.32)';
    ctx.lineWidth = 1.6;
    for (let f = -0.85; f <= 0.85; f += 0.18) {
      ctx.beginPath();
      ctx.moveTo(bx + perpX * (halfW * f), by + perpY * (halfW * f));
      ctx.lineTo(ax + perpX * (10 * f), ay + perpY * (10 * f));
      ctx.stroke();
    }

    // Arcuate Artery Arch (Động mạch hình cung) over pyramid base
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(bx - perpX * (halfW * 1.05), by - perpY * (halfW * 1.05));
    ctx.quadraticCurveTo(bx + ux * (len * 0.12), by + uy * (len * 0.12), bx + perpX * (halfW * 1.05), by + perpY * (halfW * 1.05));
    ctx.stroke();

    // Arcuate Vein Arch (Tĩnh mạch hình cung) adjacent to artery
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(bx - perpX * (halfW * 1.08) - ux * 3, by - perpY * (halfW * 1.08) - uy * 3);
    ctx.quadraticCurveTo(bx + ux * (len * 0.12) - ux * 3, by + uy * (len * 0.12) - uy * 3, bx + perpX * (halfW * 1.08) - ux * 3, by + perpY * (halfW * 1.08) - uy * 3);
    ctx.stroke();

    // Prominent Renal Papilla (Nhú thận)
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(ax, ay, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  // 3. Draw Lobulated Renal Sinus Adipose Tissue (Mô mỡ xoang thận)
  // Filling the medial sinus recess around x: 380-490, y: 350-670
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(435, 512, 75, 150, 0, 0, Math.PI * 2);
  const fatGrad = ctx.createRadialGradient(435, 512, 20, 435, 512, 140);
  fatGrad.addColorStop(0.0, '#F59E0B'); // Rich golden adipose
  fatGrad.addColorStop(0.65, '#D97706');
  fatGrad.addColorStop(1.0, '#B45309');
  ctx.fillStyle = fatGrad;
  ctx.fill();

  // Adipose Lobules (Tiểu thùy mỡ dạng chùm hạt)
  for (let i = 0; i < 48; i++) {
    const lx = 390 + Math.random() * 80;
    const ly = 380 + Math.random() * 260;
    const lr = 7 + Math.random() * 9;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(253, 230, 138, 0.70)' : 'rgba(217, 119, 6, 0.75)';
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Outer Fibrous Renal Capsule Line (Bao xơ thận)
  ctx.save();
  traceKidneyPath();
  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.strokeStyle = '#581C1A';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Medical Texture Generator: Duodenal Mucosal Kerckring Folds (512x512)
 */
function createDuodenalMucosaTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#E26D60';
  ctx.fillRect(0, 0, 512, 512);

  // Circular Kerckring folds
  for (let y = 16; y < 512; y += 32) {
    const foldGrad = ctx.createLinearGradient(0, y - 10, 0, y + 10);
    foldGrad.addColorStop(0.0, 'rgba(244, 114, 102, 0.20)');
    foldGrad.addColorStop(0.5, 'rgba(255, 195, 185, 0.90)'); // Crest reflection
    foldGrad.addColorStop(1.0, 'rgba(159, 45, 35, 0.75)'); // Deep valley shadow
    ctx.fillStyle = foldGrad;
    ctx.fillRect(0, y - 12, 512, 24);
  }

  // Microvillus velvet noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n * 0.7));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Anatomical Generator: Internal Renal Architecture (Thận Bổ Dọc Chuẩn Y Khoa)
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
  internalGroup.visible = false;

  const W = size.x * 0.48;
  const H = size.y * 0.49;
  const cx = center.x;
  const cy = center.y;
  const cz = center.z;

  // 1. High-Fidelity 3D Coronal Cut Surface with Medical Parenchyma Texture
  const parenchTexture = createRenalParenchymaTexture();

  // Create anatomically accurate left kidney bean shape
  // Medial hilum notch at negative X (-W * 0.18), broad lateral convex border at positive X (+W * 1.02)
  const cortexShape = new THREE.Shape();
  cortexShape.moveTo(0, H); // Superior pole
  cortexShape.bezierCurveTo(W * 0.55, H * 0.98, W * 0.96, H * 0.55, W * 1.02, 0); // Lateral upper & mid convexity
  cortexShape.bezierCurveTo(W * 1.02, -H * 0.55, W * 0.58, -H * 0.97, 0, -H); // Lateral lower to inferior pole
  cortexShape.bezierCurveTo(-W * 0.46, -H * 0.98, -W * 0.55, -H * 0.60, -W * 0.42, -H * 0.30); // Inferior medial border
  cortexShape.bezierCurveTo(-W * 0.32, -H * 0.14, -W * 0.20, -H * 0.06, -W * 0.18, 0); // Medial hilum notch
  cortexShape.bezierCurveTo(-W * 0.20, H * 0.06, -W * 0.32, H * 0.14, -W * 0.42, H * 0.30); // Superior medial hilum lip
  cortexShape.bezierCurveTo(-W * 0.55, H * 0.60, -W * 0.46, H * 0.98, 0, H); // Superior medial border to pole

  const cutGeom = new THREE.ShapeGeometry(cortexShape, 36);

  // Compute normalized UVs matching the 1024x1024 canvas texture
  const minX = -W * 0.56, maxX = W * 1.04;
  const minY = -H * 1.02, maxY = H * 1.02;
  const posAttr = cutGeom.attributes.position;
  const uvs = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    uvs[i * 2] = (x - minX) / (maxX - minX);
    uvs[i * 2 + 1] = (y - minY) / (maxY - minY);
  }
  cutGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  cutGeom.computeVertexNormals();

  const cutMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_RenalParenchymaCut',
    map: parenchTexture,
    roughness: 0.42,
    metalness: 0.0,
    clearcoat: 0.12, // Fresh transected physiological moisture
    clearcoatRoughness: 0.35,
    sheen: 0.70,
    sheenColor: new THREE.Color(0x881337),
    sheenRoughness: 0.30,
    side: THREE.DoubleSide
  });

  const cutMesh = new THREE.Mesh(cutGeom, cutMat);
  cutMesh.name = 'Kidney_Coronal_Cortex.l';
  cutMesh.position.set(cx, cy, cz + 0.001);
  cutMesh.renderOrder = 4;
  cutMesh.userData = {
    partId: 'Kidney_Coronal_Cortex.l',
    za_name: 'Renal cortex and parenchyma (Coronal section)',
    system: systemId,
    baseMaterial: cutMat
  };
  internalGroup.add(cutMesh);

  // 2. 3D Calyces & Pelvis Tree (Hệ thống Đài - Bể Thận 3D)
  const calycesGroup = new THREE.Group();
  calycesGroup.name = 'Renal_Calyces.l';

  const calyxMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_RenalCalyces',
    color: new THREE.Color(0xF5EFEB), // Pearlescent urinary mucosa ivory
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.20,
    clearcoatRoughness: 0.25,
    sheen: 0.55,
    sheenColor: new THREE.Color(0xFDE68A),
    side: THREE.DoubleSide
  });

  // Pelvis funnel positioned at the medial hilum
  const hilumX = cx - (W * 0.22);
  const hilumY = cy;

  const pelvisGeom = new THREE.CylinderGeometry(0.0075, 0.0035, 0.022, 16, 1, false);
  const pelvisMesh = new THREE.Mesh(pelvisGeom, calyxMat);
  pelvisMesh.name = 'Renal_Pelvis.l';
  pelvisMesh.position.set(hilumX, hilumY, cz + 0.003);
  pelvisMesh.rotation.set(0, 0, 0.20);
  pelvisMesh.renderOrder = 6;
  pelvisMesh.userData = { system: systemId, partId: 'Renal_Pelvis.l' };
  calycesGroup.add(pelvisMesh);

  // 3 Major Calyces (Đài thận lớn: Trên, Giữa, Dưới)
  const majorConfigs = [
    { x: hilumX + 0.005, y: hilumY + 0.016, ang: 0.50, len: 0.014, r: 0.0045, name: 'Major_Calyx_Superior.l' },
    { x: hilumX + 0.009, y: hilumY + 0.001, ang: 0.08, len: 0.012, r: 0.0042, name: 'Major_Calyx_Middle.l' },
    { x: hilumX + 0.004, y: hilumY - 0.015, ang: -0.45, len: 0.015, r: 0.0045, name: 'Major_Calyx_Inferior.l' }
  ];

  majorConfigs.forEach((cfg) => {
    const cGeom = new THREE.CylinderGeometry(cfg.r, cfg.r * 0.65, cfg.len, 12);
    const mMesh = new THREE.Mesh(cGeom, calyxMat);
    mMesh.name = cfg.name;
    mMesh.position.set(cfg.x, cfg.y, cz + 0.003);
    mMesh.rotation.set(0, 0, cfg.ang);
    mMesh.renderOrder = 6;
    mMesh.userData = { system: systemId, partId: cfg.name };
    calycesGroup.add(mMesh);
  });

  // 7 Minor Calyces (Đài thận nhỏ ôm quanh từng nhú thận)
  const minorConfigs = [
    { x: hilumX + 0.003, y: hilumY + 0.027, ang: 0.75, name: 'Minor_Calyx_1' },
    { x: hilumX + 0.015, y: hilumY + 0.022, ang: 0.40, name: 'Minor_Calyx_2' },
    { x: hilumX + 0.021, y: hilumY + 0.010, ang: 0.15, name: 'Minor_Calyx_3' },
    { x: hilumX + 0.022, y: hilumY - 0.001, ang: 0.0, name: 'Minor_Calyx_4' },
    { x: hilumX + 0.020, y: hilumY - 0.012, ang: -0.20, name: 'Minor_Calyx_5' },
    { x: hilumX + 0.014, y: hilumY - 0.022, ang: -0.50, name: 'Minor_Calyx_6' },
    { x: hilumX + 0.002, y: hilumY - 0.028, ang: -0.80, name: 'Minor_Calyx_7' }
  ];

  minorConfigs.forEach((mc) => {
    const cupGeom = new THREE.CylinderGeometry(0.0035, 0.0020, 0.006, 12, 1, true);
    const cupMesh = new THREE.Mesh(cupGeom, calyxMat);
    cupMesh.name = mc.name;
    cupMesh.position.set(mc.x, mc.y, cz + 0.003);
    cupMesh.rotation.set(0, 0, mc.ang);
    cupMesh.renderOrder = 7;
    cupMesh.userData = { system: systemId, partId: mc.name };
    calycesGroup.add(cupMesh);
  });

  calycesGroup.userData = {
    partId: 'Renal_Calyces.l',
    za_name: 'Renal calyces and pelvis system',
    system: systemId,
    baseMaterial: calyxMat
  };
  internalGroup.add(calycesGroup);

  // 3. Faceted Calcium Oxalate Calculus (Sỏi Thận Đài Dưới Crystalline Jagged Calculus)
  const calculusGeom = new THREE.DodecahedronGeometry(0.0038, 1);
  const vPos = calculusGeom.attributes.position;
  for (let i = 0; i < vPos.count; i++) {
    const vx = vPos.getX(i), vy = vPos.getY(i), vz = vPos.getZ(i);
    const factor = 0.82 + Math.random() * 0.38;
    vPos.setXYZ(i, vx * factor, vy * factor, vz * factor);
  }
  calculusGeom.computeVertexNormals();

  const calculusMat = new THREE.MeshStandardMaterial({
    name: 'PBR_RenalCalculus',
    color: new THREE.Color(0xB45309), // Calcium oxalate jagged amber-brown calculus
    roughness: 0.90,
    metalness: 0.05
  });
  const calculusMesh = new THREE.Mesh(calculusGeom, calculusMat);
  calculusMesh.name = 'Renal_Calculus_Model';
  // Positioned nestled snug inside the inferior minor calyx (minor calyx 7)
  calculusMesh.position.set(hilumX + 0.003, hilumY - 0.026, cz + 0.004);
  calculusMesh.renderOrder = 8;
  calculusMesh.userData = {
    partId: 'Renal_Calculus_Model',
    za_name: 'Renal calculus (Inferior calyceal nephrolithiasis)',
    system: systemId,
    baseMaterial: calculusMat
  };
  internalGroup.add(calculusMesh);

  // Attach internalGroup to kidneyLeft
  kidneyLeft.add(internalGroup);

  // Register in meshRegistry & structures
  meshRegistry.set('Kidney_Coronal_Cortex.l', cutMesh);
  meshRegistry.set('Renal_Calyces.l', calycesGroup);
  meshRegistry.set('Renal_Calculus_Model', calculusMesh);
  meshRegistry.set('Kidney_Internal_Coronal_Group', internalGroup);

  structures.set('Kidney_Coronal_Cortex.l', {
    node: cutMesh,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: [cutMesh]
  });

  structures.set('Renal_Calyces.l', {
    node: calycesGroup,
    systemId,
    parentId: 'Kidney.l',
    childIds: [],
    ownMeshes: [pelvisMesh]
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
    kidneyStruct.childIds.push('Kidney_Coronal_Cortex.l', 'Renal_Calyces.l', 'Renal_Calculus_Model');
  }

  if (nodes) {
    nodes.push(cutMesh, calycesGroup, calculusMesh);
  }
}

/**
 * Procedural Anatomical Generator: Duodenum D2 Surgical Fenestration & Ampulla of Vater
 * Phẫu trường cắt mở tá tràng D2: Niêm mạc van Kerckring, Nhú tá lớn, nếp hãm và cơ vòng Oddi.
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
  lumenGroup.visible = false;

  // Medial mucosal wall of descending duodenum (D2) at junction of bile duct & pancreatic duct
  // In local duodenum coordinates:
  const jx = -0.0358;
  const jy = -0.0152;
  const jz = -0.0032;

  // 1. Major Duodenal Papilla (Nhú Tá Lớn / Ampulla of Vater / Papilla duodeni major)
  // Anatomical mucosal dome projecting into lumen
  const papillaGeom = new THREE.SphereGeometry(0.0038, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  papillaGeom.computeVertexNormals();
  const papillaMat = new THREE.MeshPhysicalMaterial({
    name: 'PBR_MajorDuodenalPapilla',
    color: new THREE.Color(0xDC2626), // Rich mucosal arterial red
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.20,
    sheen: 0.85,
    sheenColor: new THREE.Color(0xfecdd3)
  });
  const papillaMesh = new THREE.Mesh(papillaGeom, papillaMat);
  papillaMesh.name = 'Major_Duodenal_Papilla';
  papillaMesh.position.set(jx + 0.003, jy - 0.002, jz + 0.003);
  papillaMesh.rotation.set(0.3, -0.6, -Math.PI / 2);
  papillaMesh.renderOrder = 9;
  papillaMesh.userData = {
    partId: 'Major_Duodenal_Papilla',
    za_name: 'Major duodenal papilla (Ampulla of Vater)',
    system: systemId,
    baseMaterial: papillaMat
  };
  lumenGroup.add(papillaMesh);

  // 2. Sphincter of Oddi Orifice (Lỗ Cơ Vòng Oddi / Sphincter ampullae hepatopancreaticae)
  const sphincterGeom = new THREE.TorusGeometry(0.0016, 0.0006, 16, 24);
  const sphincterMat = new THREE.MeshStandardMaterial({
    name: 'PBR_SphincterOddi',
    color: new THREE.Color(0x7F1D1D), // Deep circular sphincter muscle
    roughness: 0.45,
    metalness: 0.02
  });
  const sphincterMesh = new THREE.Mesh(sphincterGeom, sphincterMat);
  sphincterMesh.name = 'Sphincter_of_Oddi';
  sphincterMesh.position.set(jx + 0.006, jy - 0.002, jz + 0.005);
  sphincterMesh.rotation.set(0.3, 0.9, 0);
  sphincterMesh.renderOrder = 10;
  sphincterMesh.userData = {
    partId: 'Sphincter_of_Oddi',
    za_name: 'Sphincter of ampulla (Sphincter of Oddi)',
    system: systemId,
    baseMaterial: sphincterMat
  };
  lumenGroup.add(sphincterMesh);

  // 3. Longitudinal Fold / Frenulum of Papilla (Nếp hãm nhú tá / Frenulum papillae duodeni)
  const frenulumGeom = new THREE.CylinderGeometry(0.0008, 0.0004, 0.010, 16);
  const frenulumMesh = new THREE.Mesh(frenulumGeom, papillaMat);
  frenulumMesh.name = 'Frenulum_of_Papilla';
  frenulumMesh.position.set(jx + 0.004, jy - 0.007, jz + 0.004);
  frenulumMesh.rotation.set(0.2, 0, 0.1);
  frenulumMesh.renderOrder = 9;
  frenulumMesh.userData = {
    partId: 'Frenulum_of_Papilla',
    za_name: 'Frenulum of major duodenal papilla',
    system: systemId,
    baseMaterial: papillaMat
  };
  lumenGroup.add(frenulumMesh);

  // Attach lumenGroup to duodenumMesh
  duodenumMesh.add(lumenGroup);

  // Register in meshRegistry & structures
  meshRegistry.set('Major_Duodenal_Papilla', papillaMesh);
  meshRegistry.set('Sphincter_of_Oddi', sphincterMesh);
  meshRegistry.set('Frenulum_of_Papilla', frenulumMesh);
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

  structures.set('Frenulum_of_Papilla', {
    node: frenulumMesh,
    systemId,
    parentId: 'Duodenum',
    childIds: [],
    ownMeshes: [frenulumMesh]
  });

  const duodStruct = structures.get('Duodenum');
  if (duodStruct) {
    if (!duodStruct.childIds) duodStruct.childIds = [];
    duodStruct.childIds.push(
      'Major_Duodenal_Papilla',
      'Sphincter_of_Oddi',
      'Frenulum_of_Papilla'
    );
  }

  if (nodes) {
    nodes.push(papillaMesh, sphincterMesh, frenulumMesh);
  }
}
