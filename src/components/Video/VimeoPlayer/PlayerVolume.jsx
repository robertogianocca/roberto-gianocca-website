"use client";

import { useRef, useState, useEffect } from "react";
import VolumeX from "./VimeoPlayerIcons/VolumeX";
import VolumeOff from "./VimeoPlayerIcons/VolumeOff";
import VolumeLow from "./VimeoPlayerIcons/VolumeLow";
import VolumeHigh from "./VimeoPlayerIcons/VolumeHigh";

export default function PlayerVolume({ volume, onToggleMute, onVolumeChange, fullscreen }) {
  const sliderContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateVolumeFromPosition = (clientX) => {
    const container = sliderContainerRef.current;
    if (!container) return;

    // Get the input element inside the container
    const input = container.querySelector('input[type="range"]');
    if (!input) return;

    // Calculate position relative to the input element
    const inputRect = input.getBoundingClientRect();
    const clickX = clientX - inputRect.left;
    const width = inputRect.width;
    const percent = Math.max(0, Math.min(1, clickX / width));

    // Create a synthetic event for the onChange handler
    const syntheticEvent = {
      target: {
        value: percent.toString(),
      },
    };

    onVolumeChange(syntheticEvent);
  };

  const handleSliderMouseDown = (e) => {
    // Don't handle if it's on the input itself (let the input handle it)
    if (e.target.tagName === "INPUT") return;

    e.preventDefault();
    setIsDragging(true);
    updateVolumeFromPosition(e.clientX);
  };

  const handleSliderMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      updateVolumeFromPosition(e.clientX);
    }
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move and up globally when dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => {
        updateVolumeFromPosition(e.clientX);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={`flex items-center cursor-pointer ${fullscreen ? "pl-130" : ""}`}>
      {/* Volume Icon */}
      <button onClick={onToggleMute} className="cursor-pointer p-2 -m-2">
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

      {/* Slider - Always visible with bigger clickable area */}
      <div
        ref={(node) => {
          sliderContainerRef.current = node;
        }}
        className="hidden sm:flex items-center translate-y-[-3px] pl-2 w-30 opacity-100 cursor-pointer py-2 -my-2 relative select-none"
        onMouseDown={handleSliderMouseDown}
        onMouseMove={handleSliderMouseMove}
        onMouseUp={handleSliderMouseUp}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-full volume-slider cursor-pointer"
        />
      </div>
    </div>
  );
}
