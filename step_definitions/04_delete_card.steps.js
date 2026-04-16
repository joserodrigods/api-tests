const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');
const { assertDeleteCardConfirmation } = require('../helpers/assertions');

function getCurrentCardId(world) {
  if (world.lastCreatedId) {
    return world.lastCreatedId;
  }
  if (world.lastResponse && world.lastResponse.data && world.lastResponse.data.id) {
    return world.lastResponse.data.id;
  }
  throw new Error('Missing card id in World context');
}

When('eu excluir o card criado', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.deleteCard(cardId);
});

When('eu excluir o card criado novamente', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.deleteCard(cardId);
});

When('eu buscar o card criado via GET', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.getCard(cardId);
});

When('eu tentar excluir o card com o id {string}', async function (cardId) {
  this.lastResponse = await this.api.deleteCard(cardId);
});

When('eu tentar excluir o card criado sem autenticacao', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.deleteCardWithoutAuth(cardId);
});

Then('o corpo deve confirmar exclusao do card', function () {
  assertDeleteCardConfirmation(this.lastResponse.data);
});
