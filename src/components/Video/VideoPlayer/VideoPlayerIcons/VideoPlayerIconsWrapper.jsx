export default function VideoPlayerIconsWrapper({ size = 24, className = "", children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`text-player-controls ${className}`}
      fill="currentColor"
    >
      {children}
    </svg>
  );
}
