// Genereer rekenopgaven op basis van level en moeilijkheidsgraad

function willekeurig(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function willekeurigUit(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function genOptelling(maxGetal) {
  const a = willekeurig(1, Math.floor(maxGetal * 0.8));
  const maxB = Math.min(maxGetal - a, Math.floor(maxGetal * 0.8));
  if (maxB < 1) return genOptelling(maxGetal);
  const b = willekeurig(1, maxB);
  return {
    vraag: `${a} + ${b} = ?`,
    antwoord: a + b,
    bewerking: "optelling",
    getallen: [a, b],
  };
}

function genAftrekking(maxGetal) {
  const a = willekeurig(2, Math.floor(maxGetal * 0.9));
  const b = willekeurig(1, a - 1);
  return {
    vraag: `${a} - ${b} = ?`,
    antwoord: a - b,
    bewerking: "aftrekking",
    getallen: [a, b],
  };
}

function genVermenigvuldiging(tafels) {
  const tafel = willekeurigUit(tafels);
  const getal = willekeurig(1, 10);
  return {
    vraag: `${tafel} × ${getal} = ?`,
    antwoord: tafel * getal,
    bewerking: "vermenigvuldiging",
    getallen: [tafel, getal],
  };
}

function genDeling(tafels) {
  const tafel = willekeurigUit(tafels);
  const getal = willekeurig(1, 10);
  const product = tafel * getal;
  return {
    vraag: `${product} ÷ ${tafel} = ?`,
    antwoord: getal,
    bewerking: "deling",
    getallen: [product, tafel],
  };
}

function genKomma() {
  const a = willekeurig(1, 99);
  const b = willekeurig(1, 99);
  const aKomma = (a / 10).toFixed(1);
  const bKomma = (b / 10).toFixed(1);
  const som = parseFloat((a / 10 + b / 10).toFixed(1));
  return {
    vraag: `${aKomma} + ${bKomma} = ?`,
    antwoord: som,
    bewerking: "komma",
    getallen: [aKomma, bKomma],
    komma: true,
  };
}

export function genereerOefening(config) {
  const { bewerkingen, tafels, maxGetal } = config;

  const bewerking = willekeurigUit(bewerkingen);

  switch (bewerking) {
    case "optelling":
      return genOptelling(maxGetal);
    case "aftrekking":
      return genAftrekking(maxGetal);
    case "vermenigvuldiging":
      return genVermenigvuldiging(tafels || [2, 5, 10]);
    case "deling":
      return genDeling(tafels || [2, 5, 10]);
    case "komma":
      return genKomma();
    default:
      return genOptelling(maxGetal);
  }
}

export function genereerRonde(config, aantalVragen = 10) {
  const oefeningen = [];
  for (let i = 0; i < aantalVragen; i++) {
    oefeningen.push(genereerOefening(config));
  }
  return oefeningen;
}

export function berekeningScore(goedBeantwoord, totaalVragen) {
  return Math.round((goedBeantwoord / totaalVragen) * 100);
}

export function berekenSterren(scorePercentage) {
  if (scorePercentage >= 100) return 3;
  if (scorePercentage >= 80) return 2;
  if (scorePercentage >= 60) return 1;
  return 0;
}

export function genereerAntwoordOpties(oefening) {
  const juist = oefening.antwoord;
  const opties = new Set([juist]);

  while (opties.size < 4) {
    let variant;
    const afwijking = oefening.komma
      ? parseFloat((Math.random() * 2 - 1).toFixed(1))
      : willekeurig(-5, 5);

    variant = oefening.komma
      ? parseFloat((juist + afwijking).toFixed(1))
      : juist + afwijking;

    if (variant !== juist && variant >= 0) {
      opties.add(variant);
    }
  }

  return [...opties].sort(() => Math.random() - 0.5);
}
