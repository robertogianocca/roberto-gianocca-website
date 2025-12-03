"use client";

import Image from "next/image";

export default function PlayerPlaceholder({ cover, isPlayerReady }) {
  if (!cover) return null;

  return (
    <div
      className={`absolute inset-0 z-5 transition-opacity duration-500 overflow-hidden ${
        isPlayerReady ? "opacity-0 pointer-events-none" : "opacity-100 z-10"
      }`}
    >
      <div className="absolute inset-0 blur-sm">
        <Image src={cover} alt="Video thumbnail" fill className="object-cover" priority />
      </div>
    </div>
  );
}
