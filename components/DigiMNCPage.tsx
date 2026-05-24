'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Icon system ───────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  'envelope': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'bars': '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  'xmark': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-up-right-from-square': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M15 3h6v6"/><path d="m10 14 11-11"/>',
  'chart-bar': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/><line x1="3" x2="21" y1="20" y2="20"/>',
  'brain': '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
  'chart-line': '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  'cube': '<path d="m21 8-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v9"/>',
  'file-lines': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  'truck-fast': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  'tags': '<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/>',
  'cloud': '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'pills': '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  'cart-shopping': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'industry': '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
  'store': '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',
  'microchip': '<path d="M18 12h2"/><path d="M18 8h2"/><path d="M18 16h2"/><path d="M4 12h2"/><path d="M4 8h2"/><path d="M4 16h2"/><path d="M8 18v2"/><path d="M12 18v2"/><path d="M16 18v2"/><path d="M8 4v2"/><path d="M12 4v2"/><path d="M16 4v2"/><rect width="12" height="12" x="6" y="6" rx="2"/>',
  'lightbulb': '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  'shield-halved': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 22V2"/>',
  'handshake': '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
}

function Icon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const path = ICONS[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: '-0.125em', flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  )
}

// ─── Globe SVG inner content ────────────────────────────────────────────────────
const GLOBE_SVG_INNER = `
<defs>
  <radialGradient id="bgGrad" cx="50%" cy="42%" r="62%">
    <stop offset="0%"   stop-color="#2a5fb8"/>
    <stop offset="100%" stop-color="#0e2a5e"/>
  </radialGradient>
  <radialGradient id="globeGrad" cx="35%" cy="32%" r="70%">
    <stop offset="0%"   stop-color="#2655a8"/>
    <stop offset="100%" stop-color="#0d2655"/>
  </radialGradient>
  <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur stdDeviation="1.4"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="globeClip"><circle cx="300" cy="280" r="140"/></clipPath>
  <path id="ppath1" d="M 300,280 L 300,80"  fill="none" opacity="0"/>
  <path id="ppath2" d="M 300,280 L 80,260"  fill="none" opacity="0"/>
  <path id="ppath3" d="M 300,280 L 520,260" fill="none" opacity="0"/>
  <path id="ppath4" d="M 300,280 L 130,490" fill="none" opacity="0"/>
  <path id="ppath5" d="M 300,280 L 470,490" fill="none" opacity="0"/>
  <path id="orbitPath" d="M 480,280 A 180,60 0 1,1 120,280 A 180,60 0 1,1 480,280" fill="none" opacity="0"/>
</defs>
<rect width="600" height="700" fill="url(#bgGrad)"/>
<g fill="#ffffff">
  <circle cx="35"  cy="45"  r="1.5" opacity="0.3"/>
  <circle cx="85"  cy="120" r="1"   opacity="0.2"/>
  <circle cx="160" cy="55"  r="1.5" opacity="0.4"/>
  <circle cx="220" cy="180" r="1"   opacity="0.15"/>
  <circle cx="40"  cy="200" r="1"   opacity="0.25"/>
  <circle cx="120" cy="320" r="1.5" opacity="0.3"/>
  <circle cx="50"  cy="380" r="1"   opacity="0.2"/>
  <circle cx="180" cy="430" r="1"   opacity="0.18"/>
  <circle cx="100" cy="540" r="1.5" opacity="0.35"/>
  <circle cx="30"  cy="600" r="1"   opacity="0.15"/>
  <circle cx="240" cy="610" r="1"   opacity="0.22"/>
  <circle cx="260" cy="30"  r="1"   opacity="0.18"/>
  <circle cx="320" cy="60"  r="1.5" opacity="0.3"/>
  <circle cx="430" cy="50"  r="1"   opacity="0.2"/>
  <circle cx="500" cy="120" r="1"   opacity="0.25"/>
  <circle cx="560" cy="80"  r="1.5" opacity="0.35"/>
  <circle cx="380" cy="170" r="1"   opacity="0.15"/>
  <circle cx="560" cy="220" r="1"   opacity="0.2"/>
  <circle cx="450" cy="340" r="1"   opacity="0.18"/>
  <circle cx="570" cy="400" r="1.5" opacity="0.3"/>
  <circle cx="510" cy="500" r="1"   opacity="0.22"/>
  <circle cx="380" cy="560" r="1"   opacity="0.18"/>
  <circle cx="560" cy="590" r="1"   opacity="0.25"/>
  <circle cx="80"  cy="270" r="1"   opacity="0.15"/>
  <circle cx="540" cy="280" r="1.2" opacity="0.18"/>
  <circle cx="200" cy="640" r="1"   opacity="0.3"/>
  <circle cx="450" cy="640" r="1"   opacity="0.3"/>
  <circle cx="280" cy="670" r="1.2" opacity="0.18"/>
  <circle cx="190" cy="80"  r="1"   opacity="0.22"/>
  <circle cx="490" cy="180" r="1.2" opacity="0.28"/>
  <circle cx="60"  cy="160" r="1.2" opacity="0.4"/>
  <circle cx="340" cy="450" r="1"   opacity="0.15"/>
  <circle cx="155" cy="380" r="1"   opacity="0.18"/>
  <circle cx="395" cy="375" r="1"   opacity="0.18"/>
  <circle cx="220" cy="250" r="1"   opacity="0.12"/>
  <circle cx="400" cy="230" r="1"   opacity="0.12"/>
  <circle cx="135" cy="155" r="0.8" opacity="0.18"/>
  <circle cx="465" cy="150" r="0.8" opacity="0.18"/>
  <circle cx="245" cy="540" r="0.8" opacity="0.2"/>
  <circle cx="365" cy="540" r="0.8" opacity="0.2"/>
</g>
<circle cx="300" cy="280" r="158" fill="none" stroke="#4d8ee8" stroke-opacity="0.28" stroke-width="1"/>
<circle cx="300" cy="280" r="178" fill="none" stroke="#00c2cb" stroke-opacity="0.16" stroke-width="1"/>
<g class="globe-group">
  <circle cx="300" cy="280" r="140" fill="url(#globeGrad)"/>
  <g stroke="#5ba0ed" stroke-opacity="0.45" fill="none" stroke-width="0.8">
    <line x1="161" y1="280" x2="439" y2="280"/>
    <ellipse cx="300" cy="280" rx="135" ry="48"/>
    <ellipse cx="300" cy="280" rx="125" ry="86"/>
    <ellipse cx="300" cy="280" rx="110" ry="112"/>
    <ellipse cx="300" cy="280" rx="140" ry="140"/>
  </g>
  <g stroke="#5ba0ed" stroke-opacity="0.45" fill="none" stroke-width="0.8">
    <animateTransform attributeName="transform" type="rotate" from="0 300 280" to="360 300 280" dur="30s" repeatCount="indefinite"/>
    <line x1="300" y1="140" x2="300" y2="420"/>
    <ellipse cx="300" cy="280" rx="28"  ry="140"/>
    <ellipse cx="300" cy="280" rx="62"  ry="140"/>
    <ellipse cx="300" cy="280" rx="95"  ry="140"/>
    <ellipse cx="300" cy="280" rx="125" ry="140"/>
  </g>
  <g clip-path="url(#globeClip)" fill="#6cb2f5" opacity="0.55">
    <path d="M 195,215 Q 218,205 245,212 Q 255,225 250,242 Q 235,253 215,250 Q 195,245 188,232 Z"/>
    <path d="M 242,275 Q 258,272 262,290 Q 258,322 248,348 Q 240,355 235,335 Q 232,310 238,290 Z"/>
    <path d="M 290,225 Q 312,220 326,232 Q 322,246 305,246 Q 290,243 286,234 Z"/>
    <path d="M 305,255 Q 326,254 338,272 Q 340,300 325,322 Q 312,322 305,300 Q 302,278 305,255 Z"/>
    <path d="M 332,212 Q 372,208 402,222 Q 405,242 380,248 Q 350,243 335,232 Z"/>
    <path d="M 372,318 Q 398,316 405,332 Q 395,348 370,342 Z"/>
  </g>
  <path d="M 300,140 A 140,140 0 0,0 300,420 Z" fill="#0a1c40" opacity="0.22"/>
</g>
<g transform="translate(300 280)">
  <circle r="140" fill="none" stroke="#00c2cb" stroke-width="1.5" opacity="0.45">
    <animateTransform attributeName="transform" type="scale" values="1;1.8" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.45;0" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle r="140" fill="none" stroke="#00c2cb" stroke-width="1.5" opacity="0">
    <animateTransform attributeName="transform" type="scale" values="1;1.8" dur="3s" begin="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.45;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
  </circle>
</g>
<ellipse cx="300" cy="280" rx="180" ry="60" fill="none" stroke="#00c2cb" stroke-opacity="0.55" stroke-width="1"/>
<circle r="4" fill="#00c2cb" filter="url(#dotGlow)">
  <animateMotion dur="12s" repeatCount="indefinite"><mpath href="#orbitPath"/></animateMotion>
</circle>
<g>
  <line x1="300" y1="280" x2="300" y2="80" stroke="#00c2cb" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="300" y1="280" x2="80" y2="260" stroke="#00c2cb" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="300" y1="280" x2="520" y2="260" stroke="#00c2cb" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="300" y1="280" x2="130" y2="490" stroke="#00c2cb" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="300" y1="280" x2="470" y2="490" stroke="#00c2cb" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
  </line>
</g>
<g>
  <circle r="3.5" fill="#00c2cb" filter="url(#dotGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#ppath1"/></animateMotion></circle>
  <circle r="3.5" fill="#00c2cb" filter="url(#dotGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.4s"><mpath href="#ppath2"/></animateMotion></circle>
  <circle r="3.5" fill="#00c2cb" filter="url(#dotGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.8s"><mpath href="#ppath3"/></animateMotion></circle>
  <circle r="3.5" fill="#00c2cb" filter="url(#dotGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.2s"><mpath href="#ppath4"/></animateMotion></circle>
  <circle r="3.5" fill="#00c2cb" filter="url(#dotGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.6s"><mpath href="#ppath5"/></animateMotion></circle>
</g>
<g transform="translate(95 405)">
  <animateTransform attributeName="transform" type="translate" values="95,405; 95,401; 95,405" dur="4s" repeatCount="indefinite"/>
  <g fill="#3a8fd9" opacity="0.78">
    <rect x="32" y="10" width="58" height="22" rx="2"/>
    <path d="M 0 16 L 32 16 L 32 32 L 0 32 Z"/>
    <path d="M 0 16 L 12 10 L 32 10 L 32 16 Z"/>
    <rect x="3" y="13" width="9" height="5" fill="#0a1628" opacity="0.7"/>
  </g>
  <g fill="#0a1c40"><circle cx="10" cy="35" r="5"/><circle cx="46" cy="35" r="5"/><circle cx="78" cy="35" r="5"/></g>
  <g fill="#00c2cb" opacity="0.7"><circle cx="10" cy="35" r="2"/><circle cx="46" cy="35" r="2"/><circle cx="78" cy="35" r="2"/></g>
</g>
<g transform="translate(405 410)">
  <animateTransform attributeName="transform" type="translate" values="405,410; 405,406; 405,410" dur="5s" repeatCount="indefinite"/>
  <g fill="#3a8fd9" opacity="0.78">
    <path d="M 4 26 L 96 26 L 90 40 L 10 40 Z"/>
    <rect x="12" y="11" width="78" height="15"/>
    <rect x="72" y="2" width="16" height="11"/>
  </g>
  <g fill="#0a1628">
    <rect x="16" y="14" width="11" height="9"/>
    <rect x="29" y="14" width="11" height="9"/>
    <rect x="42" y="14" width="11" height="9"/>
    <rect x="55" y="14" width="11" height="9"/>
  </g>
</g>
<g transform="translate(440 80)">
  <animateTransform attributeName="transform" type="translate" values="440,80; 460,70; 440,80" dur="8s" repeatCount="indefinite"/>
  <g fill="#3a8fd9" opacity="0.82">
    <path d="M 4 15 Q 14 13 56 13 L 60 15 L 56 17 Q 14 17 4 15 Z"/>
    <path d="M 22 13 L 18 4 L 28 4 L 32 13 Z"/>
    <path d="M 22 17 L 18 26 L 28 26 L 32 17 Z"/>
    <path d="M 48 13 L 46 6 L 52 6 L 54 13 Z"/>
  </g>
</g>
<g transform="translate(240 420)">
  <rect width="120" height="80" rx="8" fill="#0d2655" stroke="#4d8ee8" stroke-width="1.2"/>
  <text x="10" y="16" font-family="Poppins" font-size="9" font-weight="600" fill="#ffffff" letter-spacing="1.5">ERP</text>
  <circle cx="110" cy="13" r="2" fill="#00c2cb"/>
  <g stroke="rgba(255,255,255,0.06)" stroke-width="0.5">
    <line x1="10" y1="40" x2="110" y2="40"/>
    <line x1="10" y1="55" x2="110" y2="55"/>
    <line x1="10" y1="70" x2="110" y2="70"/>
  </g>
  <g>
    <rect x="14" y="50" width="14" height="20" fill="#3a8fd9" rx="2">
      <animate attributeName="height" values="0;20;20" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="70;50;50" dur="2s" repeatCount="indefinite"/>
    </rect>
    <rect x="34" y="38" width="14" height="32" fill="#00c2cb" rx="2">
      <animate attributeName="height" values="0;32;32" dur="2s" begin="0.15s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="70;38;38" dur="2s" begin="0.15s" repeatCount="indefinite"/>
    </rect>
    <rect x="54" y="30" width="14" height="40" fill="#3a8fd9" rx="2">
      <animate attributeName="height" values="0;40;40" dur="2s" begin="0.3s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="70;30;30" dur="2s" begin="0.3s" repeatCount="indefinite"/>
    </rect>
    <rect x="74" y="45" width="14" height="25" fill="#00c2cb" rx="2">
      <animate attributeName="height" values="0;25;25" dur="2s" begin="0.45s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="70;45;45" dur="2s" begin="0.45s" repeatCount="indefinite"/>
    </rect>
    <rect x="94" y="35" width="14" height="35" fill="#3a8fd9" rx="2">
      <animate attributeName="height" values="0;35;35" dur="2s" begin="0.6s" repeatCount="indefinite"/>
      <animate attributeName="y"      values="70;35;35" dur="2s" begin="0.6s" repeatCount="indefinite"/>
    </rect>
  </g>
</g>
`

