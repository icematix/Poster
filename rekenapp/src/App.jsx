import { useState } from "react";
import Thuis from "./components/Thuis.jsx";
import Oefening from "./components/Oefening.jsx";
import Resultaten from "./components/Resultaten.jsx";
import { slaVoortgangOp } from "./utils/voortgang.js";

const SCHERMEN = {
  THUIS: "thuis",
  OEFENING: "oefening",
  RESULTATEN: "resultaten",
};

export default function App() {
  const [scherm, setScherm] = useState(SCHERMEN.THUIS);
  const [geselecteerdLevel, setGeselecteerdLevel] = useState(null);
  const [geselecteerdeGraad, setGeselecteerdeGraad] = useState(null);
  const [rondeResultaten, setRondeResultaten] = useState(null);

  function handleStartOefening(level, graad) {
    setGeselecteerdLevel(level);
    setGeselecteerdeGraad(graad);
    setScherm(SCHERMEN.OEFENING);
  }

  function handleOefeningKlaar(resultaten, score, sterren) {
    slaVoortgangOp(geselecteerdLevel.id, geselecteerdeGraad.id, sterren, score);
    setRondeResultaten({ resultaten, score, sterren });
    setScherm(SCHERMEN.RESULTATEN);
  }

  function handleOpnieuw() {
    setScherm(SCHERMEN.OEFENING);
    setRondeResultaten(null);
  }

  function handleTerug() {
    setScherm(SCHERMEN.THUIS);
    setRondeResultaten(null);
  }

  return (
    <div className="app">
      {scherm === SCHERMEN.THUIS && (
        <Thuis onStartOefening={handleStartOefening} />
      )}
      {scherm === SCHERMEN.OEFENING && (
        <Oefening
          key={`${geselecteerdLevel?.id}-${geselecteerdeGraad?.id}-${Date.now()}`}
          level={geselecteerdLevel}
          graad={geselecteerdeGraad}
          onKlaar={handleOefeningKlaar}
          onTerug={handleTerug}
        />
      )}
      {scherm === SCHERMEN.RESULTATEN && rondeResultaten && (
        <Resultaten
          level={geselecteerdLevel}
          graad={geselecteerdeGraad}
          resultaten={rondeResultaten.resultaten}
          score={rondeResultaten.score}
          sterren={rondeResultaten.sterren}
          onOpnieuw={handleOpnieuw}
          onTerug={handleTerug}
        />
      )}
    </div>
  );
}
