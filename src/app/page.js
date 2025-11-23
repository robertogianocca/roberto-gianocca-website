import Wrapper from "@/components/Wrapper/Wrapper";
import MenuBar from "@/components/MenuBar";
import VideoGallery from "@/components/Video/VideoGallery";

export default function HomePage() {
  return (
    <div>
      <div className="main-grid h-screen px-6">
        <div className="col-span-1">
          <MenuBar />
        </div>
        <div className="col-span-4">
          <VideoGallery />
        </div>
      </div>
    </div>
  );
}
