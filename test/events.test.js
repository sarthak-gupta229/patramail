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
    accents.add(
      html.match(/<p class="pm-brand" style="[^"]*color:(#[0-9a-f]{6})/)[1],
    );
    assert.match(html, /Hi Maya<\/p>/);
    assert.match(html, /&lt;Open House&gt;<\/h1>/);
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

test('keeps event copy, status, links, and buttons readable in both built-in themes', () => {
  const { eventTheme } = require('../src/events');
  const { themes, buttonText } = require('../src/themes');
  const luminance = (hex) =>
    hex
      .slice(1)
      .match(/../g)
      .reduce((sum, pair, index) => {
        const channel = parseInt(pair, 16) / 255;
        const linear =
          channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][index];
      }, 0);
  for (const kind of Object.keys(templates)) {
    for (const mode of ['light', 'dark']) {
      const colors = eventTheme(
        mode === 'dark' ? themes.dark : themes.default,
        kind,
        mode,
      );
      for (const [foreground, background] of [
        [colors.heading, colors.eventSurface],
        [colors.heading, colors.card],
        [colors.text, colors.eventSurface],
        [colors.text, colors.card],
        [colors.brand, colors.eventSurface],
        [colors.brand, colors.card],
        [buttonText(colors.brand), colors.brand],
      ]) {
        const [a, b] = [luminance(foreground), luminance(background)].sort(
          (left, right) => right - left,
        );
        assert.ok(
          (a + 0.05) / (b + 0.05) >= 4.5,
          `${kind} ${mode}: ${foreground} on ${background}`,
        );
      }
    }
  }
});

test('sets explicit and automatic dark event colors and honors custom palettes', () => {
  const input = templates.invitation({
    name: 'Open House',
    link: 'https://example.com/rsvp',
  });
  const light = new PatraMail().generateHtml(input);
  const dark = new PatraMail({ theme: 'dark' }).generateHtml(input);
  const custom = new PatraMail({
    theme: { card: '#fff', brand: '#004d40' },
  }).generateHtml(input);

  assert.match(light, /class="pm-event-hero pm-event-inset" bgcolor="#f7f3ec"/);
  assert.match(
    light,
    /prefers-color-scheme: dark[\s\S]*\.pm-event-hero \{ background-color: #292a2c/,
  );
  assert.match(dark, /class="pm-event-hero pm-event-inset" bgcolor="#292a2c"/);
  assert.match(dark, /class="pm-button" bgcolor="#c9b8e7"/);
  assert.match(custom, /class="pm-event-hero pm-event-inset" bgcolor="#fff"/);
  assert.match(custom, /class="pm-button" bgcolor="#004d40"/);
});
