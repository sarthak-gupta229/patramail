'use strict';

const { writeFileSync } = require('node:fs');
const PatraMail = require('../..');

const mailGenerator = new PatraMail({
  theme: 'default',
  product: {
    name: 'Acme',
    link: 'https://acme.test',
  },
});

const email = {
  body: {
    name: 'Jane',
    intro: 'Welcome to Acme! Your account is ready.',
    action: {
      instructions: 'Confirm your email address to get started.',
      button: {
        color: '#1746a2',
        text: 'Confirm your account',
        link: 'https://acme.test/confirm?token=example',
      },
    },
    outro: 'If you have questions, reply to this email.',
  },
};

const emailBody = mailGenerator.generate(email);
const emailText = mailGenerator.generatePlaintext(email);

writeFileSync(process.argv[2] ?? 'preview.html', emailBody, 'utf8');
console.log(emailText);
