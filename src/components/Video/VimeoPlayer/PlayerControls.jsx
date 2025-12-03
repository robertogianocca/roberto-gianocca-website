"use client";

import { motion } from "motion/react";

import PlayerVolume from "./PlayerVolume";
import PlayButton from "./VimeoPlayerIcons/PlayButton";
import FullScreen from "./VimeoPlayerIcons/FullScreen";
import ProgressBar from "./ProgressBar";
import { Play } from "next/font/google";

export default function PlayerControls({
  showControls,
  isPlayerReady,
  fullscreen,
  volume,
  onToggleMute,
  onVolumeChange,
  currentTime,
  duration,
  formatTime,
  onToggleFullscreen,
  hoverTime,
  hoverX,
  onProgressChange,
  onProgressHover,
  onProgressLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  return (
    <motion.div
      className={`absolute bottom-0 left-0 w-full z-30 text-white ${
        showControls && fullscreen ? "bg-black pt-2" : ""
      } bg-gradient-to-t from-black/100 via-black/40 via-80% to-transparent`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: showControls && isPlayerReady ? 1 : 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="flex justify-between items-center px-4 pt-3 pb-1">
        {/* ========== Mobile Stamps and Volume ========== */}
        <div className="sm:hidden flex">
          <PlayerVolume
            volume={volume}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
            fullscreen={fullscreen}
          />

          <span className="ml-4 text-[0.7rem] sm:text-xs text-green-500  pb-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        {/* ========== Volume ========== */}
        <div className="hidden sm:block">
          <PlayerVolume
            volume={volume}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
            fullscreen={fullscreen}
          />
        </div>
        {/* ========== Mobile Play Button ========== */}
        {/* <PlayButton
          size={32}
          className="sm:hidden text-player-controls"
          playing={false}
          volume={volume}
          onToggleMute={onToggleMute}
          onVolumeChange={onVolumeChange}
          fullscreen={fullscreen}
        /> */}
        {/* ========== Time Stamps ========== */}
        <span className="hidden sm:block text-[0.7rem] sm:text-xs text-green-500 absolute left-1/2 -translate-x-1/2 pb-1">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <button
          onClick={onToggleFullscreen}
          className={`translate-y-[-0px] ${fullscreen ? "pr-130" : ""}`}
        >
          {/* ========== Full Screen button ========== */}
          <FullScreen />
        </button>
      </div>

      <div className={`${fullscreen ? "pb-8 px-4 py-2 m-auto w-3/5" : ""}`}>
        <ProgressBar
          duration={duration}
          currentTime={currentTime}
          hoverTime={hoverTime}
          hoverX={hoverX}
          onProgressChange={onProgressChange}
          onProgressHover={onProgressHover}
          onProgressLeave={onProgressLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          formatTime={formatTime}
        />
      </div>
    </motion.div>
  );
}
