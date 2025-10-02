import { updateEvolveChart } from './charts.js';
import { createComparisonLayout, displaySingleResult } from './evolveComparison.js';
import { simulateEvolution } from './evolveSimulationCore.js';
import { initializeEvolveUI } from './evolveUI.js';

// Global variables to store previous results
let previousResults = null;
let previousConfig = null;
let simulationCount = 0;
let isCreatingCharts = false;

export function initializeEvolveSimulator() {
  // Initialize UI components
  initializeEvolveUI();

        $('#simulateEvolveBtn').on('click', function() {
          const basicCount = parseInt($('input[name="basicCount"]:checked').val());
          const stage1Count = parseInt($('input[name="stage1Count"]:checked').val());
          const stage2Count = parseInt($('input[name="stage2Count"]:checked').val());
    const cyrusCount = 0; // Cyrus removed from options
    const professorCount = parseInt($('input[name="professorCount"]:checked').val());
    const pokeballCount = parseInt($('input[name="pokeballCount"]:checked').val());
    const targetStage2Count = parseInt($('input[name="targetStage2Count"]:checked').val());
          const simulationRuns = parseInt($('#simulationRuns').val()) || 1000;
          const debugMode = $('#debugMode').is(':checked');
    const $chartContainer = $('#evolveChartContainer');
    const $progressBar = $('.progress-bar');
    const $debugOutput = $('#debugOutput');
    const $debugSteps = $('#debugSteps');
    
    // Store current configuration
    const currentConfig = {
      basicCount,
      stage1Count,
      stage2Count,
      cyrusCount,
      professorCount,
      pokeballCount,
      targetStage2Count,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Increment simulation count
    simulationCount++;

    // Validate deck composition
    const totalCards = basicCount + stage1Count + stage2Count + cyrusCount + professorCount + pokeballCount;
    if (totalCards > 20) {
      alert('Error: Total cards cannot exceed 20. Current total: ' + totalCards);
      return;
    }
    
    // Validate that we have at least 1 Basic Pokemon for evolution
    if (basicCount === 0) {
      alert('Error: You need at least 1 Basic Pokemon to start evolution. Please add Basic Pokemon to your deck.');
      return;
    }
    
    // Handle debug mode
    if (debugMode) {
      $debugOutput.show();
      $debugSteps.html('<div class="text-center"><i class="fas fa-spinner fa-spin me-2"></i>Running debug simulation...</div>');
      $chartContainer.hide();
    } else {
      $debugOutput.hide();
      $chartContainer.show();
    }

    // Handle debug mode simulation
    if (debugMode) {
      // Capture console output for debug mode
      const originalLog = console.log;
      let debugOutput = '';
      console.log = function(...args) {
        debugOutput += args.join(' ') + '\n';
        originalLog.apply(console, args);
      };
      
      // Run single simulation with debug
      const result = simulateEvolution(null, basicCount, stage1Count, stage2Count, cyrusCount, professorCount, pokeballCount, targetStage2Count, true);
      
      // Restore console.log
      console.log = originalLog;
      
      // Display debug output
      $debugSteps.html(`<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.9em;">${debugOutput}</pre>`);
      
      // Show result
      if (result !== -1) {
        $debugSteps.append(`<div class="alert alert-success mt-3"><strong>SUCCESS!</strong> Stage 2 evolution achieved on turn ${result}</div>`);
      } else {
        $debugSteps.append(`<div class="alert alert-danger mt-3"><strong>FAILED!</strong> No Stage 2 evolution achieved within 50 turns</div>`);
      }
      
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
          const result = simulateEvolution(null, basicCount, stage1Count, stage2Count, cyrusCount, professorCount, pokeballCount, targetStage2Count);
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
            displaySingleResult(currentResults, updateEvolveChart);
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
