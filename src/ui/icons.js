// Medical-grade Modern SVG Vector Icons for Anatomy 3D Atlas
// Replaces obsolete emoji with sharp, professional, scalable vector graphics.

export const ICONS = {
  // Systems Icons (Medical Standard Visual Vector Icons - High Contrast 2.2px Stroke)
  skeletal: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.3 4.8 3.2 6.1v2.4a1.5 1.5 0 0 0 1.5 1.5h5.6a1.5 1.5 0 0 0 1.5-1.5V15.6c1.9-1.3 3.2-3.5 3.2-6.1A7.5 7.5 0 0 0 12 2z"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
      <path d="M12 12.5v1"/>
      <path d="M10 16.5v2M12 16v2.5M14 16.5v2"/>
    </svg>
  `,

  joints: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3.5" fill="currentColor" fill-opacity="0.25"/>
      <path d="M12 2v6.5M12 15.5V22"/>
      <path d="M5 8c2.5 1 5 1 7-1M12 17c2 2 4.5 2 7 1"/>
      <circle cx="12" cy="2" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
    </svg>
  `,

  muscular: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 14c-1.5-1.5-2-4-1-6.5C6 5 8 4 10 5c1 .5 2 1.5 3 1 1.5-1 3.5-.5 4.5.5s1 2.5.5 3.5c1 .5 1.5 1.5 1.5 2.5 0 2-2 3.5-4.5 3.5H9c-1.5 0-2.5-.5-3-2z"/>
      <path d="M10 8.5c1 1 2.5 1 4 0"/>
      <path d="M9 12c1.5 1 3.5 1 5.5 0"/>
    </svg>
  `,

  nervous: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4.5c-2.5-2-6-1.5-7 1.5-1 2.5 0 5 1 6-1.5 1-2 3.5-.5 5 1 1 2.5 1.5 4 .5v3.5h5v-3.5c1.5 1 3 .5 4-.5 1.5-1.5 1-4-.5-5 1-1 2-3.5 1-6-1-3-4.5-3.5-7-1.5z"/>
      <path d="M12 4.5V17M8 9a2 2 0 0 1 2 2M16 9a2 2 0 0 0-2 2"/>
    </svg>
  `,

  cardiovascular: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.5 13.5c1.5-1.5 2.5-3.2 2.5-5.5A5.5 5.5 0 0 0 16.5 2.5c-1.8 0-3 .6-4.5 2.2-1.5-1.6-2.7-2.2-4.5-2.2A5.5 5.5 0 0 0 2 8c0 2.3 1 4 2.5 5.5l7.5 7.5z"/>
      <path d="M3.5 12h3l2-3 3 6 2-3h7"/>
    </svg>
  `,

  arterial: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M12 4v6M9 6l3 2 3-2"/>
      <path d="M12 12v6"/>
    </svg>
  `,

  venous: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(30, 58, 138, 0.35)"/>
      <path d="M12 4v14M8 8l4 4 4-4" stroke="#1e3a8a" stroke-width="2"/>
    </svg>
  `,

  visceral: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
      <path d="M12 4.5v6.5"/>
      <path d="M8.5 7.5c-3 1.5-4.5 5-3.5 8.5 1 3 3.5 5 7 5s6-2 7-5c1-3.5-.5-7-3.5-8.5"/>
      <path d="M9 13.5c1.5 1 4.5 1 6 0"/>
    </svg>
  `,

  respiratory: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v8M10 4h4M9 7h6"/>
      <path d="M12 10c-2.5-1-6 0-7.5 3.5-1.5 3.5-.5 7.5 2 7.5 2.5 0 4.5-2.5 5.5-6.5"/>
      <path d="M12 10c2.5-1 6 0 7.5 3.5 1.5 3.5.5 7.5-2 7.5-2.5 0-4.5-2.5-5.5-6.5"/>
    </svg>
  `,

  digestive: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 2v4"/>
      <path d="M11 6c-3.5 0-6 2.5-6 6.5 0 4.5 3.5 8.5 8 8.5s7-3.5 7-7.5c0-4.5-3.5-6-7-6.5"/>
      <path d="M8 12c1.5 1 4.5 1 6 0M10 16c1.2.8 3.5.8 4.5 0"/>
    </svg>
  `,

  urinary_genital: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 5c-2.5 2-3 5.5-1 8 2 2.5 4.5 1 5-2 .5-2.5-1.5-5-4-6z"/>
      <path d="M17 5c2.5 2 3 5.5 1 8-2 2.5-4.5 1-5-2-.5-2.5 1.5-5 4-6z"/>
      <path d="M9.5 12c0 3 1.5 5 2.5 6.5M14.5 12c0 3-1.5 5-2.5 6.5"/>
      <ellipse cx="12" cy="19.5" rx="2.5" ry="1.5"/>
    </svg>
  `,

  endocrine: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v18"/>
      <path d="M12 8c-3-3-8-2-8 3s4 6 8 2c4 4 8 3 8-2s-5-6-8-3z"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  `,

  lymphatic: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <circle cx="12" cy="11" r="2.5" fill="currentColor" fill-opacity="0.25"/>
      <path d="M12 7v1.5M12 13.5V15M8 11h1.5M14.5 11H16"/>
    </svg>
  `,

  integumentary: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <path d="M3 15h18M3 18h18"/>
      <path d="M8 15c0-4 3.5-5 3.5-11M16 15c0-3 2-4 2.5-7"/>
    </svg>
  `,

  // Affected Region Anatomy Icons (Monochrome minimal silhouettes)
  regionWhole: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="2"/>
      <path d="M9 8h6l1 7h-2v6h-4v-6H8L9 8z"/>
    </svg>
  `,

  regionBack: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="2"/>
      <path d="M9 8h6l1 7h-2v6h-4v-6H8L9 8z"/>
      <path d="M12 8v7"/>
    </svg>
  `,

  regionHead: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7c0 3 1.5 5 3 6.5V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4.5c1.5-1.5 3-3.5 3-6.5a7 7 0 0 0-7-7z"/>
      <circle cx="9.5" cy="10" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="10" r="1" fill="currentColor"/>
    </svg>
  `,

  regionTorso: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3h8l2 5-2 9-4 4-4-4-2-9 2-5z"/>
      <path d="M12 3v17"/>
      <path d="M9 8h6"/>
      <path d="M8 12h8"/>
      <path d="M9 16h6"/>
    </svg>
  `,

  regionPelvis: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c2-2 6-3 8-3s6 1 8 3c0 4-2 7-4 9-2 2-3 4-4 6-1-2-2-4-4-6-2-2-4-5-4-9z"/>
      <circle cx="12" cy="11" r="2.5"/>
    </svg>
  `,

  // View Controls Icons
  viewFront: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
    </svg>
  `,

  viewSide: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  `,

  viewBack: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M21 21v-5h-5"/>
    </svg>
  `,

  viewTop: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </svg>
  `,

  viewReset: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  `,

  // Modern Medical AI Assistant Vector Icon (Neural Sparkle Chip)
  aiSparkle: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
    </svg>
  `,

  // Tools FAB Icon (Layers Stack)
  toolsFab: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  `,

  // Pull Tab Human Anatomy Icon
  humanAnatomy: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="2.5"/>
      <path d="M9 9h6l1 6h-2v7h-4v-7H8L9 9z"/>
      <path d="M19 11v4"/>
      <path d="M17 13h4"/>
    </svg>
  `,

  // Tools Bar Items
  voice: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  `,

  explode: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 5l4 4"/>
      <path d="M19 5l-4 4"/>
      <path d="M5 19l4-4"/>
      <path d="M19 19l-4-4"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,

  labels: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,

  clipping: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  `,

  measure: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.3 8.7 8.7 21.3c-.4.4-1 .4-1.4 0l-4.6-4.6c-.4-.4-.4-1 0-1.4L15.3 2.7c.4-.4 1-.4 1.4 0l4.6 4.6c.4.4.4 1 0 1.4z"/>
      <line x1="14.5" y1="5.5" x2="16.5" y2="7.5"/>
      <line x1="11.5" y1="8.5" x2="14.5" y2="11.5"/>
      <line x1="8.5" y1="11.5" x2="10.5" y2="13.5"/>
      <line x1="5.5" y1="14.5" x2="8.5" y2="17.5"/>
    </svg>
  `,

  motion: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  `,

  study: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  `,

  ar: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  `,

  fullscreen: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
      <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
      <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
      <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
    </svg>
  `,

  fullscreenExit: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14h6v6"/>
      <path d="M20 10h-6V4"/>
      <path d="M14 10l7-7"/>
      <path d="M3 21l7-7"/>
    </svg>
  `,

  crossSection: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <line x1="3.27" y1="6.96" x2="12" y2="12.01"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
      <line x1="20.73" y1="6.96" x2="12" y2="12.01"/>
    </svg>
  `,

  microanatomy: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 18h12"/>
      <path d="M3 22h18"/>
      <path d="m14 2-4 4 6 6 4-4-6-6z"/>
      <path d="m9 7-2 2"/>
      <circle cx="12" cy="14" r="2"/>
    </svg>
  `,

  muscleAction: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  `,

  silhouetteAnterior: `
    <svg width="18" height="24" viewBox="0 0 24 30" fill="currentColor">
      <circle cx="12" cy="3.5" r="2.8"/>
      <path d="M8.5 8h7c.9 0 1.6.8 1.6 1.7v6.8c0 .7-.5 1.2-1.2 1.2h-.4v10c0 .9-.8 1.6-1.7 1.6h-.8c-.9 0-1.6-.7-1.6-1.6v-9h-.8v9c0 .9-.7 1.6-1.6 1.6h-.8c-.9 0-1.7-.7-1.7-1.6v-10h-.4c-.7 0-1.2-.5-1.2-1.2V9.7C6.9 8.8 7.6 8 8.5 8z"/>
    </svg>
  `,

  silhouettePosterior: `
    <svg width="18" height="24" viewBox="0 0 24 30" fill="currentColor">
      <circle cx="12" cy="3.5" r="2.8"/>
      <path d="M8.5 8h7c.9 0 1.6.8 1.6 1.7v6.8c0 .7-.5 1.2-1.2 1.2h-.4v10c0 .9-.8 1.6-1.7 1.6h-.8c-.9 0-1.6-.7-1.6-1.6v-9h-.8v9c0 .9-.7 1.6-1.6 1.6h-.8c-.9 0-1.7-.7-1.7-1.6v-10h-.4c-.7 0-1.2-.5-1.2-1.2V9.7C6.9 8.8 7.6 8 8.5 8z"/>
      <line x1="12" y1="8.5" x2="12" y2="17.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `,

  moreDots: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2.5"/>
      <circle cx="12" cy="12" r="2.5"/>
      <circle cx="19" cy="12" r="2.5"/>
    </svg>
  `,

  pelvisBox: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c2-2 6-3 8-3s6 1 8 3c0 4-2 7-4 9-2 2-3 4-4 6-1-2-2-4-4-6-2-2-4-5-4-9z"/>
      <circle cx="12" cy="11" r="2.5"/>
      <path d="M8 12c1 1.5 2.5 2 4 2s3-.5 4-2"/>
    </svg>
  `,

  genderToggle: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="8" r="3.5"/>
      <path d="M10.5 5.5l4-3M14.5 2.5h-3M14.5 2.5v3"/>
      <circle cx="15" cy="15" r="3.5"/>
      <path d="M15 18.5v4M13 20.5h4"/>
    </svg>
  `,

  humanAnatomyWithPlus: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="4" r="2.2"/>
      <path d="M7 8h6l1 6h-1.5v6.5h-3v-6.5h-1v6.5h-3V14H4L7 8z"/>
      <path d="M19 10v6M16 13h6" stroke-width="2.2"/>
    </svg>
  `
};
