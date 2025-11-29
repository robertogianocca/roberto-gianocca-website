"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import Player from "@vimeo/player";

import PlayerControls from "./PlayerControls";
import PlayerCursor from "./PlayerCursor";
import PlayerPlaceholder from "./PlayerPlaceholder";

export default function VimeoPlayer({ vimeoId, thumbnail }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

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
  const cursorPositionInitialized = useRef(false);

  // Configurazione zona di esclusione (puoi modificare questo valore)
  const EXCLUSION_ZONE_HEIGHT = 90; // px dal fondo

  const playerInstanceRef = useRef(null);
  const hideControlsTimeout = useRef(null);

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
    vimeoPlayer.on("playing", () => {
      setPlaying(true);
    });
    vimeoPlayer.on("paused", () => {
      setPlaying(false);
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
      setPlaying(false); // Reset playing state immediately
      
      // Reset cursor position when switching videos to prevent showing at old position
      setCursorPosition({ x: 0, y: 0 });
      cursorPositionInitialized.current = false;
      
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
          // Double-check that player is paused after loading
          return playerInstanceRef.current.getPaused();
        })
        .then((paused) => {
          // Sync state with actual player state
          setPlaying(!paused);
        })
        .catch((error) => {
          console.error("Error loading video:", error);
          setIsPlayerReady(true); // Set ready even on error to hide thumbnail
          setPlaying(false); // Ensure playing state is false on error
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

  const togglePlay = async () => {
    if (!playerInstanceRef.current) return;
    
    // Trigger click animation
    setShowClickAnimation(true);
    setTimeout(() => setShowClickAnimation(false), 400);
    
    try {
      const isPaused = await playerInstanceRef.current.getPaused();
      
      if (isPaused) {
        await playerInstanceRef.current.play();
        setPlaying(true);
        startHideControlsTimer();
      } else {
        await playerInstanceRef.current.pause();
        setPlaying(false);
        setShowControls(true);
        clearHideControlsTimer();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
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
        // Always update cursor position from actual mouse event
        const newPosition = {
          x: e.clientX,
          y: e.clientY,
        };
        setCursorPosition(newPosition);
        setShowCustomCursor(true);
        cursorPositionInitialized.current = true;
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
      <PlayerCursor
        isVisible={
          showCustomCursor && !isInExclusionZone && cursorPositionInitialized.current
        }
        cursorPosition={cursorPosition}
        showClickAnimation={showClickAnimation}
        playing={playing}
        isPlayerReady={isPlayerReady}
      />

      {/* VIDEO WRAPPER */}
      <div
        className={`relative w-full ${fullscreen ? "h-screen" : "aspect-video"} ${
          playing && !showControls ? "cursor-none" : ""
        }`}
      >
        <PlayerPlaceholder thumbnail={thumbnail} isPlayerReady={isPlayerReady} />

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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
