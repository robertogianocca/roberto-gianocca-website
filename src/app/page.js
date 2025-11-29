import { redirect } from "next/navigation";
import { videoDataBase } from "@/data/video-data-base";

export default function HomePage() {
  // Redirect to the first video in the database
  const firstVideoId = videoDataBase[0]?.id || "sugar-mama";
  redirect(`/video/${firstVideoId}`);
}
