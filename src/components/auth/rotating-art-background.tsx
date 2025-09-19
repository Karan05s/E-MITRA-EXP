'use client';

import Image from 'next/image';

export function RotatingArtBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Image
        src="https://picsum.photos/seed/emitra/1920/1080"
        alt="Background image of a cultural art piece"
        fill
        className="object-cover"
        priority
        data-ai-hint="culture art"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