// ─── Why-Choose SVG inner content ────────────────────────────────────────────────
const WHY_SVG_INNER = `
<defs>
  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#00c2cb" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="#0066cc" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="480" height="360" fill="url(#centerGlow)" opacity="0.6"/>
<g stroke="rgba(0,194,203,0.15)" stroke-width="1" fill="none">
  <line x1="240" y1="180" x2="100" y2="80"/><line x1="240" y1="180" x2="380" y2="80"/>
  <line x1="240" y1="180" x2="100" y2="280"/><line x1="240" y1="180" x2="380" y2="280"/>
  <line x1="240" y1="180" x2="240" y2="50"/><line x1="240" y1="180" x2="240" y2="310"/>
</g>
<circle cx="240" cy="180" r="140" fill="none" stroke="rgba(0,102,204,0.25)" stroke-width="1" stroke-dasharray="3 5"/>
<circle cx="240" cy="180" r="100" fill="none" stroke="rgba(0,194,203,0.2)" stroke-width="1" stroke-dasharray="2 4"/>
<circle cx="240" cy="180" r="50" fill="#0d2347"/>
<circle cx="240" cy="180" r="50" fill="none" stroke="#00c2cb" stroke-width="2"/>
<g transform="translate(220 160)">
  <g fill="#00c2cb">
    <circle cx="6"  cy="6"  r="2.5"/><circle cx="20" cy="6"  r="2.5"/><circle cx="34" cy="6"  r="2.5"/>
    <circle cx="6"  cy="20" r="2.5"/><circle cx="20" cy="20" r="2.5"/><circle cx="34" cy="20" r="2.5"/>
    <circle cx="6"  cy="34" r="2.5"/><circle cx="20" cy="34" r="2.5"/><circle cx="34" cy="34" r="2.5"/>
  </g>
</g>
<g>
  <circle cx="100" cy="80" r="32" fill="#0d2347" stroke="#0066cc" stroke-width="1.5"/>
  <g transform="translate(82 64)" fill="#0066cc">
    <circle cx="11" cy="6" r="4"/><path d="M 4 19 Q 11 12 18 19 L 18 22 L 4 22 Z"/>
    <circle cx="25" cy="8" r="3"/><path d="M 20 19 Q 25 14 30 19 L 30 21 L 20 21 Z"/>
  </g>
  <circle cx="380" cy="80" r="32" fill="#0d2347" stroke="#00c2cb" stroke-width="1.5"/>
  <g transform="translate(362 64)" fill="#00c2cb">
    <rect x="2"  y="18" width="6" height="14" rx="1"/><rect x="12" y="10" width="6" height="22" rx="1"/>
    <rect x="22" y="14" width="6" height="18" rx="1"/><rect x="32" y="4"  width="6" height="28" rx="1"/>
  </g>
  <circle cx="100" cy="280" r="32" fill="#0d2347" stroke="#00c2cb" stroke-width="1.5"/>
  <g transform="translate(82 262)" fill="#00c2cb">
    <path d="M 18 6 L 20 6 L 21 9 L 24 7 L 26 9 L 24 12 L 27 13 L 27 17 L 24 18 L 26 21 L 24 23 L 21 21 L 20 24 L 18 24 L 17 21 L 14 23 L 12 21 L 14 18 L 11 17 L 11 13 L 14 12 L 12 9 L 14 7 L 17 9 Z"/>
    <circle cx="19" cy="15" r="4" fill="#0d2347"/>
  </g>
  <circle cx="380" cy="280" r="32" fill="#0d2347" stroke="#0066cc" stroke-width="1.5"/>
  <g transform="translate(362 264)" fill="#0066cc">
    <path d="M 4 12 L 12 4 L 18 8 L 24 4 L 32 12 L 28 20 L 22 18 L 18 22 L 14 18 L 8 20 Z"/>
  </g>
  <circle cx="240" cy="50" r="22" fill="#0d2347" stroke="#0066cc" stroke-width="1.5"/>
  <g transform="translate(232 38)" fill="#00c2cb">
    <path d="M 8 1 Q 14 1 14 7 Q 14 11 11 14 L 11 18 L 5 18 L 5 14 Q 2 11 2 7 Q 2 1 8 1 Z"/>
    <rect x="5" y="19" width="6" height="2"/><rect x="6" y="22" width="4" height="1.5"/>
  </g>
  <circle cx="240" cy="310" r="22" fill="#0d2347" stroke="#00c2cb" stroke-width="1.5"/>
  <g transform="translate(228 298)" fill="#00c2cb">
    <path d="M 12 2 L 22 7 L 22 17 L 12 22 L 2 17 L 2 7 Z" fill="none" stroke="#00c2cb" stroke-width="1.5"/>
    <path d="M 12 2 L 12 12 L 2 7 M 12 12 L 22 7 M 12 12 L 12 22" stroke="#00c2cb" stroke-width="1.2" fill="none"/>
  </g>
</g>
<g fill="#00c2cb">
  <circle cx="160" cy="130" r="2"/><circle cx="320" cy="130" r="2"/>
  <circle cx="160" cy="230" r="2"/><circle cx="320" cy="230" r="2"/>
</g>
`

