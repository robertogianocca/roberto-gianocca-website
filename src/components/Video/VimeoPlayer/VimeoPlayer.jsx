"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import Player from "@vimeo/player";

import PlayerVolume from "./PlayerVolume";

import PlayButton from "./VimeoPlayerIcons/PlayButton";
import PauseButton from "./VimeoPlayerIcons/PauseButton";
import FullScreen from "./VimeoPlayerIcons/FullScreen";

export default function VimeoPlayer({ vimeoId, thumbnail, spriteSrc }) {
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
  const [showControls, setShowControls] = useState(true);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);

  // Loading state for smooth transition
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  // Animation state for click feedback
  const [showClickAnimation, setShowClickAnimation] = useState(false);

  // Nuovi stati per il cursore personalizzato
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isInExclusionZone, setIsInExclusionZone] = useState(false);

  // Configurazione zona di esclusione (puoi modificare questo valore)
  const EXCLUSION_ZONE_HEIGHT = 90; // px dal fondo

  const playerInstanceRef = useRef(null);
  const hideControlsTimeout = useRef(null);
  const progressBarRef = useRef(null);
  const mouseMoveTimeout = useRef(null);

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
    
    // Reset duration and currentTime to prevent flicker
    setDuration(0);
    setCurrentTime(0);
    
    vimeoPlayer.getDuration().then((d) => setDuration(d));

    // Listen for the 'loaded' event to know when player is ready
    vimeoPlayer.on("loaded", () => {
      setIsPlayerReady(true);
      setShowControls(true);
      clearHideControlsTimer();
    });

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
      // Reset immediately to prevent flicker
      setCurrentTime(0);
      setDuration(0);
      setIsPlayerReady(false); // Reset player ready state when switching videos
      
      // Show controls when switching videos
      setShowControls(true);
      clearHideControlsTimer();
      
      // Don't hide player during video switch (only on initial load)
      playerInstanceRef.current
        .loadVideo(vimeoId)
        .then(() => {
          setCurrentTime(0);
          setPlaying(false);
          setIsPlayerReady(true); // Set player as ready after video loads
          playerInstanceRef.current.getDuration().then((d) => setDuration(d));
        })
        .catch((error) => {
          console.error("Error loading video:", error);
          setIsPlayerReady(true); // Set ready even on error to hide thumbnail
        });
    }
  }, [vimeoId]);

  // qui viene gestito il tempo di sparizione di tutti i controlli.
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

  const togglePlay = () => {
    if (!playerInstanceRef.current) return;
    
    // Trigger click animation
    setShowClickAnimation(true);
    setTimeout(() => setShowClickAnimation(false), 400);
    
    if (playing) playerInstanceRef.current.pause();
    else {
      playerInstanceRef.current.play();
      startHideControlsTimer();
    }
  };

  // FUNZIONE PER VERIFICARE SE IL MOUSE È NELLA ZONA DI ESCLUSIONE
  const checkIfInExclusionZone = useCallback((clientY, containerRect) => {
    if (!containerRect) return false;

    // Calcola la distanza dal fondo del container
    const distanceFromBottom = containerRect.bottom - clientY;

    // Se il mouse è entro EXCLUSION_ZONE_HEIGHT pixel dal fondo, è nella zona di esclusione
    return distanceFromBottom <= EXCLUSION_ZONE_HEIGHT;
  }, []);

  // MODIFICHE PER IL CURSORE PERSONALIZZATO
  const handleMouseEnter = () => {
    setShowCustomCursor(true);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowCustomCursor(false);
    setShowControls(false);
    setIsInExclusionZone(false);
    clearHideControlsTimer();
  };

  const handleMouseMove = useCallback(
    (e) => {
      setShowControls(true);

      // Ottieni le dimensioni del container
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // Verifica se il mouse è nella zona di esclusione
      const inExclusionZone = checkIfInExclusionZone(e.clientY, containerRect);
      setIsInExclusionZone(inExclusionZone);

      // Mostra il cursore custom solo se NON è nella zona di esclusione
      if (!inExclusionZone) {
        setShowCustomCursor(true);
        setCursorPosition({
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        setShowCustomCursor(false);
      }

      if (playing) {
        startHideControlsTimer();
      }
    },
    [playing, checkIfInExclusionZone]
  );

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

  // LOGICA VOLUME
  const changeVolume = (e) => {
    const v = parseFloat(e.target.value);
    playerInstanceRef.current?.setVolume(v);

    setVolume(v);
    if (v > 0) setPreviousVolume(v);
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;

    if (volume > 0) {
      playerInstanceRef.current.setVolume(0);
      setVolume(0);
    } else {
      playerInstanceRef.current.setVolume(previousVolume);
      setVolume(previousVolume);
    }
  };

  // Volume slider is now always visible, so we don't need these handlers
  const handleVolumeContainerMouseEnter = () => {};
  const handleVolumeContainerMouseLeave = () => {};
  const handleVolumeSliderMouseLeave = () => {};

  // --------

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`max-w-full relative ${
        fullscreen ? "!w-screen !h-screen !max-w-none p-0" : "max-w-3xl"
      } unused:bg-gray-700 ${showCustomCursor && !isInExclusionZone ? "cursor-none" : ""}`}
    >
      {/* CURSORE PERSONALIZZATO */}
      {showCustomCursor && !isInExclusionZone && (
        <motion.div
          className="fixed z-50 pointer-events-none mix-blend-exclusion"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: showClickAnimation ? [1, 1.3, 1] : 1,
            opacity: showClickAnimation ? [1, 0.8, 1] : 1,
          }}
          transition={{
            duration: 0.3,
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
      )}

      {/* VIDEO WRAPPER */}
      <div
        className={`relative w-full ${fullscreen ? "h-screen" : "aspect-video"} ${
          playing && !showControls ? "cursor-none" : ""
        }`}
      >
        {/* Thumbnail placeholder - shows while player is loading */}
        {thumbnail && (
          <div
            className={`absolute inset-0 z-5 transition-opacity duration-500 ${
              isPlayerReady ? "opacity-0 pointer-events-none" : "opacity-100 z-10"
            }`}
          >
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Vimeo iframe */}
        <div
          ref={playerRef}
          className={`vimeo-player w-full h-full transition-opacity duration-500 relative z-0 ${
            fullscreen ? "absolute inset-0" : ""
          } ${isPlayerReady ? "opacity-100" : "opacity-0"}`}
        ></div>

        {/* Overlay click area */}
        <div
          className="absolute inset-0 z-10"
          onClick={() => !isDraggingProgress && togglePlay()}
        ></div>

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
              <PlayerVolume
                volume={volume}
                onToggleMute={toggleMute}
                onVolumeChange={changeVolume}
                onEnterContainer={handleVolumeContainerMouseEnter}
                onLeaveContainer={handleVolumeContainerMouseLeave}
                onLeaveSlider={handleVolumeSliderMouseLeave}
                volumeContainerRef={volumeContainerRef}
                volumeSliderRef={volumeSliderRef}
                fullscreen={fullscreen}
              />

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
                  style={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                  }}
                />

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
