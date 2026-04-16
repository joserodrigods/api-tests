const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { assertCardId } = require('../helpers/assertions');

Given('que a lista de tarefas esta configurada no ambiente', function () {
  assert.ok(process.env.LIST_TODO_ID, 'Missing LIST_TODO_ID');
});

When('eu criar um card chamado {string} na lista de tarefas configurada no ambiente', async function (name) {
  this.lastResponse = await this.api.createCard(name);
});

When('eu criar um card sem nome na lista de tarefas configurada no ambiente', async function () {
  this.lastResponse = await this.api.createCardWithoutName();
});

When('eu tentar criar um card chamado {string} no id de lista {string}', async function (name, listId) {
  this.lastResponse = await this.api.createCard(name, listId);
});

When('eu tentar criar um card sem autenticacao', async function () {
  this.lastResponse = await this.api.createCardWithoutAuth();
});

Then('o corpo da resposta deve conter um identificador de card', function () {
  assertCardId(this.lastResponse.data);
});
