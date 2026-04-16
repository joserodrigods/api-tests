const reporter = require('cucumber-html-reporter');

reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'results/cucumber-report.json',
  output: 'results/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    Project: 'api-bdd-example',
    Executed: 'Local',
  },
});
