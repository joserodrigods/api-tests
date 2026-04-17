const fs = require('fs');
const reporter = require('cucumber-html-reporter');

const reportOutput = 'results/cucumber-report.html';

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

const reportHtml = fs.readFileSync(reportOutput, 'utf8');

if (!reportHtml.includes('id="single-column-features"')) {
  fs.writeFileSync(
    reportOutput,
    reportHtml.replace('</head>', `${singleColumnFeaturesCss}\n</head>`),
    'utf8'
  );
}
