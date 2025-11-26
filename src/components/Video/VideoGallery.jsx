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
        <h2 className="text-2xl mb-0 mt-5 ">{selectedVideo.title}</h2>
        <h3 className="text-xl mb-4">{selectedVideo.subtitle}</h3>
        <div>{selectedVideo.description}</div>
      </div>
    </div>
  );
}
