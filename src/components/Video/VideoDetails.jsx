"use client";

import { motion } from "motion/react";
import VimeoPlayer from "@/components/Video/VimeoPlayer/VimeoPlayer";
import VideoSecondaryThumbnails from "./VideoSecondaryThumbnails";
import VideoInteractiveCarousel from "./VideoInteractiveCarousel";
import VidStackPlayer from "./VidStackPlayer/VidStackPlayer";

export default function VideoDetails({ selectedVideo, isStandalone = false }) {
  return (
    <div className={`w-full h-[calc(100vh)] overflow-auto scrollbar-hide col-span-3 pt-2 lg:pt-10`}>
      {/* Mobile Title and Subtitle with animation */}
      <motion.div
        key={`title-${selectedVideo.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="lg:hidden flex flex-col justify-center h-17 text-credits font-jet-brains tracking-tight"
      >
        <h2 className="text-xs">{selectedVideo.title}</h2>
        <h3 className="text-xs">{selectedVideo.subtitle}</h3>
      </motion.div>

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
        {/* <VimeoPlayer vimeoId={selectedVideo.vimeoId} cover={selectedVideo.cover} /> */}
        <VidStackPlayer videoId={selectedVideo.vimeoId} />
      </motion.div>

      {/* Desktop Title and Subtitle with animation */}
      <motion.div
        key={`desktop-title-${selectedVideo.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hidden lg:flex items-baseline gap-8 mt-3 text-credits"
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

      {/* <VideoSecondaryThumbnails selectedVideoId={selectedVideo.id} /> */}
      {/* <VideoInteractiveCarousel /> */}
    </div>
  );
}
