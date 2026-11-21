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

test('escapes user text and URL attributes', () => {
  const html = new PatraMail().generateHtml({
    product: { name: '<script>', link: 'https://acme.test' },
    body: { intro: '<img>' },
    footer: {
      links: [{ text: '"Help"', link: 'https://acme.test/?q="help"&ok=1' }],
    },
  });
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img&gt;/);
  assert.match(html, /q=&quot;help&quot;&amp;ok=1/);
  assert.doesNotMatch(html, /<script>|<img>|javascript:|data:text/);
});

test('renders the dark palette inline and gives the default a dark media query', () => {
  const dark = new PatraMail({ theme: 'dark' }).generateHtml(passwordReset);
  assert.match(dark, /bgcolor="#1f2937"/);
  assert.doesNotMatch(dark, /prefers-color-scheme/);
  const light = new PatraMail().generateHtml(passwordReset);
  assert.match(light, /prefers-color-scheme: dark/);
  assert.match(light, /name="color-scheme" content="light dark"/);
});

test('merges custom themes and rejects values outside the CSS grammar', () => {
  const custom = new PatraMail({
    theme: { brand: '#abc', radius: '0px' },
  }).generateHtml(passwordReset);
  assert.match(custom, /bgcolor="#ffffff"/);
  assert.match(custom, /background-color:#abc;border-radius:0px/);
  assert.match(custom, /color:#000000;font-weight:bold/);
  assert.throws(() => new PatraMail({ theme: 'toString' }), TypeError);
  assert.throws(() => new PatraMail({ theme: { bg: 'red;"' } }), /theme.bg/);
  assert.throws(
    () => new PatraMail({ theme: { font: 'Arial; color:red' } }),
    /theme.font/,
  );
});

test('renders semantic table headers, union columns, widths and totals safely', () => {
  const html = new PatraMail().generateHtml({
    body: {
      table: {
        data: [{ '<Item>': '<A>' }, { Price: 0 }],
        columns: { customWidth: { '<Item>': '50%', Price: '20%' } },
        total: { '<Item>': 'Total', Price: 0 },
      },
    },
  });
  assert.match(html, /<th scope="col"[^>]*width:50%[^>]*>&lt;Item&gt;<\/th>/);
  assert.match(html, /<th scope="col"[^>]*>Price<\/th>/);
  assert.match(html, /&lt;A&gt;<\/td>/);
  assert.match(
    html,
    /<tfoot>.*scope="row"[^>]*>Total<\/th>.*>0<\/td>.*<\/tfoot>/,
  );
  assert.doesNotMatch(html, /color:red/);
});

test('inserts only the explicit unsafeHtml block as raw markup', () => {
  const html = new PatraMail().generateHtml({
    body: { intro: '<em>escaped</em>', unsafeHtml: '<em>raw</em>' },
  });
  assert.match(html, /&lt;em&gt;escaped&lt;\/em&gt;.*<em>raw<\/em>/);
});

test('escapes and hides the preheader, with English label fallback for other languages', () => {
  const input = { preheader: '<preview>', body: { name: 'Jane' } };
  const result = new PatraMail({ lang: 'fr-CA' }).generate(input);
  assert.match(result.html, /<html lang="fr-CA">/);
  assert.match(
    result.html,
    /aria-hidden="true" style="display:none[^"]*">&lt;preview&gt;<\/div>/,
  );
  assert.match(result.html, />Hi Jane<\/h1>/);
  assert.match(result.html, /<title>Email<\/title>/);
  assert.equal(result.text, 'Hi Jane');
  assert.equal(result.preheader, '<preview>');
});
