export default function Voortgangsbalk({ huidig, totaal }) {
  const percentage = Math.round((huidig / totaal) * 100);
  return (
    <div className="voortgangsbalk">
      <div className="voortgangsbalk__track">
        <div
          className="voortgangsbalk__vulling"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="voortgangsbalk__tekst">
        {huidig} / {totaal}
      </span>
    </div>
  );
}
