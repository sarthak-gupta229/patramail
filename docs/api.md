# API reference

```js
const PatraMail = require('patramail');
const { PatraMail: NamedPatraMail, themes, escape } = require('patramail');
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

- `PatraMail` is the same class as the default CommonJS export.
- `themes` is a frozen registry with frozen `default` and `dark` palettes.
- `escape(value)` returns a string that escapes `&`, `<`, `>`, double quotes,
  and single quotes for HTML text and quoted attributes. It casts other
  values to strings and returns `''` for `null` or `undefined`.
