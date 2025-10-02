import { ComponentLoader } from './componentLoader.js';
import { initializeEvolveSimulator } from './evolveSimulator.js';
import { initializeCollectionSimulator, initializeGoldCalculator, initializePackSimulator, initializeSpecificCardSimulator } from './ui.js';
import { validateDrawRates } from './validation.js';

$(document).ready(async function() {
  console.log('Document ready, starting initialization...');
  
  // Load all components first
  const componentLoader = new ComponentLoader();
  await componentLoader.loadAllComponents();
  
  // Wait a bit for DOM to be fully ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Check if elements exist
  console.log('Checking if elements exist:');
  console.log('pack-simulator-content:', document.getElementById('pack-simulator-content'));
  console.log('simulateBtn:', document.getElementById('simulateBtn'));
  
  // Validate draw rates on startup
  const errors = validateDrawRates();
  if (errors.length > 0) {
    console.error('Draw rate validation errors:');
    errors.forEach(error => console.error('  - ' + error));
    alert('Draw rate validation failed! Check console for details.');
  } else {
    console.log('✓ All draw rates validated successfully');
  }

  // Initialize all simulators after components are loaded
  console.log('Initializing simulators...');
  initializePackSimulator();
  initializeCollectionSimulator();
  initializeSpecificCardSimulator();
  initializeGoldCalculator();
  initializeEvolveSimulator();
  
  console.log('✓ All simulators initialized');
});