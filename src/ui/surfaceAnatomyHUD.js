// Surface Anatomy & Clinical Projection HUD Controller
// Clinical surface landmarks, 9 abdominal regions, and interactive projections
import * as THREE from 'three';
import { setSystemTransparency } from '../viewer/visibility.js';
import { showToast } from './sidebar.js';

let hudContainerEl = null;
let currentViewer = null;
let landmarks3DGroup = null;
let regions3DGridGroup = null;
let showLandmarks = true;
let showRegions = true;
let currentSkinOpacity = 0.38;

// 8 Major Clinical Surface Landmarks
const CLINICAL_LANDMARKS = [
  {
    id: 'suprasternal_notch',
    nameVi: 'Hõm Trên Ức (Suprasternal Notch)',
    pos: [0, 1.44, 0.108],
    desc: 'Mốc ngang đốt sống T2, khí quản đi vào lồng ngực'
  },
  {
    id: 'sternal_angle',
    nameVi: 'Góc Ức Louis (Sternal Angle)',
    pos: [0, 1.38, 0.118],
    desc: 'Khớp cán - thân ức, đếm gian sườn 2, ngang Carina khí quản & T4-T5'
  },
  {
    id: 'xiphoid_process',
    nameVi: 'Mũi Ức (Xiphoid Process)',
    pos: [0, 1.20, 0.144],
    desc: 'Mốc đáy tim, ngực dưới và thượng vị, ngang mức T9-T10'
  },
  {
    id: 'costal_margin_r',
    nameVi: 'Bờ Sườn Phải (Right Costal Margin)',
    pos: [-0.09, 1.15, 0.142],
    desc: 'Bờ dưới gan bình thường không vượt quá bờ sườn'
  },
  {
    id: 'costal_margin_l',
    nameVi: 'Bờ Sườn Trái (Left Costal Margin)',
    pos: [0.09, 1.15, 0.142],
    desc: 'Mốc sờ lách to (lách bình thường núp sau bờ sườn)'
  },
  {
    id: 'umbilicus',
    nameVi: 'Rốn (Umbilicus)',
    pos: [0, 1.01, 0.134],
    desc: 'Mốc ngang đĩa gian đốt L3-L4, ngã ba tĩnh mạch cửa - chủ nông'
  },
  {
    id: 'mcburney_point',
    nameVi: 'Điểm McBurney (Ruột Thừa)',
    pos: [-0.065, 0.94, 0.130],
    desc: '1/3 ngoài đường nối rốn đến gai chậu trước trên phải (Ấn đau: Viêm ruột thừa cấp)'
  },
  {
    id: 'murphy_point',
    nameVi: 'Điểm Murphy (Túi Mật)',
    pos: [-0.055, 1.14, 0.144],
    desc: 'Giao bờ ngoài cơ thẳng bụng P và bờ sườn P (Nghiệm pháp Murphy: Viêm túi mật cấp)'
  },
  {
    id: 'asis_right',
    nameVi: 'Gai Chậu Trước Trên Phải (ASIS)',
    pos: [-0.12, 0.88, 0.120],
    desc: 'Mốc đo chiều dài tuyệt đối chi dưới và nếp bẹn'
  },
  {
    id: 'asis_left',
    nameVi: 'Gai Chậu Trước Trên Trái (ASIS)',
    pos: [0.12, 0.88, 0.120],
    desc: 'Mốc định vị khung chậu và đường gian củ chậu'
  }
];

