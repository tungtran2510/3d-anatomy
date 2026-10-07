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
let userDisabled = false;

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
      rimColor: { value: new THREE.Color(isDark ? 0x38bdf8 : 0x0284c7) },
      rimPower: { value: isDark ? 3.2 : 2.8 },
      rimIntensity: { value: isDark ? 0.55 : 0.75 },
      baseOpacity: { value: isDark ? 0.035 : 0.075 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
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
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float rim = pow(fresnel, rimPower) * rimIntensity;
        float alpha = clamp(baseOpacity + rim, 0.0, 0.65);
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
        node.material = fresnelMat;
        node.renderOrder = 99; // Render over internal anatomy with soft depth blending
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
  if (userDisabled) return;
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
      if (node.material.uniforms.rimColor) node.material.uniforms.rimColor.value.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      if (node.material.uniforms.rimPower) node.material.uniforms.rimPower.value = isDark ? 3.2 : 2.8;
      if (node.material.uniforms.rimIntensity) node.material.uniforms.rimIntensity.value = isDark ? 0.55 : 0.75;
      if (node.material.uniforms.baseOpacity) node.material.uniforms.baseOpacity.value = isDark ? 0.035 : 0.075;
    }
  });
  viewer?.invalidate?.(3);
  viewer?.render?.();
}


