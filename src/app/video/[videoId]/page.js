import MenuBar from "@/components/MenuBar";
import VideoSection from "@/components/Video/VideoSection";
import VideoDetails from "@/components/Video/VideoDetails";
import { videoDataBase } from "@/data/video-data-base";
import { notFound } from "next/navigation";

// Generate static params for all videos (enables static generation)
export async function generateStaticParams() {
  return videoDataBase.map((video) => ({
    videoId: video.id,
  }));
}

// Generate metadata for each video page
export async function generateMetadata({ params }) {
  const { videoId } = await params;
  const video = videoDataBase.find((v) => v.id === videoId);

  if (!video) {
    return {
      title: "Video Not Found",
    };
  }

  return {
    title: `${video.title} - Roberto Gianocca`,
    description: video.subtitle,
  };
}

export default async function VideoPage({ params }) {
  const { videoId } = await params;
  const video = videoDataBase.find((v) => v.id === videoId);

  // Show 404 if video not found
  if (!video) {
    notFound();
  }

  return (
    <div>
      <div className="main-grid h-screen px-10">
        <div className="col-span-1 pt-10">
          <MenuBar />
        </div>
        
        <div className="col-span-4">
          {/* Desktop: Show full VideoSection with thumbnails and details */}
          <VideoSection initialVideoId={videoId} />
          
          {/* Mobile: Show only video details (player + descriptions) */}
          <div className="block md:hidden">
            <VideoDetails selectedVideo={video} isStandalone={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