// 9 Abdominal Clinical Regions
const ABDOMINAL_REGIONS = [
  { id: 'rh', nameVi: 'Hạ Sườn Phải', organ: 'Thùy gan P, túi mật, góc đại tràng P', pos: [-0.07, 1.14, 0.12] },
  { id: 'ep', nameVi: 'Vùng Thượng Vị', organ: 'Dạ dày, thùy gan T, tụy, tá tràng', pos: [0, 1.14, 0.13] },
  { id: 'lh', nameVi: 'Hạ Sườn Trái', organ: 'Lách, đáy vị, góc đại tràng T', pos: [0.07, 1.14, 0.12] },
  { id: 'rl', nameVi: 'Mạn Sườn Phải', organ: 'Đại tràng lên, thận P', pos: [-0.07, 1.04, 0.12] },
  { id: 'um', nameVi: 'Vùng Rốn', organ: 'Ruột non (hỗng-hồi tràng), mạc treo ruột', pos: [0, 1.04, 0.13] },
  { id: 'll', nameVi: 'Mạn Sườn Trái', organ: 'Đại tràng xuống, thận T', pos: [0.07, 1.04, 0.12] },
  { id: 'ri', nameVi: 'Hố Chậu Phải', organ: 'Ruột thừa, manh tràng, buồng trứng P', pos: [-0.07, 0.93, 0.11] },
  { id: 'hy', nameVi: 'Vùng Hạ Vị', organ: 'Bàng quang, tử cung/tiền liệt tuyến', pos: [0, 0.93, 0.12] },
  { id: 'li', nameVi: 'Hố Chậu Trái', organ: 'Đại tràng sigma, buồng trứng T', pos: [0.07, 0.93, 0.11] }
];

/**
 * Build 3D Pins & Landmarks in Three.js Scene
 */
function build3DLandmarks(viewer) {
  if (landmarks3DGroup) {
    landmarks3DGroup.visible = showLandmarks;
    return;
  }

  landmarks3DGroup = new THREE.Group();
  landmarks3DGroup.name = 'Surface_Anatomy_Landmarks_Group';

  const markerGeom = new THREE.SphereGeometry(0.0055, 16, 16);
  const ringGeom = new THREE.RingGeometry(0.0075, 0.010, 24);

  const markerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, // Cyan clinical glowing pin
    depthTest: false,
    transparent: true,
    opacity: 0.95
  });

  const specialMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e, // Rose / red for McBurney & Murphy
    depthTest: false,
    transparent: true,
    opacity: 0.95
  });

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    depthTest: false,
    transparent: true,
    opacity: 0.75
  });

  CLINICAL_LANDMARKS.forEach((item) => {
    const isSpecial = item.id === 'mcburney_point' || item.id === 'murphy_point';
    const mat = isSpecial ? specialMat : markerMat;

    const pinGroup = new THREE.Group();
    pinGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);

    const dot = new THREE.Mesh(markerGeom, mat);
    dot.renderOrder = 20;
    pinGroup.add(dot);

    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.renderOrder = 20;
    pinGroup.add(ring);

    pinGroup.userData = {
      isLandmarkPin: true,
      landmarkInfo: item
    };

    landmarks3DGroup.add(pinGroup);
  });

  landmarks3DGroup.renderOrder = 20;
  landmarks3DGroup.visible = showLandmarks;
  viewer.scene.add(landmarks3DGroup);
}

/**
 * Build 3D 9-Region Abdominal Grid
 */
