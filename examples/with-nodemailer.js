'use strict';

const email = {
  product: { name: 'Acme', link: 'https://acme.test' },
  subject: 'Welcome to Acme',
  preheader: 'Your account is ready.',
  body: {
    name: 'Jane',
    intro: 'Your account is ready to use.',
    actions: [
      {
        button: {
          text: 'Open your account',
          link: 'https://acme.test/account',
        },
      },
    ],
    signature: 'The Acme team',
  },
};

module.exports = email;

if (require.main === module) {
  const PatraMail = require('..');
  const nodemailer = require('nodemailer');
  const { SMTP_URL, MAIL_FROM, MAIL_TO } = process.env;

  async function main() {
    if (SMTP_URL && (!MAIL_FROM || !MAIL_TO)) {
      throw new Error('Set both MAIL_FROM and MAIL_TO when using SMTP_URL');
    }
    const transport = nodemailer.createTransport(
      SMTP_URL || { streamTransport: true, buffer: true, newline: 'unix' },
    );
    const { subject, html, text } = new PatraMail().generate(email);
    const info = await transport.sendMail({
      from: MAIL_FROM || 'accounts@acme.test',
      to: MAIL_TO || 'jane@example.test',
      subject,
      html,
      text,
    });
    console.log(info.message ? info.message.toString() : info.messageId);
  }

  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
