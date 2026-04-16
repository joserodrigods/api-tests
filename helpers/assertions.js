const assert = require('assert');

function assertMemberId(data) {
  assert.ok(data && typeof data.id === 'string' && data.id.length > 0, 'response missing member id');
}

function assertBoardId(data) {
  assert.ok(data && typeof data.id === 'string' && data.id.length > 0, 'response missing board id');
}

function assertCardId(data) {
  assert.ok(data && typeof data.id === 'string' && data.id.length > 0, 'response missing card id');
}

function assertAuthErrorMessage(data) {
  const asText = typeof data === 'string' ? data : JSON.stringify(data || {});
  assert.ok(asText && asText.trim().length > 0, 'response missing authentication error message');
}

module.exports = { assertMemberId, assertBoardId, assertCardId, assertAuthErrorMessage };
