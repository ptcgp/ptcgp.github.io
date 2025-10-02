// Comparison and chart logic for Pokemon evolution simulator
import { calculateAverageTurns, calculateMedianTurns, generateTurnComparisonTable, getSupporterInfo } from './evolveUtils.js';

// Function to display single result
export function displaySingleResult(results, updateEvolveChart) {
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
export function createComparisonLayout(currentResults, previousResults) {
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
              <br><strong>Supporters:</strong> ${getSupporterInfo(previousResults.config)}
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
              <br><strong>Supporters:</strong> ${getSupporterInfo(currentResults.config)}
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
                  <li><strong>Supporters:</strong> ${getSupporterInfo(previousResults.config)}</li>
                  <li><strong>Success Rate:</strong> ${previousResults.successRate}%</li>
                  <li><strong>Successful Evolutions:</strong> ${previousResults.successfulEvolutions}</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Current (${currentResults.config.basicCount}-${currentResults.config.stage1Count}-${currentResults.config.stage2Count})</h6>
                <ul class="list-unstyled">
                  <li><strong>Supporters:</strong> ${getSupporterInfo(currentResults.config)}</li>
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

// Function to create comparison charts
export function createComparisonCharts(previousResults, currentResults) {
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
    
    // Calculate frequency data for previous results
    const prevFrequencyData = [];
    for (let turn = 1; turn <= 20; turn++) {
      const evolvedOnTurn = previousResults.results.filter(turns => turns === turn).length;
      prevFrequencyData.push(evolvedOnTurn);
    }
    
    // Calculate cumulative probabilities for previous results
    const prevCumulativeData = [];
    for (let turn = 1; turn <= 20; turn++) {
      const evolvedByTurn = previousResults.results.filter(turns => turns <= turn).length;
      const percentage = ((evolvedByTurn / previousResults.results.length) * 100).toFixed(1);
      prevCumulativeData.push(parseFloat(percentage));
    }
    
    // Calculate frequency data for current results
    const currFrequencyData = [];
    for (let turn = 1; turn <= 20; turn++) {
      const evolvedOnTurn = currentResults.results.filter(turns => turns === turn).length;
      currFrequencyData.push(evolvedOnTurn);
    }
    
    // Calculate cumulative probabilities for current results
    const currCumulativeData = [];
    for (let turn = 1; turn <= 20; turn++) {
      const evolvedByTurn = currentResults.results.filter(turns => turns <= turn).length;
      const percentage = ((evolvedByTurn / currentResults.results.length) * 100).toFixed(1);
      currCumulativeData.push(parseFloat(percentage));
    }
    
    // Create previous chart
    const prevCanvas = document.getElementById('previousChart');
    if (prevCanvas && prevCanvas.tagName === 'CANVAS') {
      const prevCtx = prevCanvas.getContext('2d');
      window.previousChartInstance = new Chart(prevCtx, {
        type: 'bar',
        data: {
          labels: Array.from({length: 20}, (_, i) => `Turn ${i + 1}`),
          datasets: [{
            label: 'Frequency',
            data: prevFrequencyData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          }, {
            label: 'Cumulative Probability (%)',
            data: prevCumulativeData,
            type: 'line',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Frequency'
              },
              beginAtZero: true
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Cumulative Probability (%)'
              },
              grid: {
                drawOnChartArea: false,
              },
              beginAtZero: true,
              max: 100
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
          labels: Array.from({length: 20}, (_, i) => `Turn ${i + 1}`),
          datasets: [{
            label: 'Frequency',
            data: currFrequencyData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          }, {
            label: 'Cumulative Probability (%)',
            data: currCumulativeData,
            type: 'line',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Frequency'
              },
              beginAtZero: true
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Cumulative Probability (%)'
              },
              grid: {
                drawOnChartArea: false,
              },
              beginAtZero: true,
              max: 100
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
