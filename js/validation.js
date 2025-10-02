import { DRAW_RATES_TYPED } from './drawRates.js';

export function validateDrawRates() {
  const errors = [];

  for (const [packType, packData] of Object.entries(DRAW_RATES_TYPED)) {
    // Validate pack_rates sum to 100%
    if (packData.pack_rates) {
      const packRatesSum = packData.pack_rates.reduce((sum, [rate]) => sum + rate, 0);
      if (Math.abs(packRatesSum - 1.0) > 0.0001) {
        errors.push(`${packType}: pack_rates sum to ${(packRatesSum * 100).toFixed(4)}% instead of 100%`);
      }
    }

    // Validate each pack type (regular, rare, etc.)
    for (const [typeName, typeData] of Object.entries(packData)) {
      if (typeName === 'pack_rates') continue;

      // Validate each slot sums to 100%
      for (const [slotName, rarityRates] of Object.entries(typeData)) {
        const slotSum = Object.values(rarityRates).reduce((sum, rate) => sum + rate, 0);
        if (Math.abs(slotSum - 1.0) > 0.0001) {
          errors.push(`${packType}.${typeName}.${slotName}: rates sum to ${(slotSum * 100).toFixed(4)}% instead of 100%`);
        }
      }
    }
  }

  return errors;
}