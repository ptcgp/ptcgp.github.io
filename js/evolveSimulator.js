import { updateEvolveChart } from './charts.js';

export function simulateEvolution(packType, basicCount, stage1Count, stage2Count, targetStage2Count) {
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
  
  // Fill remaining slots with other cards (energy, trainers, etc.)
  const remainingSlots = 20 - deck.length;
  for (let i = 0; i < remainingSlots; i++) {
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
  
  while (stage2Pokemon < targetStage2Count) {
    turns++;
    basicPlayedThisTurn = false;
    
    // Each turn: Draw 1 card at the beginning
    if (deck.length > 0) {
      hand.push(deck.shift());
    }
    
    // Each turn: can put Basic Pokemon into field (if available in hand)
    const basicInHand = hand.find(card => card.type === 'basic');
    if (basicInHand) {
      // Put Basic into field
      field.push(basicInHand);
      hand = hand.filter(card => card !== basicInHand);
      basicPlayedThisTurn = true;
    }
    
    // Check for evolution cards in hand
    const stage1InHand = hand.find(card => card.type === 'stage1');
    const stage2InHand = hand.find(card => card.type === 'stage2');
    
    // Each turn: can evolve maximum 1 time, but NOT if Basic was played this turn
    if (!basicPlayedThisTurn) {
      if (stage1InHand && field.some(pokemon => pokemon.type === 'basic')) {
        // Evolve Basic to Stage 1
        const basicInField = field.find(pokemon => pokemon.type === 'basic');
        const basicIndex = field.indexOf(basicInField);
        field[basicIndex] = stage1InHand;
        hand = hand.filter(card => card !== stage1InHand);
      } else if (stage2InHand && field.some(pokemon => pokemon.type === 'stage1')) {
        // Evolve Stage 1 to Stage 2
        const stage1InField = field.find(pokemon => pokemon.type === 'stage1');
        const stage1Index = field.indexOf(stage1InField);
        field[stage1Index] = stage2InHand;
        hand = hand.filter(card => card !== stage2InHand);
        stage2Pokemon++;
        
        // Record when we first get a Stage 2 Pokemon
        if (firstStage2Turn === -1) {
          firstStage2Turn = turns;
        }
      }
    }
    
    // Prevent infinite loops
    if (turns > 50) {
      break;
    }
  }
  
  // Return the turn when we first got a Stage 2 Pokemon
  // If we never got one, return -1
  return firstStage2Turn;
}

// Global variables to store previous results
let previousResults = null;
let previousConfig = null;
let simulationCount = 0;
let isCreatingCharts = false;

export function initializeEvolveSimulator() {
  // Update deck composition display when inputs change
  function updateDeckComposition() {
    const basicCount = parseInt($('input[name="basicCount"]:checked').val());
    const stage1Count = parseInt($('input[name="stage1Count"]:checked').val());
    const stage2Count = parseInt($('input[name="stage2Count"]:checked').val());
    const totalCards = basicCount + stage1Count + stage2Count;
    const remainingCards = 20 - totalCards;
    
    $('#deckComposition').html(`
      <div class="card">
        <div class="card-header">
          <h6 class="card-title mb-0">
            <i class="fas fa-layer-group me-2"></i>Deck Composition
          </h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3 col-6">
              <div class="text-center">
                <div class="h4 text-primary mb-1">${basicCount}</div>
                <div class="small text-muted">Basic Pokemon</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="text-center">
                <div class="h4 text-success mb-1">${stage1Count}</div>
                <div class="small text-muted">Stage 1 Pokemon</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="text-center">
                <div class="h4 text-warning mb-1">${stage2Count}</div>
                <div class="small text-muted">Stage 2 Pokemon</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="text-center">
                <div class="h4 text-secondary mb-1">${remainingCards}</div>
                <div class="small text-muted">Other Cards</div>
              </div>
            </div>
          </div>
          <hr class="my-3">
          <div class="text-center">
            <span class="badge bg-primary fs-6">Total: ${totalCards} Pokemon + ${remainingCards} Other = 20 Cards</span>
          </div>
        </div>
      </div>
    `);
  }

  // Update deck composition on input changes
  $('input[name="basicCount"], input[name="stage1Count"], input[name="stage2Count"]').on('change', updateDeckComposition);
  updateDeckComposition(); // Initial update

  // Preset configurations
  $('#presetBalanced').on('click', function() {
    $('#basic2').prop('checked', true);
    $('#stage1_2').prop('checked', true);
    $('#stage2_1').prop('checked', true);
    updateDeckComposition();
  });

  $('#presetHeavy').on('click', function() {
    $('#basic1').prop('checked', true);
    $('#stage1_2').prop('checked', true);
    $('#stage2_2').prop('checked', true);
    updateDeckComposition();
  });

  $('#presetLight').on('click', function() {
    $('#basic2').prop('checked', true);
    $('#stage1_1').prop('checked', true);
    $('#stage2_1').prop('checked', true);
    updateDeckComposition();
  });

  $('#presetMax').on('click', function() {
    $('#basic2').prop('checked', true);
    $('#stage1_2').prop('checked', true);
    $('#stage2_2').prop('checked', true);
    updateDeckComposition();
  });

  $('#presetMinimal').on('click', function() {
    $('#basic1').prop('checked', true);
    $('#stage1_1').prop('checked', true);
    $('#stage2_1').prop('checked', true);
    updateDeckComposition();
  });

  $('#presetNoBasic').on('click', function() {
    $('#basic0').prop('checked', true);
    $('#stage1_2').prop('checked', true);
    $('#stage2_2').prop('checked', true);
    updateDeckComposition();
  });

        $('#simulateEvolveBtn').on('click', function() {
          const basicCount = parseInt($('input[name="basicCount"]:checked').val());
          const stage1Count = parseInt($('input[name="stage1Count"]:checked').val());
          const stage2Count = parseInt($('input[name="stage2Count"]:checked').val());
          const targetStage2Count = parseInt($('input[name="targetStage2Count"]:checked').val());
          const simulationRuns = parseInt($('#simulationRuns').val()) || 1000;
    const $chartContainer = $('#evolveChartContainer');
    const $progressBar = $('.progress-bar');
    
    // Store current configuration
    const currentConfig = {
      basicCount,
      stage1Count,
      stage2Count,
      targetStage2Count,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Increment simulation count
    simulationCount++;

    // Validate deck composition
    const totalCards = basicCount + stage1Count + stage2Count;
    if (totalCards > 20) {
      alert('Error: Total Pokemon cards cannot exceed 20. Current total: ' + totalCards);
      return;
    }
    
    // Validate that we have at least 1 Basic Pokemon for evolution
    if (basicCount === 0) {
      alert('Error: You need at least 1 Basic Pokemon to start evolution. Please add Basic Pokemon to your deck.');
      return;
    }

    // Show loading state
    $chartContainer.addClass('loading');
    $chartContainer.attr('data-progress', 'Simulating... 0%');
    $progressBar.css('width', '0%').attr('aria-valuenow', 0);
    $chartContainer.find('.progress').show();

    setTimeout(() => {
      const results = [];
      const totalTrials = simulationRuns;
      const batchSize = 50;
      let processed = 0;

      function processBatch() {
        for (let i = 0; i < batchSize && processed < totalTrials; i++) {
          const result = simulateEvolution(null, basicCount, stage1Count, stage2Count, targetStage2Count);
          // Only include successful evolutions (not -1)
          if (result !== -1) {
            results.push(result);
          }
          processed++;
        }

        // Update progress
        const progress = Math.round((processed / totalTrials) * 100);
        $chartContainer.attr('data-progress', `Simulating... ${progress}%`);
        $progressBar.css('width', `${progress}%`).attr('aria-valuenow', progress);

        if (processed < totalTrials) {
          setTimeout(processBatch, 0);
        } else {
          // Calculate statistics
          const successfulEvolutions = results.length;
          const successRate = (successfulEvolutions / totalTrials * 100).toFixed(2);
          
          console.log('Simulation completed:', {
            totalTrials,
            successfulEvolutions,
            successRate,
            results: results.slice(0, 10) // Show first 10 results
          });
          
          // Declare variables at proper scope
          let turnProbabilities = [];
          let cumulativeProbabilities = [];
          
          if (successfulEvolutions > 0) {
            const sortedResults = [...results].sort((a, b) => a - b);
            const avg = Math.round(results.reduce((a, b) => a + b) / results.length);
            const median = Math.round(sortedResults[Math.floor(sortedResults.length / 2)]);
            const min = Math.min(...results);
            const max = Math.max(...results);

            // Update statistics
            $('#successRateEvolve').text(`${successRate}%`);
            $('#avgTurnsEvolve').text(avg);
            $('#medianTurnsEvolve').text(median);
            $('#minTurnsEvolve').text(min);
            $('#maxTurnsEvolve').text(max);

            // Calculate turn-by-turn probabilities
            const maxTurns = Math.max(...results);

            for (let turn = 1; turn <= Math.min(maxTurns, 20); turn++) {
              const evolvedByTurn = results.filter(turns => turns <= turn).length;
              const probability = (evolvedByTurn / totalTrials * 100).toFixed(2);
              const cumulative = (evolvedByTurn / totalTrials * 100).toFixed(2);
              
              turnProbabilities.push(probability);
              cumulativeProbabilities.push(cumulative);
            }
          } else {
            // No successful evolutions
            $('#successRateEvolve').text('0.00%');
            $('#avgTurnsEvolve').text('N/A');
            $('#medianTurnsEvolve').text('N/A');
            $('#minTurnsEvolve').text('N/A');
            $('#maxTurnsEvolve').text('N/A');


            for (let turn = 1; turn <= 20; turn++) {
              turnProbabilities.push('0.00');
              cumulativeProbabilities.push('0.00');
            }
          }

          // Update probability table
          const tableRows = [];
          const maxTurnsForTable = successfulEvolutions > 0 ? Math.min(Math.max(...results), 20) : 20;
          for (let turn = 1; turn <= maxTurnsForTable; turn++) {
            const probability = turnProbabilities[turn - 1];
            const cumulative = cumulativeProbabilities[turn - 1];
            tableRows.push(`
              <tr>
                <td>${turn}</td>
                <td>${probability}%</td>
                <td>${cumulative}%</td>
              </tr>
            `);
          }
          $('#evolveProbabilityTable').html(tableRows.join(''));

          // Store current results
          const currentResults = {
            results,
            turnProbabilities,
            cumulativeProbabilities,
            successfulEvolutions,
            successRate,
            config: currentConfig
          };
          
          // Remove loading state and update chart
          $chartContainer.removeClass('loading');
          $chartContainer.find('.progress').hide();
          
          // Create comparison layout if we have previous results
          if (previousResults && simulationCount > 1) {
            // Clear any existing charts first
            if (window.evolveChartInstance) {
              window.evolveChartInstance.destroy();
              window.evolveChartInstance = null;
            }
            createComparisonLayout(currentResults, previousResults);
          } else {
            // First simulation - show single result
            displaySingleResult(currentResults);
          }
          
          // Store current results as previous for next comparison
          previousResults = currentResults;
          previousConfig = currentConfig;
        }
      }

      // Start processing batches
      processBatch();
    }, 50);
  });
}

// Function to display single result
function displaySingleResult(results) {
  const $chartContainer = $('#evolveChartContainer');
  
  try {
    updateEvolveChart(results.results, results.turnProbabilities, results.cumulativeProbabilities);
  } catch (error) {
    console.error('Error updating chart:', error);
    $chartContainer.html(`
      <div class="alert alert-danger">
        <h5>Chart Error</h5>
        <p>Unable to create chart. Results:</p>
        <ul>
          <li>Success Rate: ${results.successRate}%</li>
          <li>Successful Evolutions: ${results.successfulEvolutions}</li>
        </ul>
      </div>
    `);
  }
}

// Function to create comparison layout
function createComparisonLayout(currentResults, previousResults) {
  const $chartContainer = $('#evolveChartContainer');
  
  // Simple text-based comparison to avoid chart issues
  $chartContainer.html(`
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-chart-bar me-2"></i>Previous Simulation
              <small class="text-muted">(${previousResults.config.timestamp})</small>
            </h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Config:</strong> ${previousResults.config.basicCount}-${previousResults.config.stage1Count}-${previousResults.config.stage2Count}
              <br><strong>Success Rate:</strong> ${previousResults.successRate}%
              <br><strong>Successful Evolutions:</strong> ${previousResults.successfulEvolutions}
            </div>
            <div class="progress mb-2">
              <div class="progress-bar bg-primary" style="width: ${previousResults.successRate}%"></div>
            </div>
            <small class="text-muted">Success Rate: ${previousResults.successRate}%</small>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-chart-line me-2"></i>Current Simulation
              <small class="text-muted">(${currentResults.config.timestamp})</small>
            </h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Config:</strong> ${currentResults.config.basicCount}-${currentResults.config.stage1Count}-${currentResults.config.stage2Count}
              <br><strong>Success Rate:</strong> ${currentResults.successRate}%
              <br><strong>Successful Evolutions:</strong> ${currentResults.successfulEvolutions}
            </div>
            <div class="progress mb-2">
              <div class="progress-bar bg-success" style="width: ${currentResults.successRate}%"></div>
            </div>
            <small class="text-muted">Success Rate: ${currentResults.successRate}%</small>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-balance-scale me-2"></i>Comparison Summary
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Previous (${previousResults.config.basicCount}-${previousResults.config.stage1Count}-${previousResults.config.stage2Count})</h6>
                <ul class="list-unstyled">
                  <li><strong>Success Rate:</strong> ${previousResults.successRate}%</li>
                  <li><strong>Successful Evolutions:</strong> ${previousResults.successfulEvolutions}</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Current (${currentResults.config.basicCount}-${currentResults.config.stage1Count}-${currentResults.config.stage2Count})</h6>
                <ul class="list-unstyled">
                  <li><strong>Success Rate:</strong> ${currentResults.successRate}%</li>
                  <li><strong>Successful Evolutions:</strong> ${currentResults.successfulEvolutions}</li>
                </ul>
              </div>
            </div>
            <hr>
            <div class="text-center">
              <strong>Improvement:</strong> 
              <span class="badge ${parseFloat(currentResults.successRate) > parseFloat(previousResults.successRate) ? 'bg-success' : 'bg-danger'}">
                ${(parseFloat(currentResults.successRate) - parseFloat(previousResults.successRate)).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Evolution Charts Comparison -->
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-chart-bar me-2"></i>Previous Simulation Chart
            </h6>
          </div>
          <div class="card-body">
            <canvas id="previousChart" style="height: 300px;"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-chart-line me-2"></i>Current Simulation Chart
            </h6>
          </div>
          <div class="card-body">
            <canvas id="currentChart" style="height: 300px;"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Turn-by-Turn Comparison -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-clock me-2"></i>Turn-by-Turn Evolution Comparison
            </h6>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Turn</th>
                    <th>Previous (${previousResults.config.basicCount}-${previousResults.config.stage1Count}-${previousResults.config.stage2Count})</th>
                    <th>Current (${currentResults.config.basicCount}-${currentResults.config.stage1Count}-${currentResults.config.stage2Count})</th>
                    <th>Difference</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateTurnComparisonTable(previousResults, currentResults)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Evolution Timing Analysis -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-chart-line me-2"></i>Evolution Timing Analysis
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Previous Simulation</h6>
                <ul class="list-unstyled">
                  <li><strong>Average Turns:</strong> ${calculateAverageTurns(previousResults.results)}</li>
                  <li><strong>Fastest Evolution:</strong> ${Math.min(...previousResults.results)} turns</li>
                  <li><strong>Slowest Evolution:</strong> ${Math.max(...previousResults.results)} turns</li>
                  <li><strong>Median Turns:</strong> ${calculateMedianTurns(previousResults.results)}</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Current Simulation</h6>
                <ul class="list-unstyled">
                  <li><strong>Average Turns:</strong> ${calculateAverageTurns(currentResults.results)}</li>
                  <li><strong>Fastest Evolution:</strong> ${Math.min(...currentResults.results)} turns</li>
                  <li><strong>Slowest Evolution:</strong> ${Math.max(...currentResults.results)} turns</li>
                  <li><strong>Median Turns:</strong> ${calculateMedianTurns(currentResults.results)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
  `);
  
  // Create charts after HTML is generated
  setTimeout(() => {
    createComparisonCharts(previousResults, currentResults);
  }, 100);
}

// Helper function to generate turn comparison table
function generateTurnComparisonTable(previousResults, currentResults) {
  const maxTurns = Math.max(
    Math.max(...previousResults.results),
    Math.max(...currentResults.results)
  );
  
  let tableRows = '';
  
  for (let turn = 1; turn <= Math.min(maxTurns, 20); turn++) {
    const prevEvolvedByTurn = previousResults.results.filter(turns => turns <= turn).length;
    const currEvolvedByTurn = currentResults.results.filter(turns => turns <= turn).length;
    const prevPercentage = ((prevEvolvedByTurn / previousResults.results.length) * 100).toFixed(1);
    const currPercentage = ((currEvolvedByTurn / currentResults.results.length) * 100).toFixed(1);
    const difference = (parseFloat(currPercentage) - parseFloat(prevPercentage)).toFixed(1);
    
    const differenceClass = parseFloat(difference) > 0 ? 'text-success' : parseFloat(difference) < 0 ? 'text-danger' : 'text-muted';
    const differenceIcon = parseFloat(difference) > 0 ? '↗' : parseFloat(difference) < 0 ? '↘' : '→';
    
    tableRows += `
      <tr>
        <td><strong>Turn ${turn}</strong></td>
        <td>
          <div class="d-flex align-items-center">
            <div class="progress flex-grow-1 me-2" style="height: 20px;">
              <div class="progress-bar bg-primary" style="width: ${prevPercentage}%"></div>
            </div>
            <span class="badge bg-primary">${prevPercentage}%</span>
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <div class="progress flex-grow-1 me-2" style="height: 20px;">
              <div class="progress-bar bg-success" style="width: ${currPercentage}%"></div>
            </div>
            <span class="badge bg-success">${currPercentage}%</span>
          </div>
        </td>
        <td class="${differenceClass}">
          <strong>${differenceIcon} ${Math.abs(difference)}%</strong>
        </td>
      </tr>
    `;
  }
  
  return tableRows;
}

// Helper function to calculate average turns
function calculateAverageTurns(results) {
  if (results.length === 0) return 'N/A';
  const sum = results.reduce((a, b) => a + b, 0);
  return (sum / results.length).toFixed(1);
}

// Helper function to calculate median turns
function calculateMedianTurns(results) {
  if (results.length === 0) return 'N/A';
  const sorted = [...results].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1)
    : sorted[mid].toFixed(1);
}

// Function to create comparison charts
function createComparisonCharts(previousResults, currentResults) {
  try {
    // Destroy any existing chart instances first
    if (window.previousChartInstance) {
      window.previousChartInstance.destroy();
      window.previousChartInstance = null;
    }
    if (window.currentChartInstance) {
      window.currentChartInstance.destroy();
      window.currentChartInstance = null;
    }
    
    // Create previous chart
    const prevCanvas = document.getElementById('previousChart');
    if (prevCanvas && prevCanvas.tagName === 'CANVAS') {
      const prevCtx = prevCanvas.getContext('2d');
      window.previousChartInstance = new Chart(prevCtx, {
        type: 'bar',
        data: {
          labels: Array.from({length: Math.min(20, previousResults.results.length)}, (_, i) => `Turn ${i + 1}`),
          datasets: [{
            label: 'Evolution Frequency',
            data: previousResults.results.slice(0, 20),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: 'Frequency'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Turn Number'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Previous: ${previousResults.config.basicCount}-${previousResults.config.stage1Count}-${previousResults.config.stage2Count} (${previousResults.successRate}%)`
            }
          }
        }
      });
    }
    
    // Create current chart
    const currCanvas = document.getElementById('currentChart');
    if (currCanvas && currCanvas.tagName === 'CANVAS') {
      const currCtx = currCanvas.getContext('2d');
      window.currentChartInstance = new Chart(currCtx, {
        type: 'bar',
        data: {
          labels: Array.from({length: Math.min(20, currentResults.results.length)}, (_, i) => `Turn ${i + 1}`),
          datasets: [{
            label: 'Evolution Frequency',
            data: currentResults.results.slice(0, 20),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: 'Frequency'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Turn Number'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Current: ${currentResults.config.basicCount}-${currentResults.config.stage1Count}-${currentResults.config.stage2Count} (${currentResults.successRate}%)`
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error creating comparison charts:', error);
  }
}
