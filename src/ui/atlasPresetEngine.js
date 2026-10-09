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
import { showSystem, hideSystem, restoreAllParts, setSystemTransparency, setStructureVisible, highlightMesh } from '../viewer/visibility.js';
import { deselectPart } from '../viewer/selection.js';
import { setBodyEnvelopeVisible, setBodyEnvelopeTone } from '../viewer/bodyEnvelope.js';
import { setModelOrientation } from '../viewer/orientationManager.js';
import { setClippingPlane, disableClipping } from '../viewer/clipping.js';
import { setExplodeFactor, resetExplode } from '../viewer/explodedView.js';
import { openMotionPanel, closeMotionPanel } from './motionPanel.js';
import { showNeuromuscularHUD, hideNeuromuscularHUD } from './neuromuscularHUD.js';
import { showMicroanatomyHUD, hideMicroanatomyHUD } from './microanatomyHUD.js';

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

const REGEX_GENITALIA = /penis|cavernosum|spongiosum|testis|epididymis|ductus deferens|ejaculatory|seminal gland/i;
const REGEX_LUNG_TISSUE = /lung|pleura/i;
const REGEX_SALIVARY = /parotid|sublingual|submandibular/i;
const REGEX_URINARY_ORGANS = /kidney|renal|ureter|urinary bladder|suprarenal/i;

/**
 * Apply 3D View Preset with 100% Fidelity to the Reference Atlas Card
 */
