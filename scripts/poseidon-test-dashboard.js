// poseidon-test-dashboard.js
// Elite dashboard for test results and reliability

const fs = require('fs');
const path = require('path');

function loadCoverage() {
  const coveragePath = path.join(__dirname, 'coverage', 'coverage-summary.json');
  if (fs.existsSync(coveragePath)) {
    return JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
  }
  return null;
}

function loadTestResults() {
  const resultsPath = path.join(__dirname, 'test-results', 'results.json');
  if (fs.existsSync(resultsPath)) {
    return JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  }
  return null;
}

function renderDashboard() {
  const coverage = loadCoverage();
  const results = loadTestResults();
  console.log('--- Poseidon Test Dashboard ---');
  if (coverage) {
    console.log('Coverage:', coverage);
  } else {
    console.log('Coverage: Not found');
  }
  if (results) {
    console.log('Test Results:', results);
  } else {
    console.log('Test Results: Not found');
  }
}

renderDashboard();
