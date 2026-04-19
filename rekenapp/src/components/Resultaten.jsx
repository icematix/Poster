import Sterren from "./Sterren.jsx";

const BERICHTEN = {
  3: ["Fantastisch! Je bent een rekenster!", "Wauw! Perfect! Je bent geweldig!", "Bravo! Je hebt alles juist!"],
  2: ["Heel goed gedaan! Nog een beetje oefenen!", "Super! Bijna perfect!", "Goed werk! Je bent op de goede weg!"],
  1: ["Goed geprobeerd! Oefen nog wat meer.", "Niet slecht! Blijf oefenen!", "Je wordt elke dag beter!"],
  0: ["Niet getreurd! Probeer het opnieuw.", "Oefen nog wat meer, je kan het!", "Elke keer leer je bij!"],
};

function willekeurigBericht(sterren) {
  const lijst = BERICHTEN[sterren];
  return lijst[Math.floor(Math.random() * lijst.length)];
}

export default function Resultaten({
  level,
  graad,
  resultaten,
  score,
  sterren,
  onOpnieuw,
  onTerug,
}) {
  const goedBeantwoord = resultaten.filter((r) => r.juist).length;
  const bericht = willekeurigBericht(sterren);

  return (
    <div className="resultaten">
      <div className="resultaten__hoofd">
        <div className="resultaten__sterren-groot">
          <Sterren aantal={sterren} groot />
        </div>
        <h2 className="resultaten__bericht">{bericht}</h2>
        <div className="resultaten__score-cirkel">
          <span className="resultaten__score-getal">{score}%</span>
          <span className="resultaten__score-label">score</span>
        </div>
        <p className="resultaten__detail">
          {goedBeantwoord} van de {resultaten.length} vragen juist
        </p>
      </div>

      <div className="resultaten__overzicht">
        <h3>Overzicht</h3>
        <div className="resultaten__lijst">
          {resultaten.map((r, i) => (
            <div
              key={i}
              className={`resultaat-rij ${r.juist ? "resultaat-rij--juist" : "resultaat-rij--fout"}`}
            >
              <span className="resultaat-rij__nr">{i + 1}</span>
              <span className="resultaat-rij__vraag">{r.oefening.vraag.replace("= ?", "=")}</span>
              <span className="resultaat-rij__antwoord">
                {r.juist ? (
                  <span className="resultaat-juist">✓ {r.oefening.antwoord}</span>
                ) : (
                  <span className="resultaat-fout">
                    ✗ {r.gekozen ?? "—"} → {r.oefening.antwoord}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="resultaten__knoppen">
        <button className="knop knop--primair" onClick={onOpnieuw}>
          🔄 Opnieuw spelen
        </button>
        <button className="knop knop--secundair" onClick={onTerug}>
          🏠 Terug naar levels
        </button>
      </div>
    </div>
  );
}
