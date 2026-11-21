'use strict';

const assert = require('node:assert/strict');
const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const PatraMail = require('..');
const passwordReset = require('./fixtures/password-reset');

test('renders the password reset fixture', () => {
  const snapshot = path.join(__dirname, 'snapshots', 'password-reset.html');
  const html = new PatraMail().generateHtml(passwordReset);
  if (process.env.UPDATE_SNAPSHOTS === '1') writeFileSync(snapshot, html);
  assert.equal(html, readFileSync(snapshot, 'utf8'));
});

test('omits empty sections', () => {
  const html = new PatraMail().generateHtml({});
  assert.doesNotMatch(html, /<h1|<p |<img|width="600"/);
});

test('escapes text and escapes or suppresses links', () => {
  const html = new PatraMail().generateHtml({
    product: { name: '<script>', link: 'data:text/html,test' },
    body: {
      intro: '<img>',
      actions: [{ button: { text: 'Continue', link: 'javascript:alert(1)' } }],
    },
    footer: {
      links: [{ text: '"Help"', link: 'https://acme.test/?q="help"&ok=1' }],
    },
  });
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img&gt;/);
  assert.match(html, /q=&quot;help&quot;&amp;ok=1/);
  assert.doesNotMatch(html, /<script>|<img>|javascript:|data:text/);
});
