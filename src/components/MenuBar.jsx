import Link from "next/link";

export default function MenuBar({ onNavigate }) {
  return (
    <nav className="flex flex-col justify-center text-green-400 opacity-45">
      <div>
        <ul className="text-2xl pb-10 space-y-4">
          <li>
            <Link
              href="/video"
              onClick={onNavigate}
              className="transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full px-4"
            >
              Video
            </Link>
          </li>
          <li>
            <button className="transition-colors hover:text-white">Contact</button>
          </li>
        </ul>
        <p>
          Cras malesuada, mi vitae molestie venenatis, urna augue tincidunt est, vitae semper lorem
          nulla eget erat. In condimentum turpis non augue condimentum, sit amet ultricies massa
          ullamcorper. Mauris auctor pretium diam, a consequat purus varius id. Aliquam eu dignissim
          urna, in pellentesque risus. Integer consectetur eu nisl in scelerisque.
        </p>
      </div>
    </nav>
  );
}
