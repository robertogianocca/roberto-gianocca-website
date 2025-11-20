import Wrapper from "@/components/Wrapper/Wrapper";
import VimeoPlayer from "@/components/Video/Player";

export default function HomePage() {
  return (
    <div>
      <Wrapper>
        <VimeoPlayer videoId="76979871" />
      </Wrapper>
    </div>
  );
}
