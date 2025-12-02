"use client";

import { motion } from "motion/react";

import PlayButton from "./VimeoPlayerIcons/PlayButton";
import PauseButton from "./VimeoPlayerIcons/PauseButton";

const CURSOR_DIAMETER = 110;
const ICON_SIZE = 64;

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
      className="fixed z-50 pointer-events-none mix-blend-exclusion flex items-center justify-center"
      style={{
        left: cursorPosition.x - CURSOR_DIAMETER / 2,
        top: cursorPosition.y - CURSOR_DIAMETER / 2,
        width: CURSOR_DIAMETER,
        height: CURSOR_DIAMETER,
      }}
      initial={{ opacity: 0 }}
      animate={{
        scale: showClickAnimation ? [1, 1.15, 1] : 1,
        opacity: showClickAnimation ? [1, 0.8, 1] : 1,
      }}
      transition={{
        duration: showClickAnimation ? 0.3 : 0.5,
        ease: "easeOut",
      }}
    >
      <div className="rounded-full backdrop-blur-sm w-full h-full flex items-center justify-center">
        {playing ? (
          <PauseButton size={ICON_SIZE} className="text-player-controls" />
        ) : (
          <PlayButton size={ICON_SIZE} className="text-player-controls" />
        )}
      </div>
    </motion.div>
  );
}

