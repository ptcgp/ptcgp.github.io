import { PACK_CARD_COUNTS_ARRAY, RARITY_SYMBOLS } from './constants.js';
import { DRAW_RATES, DRAW_RATES_TYPED } from './drawRates.js';

export function simulatePackOpening(packType, isGodPack, isBabyPack = false) {
  const drawRates = DRAW_RATES[packType];
  let rateTable;
  if (isBabyPack) {
    rateTable = drawRates.baby;
  } else if (isGodPack) {
    rateTable = drawRates.rare;
  } else {
    rateTable = drawRates.regular;
  }
  const results = new Array(RARITY_SYMBOLS.length).fill(0);
  const drawnCards = new Array(RARITY_SYMBOLS.length);

  for (let i = 0; i < RARITY_SYMBOLS.length; i++) {
    drawnCards[i] = null;
  }

  rateTable.forEach(rates => {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < rates.length; i++) {
      cumulative += rates[i];
      if (random <= cumulative) {
        const cardCount = PACK_CARD_COUNTS_ARRAY[packType][i];
        if (cardCount > 0) {
          const specificCard = Math.floor(Math.random() * cardCount) + 1;
          drawnCards[i] = specificCard;
        }
        results[i]++;
        break;
      }
    }
  });

  return { counts: results, cards: drawnCards };
}

export function simulateCollection(packType, excludeRareCards = false, needDouble = false) {
  const cardCounts = PACK_CARD_COUNTS_ARRAY[packType];
  const collection = new Array(cardCounts.length);
  for (let i = 0; i < cardCounts.length; i++) {
    collection[i] = new Map();
  }
  let packCount = 0;

  function isComplete() {
    const lastIndexToCheck = excludeRareCards ? 5 : cardCounts.length;
    const requiredCopies = needDouble ? 2 : 1;

    for (let i = 0; i < lastIndexToCheck; i++) {
      if (cardCounts[i] > 0) {
        for (let cardNum = 1; cardNum <= cardCounts[i]; cardNum++) {
          const currentCount = collection[i].get(cardNum) || 0;
          if (currentCount < requiredCopies) {
            return false;
          }
        }
      }
    }
    return true;
  }

  while (!isComplete()) {
    packCount++;
    // Determine pack type based on pack_rates
    const packRates = DRAW_RATES_TYPED[packType]?.pack_rates || [[0.9995, "regular"], [0.0005, "rare"]];
    const random = Math.random();
    let cumulative = 0;
    let selectedPackType = "regular";
    for (const [rate, packTypeName] of packRates) {
      cumulative += rate;
      if (random < cumulative) {
        selectedPackType = packTypeName;
        break;
      }
    }
    const isGodPack = selectedPackType === "rare";
    const isBabyPack = selectedPackType === "baby";
    const result = simulatePackOpening(packType, isGodPack, isBabyPack);

    for (let i = 0; i < result.counts.length; i++) {
      if (result.counts[i] > 0 && result.cards[i] !== null) {
        const cardNum = result.cards[i];
        const currentCount = collection[i].get(cardNum) || 0;
        if (!needDouble || currentCount < 2) {
          collection[i].set(cardNum, currentCount + 1);
        }
      }
    }
  }

  return packCount;
}

export function simulateSpecificCard(packType, targetRarity, needDouble = false) {
  const cardCounts = PACK_CARD_COUNTS_ARRAY[packType];
  const targetCardNumber = Math.floor(Math.random() * cardCounts[targetRarity]) + 1;
  let packCount = 0;
  let copiesFound = 0;
  const requiredCopies = needDouble ? 2 : 1;

  while (copiesFound < requiredCopies) {
    packCount++;
    // Determine pack type based on pack_rates
    const packRates = DRAW_RATES_TYPED[packType]?.pack_rates || [[0.9995, "regular"], [0.0005, "rare"]];
    const random = Math.random();
    let cumulative = 0;
    let selectedPackType = "regular";
    for (const [rate, packTypeName] of packRates) {
      cumulative += rate;
      if (random < cumulative) {
        selectedPackType = packTypeName;
        break;
      }
    }
    const isGodPack = selectedPackType === "rare";
    const isBabyPack = selectedPackType === "baby";
    const result = simulatePackOpening(packType, isGodPack, isBabyPack);

    if (result.counts[targetRarity] > 0) {
      const randomCard = Math.floor(Math.random() * cardCounts[targetRarity]) + 1;
      if (randomCard === targetCardNumber) {
        copiesFound++;
      }
    }
  }

  return packCount;
}
