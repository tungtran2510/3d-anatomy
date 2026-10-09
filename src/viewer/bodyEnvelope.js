// Translucent Outer Body Silhouette Envelope Manager
// Creates an authentic Visible Body / Complete Anatomy semi-transparent frosted body envelope
// wrapping the skeleton when in skeletal views or when only the skeleton is displayed.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { state } from '../state/store.js';
import { asset } from '../utils/paths.js';
import { getAnatomyRoot } from './orientationManager.js';

let bodyEnvelopeGroup = null;
let isLoading = false;
let isLoaded = false;
let userDisabled = true; // Disabled by default to ensure crisp, clean skeletal rendering without ghost halos

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(asset('draco/'));

function isCurrentThemeDark() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList?.contains('theme-dark');
}

// Custom Medical Fresnel Rim Silhouette Shader
function createFresnelMaterial() {
  const isDark = isCurrentThemeDark();
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(isDark ? 0x0f172a : 0x94a3b8) },
      rimColor: { value: new THREE.Color(isDark ? 0x38bdf8 : 0x64748b) },
      rimPower: { value: isDark ? 4.5 : 4.8 },
      rimIntensity: { value: isDark ? 0.40 : 0.35 },
      baseOpacity: { value: 0.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform vec3 rimColor;
      uniform float rimPower;
      uniform float rimIntensity;
      uniform float baseOpacity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPos;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float rim = pow(fresnel, rimPower) * rimIntensity;
        
        // Extremity attenuation: smoothly dissolve above wrists (Y < 0.89, |X| > 0.16) and ankles (Y < 0.16)
        // This guarantees the cadaver skeletal hands and feet are never smothered by distorted envelope mittens
        float fade = 1.0;
        if (vWorldPos.y < 0.89 && abs(vWorldPos.x) > 0.16) {
          float dist = (0.89 - vWorldPos.y) / 0.05;
          fade *= clamp(1.0 - dist, 0.0, 1.0);
        }
        if (vWorldPos.y < 0.16) {
          float dist = (0.16 - vWorldPos.y) / 0.05;
          fade *= clamp(1.0 - dist, 0.0, 1.0);
        }
        
        float alpha = clamp(baseOpacity + rim, 0.0, 0.28) * fade;
        vec3 finalColor = mix(color, rimColor, rim);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.FrontSide,
    blending: THREE.NormalBlending
  });
}

// Precise anatomical realignment of skin mesh ensuring zero skeletal protrusion and realistic subcutaneous depth
export function realignIntegumentaryGeometry(mesh) {
  if (!mesh?.geometry?.attributes?.position) return;
  if (mesh.userData.isRealigned) return;
  mesh.userData.isRealigned = true;

  const geom = mesh.geometry;
  const pos = geom.attributes.position;
  
  // Hermite smoothstep helper: S-curve transition from 0 to 1
  function smoothstep(edge0, edge1, val) {
    const t = Math.min(1.0, Math.max(0.0, (val - edge0) / (edge1 - edge0)));
    return t * t * (3.0 - 2.0 * t);
  }

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // 1. Hand & Finger alignment: ensure distal phalanges never poke out like claws
    if (y < 0.88 && Math.abs(x) > 0.18) {
      const handProg = smoothstep(0.86, 0.73, y);
      y -= handProg * handProg * 0.028;
      const lateralSign = Math.sign(x);
      x += lateralSign * handProg * 0.003;
      z += handProg * 0.004;
    }

    // 2. Foot alignment: ensure toes smoothly cover the distal phalanges
    if (y < 0.12) {
      if (z > 0.05) {
        z += 0.006 * smoothstep(0.05, 0.11, z);
      }
    }

    pos.setXYZ(i, x, y, z);
  }

  pos.needsUpdate = true;
  geom.computeVertexNormals();
  if (geom.computeBoundsTree) geom.computeBoundsTree();
}

export async function initBodyEnvelope(viewer = state.viewer || window.viewer) {
  if (!viewer?.scene) return null;
  const anatomyRoot = getAnatomyRoot(viewer.scene);
  const existing = anatomyRoot.getObjectByName('bodyEnvelopeGroup') || viewer.scene.getObjectByName('bodyEnvelopeGroup');
  if (existing) {
    bodyEnvelopeGroup = existing;
    isLoaded = true;
    return bodyEnvelopeGroup;
  }
  if (bodyEnvelopeGroup || isLoading || isLoaded) return bodyEnvelopeGroup;

  isLoading = true;

  bodyEnvelopeGroup = new THREE.Group();
  bodyEnvelopeGroup.name = 'bodyEnvelopeGroup';
  // Precise anatomical alignment matching Z-Anatomy cadaver skeleton
  bodyEnvelopeGroup.position.set(0, 0.002, 0.0095);
  anatomyRoot.add(bodyEnvelopeGroup);

  try {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const modelPath = asset('models/integumentary.glb');

    const gltf = await new Promise((resolve, reject) => {
      loader.load(modelPath, resolve, undefined, reject);
    });

    const fresnelMat = createFresnelMaterial();
    const model = gltf.scene;

    model.traverse(node => {
      if (node.isMesh && node.geometry) {
        realignIntegumentaryGeometry(node);
        node.material = fresnelMat;
        node.renderOrder = 0; // Keep behind/inline with anatomy, never artificially overlay with halos
        node.raycast = () => null; // Never intercept user pointer picking
        node.userData.isBodyEnvelope = true;
      }
    });

    bodyEnvelopeGroup.add(model);

    isLoaded = true;
    updateBodyEnvelopeAuto(viewer);
  } catch (error) {
    console.warn('[bodyEnvelope] Could not load integumentary envelope:', error);
  } finally {
    isLoading = false;
  }

  return bodyEnvelopeGroup;
}

