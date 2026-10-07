---
name: anatomical-concept-authoring
description: Expert methodology for authoring interactive clinical anatomy concepts, 4-stage pathology progression simulators, and multi-slide vector micro-decks according to Terminologia Anatomica (TA2) standards.
---

# Anatomical Concept Authoring Skill

## Overview
This skill defines the standardized architecture for authoring high-authority, multi-layer anatomical concepts, interactive vector micro-decks, and clinical disease progression simulators for medical atlas applications.

## Core Architecture

### 1. Concept Schema Definition
Every concept registered in `src/data/anatomyConcepts.js` must adhere strictly to this schema:
```javascript
{
  id: 'concept_<unique_snake_case>',
  keywords: [
    // Must include: Vietnamese with diacritics, unaccented Vietnamese, English, Latin, and common clinical terms/symptoms
  ],
  titleVi: 'Tên chuyên đề chuẩn Y khoa (VD: Hệ Tiết Niệu & Cầu Thận)',
  latin: 'Danh pháp Latinh chuẩn Terminologia Anatomica (TA2)',
  subtitle: 'Tóm tắt giải phẫu & sinh lý học 1 câu ngắn gọn',
  thumbnail: '/images/atlas/<name>.svg',
  system: '<skeletal|muscular|joints|cardiovascular|lymphatic|nervous|visceral>',
  primaryPartId: '<Exact mesh name in partsData>',
  subunits: [
    // 3–4 essential constituent structures for quick dissection
    { label: '<Emoji> <Tên tiếng Việt>', partId: '<Exact mesh name in partsData>', note: '<Mô tả chức năng vi thể ngắn>' }
  ],
  slides: [
    // Exactly 3 progressive vector slides:
    // Slide 1: Cấu tạo giải phẫu vĩ mô (Macro-anatomy)
    // Slide 2: Sinh lý học / Chức năng vi thể (Physiology / Micro-filtration / Hemodynamics)
    // Slide 3: Tiến triển bệnh học 4 cấp độ (Pathology / Clinical staging)
    { id: 'anatomy', title: 'Cấu tạo', badge: '...', image: '...', caption: '...' },
    { id: 'physiology', title: 'Sinh lý', badge: '...', image: '...', caption: '...' },
    { id: 'pathology', title: '4 Cấp độ', badge: '...', image: '...', caption: '...' }
  ],
  simulator: {
    title: '<Emoji> TIẾN TRIỂN BỆNH HỌC:',
    ticks: ['Bình thường', 'Giai đoạn 1', 'Giai đoạn 2', 'Nguy kịch'],
    stages: [
      { level: 'Cấp 0: ...', desc: '...' },
      { level: 'Cấp 1: ...', desc: '...' },
      { level: 'Cấp 2: ...', desc: '...' },
      { level: 'Cấp 3: ...', desc: '...' }
    ]
  },
  video: {
    title: 'Mô phỏng 3D: ...',
    url: 'https://www.youtube.com/embed/...',
    duration: '1:00'
  }
}
```

### 2. Mesh Part ID Integrity Rules
- NEVER use generic or hypothetical part IDs (e.g. `'Heart'`, `'Lung.l'`, `'Aorta'`).
- Always cross-reference `partsData` keys (e.g. `'Left ventricle'`, `'Superior lobe of left lung'`, `'Ascending aorta'`, `'Internal carotid artery.r'`).
- Test each subunit with `selectStructureAnywhere(partId)` to ensure 3D scene response.

### 3. Luxury Navy Blue Palette Compliance
- Primary Header & Badges: `#0f2b5c`, `#0b2559`, `#1e40af`
- Light Background Accents: `#e8f0fe`, `rgba(15, 43, 92, 0.08)`
- Active Ticks & Danger Stages: `#ef4444` (Level 3/4 Critical only)
- Vector SVGs must use dark navy background `#0b192e` or transparent dark canvas with luminescent medical contrast.
