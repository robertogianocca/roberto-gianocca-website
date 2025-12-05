"use client";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";

export default function VidStackPlayer() {
  return (
    <MediaPlayer
      playsInline
      src={{
        src: "vimeo/1132948199",
        type: "video/vimeo",
      }}
    >
      <MediaProvider />
      <PlyrLayout
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={plyrLayoutIcons}
      />
    </MediaPlayer>
  );
}
