"use client";

import Image from "next/image";
import { videoDataBase } from "@/data/video-data-base";

export default function VideoThumbnails({ selectedVideo, onVideoChange }) {
  const videoThumbnails = videoDataBase.map((video, index) => {
    const isSelected = selectedVideo?.id === video.id;

    return (
      <div key={video.id} className="overflow-hidden mb-4 rounded-2xl">
        <div
          className={`relative aspect-video transition-all duration-500  ${index !== 0 ? "" : ""} ${
            isSelected ? "filter-none scale-105" : "filter brightness-25 blur-xs scale-102"
          }
  `}
          onMouseEnter={() => onVideoChange(video)}
        >
          <Image src={video.thumbnail} alt={video.title} fill className="object-contain" />
        </div>
      </div>
    );
  });

  return <div className="">{videoThumbnails}</div>;
}
