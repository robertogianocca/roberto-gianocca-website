"use client";

import VolumeX from "./VimeoPlayerIcons/VolumeX";
import VolumeOff from "./VimeoPlayerIcons/VolumeOff";
import VolumeLow from "./VimeoPlayerIcons/VolumeLow";
import VolumeHigh from "./VimeoPlayerIcons/VolumeHigh";

export default function PlayerVolume({
  volume,
  showVolumeSlider,
  onToggleMute,
  onVolumeChange,
  onEnterContainer,
  onLeaveContainer,
  onLeaveSlider,
  volumeContainerRef,
  volumeSliderRef,
  fullscreen,
}) {
  return (
    <div
      ref={volumeContainerRef}
      onMouseEnter={onEnterContainer}
      onMouseLeave={onLeaveContainer}
      className={`flex items-center ${fullscreen ? "pl-130" : ""}`}
    >
      {/* Volume Icon */}
      <button onClick={onToggleMute}>
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

      {/* Slider */}
      <div
        ref={volumeSliderRef}
        className={`transition-all duration-200 flex items-center translate-y-[-3px] pl-2  
          ${showVolumeSlider ? "w-30 opacity-100" : "w-0 opacity-0"}`}
        onMouseLeave={onLeaveSlider}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-full volume-slider"
        />
      </div>
    </div>
  );
}
