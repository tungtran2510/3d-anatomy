// Atlas 2027 Preset View Execution Engine
// Ensures 100% authentic 1:1 reproduction of reference anatomy views:
// - Exact system loading & isolation
// - Surgical part-level filtering (isolate target structures, hide background)
// - Depth-correct ghosting/translucency (e.g. Location of Heart: translucent ribcage, solid heart)
// - Accurate camera angles (e.g. Skull posterior view, Cranial Fossae superior-posterior look-down)
// - Clean state: no accidental selection pins, no obscuring envelope meshes

import * as THREE from 'three';
import { state } from '../state/store.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem, restoreAllParts, setSystemTransparency, setStructureVisible } from '../viewer/visibility.js';
import { deselectPart } from '../viewer/selection.js';
import { setBodyEnvelopeVisible } from '../viewer/bodyEnvelope.js';
import { setModelOrientation } from '../viewer/orientationManager.js';
import { setClippingPlane, disableClipping } from '../viewer/clipping.js';
import { setExplodeFactor, resetExplode } from '../viewer/explodedView.js';
import { openMotionPanel, closeMotionPanel } from './motionPanel.js';
import { showToast } from './sidebar.js';

// Precompiled Regexes for Anatomical Structure Filtering
const REGEX_SKULL_AND_CERVICAL = /frontal|parietal|occipital|temporal|sphenoid|ethmoid|maxilla|mandible|zygomatic|nasal|lacrimal|palatine|vomer|concha|hyoid|auditory|malleus|incus|stapes|tooth|teeth|skull|head|atlas|axis|vertebra_c|c1|c2|c3|c4|c5|c6|c7|disc c|temporomandibular|atlanto/i;
const REGEX_CALVARIA_REMOVAL = /parietal|frontal_bone_[123]|occipital_bone_[12]/i;
const REGEX_THORACIC_CAGE = /rib|costal|sternum|xiphoid|manubrium|vertebra_t|thoracic|disc t/i;
const REGEX_PELVIS = /ilium|ischium|pubis|pelvi|sacrum|coccyx|sacroiliac|pubic|acetabul|vertebra_l[45]|femur.*head|femur.*neck|greater trochanter/i;
const REGEX_SPINE_FULL = /vertebra|atlas|axis|sacrum|coccyx|intervertebral disc|spinal/i;

const REGEX_HEART_AND_GREAT_VESSELS = /heart|atrium|ventricle|aort|pulmonary|cava|myocard|valv|coronary|internal thoracic|intercostal|brachiocephalic/i;
const REGEX_LIMB_VESSELS = /radial|ulnar|brachial(?!.*cephalic)|interosseous|palmar|digital.*(hand|finger|foot|toe)|popliteal|tibial|fibular|peroneal|plantar|dorsalis pedis|great saphenous.*(leg|foot)|small saphenous/i;

const REGEX_BRAIN_AND_CRANIAL = /brain|cerebr|cerebel|gyrus|sulcus|thalam|pons|medulla|olfactory|optic|cranial|oculomotor|trochlear|trigeminal|abducens|facial|vestibulocochlear|glossopharyngeal|vagus|accessory|hypoglossal|chiasm|ventricle|eye|sclera|cornea|iris|lens|retina|ciliary|lacrimal|dura|falx|tentorium|spinal cord|c1|c2|c3|c4|c5|c6|c7|c8|cervical|brachial/i;
const REGEX_DISTAL_NERVES = /digital.*(hand|finger|foot|toe)|plantar.*digital|palmar.*digital|proper.*digital|common.*digital|cutaneous.*(foot|hand|finger|toe)/i;

const REGEX_RESPIRATORY_AIRWAYS = /trachea|bronch|laryng|pharynx|epiglott|vocal|thyroid cartilage|cricoid/i;
const REGEX_LUNGS_AND_AIRWAYS = /lung|trachea|bronch|pleura/i;

const REGEX_EYE_MICRO = /eyeball|cornea|iris|lens|retina|sclera|optic.*nerve|optic.*chiasm/i;
const REGEX_LACRIMAL_MICRO = /lacrimal|nasolacrimal|eyeball|cornea/i;
const REGEX_LENS_MICRO = /lens|ciliary|zonul|iris/i;

/**
 * Apply 3D View Preset with 100% Fidelity to the Reference Atlas Card
 */
