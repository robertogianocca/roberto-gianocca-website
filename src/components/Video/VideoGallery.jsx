"use client";

import VimeoPlayer from "@/components/Video/VimeoPlayer/VimeoPlayer";
import { useState } from "react";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(videoDataBase[0]);
  console.log(selectedVideo);
  return (
    <div className="content-grid ">
      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-1">
        <VideoThumbnails selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
      </div>

      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-3">
        <VimeoPlayer vimeoId={selectedVideo.vimeoId} />

        {/* ------------------------------------------ */}
        <div className="flex items-baseline gap-8 mt-3 text-credits">
          <h2 className="text-3xl">{selectedVideo.title}</h2>
          <h3 className="text-base">{selectedVideo.subtitle}</h3>
        </div>
        <div>{selectedVideo.description}</div>
      </div>
    </div>
  );
}
