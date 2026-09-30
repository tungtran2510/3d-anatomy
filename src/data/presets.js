// Curated starting points. Each one is just a serialised view, which is what
// makes them free now that the whole state lives in the URL.
export const PRESETS = [
  {
    id: 'skeleton-front',
    label: { vi: 'Hệ Xương', en: 'Skeleton, front', it: 'Scheletro, anteriore' },
    hash: 'sys=skeletal&cam=0,0.86,2.6,0,0.86,0'
  },
  {
    id: 'thigh-muscles',
    label: { vi: 'Cơ Bắp & Xương', en: 'Thigh muscles', it: 'Muscoli della coscia' },
    hash: 'sys=skeletal,muscular&cam=0.15,0.75,1.25,0.05,0.72,0'
  },
  {
    id: 'heart-vessels',
    label: { vi: 'Tim Mạch', en: 'Heart and great vessels', it: 'Cuore e grandi vasi' },
    hash: 'sys=cardiovascular&cam=0,1.28,0.75,0,1.28,0'
  },
  {
    id: 'nervous-spine',
    label: { vi: 'Thần Kinh & Não', en: 'Nervous system', it: 'Sistema nervoso' },
    hash: 'sys=skeletal,nervous&cam=0,1.4,1.2,0,1.4,0'
  }
];

// Applying a preset replaces the whole view, so it goes through the same path
// as opening a shared link.
export function applyPreset(preset) {
  window.location.hash = preset.hash;
  window.location.reload();
}
