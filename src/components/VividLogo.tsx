import React from 'react';

interface VividLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export default function VividLogo({ className = '', size = 24, animated = false }: VividLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {/* Outer subtle orbital structure */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.12"
        className={animated ? "animate-[spin_16s_linear_3]" : ""}
        strokeDasharray="6 3 12 4"
      />
      {/* Secondary accent target ring */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.08"
        className={animated ? "animate-[spin_10s_linear_3_reverse]" : ""}
        strokeDasharray="4 8"
      />

      {/* Background radial soft light (glow) */}
      <circle
        cx="50"
        cy="54"
        r="20"
        fill="#e84b1f"
        fillOpacity="0.04"
        className={animated ? "animate-pulse" : ""}
      />

      {/* Left sharp V shape segment in amber yellow */}
      <path
        d="M26 35L42 72L50 54L38 27L26 35Z"
        fill="#f5c842"
        fillOpacity="0.9"
        className={animated ? "animate-pulse" : ""}
      />

      {/* Main majestic V shape segment in neon vermillion */}
      <path
        d="M38 27L50 54L62 27H74L50 81L26 35H38Z"
        fill="#e84b1f"
        className={animated ? "animate-pulse" : ""}
      />

      {/* Right sharp segment in premium off-white highlight */}
      <path
        d="M62 27L50 54L58 72L74 35H62Z"
        fill="#f5f0e8"
        fillOpacity="0.65"
      />

      {/* Focal circular target lens inside the aperture */}
      <circle
        cx="50"
        cy="38"
        r="4.5"
        fill="#e84b1f"
        className={animated ? "animate-ping" : ""}
        style={{ animationDuration: '3s' }}
      />
      <circle
        cx="50"
        cy="38"
        r="3"
        fill="#f5c842"
      />
    </svg>
  );
}