export async function applyAtlasPreset(card, viewer = state.viewer || window.viewer) {
  if (!viewer) return;

  // 1. Clean State & Deselect
  deselectPart(true);
  restoreAllParts();
  setBodyEnvelopeVisible(false);

  // 2. Identify target systems
  const systemsToLoad = card.systems || ['skeletal'];

  // Load any unloaded systems
  for (const sys of systemsToLoad) {
    if (!state.loadedSystems.includes(sys)) {
      await loadModel(sys, viewer);
    }
  }

  // 3. Reset orientation & table
  setModelOrientation(card.orientation || 'standing', viewer, { showTable: !!card.showTable });

  // 4. Handle Explode
  if (card.explode) {
    setExplodeFactor(card.explode / 100, viewer);
    document.getElementById('btnToolExplode')?.classList.add('active');
  } else {
    resetExplode(viewer);
    document.getElementById('btnToolExplode')?.classList.remove('active');
  }

  // 5. Handle Clipping vs Motion vs Normal
  if (card.clipping || card.plane) {
    closeMotionPanel();
    const plane = card.clipping?.plane || card.plane;
    const offset = card.clipping?.offset !== undefined ? card.clipping.offset : (card.offset || 0);
    setClippingPlane(plane, offset, false, viewer, true);
    document.getElementById('btnToolClipping')?.classList.add('active');
    import('./radiologicalScout.js').then(({ showScoutView }) => showScoutView(card, plane, offset)).catch(() => {});
  } else if (card.motionId) {
    disableClipping(viewer);
    document.getElementById('btnToolClipping')?.classList.remove('active');
    import('./radiologicalScout.js').then(({ hideScoutView }) => hideScoutView()).catch(() => {});
    openMotionPanel(viewer, card.motionId);
  } else {
    disableClipping(viewer);
    document.getElementById('btnToolClipping')?.classList.remove('active');
    import('./radiologicalScout.js').then(({ hideScoutView }) => hideScoutView()).catch(() => {});
    closeMotionPanel();
  }

  // 6. Reset System Transparencies to Solid
  ['skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral'].forEach(s => {
    setSystemTransparency(s, 1.0);
  });

  // 7. Apply Specialized Anatomical Filtering & Ghosting Rules
  applySpecificViewRules(card.id, systemsToLoad, viewer);

  // 8. Animate Camera to Precise View Position
  const cameraConfig = getFineCameraConfig(card);
  if (cameraConfig) {
    animateCameraTo(viewer.camera, viewer.controls, cameraConfig.pos, cameraConfig.target);
  }

  viewer.render();
}

/**
 * Fine Camera Configuration for 100% Thumbnail Match
 */
