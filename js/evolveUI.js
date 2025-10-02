// UI handlers for Pokemon evolution simulator

// Update deck composition display when inputs change
export function updateDeckComposition() {
  const basicCount = parseInt($('input[name="basicCount"]:checked').val());
  const stage1Count = parseInt($('input[name="stage1Count"]:checked').val());
  const stage2Count = parseInt($('input[name="stage2Count"]:checked').val());
  const cyrusCount = 0; // Cyrus removed from options
  const professorCount = parseInt($('input[name="professorCount"]:checked').val());
  const pokeballCount = parseInt($('input[name="pokeballCount"]:checked').val());
  const rareCandyCount = parseInt($('input[name="rareCandyCount"]:checked').val());
  const totalCards = basicCount + stage1Count + stage2Count + cyrusCount + professorCount + pokeballCount + rareCandyCount;
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
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-primary mb-1">${basicCount}</div>
              <div class="small text-muted">Basic Pokemon</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-success mb-1">${stage1Count}</div>
              <div class="small text-muted">Stage 1 Pokemon</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-warning mb-1">${stage2Count}</div>
              <div class="small text-muted">Stage 2 Pokemon</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-info mb-1">${professorCount}</div>
              <div class="small text-muted">Professor's Research</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-dark mb-1">${pokeballCount}</div>
              <div class="small text-muted">Poké Ball</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-success mb-1">${rareCandyCount}</div>
              <div class="small text-muted">Rare Candy</div>
            </div>
          </div>
          <div class="col-md-2 col-6">
            <div class="text-center">
              <div class="h4 text-secondary mb-1">${remainingCards}</div>
              <div class="small text-muted">Other Cards</div>
            </div>
          </div>
        </div>
        <hr class="my-3">
        <div class="text-center">
          <span class="badge bg-primary fs-6">Total: ${totalCards} Cards + ${remainingCards} Other = 20 Cards</span>
        </div>
      </div>
    </div>
  `);
}

// Initialize UI event handlers
export function initializeEvolveUI() {
  // Update deck composition on input changes
  $('input[name="basicCount"], input[name="stage1Count"], input[name="stage2Count"], input[name="professorCount"], input[name="pokeballCount"], input[name="rareCandyCount"]').on('change', updateDeckComposition);
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
}
