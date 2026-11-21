# API reference

```js
const { PatraMail, themes, escape } = require('patramail');
```

## `new PatraMail(options?)`

Returns a reusable generator. All options are optional.

| Option    | Type                                           | Default     | Behavior                                                                                                      |
| --------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `product` | Plain object                                   | `{}`        | Default product fields from the [input schema](input-schema.md). Per-email fields override matching defaults. |
| `theme`   | `'default'`, `'dark'`, or plain options object | `'default'` | Selects a palette or shallow-merges overrides over the default. See [themes](themes.md).                      |
| `lang`    | BCP 47 language tag                            | `'en'`      | Sets the HTML language and looks up built-in labels. Missing translations use English.                        |

Invalid option types or values throw `TypeError`. An invalid language tag
string can throw `RangeError`. Product fields are checked against the schema
when an email is validated or generated.

## `mailer.generate(email)`

Returns `{ html, text, subject, preheader }`. The first two properties
are strings. Subject and preheader are the original input strings or
`undefined` when omitted.

## `mailer.generateHtml(email)`

Returns the complete HTML document as a string.

## `mailer.generatePlainText(email)`

Returns the plain-text body as a string. Actions use
`Instructions: https://example.test` when both instructions and a button URL
are present, with button text as the fallback label. Tables use labeled
fields. HTML-only blocks are omitted.

## `mailer.validate(email)`

Returns `{ valid: boolean, errors: string[], warnings: string[] }`.
The email is valid when `errors` is empty. Unknown-field warnings are enabled
when `NODE_ENV` is anything other than `production`. Subject-length warnings
apply in every environment.

All three generation methods validate first. Errors produce a `TypeError`
whose message lists all detected errors. When generation succeeds with
warnings, Node emits a warning with code `PATRAMAIL_INPUT`.

## Named exports

- `PatraMail` is the constructor for the combined-output API documented above.
- `themes` is a frozen registry with frozen `default` and `dark` palettes.
- `escape(value)` returns a string that escapes `&`, `<`, `>`, double quotes,
  and single quotes for HTML text and quoted attributes. It casts other
  values to strings and returns `''` for `null` or `undefined`.

## Templates

The named `templates` export contains nine builders that return standard
PatraMail input objects. Pass the result to either constructor's generation
methods. See the [event template guide](events.md) for the six event builders.

### Account templates

| Builder                                | Action               |
| -------------------------------------- | -------------------- |
| `templates.passwordReset(options)`     | Reset password       |
| `templates.emailVerification(options)` | Verify email address |
| `templates.dashboardWelcome(options)`  | Go to dashboard      |

```js
const { PatraMail, templates } = require('patramail');
const mailer = new PatraMail({
  product: { name: 'Acme', link: 'https://acme.test' },
});

const { subject, html, text } = mailer.generate(
  templates.passwordReset({
    recipient: 'Jane',
    link: 'https://acme.test/reset?token=example',
  }),
);
```

All three builders require an absolute HTTP(S) `link`. The optional
`recipient` personalizes the message. Override `subject`, `preheader`,
`intro`, `outro`, or `buttonText` to adapt the copy. `intro` and `outro`
accept a string or an array of strings. Pass in the reset or verification URL
created by your application.

Run `npm run preview` to generate all three HTML files, or run
`node examples/account.js email-verification` to print that example directly.

## Mailgen-style usage

The default CommonJS export, also available as `Mailgen`, supports code that calls
`generate(email)` for the HTML string and `generatePlaintext(email)` for
the text string. It also exposes `generateHtml(email)`,
`generatePlainText(email)`, and `validate(email)` with the same input support.

```js
const PatraMail = require('patramail');

const generator = new PatraMail({
  theme: 'default',
  product: { name: 'Northline Studio', link: 'https://events.example.com' },
});
const email = {
  body: {
    name: 'Maya',
    intro: 'We saved you a spot for the Studio Open House.',
    action: {
      instructions: 'Please confirm your RSVP.',
      button: {
        color: '#49309a',
        text: 'Confirm RSVP',
        link: 'https://events.example.com/rsvp',
      },
    },
    outro: ['Questions about the venue?', 'Reply to this email.'],
  },
};

const html = generator.generate(email);
const text = generator.generatePlaintext(email);
```

The adapter accepts a single `body.action` object or an array,
`body.title`, `greeting: false`, `signature: false`, and multiline
`intro` and `outro`. It applies PatraMail's theme registry, schema, and
escaping rules. Mailgen's own themes, template files, and other
Mailgen-specific fields are outside this adapter's supported surface.

See the [original Mailgen API example](https://github.com/eladnava/mailgen#usage).
