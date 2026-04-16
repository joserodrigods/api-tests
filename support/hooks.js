const path = require('path');
const { Before, AfterStep } = require('@cucumber/cucumber');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const E2E_STEP_DELAY_MAX_MS = 30000;

Before({ tags: '@e2e' }, function () {
  const raw = process.env.E2E_STEP_DELAY_MS;
  let ms = raw ? parseInt(String(raw).trim(), 10) : 0;
  if (Number.isNaN(ms) || ms < 0) {
    ms = 0;
  }
  if (ms > E2E_STEP_DELAY_MAX_MS) {
    ms = E2E_STEP_DELAY_MAX_MS;
  }
  this.e2eStepDelayMs = ms;
});

AfterStep(async function () {
  const ms = this.e2eStepDelayMs;
  if (!ms || ms <= 0) {
    return;
  }
  await new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
});