// ─── Supply Chain SVG inner content ──────────────────────────────────────────────
const SC_SVG_INNER = `
<defs>
  <radialGradient id="sc-glow" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#2655a8" stop-opacity="0.45"/>
    <stop offset="100%" stop-color="#0a1628" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="sc-route" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#00c2cb" stop-opacity="0"/>
    <stop offset="0.5" stop-color="#00c2cb" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#00c2cb" stop-opacity="0"/>
  </linearGradient>
  <filter id="sc-dotglow" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur stdDeviation="2"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <path id="sc-routePath" d="M 100,420 Q 250,360 400,400 T 700,300" fill="none"/>
</defs>
<rect width="800" height="600" fill="url(#sc-glow)"/>
<g stroke="#3a8fd9" stroke-opacity="0.10" stroke-width="0.6" fill="none">
  <line x1="0" y1="100" x2="800" y2="100"/><line x1="0" y1="200" x2="800" y2="200"/>
  <line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="400" x2="800" y2="400"/>
  <line x1="0" y1="500" x2="800" y2="500"/>
  <line x1="120" y1="0" x2="120" y2="600"/><line x1="280" y1="0" x2="280" y2="600"/>
  <line x1="440" y1="0" x2="440" y2="600"/><line x1="600" y1="0" x2="600" y2="600"/>
  <line x1="760" y1="0" x2="760" y2="600"/>
</g>
<g fill="#ffffff">
  <circle cx="80" cy="80" r="1.5" opacity="0.35"/><circle cx="240" cy="60" r="1" opacity="0.22"/>
  <circle cx="430" cy="40" r="1.5" opacity="0.3"/><circle cx="600" cy="90" r="1" opacity="0.25"/>
  <circle cx="730" cy="50" r="1.5" opacity="0.4"/><circle cx="160" cy="160" r="1" opacity="0.2"/>
  <circle cx="520" cy="150" r="1" opacity="0.28"/><circle cx="690" cy="170" r="1.5" opacity="0.25"/>
  <circle cx="70" cy="540" r="1" opacity="0.18"/><circle cx="380" cy="540" r="1.5" opacity="0.3"/>
  <circle cx="740" cy="500" r="1" opacity="0.2"/>
</g>
<path d="M 100,420 Q 250,360 400,400 T 700,300" fill="none" stroke="#00c2cb" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="6 8" stroke-linecap="round">
  <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="2s" repeatCount="indefinite"/>
</path>
<path d="M 100,420 Q 250,360 400,400 T 700,300" fill="none" stroke="url(#sc-route)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
<g filter="url(#sc-dotglow)">
  <circle r="5" fill="#00c2cb"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#sc-routePath"/></animateMotion></circle>
</g>
<g filter="url(#sc-dotglow)">
  <circle r="4" fill="#5ba0ed"><animateMotion dur="6s" begin="2s" repeatCount="indefinite"><mpath href="#sc-routePath"/></animateMotion></circle>
</g>
<g filter="url(#sc-dotglow)">
  <circle r="4" fill="#ffffff" opacity="0.85"><animateMotion dur="6s" begin="4s" repeatCount="indefinite"><mpath href="#sc-routePath"/></animateMotion></circle>
</g>
<g transform="translate(60 360)">
  <rect x="0" y="20" width="100" height="60" rx="3" fill="#0d2655" stroke="#4d8ee8" stroke-width="1.5"/>
  <polygon points="0,20 50,0 100,20" fill="#1a3d7a" stroke="#4d8ee8" stroke-width="1.5"/>
  <rect x="12" y="45" width="22" height="35" rx="1" fill="#0a1628" stroke="#3a8fd9" stroke-width="1"/>
  <rect x="40" y="45" width="22" height="35" rx="1" fill="#0a1628" stroke="#3a8fd9" stroke-width="1"/>
  <rect x="68" y="45" width="22" height="35" rx="1" fill="#0a1628" stroke="#3a8fd9" stroke-width="1"/>
  <line x1="14" y1="62" x2="32" y2="62" stroke="#00c2cb" stroke-opacity="0.5" stroke-width="0.6"/>
  <line x1="42" y1="62" x2="60" y2="62" stroke="#00c2cb" stroke-opacity="0.5" stroke-width="0.6"/>
  <line x1="70" y1="62" x2="88" y2="62" stroke="#00c2cb" stroke-opacity="0.5" stroke-width="0.6"/>
  <line x1="50" y1="0" x2="50" y2="-12" stroke="#00c2cb" stroke-width="1"/>
  <circle cx="50" cy="-14" r="3" fill="#00c2cb"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite"/></circle>
  <text x="50" y="100" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="600" fill="#ffffff" letter-spacing="1.5">WAREHOUSE</text>
  <text x="50" y="115" text-anchor="middle" font-family="Poppins, sans-serif" font-size="9" fill="#00c2cb" letter-spacing="1">ORIGIN</text>
</g>
<g transform="translate(360 350)">
  <circle r="56" fill="none" stroke="#00c2cb" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="3 5"/>
  <circle r="38" fill="#0d2655" stroke="#00c2cb" stroke-width="2"/>
  <g stroke="#00c2cb" stroke-width="1.6" fill="none">
    <path d="M 0,-14 L 14,-7 L 14,7 L 0,14 L -14,7 L -14,-7 Z"/>
    <path d="M 0,-14 L 0,0"/><path d="M -14,-7 L 0,0"/><path d="M 14,-7 L 0,0"/>
  </g>
  <circle r="38" fill="none" stroke="#00c2cb" stroke-width="1.5" opacity="0.5">
    <animate attributeName="r" values="38;58;38" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
  </circle>
  <text x="0" y="84" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="600" fill="#ffffff" letter-spacing="1.5">DISTRIBUTION HUB</text>
  <text x="0" y="98" text-anchor="middle" font-family="Poppins, sans-serif" font-size="9" fill="#00c2cb" letter-spacing="1">REAL-TIME</text>
</g>
<g transform="translate(640 250)">
  <rect x="0" y="20" width="90" height="65" rx="3" fill="#0d2655" stroke="#4d8ee8" stroke-width="1.5"/>
  <path d="M -4,20 L 94,20 L 88,8 L 2,8 Z" fill="#1a3d7a" stroke="#4d8ee8" stroke-width="1.5"/>
  <g stroke="#00c2cb" stroke-opacity="0.5" stroke-width="0.6">
    <line x1="12" y1="8" x2="14" y2="20"/><line x1="28" y1="8" x2="29" y2="20"/>
    <line x1="45" y1="8" x2="45" y2="20"/><line x1="62" y1="8" x2="61" y2="20"/>
    <line x1="78" y1="8" x2="76" y2="20"/>
  </g>
  <rect x="10" y="30" width="32" height="32" rx="1" fill="#0a1628" stroke="#3a8fd9" stroke-width="1"/>
  <line x1="26" y1="30" x2="26" y2="62" stroke="#3a8fd9" stroke-width="0.8"/>
  <line x1="10" y1="46" x2="42" y2="46" stroke="#3a8fd9" stroke-width="0.8"/>
  <rect x="52" y="42" width="20" height="43" rx="1" fill="#0a1628" stroke="#3a8fd9" stroke-width="1"/>
  <circle cx="67" cy="63" r="1" fill="#00c2cb"/>
  <text x="45" y="105" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="600" fill="#ffffff" letter-spacing="1.5">DELIVERY</text>
  <text x="45" y="120" text-anchor="middle" font-family="Poppins, sans-serif" font-size="9" fill="#00c2cb" letter-spacing="1">DESTINATION</text>
</g>
<g transform="translate(280 90)">
  <rect x="0" y="0" width="240" height="80" rx="10" fill="#0d2655" stroke="#4d8ee8" stroke-opacity="0.6" stroke-width="1.2"/>
  <text x="14" y="20" font-family="Poppins, sans-serif" font-size="9" font-weight="600" fill="#ffffff" letter-spacing="1.5">LIVE TRACKING</text>
  <circle cx="222" cy="17" r="3" fill="#00c2cb"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite"/></circle>
  <text x="208" y="20" text-anchor="end" font-family="Poppins, sans-serif" font-size="8" fill="#00c2cb" letter-spacing="1">ACTIVE</text>
  <g stroke="rgba(255,255,255,0.08)" stroke-width="0.5">
    <line x1="14" y1="60" x2="226" y2="60"/><line x1="14" y1="48" x2="226" y2="48"/><line x1="14" y1="36" x2="226" y2="36"/>
  </g>
  <polyline points="14,55 40,48 66,52 92,40 118,44 144,32 170,38 196,28 222,34" fill="none" stroke="#00c2cb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="14,55 40,48 66,52 92,40 118,44 144,32 170,38 196,28 222,34" fill="none" stroke="#00c2cb" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.15"/>
  <g font-family="Poppins, sans-serif" font-size="8" letter-spacing="0.5">
    <text x="14" y="76" fill="rgba(255,255,255,0.55)">ETA · 14:32</text>
    <text x="100" y="76" fill="rgba(255,255,255,0.55)">UNITS · 1,284</text>
    <text x="190" y="76" fill="#00c2cb">ON TRACK</text>
  </g>
</g>
<g>
  <g>
    <animateMotion dur="6s" repeatCount="indefinite" rotate="auto"><mpath href="#sc-routePath"/></animateMotion>
    <g transform="translate(-22 -10)">
      <rect x="0" y="0" width="32" height="14" rx="1.5" fill="#3a8fd9"/>
      <rect x="32" y="3" width="10" height="11" rx="1.5" fill="#3a8fd9"/>
      <rect x="34" y="5" width="6" height="4" fill="#0a1628"/>
      <circle cx="6"  cy="16" r="2.6" fill="#0a1628"/><circle cx="22" cy="16" r="2.6" fill="#0a1628"/><circle cx="38" cy="16" r="2.6" fill="#0a1628"/>
      <circle cx="6"  cy="16" r="1.1" fill="#00c2cb"/><circle cx="22" cy="16" r="1.1" fill="#00c2cb"/><circle cx="38" cy="16" r="1.1" fill="#00c2cb"/>
    </g>
  </g>
</g>
<g transform="translate(180 480)" opacity="0.85">
  <rect x="0" y="0" width="24" height="20" fill="#3a8fd9" stroke="#5ba0ed" stroke-width="0.8" rx="1"/>
  <rect x="26" y="-4" width="24" height="20" fill="#3a8fd9" stroke="#5ba0ed" stroke-width="0.8" rx="1"/>
  <rect x="13" y="-22" width="24" height="20" fill="#3a8fd9" stroke="#5ba0ed" stroke-width="0.8" rx="1"/>
  <line x1="6" y1="8" x2="18" y2="8" stroke="#0a1628" stroke-width="1"/>
  <line x1="32" y1="4" x2="44" y2="4" stroke="#0a1628" stroke-width="1"/>
  <line x1="19" y1="-14" x2="31" y2="-14" stroke="#0a1628" stroke-width="1"/>
</g>
<g opacity="0.7">
  <g transform="translate(540 130)">
    <animateTransform attributeName="transform" type="translate" values="540,130; 580,115; 540,130" dur="9s" repeatCount="indefinite"/>
    <g fill="#5ba0ed">
      <path d="M 0,8 Q 6,6 36,6 L 40,8 L 36,10 Q 6,10 0,8 Z"/>
      <path d="M 14,6 L 12,0 L 19,0 L 22,6 Z"/><path d="M 14,10 L 12,16 L 19,16 L 22,10 Z"/>
      <path d="M 30,6 L 29,2 L 33,2 L 34,6 Z"/>
    </g>
  </g>
</g>
<g transform="translate(28 552)" opacity="0.5">
  <rect width="60" height="24" rx="4" fill="#0d2655" stroke="#3a8fd9" stroke-width="0.8"/>
  <text x="30" y="16" text-anchor="middle" font-family="Poppins, sans-serif" font-size="9" font-weight="600" fill="#00c2cb" letter-spacing="1.5">DIGIMNC</text>
</g>
`