function build3DRegionsGrid(viewer) {
  if (regions3DGridGroup) {
    regions3DGridGroup.visible = showRegions;
    return;
  }

  regions3DGridGroup = new THREE.Group();
  regions3DGridGroup.name = 'Surface_Anatomy_9Regions_Group';

  const lineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 0.008,
    gapSize: 0.005,
    depthTest: false,
    transparent: true,
    opacity: 0.85
  });

  // Line 1: Right Midclavicular Line (vertical)
  const rMclPts = [new THREE.Vector3(-0.045, 1.25, 0.144), new THREE.Vector3(-0.045, 0.85, 0.126)];
  const rMclGeom = new THREE.BufferGeometry().setFromPoints(rMclPts);
  const rMclLine = new THREE.Line(rMclGeom, lineMat);
  rMclLine.computeLineDistances();
  rMclLine.renderOrder = 18;
  regions3DGridGroup.add(rMclLine);

  // Line 2: Left Midclavicular Line (vertical)
  const lMclPts = [new THREE.Vector3(0.045, 1.25, 0.144), new THREE.Vector3(0.045, 0.85, 0.126)];
  const lMclGeom = new THREE.BufferGeometry().setFromPoints(lMclPts);
  const lMclLine = new THREE.Line(lMclGeom, lineMat);
  lMclLine.computeLineDistances();
  lMclLine.renderOrder = 18;
  regions3DGridGroup.add(lMclLine);

  // Line 3: Subcostal Plane (horizontal)
  const subPts = [new THREE.Vector3(-0.11, 1.10, 0.144), new THREE.Vector3(0.11, 1.10, 0.144)];
  const subGeom = new THREE.BufferGeometry().setFromPoints(subPts);
  const subLine = new THREE.Line(subGeom, lineMat);
  subLine.computeLineDistances();
  subLine.renderOrder = 18;
  regions3DGridGroup.add(subLine);

  // Line 4: Transtubercular Plane (horizontal)
  const transPts = [new THREE.Vector3(-0.11, 0.97, 0.130), new THREE.Vector3(0.11, 0.97, 0.130)];
  const transGeom = new THREE.BufferGeometry().setFromPoints(transPts);
  const transLine = new THREE.Line(transGeom, lineMat);
  transLine.computeLineDistances();
  transLine.renderOrder = 18;
  regions3DGridGroup.add(transLine);

  regions3DGridGroup.renderOrder = 18;
  regions3DGridGroup.visible = showRegions;
  viewer.scene.add(regions3DGridGroup);
}

/**
 * Render HTML HUD Bar
 */
export function showSurfaceAnatomyHUD(viewer) {
  currentViewer = viewer;
  if (!viewer) return;

  build3DLandmarks(viewer);
  build3DRegionsGrid(viewer);

  // Apply calibrated Fresnel translucent skin
  setSystemTransparency('integumentary', currentSkinOpacity);

  hudContainerEl = document.getElementById('surfaceAnatomyHUD');
  if (!hudContainerEl) {
    hudContainerEl = document.createElement('div');
    hudContainerEl.id = 'surfaceAnatomyHUD';
    hudContainerEl.className = 'surface-anatomy-hud-container';
    document.body.appendChild(hudContainerEl);
  }

  hudContainerEl.innerHTML = `
    <div class="surface-hud-card">
      <div class="surface-hud-header">
        <div class="surface-hud-title-group">
          <span class="surface-hud-badge">📐 KHÁM BỀ MẶT LÂM SÀNG</span>
          <h4 class="surface-hud-title">Đối Chiếu Mốc Xương & 9 Vùng Bụng</h4>
        </div>
        <button type="button" class="surface-hud-close" id="btnSurfaceHudClose" title="Đóng HUD">×</button>
      </div>

      <div class="surface-hud-controls">
        <button type="button" class="surface-toggle-btn ${showLandmarks ? 'active' : ''}" id="btnToggleLandmarks">
          <span>📍 8 Mốc Khám</span>
        </button>
        <button type="button" class="surface-toggle-btn ${showRegions ? 'active' : ''}" id="btnToggleRegions">
          <span>📐 Lưới 9 Vùng</span>
        </button>
        <div class="surface-opacity-group">
          <span class="opacity-label">Độ mờ da:</span>
          <button type="button" class="btn-op-chip ${currentSkinOpacity === 0.20 ? 'active' : ''}" data-op="0.20">20%</button>
          <button type="button" class="btn-op-chip ${currentSkinOpacity === 0.38 ? 'active' : ''}" data-op="0.38">40%</button>
          <button type="button" class="btn-op-chip ${currentSkinOpacity === 0.65 ? 'active' : ''}" data-op="0.65">65%</button>
        </div>
      </div>

      <div class="surface-hud-pearls">
        <div class="pearl-item">
          <strong>Góc ức Louis:</strong> Mốc đếm gian sườn 2, đối chiếu ngã ba phế quản (Carina) & đốt T4-T5.
        </div>
        <div class="pearl-item">
          <strong>Điểm McBurney:</strong> 1/3 ngoài đường rốn - ASIS phải (Ấn đau chói: Viêm ruột thừa cấp).
        </div>
        <div class="pearl-item">
          <strong>Điểm Murphy:</strong> Bờ ngoài cơ thẳng bụng P gặp bờ sườn P (Nghiệm pháp Murphy: Viêm túi mật).
        </div>
      </div>
    </div>
  `;

  injectStyles();
  bindEvents(viewer);
  hudContainerEl.style.display = 'block';
}

