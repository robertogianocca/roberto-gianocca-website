import MenuBar from "@/components/MenuBar";
import VideoSection from "@/components/Video/VideoSection";
import VideoThumbnails from "@/components/Video/VideoThumbnails";
import { videoDataBase } from "@/data/video-data-base";
import { redirect } from "next/navigation";

// Generate metadata for the video index page
export const metadata = {
  title: "Videos - Roberto Gianocca",
  description: "Video portfolio of Roberto Gianocca",
};

export default function VideoPage() {
  redirect(`/video/sugar-mama`);
}