export async function applyAtlasPreset(card, viewer = state.viewer || window.viewer) {
  if (!viewer) return;

  // 1. Clean State & Deselect
  deselectPart(true);
  restoreAllParts();
  setBodyEnvelopeVisible(false);

  // Restore any previous custom cloned materials to avoid cross-view material pollution
  viewer.scene?.traverse(node => {
    if (node.isMesh && node.userData.__origMaterial) {
      if (node.material && node.material !== node.userData.__origMaterial) {
        node.material.dispose();
      }
      node.material = node.userData.__origMaterial;
      delete node.userData.__origMaterial;
    }
  });

  // 2. Identify target systems
  const systemsToLoad = card.systems || ['skeletal'];

  // Load any unloaded systems
  for (const sys of systemsToLoad) {
    if (!state.loadedSystems.includes(sys)) {
      await loadModel(sys, viewer);
    }
  }

  // Ensure only systems declared in preset are shown
  const allSystems = ['skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral', 'integumentary'];
  allSystems.forEach(sys => {
    if (systemsToLoad.includes(sys)) {
      showSystem(sys);
    } else {
      hideSystem(sys);
    }
  });

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
    await openMotionPanel(viewer, card.motionId);
  } else {
    disableClipping(viewer);
    document.getElementById('btnToolClipping')?.classList.remove('active');
    import('./radiologicalScout.js').then(({ hideScoutView }) => hideScoutView()).catch(() => {});
    closeMotionPanel();
  }

  // 5b. Neuromuscular Innervation Interactive HUD
  if (card.innervationInfo || (card.id && card.id.startsWith('nerv_inerv_'))) {
    showNeuromuscularHUD(card, viewer);
  } else {
    hideNeuromuscularHUD();
  }

  // 5c. Microanatomy & Histology Interactive HUD
  if (card.id && card.id.startsWith('micro_')) {
    showMicroanatomyHUD(card, viewer);
  } else {
    hideMicroanatomyHUD();
  }

  // 6. Reset System Transparencies to Solid (skip if motionId, which manages its own anatomical isolation)
  if (!card.motionId) {
    ['skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral', 'integumentary'].forEach(s => {
      setSystemTransparency(s, 1.0);
    });

    // 7. Apply Specialized Anatomical Filtering & Ghosting Rules
    applySpecificViewRules(card.id, systemsToLoad, viewer);
  }

  // 8. Animate Camera to Precise View Position
  const cameraConfig = getFineCameraConfig(card);
  if (cameraConfig) {
    animateCameraTo(viewer.camera, viewer.controls, cameraConfig.pos, cameraConfig.target);
  }

  // 9. Highlight primary structure if designated in card
  if (card.highlight) {
    highlightMesh(card.highlight, 0xf97316, 0.85);
  }

  // 10. Handle Skin Tone for Microanatomy Skin views
  if (card.id === 'micro_skin_dark') {
    setBodyEnvelopeTone(0x6b4226, 0.94, viewer);
  } else if (card.id === 'micro_skin_light') {
    setBodyEnvelopeTone(0xfcd34d, 0.94, viewer);
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
      return { pos: { x: 0, y: 1.58, z: -0.55 }, target: { x: 0, y: 1.54, z: 0 } };
    case 'skel_3_cranial_fossae':
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
    case 'skel_12_pelvic_section':
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
    case 'circ_8_heart_section':
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
      return { pos: { x: 0.28, y: 1.25, z: -0.75 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'circ_10_vagus':
      return { pos: { x: 0.15, y: 1.35, z: 0.65 }, target: { x: 0, y: 1.32, z: 0 } };
    case 'circ_11_liver_circulation':
      return { pos: { x: -0.1, y: 1.15, z: 0.78 }, target: { x: 0, y: 1.12, z: 0 } };
    case 'circ_12_lower_digestive':
      return { pos: { x: 0, y: 1.02, z: 0.88 }, target: { x: 0, y: 1.02, z: 0 } };
    case 'circ_13_pelvic_circulation':
      return { pos: { x: 0, y: 0.86, z: 0.75 }, target: { x: 0, y: 0.84, z: 0 } };

    // Nervous System Views
    case 'nerv_1_full':
      return { pos: { x: 0, y: 0.95, z: 2.3 }, target: { x: 0, y: 0.95, z: 0 } };
    case 'nerv_2_simplified':
      return { pos: { x: 0, y: 1.25, z: 1.35 }, target: { x: 0, y: 1.25, z: 0 } };
    case 'nerv_3_brain':
    case 'nerv_4_brain_blood':
      return { pos: { x: 0.38, y: 1.62, z: 0.52 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'nerv_5_limbic_system':
    case 'nerv_6_thalamus':
      return { pos: { x: 0.28, y: 1.60, z: 0.45 }, target: { x: 0, y: 1.58, z: 0 } };
    case 'nerv_7_cranial_nerves':
      return { pos: { x: 0.22, y: 1.56, z: 0.45 }, target: { x: 0, y: 1.54, z: 0 } };
    case 'nerv_8_vagus_nerve':
      return { pos: { x: 0.2, y: 1.35, z: 0.7 }, target: { x: 0, y: 1.32, z: 0 } };
    case 'nerv_9_phrenic_nerves':
      return { pos: { x: 0.15, y: 1.32, z: 0.65 }, target: { x: 0, y: 1.3, z: 0 } };
    case 'nerv_10_brachial_plexus':
      return { pos: { x: 0.35, y: 1.38, z: 0.6 }, target: { x: 0.18, y: 1.35, z: 0 } };
    case 'nerv_11_lumbosacral':
      return { pos: { x: 0, y: 0.92, z: 0.8 }, target: { x: 0, y: 0.9, z: 0 } };
    case 'nerv_12_sciatic_nerve':
      return { pos: { x: 0.15, y: 0.65, z: -1.1 }, target: { x: 0.1, y: 0.65, z: 0 } };
    case 'nerv_13_autonomic':
      return { pos: { x: 0.3, y: 1.18, z: 0.75 }, target: { x: 0, y: 1.18, z: 0 } };
    case 'nerv_inerv_shoulder_axillary':
      return { pos: { x: 0.38, y: 1.38, z: 0.52 }, target: { x: 0.18, y: 1.35, z: 0 } };
    case 'nerv_inerv_arm_radial':
      return { pos: { x: 0.45, y: 1.15, z: 0.62 }, target: { x: 0.28, y: 1.10, z: 0 } };
    case 'nerv_inerv_forearm_median':
      return { pos: { x: 0.42, y: 0.95, z: 0.50 }, target: { x: 0.30, y: 0.90, z: 0 } };
    case 'nerv_inerv_hand_ulnar':
      return { pos: { x: 0.40, y: 0.92, z: 0.48 }, target: { x: 0.28, y: 0.88, z: 0 } };
    case 'nerv_inerv_diaphragm_phrenic':
      return { pos: { x: 0.16, y: 1.28, z: 0.60 }, target: { x: 0, y: 1.22, z: 0 } };
    case 'nerv_inerv_pelvic_pudendal':
      return { pos: { x: 0, y: 0.82, z: -0.72 }, target: { x: 0, y: 0.82, z: 0 } };
    case 'nerv_inerv_thigh_femoral_obturator':
      return { pos: { x: 0.28, y: 0.68, z: 0.72 }, target: { x: 0.14, y: 0.65, z: 0 } };
    case 'nerv_inerv_leg_achilles_tibial_fibular':
      return { pos: { x: 0.25, y: 0.35, z: -0.78 }, target: { x: 0.12, y: 0.30, z: 0 } };

    // Respiratory Views
    case 'resp_1_upper':
    case 'resp_4_pharynx_larynx':
    case 'resp_6_laryngeal_muscles':
      return { pos: { x: 0.25, y: 1.48, z: 0.45 }, target: { x: 0, y: 1.46, z: 0 } };
    case 'resp_2_nasal_cavity':
    case 'resp_3_eustachian':
      return { pos: { x: 0.3, y: 1.55, z: 0.4 }, target: { x: 0, y: 1.54, z: 0 } };
    case 'resp_5_trachea_carotids':
      return { pos: { x: 0.18, y: 1.38, z: 0.58 }, target: { x: 0, y: 1.36, z: 0 } };
    case 'resp_7_location_lungs':
    case 'resp_8_hilum':
    case 'resp_12_pulmonary_circ':
      return { pos: { x: 0, y: 1.28, z: 0.82 }, target: { x: 0, y: 1.28, z: 0 } };
    case 'resp_9_inhalation_muscles':
    case 'resp_10_exhalation_muscles':
    case 'resp_11_respiratory_innervation':
      return { pos: { x: 0, y: 1.24, z: 0.88 }, target: { x: 0, y: 1.24, z: 0 } };

    // Muscular Views
    case 'musc_1_expression':
      return { pos: { x: 0, y: 1.58, z: 0.42 }, target: { x: 0, y: 1.55, z: 0 } };
    case 'musc_2_mastication':
      return { pos: { x: 0.35, y: 1.56, z: 0.4 }, target: { x: 0.05, y: 1.54, z: 0 } };
    case 'musc_3_laryngeal':
    case 'musc_8_mandible_depression':
      return { pos: { x: 0, y: 1.48, z: 0.45 }, target: { x: 0, y: 1.46, z: 0 } };
    case 'musc_4_lateral_flexion':
    case 'musc_5_head_rotation':
    case 'musc_6_head_neck_ext':
    case 'musc_7_head_flexion':
      return { pos: { x: 0.32, y: 1.5, z: 0.5 }, target: { x: 0, y: 1.48, z: 0 } };
    case 'musc_9_inhalation':
    case 'musc_10_exhalation':
      return { pos: { x: 0, y: 1.25, z: 0.88 }, target: { x: 0, y: 1.24, z: 0 } };
    case 'musc_11_shoulder':
      return { pos: { x: 0.35, y: 1.38, z: 0.65 }, target: { x: 0.18, y: 1.34, z: 0 } };
    case 'musc_12_elbow':
      return { pos: { x: 0.42, y: 1.15, z: 0.55 }, target: { x: 0.28, y: 1.12, z: 0 } };
    case 'musc_13_wrist_hand':
      return { pos: { x: 0.45, y: 0.88, z: 0.45 }, target: { x: 0.35, y: 0.85, z: 0 } };
    case 'musc_14_upper_back':
      return { pos: { x: 0, y: 1.32, z: -0.95 }, target: { x: 0, y: 1.3, z: 0 } };
    case 'musc_15_lower_back':
      return { pos: { x: 0, y: 1.05, z: -0.85 }, target: { x: 0, y: 1.05, z: 0 } };

    // Digestive Views
    case 'dig_1_upper':
      return { pos: { x: 0, y: 1.25, z: 0.95 }, target: { x: 0, y: 1.22, z: 0 } };
    case 'dig_2_lower':
      return { pos: { x: 0, y: 0.96, z: 1.05 }, target: { x: 0, y: 0.96, z: 0 } };
    case 'dig_3_peritoneum':
      return { pos: { x: 0, y: 1.08, z: 1.05 }, target: { x: 0, y: 1.08, z: 0 } };
    case 'dig_4_salivary_glands':
      return { pos: { x: 0.32, y: 1.54, z: 0.42 }, target: { x: 0, y: 1.52, z: 0 } };
    case 'dig_5_teeth':
      return { pos: { x: 0, y: 1.54, z: 0.35 }, target: { x: 0, y: 1.52, z: 0 } };
    case 'dig_6_laryngopharynx':
      return { pos: { x: 0.25, y: 1.48, z: 0.42 }, target: { x: 0, y: 1.46, z: 0 } };
    case 'dig_7_alimentary_canal':
      return { pos: { x: 0, y: 1.15, z: 1.45 }, target: { x: 0, y: 1.15, z: 0 } };
    case 'dig_8_stomach_vasculature':
      return { pos: { x: 0.12, y: 1.15, z: 0.75 }, target: { x: 0, y: 1.12, z: 0 } };
    case 'dig_9_sphincters':
      return { pos: { x: 0, y: 1.08, z: 0.75 }, target: { x: 0, y: 1.08, z: 0 } };
    case 'dig_10_accessory_organs':
      return { pos: { x: -0.05, y: 1.16, z: 0.72 }, target: { x: 0, y: 1.14, z: 0 } };
    case 'dig_11_regional_vasculature':
      return { pos: { x: 0.1, y: 1.12, z: 0.85 }, target: { x: 0, y: 1.1, z: 0 } };
    case 'dig_12_intestines':
      return { pos: { x: 0, y: 0.96, z: 0.95 }, target: { x: 0, y: 0.96, z: 0 } };

    // Lymphatic Views
    case 'lymph_spleen':
      return { pos: { x: 0.25, y: 1.15, z: 0.78 }, target: { x: 0.08, y: 1.15, z: 0 } };
    case 'lymph_nodes_system':
      return { pos: { x: 0, y: 1.18, z: 1.35 }, target: { x: 0, y: 1.15, z: 0 } };

    // Urinary Views
    case 'urin_system':
      return { pos: { x: 0, y: 1.05, z: 0.88 }, target: { x: 0, y: 1.05, z: 0 } };
    case 'urin_pelvic':
      return { pos: { x: 0, y: 0.88, z: 0.75 }, target: { x: 0, y: 0.88, z: 0 } };

    // Microanatomy Views
    case 'micro_skin_dark':
    case 'micro_skin_light':
      return { pos: { x: 0, y: 1.35, z: 0.95 }, target: { x: 0, y: 1.30, z: 0 } };
    case 'micro_hair_follicle':
      return { pos: { x: 0.12, y: 1.62, z: 0.35 }, target: { x: 0.05, y: 1.60, z: 0.05 } };
    case 'micro_eye':
      return { pos: { x: 0.035, y: 1.60, z: 0.28 }, target: { x: 0.035, y: 1.60, z: 0.06 } };
    case 'micro_lacrimal':
      return { pos: { x: 0.035, y: 1.60, z: 0.28 }, target: { x: 0.030, y: 1.60, z: 0.06 } };
    case 'micro_lens_zonule':
      return { pos: { x: 0.035, y: 1.60, z: 0.20 }, target: { x: 0.035, y: 1.60, z: 0.06 } };
    case 'micro_femur_section':
      return { pos: { x: 0.14, y: 0.62, z: 0.48 }, target: { x: 0.09, y: 0.62, z: 0 } };
    case 'micro_osteon':
      return { pos: { x: 0.12, y: 0.62, z: 0.38 }, target: { x: 0.09, y: 0.62, z: 0 } };

    // Regional Views
    case 'reg_head_neck':
      return { pos: { x: 0, y: 1.55, z: 0.85 }, target: { x: 0, y: 1.52, z: 0 } };
    case 'reg_thorax':
      return { pos: { x: 0, y: 1.26, z: 1.05 }, target: { x: 0, y: 1.26, z: 0 } };
    case 'reg_abdomen_pelvis':
      return { pos: { x: 0, y: 0.98, z: 1.05 }, target: { x: 0, y: 0.98, z: 0 } };
    case 'reg_spine':
      return { pos: { x: 0.8, y: 1.15, z: 0 }, target: { x: 0, y: 1.15, z: 0 } };
    case 'reg_upper_limb':
      return { pos: { x: 0.45, y: 1.1, z: 1.1 }, target: { x: 0.35, y: 1.1, z: 0 } };
    case 'reg_lower_limb':
      return { pos: { x: 0.25, y: 0.45, z: 1.35 }, target: { x: 0.15, y: 0.45, z: 0 } };

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
  function prepareMeshMaterial(node) {
    if (!node.userData.__origMaterial) {
      node.userData.__origMaterial = node.material;
    }
    node.material = node.userData.__origMaterial.clone();
    return node.material;
  }

  // Pre-filter meshes by allowed systems and specific preset views
  viewer.scene.traverse(node => {
    if (node.isMesh) {
      // Never hide or filter procedural dissection table parts
      if (node.userData?.isDissectionTable || node.parent?.userData?.isDissectionTable || node.name === 'dissectionTableGroup' || node.parent?.name === 'dissectionTableGroup') {
        return;
      }

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
          node.visible = REGEX_SKULL_AND_CERVICAL.test(name);
          break;

        case 'skel_3_cranial_fossae':
          if (REGEX_CALVARIA_REMOVAL.test(name)) {
            node.visible = false;
          } else {
            node.visible = REGEX_SKULL_AND_CERVICAL.test(name);
          }
          break;

        case 'skel_7_arches':
        case 'dig_5_teeth':
          node.visible = /maxilla|mandible|tooth|teeth|dental|incisor|canine|premolar|molar/i.test(name);
          break;

        case 'skel_9_thoracic_cage':
        case 'skel_10_thoracic_cavity':
          node.visible = REGEX_THORACIC_CAGE.test(name);
          break;

        case 'skel_11_pelvic_girdle':
        case 'skel_12_pelvic_section':
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
          node.visible = !REGEX_LIMB_VESSELS.test(name);
          break;

        case 'circ_3_location_heart':
        case 'circ_8_heart_section':
          if (sys === 'skeletal') {
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

        case 'circ_6_carotid_jugular':
          node.visible = /carotid|jugular|vertebral|brachiocephalic|subclavian/i.test(name);
          break;

        case 'circ_7_pulmonary':
          node.visible = /pulmonary|heart|ventricle|atrium/i.test(name);
          break;

        case 'circ_9_azygos_system':
          node.visible = /azygos|hemiazygos|intercostal.*vein|cava/i.test(name);
          break;

        case 'circ_10_vagus':
          if (sys === 'cardiovascular') {
            node.visible = REGEX_HEART_AND_GREAT_VESSELS.test(name);
          } else if (sys === 'nervous') {
            node.visible = /vagus|cranial.*x/i.test(name);
          } else {
            node.visible = /vertebra|rib|sternum/i.test(name);
          }
          break;

        case 'circ_11_liver_circulation':
          node.visible = /portal|hepatic|celiac|splenic|mesenteric|cava/i.test(name);
          break;

        case 'circ_12_lower_digestive':
          node.visible = /mesenteric|colic|ileal|jejunal|rectal|portal|splenic|aorta/i.test(name);
          break;

        case 'circ_13_pelvic_circulation':
          node.visible = /iliac|sacral|pudendal|gluteal|vesical|uterine|ovarian|obturator|aorta|cava/i.test(name);
          break;

        // --- NERVOUS SYSTEM VIEWS ---
        case 'nerv_1_full':
          node.visible = true;
          break;

        case 'nerv_2_simplified':
          node.visible = !REGEX_DISTAL_NERVES.test(name);
          break;

        case 'nerv_3_brain':
          node.visible = REGEX_BRAIN_AND_CRANIAL.test(name);
          break;

        case 'nerv_4_brain_blood':
          if (sys === 'cardiovascular') {
            node.visible = /cerebral|carotid|basilar|vertebral|willis/i.test(name);
          } else if (sys === 'nervous') {
            node.visible = REGEX_BRAIN_AND_CRANIAL.test(name);
            if (node.visible) {
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.25;
              mat.depthWrite = false;
            }
          }
          break;

        case 'nerv_5_limbic_system':
          node.visible = /hippocamp|fornix|amygdala|mammillary|cingulate|dentate|parahippocamp|septum|thalam/i.test(name);
          break;

        case 'nerv_6_thalamus':
          node.visible = /thalam|hypothalam|caudate|putamen|pallidus|striatum|subthalam/i.test(name);
          break;

        case 'nerv_7_cranial_nerves':
          node.visible = /olfactory|optic|oculomotor|trochlear|trigeminal|abducens|facial|vestibulocochlear|glossopharyngeal|vagus|accessory|hypoglossal|cranial/i.test(name);
          break;

        case 'nerv_8_vagus_nerve':
          node.visible = /vagus|cranial.*x|laryngeal.*nerve|ganglion.*vagus/i.test(name);
          break;

        case 'nerv_9_phrenic_nerves':
          node.visible = /phrenic|c3|c4|c5/i.test(name);
          break;

        case 'nerv_10_brachial_plexus':
          node.visible = /brachial.*plexus|radial.*nerve|ulnar.*nerve|median.*nerve|musculocutaneous|axillary.*nerve|suprascapular|c5|c6|c7|c8|t1/i.test(name);
          break;

        case 'nerv_11_lumbosacral':
          node.visible = /lumbar.*plexus|sacral.*plexus|femoral.*nerve|obturator.*nerve|sciatic|gluteal.*nerve|ilioinguinal|genitofemoral|l1|l2|l3|l4|l5|s1|s2|s3/i.test(name);
          break;

        case 'nerv_12_sciatic_nerve':
          node.visible = /sciatic|tibial.*nerve|common.*fibular|peroneal|sural|plantar.*nerve/i.test(name);
          break;

        case 'nerv_13_autonomic':
          node.visible = /sympathetic|ganglion|splanchnic|vagus|plexus.*coeliac|plexus.*cardiac|plexus.*hypogastric/i.test(name);
          break;

        // --- RESPIRATORY VIEWS ---
        case 'resp_1_upper':
        case 'resp_4_pharynx_larynx':
          node.visible = REGEX_RESPIRATORY_AIRWAYS.test(name) || /vertebra_c|hyoid/i.test(name);
          break;

        case 'resp_2_nasal_cavity':
        case 'resp_3_eustachian':
          node.visible = /nasal|concha|septum|pharynx|eustachian|auditory|sphenoid|ethmoid/i.test(name);
          break;

        case 'resp_5_trachea_carotids':
          if (sys === 'visceral') {
            node.visible = /trachea|bronch|laryng|thyroid/i.test(name);
          } else if (sys === 'cardiovascular') {
            node.visible = /carotid|jugular|brachiocephalic|aorta/i.test(name);
          } else {
            node.visible = /cervical|sternum|clavicle/i.test(name);
          }
          break;

        case 'resp_6_laryngeal_muscles':
          if (sys === 'muscular') {
            node.visible = /cricothyroid|arytenoid|thyrohyoid|vocalis|cricoarytenoid/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /laryng|epiglott|cartilage|vocal/i.test(name);
          } else {
            node.visible = /hyoid/i.test(name);
          }
          break;

        case 'resp_7_location_lungs':
        case 'resp_8_hilum':
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

        case 'resp_9_inhalation_muscles':
        case 'musc_9_inhalation':
          if (sys === 'muscular') {
            node.visible = /diaphragm|intercostal.*external|external intercostal|scalene|pectoralis minor|serratus anterior/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = REGEX_THORACIC_CAGE.test(name);
          }
          break;

        case 'resp_10_exhalation_muscles':
        case 'musc_10_exhalation':
          if (sys === 'muscular') {
            node.visible = /intercostal.*internal|internal intercostal|transversus abdominis|internal oblique|external oblique|rectus abdominis/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /rib|costal|pelvi|ilium|pubis|vertebra_l/i.test(name);
          }
          break;

        case 'resp_11_respiratory_innervation':
          if (sys === 'nervous') {
            node.visible = /phrenic|vagus|intercostal.*nerve/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /lung|trachea|diaphragm/i.test(name);
          } else {
            node.visible = REGEX_THORACIC_CAGE.test(name);
          }
          break;

        case 'resp_12_pulmonary_circ':
          if (sys === 'cardiovascular') {
            node.visible = /pulmonary|heart|ventricle|atrium/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /trachea|bronch/i.test(name);
          }
          break;

        // --- MUSCULAR SYSTEM VIEWS ---
        case 'musc_1_expression':
          if (sys === 'muscular') {
            node.visible = /orbicular|frontalis|occipitofrontalis|epicranial|zygomatic|risorius|buccinator|depressor|levator labii|levator anguli|mentalis|nasalis|procerus|corrugator|auricular/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /skull|frontal|parietal|temporal|maxilla|mandible|zygomatic|nasal/i.test(name);
          }
          break;

        case 'musc_2_mastication':
          if (sys === 'muscular') {
            node.visible = /masseter|temporalis|pterygoid/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /mandible|maxilla|zygomatic|temporal|sphenoid/i.test(name);
          }
          break;

        case 'musc_3_laryngeal':
        case 'musc_8_mandible_depression':
          if (sys === 'muscular') {
            node.visible = /hyoid|thyrohyoid|cricothyroid|arytenoid|omohyoid|sternohyoid|sternothyroid|digastric|mylohyoid|geniohyoid|platysma/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /hyoid|cricoid|thyroid|mandible|vertebra_c/i.test(name);
          }
          break;

        case 'musc_4_lateral_flexion':
        case 'musc_5_head_rotation':
        case 'musc_6_head_neck_ext':
        case 'musc_7_head_flexion':
          if (sys === 'muscular') {
            node.visible = /sternocleidomastoid|scalen|splenius|longus capitis|longus colli|rectus capitis|semispinalis|trapezius|levator scapulae/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /skull|vertebra_c|c1|c2|c3|c4|c5|c6|c7|clavicle|sternum/i.test(name);
          }
          break;

        case 'musc_11_shoulder':
          if (sys === 'muscular') {
            node.visible = /deltoid|supraspinatus|infraspinatus|teres|subscapularis|coracobrachialis|pectoralis major/i.test(name) && !/femor|pedis|cruris/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /scapula|clavicle|humerus|rib|sternum/i.test(name);
          }
          break;

        case 'musc_12_elbow':
          if (sys === 'muscular') {
            node.visible = /biceps brachii|brachialis|brachioradialis|triceps brachii|anconeus/i.test(name) && !/femor/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /humerus|radius|ulna/i.test(name);
          }
          break;

        case 'musc_13_wrist_hand':
          if (sys === 'muscular') {
            node.visible = /flexor carpi|extensor carpi|pronator|supinator|palmaris|abductor pollicis|flexor pollicis|extensor pollicis|lumbrical|interossei|abductor digiti|flexor digiti/i.test(name) && !/femor|pedis|plantar|toe|hallucis/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /radius|ulna|scaphoid|lunate|triquetrum|pisiform|trapezium|trapezoid|capitate|hamate|metacarpal|phalanx.*finger/i.test(name);
          }
          break;

        case 'musc_14_upper_back':
          if (sys === 'muscular') {
            node.visible = /trapezius|latissimus|rhomboid|levator scapulae|serratus posterior superior|splenius/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /vertebra_t|vertebra_c|scapula|rib/i.test(name);
          }
          break;

        case 'musc_15_lower_back':
          if (sys === 'muscular') {
            node.visible = /erector spinae|iliocostalis|longissimus|spinalis|multifidus|quadratus lumborum|serratus posterior inferior/i.test(name) && !/colli|capitis/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /vertebra_l|sacrum|pelvi|ilium|rib/i.test(name);
          }
          break;

        // --- MICROANATOMY VIEWS ---
        case 'micro_skin_dark': {
          if (sys === 'integumentary') {
            node.visible = true;
            const mat = prepareMeshMaterial(node);
            mat.color.setHex(0x5c3826);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.roughness = 0.65;
            mat.metalness = 0.05;
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_skin_light': {
          if (sys === 'integumentary') {
            node.visible = true;
            const mat = prepareMeshMaterial(node);
            mat.color.setHex(0xe8beac);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.roughness = 0.65;
            mat.metalness = 0.05;
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_hair_follicle': {
          if (sys === 'integumentary') {
            node.visible = true;
            const mat = prepareMeshMaterial(node);
            mat.color.setHex(0xcca38a);
            mat.transparent = true;
            mat.opacity = 0.85;
          } else if (sys === 'skeletal') {
            node.visible = /skull|frontal|parietal|temporal|zygomatic|maxilla/i.test(name);
            if (node.visible) {
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.25;
              mat.depthWrite = false;
            }
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_eye': {
          const lower = name.toLowerCase();
          const isLeftEye = lower.endsWith('l') || lower.includes('.l') || lower.includes('_l');
          const isEyeActive = isLeftEye && (lower.includes('cornea') || lower.includes('sclera') || lower.includes('lens') || lower.includes('retina') || lower.includes('chamber') || lower.includes('optic nerve') || lower.includes('suspensory'));
          const isEyeMuscle = isLeftEye && (lower.includes('rectus muscle') || lower.includes('oblique muscle') || lower.includes('levator palpebrae'));
          const isOrbitBone = isLeftEye && (lower.includes('frontal') || lower.includes('zygomatic') || lower.includes('maxilla') || lower.includes('lacrimal') || lower.includes('sphenoid') || lower.includes('ethmoid'));

          if (isEyeActive) {
            node.visible = true;
            node.renderOrder = 10;
            const mat = prepareMeshMaterial(node);
            if (lower.includes('cornea')) {
              mat.transparent = true;
              mat.opacity = 0.65;
              mat.depthWrite = false;
            } else if (lower.includes('sclera')) {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
              mat.color.setHex(0xf8fafc);
            } else if (lower.includes('optic nerve')) {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.color.setHex(0xfacc15);
            } else {
              mat.transparent = false;
              mat.opacity = 1.0;
            }
          } else if (isEyeMuscle) {
            node.visible = true;
            node.renderOrder = 8;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.depthWrite = true;
            mat.color.setHex(0xc2410c);
          } else {
            // Hide all skull/orbit bones so eye is isolated and pristine
            node.visible = false;
          }
          break;
        }

        case 'micro_lacrimal': {
          const lower = name.toLowerCase();
          const isLeftEye = lower.endsWith('l') || lower.includes('.l') || lower.includes('_l');
          const isLacrimal = isLeftEye && (lower.includes('lacrimal gland') || lower.includes('lacrimal sac') || lower.includes('nasolacrimal') || lower.includes('lacrimal canaliculus') || lower.includes('lacrimal bone'));
          const isEyeGlobe = isLeftEye && (lower.includes('cornea') || lower.includes('sclera'));

          if (isLacrimal) {
            node.visible = true;
            node.renderOrder = 12;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.depthWrite = true;
            mat.color.setHex(0xf97316);
            if (mat.emissive) mat.emissive.setHex(0x551100);
          } else if (isEyeGlobe) {
            node.visible = true;
            node.renderOrder = 4;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 0.85;
            mat.depthWrite = true;
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_lens_zonule': {
          const lower = name.toLowerCase();
          const isLeftEye = lower.endsWith('l') || lower.includes('.l') || lower.includes('_l');
          const isLens = isLeftEye && (lower.includes('lens') || lower.includes('cristallin'));
          const isZonule = isLeftEye && (lower.includes('suspensory') || lower.includes('zonul') || lower.includes('ciliar') || lower.includes('iris'));

          if (isLens) {
            node.visible = true;
            node.renderOrder = 14;
            const mat = prepareMeshMaterial(node);
            mat.transparent = true;
            mat.opacity = 0.90;
            mat.depthWrite = true;
            mat.color.setHex(0x38bdf8);
            if (mat.emissive) mat.emissive.setHex(0x0369a1);
          } else if (isZonule) {
            node.visible = true;
            node.renderOrder = 12;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.depthWrite = true;
            mat.color.setHex(0xfbbf24);
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_femur_section': {
          const lower = name.toLowerCase();
          const isFemur = (lower.includes('femur') || lower.includes('patella')) && (lower.endsWith('l') || lower.includes('.l') || lower.includes('_l') || !lower.includes('.r'));
          if (isFemur) {
            node.visible = true;
            node.renderOrder = 8;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.depthWrite = true;
            mat.color.setHex(0xf5edd6);
          } else {
            node.visible = false;
          }
          break;
        }

        case 'micro_osteon': {
          const lower = name.toLowerCase();
          const isFemur = lower.includes('femur') && (lower.endsWith('l') || lower.includes('.l') || lower.includes('_l') || !lower.includes('.r'));
          if (isFemur) {
            node.visible = true;
            node.renderOrder = 8;
            const mat = prepareMeshMaterial(node);
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.depthWrite = true;
            mat.color.setHex(0xf1e5c8);
          } else {
            node.visible = false;
          }
          break;
        }

        // --- DIGESTIVE SYSTEM VIEWS ---
        case 'dig_1_upper': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            if (REGEX_LUNG_TISSUE.test(name)) {
              node.visible = true;
              node.renderOrder = 3;
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.32;
              mat.depthWrite = false;
            } else if (/kidney|renal|ureter|bladder|prostate|urethra/i.test(name)) {
              node.visible = false;
            } else {
              node.visible = true;
            }
          }
          break;
        }

        case 'dig_2_lower': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            if (REGEX_LUNG_TISSUE.test(name) || /trachea|bronch|oesophagus|esophagus|thyroid/i.test(name)) {
              node.visible = false;
            } else if (/liver|gan/i.test(name)) {
              node.visible = true;
              node.renderOrder = 3;
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.22;
              mat.depthWrite = false;
            } else if (/kidney|renal|ureter/i.test(name)) {
              node.visible = false;
            } else {
              node.visible = true;
            }
          }
          break;
        }

        case 'dig_3_peritoneum': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            if (REGEX_LUNG_TISSUE.test(name)) {
              node.visible = true;
              node.renderOrder = 3;
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.32;
              mat.depthWrite = false;
            } else if (/kidney|renal|ureter|bladder|prostate/i.test(name)) {
              node.visible = false;
            } else {
              node.visible = true;
            }
          }
          break;
        }

        case 'dig_4_salivary_glands': {
          if (sys === 'skeletal') {
            node.visible = /mandible|maxilla|skull|temporal|zygomatic|hyoid|teeth|tooth/i.test(name);
            if (node.visible) {
              const mat = prepareMeshMaterial(node);
              mat.transparent = true;
              mat.opacity = 0.38;
              mat.depthWrite = false;
            }
          } else if (sys === 'visceral') {
            const isSalivary = REGEX_SALIVARY.test(name) || /tongue|gingiva/i.test(name);
            node.visible = isSalivary;
            if (isSalivary) {
              node.renderOrder = 8;
              const mat = prepareMeshMaterial(node);
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
            }
          }
          break;
        }

        case 'dig_6_laryngopharynx': {
          if (sys === 'skeletal') {
            node.visible = /vertebra_c|c1|c2|c3|c4|c5|c6|c7|hyoid|mandible|maxilla|skull/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /pharynx|laryng|epiglott|soft palate|uvula|tongue|trachea|oesophagus|esophagus/i.test(name);
          }
          break;
        }

        case 'dig_7_alimentary_canal': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            if (REGEX_LUNG_TISSUE.test(name) || /kidney|renal|ureter|bladder/i.test(name)) {
              node.visible = false;
            } else {
              node.visible = true;
            }
          }
          break;
        }

        case 'dig_8_stomach_vasculature': {
          if (sys === 'visceral') {
            node.visible = /stomach|duodenum|oesophagus|esophagus|liver|spleen|pancreas/i.test(name);
          } else if (sys === 'cardiovascular') {
            node.visible = /celiac|gastric|splenic|hepatic|mesenteric|aorta/i.test(name);
          }
          break;
        }

        case 'dig_9_sphincters': {
          if (sys === 'visceral') {
            node.visible = /stomach|duodenum|oesophagus|esophagus|caecum|colon|appendix/i.test(name);
          }
          break;
        }

        case 'dig_10_accessory_organs': {
          if (sys === 'visceral') {
            const isAccessory = /liver|gallbladder|bile duct|pancreas|duodenum|spleen/i.test(name);
            node.visible = isAccessory;
            if (isAccessory) {
              node.renderOrder = 6;
              const mat = prepareMeshMaterial(node);
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
            }
          } else {
            node.visible = false;
          }
          break;
        }

        case 'dig_11_regional_vasculature': {
          if (sys === 'visceral') {
            node.visible = /stomach|duodenum|liver|pancreas|colon|jejunum/i.test(name);
          } else if (sys === 'cardiovascular') {
            node.visible = /mesenteric|portal|splenic|hepatic|celiac|aorta|cava/i.test(name);
          }
          break;
        }

        case 'dig_12_intestines': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            if (REGEX_LUNG_TISSUE.test(name) || /kidney|renal|ureter|bladder|liver|stomach|trachea/i.test(name)) {
              node.visible = false;
            } else {
              node.visible = /colon|jejunum|ileum|caecum|appendix|taenia|duodenum/i.test(name);
            }
          }
          break;
        }

        // --- LYMPHATIC SYSTEM VIEWS ---
        case 'lymph_spleen': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'lymphatic') {
            node.visible = true;
            if (/spleen|lá lách/i.test(name)) {
              node.renderOrder = 8;
            }
          } else if (sys === 'visceral') {
            node.visible = /stomach|colon|spleen/i.test(name);
          }
          break;
        }

        case 'lymph_nodes_system': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'lymphatic') {
            node.visible = true;
            node.renderOrder = 6;
          } else if (sys === 'visceral') {
            node.visible = /spleen|thymus/i.test(name);
          }
          break;
        }

        // --- URINARY SYSTEM VIEWS ---
        case 'urin_system': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = true;
          } else if (sys === 'visceral') {
            const isUrinary = REGEX_URINARY_ORGANS.test(name);
            node.visible = isUrinary;
            if (isUrinary) {
              node.renderOrder = 6;
              const mat = prepareMeshMaterial(node);
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
            }
          }
          break;
        }

        case 'urin_pelvic': {
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          if (sys === 'skeletal') {
            node.visible = /ilium|ischium|pubis|pelvi|sacrum|coccyx|femur.*head|femur.*neck|acetabul|vertebra_l5/i.test(name);
          } else if (sys === 'visceral') {
            const isPelvicUrinary = /bladder|prostate|urethra/i.test(name);
            node.visible = isPelvicUrinary;
            if (isPelvicUrinary) {
              node.renderOrder = 6;
              const mat = prepareMeshMaterial(node);
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
            }
          }
          break;
        }

        // --- REGIONAL ANATOMY VIEWS ---
        case 'reg_head_neck':
          node.visible = /skull|cervical|c1|c2|c3|c4|c5|c6|c7|facial|head|neck|brain|pharynx|larynx|thyroid|carotid|jugular/i.test(name) && !/thorac|lumbar|sacr|femor|tibia|ulna|radius/i.test(name);
          break;

        case 'reg_thorax':
          node.visible = /thorac|rib|costal|sternum|lung|heart|bronch|aorta|esophagus|oesophagus|intercostal/i.test(name) && !/skull|lumbar|pelvi|femor|tibia/i.test(name);
          break;

        case 'reg_abdomen_pelvis':
          if (REGEX_GENITALIA.test(name)) {
            node.visible = false;
            break;
          }
          node.visible = /lumbar|pelvi|sacrum|stomach|liver|duodenum|pancreas|spleen|kidney|ureter|bladder|intestine|colon|caecum|mesenter|iliac/i.test(name) && !/skull|rib.*(1|2|3|4|5|6)|lung|heart|brain/i.test(name);
          break;

        case 'reg_spine':
          node.visible = REGEX_SPINE_FULL.test(name) && !/rib|sternum|maxilla|mandible|frontal|temporal|parietal/i.test(name);
          break;

        case 'reg_upper_limb':
          node.visible = /clavicle|scapula|humerus|radius|ulna|carpal|metacarpal|phalanx.*finger|biceps|triceps|brachial|deltoid/i.test(name) && !/femor|pedis|cruris/i.test(name);
          break;

        case 'reg_lower_limb':
          node.visible = /femur|patella|tibia|fibula|tarsal|metatarsal|phalanx.*foot|quadriceps|gastrocnemius|soleus|tibialis/i.test(name) && !/skull|rib|cervical/i.test(name);
          break;

        // --- GROSS ANATOMY LAB VIEWS (Phòng Thực Tập Giải Phẫu Thi Thể / Bàn Mổ) ---
        case 'lab_back':
          if (sys === 'muscular') {
            node.visible = /trapezius|latissimus|rhomboid|levator scapulae|splenius|erector spinae|iliocostalis|longissimus|spinalis|multifidus|semispinalis|serratus posterior|gluteus|infraspinatus|supraspinatus|teres|suboccipital/i.test(name) && !/pectoralis major|rectus abdominis/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /vertebra|sacrum|coccyx|rib|costal|scapula|pelvi|ilium|occipital/i.test(name);
          }
          break;

        case 'lab_upper_limb':
          if (sys === 'muscular') {
            node.visible = /deltoid|supraspinatus|infraspinatus|teres|subscapularis|coracobrachialis|biceps|brachialis|triceps|pronator|supinator|flexor carpi|extensor carpi|palmaris|brachioradialis|lumbrical|interossei|abductor|opponens/i.test(name) && !/femor|tibial|gastrocnemius|soleus/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /clavicle|scapula|humerus|radius|ulna|carpal|scaphoid|lunate|triquetrum|pisiform|trapezium|trapezoid|capitate|hamate|metacarpal|phalanx.*finger|rib/i.test(name);
          } else if (sys === 'nervous') {
            node.visible = /brachial plexus|radial nerve|median nerve|ulnar nerve|musculocutaneous|axillary nerve/i.test(name);
          }
          break;

        case 'lab_thorax':
          if (sys === 'muscular') {
            node.visible = /pectoralis|intercostal|subclavius|serratus anterior|transversus thoracis|diaphragm/i.test(name) && !/femor|tibial|soleus/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /rib|costal|sternum|manubrium|xiphoid|vertebra_t|clavicle/i.test(name);
          }
          break;

        case 'lab_heart_lungs':
          if (sys === 'skeletal') {
            node.visible = /rib|costal|sternum|vertebra_t|clavicle/i.test(name);
          }
          break;

        case 'lab_abdomen':
          if (sys === 'muscular') {
            node.visible = /rectus abdominis|external oblique|internal oblique|transversus abdominis|pyramidalis|quadratus lumborum|psoas|iliacus/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /rib|costal|vertebra_l|pelvi|ilium|ischium|pubis|sacrum/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /stomach|gastric|liver|hepatic|gallbladder|bile|pancreas|pancreatic|duodenum|jejunum|ileum|colon|appendix|caecum|rectum|spleen|kidney|renal/i.test(name);
          }
          break;

        case 'lab_intraperitoneal':
          if (sys === 'skeletal') {
            node.visible = /vertebra_l|vertebra_t|rib.*(10|11|12)|pelvi|ilium|sacrum/i.test(name);
          }
          break;

        case 'lab_retroperitoneal':
          if (sys === 'skeletal') {
            node.visible = /vertebra_t|vertebra_l|rib.*(11|12)|pelvi|ilium|sacrum/i.test(name);
          }
          break;

        case 'lab_pelvis':
          if (sys === 'muscular') {
            node.visible = /levator ani|coccygeus|piriformis|obturator|sphincter ani|gluteus|iliacus|psoas/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /pelvi|ilium|ischium|pubis|sacrum|coccyx|vertebra_l|femur.*head|femur.*neck|greater trochanter/i.test(name);
          } else if (sys === 'visceral') {
            node.visible = /bladder|ureter|urethra|prostate|seminal|rectum|uterus|vagina|ovary/i.test(name);
          }
          break;

        case 'lab_lower_limb':
          if (sys === 'muscular') {
            node.visible = /gluteus|tensor fasciae|piriformis|obturator|quadriceps|rectus femoris|vastus|sartorius|gracilis|pectineus|adductor|biceps femoris|semitendinosus|semimembranosus|tibialis|extensor digitorum.*pedis|extensor hallucis|fibularis|peroneus|gastrocnemius|soleus|plantaris|popliteus|flexor digitorum.*pedis|flexor hallucis|abductor hallucis|flexor digitorum brevis|interossei.*pedis|lumbrical.*pedis/i.test(name) && !/brachial|deltoid|pectoralis/i.test(name);
          } else if (sys === 'skeletal') {
            node.visible = /pelvi|ilium|ischium|pubis|femur|patella|tibia|fibula|talus|calcaneus|navicular|cuboid|cuneiform|metatarsal|phalanx.*toe/i.test(name);
          } else if (sys === 'nervous') {
            node.visible = /femoral nerve|sciatic nerve|tibial nerve|fibular nerve|peroneal nerve|saphenous nerve|sural nerve|plantar nerve/i.test(name);
          }
          break;

        default:
          node.visible = true;
          break;
      }
    }
  });

  // Apply Ghosting Translucency for context structures
  if (viewId === 'circ_3_location_heart' || viewId === 'circ_8_heart_section') {
    setSystemTransparency('skeletal', 0.16);
  } else if (viewId === 'resp_7_location_lungs') {
    setSystemTransparency('skeletal', 0.16);
  } else if (viewId === 'lab_heart_lungs') {
    setSystemTransparency('skeletal', 0.16);
  } else if (viewId === 'lab_intraperitoneal' || viewId === 'lab_retroperitoneal') {
    setSystemTransparency('skeletal', 0.18);
  } else if (viewId.startsWith('musc_')) {
    setSystemTransparency('skeletal', 0.22);
  } else if (viewId === 'dig_1_upper' || viewId === 'dig_2_lower' || viewId === 'dig_3_peritoneum' || viewId === 'dig_7_alimentary_canal' || viewId === 'dig_12_intestines') {
    setSystemTransparency('skeletal', 0.14);
  } else if (viewId === 'lymph_spleen') {
    setSystemTransparency('skeletal', 0.15);
  } else if (viewId === 'lymph_nodes_system') {
    setSystemTransparency('skeletal', 0.18);
  } else if (viewId === 'urin_system') {
    setSystemTransparency('skeletal', 0.14);
  } else if (viewId === 'urin_pelvic') {
    setSystemTransparency('skeletal', 0.28);
  } else if (viewId.startsWith('nerv_inerv_')) {
    setSystemTransparency('skeletal', 0.22);
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
