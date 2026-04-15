const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { createClient } = require('../helpers/api');
const { assertMemberId, assertBoardId } = require('../helpers/assertions');

Given('credentials are configured in the environment', function () {
  assert.ok(process.env.API_BASE_URL, 'Missing API_BASE_URL');
  assert.ok(process.env.API_KEY, 'Missing API_KEY');
  assert.ok(process.env.API_TOKEN, 'Missing API_TOKEN');
  assert.ok(process.env.BOARD_ID, 'Missing BOARD_ID');
  this.api = createClient();
});

When('I request the authenticated member from the API', async function () {
  this.lastResponse = await this.api.getAuthenticatedMember();
});

When('I request the board configured in the environment', async function () {
  this.lastResponse = await this.api.getBoard();
});

Then('the response status should be HTTP {int}', function (expectedStatus) {
  assert.strictEqual(this.lastResponse.status, expectedStatus);
});

Then('the body should contain the member identifier', function () {
  assertMemberId(this.lastResponse.data);
});

Then('the body should contain the board identifier', function () {
  assertBoardId(this.lastResponse.data);
});
