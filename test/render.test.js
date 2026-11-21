'use strict';

const assert = require('node:assert/strict');
const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { PatraMail, themes } = require('..');
const passwordReset = require('./fixtures/password-reset');

const fixtures = {
  'password-reset': passwordReset,
  receipt: require('./fixtures/receipt'),
  'with-nodemailer': require('./fixtures/with-nodemailer'),
};

for (const [name, input] of Object.entries(fixtures)) {
  test(`matches the ${name} HTML snapshot`, () => {
    const snapshot = path.join(__dirname, 'snapshots', name + '.html');
    const html = new PatraMail().generateHtml(input);
    if (process.env.UPDATE_SNAPSHOTS === '1') writeFileSync(snapshot, html);
    assert.equal(html, readFileSync(snapshot, 'utf8'));
  });
}

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

test('renders an escaped header logo with alternate text and explicit dimensions', () => {
  const html = new PatraMail({
    product: { name: 'Default', link: 'https://acme.test' },
  }).generateHtml({
    product: { name: 'A&B', logo: 'https://acme.test/logo.png?a=1&b=2' },
  });
  assert.match(
    html,
    /<a[^>]*href="https:\/\/acme\.test"[^>]*><img src="https:\/\/acme\.test\/logo\.png\?a=1&amp;b=2" alt="A&amp;B" width="160" height="48"/,
  );
  assert.match(html, /<title>A&amp;B<\/title>/);
  assert.doesNotMatch(html, /Default/);
});

test('orders body sections and uses a presentation table for each linked button', () => {
  const html = new PatraMail().generateHtml({
    body: {
      greeting: 'Hello',
      name: 'Jane',
      intro: ['First paragraph', 'Second paragraph'],
      actions: [
        { instructions: 'Instructions only' },
        {
          button: { text: 'Activate & go', link: 'https://acme.test/activate' },
        },
      ],
      outro: 'See you soon',
      signature: 'PatraMail team',
    },
  });
  assert.match(
    html,
    /Hello Jane<\/h1>.*First paragraph<\/p>.*Second paragraph<\/p>.*Instructions only<\/p>.*<table role="presentation".*<td class="pm-button".*Activate &amp; go<\/a>.*See you soon<\/p>.*PatraMail team<\/p>/s,
  );
});

test('renders footer text, escaped links, address and copyright in order', () => {
  const html = new PatraMail().generateHtml({
    product: { copyright: '© A&B' },
    footer: {
      text: 'Terms & details',
      links: [
        { text: '<Help>', link: 'mailto:help@acme.test' },
        { text: 'Call support', link: 'tel:+12025550100' },
      ],
      address: '<Office>',
    },
  });
  assert.match(
    html,
    /Terms &amp; details.*mailto:help@acme\.test.*&lt;Help&gt;<\/a> &middot; .*tel:\+12025550100.*Call support.*&lt;Office&gt;.*© A&amp;B/s,
  );
});

test('keeps built-in headings, text, links and button labels at 4.5:1 or better', () => {
  const { buttonText } = require('../src/themes');
  const luminance = (color) =>
    color
      .slice(1)
      .match(/../g)
      .reduce((sum, pair, index) => {
        const component = parseInt(pair, 16) / 255;
        const linear =
          component <= 0.04045
            ? component / 12.92
            : ((component + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][index];
      }, 0);
  for (const theme of Object.values(themes)) {
    for (const [foreground, background] of [
      [theme.text, theme.card],
      [theme.heading, theme.card],
      [theme.brand, theme.card],
      [buttonText(theme.brand), theme.brand],
    ]) {
      const colors = [luminance(foreground), luminance(background)].sort(
        (a, b) => b - a,
      );
      assert.ok((colors[0] + 0.05) / (colors[1] + 0.05) >= 4.5);
    }
  }
});
