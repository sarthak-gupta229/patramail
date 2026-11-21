'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const Mailgen = require('..');
const { PatraMail, templates } = Mailgen;

const cases = {
  passwordReset: ['Reset your password', 'Reset password'],
  emailVerification: ['Verify your email address', 'Verify email address'],
  dashboardWelcome: ['Your account is ready', 'Go to dashboard'],
};

for (const [name, [subject, button]] of Object.entries(cases)) {
  test(`renders ${name} in both formats and supports both constructors`, () => {
    const link = 'https://acme.test/action?token=example&source=email';
    const email = templates[name]({ recipient: '<Jane>', link });
    const result = new PatraMail().generate(email);
    assert.equal(result.subject, subject);
    assert.ok(result.preheader.length);
    assert.ok(result.html.includes(subject));
    assert.ok(result.html.includes(`>${button}</a>`));
    assert.match(result.html, /Hi &lt;Jane&gt;,/);
    assert.match(result.html, /token=example&amp;source=email/);
    assert.ok(result.text.includes(`${button}: ${link}`));
    assert.match(result.text, /Hi <Jane>,/);
    assert.equal(new Mailgen().generate(email), result.html);
    assert.equal(new Mailgen().generatePlaintext(email), result.text);
  });

  test(`requires a web action link for ${name}`, () => {
    for (const link of [
      undefined,
      '/account',
      'mailto:help@acme.test',
      'javascript:alert(1)',
    ]) {
      assert.throws(() => templates[name]({ link }), /absolute HTTP\(S\) URL/);
    }
  });
}

test('supports copy overrides and an email without a recipient name', () => {
  const result = new PatraMail({ theme: 'dark' }).generate(
    templates.passwordReset({
      link: 'https://acme.test/reset',
      subject: 'Reset your Acme password',
      preheader: 'Requested a reset?',
      intro: ['We received your reset request.'],
      buttonText: 'Choose a new password',
      outro: '',
    }),
  );
  assert.equal(result.subject, 'Reset your Acme password');
  assert.equal(result.preheader, 'Requested a reset?');
  assert.match(
    result.text,
    /Choose a new password: https:\/\/acme.test\/reset/,
  );
  assert.doesNotMatch(result.text, /Hi |ignore this email/);
});
