import Wrapper from "@/components/Wrapper/Wrapper";
import VimeoPlayer from "@/components/Video/Player";
import { videoDataBase } from "@/data/video-data-base";

export default function HomePage() {
  const videoCards = videoDataBase.map((video) => {
    return (
      <div key={video.id} className="mb-4 grid grid-cols-2">
        <div>
          <h2>{video.title}</h2>
          <h3>{video.subtitle}</h3>
          <p>
            Curabitur tellus neque, gravida ac lectus vel, faucibus rhoncus diam. Cras elementum
            vulputate ligula id vehicula. Sed diam risus, posuere id luctus eget, malesuada sed est.
            Proin placerat aliquet fermentum. Nullam est elit, laoreet ut justo quis, bibendum
            consectetur diam. Suspendisse quis lacinia eros. Mauris tempor nisi dolor. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div>
          <VimeoPlayer vimeoId={video.vimeoId} />
        </div>
      </div>
    );
  });

  return (
    <div>
      <Wrapper>
        <div className="main-grid">
          <div>
            Cras malesuada, mi vitae molestie venenatis, urna augue tincidunt est, vitae semper
            lorem nulla eget erat. In condimentum turpis non augue condimentum, sit amet ultricies
            massa ullamcorper. Mauris auctor pretium diam, a consequat purus varius id. Aliquam eu
            dignissim urna, in pellentesque risus. Integer consectetur eu nisl in scelerisque. Sed
            in ullamcorper erat, non pharetra sapien. Vivamus accumsan augue in varius aliquet.
            Aenean eget blandit elit, elementum rhoncus nisl. Curabitur tellus neque, gravida ac
            lectus vel, faucibus rhoncus diam. Cras elementum vulputate ligula id vehicula. Sed diam
            risus, posuere id luctus eget, malesuada sed est. Proin placerat aliquet fermentum.
            Nullam est elit, laoreet ut justo quis, bibendum consectetur diam. Suspendisse quis
            lacinia eros. Mauris tempor nisi dolor. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </div>
          <div className="col-span-2">{videoCards}</div>
        </div>
      </Wrapper>
    </div>
  );
}
