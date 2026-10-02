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

// Custom Medical Fresnel Rim Silhouette Shader
function createFresnelMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xf1f5f9) },
      rimColor: { value: new THREE.Color(0xffffff) },
      rimPower: { value: 3.2 },
      rimIntensity: { value: 0.55 },
      baseOpacity: { value: 0.03 }
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
    const modelPath = asset('models/muscular.glb');

    const gltf = await new Promise((resolve, reject) => {
      loader.load(modelPath, resolve, undefined, reject);
    });

    const fresnelMat = createFresnelMaterial();
    const model = gltf.scene;

    // Attach cloned meshes to the envelope group with Fresnel rim shader
    model.traverse(node => {
      if (node.isMesh && node.geometry) {
        const mesh = new THREE.Mesh(node.geometry, fresnelMat);
        mesh.name = `Envelope_${node.name}`;
        mesh.matrix.copy(node.matrix);
        mesh.matrixWorld.copy(node.matrixWorld);
        mesh.position.copy(node.position);
        mesh.rotation.copy(node.rotation);
        mesh.scale.copy(node.scale);
        mesh.renderOrder = 99; // Render over internal anatomy with soft depth blending
        mesh.raycast = () => null; // Never intercept user pointer picking
        mesh.userData.isBodyEnvelope = true;
        bodyEnvelopeGroup.add(mesh);
      }
    });

    isLoaded = true;
    updateBodyEnvelopeAuto(viewer);
  } catch (error) {
    console.warn('[bodyEnvelope] Could not load muscular envelope:', error);
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

  // Show body envelope when skeleton is active and muscular system is not displayed in solid mode
  const shouldShow = isSkelLoaded && !muscIsSolid;
  setBodyEnvelopeVisible(shouldShow, viewer);
}
