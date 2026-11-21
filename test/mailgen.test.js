'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { Mailgen } = require('..');

test('supports the Mailgen constructor and HTML/plain-text call pattern', () => {
  const generator = new Mailgen({
    theme: 'default',
    product: { name: 'Northline', link: 'https://example.com' },
  });
  const email = {
    body: {
      name: 'Maya',
      intro: ['First paragraph', 'Second paragraph'],
      action: {
        instructions: 'Reserve a spot',
        button: {
          text: 'RSVP',
          color: '#23704a',
          link: 'https://example.com/rsvp',
        },
      },
      outro: ['Need help?', 'Reply to us.'],
    },
  };
  assert.match(generator.generate(email), /<td bgcolor="#23704a".*>RSVP<\/a>/);
  assert.match(
    generator.generatePlaintext(email),
    /Reserve a spot: https:\/\/example.com\/rsvp\n\nNeed help\?\n\nReply to us\./,
  );
  assert.equal(email.body.actions, undefined);
});

test('supports titles, disabled greetings and signatures, and action arrays', () => {
  const generator = new Mailgen();
  const action = [
    { button: { text: 'One', link: 'https://example.com/one' } },
    { button: { text: 'Two', link: 'https://example.com/two' } },
  ];
  assert.match(
    generator.generate({ body: { title: '<Welcome>', name: 'Maya', action } }),
    /&lt;Welcome&gt;<\/h1>/,
  );
  const email = {
    body: {
      title: 'Hidden title',
      name: 'Maya',
      greeting: false,
      signature: false,
      action,
    },
  };
  assert.doesNotMatch(generator.generate(email), /Hidden title|Maya|<h1/);
  assert.match(
    generator.generatePlaintext(email),
    /One: https:\/\/example.com\/one\n\nTwo: https:\/\/example.com\/two/,
  );
});

test('applies native URL and color validation to Mailgen actions', () => {
  const generator = new Mailgen();
  const email = {
    body: {
      action: {
        button: {
          text: 'Open',
          link: 'javascript:alert(1)',
          color: '#fff;color:red',
        },
      },
    },
  };
  assert.throws(
    () => generator.generate(email),
    /button\.color[^\n]*\n.*button\.link/,
  );
});
