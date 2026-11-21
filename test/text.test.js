'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { PatraMail } = require('..');
const passwordReset = require('./fixtures/password-reset');
const receipt = require('./fixtures/receipt');

for (const [name, fixture] of Object.entries({
  passwordReset,
  receipt,
  withNodemailer: require('./fixtures/with-nodemailer'),
})) {
  test(`produces both formats and untouched metadata for ${name}`, () => {
    const mailer = new PatraMail();
    const result = mailer.generate(fixture);
    assert.equal(result.html, mailer.generateHtml(fixture));
    assert.equal(result.text, mailer.generatePlainText(fixture));
    assert.match(result.html, /<!doctype html>/);
    assert.ok(result.text.length > 0);
    assert.equal(result.subject, fixture.subject);
    assert.equal(result.preheader, fixture.preheader);
  });
}

test('preserves literal text and URLs, and skips HTML-only blocks', () => {
  const mailer = new PatraMail({ product: { name: 'A&B' } });
  const text = mailer.generatePlainText({
    body: {
      greeting: 'Hi',
      name: '<Jane>',
      intro: ['  one & two  ', '<em>literal</em>'],
      actions: [
        {
          instructions: 'Read',
          button: { text: 'Open', link: 'https://acme.test/?a=1&b=2' },
        },
      ],
      unsafeHtml: '<strong>HTML-only</strong>',
      signature: 'Bye',
    },
  });
  assert.equal(
    text,
    'A&B\n\nHi <Jane>\n\n  one & two  \n\n<em>literal</em>\n\nRead: https://acme.test/?a=1&b=2\n\nBye',
  );
});

test('prints table and total values as labeled fields', () => {
  const text = new PatraMail().generatePlainText(receipt);
  assert.match(
    text,
    /Item: Notebook \| Qty: 2 \| Unit price: \$6.00 \| Amount: \$12.00/,
  );
  assert.match(text, /Item: Total \| Amount: \$32.00/);
});

test('handles omitted content and metadata', () => {
  const result = new PatraMail().generate({});
  assert.equal(result.text, '');
  assert.equal(result.subject, undefined);
  assert.equal(result.preheader, undefined);
});