// ─── Types ────────────────────────────────────────────────────────────────────
type SectionId = 'home' | 'about' | 'services' | 'cases' | 'contact'

// ─── Main component ───────────────────────────────────────────────────────────
export default function DigiMNCPage() {
  const [section, setSection] = useState<SectionId>('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const gsapCtxRef = useRef<gsap.Context | null>(null)

  const goTo = useCallback((id: SectionId, anchor?: string) => {
    setSection(id)
    setMobileOpen(false)
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor)
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 88
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (history.replaceState) history.replaceState({}, '', '#' + id)
  }, [])

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Hash routing on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as SectionId
    if (['home', 'about', 'services', 'cases', 'contact'].includes(hash)) {
      setSection(hash)
    }
  }, [])

  // GSAP animations per section
  useEffect(() => {
    if (gsapCtxRef.current) gsapCtxRef.current.revert()

    const ctx = gsap.context(() => {
      // Set initial hidden state for all reveal elements
      gsap.set('.reveal', { opacity: 0, y: 20 })

      // ScrollTrigger reveal for every .reveal element
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        const d = parseFloat(el.getAttribute('data-d') || '0')
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: d * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        })
      })

      // KPI counters — home only
      if (section === 'home') {
        document.querySelectorAll<HTMLElement>('.hg-kpi-num').forEach(el => {
          const target = parseFloat(el.getAttribute('data-target') || '0')
          const suffix = el.getAttribute('data-suffix') || ''
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            delay: 1.2,
            onUpdate() {
              el.textContent = Math.round(obj.val) + suffix
            },
          })
        })

        // Extra: subtle float animation on hero-graphic
        gsap.to('.hero-graphic', {
          y: -8,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.5,
        })
      }
    })

    gsapCtxRef.current = ctx
    return () => ctx.revert()
  }, [section])

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const parent = (e.currentTarget as HTMLElement).closest('.svc-image')
    if (parent) parent.classList.add('no-image')
  }

  return (
    <>
      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container">
          <div className="nav-row">
            <div className="logo" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
              <div className="logo-mark" aria-hidden="true">
                <span /><span /><span />
                <span className="b" /><span /><span />
                <span /><span /><span />
              </div>
              <div className="logo-text">
                <span className="logo-wordmark"><span className="digi">DIGI</span><span className="mnc">MNC</span></span>
                <span className="logo-tag">Digital Marketing &amp; Consulting</span>
              </div>
            </div>

            <ul className="nav-links">
              {(['home', 'about', 'services', 'cases', 'contact'] as SectionId[]).map((id) => (
                <li
                  key={id}
                  className={`nav-link${section === id ? ' active' : ''}`}
                  data-nav={id}
                  onClick={() => goTo(id)}
                >
                  {id === 'home' ? 'Home' : id === 'about' ? 'About Us' : id === 'services' ? 'Services' : id === 'cases' ? 'Case Studies' : 'Contact Us'}
                </li>
              ))}
            </ul>

            <a className="nav-cta" href="mailto:maheshwari.ashu@gmail.com" aria-label="Email DIGIMNC">
              <Icon name="envelope" />
              maheshwari.ashu@gmail.com
            </a>

            <button className="burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Icon name="bars" />
            </button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE MENU ═════════════════════════════════════════════════════ */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} id="mobileMenu">
        <button className="close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <Icon name="xmark" />
        </button>
        <a onClick={() => goTo('home')}>Home</a>
        <a onClick={() => goTo('about')}>About Us</a>
        <a onClick={() => goTo('services')}>Services</a>
        <a onClick={() => goTo('cases')}>Case Studies</a>
        <a onClick={() => goTo('contact')}>Contact Us</a>
        <a className="mob-cta" href="mailto:maheshwari.ashu@gmail.com">
          <Icon name="envelope" style={{ marginRight: 8 }} /> Email Us
        </a>
      </div>

      {/* ══ MAIN ════════════════════════════════════════════════════════════ */}
      <main id="main">

        {/* ── HOME ──────────────────────────────────────────────────────── */}
        {section === 'home' && (
          <section className="page active" id="home">

            {/* HERO */}
            <div className="hero">
              <div className="container">
                <div className="hero-grid">
                  <div className="hero-text">
                    <span className="eyebrow-teal reveal">
                      <span style={{ fontSize: 17, color: 'rgb(246,246,246)' }}>
                        DIGIMNC — Digital Transformation for Modern Supply Chains
                      </span>
                    </span>
                    <h1 className="reveal" data-d="1">
                      Smart Technology. Connected Supply Chains. Faster Business Outcomes.
                    </h1>
                    <p className="sub reveal" data-d="2">
                      We deliver end-to-end technology solutions across Supply Chain, SAP &amp; ERP,
                      Labeling, AI, Corporate Finance, Travel &amp; Expense, and Data Analytics — built
                      to help businesses operate smarter and grow faster.
                    </p>
                    <div className="hero-actions reveal" data-d="3">
                      <button className="btn-primary" onClick={() => goTo('contact')}>
                        Contact Us <Icon name="arrow-right" className="arr" />
                      </button>
                      <a className="hero-email" href="mailto:maheshwari.ashu@gmail.com">
                        <Icon name="envelope" /> maheshwari.ashu@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="hero-graphic reveal" data-d="2" aria-hidden="true">
                    {/* Globe SVG */}
                    <svg
                      className="scene"
                      viewBox="0 0 600 700"
                      preserveAspectRatio="xMidYMid meet"
                      dangerouslySetInnerHTML={{ __html: GLOBE_SVG_INNER }}
                    />

                    {/* Bubbles */}
                    <div className="hg-bubble b1">
                      <div className="ball"><Icon name="chart-bar" /></div>
                      <div className="lbl">SAP &amp; ERP</div>
                    </div>
                    <div className="hg-bubble b2">
                      <div className="ball"><Icon name="brain" /></div>
                      <div className="lbl">AI-Driven<br />Solutions</div>
                    </div>
                    <div className="hg-bubble b3">
                      <div className="ball"><Icon name="chart-line" /></div>
                      <div className="lbl">Data<br />Analytics</div>
                    </div>
                    <div className="hg-bubble b4">
                      <div className="ball"><Icon name="cube" /></div>
                      <div className="lbl">Supply<br />Chain</div>
                    </div>
                    <div className="hg-bubble b5">
                      <div className="ball"><Icon name="file-lines" /></div>
                      <div className="lbl">Labeling &amp;<br />Artwork</div>
                    </div>

                    {/* KPI counters */}
                    <div className="hg-kpi">
                      <div className="hg-kpi-card">
                        <div className="hg-kpi-num" data-target="500" data-suffix="+">0</div>
                        <div className="hg-kpi-label">Supply Chain<br />Nodes</div>
                      </div>
                      <div className="hg-kpi-card">
                        <div className="hg-kpi-num" data-target="98" data-suffix="%">0</div>
                        <div className="hg-kpi-label">On-Time<br />Delivery Rate</div>
                      </div>
                      <div className="hg-kpi-card">
                        <div className="hg-kpi-num" data-target="5" data-suffix="+">0</div>
                        <div className="hg-kpi-label">Years of<br />Expertise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES GRID */}
            <div className="section section-white">
              <div className="container">
                <div className="section-head reveal">
                  <span className="section-eyebrow">Our Services</span>
                  <h2 className="section-title">Comprehensive Solutions to Transform Your Business</h2>
                  <div className="section-underline" />
                </div>
                <div className="services-grid">
                  {[
                    { icon: 'truck-fast', title: 'End-to-End Supply Chain Solutions', desc: 'Design, optimize, and digitize supply chain processes from planning to execution.', target: 'supply-chain', d: '1' },
                    { icon: 'database', title: 'SAP & ERP Consulting', desc: 'Implementation, support, integration, process improvement, master data, and reporting.', target: 'sap', d: '2' },
                    { icon: 'tags', title: 'Labeling & Artwork Management', desc: 'Digital solutions for labeling, packaging artwork workflows, compliance, and approvals.', target: 'labeling', d: '3' },
                    { icon: 'brain', title: 'AI-Driven Business Solutions', desc: 'AI-powered automation, forecasting, document processing, and decision support.', target: 'ai', d: '1' },
                    { icon: 'chart-line', title: 'Data Analytics & Dashboards', desc: 'Business intelligence, KPI dashboards, data quality, and reporting automation.', target: 'analytics', d: '2' },
                    { icon: 'cloud', title: 'IT Services & Digital Transformation', desc: 'Application support, SaaS deployment, system integration, and technology roadmap.', target: 'it', d: '3' },
                  ].map(({ icon, title, desc, target, d }) => (
                    <div key={target} className="svc-card reveal" data-d={d} onClick={() => goTo('services', target)}>
                      <span className="icon"><Icon name={icon} /></span>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                      <span className="learn-more">Learn more <Icon name="arrow-right" /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WHY CHOOSE */}
            <div className="section section-light">
              <div className="container">
                <div className="why">
                  <div className="why-visual reveal" aria-hidden="true">
                    <svg
                      viewBox="0 0 480 360"
                      preserveAspectRatio="xMidYMid meet"
                      dangerouslySetInnerHTML={{ __html: WHY_SVG_INNER }}
                    />
                  </div>
                  <div className="why-content reveal" data-d="1">
                    <h2>Why Choose <span className="accent">DIGIMNC</span>?</h2>
                    <ul className="why-list">
                      {[
                        'End-to-end business and technology expertise',
                        'Deep experience in ERP, SAP, and Supply Chain',
                        'AI and analytics-driven approach',
                        'Practical, scalable, and future-ready solutions',
                        'Focus on measurable business outcomes',
                      ].map((item) => (
                        <li key={item}><span className="check-icon"><Icon name="check" /></span> {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* INDUSTRIES */}
            <div className="section section-white">
              <div className="container">
                <div className="section-head reveal">
                  <span className="section-eyebrow">Industries We Serve</span>
                  <div className="section-underline" style={{ marginTop: 18 }} />
                </div>
                <div className="industries">
                  {([
                    { icon: 'pills', label1: 'Pharma &', label2: 'Life Sciences', d: '1' },
                    { icon: 'cart-shopping', label1: 'Consumer', label2: 'Goods', d: '2' },
                    { icon: 'industry', label1: 'Manufacturing', label2: '', d: '3' },
                    { icon: 'store', label1: 'Retail &', label2: 'Distribution', d: '4' },
                    { icon: 'microchip', label1: 'Technology', label2: 'Services', d: '4' },
                  ] as { icon: string; label1: string; label2: string; d: string }[]).map(({ icon, label1, label2, d }) => (
                    <div key={icon} className="ind-item reveal" data-d={d}>
                      <span className="ind-icon"><Icon name={icon} /></span>
                      <span className="ind-label">{label1}{label2 ? <><br />{label2}</> : null}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── ABOUT ─────────────────────────────────────────────────────── */}
        {section === 'about' && (
          <section className="page active" id="about">
            <div className="page-hero">
              <div className="container">
                <span className="eyebrow-teal reveal">About DIGIMNC</span>
                <h1 className="reveal" data-d="1">Built by Practitioners. Delivered by Experts.</h1>
                <p className="sub reveal" data-d="2">5+ years of real-world delivery across SAP, supply chain, and enterprise IT.</p>
              </div>
            </div>

            <div className="section section-light">
              <div className="container">
                <div className="section-head reveal">
                  <span className="section-eyebrow">Who We Are</span>
                  <h2 className="section-title">A specialized firm at the intersection of supply chain, SAP, and AI.</h2>
                  <div className="section-underline" />
                </div>
                <div className="about-cards">
                  {[
                    { title: 'Our Story', body: 'DIGIMNC was built by practitioners — people who spent years inside SAP implementations and supply-chain operations before starting this firm. That background defines how we engage, scope, and deliver.', d: '1' },
                    { title: 'Our Mission', body: 'To unlock the full potential of your supply chain through intelligent, practical, and lasting digital solutions — built for how the business actually runs.', d: '2' },
                    { title: 'Our Vision', body: 'To be the most trusted specialized partner for supply chain and enterprise transformation — known for the depth of our expertise and the results we deliver.', d: '3' },
                  ].map(({ title, body, d }) => (
                    <div key={title} className="about-card reveal" data-d={d}>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section section-white">
              <div className="container">
                <div className="section-head reveal">
                  <span className="section-eyebrow teal">Core Values</span>
                  <h2 className="section-title">Five principles. Every engagement.</h2>
                  <div className="section-underline" />
                </div>
                <div className="values-grid">
                  {[
                    { icon: 'lightbulb', title: 'Innovation', body: 'Practical innovation that solves real operational problems.', d: '1' },
                    { icon: 'shield-halved', title: 'Integrity', body: 'Honest scoping over rapid quoting. Always.', d: '2' },
                    { icon: 'handshake', title: 'Customer Success', body: 'Your outcomes are how we measure ours.', d: '3' },
                    { icon: 'star', title: 'Excellence', body: 'Senior practitioners on every engagement.', d: '4' },
                    { icon: 'users', title: 'Collaboration', body: 'We work with your team — not around them.', d: '4' },
                  ].map(({ icon, title, body, d }) => (
                    <div key={title} className="value-card reveal" data-d={d}>
                      <div className="v-icon"><Icon name={icon} /></div>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 56 }} className="reveal">
                  <button className="btn-primary" onClick={() => goTo('contact')}>
                    Talk to Us <Icon name="arrow-right" className="arr" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        {section === 'services' && (
          <section className="page active" id="services">
            <div className="page-hero">
              <div className="container">
                <span className="eyebrow-teal reveal">Services</span>
                <h1 className="reveal" data-d="1">Comprehensive Solutions to Transform Your Business.</h1>
                <p className="sub reveal" data-d="2">Six disciplines. One delivery team. Built by practitioners.</p>
              </div>
            </div>

            {/* SVC 1: SUPPLY CHAIN */}
            <div className="svc-detail" id="supply-chain">
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 01 / 06</span>
                    <div className="svc-detail-icon"><Icon name="truck-fast" /></div>
                    <h2>End-to-End Supply Chain Solutions</h2>
                    <p className="desc">Design, optimize, and digitize supply chain processes from planning to execution.</p>
                    <ul>
                      <li>Demand &amp; supply planning</li>
                      <li>Procurement &amp; sourcing</li>
                      <li>Logistics &amp; distribution</li>
                      <li>Control tower &amp; visibility</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1" style={{ background: 'linear-gradient(135deg, #0d2d6b 0%, #0a1628 100%)' }}>
                    <svg
                      viewBox="0 0 800 600"
                      preserveAspectRatio="xMidYMid slice"
                      style={{ width: '100%', height: '100%', display: 'block', borderRadius: 22 }}
                      dangerouslySetInnerHTML={{ __html: SC_SVG_INNER }}
                    />
                    <span className="fallback-icon"><Icon name="truck-fast" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVC 2: SAP */}
            <div className="svc-detail reverse" id="sap" style={{ background: 'var(--light)' }}>
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 02 / 06</span>
                    <div className="svc-detail-icon"><Icon name="database" /></div>
                    <h2>SAP &amp; ERP Consulting</h2>
                    <p className="desc">Implementation, support, integration, process improvement, master data, and reporting.</p>
                    <ul>
                      <li>SAP S/4HANA implementation</li>
                      <li>Functional: MM, PP, SD, QM</li>
                      <li>Technical: ABAP &amp; integrations</li>
                      <li>ERP modernization &amp; migration</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80" alt="Enterprise technology and software" loading="lazy" onError={handleImgError} />
                    <span className="fallback-icon"><Icon name="database" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVC 3: LABELING */}
            <div className="svc-detail" id="labeling">
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 03 / 06</span>
                    <div className="svc-detail-icon"><Icon name="tags" /></div>
                    <h2>Labeling &amp; Artwork Management</h2>
                    <p className="desc">Digital solutions for labeling, packaging artwork workflows, compliance tracking, and approvals.</p>
                    <ul>
                      <li>Regulatory-compliant labeling</li>
                      <li>Artwork lifecycle management</li>
                      <li>ERP integration &amp; sync</li>
                      <li>Audit trail &amp; version control</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1">
                    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80" alt="Packaging and label design" loading="lazy" onError={handleImgError} />
                    <span className="fallback-icon"><Icon name="tags" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVC 4: AI */}
            <div className="svc-detail reverse" id="ai" style={{ background: 'var(--light)' }}>
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 04 / 06</span>
                    <div className="svc-detail-icon"><Icon name="brain" /></div>
                    <h2>AI-Driven Business Solutions</h2>
                    <p className="desc">AI-powered automation, forecasting, document processing, workflow improvement, and decision support.</p>
                    <ul>
                      <li>Predictive analytics &amp; forecasting</li>
                      <li>Document &amp; workflow AI</li>
                      <li>Intelligent process automation</li>
                      <li>AI copilots &amp; decision support</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1">
                    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80" alt="Artificial intelligence and data" loading="lazy" onError={handleImgError} />
                    <span className="fallback-icon"><Icon name="brain" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVC 5: ANALYTICS */}
            <div className="svc-detail" id="analytics">
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 05 / 06</span>
                    <div className="svc-detail-icon"><Icon name="chart-line" /></div>
                    <h2>Data Analytics &amp; Dashboards</h2>
                    <p className="desc">Business intelligence, KPI dashboards, data quality, reporting automation, and performance insights.</p>
                    <ul>
                      <li>Data engineering &amp; pipelines</li>
                      <li>Power BI &amp; Tableau dashboards</li>
                      <li>KPI design &amp; reporting</li>
                      <li>Advanced analytics</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&fit=crop&crop=entropy" alt="Data analytics dashboard" loading="lazy" onError={handleImgError} />
                    <span className="fallback-icon"><Icon name="chart-line" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVC 6: IT */}
            <div className="svc-detail reverse" id="it" style={{ background: 'var(--light)' }}>
              <div className="container">
                <div className="svc-detail-row">
                  <div className="reveal">
                    <span className="svc-detail-num">SERVICE 06 / 06</span>
                    <div className="svc-detail-icon"><Icon name="cloud" /></div>
                    <h2>IT Services &amp; Digital Transformation</h2>
                    <p className="desc">Application support, SaaS deployment, system integration, process automation, and technology roadmap.</p>
                    <ul>
                      <li>Application support &amp; managed services</li>
                      <li>SaaS deployment &amp; integration</li>
                      <li>System integration &amp; APIs</li>
                      <li>Technology roadmap &amp; advisory</li>
                    </ul>
                    <button className="btn-secondary" onClick={() => goTo('contact')}>
                      Get in touch <Icon name="arrow-right" className="arr" />
                    </button>
                  </div>
                  <div className="svc-image reveal" data-d="1">
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80" alt="Cloud and IT services" loading="lazy" onError={handleImgError} />
                    <span className="fallback-icon"><Icon name="cloud" /></span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CASE STUDIES ──────────────────────────────────────────────── */}
        {section === 'cases' && (
          <section className="page active" id="cases">
            <div className="page-hero">
              <div className="container">
                <span className="eyebrow-teal reveal">Case Studies</span>
                <h1 className="reveal" data-d="1">Engagements that outlast the project.</h1>
                <p className="sub reveal" data-d="2">Three stories from supply chain, life sciences, and enterprise modernization.</p>
              </div>
            </div>

            <div className="section section-light">
              <div className="container">
                <div className="case-grid">
                  <article className="case-card reveal" data-d="1">
                    <div className="case-head">
                      <span className="ci"><Icon name="eye" /></span>
                      <div className="meta">
                        <span className="case-type">Manufacturing</span>
                        <h3>Supply Chain Visibility</h3>
                      </div>
                    </div>
                    <div className="case-body">
                      <div className="case-row-item">
                        <h5>Problem</h5>
                        <p>ERP, WMS, TMS, and quality data lived in separate silos. Decisions were made on stale reports; disruptions were caught too late to act on.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Approach</h5>
                        <p>We designed a control tower connecting SAP MM, production data, logistics signals, and supplier KPIs into one stream — built on systems already in use.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Outcome</h5>
                        <p>Real-time operational visibility, faster planning decisions, and earlier supplier-risk intervention. The platform now anchors the digital supply chain roadmap.</p>
                      </div>
                    </div>
                  </article>

                  <article className="case-card reveal" data-d="2">
                    <div className="case-head">
                      <span className="ci"><Icon name="tags" /></span>
                      <div className="meta">
                        <span className="case-type">Pharma &amp; Life Sciences</span>
                        <h3>Labeling Automation</h3>
                      </div>
                    </div>
                    <div className="case-body">
                      <div className="case-row-item">
                        <h5>Problem</h5>
                        <p>A regulated client managed labeling and artwork through email threads, shared drives, and spreadsheets. Bottlenecks and version drift made every audit a risk.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Approach</h5>
                        <p>We built an ERP-integrated labeling workflow with SAP master data, single source of truth, full version history, and an automatic audit trail.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Outcome</h5>
                        <p>Faster artwork cycles, fewer label errors, and a passing compliance review with no remediation. The platform has since absorbed two more product lines.</p>
                      </div>
                    </div>
                  </article>

                  <article className="case-card reveal" data-d="3">
                    <div className="case-head">
                      <span className="ci"><Icon name="database" /></span>
                      <div className="meta">
                        <span className="case-type">Enterprise IT</span>
                        <h3>SAP S/4HANA Modernization</h3>
                      </div>
                    </div>
                    <div className="case-body">
                      <div className="case-row-item">
                        <h5>Problem</h5>
                        <p>A business had outgrown its legacy ERP — both technically and operationally. Years of undocumented customizations made any upgrade path complex and risky.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Approach</h5>
                        <p>We led functional design across MM, PP, SD, QM, ABAP development, data migration with reconciliation, and go-live hypercare — alongside the client&apos;s IT team.</p>
                      </div>
                      <div className="case-row-item">
                        <h5>Outcome</h5>
                        <p>A clean, fully-supported S/4HANA environment delivered on schedule — and a foundation for AI and analytics workstreams previously blocked.</p>
                      </div>
                    </div>
                  </article>
                </div>

                <div style={{ textAlign: 'center', marginTop: 64 }} className="reveal">
                  <button className="btn-primary" onClick={() => goTo('contact')}>
                    Have a problem like one of these? <Icon name="arrow-right" className="arr" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT ───────────────────────────────────────────────────── */}
        {section === 'contact' && (
          <section className="page active" id="contact">
            <div className="contact-section">
              <div className="container">
                <span className="eyebrow-teal reveal" style={{ marginBottom: 18 }}>Contact DIGIMNC</span>
                <h2 className="reveal" data-d="1">Let&apos;s Build Something Together.</h2>
                <p className="contact-tagline reveal" data-d="2">Built by Practitioners. Delivered by Experts.</p>

                <div className="contact-cards">
                  <a className="contact-card reveal" data-d="1" href="tel:+13134435380">
                    <span className="ci"><Icon name="phone" /></span>
                    <span className="label">Phone</span>
                    <span className="value">(313) 443-5380</span>
                  </a>
                  <a className="contact-card reveal" data-d="2" href="mailto:maheshwari.ashu@gmail.com">
                    <span className="ci"><Icon name="envelope" /></span>
                    <span className="label">Email</span>
                    <span className="value">maheshwari.ashu@gmail.com</span>
                  </a>
                </div>

                <div className="reveal" data-d="3">
                  <a className="visit-btn" href="https://digimnc.com" target="_blank" rel="noopener noreferrer">
                    <Icon name="globe" />
                    Visit Digimnc.com
                    <Icon name="arrow-up-right-from-square" className="arr" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="footer" id="siteFooter">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="lc-head">
                <span className="lc-icon"><Icon name="envelope" /></span>
                <h5>Let&apos;s Connect</h5>
              </div>
              <p>We&apos;re here to help you transform your operations and achieve your business goals.</p>
              <ul className="footer-links">
                <li><a href="mailto:maheshwari.ashu@gmail.com"><Icon name="envelope" /> maheshwari.ashu@gmail.com</a></li>
                <li><a href="tel:+13134435380"><Icon name="phone" /> (313) 443-5380</a></li>
              </ul>
            </div>

            <div className="footer-col footer-brand">
              <div className="logo" style={{ marginBottom: 16 }}>
                <div className="logo-mark" aria-hidden="true">
                  <span /><span /><span />
                  <span className="b" /><span /><span />
                  <span /><span /><span />
                </div>
                <div className="logo-text">
                  <span className="logo-wordmark"><span className="digi">DIGI</span><span className="mnc">MNC</span></span>
                  <span className="logo-tag">Digital Marketing &amp; Consulting</span>
                </div>
              </div>
              <p>Partner with Digimnc to unlock value across your supply chain, systems, data, and people.</p>
            </div>

            <div className="footer-col footer-visit">
              <div className="visit-row">
                <span className="v-icon"><Icon name="globe" /></span>
                <div>
                  <div className="v-label">Visit Our Website</div>
                  <a className="v-link" href="https://digimnc.com" target="_blank" rel="noopener noreferrer">Digimnc.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            © 2025 Digimnc. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
