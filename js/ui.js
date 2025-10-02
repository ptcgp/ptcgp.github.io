import { updateCollectionChart, updateSpecificChart } from './charts.js';
import { PACK_CARD_COUNTS_ARRAY, RARITIES, RARITY_SYMBOLS, gold_price } from './constants.js';
import { DRAW_RATES_TYPED } from './drawRates.js';
import { calculateOptimalGoldPurchase, findOptimalGoldPackage } from './goldCalculator.js';
import { PACK_TYPES } from './packTypes.js';
import { simulateCollection, simulatePackOpening, simulateSpecificCard } from './simulator.js';

// Function to populate all pack type dropdowns
function populatePackTypeDropdowns() {
  const dropdownIds = [
    'packType',
    'packType2',
    'collectionPackType1', 
    'collectionPackType2',
    'specificPackType1',
    'specificPackType2',
    'evolvePackType'
  ];

  dropdownIds.forEach(dropdownId => {
    const $dropdown = $(`#${dropdownId}`);
    const currentValue = $dropdown.val();
    
    // Clear existing options
    $dropdown.empty();
    
    // Add "None" option for optional dropdowns
    if (dropdownId === 'packType2' || dropdownId === 'collectionPackType2' || dropdownId === 'specificPackType2') {
      $dropdown.append('<option value="">None</option>');
    }
    
    // Add options from PACK_TYPES
    PACK_TYPES.forEach(packType => {
      const $option = $(`<option value="${packType.value}">${packType.label}</option>`);
      $dropdown.append($option);
    });
    
    // Restore previous value if it exists
    if (currentValue && (PACK_TYPES.some(p => p.value === currentValue) || currentValue === '')) {
      $dropdown.val(currentValue);
    }
  });
}

