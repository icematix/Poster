// Voortgang opslaan in localStorage

const OPSLAG_SLEUTEL = "rekenapp_voortgang";

export function laadVoortgang() {
  try {
    const data = localStorage.getItem(OPSLAG_SLEUTEL);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function slaVoortgangOp(levelId, graadId, sterren, score) {
  const voortgang = laadVoortgang();
  const sleutel = `${levelId}_${graadId}`;
  const bestaand = voortgang[sleutel];

  voortgang[sleutel] = {
    sterren: Math.max(sterren, bestaand?.sterren || 0),
    besteScore: Math.max(score, bestaand?.besteScore || 0),
    aantalGespeeld: (bestaand?.aantalGespeeld || 0) + 1,
    laatstGespeeld: new Date().toISOString(),
  };

  try {
    localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(voortgang));
  } catch {
    // localStorage niet beschikbaar
  }

  return voortgang[sleutel];
}

export function haalVoortgangOp(levelId, graadId) {
  const voortgang = laadVoortgang();
  return voortgang[`${levelId}_${graadId}`] || null;
}

export function isGraadVrijgespeeld(levelId, graadId) {
  if (graadId === 1) return true;
  const vorige = haalVoortgangOp(levelId, graadId - 1);
  return vorige !== null && vorige.sterren >= 1;
}

export function isLevelVrijgespeeld(levelId) {
  if (levelId === 1) return true;
  // Level vrijgespeeld als vorige level graad 2 behaald met minstens 1 ster
  const vorigeLevel = levelId - 1;
  const vorige = haalVoortgangOp(vorigeLevel, 2);
  return vorige !== null && vorige.sterren >= 1;
}

export function wisVoortgang() {
  try {
    localStorage.removeItem(OPSLAG_SLEUTEL);
  } catch {
    // ignore
  }
}
