"use client";

import { useState } from "react";
import VimeoPlayer from "@/components/Video/VimeoPlayer/VimeoPlayer";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";

export default function VideoGallery({ initialVideoId }) {
  // Find the initial video based on the URL parameter
  const initialVideo =
    videoDataBase.find((video) => video.id === initialVideoId) || videoDataBase[0];

  // Use local state for smooth transitions (no re-render from URL changes)
  const [selectedVideo, setSelectedVideo] = useState(initialVideo);

  const handleVideoChange = (video) => {
    setSelectedVideo(video);
    // Update URL without triggering React re-render
    window.history.replaceState(null, "", `/video/${video.id}`);
  };

  return (
    <div className="content-grid ">
      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-1">
        <VideoThumbnails
          selectedVideo={selectedVideo}
          onVideoChange={handleVideoChange}
        />
      </div>

      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-3">
        <VimeoPlayer
          vimeoId={selectedVideo.vimeoId}
          thumbnail={selectedVideo.thumbnail}
        />

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
