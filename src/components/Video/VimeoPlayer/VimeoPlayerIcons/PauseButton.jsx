import VideoPlayerIconsWrapper from "./VideoPlayerIconsWrapper";

export default function PauseButton({ size = 96, className = "" }) {
  return (
    <VideoPlayerIconsWrapper size={size} className={className}>
      <path d="M22.858,0C10.234,0,0,10.234,0,22.858s10.234,22.858,22.858,22.858,22.858-10.234,22.858-22.858S35.483,0,22.858,0ZM18.758,33.427h-6.266V12.289h6.266v21.138ZM32.941,33.427h-6.266V12.289h6.266v21.138Z" />
    </VideoPlayerIconsWrapper>
  );
}
