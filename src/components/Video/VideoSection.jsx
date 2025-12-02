"use client";

import { useState, useEffect, useCallback } from "react";
import { videoDataBase } from "@/data/video-data-base";
import VideoThumbnails from "./VideoThumbnails";
import VideoDetails from "./VideoDetails";

const DESKTOP_BREAKPOINT = 768;

export default function VideoSection({ initialVideoId }) {
  // Desktop-only rendering
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Find the initial video based on the URL parameter
  const initialVideo =
    videoDataBase.find((video) => video.id === initialVideoId) || videoDataBase[0];

  // Use local state for smooth transitions (no re-render from URL changes)
  const [selectedVideo, setSelectedVideo] = useState(initialVideo);

  const selectVideoById = useCallback((id) => {
    if (!id) return;
    const video = videoDataBase.find((v) => v.id === id);
    if (video) {
      setSelectedVideo(video);
    }
  }, []);

  const handleVideoChange = (video) => {
    setSelectedVideo(video);
    // Update URL without triggering React re-render
    window.history.replaceState(null, "", `/video/${video.id}`);
  };

  // Keep local state in sync if Next.js provides a new initialVideoId
  useEffect(() => {
    selectVideoById(initialVideoId);
  }, [initialVideoId, selectVideoById]);

  // Update selected video when user navigates via browser history
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split("/").filter(Boolean);
      const id = segments[1] || segments[segments.length - 1];
      selectVideoById(id);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectVideoById]);

  // Don't render on mobile - prevents Vimeo player errors during navigation
  if (!hasMounted || !isDesktop) {
    return null;
  }

  return (
    <div className="content-grid ">
      <div className="w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10 col-span-1">
        <VideoThumbnails
          selectedVideo={selectedVideo}
          onVideoChange={handleVideoChange}
        />
      </div>

      <VideoDetails selectedVideo={selectedVideo} />
    </div>
  );
}