export function initializePackSimulator() {
  // Populate dropdown on initialization
  populatePackTypeDropdowns();
  $('#simulateBtn').on('click', function() {
    const packType1 = $('#packType').val();
    const packType2 = $('#packType2').val();
    const packCount = parseInt($('#packCount').val());
    const runCount = parseInt($('#runCount').val());
    const $error = $('#error');

    if (isNaN(packCount) || packCount < 1 || packCount > 1000000) {
      $error.removeClass('d-none');
      return;
    }
    if (isNaN(runCount) || runCount < 1 || runCount > 10000) {
      $error.removeClass('d-none');
      return;
    }
    $error.addClass('d-none');

    // Multi-run simulation
    const allRunResults1 = [];
    const allRunResults2 = [];
    const packRates1 = DRAW_RATES_TYPED[packType1]?.pack_rates || [[0.9995, "regular"], [0.0005, "rare"]];
    const packRates2 = packType2 ? DRAW_RATES_TYPED[packType2]?.pack_rates || [[0.9995, "regular"], [0.0005, "rare"]] : null;

    // Run simulations
    for (let run = 0; run < runCount; run++) {
      // Simulate first pack type for this run
      const runResults1 = new Array(RARITY_SYMBOLS.length).fill(0);
      const packTypeCounts1 = {};

      for (let i = 0; i < packCount; i++) {
        const random = Math.random();
        let cumulative = 0;
        let selectedPackType = "regular";
        for (const [rate, packTypeName] of packRates1) {
          cumulative += rate;
          if (random < cumulative) {
            selectedPackType = packTypeName;
            break;
          }
        }

        packTypeCounts1[selectedPackType] = (packTypeCounts1[selectedPackType] || 0) + 1;

        const isGodPack = selectedPackType === "rare";
        const isBabyPack = selectedPackType === "baby";
        const packResults = simulatePackOpening(packType1, isGodPack, isBabyPack);
        for (let j = 0; j < runResults1.length; j++) {
          runResults1[j] += packResults.counts[j];
        }
      }

      allRunResults1.push(runResults1);

      // Simulate second pack type for this run if selected
      if (packType2) {
        const runResults2 = new Array(RARITY_SYMBOLS.length).fill(0);
        const packTypeCounts2 = {};

        for (let i = 0; i < packCount; i++) {
          const random = Math.random();
          let cumulative = 0;
          let selectedPackType = "regular";
          for (const [rate, packTypeName] of packRates2) {
            cumulative += rate;
            if (random < cumulative) {
              selectedPackType = packTypeName;
              break;
            }
          }

          packTypeCounts2[selectedPackType] = (packTypeCounts2[selectedPackType] || 0) + 1;

          const isGodPack = selectedPackType === "rare";
          const isBabyPack = selectedPackType === "baby";
          const packResults = simulatePackOpening(packType2, isGodPack, isBabyPack);
          for (let j = 0; j < runResults2.length; j++) {
            runResults2[j] += packResults.counts[j];
          }
        }

        allRunResults2.push(runResults2);
      }
    }

    // Calculate totals for display (sum of all runs)
    const results1 = new Array(RARITY_SYMBOLS.length).fill(0);
    const results2 = new Array(RARITY_SYMBOLS.length).fill(0);
    
    for (let run = 0; run < runCount; run++) {
      for (let j = 0; j < RARITY_SYMBOLS.length; j++) {
        results1[j] += allRunResults1[run][j];
        if (packType2) {
          results2[j] += allRunResults2[run][j];
        }
      }
    }

    // Calculate pack type distribution (average across all runs)
    const packTypeCounts1 = {};
    const packTypeCounts2 = {};
    
    // This is a simplified version - in a real implementation, you'd track pack types per run
    // For now, we'll just show the total results

    // Show pack distribution
    let packDistHtml = '';
    for (const [packTypeName, count] of Object.entries(packTypeCounts1)) {
      const percentage = ((count / packCount) * 100).toFixed(2);
      let displayName;
      if (packTypeName === "rare") {
        displayName = "God Packs";
      } else if (packTypeName === "baby") {
        displayName = "Baby Packs";
      } else {
        displayName = packTypeName.charAt(0).toUpperCase() + packTypeName.slice(1) + ' Packs';
      }
      packDistHtml += `
        <div class="result-item d-flex justify-content-between">
          <span>${displayName}:</span>
          <span>${count} (${percentage}%)</span>
        </div>
      `;
    }
    $('#packResults').html(packDistHtml);

    // Show/hide second pack results and adjust column widths
    if (packType2) {
      $('#pack2Results').show();
      $('#pack1Results').removeClass('col-md-12').addClass('col-md-6');
    } else {
      $('#pack2Results').hide();
      $('#pack1Results').removeClass('col-md-6').addClass('col-md-12');
    }

    // Calculate and show card distribution for pack 1
    const cardCounts1 = PACK_CARD_COUNTS_ARRAY[packType1];
    const totalCards1 = results1.reduce((a, b) => a + b, 0);

    // Get all rarities that have cards in either pack for alignment
    const allRarities = [];
    for (let i = 0; i < RARITIES.length; i++) {
      const hasCards1 = cardCounts1[i] > 0;
      const hasCards2 = packType2 ? PACK_CARD_COUNTS_ARRAY[packType2][i] > 0 : false;
      if (hasCards1 || hasCards2) {
        allRarities.push(i);
      }
    }

    const tableRows1 = allRarities.map(index => {
      const count = cardCounts1[index] || 0;
      const pulled = results1[index] || 0;
      const pullRate = totalCards1 > 0 ? (pulled / totalCards1 * 100).toFixed(2) : '0.00';
      return `
        <tr>
          <td>${RARITIES[index].name}</td>
          <td>${count}</td>
          <td>${pulled}</td>
          <td>${pullRate}%</td>
        </tr>
      `;
    }).join('');

    $('#cardDistributionTable1').html(tableRows1);
    $('#totalCards1').text(totalCards1);

    // Calculate and show card distribution for pack 2 if selected
    if (packType2) {
      const cardCounts2 = PACK_CARD_COUNTS_ARRAY[packType2];
      const totalCards2 = results2.reduce((a, b) => a + b, 0);

      const tableRows2 = allRarities.map(index => {
        const count = cardCounts2[index] || 0;
        const pulled = results2[index] || 0;
        const pullRate = totalCards2 > 0 ? (pulled / totalCards2 * 100).toFixed(2) : '0.00';
        return `
          <tr>
            <td>${RARITIES[index].name}</td>
            <td>${count}</td>
            <td>${pulled}</td>
            <td>${pullRate}%</td>
          </tr>
        `;
      }).join('');

      $('#cardDistributionTable2').html(tableRows2);
      $('#totalCards2').text(totalCards2);
    }

    // Calculate and display multi-run statistics
    if (runCount > 1) {
      $('#multiRunStats').show();
      
      // Adjust layout based on whether pack type 2 is selected
      if (packType2) {
        // Both pack types selected - use side-by-side layout
        $('#multiRunStats1').removeClass('col-md-12').addClass('col-md-6');
        $('#multiRunStats2').show();
      } else {
        // Only pack type 1 selected - make it full width
        $('#multiRunStats1').removeClass('col-md-6').addClass('col-md-12');
        $('#multiRunStats2').hide();
      }
      
      // Calculate statistics for pack type 1
      const cardCounts1 = PACK_CARD_COUNTS_ARRAY[packType1];
      const multiRunTable1 = [];
      
      // Get pack name from PACK_TYPES
      const packName1 = PACK_TYPES.find(p => p.value === packType1)?.label || packType1;
      $('#multiRunStats1 h4').text(`${packName1} - Rarity Distribution Across All Runs`);
      
      for (let i = 0; i < RARITIES.length; i++) {
        if (cardCounts1[i] > 0) {
          const runValues = allRunResults1.map(run => run[i]);
          const avg = (runValues.reduce((a, b) => a + b, 0) / runCount).toFixed(2);
          const min = Math.min(...runValues);
          const max = Math.max(...runValues);
          const variance = runValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / runCount;
          const stdDev = Math.sqrt(variance).toFixed(2);
          
          multiRunTable1.push(`
            <tr>
              <td>${RARITIES[i].name}</td>
              <td>${avg}</td>
              <td>${min}</td>
              <td>${max}</td>
              <td>${stdDev}</td>
            </tr>
          `);
        }
      }
      
      $('#multiRunTable1').html(multiRunTable1.join(''));
      
      // Calculate statistics for pack type 2 if selected
      if (packType2) {
        const cardCounts2 = PACK_CARD_COUNTS_ARRAY[packType2];
        const multiRunTable2 = [];
        
        // Get pack name from PACK_TYPES
        const packName2 = PACK_TYPES.find(p => p.value === packType2)?.label || packType2;
        $('#multiRunStats2 h4').text(`${packName2} - Rarity Distribution Across All Runs`);
        
        for (let i = 0; i < RARITIES.length; i++) {
          if (cardCounts2[i] > 0) {
            const runValues = allRunResults2.map(run => run[i]);
            const avg = (runValues.reduce((a, b) => a + b, 0) / runCount).toFixed(2);
            const min = Math.min(...runValues);
            const max = Math.max(...runValues);
            const variance = runValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / runCount;
            const stdDev = Math.sqrt(variance).toFixed(2);
            
            multiRunTable2.push(`
              <tr>
                <td>${RARITIES[i].name}</td>
                <td>${avg}</td>
                <td>${min}</td>
                <td>${max}</td>
                <td>${stdDev}</td>
              </tr>
            `);
          }
        }
        
        $('#multiRunTable2').html(multiRunTable2.join(''));
      }
    } else {
      $('#multiRunStats').hide();
    }
  });
}

