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
      baseOpacity: { value: 0.0 },
      maxAlpha: { value: 0.35 }
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
      uniform float maxAlpha;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPos;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float rim = pow(fresnel, rimPower) * rimIntensity;
        
        float alpha = clamp(baseOpacity + rim, 0.0, maxAlpha);
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
  const norm = geom.attributes.normal;
  
  // Hermite smoothstep helper: S-curve transition from 0 to 1
  function smoothstep(edge0, edge1, val) {
    const t = Math.min(1.0, Math.max(0.0, (val - edge0) / (edge1 - edge0)));
    return t * t * (3.0 - 2.0 * t);
  }

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const nx = norm ? norm.getX(i) : 0;
    const ny = norm ? norm.getY(i) : 0;
    const nz = norm ? norm.getZ(i) : 0;

    const latSign = Math.sign(x);
    const absX = Math.abs(x);

    // 1. HEEL & ACHILLES TENDON PADDING (Y < 0.14)
    if (y < 0.14 && absX > 0.02 && absX < 0.14) {
      const heelYProg = smoothstep(0.14, 0.01, y);
      if (z < 0.02) {
        const heelZProg = smoothstep(0.02, -0.07, z);
        z -= heelYProg * heelZProg * 0.020;
      }
      if (y >= 0.04 && y <= 0.12) {
        const malleolusProg = smoothstep(0.04, 0.07, y) * smoothstep(0.12, 0.07, y);
        x += latSign * malleolusProg * 0.007;
        z -= malleolusProg * 0.006;
      }
      if (y < 0.04) {
        y -= heelYProg * 0.004;
      }
    }

    // 2. LOWER LEG POSTERIOR TIBIA & FIBULA (0.10 < Y < 0.35)
    if (y >= 0.10 && y < 0.35 && absX > 0.02 && absX < 0.13) {
      const legProg = smoothstep(0.35, 0.12, y);
      if (z < 0.01) {
        const calfZ = smoothstep(0.01, -0.05, z);
        z -= legProg * calfZ * 0.014;
      }
      if (absX > 0.08) {
        const fibProg = smoothstep(0.08, 0.11, absX) * smoothstep(0.28, 0.14, y);
        x += latSign * fibProg * 0.006;
      }
    }

    // 3. HAND & FINGERS ANATOMICAL ENVELOPE (Y < 0.865, absX > 0.18)
    if (y < 0.865 && absX > 0.18) {
      // Normal displacement: 4mm to 10mm
      const handProg = smoothstep(0.88, 0.73, y);
      const inflateDist = 0.004 + handProg * 0.007;
      x += nx * inflateDist;
      y += ny * inflateDist;
      z += nz * inflateDist;

      // Extra dorsal bias for metacarpals & knuckles ONLY on dorsal-facing normals (nz < -0.05)
      if (nz < -0.05 && y > 0.70 && y < 0.85 && absX <= 0.338) {
        const dorsalExtra = smoothstep(0.85, 0.77, y) * smoothstep(0.70, 0.77, y);
        z -= dorsalExtra * 0.016; // 16mm dorsal padding
      }

      // 4 Fingertips elongation (absX <= 0.338)
      if (y < 0.77 && absX <= 0.338) {
        const tipProg = smoothstep(0.77, 0.70, y);
        y -= tipProg * 0.052; // 52mm extension to fully encase distal phalanges down to Y = 0.692
      }

      // THUMB ENVELOPE & WEBBING (absX > 0.26, y between 0.74 and 0.85)
      if (absX > 0.26 && y > 0.74 && y < 0.85) {
        const thumbProg = smoothstep(0.85, 0.77, y);
        const thumbX = smoothstep(0.26, 0.305, absX);
        const w = thumbProg * thumbX;

        // Dorsal coverage for thumb and webbing
        if (nz < 0.4) {
          const dorsalProg = smoothstep(0.4, -0.8, nz);
          z -= w * (0.018 + dorsalProg * 0.024);
        }

        // Distal extension of thumb tip
        if (y < 0.80 && absX > 0.29) {
          const tipProg = smoothstep(0.80, 0.76, y);
          y -= tipProg * 0.045; // 45mm thumb extension
        }

        // Lateral protection
        x += latSign * w * 0.014;
      }
    }

    // 4. SACRUM / COCCYX PADDING (0.80 < Y < 0.88, absX < 0.04, Z < -0.05)
    if (y > 0.80 && y < 0.88 && absX < 0.04 && z < -0.05) {
      const coccyxProg = smoothstep(0.88, 0.84, y) * smoothstep(-0.05, -0.08, z);
      z -= coccyxProg * 0.010;
    }

    // 5. FLOATING RIBS & FLANKS (1.00 < Y < 1.20, 0.10 < absX < 0.18)
    if (y > 1.00 && y < 1.20 && absX > 0.10 && absX < 0.18) {
      const ribProg = smoothstep(1.00, 1.10, y) * smoothstep(1.20, 1.10, y);
      const ribX = smoothstep(0.10, 0.14, absX);
      x += latSign * ribProg * ribX * 0.009;
      if (z > -0.02) {
        z += ribProg * ribX * 0.006;
      }
    }

    // 6. PUBIC TUBERCLES & SYMPHYSIS (0.82 < Y < 0.94, absX < 0.08, Z > 0.0)
    if (y > 0.82 && y < 0.94 && absX < 0.08 && z > 0.0) {
      const pubicProg = smoothstep(0.82, 0.87, y) * smoothstep(0.94, 0.87, y);
      const pubicX = smoothstep(0.08, 0.02, absX);
      z += pubicProg * pubicX * 0.009;
    }

    // 7. JUGULAR NOTCH / STERNUM / CLAVICLE (1.30 < Y < 1.45, absX < 0.06, Z > 0.01)
    if (y > 1.30 && y < 1.45 && absX < 0.06 && z > 0.01) {
      const sternProg = smoothstep(1.30, 1.37, y) * smoothstep(1.45, 1.37, y);
      z += sternProg * 0.005;
    }

    // 8. LARYNGEAL PROMINENCE / THYROID CARTILAGE (1.45 < Y < 1.52, absX < 0.035, Z > 0.02)
    if (y > 1.45 && y < 1.52 && absX < 0.035 && z > 0.02) {
      const laryProg = smoothstep(1.45, 1.48, y) * smoothstep(1.52, 1.48, y);
      z += laryProg * 0.005;
    }

    // 9. SCALP / SKULL VERTEX (Y > 1.74, absX < 0.09)
    if (y > 1.74 && absX < 0.09) {
      const scalpProg = smoothstep(1.74, 1.79, y);
      y += scalpProg * 0.004;
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
  bodyEnvelopeGroup.position.set(0, 0, 0);
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

let currentEnvelopeOpacity = 0.0;

export function setBodyEnvelopeOpacity(opacity, viewer = state.viewer || window.viewer) {
  currentEnvelopeOpacity = Math.max(0, Math.min(1, parseFloat(opacity) || 0));
  if (!bodyEnvelopeGroup && viewer?.scene) {
    bodyEnvelopeGroup = viewer.scene.getObjectByName('bodyEnvelopeGroup');
  }
  if (!bodyEnvelopeGroup && !isLoading && !isLoaded && currentEnvelopeOpacity > 0) {
    initBodyEnvelope(viewer).then(() => {
      setBodyEnvelopeOpacity(currentEnvelopeOpacity, viewer);
    });
    return;
  }
  if (!bodyEnvelopeGroup) return;

  if (currentEnvelopeOpacity <= 0.01) {
    bodyEnvelopeGroup.visible = false;
  } else {
    bodyEnvelopeGroup.visible = true;
    bodyEnvelopeGroup.traverse(node => {
      if (node.isMesh && node.material?.uniforms) {
        if (node.material.uniforms.baseOpacity) {
          node.material.uniforms.baseOpacity.value = currentEnvelopeOpacity * 0.85;
        }
        if (node.material.uniforms.maxAlpha) {
          node.material.uniforms.maxAlpha.value = Math.max(0.28, currentEnvelopeOpacity);
        }
      }
    });
  }
  viewer?.invalidate?.(3);
  viewer?.render?.();
}

export function getBodyEnvelopeOpacity() {
  return currentEnvelopeOpacity;
}