function bindEvents(viewer) {
  if (!hudContainerEl) return;

  hudContainerEl.querySelector('#btnSurfaceHudClose')?.addEventListener('click', () => {
    hideSurfaceAnatomyHUD();
  });

  hudContainerEl.querySelector('#btnToggleLandmarks')?.addEventListener('click', (e) => {
    showLandmarks = !showLandmarks;
    e.currentTarget.classList.toggle('active', showLandmarks);
    if (landmarks3DGroup) landmarks3DGroup.visible = showLandmarks;
    viewer?.render?.();
    showToast(showLandmarks ? 'Đã bật 8 mốc khám lâm sàng' : 'Đã ẩn mốc khám');
  });

  hudContainerEl.querySelector('#btnToggleRegions')?.addEventListener('click', (e) => {
    showRegions = !showRegions;
    e.currentTarget.classList.toggle('active', showRegions);
    if (regions3DGridGroup) regions3DGridGroup.visible = showRegions;
    viewer?.render?.();
    showToast(showRegions ? 'Đã bật lưới 9 vùng bụng' : 'Đã ẩn lưới vùng bụng');
  });

  hudContainerEl.querySelectorAll('.btn-op-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      hudContainerEl.querySelectorAll('.btn-op-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const op = parseFloat(btn.dataset.op || '0.38');
      currentSkinOpacity = op;
      setSystemTransparency('integumentary', op);
      viewer?.render?.();
    });
  });
}

export function hideSurfaceAnatomyHUD() {
  if (hudContainerEl) {
    hudContainerEl.style.display = 'none';
  }
  if (landmarks3DGroup) {
    landmarks3DGroup.visible = false;
  }
  if (regions3DGridGroup) {
    regions3DGridGroup.visible = false;
  }
  currentViewer?.render?.();
}

function injectStyles() {
  if (document.getElementById('surfaceAnatomyHUDStyles')) return;
  const style = document.createElement('style');
  style.id = 'surfaceAnatomyHUDStyles';
  style.textContent = `
    .surface-anatomy-hud-container {
      position: absolute;
      bottom: 74px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 105;
      width: calc(100% - 32px);
      max-width: 580px;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .surface-hud-card {
      background: rgba(15, 23, 42, 0.90);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 14px;
      padding: 12px 14px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15);
      color: #f8fafc;
    }
    .surface-hud-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .surface-hud-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      padding: 2px 6px;
      border-radius: 6px;
      margin-bottom: 2px;
    }
    .surface-hud-title {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .surface-hud-close {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }
    .surface-hud-close:hover {
      color: #fff;
    }
    .surface-hud-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .surface-toggle-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .surface-toggle-btn.active {
      background: rgba(56, 189, 248, 0.25);
      border-color: #38bdf8;
      color: #38bdf8;
      font-weight: 600;
    }
    .surface-opacity-group {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
      font-size: 11px;
      color: #94a3b8;
    }
    .btn-op-chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-op-chip.active {
      background: #38bdf8;
      border-color: #38bdf8;
      color: #0f172a;
      font-weight: 700;
    }
    .surface-hud-pearls {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .pearl-item strong {
      color: #38bdf8;
    }
    @media (max-width: 640px) {
      .surface-anatomy-hud-container {
        bottom: 64px;
        width: calc(100% - 16px);
      }
      .surface-hud-card {
        padding: 10px 12px;
      }
      .surface-hud-pearls {
        font-size: 10px;
      }
    }
  `;
  document.head.appendChild(style);
}
