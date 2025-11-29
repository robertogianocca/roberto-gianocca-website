"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { videoDataBase } from "@/data/video-data-base";

export default function VideoThumbnails({ selectedVideo, onVideoChange }) {
  const videoThumbnails = videoDataBase.map((video, index) => {
    const isSelected = selectedVideo?.id === video.id;

    return (
      <motion.div
        key={video.id}
        className="overflow-hidden mb-4 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1, // Stagger delay: 0.1s between each thumbnail
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div
          className={`relative aspect-video transition-all duration-500  ${index !== 0 ? "" : ""} ${
            isSelected ? "filter-none scale-105" : "filter brightness-25 blur-xs scale-102"
          }
  `}
          onMouseEnter={() => onVideoChange(video)}
        >
          <Image src={video.thumbnail} alt={video.title} fill className="object-contain" />
        </div>
      </motion.div>
    );
  });

  return <div className="">{videoThumbnails}</div>;
}
