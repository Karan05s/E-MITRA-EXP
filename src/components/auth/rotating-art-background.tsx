'use client';

import { cn } from "@/lib/utils";

interface RotatingArtBackgroundProps {
  animationSpeed: 'slow' | 'fast';
}

export function RotatingArtBackground({ animationSpeed }: RotatingArtBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'w-full h-full max-w-[1000px] max-h-[1000px] text-primary/20 opacity-80',
          animationSpeed === 'slow' ? 'animate-spin-slow' : 'animate-spin-fast'
        )}
      >
        <defs>
          <path
            id="tribal-arm"
            d="M 90,100 A 10,10 0 0 1 110,100 L 115,100 A 15,15 0 0 0 100,85 Z"
            fill="currentColor"
          />
        </defs>

        {/* Central Circle */}
        <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.5" />

        {/* Rotating Arms */}
        <use href="#tribal-arm" />
        <use href="#tribal-arm" transform="rotate(60, 100, 100)" />
        <use href="#tribal-arm" transform="rotate(120, 100, 100)" />
        <use href="#tribal-arm" transform="rotate(180, 100, 100)" />
        <use href="#tribal-arm" transform="rotate(240, 100, 100)" />
        <use href="#tribal-arm" transform="rotate(300, 100, 100)" />
      </svg>
    </div>
  );
}
