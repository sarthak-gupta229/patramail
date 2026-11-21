'use strict';

module.exports = {
  product: {
    name: 'Acme',
    link: 'https://acme.test',
    copyright: '© 2026 Acme Inc.',
  },
  subject: 'Reset your Acme password',
  preheader: 'Use this link to choose a new password.',
  body: {
    greeting: 'Hi',
    name: 'Jane',
    intro: ['We received a request to reset your password.'],
    actions: [
      {
        instructions: 'Choose a new password using the link below.',
        button: {
          text: 'Reset password',
          link: 'https://acme.test/reset?token=demo&source=email',
        },
      },
    ],
    outro:
      'If you did not request a password reset, you can ignore this email.',
    signature: 'The Acme team',
  },
  footer: { text: 'This link expires in 30 minutes.' },
};

if (require.main === module) {
  const { PatraMail } = require('..');
  console.log(new PatraMail().generateHtml(module.exports));
}
