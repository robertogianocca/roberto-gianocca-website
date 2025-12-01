"use client";

import { motion } from "motion/react";
import VimeoPlayer from "@/components/Video/VimeoPlayer/VimeoPlayer";

export default function VideoDetails({ selectedVideo }) {
  return (
    <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-3">
      {/* Video Player with animation */}
      <motion.div
        key={selectedVideo.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1], // Custom easing for smooth feel
        }}
      >
        <VimeoPlayer
          vimeoId={selectedVideo.vimeoId}
          thumbnail={selectedVideo.thumbnail}
        />
      </motion.div>

      {/* Title and Subtitle with animation */}
      <motion.div
        key={`title-${selectedVideo.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex items-baseline gap-8 mt-3 text-credits"
      >
        <h2 className="text-3xl">{selectedVideo.title}</h2>
        <h3 className="text-base">{selectedVideo.subtitle}</h3>
      </motion.div>

      {/* Description with animation */}
      <motion.div
        key={`description-${selectedVideo.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {selectedVideo.description}
      </motion.div>
    </div>
  );
}

