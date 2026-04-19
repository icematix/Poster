export default function Sterren({ aantal, max = 3, groot = false }) {
  return (
    <div className={`sterren ${groot ? "sterren--groot" : ""}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`ster ${i < aantal ? "ster--actief" : "ster--leeg"}`}
        >
          {i < aantal ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
