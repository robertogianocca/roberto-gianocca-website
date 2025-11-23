"use client";

import { useState } from "react";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(videoDataBase[0]);
  return (
    <div className="inside-grid min-h-screen ">
      <div className="w-full h-full unused:bg-red-500">
        <VideoThumbnails selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
      </div>
      <div className="sticky top-6 h-min self-start">
        <h2 className="text-4xl font-semibold mb-4 ">{selectedVideo.title}</h2>
        <h3 className="text-2xl font-semibold mb-4">{selectedVideo.subtitle}</h3>
        <div>{selectedVideo.description}</div>
      </div>
    </div>
  );
}
