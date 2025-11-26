"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import Player from "@vimeo/player";

import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";

import VolumeX from "./VideoPlayer/VideoPlayerIcons/VolumeX";
import VolumeOff from "./VideoPlayer/VideoPlayerIcons/VolumeOff";
import VolumeLow from "./VideoPlayer/VideoPlayerIcons/VolumeLow";
import VolumeHigh from "./VideoPlayer/VideoPlayerIcons/VolumeHigh";
import FullScreen from "./VideoPlayer/VideoPlayerIcons/FullScreen";

export default function VimeoPlayer({ vimeoId, spriteSrc }) {
  //
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const volumeContainerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);

  const playerInstanceRef = useRef(null);
  const hideControlsTimeout = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const vimeoPlayer = new Player(playerRef.current, {
      id: vimeoId,
      width: 640,
      controls: false,
      volume: 1,
    });

    playerInstanceRef.current = vimeoPlayer;
    vimeoPlayer.setVolume(volume);
    vimeoPlayer.getDuration().then((d) => setDuration(d));

    vimeoPlayer.on("timeupdate", (data) => setCurrentTime(data.seconds));
    vimeoPlayer.on("play", () => {
      setPlaying(true);
      startHideControlsTimer();
    });
    vimeoPlayer.on("pause", () => {
      setPlaying(false);
      setShowControls(true);
      clearHideControlsTimer();
    });

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setFullscreen(isFullscreen);

      if (isFullscreen && window.innerHeight > window.innerWidth) {
        try {
          screen.orientation.lock("landscape").catch(() => {});
        } catch (e) {}
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      vimeoPlayer.destroy();
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (playerInstanceRef.current && vimeoId) {
      playerInstanceRef.current
        .loadVideo(vimeoId)
        .then(() => {
          // Opzionale: resetta lo stato quando cambia video
          setCurrentTime(0);
          setPlaying(false);
          playerInstanceRef.current.getDuration().then((d) => setDuration(d));
        })
        .catch((error) => {
          console.error("Error loading video:", error);
        });
    }
  }, [vimeoId]);

  const startHideControlsTimer = () => {
    clearHideControlsTimer();
    hideControlsTimeout.current = setTimeout(() => setShowControls(false), 1500);
  };

  const clearHideControlsTimer = () => {
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
  };

  const togglePlay = () => {
    if (!playerInstanceRef.current) return;
    if (playing) playerInstanceRef.current.pause();
    else {
      playerInstanceRef.current.play();
      startHideControlsTimer();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (playing) startHideControlsTimer();
  };

  const handleProgressChange = (e) => {
    if (!playerInstanceRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;

    const percent = (clientX - rect.left) / rect.width;
    const newTime = Math.min(Math.max(percent * duration, 0), duration);

    playerInstanceRef.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleProgressHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(percent * duration);
    setHoverX(percent * 100);
  };

  const handleProgressLeave = () => setHoverTime(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!fullscreen) {
      containerRef.current.requestFullscreen().then(() => {
        if (window.innerHeight > window.innerWidth) {
          try {
            screen.orientation.lock("landscape").catch(() => {});
          } catch (e) {}
        }
      });
    } else {
      document.exitFullscreen();
    }
  };

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value);
    playerInstanceRef.current?.setVolume(v);
    setVolume(v);
    if (v > 0) setPreviousVolume(v);
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;
    if (volume > 0) {
      setPreviousVolume(volume);
      playerInstanceRef.current.setVolume(0);
      setVolume(0);
    } else {
      playerInstanceRef.current.setVolume(previousVolume);
      setVolume(previousVolume);
    }
  };

  const handleVolumeContainerMouseEnter = () => setShowVolumeSlider(true);
  const handleVolumeContainerMouseLeave = (e) => {
    if (volumeSliderRef.current?.contains(e.relatedTarget)) return;
    setShowVolumeSlider(false);
  };

  const handleVolumeSliderMouseLeave = (e) => {
    if (volumeContainerRef.current?.contains(e.relatedTarget)) return;
    setShowVolumeSlider(false);
  };

  const handleTouchStart = (e) => {
    setIsDraggingProgress(true);
    setShowControls(true);
    clearHideControlsTimer();
    handleProgressChange(e);
  };
  const handleTouchMove = (e) => {
    if (isDraggingProgress) handleProgressChange(e);
    e.preventDefault();
  };
  const handleTouchEnd = () => {
    setIsDraggingProgress(false);
    if (playing) startHideControlsTimer();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`max-w-full   ${
        fullscreen ? "!w-screen !h-screen !max-w-none p-0" : "max-w-3xl"
      } unused:bg-gray-700`}
    >
      {/* VIDEO WRAPPER */}
      <div
        className={`relative w-full ${fullscreen ? "h-screen" : "aspect-video"} ${
          playing && !showControls ? "cursor-none" : ""
        }`}
      >
        {/* Vimeo iframe */}
        <div
          ref={playerRef}
          className={`vimeo-player w-full h-full ${fullscreen ? "absolute inset-0" : ""}`}
        ></div>

        {/* Overlay click area */}
        <div
          className="absolute inset-0 z-10"
          onClick={() => !isDraggingProgress && togglePlay()}
        ></div>

        {/* Center Play/Pause */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full z-20"
          >
            <FaCirclePlay size="90px" />
          </button>
        )}

        {playing && showControls && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full z-20"
          >
            <FaCirclePause size="90px" />
          </button>
        )}

        {/* ========== OVERLAY CONTROLS ========== */}
        {
          <div
            className={`absolute bottom-0 left-0 w-full z-30 text-white transition-opacity duration-600 ${
              showControls ? "opacity-100" : "opacity-0"
            } ${
              showControls & fullscreen && "bg-black pt-2"
            }  bg-gradient-to-t from-black/100 via-black/40 via-80% to-transparent`}
          >
            {/* Top Row */}
            <div className="flex justify-between items-center px-4 pt-3 pb-1">
              {/* Volume */}
              <div
                ref={volumeContainerRef}
                onMouseEnter={handleVolumeContainerMouseEnter}
                onMouseLeave={handleVolumeContainerMouseLeave}
                // className="flex items-center"
                className={`flex items-center ${fullscreen && "pl-130"}`}
              >
                <button onClick={toggleMute} className="">
                  {volume === 0 ? (
                    <VolumeX />
                  ) : volume < 0.3 ? (
                    <VolumeOff />
                  ) : volume < 0.7 ? (
                    <VolumeLow />
                  ) : (
                    <VolumeHigh />
                  )}
                </button>
                {/* Volume Bar */}
                <div
                  ref={volumeSliderRef}
                  className={`transition-all duration-200 flex items-center translate-y-[-3px] pl-2  ${
                    showVolumeSlider ? "w-30 opacity-100" : "w-0 opacity-0"
                  }`}
                  onMouseLeave={handleVolumeSliderMouseLeave}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={changeVolume}
                    className="w-full volume-slider"
                  />
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-green-500 absolute left-1/2 -translate-x-1/2 pb-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className={`translate-y-[-0px] ${fullscreen && "pr-130"}`}
              >
                <FullScreen />
              </button>
            </div>

            {/* Progress Bar */}
            <div className={`${fullscreen && "pb-8 px-4 py-2 m-auto w-3/5"} `}>
              <div
                ref={progressBarRef}
                className="h-1 bg-green-900 cursor-pointer relative group"
                onClick={handleProgressChange}
                onMouseMove={handleProgressHover}
                onMouseLeave={handleProgressLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Progress */}
                <div
                  className="h-full bg-green-500 "
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />

                {/* Handle */}
                {/* <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500  opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${(currentTime / duration) * 100}%`,
                    marginLeft: "-6px",
                  }}
                /> */}

                {/* Hover preview */}
                {hoverTime !== null && (
                  <>
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 "
                      style={{ width: `${(hoverTime / duration) * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
                      style={{
                        left: `${hoverX}%`,
                        marginLeft: "-6px",
                      }}
                    />
                  </>
                )}

                {/* Hover timestamp */}
                {hoverTime !== null && (
                  <div
                    className="absolute -top-8 text-xs bg-black text-green-500 px-2 py-1 rounded"
                    style={{
                      left: `${hoverX}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}

                {/* Hover thumbnail */}
                {hoverTime !== null && spriteSrc && (
                  <div
                    className="absolute -top-32 w-40 h-22 overflow-hidden border-2 border-white rounded-lg shadow-lg"
                    style={{
                      left: `${hoverX}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Image
                      src={spriteSrc}
                      alt="Thumbnail"
                      width={320}
                      height={180}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
