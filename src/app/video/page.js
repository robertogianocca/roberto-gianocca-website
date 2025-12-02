import MenuBar from "@/components/MenuBar";
import VideoSection from "@/components/Video/VideoSection";
import VideoThumbnails from "@/components/Video/VideoThumbnails";
import { videoDataBase } from "@/data/video-data-base";

// Generate metadata for the video index page
export const metadata = {
  title: "Videos - Roberto Gianocca",
  description: "Video portfolio of Roberto Gianocca",
};

export default function VideoIndexPage() {
  // Use the first video as the default
  const firstVideo = videoDataBase[0];

  return (
    <div className="main-grid h-screen px-10">
      <div className="col-span-1 pt-10">
        <MenuBar />
      </div>

      <div className="col-span-4">
        {/* Desktop: Show full VideoSection with thumbnails and details */}
        <VideoSection initialVideoId={firstVideo.id} />

        {/* Mobile: Show only thumbnails with navigation */}
        <div className="block md:hidden w-full h-[calc(100vh)] overflow-auto scrollbar-hide pt-10">
          <VideoThumbnails enableNavigation={true} />
        </div>
      </div>
    </div>
  );
}
