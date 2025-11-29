"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import VimeoPlayer from "@/components/Video/VimeoPlayer/VimeoPlayer";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";

export default function VideoGallery({ initialVideoId }) {
  // Find the initial video based on the URL parameter
  const initialVideo =
    videoDataBase.find((video) => video.id === initialVideoId) || videoDataBase[0];

  // Use local state for smooth transitions (no re-render from URL changes)
  const [selectedVideo, setSelectedVideo] = useState(initialVideo);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVideoChange = (video) => {
    setIsAnimating(true);
    setSelectedVideo(video);
    // Update URL without triggering React re-render
    window.history.replaceState(null, "", `/video/${video.id}`);
    
    // Reset animation state after a brief delay
    setTimeout(() => setIsAnimating(false), 100);
  };

  // Trigger animation on initial load
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="content-grid ">
      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-1">
        <VideoThumbnails
          selectedVideo={selectedVideo}
          onVideoChange={handleVideoChange}
        />
      </div>

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
    </div>
  );
}
