export default function Background({ color }) {
  return (
    <div className="fixed inset-0 -z-50">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat filter grayscale brightness-65"
        style={{
          backgroundImage: "url('/textures/texture-background-01.webp')",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-color"
        style={{
          backgroundColor: color, // dynamic color here
          opacity: 0.3,
        }}
      />
    </div>
  );
}
