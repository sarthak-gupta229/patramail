'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

test('package entry point loads', () => {
  assert.equal(typeof require('..'), 'object');
});
