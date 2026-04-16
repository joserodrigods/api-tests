// Steps usados por várias features: credenciais / cliente API e assert de status HTTP.
const assert = require('assert');
const { Given, Then } = require('@cucumber/cucumber');
const { createClient } = require('../helpers/api');

Given('que as credenciais estao configuradas no ambiente', function () {
  assert.ok(process.env.API_BASE_URL, 'Missing API_BASE_URL');
  assert.ok(process.env.API_KEY, 'Missing API_KEY');
  assert.ok(process.env.API_TOKEN, 'Missing API_TOKEN');
  assert.ok(process.env.BOARD_ID, 'Missing BOARD_ID');
  this.api = createClient();
});

Then('o status da resposta deve ser HTTP {int}', function (expectedStatus) {
  assert.strictEqual(this.lastResponse.status, expectedStatus);
});
