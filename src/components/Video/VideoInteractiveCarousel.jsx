"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const AUTO_SCROLL_SPEED = 0.4;
const SMOOTHING = 0.02; // Lower = slower/smoother stop on hover

const thumbnailAssets = [
  "/video-thumbnails/sugar-mama-thumb_01.jpg",
  "/video-thumbnails/sugar-mama-thumb_02.jpg",
  "/video-thumbnails/sugar-mama-thumb_03.jpg",
  "/video-thumbnails/sugar-mama-thumb_04.jpg",
  "/video-thumbnails/sugar-mama-thumb_05.jpg",
  "/video-thumbnails/sugar-mama-thumb_06.jpg",
  "/video-thumbnails/sugar-mama-thumb_07.jpg",
  "/video-thumbnails/sugar-mama-thumb_08.jpg",
];

export default function VideoInteractiveCarousel() {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const halfScrollWidthRef = useRef(0);
  const speedRef = useRef(AUTO_SCROLL_SPEED);
  const targetSpeedRef = useRef(AUTO_SCROLL_SPEED);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const lastTapSrcRef = useRef(null);
  const hasDraggedRef = useRef(false);
  const clickedIndexRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [expandedSrc, setExpandedSrc] = useState(null);

  const carouselImages = useMemo(
    () => [...thumbnailAssets, ...thumbnailAssets],
    []
  );

  // Measure scroll width for seamless looping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSizes = () => {
      halfScrollWidthRef.current = container.scrollWidth / 2;
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    const step = () => {
      if (!isMounted) return;

      speedRef.current += (targetSpeedRef.current - speedRef.current) * SMOOTHING;
      const delta = speedRef.current;

      if (Math.abs(delta) > 0.001) {
        container.scrollLeft += delta;

        const halfWidth = halfScrollWidthRef.current;
        if (halfWidth > 0) {
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const stopAutoScroll = () => {
    targetSpeedRef.current = 0;
  };

  const handlePointerEnter = () => {
    stopAutoScroll();
  };

  const handlePointerLeave = () => {
    // Keep carousel stopped once the user has hovered
  };

  const getClientX = (event) => {
    // Handle both mouse and touch events
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    if (event.changedTouches && event.changedTouches.length > 0) {
      return event.changedTouches[0].clientX;
    }
    return event.clientX;
  };

  const handleStart = (event) => {
    // Prevent double-firing from both touch and pointer events
    if (isDraggingRef.current) return;
    
    stopAutoScroll();
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;

    const container = containerRef.current;
    if (!container) return;

    const clientX = getClientX(event);

    // Find which image was tapped
    const rect = container.getBoundingClientRect();
    const clickX = clientX - rect.left + container.scrollLeft;
    const imageWidth = 192 + 24; // w-48 (192px) + gap-6 (24px)
    clickedIndexRef.current = Math.floor((clickX - 16) / imageWidth); // 16px for px-4 padding

    dragStartXRef.current = clientX;
    dragStartScrollRef.current = container.scrollLeft;
  };

  const handleMove = (event) => {
    if (!isDraggingRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const clientX = getClientX(event);
    const deltaX = clientX - dragStartXRef.current;
    
    // Only consider it dragging if moved more than 10px (more forgiving for touch)
    if (Math.abs(deltaX) > 10) {
      hasDraggedRef.current = true;
      event.preventDefault();
      container.scrollLeft = dragStartScrollRef.current - deltaX;
    }
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    setIsDragging(false);

    // Handle double-tap detection if user didn't drag
    if (!hasDraggedRef.current && clickedIndexRef.current !== null) {
      const index = clickedIndexRef.current;
      const src = carouselImages[index];
      
      if (src) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTimeRef.current;

        // Detect double-tap (within 500ms on same image)
        if (timeSinceLastTap < 500 && lastTapSrcRef.current === src) {
          setExpandedSrc(src);
          lastTapTimeRef.current = 0;
          lastTapSrcRef.current = null;
        } else {
          lastTapTimeRef.current = now;
          lastTapSrcRef.current = src;
        }
      }
    }
    
    clickedIndexRef.current = null;
  };

  return (
    <div className="mt-10">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
        Drag to explore
      </p>

      <div
        ref={containerRef}
        className={`relative flex gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-4 py-6 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-y" }}
        onMouseEnter={handlePointerEnter}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          handlePointerLeave();
          handleEnd();
        }}
        // Touch events for mobile
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      >
        {carouselImages.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            className="relative shrink-0 w-48 h-28 rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Image
              src={src}
              alt="Video thumbnail"
              fill
              sizes="192px"
              className="object-cover pointer-events-none"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {expandedSrc && (
          <motion.button
            type="button"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
            onClick={() => setExpandedSrc(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layout
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src={expandedSrc}
                alt="Video thumbnail enlarged"
                fill
                sizes="(max-width: 768px) 90vw, 70vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

