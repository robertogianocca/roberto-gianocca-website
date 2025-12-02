"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { videoDataBase } from "@/data/video-data-base";

export default function VideoSecondaryThumbnails({ selectedVideoId }) {
  const [expandedVideoId, setExpandedVideoId] = useState(null);

  const expandedVideo = useMemo(
    () => videoDataBase.find((video) => video.id === expandedVideoId),
    [expandedVideoId]
  );

  const handleThumbnailClick = useCallback((video) => {
    setExpandedVideoId(video.id);
  }, []);

  const closeExpanded = useCallback(() => setExpandedVideoId(null), []);

  return (
    <div className="mt-10">
      <div className="flex gap-3 overflow-x-auto pb-4">
        {videoDataBase.map((video) => {
          const isActive = selectedVideoId === video.id;
          const isExpanded = expandedVideoId === video.id;

          if (isExpanded) {
            // Leave empty space so layout doesn't jump while the image animates to center
            return <div key={video.id} className="w-24 h-16 shrink-0" />;
          }

          return (
            <motion.button
              type="button"
              key={video.id}
              layoutId={`secondary-thumb-${video.id}`}
              onClick={() => handleThumbnailClick(video)}
              className={`relative shrink-0 w-24 h-16 rounded-xl border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isActive ? "border-white/80" : "border-white/10 opacity-70 hover:opacity-100"
              }`}
              whileTap={{ scale: 0.94 }}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="96px"
                className="object-cover rounded-xl"
                priority={video.id === selectedVideoId}
              />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {expandedVideo && (
          <motion.button
            type="button"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
            onClick={closeExpanded}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`secondary-thumb-${expandedVideo.id}`}
              className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src={expandedVideo.thumbnail}
                alt={expandedVideo.title}
                fill
                sizes="(max-width: 768px) 90vw, 60vw"
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

