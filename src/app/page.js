export default async function Home() {
  // Validate environment variable at the top
  if (!process.env.VIMEO_ACCESS_TOKEN) {
    throw new Error("Vimeo access token is missing");
  }

  try {
    const folderId = "27167530";
    const response = await fetch(
      `https://api.vimeo.com/users/107233219/projects/${folderId}/videos?per_page=50`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: process.env.NODE_ENV === "development" ? "no-cache" : "force-cache",
        next: {
          tags: ["vimeo-videos"],
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Vimeo API responded with status: ${response.status}`);
    }

    const vimeoResponse = await response.json();
    const videos = vimeoResponse.data || [];

    return (
      <div className="px-2 lg:px-20 py-2 lg:py-5">
        <div className="pb-10 lg:pb-20">
          <h1 className="text-base">Roberto Gianocca</h1>
          <p className="text-xs">info@robertogianocca.ch</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.uri}>
              <div className="w-full aspect-video">
                <iframe
                  src={video.player_embed_url}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  className="w-full h-full"
                  title={video.name}
                />
              </div>
              <h2 className="mt-2 text-2xl">{video.name}</h2>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching Vimeo videos:", error);
    return (
      <div className="text-red-500">
        Failed to load videos: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
