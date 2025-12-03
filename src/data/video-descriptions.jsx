import Image from "next/image";
import CreditsName from "../components/Credits/CreditsName";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";

export const videoDescriptions = {
  "sugar-mama": (
    <div className="relative w-full flex flex-col flex-nowrap lg:flex-row lg:flex-wrap font-jet-brains text-2xs text-credits mb-4 mt-4 opacity-60">
      <p>
        Direction, Editing, Post-production:<CreditsName>Roberto Gianocca</CreditsName>
      </p>
      <p>
        Assistant Director:
        <CreditsName>Shondel Bervini</CreditsName>
      </p>

      <p>
        Styling & Costumes:
        <CreditsName>Shondel Bervini, Sofia Buob</CreditsName>
      </p>
      <p>
        Make-up & Hair:
        <CreditsName>Sofia Buob</CreditsName>
      </p>
      <p>
        Performers:
        <CreditsName>Matt Pascale, Sofia Buob, Shondel Bervini</CreditsName>
      </p>
      <p>
        Special Thanks:
        <CreditsName>
          Elia Squartini, Gianni Muggeo, Andrea Zanni, Alan Fraquelli, Maurizio Faggi, Giulia
          Campiglia, Wabi the Dog
        </CreditsName>
      </p>

      {/* Image Carousel */}
      {/* <div className="my-8">
        <ImageCarousel
          images={[
            "/video-thumbnails/sugar-mama-thumb_01.jpg",
            "/video-thumbnails/sugar-mama-thumb_02.jpg",
            "/video-thumbnails/sugar-mama-thumb_03.jpg",
            "/video-thumbnails/sugar-mama-thumb_04.jpg",
            "/video-thumbnails/sugar-mama-thumb_05.jpg",
          ]}
          speed={30}
        />
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        {/* <p>
          Cras malesuada, mi vitae molestie venenatis, urna augue tincidunt est, vitae semper lorem
          nulla eget erat. In condimentum turpis non augue condimentum, sit amet ultricies massa
          ullamcorper. Mauris auctor pretium diam, a consequat purus varius id. Aliquam eu dignissim
          urna, in pellentesque risus. Integer consectetur eu nisl in scelerisque.
        </p>
        <p>
          Cras malesuada, mi vitae molestie venenatis, urna augue tincidunt est, vitae semper lorem
          nulla eget erat. In condimentum turpis non augue condimentum, sit amet ultricies massa
          ullamcorper. Mauris auctor pretium diam, a consequat purus varius id. Aliquam eu dignissim
          urna, in pellentesque risus. Integer consectetur eu nisl in scelerisque.
        </p> */}
        {/* <div className="col-span-2 rounded-sm bg-red-300 shadow-xl/30 overflow-hidden">
          <Image
            src="/video/sugar-mama/sugar-mama-backstage-01.webp"
            alt=""
            width={3000}
            height={3000}
            className="rounded-b-sm"
          />
        </div> */}
      </div>
      <div className="py-6"></div>
    </div>
  ),
};
