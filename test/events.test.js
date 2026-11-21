'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { PatraMail, templates } = require('..');

test('generates distinct event templates with HTML, links and matching plain text', () => {
  const mailer = new PatraMail();
  const accents = new Set();
  const subjects = new Set();
  for (const [kind, template] of Object.entries(templates)) {
    const email = template({
      name: '<Open House>',
      recipient: 'Maya',
      date: 'Saturday at 4 p.m.',
      location: 'Studio & Gallery',
      link: 'https://events.example.com/details',
    });
    assert.deepEqual(mailer.validate(email), {
      valid: true,
      errors: [],
      warnings: [],
    });
    const { html, text, subject } = mailer.generate(email);
    subjects.add(subject);
    accents.add(html.match(/border-left:5px solid (#[0-9a-f]{6})/)[1]);
    assert.match(html, /Hi Maya<\/h1>/);
    assert.match(html, /&lt;Open House&gt;<\/h2>/);
    assert.match(html, /Studio &amp; Gallery/);
    assert.match(html, /href="https:\/\/events\.example\.com\/details"/);
    assert.match(
      text,
      /<Open House>\nWhen: Saturday at 4 p.m.\nWhere: Studio & Gallery/,
    );
    assert.equal(email.body.event.kind, kind);
  }
  assert.equal(subjects.size, 6);
  assert.equal(accents.size, 6);
});

test('supports overrides and omits absent event details and buttons', () => {
  const mailer = new PatraMail({ theme: 'dark' });
  const email = templates.cancellation({
    name: 'Open House',
    subject: 'Rescheduling',
    preheader: 'New date to follow',
    intro: ['New date to follow.'],
  });
  const { html, text, subject, preheader } = mailer.generate(email);
  assert.equal(subject, 'Rescheduling');
  assert.equal(preheader, 'New date to follow');
  assert.match(html, /Open House<\/h1>/);
  assert.doesNotMatch(html, /class="pm-button"|>When<|>Where</);
  assert.match(text, /New date to follow/);
  assert.throws(() => templates.invitation({ name: ' ' }), /event name/);
  assert.throws(
    () =>
      templates.invitation({
        name: 'Open House',
        buttonText: 'RSVP',
      }),
    /requires a link/,
  );
  assert.equal(
    mailer.validate({
      body: { event: { kind: '__proto__', title: 'Invalid' } },
    }).valid,
    false,
  );
});
