// Steps usados por várias features: credenciais / cliente API e assert de status HTTP.
const assert = require('assert');
const { Given, Then, Before } = require('@cucumber/cucumber');
const { createClient } = require('../helpers/api');

Given('que as credenciais estao configuradas no ambiente', function () {
  assert.ok(process.env.API_BASE_URL, 'Missing API_BASE_URL');
  assert.ok(process.env.API_KEY, 'Missing API_KEY');
  assert.ok(process.env.API_TOKEN, 'Missing API_TOKEN');
  assert.ok(process.env.BOARD_ID, 'Missing BOARD_ID');
  this.api = createClient();
});

Before(function () {
  this.executionMeta = {
    environment: process.env.API_BASE_URL || 'unknown',
  };
});

function classifyPerformance(durationMs) {
  if (typeof durationMs !== 'number') {
    return null;
  }
  if (durationMs >= 1000) {
    return `ALERTA: resposta acima de 1s (${durationMs}ms)`;
  }
  if (durationMs >= 500) {
    return `ATENCAO: resposta acima de 500ms (${durationMs}ms)`;
  }
  if (durationMs < 300) {
    return `OK: resposta abaixo de 300ms (${durationMs}ms)`;
  }
  return `ESTAVEL: resposta em ${durationMs}ms`;
}

Then('o status da resposta deve ser HTTP {int}', function (expectedStatus) {
  const actualStatus = this.lastResponse.status;
  const durationMs = this.lastResponse.durationMs;

  if (actualStatus !== expectedStatus) {
    this.attach(
      JSON.stringify(
        {
          expectedStatus,
          actualStatus,
          durationMs,
          environment: this.executionMeta?.environment,
          responseBody: this.lastResponse.data,
        },
        null,
        2
      ),
      'application/json'
    );
  }

  const perfNote = classifyPerformance(durationMs);
  if (perfNote) {
    this.attach(perfNote, 'text/plain');
  }

  assert.strictEqual(actualStatus, expectedStatus);
});
