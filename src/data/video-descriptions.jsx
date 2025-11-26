import Image from "next/image";
import CreditsName from "../components/Credits/CreditsName";

export const videoDescriptions = {
  "sugar-mama": (
    <div className="relative aspect-auto">
      <p className="text-credits mb-4 mt-4">
        Song Composers:
        <CreditsName>Mattia Pascale - Matteo Magnaterra - Fabrizio Grossi </CreditsName>
        Video Director:<CreditsName>Roberto Gianocca</CreditsName> Assistant Director:
        <CreditsName>Shondel Bervini</CreditsName> Editing & Post-production:
        <CreditsName>Roberto Gianocca</CreditsName> Executive Producers:
        <CreditsName>Roberto Gianocca - Paolo Maspoli</CreditsName>
        Styling & Costumes: <CreditsName>Shondel Bervini</CreditsName> Make-up & Hair:
        <CreditsName>Sofia Buob</CreditsName> Performers:
        <CreditsName>Matt Pascale - Sofia Buob - Shondel Bervini</CreditsName> Special Thanks:
        <CreditsName>
          Elia Squartini - Gianni Muggeo - Andrea Zanni - Alan Fraquelli - Maurizio Faggi - Giulia
          Campiglia - Wabi the Dog
        </CreditsName>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <p>
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
        </p>
        <div className="col-span-2 rounded-sm bg-red-300 shadow-xl/30 overflow-hidden">
          <Image
            src="/video/sugar-mama/sugar-mama-backstage-01.webp"
            alt=""
            width={3000}
            height={3000}
            className="rounded-b-sm"
          />
        </div>
      </div>
      <div className="py-6"></div>
    </div>
  ),
};
