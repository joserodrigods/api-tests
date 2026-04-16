const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { createClient } = require('../helpers/api');
const { assertMemberId, assertBoardId, assertAuthErrorMessage } = require('../helpers/assertions');

Given('que as credenciais estao configuradas no ambiente', function () {
  assert.ok(process.env.API_BASE_URL, 'Missing API_BASE_URL');
  assert.ok(process.env.API_KEY, 'Missing API_KEY');
  assert.ok(process.env.API_TOKEN, 'Missing API_TOKEN');
  assert.ok(process.env.BOARD_ID, 'Missing BOARD_ID');
  this.api = createClient();
});

When('eu solicitar o membro autenticado da API', async function () {
  this.lastResponse = await this.api.getAuthenticatedMember();
});

When('eu solicitar o quadro configurado no ambiente', async function () {
  this.lastResponse = await this.api.getBoard();
});

When('eu solicitar o membro autenticado sem API key', async function () {
  this.lastResponse = await this.api.getAuthenticatedMemberWithoutApiKey();
});

When('eu solicitar o membro autenticado com token invalido', async function () {
  this.lastResponse = await this.api.getAuthenticatedMemberWithInvalidToken();
});

Then('o status da resposta deve ser HTTP {int}', function (expectedStatus) {
  assert.strictEqual(this.lastResponse.status, expectedStatus);
});

Then('o corpo deve conter o identificador do membro', function () {
  assertMemberId(this.lastResponse.data);
});

Then('o corpo deve conter o identificador do quadro', function () {
  assertBoardId(this.lastResponse.data);
});

Then('o corpo deve conter mensagem de erro de autenticacao', function () {
  assertAuthErrorMessage(this.lastResponse.data);
});
