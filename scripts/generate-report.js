const fs = require('fs');
const reporter = require('cucumber-html-reporter');
require('dotenv').config();

const reportOutput = 'results/cucumber-report.html';
const reportJson = 'results/cucumber-report.json';

reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'results/cucumber-report.json',
  output: reportOutput,
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    Project: 'api-bdd-example',
    Executed: 'Local',
  },
});

const singleColumnFeaturesCss = `
<style id="single-column-features">
  .row > .feature-passed > .col-lg-6.col-md-6,
  .row > .feature-failed > .col-lg-6.col-md-6,
  .row > .feature-undefined > .col-lg-6.col-md-6 {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
    float: none !important;
  }
  .row > .feature-passed,
  .row > .feature-failed,
  .row > .feature-undefined {
    width: 100%;
    clear: both;
  }
</style>
`;

function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return 'n/a';
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  return `${minutes}m ${seconds}s ${ms}ms`;
}

function buildExecutiveSummaryMarkup(stats) {
  return `
<style id="executive-summary-style">
  .executive-summary {
    margin: 12px 0 18px;
    padding: 12px 14px;
    border: 1px solid #d9e2ec;
    border-radius: 6px;
    background: #f8fbff;
  }
  .executive-summary h4 {
    margin: 0 0 8px;
    font-size: 16px;
  }
  .executive-summary ul {
    margin: 0;
    padding-left: 20px;
  }
  .executive-summary li {
    margin: 4px 0;
  }
</style>
<div class="executive-summary" id="executive-summary">
  <h4>Resumo Executivo</h4>
  <ul>
    <li>Execucao: ${stats.failedScenarios === 0 ? 'OK' : 'ATENCAO'} (${stats.passRate.toFixed(1)}% de sucesso)</li>
    <li>Cobertura: ${stats.featureNames.join(', ') || 'n/a'}</li>
    <li>Cenarios: ${stats.totalScenarios} total | ${stats.passedScenarios} aprovados | ${stats.failedScenarios} falhos</li>
    <li>Tempo total: ${formatDuration(stats.totalDurationMs)}</li>
    <li>Ambiente: ${process.env.API_BASE_URL || 'local/default'}</li>
    <li>Risco: ${stats.failedScenarios === 0 ? 'baixo' : 'moderado/alto'}</li>
  </ul>
</div>
`;
}

function collectStatsFromJson() {
  const raw = fs.readFileSync(reportJson, 'utf8');
  const features = JSON.parse(raw);

  let totalScenarios = 0;
  let passedScenarios = 0;
  let failedScenarios = 0;
  let totalDurationMs = 0;

  for (const feature of features) {
    const scenarios = feature.elements || [];
    for (const scenario of scenarios) {
      totalScenarios += 1;
      let scenarioFailed = false;
      const steps = scenario.steps || [];
      for (const step of steps) {
        const status = step.result?.status;
        if (status === 'failed' || status === 'undefined' || status === 'pending') {
          scenarioFailed = true;
        }
        totalDurationMs += step.result?.duration ? Math.round(step.result.duration / 1_000_000) : 0;
      }
      if (scenarioFailed) {
        failedScenarios += 1;
      } else {
        passedScenarios += 1;
      }
    }
  }

  const passRate = totalScenarios > 0 ? (passedScenarios / totalScenarios) * 100 : 0;
  return {
    totalScenarios,
    passedScenarios,
    failedScenarios,
    totalDurationMs,
    passRate,
    featureNames: features.map((feature) => feature.name).slice(0, 4),
  };
}

const reportHtml = fs.readFileSync(reportOutput, 'utf8');
const stats = collectStatsFromJson();
const executiveSummary = buildExecutiveSummaryMarkup(stats);
let updatedHtml = reportHtml;

if (!updatedHtml.includes('id="single-column-features"')) {
  updatedHtml = updatedHtml.replace('</head>', `${singleColumnFeaturesCss}\n</head>`);
}

if (!updatedHtml.includes('id="executive-summary"')) {
  updatedHtml = updatedHtml.replace('<div class="container">', `<div class="container">\n${executiveSummary}`);
}

fs.writeFileSync(reportOutput, updatedHtml, 'utf8');
