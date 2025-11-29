"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "motion/react";

export default function ImageCarousel({ images, speed = 30 }) {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const imageWidth = 200; // Width of each image in pixels
  const gap = 16; // Gap between images (gap-4 = 16px)
  const itemWidth = imageWidth + gap;
  const totalWidth = images.length * itemWidth;

  useAnimationFrame((t, delta) => {
    if (images.length === 0) return;

    const currentX = x.get();
    const newX = currentX - (speed * delta) / 1000;

    // Reset position when we've scrolled one full set of images
    if (Math.abs(newX) >= totalWidth) {
      x.set(0);
    } else {
      x.set(newX);
    }
  });

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-4"
        style={{
          x,
          willChange: "transform",
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="flex-shrink-0 relative"
            style={{ width: `${imageWidth}px`, height: "133px" }}
          >
            <Image
              src={image}
              alt={`Carousel image ${(index % images.length) + 1}`}
              fill
              className="object-cover rounded-sm"
              sizes="200px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

