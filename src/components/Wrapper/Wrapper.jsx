export default function Wrapper({ children, addClass = "" }) {
  return (
    // <main
    //   className={`min-h-[calc(100vh)] w-full pt-4 xl:pt-8 px-4 lg:px-6 xl:pl-14 xl:pr-24 pb-20 border-1 ${addClass}`}
    // >
    <main className={`min-h-[calc(100vh)] w-full p-6 ${addClass}`}>{children}</main>
  );
}
