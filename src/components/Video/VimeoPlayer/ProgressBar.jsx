"use client";

export default function ProgressBar({
  duration,
  currentTime,
  hoverTime,
  hoverX,
  onProgressChange,
  onProgressHover,
  onProgressLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  formatTime,
}) {
  return (
    <div
      className="h-1 bg-green-900 cursor-pointer relative group"
      onClick={onProgressChange}
      onMouseMove={onProgressHover}
      onMouseLeave={onProgressLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="h-full bg-green-500"
        style={{
          width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
        }}
      />

      {hoverTime !== null && (
        <>
          <div
            className="absolute top-0 left-0 h-full bg-green-500"
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
          className="absolute -top-8 text-xs bg-black text-green-500 px-2 py-1 rounded"
          style={{
            left: `${hoverX}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}
