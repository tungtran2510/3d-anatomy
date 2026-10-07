---
name: threejs-medical-visualization
description: WebGL, Three.js, Draco compression, and real-time GPU optimization patterns for high-density 3D medical anatomy atlases.
---

# Three.js Medical Visualization Skill

## Overview
Guidelines for managing 2,000+ medical geometry meshes, material states (opaque, transparent ghosting, xray), clipping planes, and mobile GPU memory constraints.

## Best Practices

### 1. Mesh Registry & Memory Management
* Cache loaded meshes in `getMeshRegistry()` indexed by canonical `partId`.
* Dispose of unused buffer geometries and materials when unloading systems to prevent mobile Safari/Chrome OOM crashes.
* Avoid full scene rebuilds; toggle `mesh.visible` and update `mesh.material.opacity`.

### 2. Centroid-Anchored Framing & Smooth Zooming
* When focusing or zooming on a selected structure:
  * Compute the bounding box and centroid of the mesh: `box.setFromObject(mesh); box.getCenter(center)`.
  * Smoothly interpolate camera target and position towards the centroid without sudden disorienting flips.

### 3. Mobile Viewport & Touch Event Hygiene
* Touch and pointer gestures over UI controls (sliders, floating buttons, bottom drawers) must call `e.stopPropagation()` to prevent conflict with `OrbitControls`.
* Maintain single-line titles with ellipsis (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) on narrow mobile screens (390px).
