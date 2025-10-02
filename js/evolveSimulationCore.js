// Core simulation logic for Pokemon evolution
export function simulateEvolution(packType, basicCount, stage1Count, stage2Count, cyrusCount, professorCount, pokeballCount, rareCandyCount, targetStage2Count, debugMode = false) {
  // Create a deck of 20 cards with each card type appearing max twice
  const deck = [];
  
  // Add Basic Pokemon cards
  for (let i = 0; i < basicCount; i++) {
    deck.push({ type: 'basic', name: `Basic ${i + 1}` });
  }
  
  // Add Stage 1 evolution cards
  for (let i = 0; i < stage1Count; i++) {
    deck.push({ type: 'stage1', name: `Stage 1 ${i + 1}` });
  }
  
  // Add Stage 2 evolution cards
  for (let i = 0; i < stage2Count; i++) {
    deck.push({ type: 'stage2', name: `Stage 2 ${i + 1}` });
  }
  
  // Cyrus removed from options
  
  // Add Professor's Research cards
  for (let i = 0; i < professorCount; i++) {
    deck.push({ type: 'professor', name: 'Professor\'s Research' });
  }
  
  // Add Poké Ball cards
  for (let i = 0; i < pokeballCount; i++) {
    deck.push({ type: 'pokeball', name: 'Poké Ball' });
  }
  
  // Add Rare Candy cards
  for (let i = 0; i < rareCandyCount; i++) {
    deck.push({ type: 'rarecandy', name: 'Rare Candy' });
  }
  
  // Fill remaining slots with other cards (energy, trainers, etc.)
  const remainingSlots = 20 - deck.length;
  
  // If we have Poké Balls, include some additional evolution cards to compensate
  const additionalEvolutionCards = pokeballCount > 0 ? Math.min(pokeballCount, remainingSlots) : 0;
  
  for (let i = 0; i < additionalEvolutionCards; i++) {
    if (i % 3 === 0) {
      deck.push({ type: 'basic', name: `Extra Basic ${i + 1}` });
    } else if (i % 3 === 1) {
      deck.push({ type: 'stage1', name: `Extra Stage 1 ${i + 1}` });
    } else {
      deck.push({ type: 'stage2', name: `Extra Stage 2 ${i + 1}` });
    }
  }
  
  // Fill remaining slots with other cards
  const finalRemainingSlots = 20 - deck.length;
  for (let i = 0; i < finalRemainingSlots; i++) {
    deck.push({ type: 'other', name: `Other ${i + 1}` });
  }
  
  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  let turns = 0;
  let hand = [];
  let field = [];
  let stage2Pokemon = 0;
  
  // Turn 0: Draw 5 cards, must include 1 Basic Pokemon
  const initialDraw = deck.splice(0, 5);
  hand = [...initialDraw];
  
  // Ensure at least 1 Basic Pokemon in hand
  const basicInHand = hand.some(card => card.type === 'basic');
  if (!basicInHand) {
    // If no Basic in hand, replace a random card with a Basic
    const basicIndex = deck.findIndex(card => card.type === 'basic');
    if (basicIndex !== -1) {
      const randomIndex = Math.floor(Math.random() * hand.length);
      hand[randomIndex] = deck.splice(basicIndex, 1)[0];
    }
  }
  
  // Track when we first get a Stage 2 Pokemon
  let firstStage2Turn = -1;
  let basicPlayedThisTurn = false;
  let supporterPlayedThisTurn = false;
  
  // Debug logging
  if (debugMode) {
    console.log('=== DEBUG MODE: Starting Evolution Simulation ===');
    console.log('Initial hand:', hand.map(c => c.type));
    console.log('Initial deck length:', deck.length);
    console.log('Target Stage 2 count:', targetStage2Count);
  }
  
  while (stage2Pokemon < targetStage2Count) {
    turns++;
    basicPlayedThisTurn = false;
    supporterPlayedThisTurn = false;
    
    // Debug logging
    if (debugMode) {
      console.log(`\n=== TURN ${turns} ===`);
      console.log('Hand before draw:', hand.map(c => c.type));
      console.log('Field:', field.map(c => c.type));
      console.log('Deck length:', deck.length);
    }
    
    // Each turn: Draw 1 card at the beginning
    if (deck.length > 0) {
      const drawnCard = deck.shift();
      hand.push(drawnCard);
      if (debugMode) {
        console.log('Drew card:', drawnCard.type);
      }
    }
    
    // Each turn: can play multiple Item cards (Poké Ball) - Use strategically
    let pokeballsInHand = hand.filter(card => card.type === 'pokeball');
    const basicsInHand = hand.filter(card => card.type === 'basic');
    
    if (debugMode) {
      console.log('Poké Balls in hand:', pokeballsInHand.length);
      console.log('Basics in hand:', basicsInHand.length);
    }
    
    // Use Poké Ball if we have fewer than 2 Basic Pokemon in hand
    // This allows deck thinning while maintaining Basic Pokemon availability
    if (basicsInHand.length < 2) {
      for (const pokeball of pokeballsInHand) {
        hand = hand.filter(card => card !== pokeball);
        // Poké Ball: Draw a Basic Pokemon from deck if any
        const basicInDeck = deck.findIndex(card => card.type === 'basic');
        if (basicInDeck !== -1) {
          const basicCard = deck.splice(basicInDeck, 1)[0];
          hand.push(basicCard);
          if (debugMode) {
            console.log('Poké Ball found Basic:', basicCard.type);
          }
        } else {
          if (debugMode) {
            console.log('Poké Ball found no Basic in deck');
          }
        }
        // Even if no Basic Pokemon found, Poké Ball still thins the deck
        // This increases the chance of drawing Stage 1/Stage 2 cards
      }
    }
    
    // Each turn: can play multiple Item cards (Rare Candy) - Use strategically
    let rareCandiesInHand = hand.filter(card => card.type === 'rarecandy');
    
    if (debugMode) {
      console.log('Rare Candies in hand:', rareCandiesInHand.length);
    }
    
    // Use Rare Candy if we have Basic Pokemon in field and Stage 2 in hand
    // This allows direct Basic -> Stage 2 evolution
    if (rareCandiesInHand.length > 0 && field.some(pokemon => pokemon.type === 'basic') && hand.some(card => card.type === 'stage2')) {
      for (const rareCandy of rareCandiesInHand) {
        hand = hand.filter(card => card !== rareCandy);
        // Rare Candy: Evolve Basic directly to Stage 2
        const basicInField = field.find(pokemon => pokemon.type === 'basic');
        const stage2InHand = hand.find(card => card.type === 'stage2');
        if (basicInField && stage2InHand) {
          const basicIndex = field.indexOf(basicInField);
          field[basicIndex] = stage2InHand;
          hand = hand.filter(card => card !== stage2InHand);
          stage2Pokemon++;
          
          if (debugMode) {
            console.log('Rare Candy evolved Basic to Stage 2');
          }
          
          // Record when we first get a Stage 2 Pokemon
          if (firstStage2Turn === -1) {
            firstStage2Turn = turns;
            if (debugMode) {
              console.log(`SUCCESS! Stage 2 evolution on turn ${turns} via Rare Candy`);
            }
          }
        }
      }
    }
    
    // Each turn: can play 1 Supporter card (Professor's Research)
    const professorInHand = hand.find(card => card.type === 'professor');
    
    if (professorInHand) {
      // Play Professor's Research - Draw 2 cards
      hand = hand.filter(card => card !== professorInHand);
      supporterPlayedThisTurn = true;
      if (debugMode) {
        console.log('Played Professor\'s Research');
      }
      
      // Professor's Research effect: Draw 2 cards
      for (let i = 0; i < 2 && deck.length > 0; i++) {
        const drawnCard = deck.shift();
        hand.push(drawnCard);
        if (debugMode) {
          console.log('Professor drew:', drawnCard.type);
        }
      }
      
      // After Professor's Research, check for new Poké Balls that were drawn
      // Use Poké Ball if we have fewer than 2 Basic Pokemon (same logic as before)
      const basicsInHandAfterProfessor = hand.filter(card => card.type === 'basic');
      if (basicsInHandAfterProfessor.length < 2) {
        pokeballsInHand = hand.filter(card => card.type === 'pokeball');
        for (const pokeball of pokeballsInHand) {
          hand = hand.filter(card => card !== pokeball);
          // Poké Ball: Draw a Basic Pokemon from deck if any
          const basicInDeck = deck.findIndex(card => card.type === 'basic');
          if (basicInDeck !== -1) {
            const basicCard = deck.splice(basicInDeck, 1)[0];
            hand.push(basicCard);
            if (debugMode) {
              console.log('Post-Professor Poké Ball found Basic:', basicCard.type);
            }
          } else {
            if (debugMode) {
              console.log('Post-Professor Poké Ball found no Basic in deck');
            }
          }
          // Even if no Basic Pokemon found, Poké Ball still thins the deck
          // This increases the chance of drawing Stage 1/Stage 2 cards
        }
      }
    }
    
    // Each turn: can put Basic Pokemon into field (if available in hand)
    // Can have up to 4 Basic Pokemon in play
    // BUT: Only play Basic if we don't have a Stage 1 in field that can be evolved
    const hasStage1InField = field.some(pokemon => pokemon.type === 'stage1');
    const stage2InHand = hand.find(card => card.type === 'stage2');
    
    // Only play Basic if:
    // 1. We have Basic Pokemon in hand
    // 2. Field has space (< 4 Pokemon)
    // 3. We don't have a Stage 1 in field that can be evolved to Stage 2
    // 4. We don't have a Basic in field that can be evolved to Stage 1
    // 5. We don't already have a Basic in field (hold Basics in hand for future use)
    // 6. We don't have Rare Candy + Stage 2 combo available (prioritize Rare Candy over playing Basic)
    const hasBasicInField = field.some(pokemon => pokemon.type === 'basic');
    const stage1InHand = hand.find(card => card.type === 'stage1');
    const stage2InHandForRareCandy = hand.find(card => card.type === 'stage2');
    
    // Don't play Basic if we can use Rare Candy to evolve existing Basic to Stage 2
    const canUseRareCandy = rareCandiesInHand.length > 0 && hasBasicInField && stage2InHandForRareCandy;
    
    if (basicsInHand.length > 0 && field.length < 4 && !hasBasicInField && !(hasStage1InField && stage2InHand) && !(hasBasicInField && stage1InHand) && !canUseRareCandy) {
      // Put Basic Pokemon into field (up to 4 total)
      const basicToPlay = basicsInHand[0]; // Play one Basic Pokemon
      field.push(basicToPlay);
      hand = hand.filter(card => card !== basicToPlay);
      basicPlayedThisTurn = true;
      if (debugMode) {
        console.log('Played Basic to field:', basicToPlay.type);
      }
    }
    
    // Check for evolution cards in hand
    // stage1InHand and stage2InHand already declared above
    
    // Each turn: can evolve maximum 1 time, but NOT if Basic was played this turn
    // AND NOT on Turn 1 (Turn 1 can never evolve)
    if (debugMode) {
      console.log('Stage 1 in hand:', stage1InHand ? 'Yes' : 'No');
      console.log('Stage 2 in hand:', stage2InHand ? 'Yes' : 'No');
      console.log('Field has Basic:', field.some(p => p.type === 'basic'));
      console.log('Field has Stage 1:', field.some(p => p.type === 'stage1'));
      console.log('Basic played this turn:', basicPlayedThisTurn);
      console.log('Turns > 1:', turns > 1);
      console.log('Can evolve:', !basicPlayedThisTurn && turns > 1);
      console.log('Rare Candies in hand:', rareCandiesInHand.length);
      console.log('Can use Rare Candy:', canUseRareCandy);
    }
    
    if (!basicPlayedThisTurn && turns > 1) {
      if (stage1InHand && field.some(pokemon => pokemon.type === 'basic')) {
        // Evolve Basic to Stage 1 - replace Basic with Stage 1 in field
        const basicInField = field.find(pokemon => pokemon.type === 'basic');
        const basicIndex = field.indexOf(basicInField);
        field[basicIndex] = stage1InHand;
        hand = hand.filter(card => card !== stage1InHand);
        if (debugMode) {
          console.log('Evolved Basic to Stage 1');
        }
      } else if (stage2InHand && field.some(pokemon => pokemon.type === 'stage1')) {
        // Evolve Stage 1 to Stage 2 - replace Stage 1 with Stage 2 in field
        const stage1InField = field.find(pokemon => pokemon.type === 'stage1');
        const stage1Index = field.indexOf(stage1InField);
        field[stage1Index] = stage2InHand;
        hand = hand.filter(card => card !== stage2InHand);
        stage2Pokemon++;
        
        if (debugMode) {
          console.log('Evolved Stage 1 to Stage 2');
        }
        
        // Record when we first get a Stage 2 Pokemon
        if (firstStage2Turn === -1) {
          firstStage2Turn = turns;
          if (debugMode) {
            console.log(`SUCCESS! Stage 2 evolution on turn ${turns}`);
          }
        }
      }
    }
    
    if (debugMode) {
      console.log('Final hand:', hand.map(c => c.type));
      console.log('Final field:', field.map(c => c.type));
      console.log('Stage 2 count:', stage2Pokemon);
    }
    
    // Prevent infinite loops
    if (turns > 50) {
      if (debugMode) {
        console.log('Breaking after 50 turns');
      }
      break;
    }
  }
  
  // Return the turn when we first got a Stage 2 Pokemon
  // If we never got one, return -1
  return firstStage2Turn;
}
