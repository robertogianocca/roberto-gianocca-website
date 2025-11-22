"use client";

import { videoDataBase } from "@/data/video-data-base";
import VimeoPlayer from "@/components/Video/VimeoPlayer";

export default function VideoThumbnails({ setSelectedVideo }) {
  const videoThumbnails = videoDataBase.map((video) => {
    return (
      <div key={video.id} className="" onMouseEnter={() => setSelectedVideo(video)}>
        <VimeoPlayer vimeoId={video.vimeoId} />
      </div>
    );
  });

  return <div>{videoThumbnails}</div>;
}
