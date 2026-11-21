# Themes

Use `new PatraMail({ theme: 'default' })` for the light palette with a dark
variant in clients that honor `prefers-color-scheme`. Use `theme: 'dark'`
to start with dark colors regardless of the client's preference. Clients may
still transform colors on their own.

Pass an object to override individual values. PatraMail shallow-merges the
object over the default theme and uses the resulting palette in both modes.
The named `themes` export exposes the frozen built-in palettes.

| Key       | Purpose                                    | Default                        |
| --------- | ------------------------------------------ | ------------------------------ |
| `bg`      | Background around the card                 | `#f3f4f6`                      |
| `card`    | Card background                            | `#ffffff`                      |
| `text`    | Body and footer text                       | `#212936`                      |
| `heading` | Greeting and table headers                 | `#111827`                      |
| `brand`   | Links and button background                | `#1746a2`                      |
| `font`    | Comma-separated unquoted system font names | `Arial, Helvetica, sans-serif` |
| `radius`  | Card and button rounding                   | `6px`                          |

Colors accept three- or six-digit hex strings. Radius accepts whole pixels
from `0px` to `999px`. Invalid values throw a `TypeError`. PatraMail chooses
black or white button text for contrast against the brand color. When changing
the palette, check that body text, headings, and links meet 4.5:1 contrast
against the card background.

```js
const PatraMail = require('patramail');

const mailer = new PatraMail({
  theme: { brand: '#075444', font: 'Georgia, serif', radius: '0px' },
});
const html = mailer.generateHtml({
  body: { intro: 'Your order is confirmed.' },
});
```

To build on the dark palette, spread `PatraMail.themes.dark` into your theme
object before applying overrides.
