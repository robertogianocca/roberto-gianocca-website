import Wrapper from "@/components/Wrapper/Wrapper";
import MenuBar from "@/components/MenuBar";
import VideoGallery from "@/components/Video/VideoGallery";

export default function HomePage() {
  return (
    <div>
      <div className="main-grid">
        <div className="col-span-1">
          <MenuBar />
        </div>
        <div className="col-span-2">
          <VideoGallery />
        </div>
      </div>
    </div>
  );
}
