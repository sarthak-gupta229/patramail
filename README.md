# PatraMail

PatraMail generates responsive HTML and plain text for transactional emails from
one JavaScript object. It runs on Node.js 18+ using CommonJS and zero runtime
dependencies. Pass the output to your existing email transport.

```sh
npm install patramail
```

## Quick start

```js
const PatraMail = require('patramail');
const mailer = new PatraMail({
  product: { name: 'Acme', link: 'https://acme.test' },
});
const message = mailer.generate({
  subject: 'Order confirmed',
  preheader: 'Your order #1042 is confirmed.',
  body: {
    name: 'Jane',
    intro: 'We received your payment for order #1042.',
  },
});
```

`message.html` and `message.text` are ready to pass to your email transport
along with `message.subject`. PatraMail embeds the preheader in the HTML.

![Password-reset email preview showing the heading, reset button, and footer](docs/password-reset.png)

## Event templates and Mailgen-style usage

Choose from invitation, registration confirmation, reminder, event update,
cancellation, and follow-up templates. Each supplies event copy, a color
palette, and an optional action button. See the
[event template guide](docs/events.md) for a complete example.

Migrating from Mailgen? Use `const { Mailgen } = require('patramail')` to
keep the `generate(email)` and `generatePlaintext(email)` pattern. The
[Mailgen-style example](docs/api.md#mailgen-style-usage) shows the
constructor options and a single `body.action` object.

## Send with Nodemailer

Install Nodemailer in your application with `npm install nodemailer`. Copy the
quick start into an async function, then use the message with your SMTP settings.

```js
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport(process.env.SMTP_URL);
await transport.sendMail({
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
  subject: message.subject,
  html: message.html,
  text: message.text,
});
```

Set `SMTP_URL` to your provider's SMTP URL and set `MAIL_FROM` and `MAIL_TO`
to your sender and recipient addresses.

## Examples and reference

- [Password reset](examples/password-reset.js) and [receipt](examples/receipt.js) print HTML when run with Node.
- [Nodemailer example](examples/with-nodemailer.js) emits a complete MIME message to stdout with Nodemailer installed. Set `SMTP_URL`, `MAIL_FROM`, and `MAIL_TO` to send it using your SMTP provider.
- `npm run preview` in this repository generates the example HTML files under `preview/`.
- [API reference](docs/api.md), [input schema](docs/input-schema.md), and [themes](docs/themes.md).

## Email-client compatibility

Chrome previews verified desktop light and dark layouts and a 375px receipt
with a horizontally scrolling table. The browser preview is useful for layout
checks. Inbox verification is still pending for Gmail, Outlook desktop and web,
Apple Mail, and a mobile email client.

- Classic Outlook may display square corners and use the inline fallback colors.
  Dark-mode recoloring varies by client. [Can I email dark mode results](https://www.caniemail.com/features/css-at-media-prefers-color-scheme/)
- Some clients may ignore the receipt's scrolling wrapper or clip a wide table.
  Keep transactional tables narrow when targeting those clients. [Can I email overflow results](https://www.caniemail.com/features/css-overflow/)

For a transport smoke test, [Ethereal](https://ethereal.email/) catches messages
in a free SMTP sandbox. For an inbox check, send to accounts you control or use
a service that renders the supported clients.

## Development

Run `npm ci`, `npm test`, and `npm run lint`. When changing the generated
markup intentionally, run `UPDATE_SNAPSHOTS=1 npm test` and review the
resulting diffs in `test/snapshots/`.
