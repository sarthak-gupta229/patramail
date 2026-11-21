'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { PatraMail } = require('..');

test('returns path-specific validation errors without throwing', () => {
  const mailer = new PatraMail();
  const input = {
    subject: 7,
    body: {
      actions: [{ button: { text: 'Open' } }, null],
      table: {
        data: [{ Price: Infinity }],
        columns: { customWidth: { Price: '20%;color:red' } },
      },
    },
    footer: { links: [{ text: 'Help', link: 'javascript:alert(1)' }] },
  };
  const result = mailer.validate(input);
  assert.equal(result.valid, false);
  for (const path of [
    'email.subject',
    'email.body.actions[0].button.link',
    'email.body.actions[1]',
    'email.body.table.data[0].Price',
    'email.body.table.columns.customWidth.Price',
    'email.footer.links[0].link',
  ]) {
    assert.ok(
      result.errors.some((error) => error.startsWith(path)),
      path,
    );
  }
  for (const method of ['generate', 'generateHtml', 'generatePlainText']) {
    assert.throws(() => mailer[method](input), TypeError);
  }
});

test('merges constructor product defaults and requires alt text for logos', () => {
  const mailer = new PatraMail({
    product: { logo: 'https://acme.test/logo.png' },
  });
  assert.equal(mailer.validate({}).valid, false);
  assert.equal(mailer.validate({ product: { name: 'Acme' } }).valid, true);
  assert.equal(mailer.validate({ product: null }).valid, false);
  assert.equal(mailer.validate(null).valid, false);
});

test('warns on development unknown fields and long subjects', () => {
  const previous = process.env.NODE_ENV;
  try {
    const mailer = new PatraMail();
    const email = { subject: 'a'.repeat(79), body: { typo: true } };
    process.env.NODE_ENV = 'development';
    assert.deepEqual(mailer.validate(email), {
      valid: true,
      errors: [],
      warnings: [
        'email.subject is longer than 78 characters',
        'Unknown field email.body.typo',
      ],
    });
    process.env.NODE_ENV = 'production';
    assert.deepEqual(mailer.validate(email).warnings, [
      'email.subject is longer than 78 characters',
    ]);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test('handles sparse inputs, dynamic table keys and nested warnings', () => {
  const mailer = new PatraMail();
  const input = {
    body: {
      intro: [''],
      table: {
        data: [JSON.parse('{"__proto__": "&", "constructor": 0}')],
        total: { unused: 'extra' },
      },
      actions: [],
    },
  };
  assert.equal(mailer.validate(input).valid, true);
  if (process.env.NODE_ENV !== 'production') {
    assert.deepEqual(mailer.validate(input).warnings, [
      'Unknown column email.body.table.total.unused',
    ]);
  }
  assert.equal(mailer.validate({ body: { intro: Array(1) } }).valid, false);
  assert.equal(
    mailer.validate({ body: { table: { data: [], total: {} } } }).valid,
    false,
  );
});
