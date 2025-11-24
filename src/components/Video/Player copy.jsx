"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import Image from "next/image";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";

import volumeHigh from "../../../public/icons/volume-icon-high.svg";
import volumeLow from "../../../public/icons/volume-icon-low.svg";
import volumeOff from "../../../public/icons/volume-icon-off.svg";
import volumeX from "../../../public/icons/volume-icon-x.svg";

export default function VimeoPlayer({ spriteSrc }) {
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

  const videoId = 1132948199;
  const playerInstanceRef = useRef(null);
  const hideControlsTimeout = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const vimeoPlayer = new Player(playerRef.current, {
      id: videoId,
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

  const getVolumeIcon = () => {
    if (volume === 0) return <Image src={volumeX} alt="volume-x" width={25} height={25} />;
    if (volume < 0.3) return <Image src={volumeOff} alt="volume-off" width={25} height={25} />;
    if (volume < 0.7)
      return (
        <svg
          width="24"
          height="24"
          className="text-player-controls"
          fill="currentColor"
          viewBox="0 0 600 600"
        >
          <path d="M501.6,5.392c-10.3-8.4-25.4-6.8-33.8,3.5-8.4,10.3-6.8,25.4,3.5,33.8,54.2,44,88.7,111,88.7,186.2s-34.5,142.2-88.7,186.3c-10.3,8.4-11.8,23.5-3.5,33.8,8.3,10.3,23.5,11.8,33.8,3.5,64.9-52.9,106.4-133.4,106.4-223.6S566.5,58.092,501.6,5.392ZM441.1,79.892c-10.3-8.4-25.4-6.8-33.8,3.5-8.4,10.3-6.8,25.4,3.5,33.8,32.5,26.4,53.2,66.6,53.2,111.7s-20.7,85.3-53.2,111.8c-10.3,8.4-11.8,23.5-3.5,33.8,8.3,10.3,23.5,11.8,33.8,3.5,43.2-35.2,70.9-88.9,70.9-149s-27.7-113.8-70.9-149v-.1ZM380.6,154.392c-10.3-8.4-25.4-6.8-33.8,3.5-8.4,10.3-6.8,25.4,3.5,33.8,10.8,8.8,17.7,22.2,17.7,37.2s-6.9,28.4-17.7,37.3c-10.3,8.4-11.8,23.5-3.5,33.8,8.3,10.3,23.5,11.8,33.8,3.5,21.5-17.7,35.4-44.5,35.4-74.6s-13.9-56.9-35.4-74.5ZM48,324.892h48l134.1,119.2c6.4,5.7,14.6,8.8,23.1,8.8,19.2,0,34.8-15.6,34.8-34.8V39.692c0-19.2-15.6-34.8-34.8-34.8-8.5,0-16.7,3.1-23.1,8.8l-134.1,119.2h-48c-26.5,0-48,21.5-48,48v96c0,26.5,21.5,48,48,48Z" />
        </svg>
      );
    return (
      <Image src={volumeHigh} alt="volume-high" width={25} height={25} className="color-red-300" />
    );
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

        {/* ========== FULLSCREEN OVERLAY CONTROLS ========== */}
        {
          <div
            className={`absolute bottom-0 left-0 w-full z-30 text-white transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            } bg-black/60 backdrop-blur-sm`}
          >
            {/* Top Row */}
            <div className="flex justify-between items-center px-4 py-3">
              {/* Volume */}
              <div
                ref={volumeContainerRef}
                onMouseEnter={handleVolumeContainerMouseEnter}
                onMouseLeave={handleVolumeContainerMouseLeave}
                className="flex items-center space-x-2"
              >
                <button onClick={toggleMute} className="p-1">
                  {getVolumeIcon()}
                </button>

                <div
                  ref={volumeSliderRef}
                  className={`transition-all duration-200 flex items-center ${
                    showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"
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
                    className="w-full"
                  />
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button onClick={toggleFullscreen}>⛶</button>
            </div>

            {/* Progress Bar */}
            <div className={`${fullscreen && "pb-4 px-4"} `}>
              <div
                ref={progressBarRef}
                className="h-2 bg-gray-500 rounded cursor-pointer relative group"
                onClick={handleProgressChange}
                onMouseMove={handleProgressHover}
                onMouseLeave={handleProgressLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Progress */}
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />

                {/* Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${(currentTime / duration) * 100}%`,
                    marginLeft: "-6px",
                  }}
                />

                {/* Hover preview */}
                {hoverTime !== null && (
                  <>
                    <div
                      className="absolute top-0 left-0 h-full bg-green-300 opacity-50"
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
                    className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded"
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

      {/* ========== NORMAL MODE CONTROLS BELOW VIDEO ========== */}

      {!fullscreen && (
        <div
          className={`flex flex-col mt-2 text-white rounded transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } bg-gray-700`}
        >
          <div className="flex justify-between items-center px-4 py-2">
            {/* Volume */}
            <div
              ref={volumeContainerRef}
              onMouseEnter={handleVolumeContainerMouseEnter}
              onMouseLeave={handleVolumeContainerMouseLeave}
              className="flex items-center space-x-2"
            >
              <button onClick={toggleMute} className="p-1">
                {getVolumeIcon()}
              </button>

              <div
                ref={volumeSliderRef}
                className={`transition-all duration-200 flex items-center ${
                  showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"
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
                  className="w-full"
                />
              </div>
            </div>

            {/* Time */}
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button onClick={toggleFullscreen}>⛶</button>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div
              ref={progressBarRef}
              className="h-2 bg-gray-500 rounded relative cursor-pointer group"
              onClick={handleProgressChange}
              onMouseMove={handleProgressHover}
              onMouseLeave={handleProgressLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />

              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                  marginLeft: "-6px",
                }}
              />

              {hoverTime !== null && (
                <>
                  <div
                    className="absolute top-0 left-0 h-full bg-green-300 opacity-50"
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

              {hoverTime !== null && (
                <div
                  className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded"
                  style={{
                    left: `${hoverX}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}

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
      )}
    </div>
  );
}
