const assert = require('assert');

function assertMemberId(data) {
  assert.ok(data && typeof data.id === 'string' && data.id.length > 0, 'response missing member id');
}

function assertBoardId(data) {
  assert.ok(data && typeof data.id === 'string' && data.id.length > 0, 'response missing board id');
}

module.exports = { assertMemberId, assertBoardId };
