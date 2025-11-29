"use client";

import { motion } from "motion/react";

import PlayButton from "./VimeoPlayerIcons/PlayButton";
import PauseButton from "./VimeoPlayerIcons/PauseButton";

export default function PlayerCursor({
  isVisible,
  cursorPosition,
  showClickAnimation,
  playing,
  isPlayerReady,
}) {
  if (
    !isVisible ||
    !isPlayerReady ||
    cursorPosition?.x <= 0 ||
    cursorPosition?.y <= 0
  ) {
    return null;
  }

  return (
    <motion.div
      className="fixed z-50 pointer-events-none mix-blend-exclusion"
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0 }}
      animate={{
        scale: showClickAnimation ? [1, 1.3, 1] : 1,
        opacity: showClickAnimation ? [1, 0.8, 1] : 1,
      }}
      transition={{
        duration: showClickAnimation ? 0.3 : 0.5,
        ease: "easeOut",
      }}
    >
      <div className="rounded-full backdrop-blur-sm">
        {playing ? (
          <PauseButton className="w-6 h-6 text-white" />
        ) : (
          <PlayButton className="w-6 h-6 text-white" />
        )}
      </div>
    </motion.div>
  );
}

