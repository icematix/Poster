import { LEVELS } from "../data/curriculum.js";
import { haalVoortgangOp, isLevelVrijgespeeld, isGraadVrijgespeeld } from "../utils/voortgang.js";
import Sterren from "./Sterren.jsx";

export default function Thuis({ onStartOefening }) {
  return (
    <div className="thuis">
      <header className="thuis__header">
        <h1 className="thuis__titel">
          <span className="thuis__emoji">🧮</span>
          Rekenapp Vlaanderen
        </h1>
        <p className="thuis__ondertitel">
          Leer rekenen zoals op school — stap voor stap!
        </p>
      </header>

      <div className="levels-lijst">
        {LEVELS.map((level) => {
          const vrijgespeeld = isLevelVrijgespeeld(level.id);
          return (
            <div
              key={level.id}
              className={`level-kaart ${!vrijgespeeld ? "level-kaart--vergrendeld" : ""}`}
              style={{ "--level-kleur": level.kleur }}
            >
              <div className="level-kaart__hoofd">
                <span className="level-kaart__emoji">{level.emoji}</span>
                <div className="level-kaart__info">
                  <h2 className="level-kaart__titel">{level.leerjaar}</h2>
                  <p className="level-kaart__leeftijd">{level.leeftijd}</p>
                  <p className="level-kaart__beschrijving">
                    {level.beschrijving}
                  </p>
                </div>
                {!vrijgespeeld && (
                  <span className="level-kaart__slot">🔒</span>
                )}
              </div>

              {vrijgespeeld && (
                <div className="graad-lijst">
                  {level.moeilijkheidsgraden.map((graad) => {
                    const graadVrij = isGraadVrijgespeeld(level.id, graad.id);
                    const voortgang = haalVoortgangOp(level.id, graad.id);
                    return (
                      <button
                        key={graad.id}
                        className={`graad-knop ${!graadVrij ? "graad-knop--vergrendeld" : ""}`}
                        onClick={() =>
                          graadVrij && onStartOefening(level, graad)
                        }
                        disabled={!graadVrij}
                      >
                        <span className="graad-knop__emoji">{graad.emoji}</span>
                        <div className="graad-knop__tekst">
                          <strong>{graad.naam}</strong>
                          <small>{graad.beschrijving}</small>
                        </div>
                        <div className="graad-knop__score">
                          {voortgang ? (
                            <Sterren aantal={voortgang.sterren} />
                          ) : (
                            <Sterren aantal={0} />
                          )}
                        </div>
                        {!graadVrij && (
                          <span className="graad-knop__slot">🔒</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer className="thuis__footer">
        <p>Gebaseerd op de Vlaamse eindtermen basisonderwijs</p>
      </footer>
    </div>
  );
}
