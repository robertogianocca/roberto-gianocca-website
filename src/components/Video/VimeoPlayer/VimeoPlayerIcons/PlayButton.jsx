import VideoPlayerIconsWrapper from "./VideoPlayerIconsWrapper";

export default function PlayButton({ size = 96, className = "" }) {
  return (
    <VideoPlayerIconsWrapper size={size} className={className}>
      <path d="M22.858,0C10.234,0,0,10.234,0,22.858s10.234,22.858,22.858,22.858,22.858-10.234,22.858-22.858S35.483,0,22.858,0ZM15.826,34.207V11.077l20.032,11.565-20.032,11.565Z" />
    </VideoPlayerIconsWrapper>
  );
}
