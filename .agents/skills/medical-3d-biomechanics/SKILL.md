---
name: medical-3d-biomechanics
description: Principles and computational rules for simulating human joint kinematics, Range of Motion (ROM), agonist/antagonist muscle dynamics, and 3D timeline animation scrubbing in WebGL/Three.js.
---

# Medical 3D Biomechanics & Joint Kinematics Skill

## Overview
This skill governs the integration of anatomical motion, joint kinematics, and Range of Motion (ROM) measurement into 3D atlas environments.

## Standards & Principles

### 1. Range of Motion (ROM) Clinical Standards (Neutral-0 Method)
All joint motions follow standard orthopaedic Neutral-0 conventions:
* **Knee Flexion (Gập gối)**: 0° (Duỗi thẳng) → 140° (Gập sâu chạm mông). Agonist: Hamstrings (Nhóm cơ gân kheo).
* **Shoulder Abduction (Dạng vai)**: 0° (Khép sát thân) → 180° (Dạng qua đầu). Agonist: Deltoid & Supraspinatus (Cơ delta & Cơ trên gai).
* **Hip Flexion (Gập háng)**: 0° (Duỗi giải phẫu) → 120° (Gập đùi vào ngực). Agonist: Iliopsoas & Rectus femoris (Cơ thắt lưng chậu & Cơ thẳng đùi).
* **Elbow Flexion (Gập khuỷu)**: 0° (Duỗi thẳng) → 145° (Gập chạm vai). Agonist: Biceps brachii & Brachialis (Cơ nhị đầu & Cơ cánh tay).
* **Spine Flexion (Cúi cột sống)**: 0° (Đứng thẳng) → 80° (Cúi gập thân). Agonist: Rectus abdominis & Obliques (Cơ thẳng bụng).
* **Ankle Dorsiflexion/Plantarflexion (Gập mu / Gập lòng cổ chân)**: 20° (Gập mu) → 0° → 50° (Gập lòng). Agonist: Tibialis anterior / Gastrocnemius.

### 2. State & Subscription Synchronization
* Always manage lifecycle subscriptions cleanly:
  ```javascript
  if (kinematicsUnsub) {
    kinematicsUnsub();
    kinematicsUnsub = null;
  }
  kinematicsUnsub = dynamicAnatomy.subscribe((st) => {
    // Sync slider thumb, live angle badge, and play/pause icon
  });
  ```
* Pause active animations when switching parts or dismissing selection cards.
* Isolate touch events on ROM sliders (`pointerdown`, `touchstart`, `touchmove`) to avoid unwanted Three.js camera rotation.
