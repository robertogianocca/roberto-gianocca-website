"use client";

import { useState } from "react";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(videoDataBase[0]);

  return (
    <div className="grid grid-cols-2">
      <div className="">
        <p>{selectedVideo.subtitle}</p>
      </div>
      <div>
        <VideoThumbnails setSelectedVideo={setSelectedVideo} />
      </div>
    </div>
  );
}
