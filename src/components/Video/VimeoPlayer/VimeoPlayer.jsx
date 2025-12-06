"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import PlayerControls from "./PlayerControls"; // your custom controls
import PlayerCursor from "./PlayerCursor"; // custom cursor
import PlayerPlaceholder from "./PlayerPlaceholder"; // cover image

export default function VimeoPlayer({ vimeoId, cover }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showClickAnimation, setShowClickAnimation] = useState(false);

  const hideControlsTimeout = useRef(null);

  // --------------------------
  // Player events
  // --------------------------
  const onPlay = () => {
    setPlaying(true);
    startHideControlsTimer();
  };
  const onPause = () => {
    setPlaying(false);
    setShowControls(true);
    clearHideControlsTimer();
  };
  const onProgress = ({ playedSeconds }) => {
    setCurrentTime(playedSeconds);
  };
  const onDuration = (d) => {
    setDuration(d);
  };

  // --------------------------
  // Controls timer
  // --------------------------
  const startHideControlsTimer = () => {
    clearHideControlsTimer();
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
      setShowCustomCursor(false);
    }, 1500);
  };
  const clearHideControlsTimer = () => {
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
  };

  // --------------------------
  // Play/pause toggle
  // --------------------------
  const togglePlay = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (!internalPlayer) return;

    setShowClickAnimation(true);
    setTimeout(() => setShowClickAnimation(false), 400);

    if (playing) {
      internalPlayer.pause();
      setPlaying(false);
      setShowControls(true);
      clearHideControlsTimer();
    } else {
      internalPlayer.play();
      setPlaying(true);
      startHideControlsTimer();
    }
  };

  // --------------------------
  // Volume
  // --------------------------
  const changeVolume = (v) => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (!internalPlayer) return;

    internalPlayer.setVolume(v);
    setVolume(v);
    if (v > 0) setPreviousVolume(v);
  };

  const toggleMute = () => {
    if (volume > 0) {
      changeVolume(0);
    } else {
      changeVolume(previousVolume);
    }
  };

  // --------------------------
  // Progress bar
  // --------------------------
  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const percent = (clientX - rect.left) / rect.width;
    const newTime = Math.min(Math.max(percent * duration, 0), duration);

    playerRef.current?.seekTo(newTime, "seconds");
    setCurrentTime(newTime);
  };

  const handleProgressHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(percent * duration);
    setHoverX(percent * 100);
  };
  const handleProgressLeave = () => setHoverTime(null);

  // --------------------------
  // Fullscreen
  // --------------------------
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // --------------------------
  // Cursor logic
  // --------------------------
  const handleMouseMove = useCallback(
    (e) => {
      setShowControls(true);
      setShowCustomCursor(true);
      setCursorPosition({ x: e.clientX, y: e.clientY });
      if (playing) startHideControlsTimer();
    },
    [playing]
  );

  const handleMouseEnter = () => setShowCustomCursor(true);
  const handleMouseLeave = () => {
    setShowCustomCursor(false);
    setShowControls(false);
    clearHideControlsTimer();
  };

  // --------------------------
  // Time formatting
  // --------------------------
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`max-w-full relative ${fullscreen ? "!w-screen !h-screen" : "max-w-3xl"} ${
        showCustomCursor ? "cursor-none" : ""
      }`}
    >
      {/* Custom cursor */}
      <PlayerCursor
        isVisible={showCustomCursor}
        cursorPosition={cursorPosition}
        showClickAnimation={showClickAnimation}
        playing={playing}
        isPlayerReady={isPlayerReady}
      />

      {/* Video wrapper */}
      <div className={`relative w-full ${fullscreen ? "h-screen" : "aspect-video"}`}>
        {/* Placeholder */}
        <PlayerPlaceholder cover={cover} isPlayerReady={isPlayerReady} />

        {/* ReactPlayer iframe */}
        <ReactPlayer
          ref={playerRef}
          url={`https://vimeo.com/${vimeoId}`}
          playing={playing}
          volume={volume}
          controls={false} // hide default Vimeo controls
          width="100%"
          height="100%"
          onReady={() => {
            setIsPlayerReady(true); // placeholder can fade
            // fetch duration
            const internalPlayer = playerRef.current?.getInternalPlayer();
            internalPlayer?.getDuration().then((d) => setDuration(d));
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        />

        {/* Click overlay */}
        <div className="absolute inset-0 z-10" onClick={togglePlay}></div>

        {/* Custom controls */}
        <PlayerControls
          showControls={showControls}
          isPlayerReady={isPlayerReady}
          fullscreen={fullscreen}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={changeVolume}
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          onToggleFullscreen={toggleFullscreen}
          hoverTime={hoverTime}
          hoverX={hoverX}
          onProgressChange={handleProgressChange}
          onProgressHover={handleProgressHover}
          onProgressLeave={handleProgressLeave}
        />
      </div>
    </div>
  );
}
