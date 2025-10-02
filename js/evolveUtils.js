// Utility functions for Pokemon evolution simulator

// Helper function to get supporter card information
export function getSupporterInfo(config) {
  const cyrusCount = 0; // Cyrus removed from options
  const professorCount = config.professorCount || 0;
  const pokeballCount = config.pokeballCount || 0;
  const rareCandyCount = config.rareCandyCount || 0;
  
  let supporterText = '';
  const parts = [];
  
  if (cyrusCount > 0) parts.push(`Cyrus: ${cyrusCount}`);
  if (professorCount > 0) parts.push(`Professor: ${professorCount}`);
  if (pokeballCount > 0) parts.push(`Poké Ball: ${pokeballCount}`);
  if (rareCandyCount > 0) parts.push(`Rare Candy: ${rareCandyCount}`);
  
  if (parts.length > 0) {
    supporterText = parts.join(', ');
  } else {
    supporterText = 'No Supporters/Items';
  }
  
  return supporterText;
}

// Helper function to calculate average turns
export function calculateAverageTurns(results) {
  if (results.length === 0) return 'N/A';
  const sum = results.reduce((a, b) => a + b, 0);
  return (sum / results.length).toFixed(1);
}

// Helper function to calculate median turns
export function calculateMedianTurns(results) {
  if (results.length === 0) return 'N/A';
  const sorted = [...results].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1)
    : sorted[mid].toFixed(1);
}

// Helper function to generate turn comparison table
export function generateTurnComparisonTable(previousResults, currentResults) {
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
