import { gold_price } from './constants.js';

export function findOptimalGoldPackage(targetGold) {
  const goldAmounts = Object.keys(gold_price.HKD).map(Number).sort((a, b) => a - b);
  const largestPackage = goldAmounts[goldAmounts.length - 1];

  if (targetGold <= largestPackage) {
    for (const amount of goldAmounts) {
      if (amount >= targetGold) {
        return {
          gold: amount,
          count: 1
        };
      }
    }
  }

  const packagesNeeded = Math.ceil(targetGold / largestPackage);
  return {
    gold: largestPackage,
    count: packagesNeeded
  };
}

export function calculateOptimalGoldPurchase(targetGold, currency) {
  const prices = gold_price[currency];
  const goldAmounts = Object.keys(prices).map(Number).sort((a, b) => b - a);
  const result = {
    purchases: {},
    totalCost: 0
  };

  let remainingGold = targetGold;

  // Greedy algorithm - start with largest packages
  for (const amount of goldAmounts) {
    if (remainingGold >= amount) {
      const count = Math.floor(remainingGold / amount);
      result.purchases[amount] = count;
      result.totalCost += prices[amount] * count;
      remainingGold -= amount * count;
    }
  }

  // If we can't exactly match the target, add one more package
  if (remainingGold > 0) {
    for (const amount of [...goldAmounts].reverse()) {
      if (amount >= remainingGold) {
        result.purchases[amount] = (result.purchases[amount] || 0) + 1;
        result.totalCost += prices[amount];
        break;
      }
    }
  }

  return result;
}