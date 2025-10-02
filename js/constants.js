export const RARITIES = [
  { symbol: "♢", name: "1 Diamond", type: "1_diamond" },
  { symbol: "♢♢", name: "2 Diamonds", type: "2_diamond" },
  { symbol: "♢♢♢", name: "3 Diamonds", type: "3_diamond" },
  { symbol: "♢♢♢ (Baby)", name: "3 Diamonds (Baby)", type: "3_diamond_baby" },
  { symbol: "♢♢♢♢", name: "4 Diamonds", type: "4_diamond" },
  { symbol: "☆", name: "1 Star", type: "1_star" },
  { symbol: "☆ (Baby)", name: "1 Star (Baby)", type: "1_star_baby" },
  { symbol: "☆☆", name: "2 Stars (Full Art)", type: "2_star_fullart" },
  { symbol: "☆☆", name: "2 Stars (Rainbow)", type: "2_star_rainbow" },
  { symbol: "☆☆☆", name: "3 Stars", type: "3_star" },
  { symbol: "☆☆☆", name: "3 Stars", type: "3_star_rainbow" },
  { symbol: "Shiny ☆", name: "1 Star (Shiny)", type: "shiny_1_star" },
  { symbol: "Shiny ☆☆", name: "2 Stars (Shiny)", type: "shiny_2_star" },
  { symbol: "♛", name: "Crown", type: "crown" },
];

// For backward compatibility, keep the array of symbols
export const RARITY_SYMBOLS = RARITIES.map(r => r.symbol);

export const PACK_RATES = [0.9995, 0.0005];

export const PACK_CARD_COUNTS = {
  a1_pikachu: {
    "1_diamond": 25,
    "2_diamond": 17,
    "3_diamond": 14,
    "4_diamond": 5,
    "1_star": 8,
    "2_star_fullart": 8,
    "2_star_rainbow": 2,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a1_mewtwo: {
    "1_diamond": 25,
    "2_diamond": 17,
    "3_diamond": 14,
    "4_diamond": 5,
    "1_star": 8,
    "2_star_fullart": 7,
    "2_star_rainbow": 2,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a1_charizard: {
    "1_diamond": 25,
    "2_diamond": 17,
    "3_diamond": 14,
    "4_diamond": 5,
    "1_star": 8,
    "2_star_fullart": 8,
    "2_star_rainbow": 2,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a1a: {
    "1_diamond": 32,
    "2_diamond": 23,
    "3_diamond": 8,
    "4_diamond": 5,
    "1_star": 6,
    "2_star_fullart": 8,
    "2_star_rainbow": 2,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a2_diagla: {
    "1_diamond": 23,
    "2_diamond": 18,
    "3_diamond": 10,
    "4_diamond": 5,
    "1_star": 12,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a2_palkia: {
    "1_diamond": 21,
    "2_diamond": 20,
    "3_diamond": 10,
    "4_diamond": 5,
    "1_star": 12,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a2a: {
    "1_diamond": 31,
    "2_diamond": 26,
    "3_diamond": 13,
    "4_diamond": 5,
    "1_star": 6,
    "2_star_fullart": 9,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 0,
    "shiny_2_star": 0
  },
  a2b: {
    "1_diamond": 32,
    "2_diamond": 22,
    "3_diamond": 9,
    "4_diamond": 9,
    "1_star": 6,
    "2_star_fullart": 13,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a3_solgaleo: {
    "1_diamond": 43,
    "2_diamond": 34,
    "3_diamond": 14,
    "4_diamond": 5,
    "1_star": 12,
    "2_star_fullart": 9,
    "2_star_rainbow": 5,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a3_lunala: {
    "1_diamond": 43,
    "2_diamond": 34,
    "3_diamond": 14,
    "4_diamond": 5,
    "1_star": 12,
    "2_star_fullart": 9,
    "2_star_rainbow": 5,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a3a: {
    "1_diamond": 32,
    "2_diamond": 24,
    "3_diamond": 8,
    "4_diamond": 5,
    "1_star": 6,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a3b: {
    "1_diamond": 32,
    "2_diamond": 23,
    "3_diamond": 8,
    "4_diamond": 6,
    "1_star": 9,
    "2_star_fullart": 8,
    "2_star_rainbow": 5,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a4_hooh: {
    "1_diamond": 42,
    "2_diamond": 31,
    "3_diamond": 14,
    "3_diamond_baby": 3,
    "4_diamond": 5,
    "1_star": 11,
    "1_star_baby": 1,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 8,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a4_lugia: {
    "1_diamond": 42,
    "2_diamond": 31,
    "3_diamond": 14,
    "3_diamond_baby": 3,
    "4_diamond": 5,
    "1_star": 11,
    "1_star_baby": 1,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 8,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a4a: {
    "1_diamond": 32,
    "2_diamond": 23,
    "3_diamond": 8,
    "3_diamond_baby": 3,
    "4_diamond": 5,
    "1_star": 5,
    "1_star_baby": 1,
    "2_star_fullart": 8,
    "2_star_rainbow": 4,
    "3_star": 1,
    "crown": 1,
    "shiny_1_star": 10,
    "shiny_2_star": 4
  },
  a4b: {
    "1_diamond": 128,
    "2_diamond": 100,
    "3_diamond": 50,
    "4_diamond": 75,
    "1_star": 6, 
    "2_star_fullart": 16,
    "3_star": 1,
    "crown": 1,
    "shiny_2_star": 2
  }
};

// For backward compatibility, create array versions
export const PACK_CARD_COUNTS_ARRAY = {};
Object.keys(PACK_CARD_COUNTS).forEach(packType => {
  PACK_CARD_COUNTS_ARRAY[packType] = RARITIES.map(r => PACK_CARD_COUNTS[packType][r.type]);
});

export const gold_price = {
  HKD: {
    5: 8,
    26: 36,
    57: 78,
    120: 158,
    250: 318,
    690: 788
  },
  JPY: {
    5: 140,
    26: 700,
    57: 1400,
    120: 2800,
    250: 5600,
    690: 14000
  },
  USD: {
    5: 0.99,
    26: 4.99,
    57: 9.99,
    120: 19.99,
    250: 39.99,
    690: 99.99
  },
  GBP: {
    5: 0.79,
    26: 3.99,
    57: 7.99,
    120: 15.99,
    250: 31.99,
    690: 79.99
  }
};