const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const {
  assertCardName,
  assertCardDescription,
  assertCardDueContains,
  assertDueCompleteTrue,
  assertCardHasLabel,
  assertCardHasMember,
  assertCardPositionIsNumeric,
  assertCardClosedTrue,
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

Given('que o card possui data de vencimento definida em {string}', async function (dueDateIso) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardDueDate(cardId, dueDateIso);
  assert.strictEqual(this.lastResponse.status, 200, 'unable to set due date in precondition');
});

When('eu editar o nome do card para {string}', async function (name) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardName(cardId, name);
});

When('eu editar a descricao do card para {string}', async function (description) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardDescription(cardId, description);
});

When('eu definir a data de vencimento do card para {string}', async function (dueDateIso) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardDueDate(cardId, dueDateIso);
});

When('eu marcar a data de vencimento do card como concluida', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.markCardDueComplete(cardId, true);
});

When('eu adicionar a label {string} no card criado', async function (labelColor) {
  const cardId = getCurrentCardId(this);
  const labelsResponse = await this.api.getBoardLabels();
  const labels = Array.isArray(labelsResponse.data) ? labelsResponse.data : [];
  const matchedLabel = labels.find((label) => label && label.color === labelColor);
  assert.ok(matchedLabel && matchedLabel.id, `no label found with color "${labelColor}"`);
  this.lastLabelId = matchedLabel.id;
  this.lastResponse = await this.api.addLabelToCard(cardId, matchedLabel.id);
});

When('eu adicionar o membro autenticado no card criado', async function () {
  const cardId = getCurrentCardId(this);
  const meResponse = await this.api.getAuthenticatedMember();
  assert.ok(meResponse.data && meResponse.data.id, 'authenticated member id not found');
  this.lastMemberId = meResponse.data.id;
  this.lastResponse = await this.api.addMemberToCard(cardId, this.lastMemberId);
});

When('eu alterar a posicao do card para {string}', async function (position) {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardPosition(cardId, position);
});

When('eu arquivar o card criado', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.archiveCard(cardId);
});

When('eu tentar editar o nome do card para {string} usando o id {string}', async function (name, cardId) {
  this.lastResponse = await this.api.updateCardName(cardId, name);
});

When('eu tentar editar o card sem autenticacao', async function () {
  const cardId = getCurrentCardId(this);
  this.lastResponse = await this.api.updateCardNameWithoutAuth(cardId);
});

Then('o nome do card deve ser {string}', function (expectedName) {
  assertCardName(this.lastResponse.data, expectedName);
});

Then('a descricao do card deve ser {string}', function (expectedDescription) {
  assertCardDescription(this.lastResponse.data, expectedDescription);
});

Then('a data de vencimento do card deve conter {string}', function (expectedFragment) {
  assertCardDueContains(this.lastResponse.data, expectedFragment);
});

Then('o campo dueComplete do card deve ser true', function () {
  assertDueCompleteTrue(this.lastResponse.data);
});

Then('o card deve conter a label {string}', function (_labelColor) {
  assertCardHasLabel(this.lastResponse.data, this.lastLabelId);
});

Then('o card deve conter o membro autenticado', function () {
  assertCardHasMember(this.lastResponse.data, this.lastMemberId);
});

Then('a posicao do card deve ser numerica', function () {
  assertCardPositionIsNumeric(this.lastResponse.data);
});

Then('o campo closed do card deve ser true', function () {
  assertCardClosedTrue(this.lastResponse.data);
});

Then('o status da resposta deve ser um dos HTTP {int} ou {int}', function (statusA, statusB) {
  const actual = this.lastResponse.status;
  assert.ok(actual === statusA || actual === statusB, `expected status ${statusA} or ${statusB}, got ${actual}`);
});
