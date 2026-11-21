'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { escape, safeUrl } = require('../src/escape');

test('escapes HTML syntax and scripts', () => {
  assert.equal(
    escape(`<script>"a"&'b'</script>`),
    '&lt;script&gt;&quot;a&quot;&amp;&#39;b&#39;&lt;/script&gt;',
  );
});

test('rejects unsafe, relative, and obfuscated URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    'java\tscript:alert(1)',
    '//acme.test',
    '/relative',
    'file:///tmp/document',
    'https:relative-looking',
    'https:///acme.test',
    'https://acme.test\\unsafe',
    'mailto:',
    'tel:',
  ]) {
    assert.equal(safeUrl(value), '');
  }
});

test('permits web and contact links and restricts image URLs to HTTP(S)', () => {
  assert.equal(
    safeUrl('https://acme.test?a=1&b=2'),
    'https://acme.test?a=1&b=2',
  );
  assert.equal(safeUrl('mailto:help@acme.test'), 'mailto:help@acme.test');
  assert.equal(safeUrl('mailto:help@acme.test', true), '');
});
