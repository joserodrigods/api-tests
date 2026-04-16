const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const {
  assertCardListId,
  assertCardBoardId,
  assertDateLastActivityPresent,
} = require('../helpers/assertions');

function getCurrentCardId(world) {
  if (world.lastCreatedId) {
    return world.lastCreatedId;
  }
  if (world.lastResponse && world.lastResponse.data && world.lastResponse.data.id) {
    return world.lastResponse.data.id;
  }
  throw new Error('Missing card id in World context');
}

Given('que as listas de transicao estao configuradas no ambiente', function () {
  assert.ok(process.env.LIST_IN_PROGRESS_ID, 'Missing LIST_IN_PROGRESS_ID');
  assert.ok(process.env.LIST_DONE_ID, 'Missing LIST_DONE_ID');
});

When('eu mover o card criado para a lista em progresso configurada', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.moveCardToList(cardId, process.env.LIST_IN_PROGRESS_ID);
});

When('eu mover o card criado para a lista concluida configurada', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.moveCardToList(cardId, process.env.LIST_DONE_ID);
});

When('eu tentar mover o card criado para a lista de id {string}', async function (listId) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.moveCardToList(cardId, listId);
});

When('eu tentar mover o card com o id {string} para a lista to do configurada', async function (cardId) {
  this.lastResponse = await this.api.moveCardToList(cardId, process.env.LIST_TODO_ID);
});

When('eu tentar mover o card criado para a lista to do configurada sem autenticacao', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.moveCardToListWithoutAuth(cardId, process.env.LIST_TODO_ID);
});

Then('o idList do card deve ser o da lista em progresso configurada', function () {
  assertCardListId(this.lastResponse.data, process.env.LIST_IN_PROGRESS_ID);
});

Then('o idList do card deve ser o da lista concluida configurada', function () {
  assertCardListId(this.lastResponse.data, process.env.LIST_DONE_ID);
});

Then('o idBoard do card deve ser o do quadro configurado', function () {
  assertCardBoardId(this.lastResponse.data, process.env.BOARD_ID);
});

Then('o campo dateLastActivity do card nao deve ser nulo', function () {
  assertDateLastActivityPresent(this.lastResponse.data);
});
