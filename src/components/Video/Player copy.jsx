"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import Image from "next/image";
import { FaCirclePlay } from "react-icons/fa6";

export default function VimeoPlayer({ spriteSrc }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const volumeAreaRef = useRef(null);
  const volumeSliderRef = useRef(null);

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

  const videoId = 1132948199;
  const playerInstanceRef = useRef(null);
  const hideControlsTimeout = useRef(null);

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

    return () => vimeoPlayer.destroy();
  }, []);

  const startHideControlsTimer = () => {
    clearHideControlsTimer();
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };

  const clearHideControlsTimer = () => {
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
  };

  const togglePlay = () => {
    if (!playerInstanceRef.current) return;
    if (playing) {
      playerInstanceRef.current.pause();
    } else {
      playerInstanceRef.current.play();
      // Hide controls immediately when playing
      setShowControls(false);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleMouseMove = () => {
    if (!playing) {
      setShowControls(true);
    } else {
      setShowControls(true);
      startHideControlsTimer();
    }
  };

  const handleProgressChange = (e) => {
    if (!playerInstanceRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
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
    if (!fullscreen) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
    setFullscreen(!fullscreen);
  };

  const changeVolume = (e) => {
    if (!playerInstanceRef.current) return;
    const v = parseFloat(e.target.value);
    playerInstanceRef.current.setVolume(v);
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

  const handleVolumeAreaMouseEnter = () => setShowVolumeSlider(true);
  const handleVolumeAreaMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (volumeSliderRef.current && volumeSliderRef.current.contains(relatedTarget)) return;
    setTimeout(() => {
      if (
        volumeAreaRef.current &&
        volumeSliderRef.current &&
        !volumeAreaRef.current.matches(":hover") &&
        !volumeSliderRef.current.matches(":hover")
      ) {
        setShowVolumeSlider(false);
      }
    }, 100);
  };
  const handleVolumeSliderMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (volumeAreaRef.current && volumeAreaRef.current.contains(relatedTarget)) return;
    setTimeout(() => {
      if (
        volumeAreaRef.current &&
        volumeSliderRef.current &&
        !volumeAreaRef.current.matches(":hover") &&
        !volumeSliderRef.current.matches(":hover")
      ) {
        setShowVolumeSlider(false);
      }
    }, 100);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "🔇";
    if (volume < 0.3) return "🔈";
    if (volume < 0.7) return "🔉";
    return "🔊";
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="max-w-3xl mx-auto p-4 bg-gray-700 relative"
      onMouseMove={handleMouseMove}
    >
      {/* Entire clickable video surface */}
      <div
        ref={playerRef}
        className="vimeo-player w-full aspect-video relative cursor-pointer"
        onClick={handleVideoClick}
      >
        {/* Play button (only when paused) */}
        {!playing && (
          <button
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 hover:bg-black rounded-full transition-opacity duration-300`}
            onClick={togglePlay}
          >
            <FaCirclePlay size="90px" />
          </button>
        )}

        {/* Pause overlay button (appear only when playing AND controls visible) */}
        {playing && (
          <button
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 hover:bg-black rounded-full transition-opacity duration-300 pointer-events-none ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-white text-4xl">⏸️</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div
        className={`flex flex-col justify-between mt-2 bg-gray-700 text-white rounded transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between px-4">
          <div>
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex">
            <div
              ref={volumeAreaRef}
              className="relative flex items-center"
              onMouseEnter={handleVolumeAreaMouseEnter}
              onMouseLeave={handleVolumeAreaMouseLeave}
            >
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">
                  {getVolumeIcon()}
                </span>
              </button>

              {showVolumeSlider && (
                <div
                  ref={volumeSliderRef}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-4 bg-gray-800 rounded-xl shadow-2xl border border-gray-600"
                  onMouseLeave={handleVolumeSliderMouseLeave}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <span className="text-xs text-gray-300 font-medium">
                      {Math.round(volume * 100)}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={changeVolume}
                      className="h-24 w-3 accent-green-500 cursor-pointer bg-gray-600 rounded-full"
                      orient="vertical"
                      style={{ writingMode: "bt-lr", WebkitAppearance: "slider-vertical" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="w-5 h-5 flex items-center justify-center text-lg">⛶</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div
            className="h-2 bg-gray-500 rounded cursor-pointer relative group"
            onClick={handleProgressChange}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            <div
              className="h-2 bg-green-500 rounded transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>

            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: "-6px" }}
            ></div>

            {hoverTime !== null && (
              <>
                <div
                  className="h-2 bg-green-300 rounded absolute top-0 left-0 opacity-50 pointer-events-none"
                  style={{ width: `${(hoverTime / duration) * 100}%` }}
                ></div>
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full pointer-events-none"
                  style={{ left: `${hoverX}%`, marginLeft: "-6px" }}
                ></div>
              </>
            )}

            {hoverTime !== null && (
              <div
                className="absolute -top-8 text-xs text-white bg-black px-2 py-1 rounded pointer-events-none whitespace-nowrap"
                style={{ left: `${hoverX}%`, transform: "translateX(-50%)" }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            {hoverTime !== null && spriteSrc && (
              <div
                className="absolute -top-32 w-40 h-22 pointer-events-none rounded-lg overflow-hidden border-2 border-white shadow-lg"
                style={{ left: `${hoverX}%`, transform: "translateX(-50%)" }}
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
    </div>
  );
}
