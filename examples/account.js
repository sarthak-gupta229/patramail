'use strict';

const { PatraMail, templates } = require('..');

const product = { name: 'Acme', link: 'https://acme.test' };
const recipient = 'Jane';
const previews = [
  [
    'account-password-reset',
    templates.passwordReset({
      recipient,
      link: 'https://acme.test/reset?token=example',
    }),
  ],
  [
    'email-verification',
    templates.emailVerification({
      recipient,
      link: 'https://acme.test/verify?token=example',
    }),
  ],
  [
    'dashboard-welcome',
    templates.dashboardWelcome({
      recipient,
      link: 'https://acme.test/dashboard',
    }),
  ],
];

module.exports = previews.map(([name, email]) => [name, { ...email, product }]);

if (require.main === module) {
  const name = process.argv[2] ?? 'account-password-reset';
  const example = module.exports.find(([preview]) => preview === name);
  if (!example) throw new Error(`Unknown account preview: ${name}`);
  console.log(new PatraMail().generateHtml(example[1]));
}
