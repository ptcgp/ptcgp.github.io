import { initializeEvolveSimulator } from './evolveSimulator.js';
import { initializeCollectionSimulator, initializeGoldCalculator, initializePackSimulator, initializeSpecificCardSimulator } from './ui.js';
import { validateDrawRates } from './validation.js';

$(document).ready(function() {
  // Validate draw rates on startup
  const errors = validateDrawRates();
  if (errors.length > 0) {
    console.error('Draw rate validation errors:');
    errors.forEach(error => console.error('  - ' + error));
    alert('Draw rate validation failed! Check console for details.');
  } else {
    console.log('✓ All draw rates validated successfully');
  }

  // Initialize all simulators
  initializePackSimulator();
  initializeCollectionSimulator();
  initializeSpecificCardSimulator();
  initializeGoldCalculator();
  initializeEvolveSimulator();
});