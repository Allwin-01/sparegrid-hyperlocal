import React from 'react';

export const EngineIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Main Engine Block - Adjusted for centering */}
    <path d="M3 11h18v8H3z" />
    <path d="M7 11V8h10v3" />
    {/* Cylinder Head Details */}
    <path d="M5 11l1-3h12l1 3" />
    <path d="M9 8V6h6v2" />
    {/* Internal Components / Pistons */}
    <circle cx="8" cy="15" r="1.5" />
    <circle cx="16" cy="15" r="1.5" />
    <path d="M10 15h4" />
    {/* Belts and Pulleys */}
    <circle cx="12" cy="12" r="1" />
    <path d="M11 12h2" />
    {/* External Pipes/Sensors */}
    <path d="M2 13h1M21 13h1M12 6V4" />
    <path d="M10 4h4" strokeWidth="2" />
    {/* Oil Cap */}
    <rect x="11" y="7" width="2" height="1" fill="currentColor" />
  </svg>
);

export const BrakesIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Brake Disc */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="8" strokeDasharray="1 3" opacity="0.5" />
    <circle cx="12" cy="12" r="3" />
    {/* Ventilation Holes */}
    <circle cx="12" cy="6" r="0.5" fill="currentColor" />
    <circle cx="18" cy="12" r="0.5" fill="currentColor" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    <circle cx="6" cy="12" r="0.5" fill="currentColor" />
    {/* Brake Caliper */}
    <path d="M16 4.5a9 9 0 0 1 3.5 3.5l-2 2a6 6 0 0 0-2.5-2.5z" fill="currentColor" fillOpacity="0.2" />
    <path d="M16 4.5l1.5 1.5M19.5 8l-1.5 1.5" />
    <path d="M17 7l2 2" strokeWidth="2" />
    {/* Mounting Bolts */}
    <circle cx="10" cy="10" r="0.5" fill="currentColor" />
    <circle cx="14" cy="10" r="0.5" fill="currentColor" />
    <circle cx="10" cy="14" r="0.5" fill="currentColor" />
    <circle cx="14" cy="14" r="0.5" fill="currentColor" />
  </svg>
);

export const ElectricalIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Battery Case */}
    <rect x="3" y="7" width="18" height="12" rx="1" />
    {/* Terminals */}
    <path d="M7 7V5h3v2M14 7V5h3v2" />
    {/* Positive/Negative Symbols */}
    <path d="M7 11h2M8 10v2" strokeWidth="1" />
    <path d="M15 11h2" strokeWidth="1" />
    {/* Internal Grid/Plates */}
    <path d="M6 14h12M6 16h12" opacity="0.3" />
    {/* Lightning Bolt / Energy Indicator */}
    <path d="M12 9l-1 3h2l-1 3" stroke="currentColor" strokeWidth="1.5" />
    {/* Casing Details */}
    <path d="M3 10h18" opacity="0.2" />
  </svg>
);

export const SuspensionIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Shock Absorber Shaft */}
    <path d="M12 3v18" strokeWidth="2" />
    {/* Top and Bottom Mounts */}
    <rect x="9" y="3" width="6" height="2" rx="0.5" fill="currentColor" />
    <rect x="9" y="19" width="6" height="2" rx="0.5" fill="currentColor" />
    {/* Coil Spring */}
    <path d="M8 7c4 0 8 1 8 2s-4 1-8 1 8 1 8 2-4 1-8 1 8 1 8 2-4 1-8 1" />
    <path d="M8 8c4 0 8 1 8 2s-4 1-8 1 8 1 8 2-4 1-8 1 8 1 8 2-4 1-8 1" opacity="0.5" />
    {/* Piston Detail */}
    <rect x="11" y="14" width="2" height="3" fill="currentColor" />
  </svg>
);

export const BodyPartsIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Car Silhouette / Body Shell - Adjusted for centering */}
    <path d="M2 16h20l1-4-3-1H4l-3 1z" />
    <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
    {/* Windows */}
    <path d="M6 11V8h5v3M13 11V8h5v3" opacity="0.5" />
    {/* Wheels / Arches */}
    <circle cx="6" cy="16" r="2" />
    <circle cx="18" cy="16" r="2" />
    {/* Door Lines */}
    <path d="M12 6v10" opacity="0.3" />
    {/* Lights */}
    <path d="M2 13h2M20 13h2" strokeWidth="2" />
  </svg>
);

export const TyresIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Outer Tyre */}
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    {/* Tread Patterns */}
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.5" />
    <path d="M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" opacity="0.5" />
    {/* Rim / Wheel Hub */}
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    {/* Spokes */}
    <path d="M12 6v3M12 15v3M6 12h3M15 12h3" />
    <path d="M7.8 7.8l2.1 2.1M14.1 14.1l2.1 2.1M16.2 7.8l-2.1 2.1M9.9 14.1l-2.1 2.1" />
  </svg>
);

export const SpareGridLogo = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Abstract Mechanical Grid Logo */}
    <path 
      d="M12 2L4 7V17L12 22L20 17V7L12 2Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 2V22M4 7L20 17M20 7L4 17" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeOpacity="0.3" 
    />
    {/* Central Core */}
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    
    {/* Outer Accents / "Spare" parts */}
    <path d="M12 2V5M12 19V22M4 7L6.5 8.5M17.5 15.5L20 17M20 7L17.5 8.5M6.5 15.5L4 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Tech Pulse Grid */}
    <rect x="11" y="11" width="2" height="2" rx="0.5" fill="currentColor" className="animate-pulse" />
  </svg>
);
