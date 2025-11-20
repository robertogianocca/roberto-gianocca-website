export default function Wrapper({ children, addClass = "" }) {
  return (
    <main
      className={`min-h-[calc(100vh-60px)] w-full mt-[60px] pt-4 xl:pt-8 px-4 lg:px-6 xl:pl-14 xl:pr-24 pb-20 bg-custom-grey ${addClass}`}
    >
      {children}
    </main>
  );
}
