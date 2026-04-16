const assert = require('assert');
const { When } = require('@cucumber/cucumber');

When('eu criar um card para o fluxo E2E com nome {string} e descricao {string}', async function (name, description) {
  assert.ok(process.env.LIST_TODO_ID, 'Missing LIST_TODO_ID');
  this.lastResponse = await this.api.createCardWithJson(name, process.env.LIST_TODO_ID, description);
});
