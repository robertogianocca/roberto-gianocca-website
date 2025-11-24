import Image from "next/image";

export const videoDescriptions = {
  "sugar-mama": (
    <div className="relative aspect-auto">
      <p className="text-amber-200 mb-4 mt-4">
        Composers: Mattia Pascale – Matteo Magnaterra – Fabrizio GrossiDirector: Roberto
        GianoccaAssistant Director: Shondel BerviniEditing: Roberto GianoccaExecutive Producers:
        Roberto Gianocca, Paolo MaspoliStyling & Costumes: Shondel BerviniMake-up & Hair: Sofia
        BuobMatt PascaleSofia BuobShondel BerviniCasino di Campione d'ItaliaSalone delle Feste –
        Campione d'ItaliaRistorante di Riviera – AFM RivieraPalazzo dell'Arch. Mario BottaSilver
        EventsElia SquartiniCasino di Campione d'ItaliaGianni MuggeoAndrea ZanniGiulia Campiglia
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
