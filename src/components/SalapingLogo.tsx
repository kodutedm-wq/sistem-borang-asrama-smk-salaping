import React from 'react';
import salapingLogoAssetUrl from '../assets/images/smk_salaping_logo.svg';

/**
 * 100% Faithful SMK Salaping Official Crest as pure React SVG
 * Guaranteed to display post-deployment with zero network request, zero 404 risk,
 * crystal-clear vector sharpness on all screens and printable PDFs.
 */
export const SalapingLogo: React.FC<{
  className?: string;
  title?: string;
}> = ({ className = 'w-full h-full', title = 'Lencana Rasmi SMK Salaping' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 500" 
      className={className}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <defs>
        {/* Curved path for ILMUAN GEMILANG banner text */}
        <path id="crest-banner-text-path" d="M 120 442 Q 250 472 380 442" fill="none" />
        
        {/* Clip for space panel to prevent overflow */}
        <clipPath id="crest-right-panel-clip">
          <rect x="250" y="85" width="154" height="135" />
        </clipPath>
      </defs>

      {/* Dark Canvas Background */}
      <rect width="500" height="500" fill="#000000" rx="20" />

      {/* Outer White Badge Shield Outline */}
      <path 
        d="M 82 42 C 82 26 94 14 110 14 L 390 14 C 406 14 418 26 418 42 L 418 252 C 418 335 348 408 250 438 C 152 408 82 335 82 252 Z" 
        fill="#ffffff" 
        stroke="#ffffff" 
        strokeWidth="10" 
        strokeLinejoin="round" 
      />

      {/* Main Shield Body (Vibrant Teal / Cyan) */}
      <path 
        d="M 94 48 C 94 36 104 26 116 26 L 384 26 C 396 26 406 36 406 48 L 406 248 C 406 324 342 392 250 422 C 158 392 94 324 94 248 Z" 
        fill="#1fa6b8" 
      />

      {/* Top Title: SMK SALAPING */}
      <text 
        x="250" 
        y="70" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        fontSize="34" 
        letterSpacing="0.5"
      >
        SMK SALAPING
      </text>

      {/* DUAL MIDDLE PANELS */}
      
      {/* LEFT PANEL: Yellow background with red diploma scroll */}
      <g>
        <rect x="96" y="85" width="154" height="135" fill="#f8cf28" stroke="#000000" strokeWidth="2.5" />
        
        {/* Red Rolled Diploma / Scroll (Diagonal) */}
        <g transform="translate(172, 152) rotate(-35)">
          <rect x="-48" y="-15" width="96" height="30" rx="2" fill="#d9222a" stroke="#870c12" strokeWidth="1.5" />
          
          <ellipse cx="-48" cy="0" rx="8" ry="15" fill="#9c0f16" stroke="#870c12" strokeWidth="1.5" />
          <ellipse cx="-48" cy="0" rx="5" ry="10" fill="#f8cf28" />
          <ellipse cx="-48" cy="0" rx="2.5" ry="5" fill="#9c0f16" />

          <path d="M 48 -15 A 8 15 0 0 1 48 15" fill="#d9222a" stroke="#870c12" strokeWidth="1.5" />

          <rect x="-14" y="-16" width="14" height="32" fill="#20b9cb" stroke="#ffffff" strokeWidth="0.8" />
          
          <ellipse cx="-7" cy="16" rx="5" ry="4" fill="#20b9cb" stroke="#ffffff" strokeWidth="0.6" />
          <path d="M -9 18 L -18 34 L -12 34 L -6 21 Z" fill="#20b9cb" stroke="#ffffff" strokeWidth="0.6" />
          <path d="M -5 18 L 4 34 L -2 34 L -7 21 Z" fill="#20b9cb" stroke="#ffffff" strokeWidth="0.6" />
        </g>
      </g>

      {/* RIGHT PANEL: Dark Space with Red Planet, Orbits and Satellite */}
      <g clipPath="url(#crest-right-panel-clip)">
        <rect x="250" y="85" width="156" height="135" fill="#131b38" stroke="#000000" strokeWidth="2.5" />

        <circle cx="340" cy="150" r="48" fill="#312a68" opacity="0.6" />
        <circle cx="280" cy="115" r="32" fill="#221e50" opacity="0.6" />
        
        <circle cx="268" cy="135" r="2.5" fill="#ffffff" />
        <circle cx="268" cy="135" r="5" fill="#ffffff" opacity="0.3" />
        
        <circle cx="262" cy="170" r="2" fill="#ffffff" />
        <circle cx="262" cy="170" r="4" fill="#ffffff" opacity="0.3" />

        <circle cx="385" cy="110" r="2.2" fill="#ffffff" />
        <circle cx="385" cy="110" r="4.5" fill="#ffffff" opacity="0.3" />

        <circle cx="388" cy="155" r="2" fill="#ffffff" />
        <circle cx="370" cy="195" r="2.5" fill="#ffffff" />
        <circle cx="370" cy="195" r="5" fill="#ffffff" opacity="0.3" />

        <circle cx="320" cy="98" r="1.8" fill="#ffffff" opacity="0.8" />
        <circle cx="345" cy="205" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="395" cy="180" r="1.5" fill="#ffffff" opacity="0.8" />

        {/* Satellite */}
        <g transform="translate(304, 114) rotate(-25)">
          <rect x="-6" y="-6" width="12" height="12" fill="#ffffff" stroke="#c0392b" strokeWidth="1.5" />
          <rect x="-14" y="-4" width="8" height="8" fill="#c0392b" stroke="#ffffff" strokeWidth="0.8" />
          <rect x="6" y="-4" width="8" height="8" fill="#c0392b" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.8" fill="#c0392b" />
        </g>

        {/* Red Planet */}
        <circle cx="340" cy="152" r="23" fill="#d9222a" />
        <path d="M 340 129 A 23 23 0 0 1 363 152 A 23 23 0 0 1 340 175 A 12 23 0 0 0 340 129 Z" fill="#991118" opacity="0.65" />

        {/* Orbit Rings */}
        <g transform="translate(336, 150) rotate(-22)">
          <ellipse cx="0" cy="0" rx="66" ry="19" fill="none" stroke="#ffffff" strokeWidth="1.8" />
          <ellipse cx="0" cy="0" rx="56" ry="14.5" fill="none" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="65" cy="2" r="3.5" fill="#ffffff" />
        </g>
      </g>

      <line x1="250" y1="85" x2="250" y2="220" stroke="#000000" strokeWidth="2.5" />

      {/* LOWER SECTION: OPEN BOOK */}
      <g transform="translate(250, 262)">
        <path 
          d="M 0 -8 C 45 -23, 100 -13, 140 12 L 134 24 C 95 2, 45 -4, 0 12 C -45 -4, -95 2, -134 24 L -140 12 C -100 -13, -45 -23, 0 -8 Z" 
          fill="#c01d24" 
          stroke="#7a0006" 
          strokeWidth="1.5" 
        />
        
        <path 
          d="M 0 -10 C -45 -25, -92 -17, -132 8 C -92 -4, -45 -10, 0 8 Z" 
          fill="#ffffff" 
          stroke="#c01d24" 
          strokeWidth="1.8" 
        />
        
        <path 
          d="M 0 -10 C 45 -25, 92 -17, 132 8 C 92 -4, 45 -10, 0 8 Z" 
          fill="#ffffff" 
          stroke="#c01d24" 
          strokeWidth="1.8" 
        />

        <path d="M 0 0 C -42 -14, -85 -8, -124 13" fill="none" stroke="#c01d24" strokeWidth="1.2" />
        <path d="M 0 0 C 42 -14, 85 -8, 124 13" fill="none" stroke="#c01d24" strokeWidth="1.2" />
        <line x1="0" y1="-12" x2="0" y2="14" stroke="#c01d24" strokeWidth="2.5" />
      </g>

      {/* LAUREL WREATH */}
      <g fill="#0e6f47" stroke="#064229" strokeWidth="0.8">
        <path d="M 120 300 Q 250 380 380 300" fill="none" stroke="#0e6f47" strokeWidth="2.5" />

        <ellipse cx="230" cy="350" rx="9.5" ry="5" transform="rotate(-30 230 350)" />
        <ellipse cx="215" cy="358" rx="9.5" ry="5" transform="rotate(20 215 358)" />
        <ellipse cx="195" cy="346" rx="11" ry="5" transform="rotate(-35 195 346)" />
        <ellipse cx="180" cy="350" rx="11" ry="5" transform="rotate(15 180 350)" />
        <ellipse cx="160" cy="332" rx="12" ry="5" transform="rotate(-40 160 332)" />
        <ellipse cx="150" cy="336" rx="12" ry="5" transform="rotate(10 150 336)" />
        <ellipse cx="135" cy="310" rx="13" ry="5.5" transform="rotate(-45 135 310)" />
        <ellipse cx="125" cy="318" rx="13" ry="5.5" transform="rotate(5 125 318)" />
        <ellipse cx="118" cy="285" rx="14" ry="5.5" transform="rotate(-55 118 285)" />

        <ellipse cx="270" cy="350" rx="9.5" ry="5" transform="rotate(30 270 350)" />
        <ellipse cx="285" cy="358" rx="9.5" ry="5" transform="rotate(-20 285 358)" />
        <ellipse cx="305" cy="346" rx="11" ry="5" transform="rotate(35 305 346)" />
        <ellipse cx="320" cy="350" rx="11" ry="5" transform="rotate(-15 320 350)" />
        <ellipse cx="340" cy="332" rx="12" ry="5" transform="rotate(40 340 332)" />
        <ellipse cx="350" cy="336" rx="12" ry="5" transform="rotate(-10 350 336)" />
        <ellipse cx="365" cy="310" rx="13" ry="5.5" transform="rotate(45 365 310)" />
        <ellipse cx="375" cy="318" rx="13" ry="5.5" transform="rotate(-5 375 318)" />
        <ellipse cx="382" cy="285" rx="14" ry="5.5" transform="rotate(55 382 285)" />
      </g>

      {/* RIBBON BANNER */}
      <g>
        <path d="M 16 373 L 140 373 L 140 435 L 50 458 L 64 415 L 16 415 Z" fill="#ffffff" />
        <path d="M 484 373 L 360 373 L 360 435 L 450 458 L 436 415 L 484 415 Z" fill="#ffffff" />
        <path d="M 112 373 Q 250 405 388 373 L 400 440 Q 250 482 100 440 Z" fill="#ffffff" />
      </g>

      <path d="M 28 382 L 132 382 L 132 426 L 58 445 L 70 412 L 28 412 Z" fill="#1fa6b8" />
      <path d="M 125 383 L 142 383 L 125 435 Z" fill="#0c5b65" />

      <path d="M 472 382 L 368 382 L 368 426 L 442 445 L 430 412 L 472 412 Z" fill="#1fa6b8" />
      <path d="M 375 383 L 358 383 L 375 435 Z" fill="#0c5b65" />

      <path d="M 124 382 Q 250 412 376 382 L 388 434 Q 250 472 112 434 Z" fill="#1fa6b8" />

      {/* RIBBON TEXTS */}
      <text 
        x="86" 
        y="413" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        fontSize="23" 
        letterSpacing="0.5"
      >
        2006
      </text>

      <text 
        fill="#ffffff" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        fontSize="28" 
        letterSpacing="1"
      >
        <textPath href="#crest-banner-text-path" startOffset="50%" textAnchor="middle">
          ILMUAN GEMILANG
        </textPath>
      </text>

      <text 
        x="414" 
        y="413" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        fontSize="23" 
        letterSpacing="0.5"
      >
        1427
      </text>
    </svg>
  );
};

export const SALAPING_LOGO_SRC = salapingLogoAssetUrl;
export default SalapingLogo;
