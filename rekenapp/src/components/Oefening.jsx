import { useState, useEffect, useCallback } from "react";
import {
  genereerRonde,
  berekenSterren,
  berekeningScore,
  genereerAntwoordOpties,
} from "../utils/oefeningen.js";
import { VRAGEN_PER_RONDE } from "../data/curriculum.js";
import Voortgangsbalk from "./Voortgangsbalk.jsx";

const FEEDBACK_DUUR = 1200;

export default function Oefening({ level, graad, onKlaar, onTerug }) {
  const [oefeningen] = useState(() =>
    genereerRonde(graad, VRAGEN_PER_RONDE)
  );
  const [huidigIndex, setHuidigIndex] = useState(0);
  const [antwoordOpties, setAntwoordOpties] = useState([]);
  const [gekozenAntwoord, setGekozenAntwoord] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [resultaten, setResultaten] = useState([]);
  const [tijdOver, setTijdOver] = useState(graad.tijdslimiet);
  const [tijdBevrozen, setTijdBevrozen] = useState(false);

  const huidigeOefening = oefeningen[huidigIndex];

  useEffect(() => {
    setAntwoordOpties(genereerAntwoordOpties(huidigeOefening));
    setGekozenAntwoord(null);
    setFeedback(null);
  }, [huidigIndex, huidigeOefening]);

  useEffect(() => {
    setTijdOver(graad.tijdslimiet);
    setTijdBevrozen(false);
  }, [huidigIndex, graad.tijdslimiet]);

  useEffect(() => {
    if (tijdBevrozen) return;
    if (tijdOver <= 0) {
      verwerkAntwoord(null);
      return;
    }
    const timer = setTimeout(() => setTijdOver((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [tijdOver, tijdBevrozen]);

  const verwerkAntwoord = useCallback(
    (gekozen) => {
      if (gekozenAntwoord !== null || feedback !== null) return;
      setTijdBevrozen(true);

      const juist =
        gekozen !== null &&
        parseFloat(gekozen) === parseFloat(huidigeOefening.antwoord);

      setGekozenAntwoord(gekozen);
      setFeedback(juist ? "juist" : "fout");

      const nieuwResultaat = {
        oefening: huidigeOefening,
        gekozen,
        juist,
      };

      setTimeout(() => {
        const nieuweResultaten = [...resultaten, nieuwResultaat];
        setResultaten(nieuweResultaten);

        if (huidigIndex + 1 >= oefeningen.length) {
          const goedBeantwoord = nieuweResultaten.filter((r) => r.juist).length;
          const score = berekeningScore(goedBeantwoord, oefeningen.length);
          const sterren = berekenSterren(score);
          onKlaar(nieuweResultaten, score, sterren);
        } else {
          setHuidigIndex((i) => i + 1);
        }
      }, FEEDBACK_DUUR);
    },
    [
      gekozenAntwoord,
      feedback,
      huidigeOefening,
      huidigIndex,
      oefeningen,
      resultaten,
      onKlaar,
    ]
  );

  const tijdKleur =
    tijdOver > 10 ? "#4ECDC4" : tijdOver > 5 ? "#FFD700" : "#FF6B6B";

  return (
    <div className="oefening">
      <div className="oefening__top">
        <button className="terug-knop" onClick={onTerug}>
          ← Terug
        </button>
        <div className="oefening__info">
          <span className="oefening__level">
            {level.emoji} {level.leerjaar} — {graad.naam}
          </span>
        </div>
        <div
          className="oefening__timer"
          style={{ color: tijdKleur, borderColor: tijdKleur }}
        >
          ⏱ {tijdOver}s
        </div>
      </div>

      <Voortgangsbalk huidig={huidigIndex} totaal={oefeningen.length} />

      <div
        className={`oefening__kaart ${feedback === "juist" ? "oefening__kaart--juist" : ""} ${feedback === "fout" ? "oefening__kaart--fout" : ""}`}
      >
        {feedback && (
          <div className="oefening__feedback">
            {feedback === "juist" ? (
              <span className="feedback-juist">✓ Super!</span>
            ) : (
              <span className="feedback-fout">
                ✗ Het antwoord is {huidigeOefening.antwoord}
              </span>
            )}
          </div>
        )}

        <div className="oefening__vraag">{huidigeOefening.vraag}</div>

        <div className="antwoord-opties">
          {antwoordOpties.map((optie, i) => {
            let klasse = "antwoord-knop";
            if (feedback !== null) {
              if (parseFloat(optie) === parseFloat(huidigeOefening.antwoord)) {
                klasse += " antwoord-knop--juist";
              } else if (optie === gekozenAntwoord) {
                klasse += " antwoord-knop--fout";
              }
            }
            return (
              <button
                key={i}
                className={klasse}
                onClick={() => verwerkAntwoord(optie)}
                disabled={feedback !== null}
              >
                {optie}
              </button>
            );
          })}
        </div>
      </div>

      <div className="oefening__score-balk">
        {resultaten.map((r, i) => (
          <span
            key={i}
            className={`score-bolletje ${r.juist ? "score-bolletje--juist" : "score-bolletje--fout"}`}
          >
            {r.juist ? "✓" : "✗"}
          </span>
        ))}
        {Array.from(
          { length: oefeningen.length - resultaten.length },
          (_, i) => (
            <span key={`leeg-${i}`} className="score-bolletje score-bolletje--leeg">
              ○
            </span>
          )
        )}
      </div>
    </div>
  );
}