export function setBodyEnvelopeVisible(visible, viewer = state.viewer || window.viewer) {
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (bodyEnvelopeGroup) {
    bodyEnvelopeGroup.visible = visible;
    viewer?.render?.();
  }
}

export function isBodyEnvelopeVisible(viewer = state.viewer || window.viewer) {
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  return !!(bodyEnvelopeGroup && bodyEnvelopeGroup.visible);
}

export function toggleBodyEnvelope(viewer = state.viewer || window.viewer) {
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (!bodyEnvelopeGroup && !isLoading && !isLoaded) {
    initBodyEnvelope(viewer);
    return;
  }
  const currentlyVis = isBodyEnvelopeVisible(viewer);
  userDisabled = currentlyVis;
  setBodyEnvelopeVisible(!currentlyVis, viewer);
}

export function updateBodyEnvelopeAuto(viewer = state.viewer || window.viewer) {
  if (userDisabled) {
    setBodyEnvelopeVisible(false, viewer);
    return;
  }
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (!bodyEnvelopeGroup) {
    // If skeletal is visible and muscular is not, lazily initialize
    const isSkelActive = state.loadedSystems.includes('skeletal');
    const isMuscActive = state.loadedSystems.includes('muscular');
    if (isSkelActive && !isMuscActive) {
      initBodyEnvelope(viewer);
    }
    return;
  }

  const isSkelLoaded = state.loadedSystems.includes('skeletal');
  const isMuscLoaded = state.loadedSystems.includes('muscular');
  const isSkinLoaded = state.loadedSystems.includes('integumentary');

  // Check if muscular system is currently solid/visible
  let muscIsSolid = false;
  if (isMuscLoaded) {
    viewer?.scene?.traverse(node => {
      if (node.isMesh && node.userData?.system === 'muscular' && node.visible) {
        if (!node.material?.transparent || node.material?.opacity > 0.8) {
          muscIsSolid = true;
        }
      }
    });
  }

  // Check if real integumentary skin is currently solid/visible
  let skinIsSolid = false;
  if (isSkinLoaded) {
    viewer?.scene?.traverse(node => {
      if (node.isMesh && node.userData?.system === 'integumentary' && node.visible) {
        if (!node.material?.transparent || node.material?.opacity > 0.8) {
          skinIsSolid = true;
        }
      }
    });
  }

  // Show body envelope when skeleton is active and muscular / skin system is not displayed in solid mode
  const shouldShow = isSkelLoaded && !muscIsSolid && !skinIsSolid;
  setBodyEnvelopeVisible(shouldShow, viewer);
}

export function setBodyEnvelopeTone(colorHex, opacity = 0.85, viewer = state.viewer || window.viewer) {
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (!bodyEnvelopeGroup) return;
  bodyEnvelopeGroup.traverse(node => {
    if (node.isMesh && node.material?.uniforms) {
      if (node.material.uniforms.color) node.material.uniforms.color.value.setHex(colorHex);
      if (node.material.uniforms.rimColor) node.material.uniforms.rimColor.value.setHex(colorHex);
      if (node.material.uniforms.baseOpacity) node.material.uniforms.baseOpacity.value = opacity;
    }
  });
  setBodyEnvelopeVisible(true, viewer);
  viewer?.render?.();
}

export function syncBodyEnvelopeTheme(isDark, viewer = state.viewer || window.viewer) {
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (!bodyEnvelopeGroup) return;
  bodyEnvelopeGroup.traverse(node => {
    if (node.isMesh && node.material?.uniforms) {
      if (node.material.uniforms.color) node.material.uniforms.color.value.setHex(isDark ? 0x0f172a : 0x94a3b8);
      if (node.material.uniforms.rimColor) node.material.uniforms.rimColor.value.setHex(isDark ? 0x38bdf8 : 0x64748b);
      if (node.material.uniforms.rimPower) node.material.uniforms.rimPower.value = isDark ? 4.5 : 4.8;
      if (node.material.uniforms.rimIntensity) node.material.uniforms.rimIntensity.value = isDark ? 0.40 : 0.35;
      if (node.material.uniforms.baseOpacity) node.material.uniforms.baseOpacity.value = 0.0;
    }
  });
  viewer?.invalidate?.(3);
  viewer?.render?.();
}