function getFineCameraConfig(card) {
  const id = card.id;

  switch (id) {
    // Skeletal Views
    case 'skel_1_full':
      return { pos: { x: 0, y: 0.86, z: 2.6 }, target: { x: 0, y: 0.86, z: 0 } };
    case 'skel_2_skull':
      // Exact match for Card 2: Posterior view of Skull + Cervical spine C1-C7
      return { pos: { x: 0, y: 1.58, z: -0.55 }, target: { x: 0, y: 1.54, z: 0 } };
    case 'skel_3_cranial_fossae':
      // Exact match for Card 3: Superior-posterior view looking down into skull base cavity
      return { pos: { x: 0, y: 1.85, z: -0.32 }, target: { x: 0, y: 1.58, z: 0.02 } };
    case 'skel_4_skull_sagittal':
      return { pos: { x: 0.55, y: 1.60, z: 0.05 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'skel_5_skull_transverse':
      return { pos: { x: 0, y: 1.85, z: 0.15 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'skel_6_disarticulated':
      return { pos: { x: 0.35, y: 1.62, z: 0.65 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'skel_7_arches':
      return { pos: { x: 0, y: 1.54, z: 0.35 }, target: { x: 0, y: 1.52, z: 0 } };
    case 'skel_8_teeth_blood':
      return { pos: { x: 0.22, y: 1.54, z: 0.38 }, target: { x: 0, y: 1.52, z: 0 } };
    case 'skel_9_thoracic_cage':
      return { pos: { x: 0, y: 1.25, z: 0.85 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'skel_10_thoracic_cavity':
      return { pos: { x: 0, y: 1.25, z: 0.90 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'skel_11_pelvic_girdle':
      return { pos: { x: 0, y: 0.88, z: 0.95 }, target: { x: 0, y: 0.85, z: 0 } };
    case 'skel_13_spine_lateral':
      return { pos: { x: 0.95, y: 1.15, z: 0 }, target: { x: 0, y: 1.10, z: 0 } };
    case 'skel_14_spine_musculature':
      return { pos: { x: 0.6, y: 1.15, z: -0.9 }, target: { x: 0, y: 1.10, z: 0 } };
    case 'skel_15_shoulder_girdle':
      return { pos: { x: 0.35, y: 1.35, z: 0.65 }, target: { x: 0.2, y: 1.32, z: 0 } };

    // Circulatory Views
    case 'circ_1_full':
      return { pos: { x: 0, y: 0.95, z: 2.3 }, target: { x: 0, y: 0.95, z: 0 } };
    case 'circ_2_simplified':
      return { pos: { x: 0, y: 1.25, z: 1.05 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'circ_3_location_heart':
      return { pos: { x: 0, y: 1.28, z: 0.78 }, target: { x: 0, y: 1.28, z: 0 } };
    case 'circ_4_vasculature_brain':
      return { pos: { x: 0.42, y: 1.62, z: 0.52 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'circ_5_circle_willis':
      return { pos: { x: 0, y: 1.48, z: 0.38 }, target: { x: 0, y: 1.56, z: 0 } };
    case 'circ_6_carotid_jugular':
      return { pos: { x: 0.25, y: 1.48, z: 0.55 }, target: { x: 0, y: 1.45, z: 0 } };
    case 'circ_7_pulmonary':
      return { pos: { x: 0, y: 1.28, z: 0.75 }, target: { x: 0, y: 1.26, z: 0 } };
    case 'circ_9_azygos_system':
      return { pos: { x: 0, y: 1.22, z: -0.75 }, target: { x: 0, y: 1.22, z: 0 } };
    case 'circ_11_liver_circulation':
      return { pos: { x: 0.15, y: 1.10, z: 0.75 }, target: { x: 0, y: 1.08, z: 0 } };

    // Nervous Views
    case 'nerv_1_full':
      return { pos: { x: 0, y: 0.95, z: 2.3 }, target: { x: 0, y: 0.95, z: 0 } };
    case 'nerv_2_simplified':
      return { pos: { x: 0, y: 1.15, z: 1.6 }, target: { x: 0, y: 1.15, z: 0 } };
    case 'nerv_3_brain':
      return { pos: { x: 0.35, y: 1.65, z: 0.48 }, target: { x: 0, y: 1.60, z: 0 } };
    case 'nerv_7_cranial_nerves':
      return { pos: { x: 0, y: 1.48, z: 0.42 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'nerv_10_brachial_plexus':
      return { pos: { x: 0.35, y: 1.40, z: 0.58 }, target: { x: 0.18, y: 1.36, z: 0 } };
    case 'nerv_11_lumbosacral':
      return { pos: { x: 0, y: 0.95, z: 0.85 }, target: { x: 0, y: 0.92, z: 0 } };
    case 'nerv_12_sciatic_nerve':
      return { pos: { x: 0.25, y: 0.80, z: -0.9 }, target: { x: 0.12, y: 0.75, z: 0 } };

    // Respiratory Views
    case 'resp_1_upper':
      return { pos: { x: 0.28, y: 1.54, z: 0.52 }, target: { x: 0, y: 1.50, z: 0 } };
    case 'resp_7_location_lungs':
      return { pos: { x: 0, y: 1.25, z: 0.90 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'resp_8_hilum':
      return { pos: { x: 0.25, y: 1.26, z: 0.55 }, target: { x: 0.05, y: 1.25, z: 0 } };

    // Microanatomy Eye
    case 'micro_eye':
      return { pos: { x: 0.08, y: 1.58, z: 0.26 }, target: { x: 0.03, y: 1.58, z: 0.04 } };
    case 'micro_lacrimal':
      return { pos: { x: 0.06, y: 1.60, z: 0.22 }, target: { x: 0.03, y: 1.60, z: 0.04 } };
    case 'micro_lens_zonule':
      return { pos: { x: 0.05, y: 1.58, z: 0.18 }, target: { x: 0.03, y: 1.58, z: 0.04 } };

    default:
      if (card.camera) {
        return {
          pos: { x: card.camera.x, y: card.camera.y, z: card.camera.z },
          target: { x: card.camera.targetX || 0, y: card.camera.targetY || card.camera.y, z: card.camera.targetZ || 0 }
        };
      }
      return null;
  }
}

/**
 * Surgical Anatomical Mesh Filtering & Layer Translucency
 */
function applySpecificViewRules(viewId, allowedSystems, viewer) {
  // First, traverse all meshes in scene:
  // Hide any mesh that does not belong to the allowed systems of this preset
  viewer.scene.traverse(node => {
    if (node.isMesh) {
      const sys = node.userData?.system;
      if (!sys || !allowedSystems.includes(sys)) {
        node.visible = false;
        return;
      }

      const name = (node.userData?.partId || node.name || '');

      switch (viewId) {
        // --- SKELETAL SYSTEM VIEWS ---
        case 'skel_1_full':
          node.visible = true;
          break;

        case 'skel_2_skull':
          // Keep skull and cervical spine C1-C7
          node.visible = REGEX_SKULL_AND_CERVICAL.test(name);
          break;

        case 'skel_3_cranial_fossae':
          // Keep skull base + cervical, hide calvaria
          if (REGEX_CALVARIA_REMOVAL.test(name)) {
            node.visible = false;
          } else {
            node.visible = REGEX_SKULL_AND_CERVICAL.test(name);
          }
          break;

        case 'skel_7_arches':
          node.visible = /maxilla|mandible|tooth|teeth|dental/i.test(name);
          break;

        case 'skel_9_thoracic_cage':
          node.visible = REGEX_THORACIC_CAGE.test(name);
          break;

        case 'skel_11_pelvic_girdle':
          node.visible = REGEX_PELVIS.test(name);
          break;

        case 'skel_13_spine_lateral':
          node.visible = REGEX_SPINE_FULL.test(name) && !/rib|sternum|maxilla|mandible|skull|frontal|parietal|occipital|temporal/i.test(name);
          break;

        // --- CIRCULATORY SYSTEM VIEWS ---
        case 'circ_1_full':
          node.visible = true;
          break;

        case 'circ_2_simplified':
          // Torso & head vessels, hide distal limbs
          node.visible = !REGEX_LIMB_VESSELS.test(name);
          break;

        case 'circ_3_location_heart':
          if (sys === 'skeletal') {
            // Keep ribcage, sternum, clavicle, spine
            node.visible = /rib|sternum|costal|vertebra|clavicle/i.test(name);
          } else if (sys === 'cardiovascular') {
            const isHeart = REGEX_HEART_AND_GREAT_VESSELS.test(name);
            node.visible = isHeart;
            if (isHeart) {
              node.renderOrder = 5;
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach(m => {
                if (m) {
                  m.transparent = false;
                  m.opacity = 1.0;
                  m.depthWrite = true;
                }
              });
            }
          }
          break;

        case 'circ_4_vasculature_brain':
        case 'circ_5_circle_willis':
          node.visible = /cerebral|carotid|basilar|vertebral|communicating|ophthalmic|choroidal|willis/i.test(name);
          break;

        // --- NERVOUS SYSTEM VIEWS ---
        case 'nerv_1_full':
          node.visible = true;
          break;

        case 'nerv_2_simplified':
          // Keep brain, spinal cord, sympathetic chains, plexuses; hide distal fingertips & toes
          node.visible = !REGEX_DISTAL_NERVES.test(name);
          break;

        case 'nerv_3_brain':
          node.visible = REGEX_BRAIN_AND_CRANIAL.test(name);
          break;

        case 'nerv_7_cranial_nerves':
          node.visible = /olfactory|optic|oculomotor|trochlear|trigeminal|abducens|facial|vestibulocochlear|glossopharyngeal|vagus|accessory|hypoglossal|cranial/i.test(name);
          break;

        // --- RESPIRATORY VIEWS ---
        case 'resp_1_upper':
          node.visible = REGEX_RESPIRATORY_AIRWAYS.test(name) || /vertebra_c|hyoid/i.test(name);
          break;

        case 'resp_7_location_lungs':
          if (sys === 'skeletal') {
            node.visible = REGEX_THORACIC_CAGE.test(name);
          } else if (sys === 'visceral') {
            const isLung = REGEX_LUNGS_AND_AIRWAYS.test(name);
            node.visible = isLung;
            if (isLung) {
              node.renderOrder = 5;
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach(m => {
                if (m) {
                  m.transparent = false;
                  m.opacity = 1.0;
                  m.depthWrite = true;
                }
              });
            }
          }
          break;

        // --- MICROANATOMY VIEWS ---
        case 'micro_eye':
          node.visible = REGEX_EYE_MICRO.test(name);
          break;

        case 'micro_lacrimal':
          node.visible = REGEX_LACRIMAL_MICRO.test(name);
          break;

        case 'micro_lens_zonule':
          node.visible = REGEX_LENS_MICRO.test(name);
          break;

        default:
          node.visible = true;
          break;
      }
    }
  });

  // Apply Ghosting Translucency if required
  if (viewId === 'circ_3_location_heart') {
    setSystemTransparency('skeletal', 0.16);
  } else if (viewId === 'resp_7_location_lungs') {
    setSystemTransparency('skeletal', 0.16);
  }
}

/**
 * Smooth Camera Animation
 */
function animateCameraTo(camera, controls, pos, lookAt, duration = 650) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    camera.position.x = startPos.x + (pos.x - startPos.x) * ease;
    camera.position.y = startPos.y + (pos.y - startPos.y) * ease;
    camera.position.z = startPos.z + (pos.z - startPos.z) * ease;

    controls.target.x = startTarget.x + (lookAt.x - startTarget.x) * ease;
    controls.target.y = startTarget.y + (lookAt.y - startTarget.y) * ease;
    controls.target.z = startTarget.z + (lookAt.z - startTarget.z) * ease;
    controls.update();

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
