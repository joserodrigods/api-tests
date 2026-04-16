const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');
const {
  assertMemberId,
  assertBoardId,
  assertAuthErrorMessage,
} = require('../helpers/assertions');

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

Then('o corpo deve conter o identificador do membro', function () {
  assertMemberId(this.lastResponse.data);
});

Then('o corpo deve conter o identificador do quadro', function () {
  assertBoardId(this.lastResponse.data);
});

Then('o corpo deve conter mensagem de erro de autenticacao', function () {
  assertAuthErrorMessage(this.lastResponse.data);
});
