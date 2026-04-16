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

function assertCardName(data, expectedName) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.name, expectedName, 'card name mismatch');
}

function assertCardDescription(data, expectedDescription) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.desc, expectedDescription, 'card description mismatch');
}

function assertCardDueContains(data, expectedFragment) {
  assert.ok(data, 'response body is empty');
  assert.ok(data.due, 'card due is missing');
  assert.ok(String(data.due).includes(expectedFragment), `card due does not contain "${expectedFragment}"`);
}

function assertDueCompleteTrue(data) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.dueComplete, true, 'dueComplete is not true');
}

function assertCardHasLabel(data, labelId) {
  assert.ok(data, 'response body is empty');
  assert.ok(Array.isArray(data.idLabels), 'card idLabels must be an array');
  assert.ok(data.idLabels.includes(labelId), `card does not contain label "${labelId}"`);
}

function assertCardHasMember(data, memberId) {
  assert.ok(data, 'response body is empty');
  assert.ok(Array.isArray(data.idMembers), 'card idMembers must be an array');
  assert.ok(data.idMembers.includes(memberId), `card does not contain member "${memberId}"`);
}

function assertCardPositionIsNumeric(data) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(typeof data.pos, 'number', 'card position must be numeric');
}

function assertCardClosedTrue(data) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.closed, true, 'card closed is not true');
}

function assertDeleteCardConfirmation(data) {
  assert.ok(data && typeof data === 'object', 'response body must be an object');
  assert.ok(Object.prototype.hasOwnProperty.call(data, 'limits'), 'delete response should include limits');
}

function assertCardListId(data, expectedListId) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.idList, expectedListId, 'card idList mismatch');
}

function assertCardBoardId(data, expectedBoardId) {
  assert.ok(data, 'response body is empty');
  assert.strictEqual(data.idBoard, expectedBoardId, 'card idBoard mismatch');
}

function assertDateLastActivityPresent(data) {
  assert.ok(data, 'response body is empty');
  assert.ok(data.dateLastActivity, 'dateLastActivity is missing');
}

module.exports = {
  assertMemberId,
  assertBoardId,
  assertCardId,
  assertAuthErrorMessage,
  assertCardName,
  assertCardDescription,
  assertCardDueContains,
  assertDueCompleteTrue,
  assertCardHasLabel,
  assertCardHasMember,
  assertCardPositionIsNumeric,
  assertCardClosedTrue,
  assertDeleteCardConfirmation,
  assertCardListId,
  assertCardBoardId,
  assertDateLastActivityPresent,
};
