import { RARITY_SYMBOLS } from './constants.js';

let collectionChart = null;
let specificChart = null;

export function updateCollectionChart(data1, label1, data2, label2) {
  const ctx = document.getElementById('collectionChart').getContext('2d');

  if (collectionChart) {
    collectionChart.destroy();
  }

  const binSize = 10;
  const datasets = [];

  // Process data for pack type 1
  const bins1 = {};
  const maxPacks1 = Math.max(...data1);

  for (let i = 0; i <= maxPacks1; i += binSize) {
    bins1[i] = 0;
  }

  data1.forEach(value => {
    const bin = Math.floor(value / binSize) * binSize;
    bins1[bin] = (bins1[bin] || 0) + 1;
  });

  const sortedBins1 = Object.keys(bins1).sort((a, b) => Number(a) - Number(b));
  const cumulativeData1 = [];
  let cumulative1 = 0;
  const totalTrials = data1.length;

  sortedBins1.forEach(bin => {
    cumulative1 += bins1[bin];
    const percentage = (cumulative1 / totalTrials) * 100;
    cumulativeData1.push({
      x: Number(bin),
      y: percentage
    });
  });

  datasets.push({
    label: `${label1} Completion Rate`,
    data: cumulativeData1,
    borderColor: 'rgba(54, 162, 235, 1)',
    backgroundColor: 'rgba(54, 162, 235, 0.1)',
    fill: true,
    tension: 0.4
  });

  // Process data for pack type 2 if exists
  if (data2 && data2.length > 0) {
    const bins2 = {};
    const maxPacks2 = Math.max(...data2);

    for (let i = 0; i <= maxPacks2; i += binSize) {
      bins2[i] = 0;
    }

    data2.forEach(value => {
      const bin = Math.floor(value / binSize) * binSize;
      bins2[bin] = (bins2[bin] || 0) + 1;
    });

    const sortedBins2 = Object.keys(bins2).sort((a, b) => Number(a) - Number(b));
    const cumulativeData2 = [];
    let cumulative2 = 0;

    sortedBins2.forEach(bin => {
      cumulative2 += bins2[bin];
      const percentage = (cumulative2 / totalTrials) * 100;
      cumulativeData2.push({
        x: Number(bin),
        y: percentage
      });
    });

    datasets.push({
      label: `${label2} Completion Rate`,
      data: cumulativeData2,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      fill: true,
      tension: 0.4
    });
  }

  collectionChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage of Trials Completed (%)'
          }
        },
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Number of Packs Needed'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Cumulative Probability of Completing Collection'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% completed within ${context.parsed.x} packs`;
            }
          }
        }
      }
    }
  });
}

export function updateSpecificChart(data1, rarity1, results2 = null, rarity2 = null) {
  const ctx = document.getElementById('specificChart').getContext('2d');

  if (specificChart) {
    specificChart.destroy();
  }

  const binSize = 10;
  const datasets = [];

  // Process data for rarity 1
  const bins1 = {};
  const maxPacks1 = Math.max(...data1);

  for (let i = 0; i <= maxPacks1; i += binSize) {
    bins1[i] = 0;
  }

  data1.forEach(value => {
    const bin = Math.floor(value / binSize) * binSize;
    bins1[bin] = (bins1[bin] || 0) + 1;
  });

  const sortedBins1 = Object.keys(bins1).sort((a, b) => Number(a) - Number(b));
  const cumulativeData1 = [];
  let cumulative1 = 0;
  const totalTrials = data1.length;

  sortedBins1.forEach(bin => {
    cumulative1 += bins1[bin];
    const percentage = (cumulative1 / totalTrials) * 100;
    cumulativeData1.push({
      x: Number(bin),
      y: percentage
    });
  });

  datasets.push({
    label: `${RARITY_SYMBOLS[rarity1]} Pull Rate`,
    data: cumulativeData1,
    borderColor: 'rgba(54, 162, 235, 1)',
    backgroundColor: 'rgba(54, 162, 235, 0.1)',
    fill: true,
    tension: 0.4
  });

  // Process data for rarity 2 if exists
  if (results2 && results2.length > 0) {
    const bins2 = {};
    const maxPacks2 = Math.max(...results2);

    for (let i = 0; i <= maxPacks2; i += binSize) {
      bins2[i] = 0;
    }

    results2.forEach(value => {
      const bin = Math.floor(value / binSize) * binSize;
      bins2[bin] = (bins2[bin] || 0) + 1;
    });

    const sortedBins2 = Object.keys(bins2).sort((a, b) => Number(a) - Number(b));
    const cumulativeData2 = [];
    let cumulative2 = 0;

    sortedBins2.forEach(bin => {
      cumulative2 += bins2[bin];
      const percentage = (cumulative2 / totalTrials) * 100;
      cumulativeData2.push({
        x: Number(bin),
        y: percentage
      });
    });

    datasets.push({
      label: `${RARITY_SYMBOLS[rarity2]} Pull Rate`,
      data: cumulativeData2,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      fill: true,
      tension: 0.4
    });
  }

  specificChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage of Trials Successful (%)'
          }
        },
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Number of Packs Needed'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Cumulative Probability of Getting Target Cards'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% chance within ${context.parsed.x} packs`;
            }
          }
        }
      }
    }
  });
}