export function initializeCollectionSimulator() {
  // Populate dropdown on initialization
  populatePackTypeDropdowns();
  
  $('#simulateCollectionBtn').on('click', function() {
    const packType1 = $('#collectionPackType1').val();
    const packType2 = $('#collectionPackType2').val();
    const excludeRareCards = $('#excludeRareCards').is(':checked');
    const needDouble = $('#doubleCollection').is(':checked');
    const $chartContainer = $('#chartContainer');
    const $progressBar = $('.progress-bar');
    const $stats2Container = $('#stats2Container');

    // Show loading state
    $chartContainer.addClass('loading');
    $chartContainer.attr('data-progress', 'Simulating... 0%');
    $progressBar.css('width', '0%').attr('aria-valuenow', 0);

    setTimeout(() => {
      const results1 = [];
      const results2 = [];
      const totalTrials = 10000;
      const batchSize = 50;
      let processed = 0;

      function processBatch() {
        for (let i = 0; i < batchSize && processed < totalTrials; i++) {
          results1.push(simulateCollection(packType1, excludeRareCards, needDouble));
          if (packType2) {
            results2.push(simulateCollection(packType2, excludeRareCards, needDouble));
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
          // Calculate statistics for pack type 1
          const sortedResults1 = [...results1].sort((a, b) => a - b);
          const p10_1 = sortedResults1[Math.floor(sortedResults1.length * 0.1)];
          const p20_1 = sortedResults1[Math.floor(sortedResults1.length * 0.2)];
          const p30_1 = sortedResults1[Math.floor(sortedResults1.length * 0.3)];
          const p40_1 = sortedResults1[Math.floor(sortedResults1.length * 0.4)];
          const p50_1 = sortedResults1[Math.floor(sortedResults1.length * 0.5)];
          const p60_1 = sortedResults1[Math.floor(sortedResults1.length * 0.6)];
          const p70_1 = sortedResults1[Math.floor(sortedResults1.length * 0.7)];
          const p80_1 = sortedResults1[Math.floor(sortedResults1.length * 0.8)];
          const p90_1 = sortedResults1[Math.floor(sortedResults1.length * 0.9)];
          const avg1 = Math.round(results1.reduce((a, b) => a + b) / results1.length);
          const min1 = Math.min(...results1);
          const max1 = Math.max(...results1);

          // Update pack type 1 statistics
          $('#p10Packs1').text(p10_1);
          $('#p20Packs1').text(p20_1);
          $('#p30Packs1').text(p30_1);
          $('#p40Packs1').text(p40_1);
          $('#p50Packs1').text(p50_1);
          $('#p60Packs1').text(p60_1);
          $('#p70Packs1').text(p70_1);
          $('#p80Packs1').text(p80_1);
          $('#p90Packs1').text(p90_1);
          $('#avgPacks1').text(avg1);
          $('#minPacks1').text(min1);
          $('#maxPacks1').text(max1);

          if (packType2) {
            // Calculate statistics for pack type 2
            const sortedResults2 = [...results2].sort((a, b) => a - b);
            const p10_2 = sortedResults2[Math.floor(sortedResults2.length * 0.1)];
            const p20_2 = sortedResults2[Math.floor(sortedResults2.length * 0.2)];
            const p30_2 = sortedResults2[Math.floor(sortedResults2.length * 0.3)];
            const p40_2 = sortedResults2[Math.floor(sortedResults2.length * 0.4)];
            const p50_2 = sortedResults2[Math.floor(sortedResults2.length * 0.5)];
            const p60_2 = sortedResults2[Math.floor(sortedResults2.length * 0.6)];
            const p70_2 = sortedResults2[Math.floor(sortedResults2.length * 0.7)];
            const p80_2 = sortedResults2[Math.floor(sortedResults2.length * 0.8)];
            const p90_2 = sortedResults2[Math.floor(sortedResults2.length * 0.9)];
            const avg2 = Math.round(results2.reduce((a, b) => a + b) / results2.length);
            const min2 = Math.min(...results2);
            const max2 = Math.max(...results2);

            // Update pack type 2 statistics
            $('#p10Packs2').text(p10_2);
            $('#p20Packs2').text(p20_2);
            $('#p30Packs2').text(p30_2);
            $('#p40Packs2').text(p40_2);
            $('#p50Packs2').text(p50_2);
            $('#p60Packs2').text(p60_2);
            $('#p70Packs2').text(p70_2);
            $('#p80Packs2').text(p80_2);
            $('#p90Packs2').text(p90_2);
            $('#avgPacks2').text(avg2);
            $('#minPacks2').text(min2);
            $('#maxPacks2').text(max2);
            $stats2Container.show();
          } else {
            $stats2Container.hide();
          }

          // Remove loading state and update chart
          $chartContainer.removeClass('loading');
          updateCollectionChart(results1, packType1, results2, packType2);
        }
      }

      // Start processing batches
      processBatch();
    }, 50);
  });
}

export function initializeSpecificCardSimulator() {
  // Populate dropdown on initialization
  populatePackTypeDropdowns();
  
  function updateTargetRarityOptions1() {
    // Update first pack's rarities
    const packType1 = $('#specificPackType1').val();
    const cardCounts1 = PACK_CARD_COUNTS_ARRAY[packType1];
    const $targetRarity1 = $('#targetRarity1');
    const currentValue1 = $targetRarity1.val();

    $targetRarity1.empty();
    cardCounts1.forEach((count, index) => {
      if (count > 0) {
        const optionText = `${RARITIES[index].name} (${count} different cards)`;
        $targetRarity1.append(`<option value="${index}">${optionText}</option>`);
      }
    });

    // Restore previous selection if it's still valid
    if (currentValue1 && $targetRarity1.find(`option[value="${currentValue1}"]`).length > 0) {
      $targetRarity1.val(currentValue1);
    }
  }

  function updateTargetRarityOptions2() {
    // Update second pack's rarities
    const packType2 = $('#specificPackType2').val();
    const $targetRarity2 = $('#targetRarity2');
    const currentValue2 = $targetRarity2.val();

    if (packType2) {
      const cardCounts2 = PACK_CARD_COUNTS_ARRAY[packType2];
      $targetRarity2.empty();
      cardCounts2.forEach((count, index) => {
        if (count > 0) {
          const optionText = `${RARITIES[index].name} (${count} different cards)`;
          $targetRarity2.append(`<option value="${index}">${optionText}</option>`);
        }
      });
      $targetRarity2.prop('disabled', false);

      // Restore previous selection if it's still valid
      if (currentValue2 && $targetRarity2.find(`option[value="${currentValue2}"]`).length > 0) {
        $targetRarity2.val(currentValue2);
      }
    } else {
      $targetRarity2.empty();
      $targetRarity2.append('<option value="">Select Pack Type 2 first</option>');
      $targetRarity2.prop('disabled', true);
    }
  }

  // Initialize target rarity options
  updateTargetRarityOptions1();
  updateTargetRarityOptions2();
  $('#specificPackType1').on('change', updateTargetRarityOptions1);
  $('#specificPackType2').on('change', updateTargetRarityOptions2);

  // Specific Card Simulator
  $('#simulateSpecificBtn').on('click', function() {
    const packType1 = $('#specificPackType1').val();
    const targetRarity1 = parseInt($('#targetRarity1').val());
    const packType2 = $('#specificPackType2').val();
    const targetRarity2 = $('#targetRarity2').val() ? parseInt($('#targetRarity2').val()) : null;
    const needDouble = $('#doubleSpecific').is(':checked');
    const $chartContainer = $('#specificChartContainer');
    const $progressBar = $chartContainer.find('.progress-bar');
    const $stats2Container = $('#stats2ContainerSpecific');

    // Show loading state
    $chartContainer.addClass('loading');
    $chartContainer.attr('data-progress', 'Simulating... 0%');
    $progressBar.css('width', '0%').attr('aria-valuenow', 0);

    setTimeout(() => {
      const results1 = [];
      const results2 = [];
      const totalTrials = 10000;
      const batchSize = 50;
      let processed = 0;

      function processBatch() {
        for (let i = 0; i < batchSize && processed < totalTrials; i++) {
          results1.push(simulateSpecificCard(packType1, targetRarity1, needDouble));
          if (packType2 && targetRarity2 !== null) {
            results2.push(simulateSpecificCard(packType2, targetRarity2, needDouble));
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
          // Calculate statistics for rarity 1
          const sortedResults1 = [...results1].sort((a, b) => a - b);
          const p10_1 = sortedResults1[Math.floor(sortedResults1.length * 0.1)];
          const p20_1 = sortedResults1[Math.floor(sortedResults1.length * 0.2)];
          const p30_1 = sortedResults1[Math.floor(sortedResults1.length * 0.3)];
          const p40_1 = sortedResults1[Math.floor(sortedResults1.length * 0.4)];
          const p50_1 = sortedResults1[Math.floor(sortedResults1.length * 0.5)];
          const p60_1 = sortedResults1[Math.floor(sortedResults1.length * 0.6)];
          const p70_1 = sortedResults1[Math.floor(sortedResults1.length * 0.7)];
          const p80_1 = sortedResults1[Math.floor(sortedResults1.length * 0.8)];
          const p90_1 = sortedResults1[Math.floor(sortedResults1.length * 0.9)];
          const avg1 = Math.round(results1.reduce((a, b) => a + b) / results1.length);
          const min1 = Math.min(...results1);
          const max1 = Math.max(...results1);

          // Update rarity 1 statistics
          $('#p10PacksSpecific1').text(p10_1);
          $('#p20PacksSpecific1').text(p20_1);
          $('#p30PacksSpecific1').text(p30_1);
          $('#p40PacksSpecific1').text(p40_1);
          $('#p50PacksSpecific1').text(p50_1);
          $('#p60PacksSpecific1').text(p60_1);
          $('#p70PacksSpecific1').text(p70_1);
          $('#p80PacksSpecific1').text(p80_1);
          $('#p90PacksSpecific1').text(p90_1);
          $('#avgPacksSpecific1').text(avg1);
          $('#minPacksSpecific1').text(min1);
          $('#maxPacksSpecific1').text(max1);

          if (packType2 && targetRarity2 !== null) {
            // Calculate statistics for rarity 2
            const sortedResults2 = [...results2].sort((a, b) => a - b);
            const p10_2 = sortedResults2[Math.floor(sortedResults2.length * 0.1)];
            const p20_2 = sortedResults2[Math.floor(sortedResults2.length * 0.2)];
            const p30_2 = sortedResults2[Math.floor(sortedResults2.length * 0.3)];
            const p40_2 = sortedResults2[Math.floor(sortedResults2.length * 0.4)];
            const p50_2 = sortedResults2[Math.floor(sortedResults2.length * 0.5)];
            const p60_2 = sortedResults2[Math.floor(sortedResults2.length * 0.6)];
            const p70_2 = sortedResults2[Math.floor(sortedResults2.length * 0.7)];
            const p80_2 = sortedResults2[Math.floor(sortedResults2.length * 0.8)];
            const p90_2 = sortedResults2[Math.floor(sortedResults2.length * 0.9)];
            const avg2 = Math.round(results2.reduce((a, b) => a + b) / results2.length);
            const min2 = Math.min(...results2);
            const max2 = Math.max(...results2);

            // Update rarity 2 statistics
            $('#p10PacksSpecific2').text(p10_2);
            $('#p20PacksSpecific2').text(p20_2);
            $('#p30PacksSpecific2').text(p30_2);
            $('#p40PacksSpecific2').text(p40_2);
            $('#p50PacksSpecific2').text(p50_2);
            $('#p60PacksSpecific2').text(p60_2);
            $('#p70PacksSpecific2').text(p70_2);
            $('#p80PacksSpecific2').text(p80_2);
            $('#p90PacksSpecific2').text(p90_2);
            $('#avgPacksSpecific2').text(avg2);
            $('#minPacksSpecific2').text(min2);
            $('#maxPacksSpecific2').text(max2);
            $stats2Container.show();
          } else {
            $stats2Container.hide();
          }

          // Remove loading state and update chart
          $chartContainer.removeClass('loading');
          updateSpecificChart(results1, targetRarity1, targetRarity2 !== null ? results2 : null, targetRarity2);
        }
      }

      // Start processing batches
      processBatch();
    }, 50);
  });
}

export function initializeGoldCalculator() {
  $('#calculateGoldBtn').on('click', function() {
    const targetPacks = parseInt($('#targetPacks').val());
    const currency = $('#currency').val();
    const goldPerPack = 6;

    // Plan A: Suggested single package
    const totalGold = targetPacks * goldPerPack;
    const suggestion = findOptimalGoldPackage(totalGold);
    const suggestedGold = suggestion.gold;
    const suggestedCount = suggestion.count;
    const suggestedPrice = gold_price[currency][suggestedGold] * suggestedCount;
    const packsFromSuggested = Math.floor((suggestedGold * suggestedCount) / goldPerPack);
    const avgSuggestedPrice = suggestedPrice / packsFromSuggested;
    const extraPacks = packsFromSuggested - targetPacks;

    // Plan B: Exact gold needed
    const plan = calculateOptimalGoldPurchase(totalGold, currency);
    const avgExactPrice = plan.totalCost / targetPacks;

    // Update Plan A results
    $('#planAGold').text(suggestedCount > 1 ?
      `${suggestedCount}x ${suggestedGold} Gold` :
      `${suggestedGold} Gold`);
    $('#planACost').text(`${currency} ${suggestedPrice.toFixed(2)}`);
    $('#planAPacks').text(packsFromSuggested);
    $('#planAPerPack').text(`${currency} ${avgSuggestedPrice.toFixed(2)}`);
    $('#planAExtra').text(`+${extraPacks} packs`);

    // Update Plan B results
    $('#planBGold').text(`${totalGold} Gold`);
    $('#planBCost').text(`${currency} ${plan.totalCost.toFixed(2)}`);
    $('#planBPacks').text(targetPacks);
    $('#planBPerPack').text(`${currency} ${avgExactPrice.toFixed(2)}`);

    // Update Plan B purchase list
    const $planB = $('#planBPurchases').empty();
    Object.entries(plan.purchases).sort((a, b) => b[0] - a[0]).forEach(([gold, count]) => {
      const cost = gold_price[currency][gold];
      $planB.append(`
        <li class="mb-2">
          ${count}x ${gold} Gold (${currency} ${cost.toFixed(2)} each)
        </li>
      `);
    });
  });
}
