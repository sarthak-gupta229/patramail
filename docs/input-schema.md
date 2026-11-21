# Input schema

Pass a plain object to any generation method. Every top-level field is
optional. The nested fields marked required apply when their containing
object is present. Unknown keys are ignored. In development, validation
reports unknown keys as warnings.

## Email

| Field       | Type   | Required | Example or behavior                                                            |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------ |
| `product`   | Object | No       | `{ name: 'Acme' }`, shallow-merged over constructor product defaults           |
| `subject`   | String | No       | `'Order confirmed'`, used as the HTML title; warns above 78 Unicode characters |
| `preheader` | String | No       | `'Your order is ready'`, hidden in the HTML to support inbox previews          |
| `body`      | Object | No       | `{ name: 'Jane', intro: 'Your order shipped.' }`                               |
| `footer`    | Object | No       | `{ text: 'Questions? Reply to this email.' }`                                  |

## Product

| Field               | Type               | Required    | Example or behavior                                           |
| ------------------- | ------------------ | ----------- | ------------------------------------------------------------- |
| `product.name`      | String             | With a logo | `'Acme'` is the text brand or the logo's alt text             |
| `product.link`      | URL string         | No          | `'https://acme.test'` links the brand                         |
| `product.logo`      | HTTP(S) URL string | No          | `'https://acme.test/logo.png'`, displayed in a 160 × 48px box |
| `product.copyright` | String             | No          | `'© 2026 Acme Inc.'`, shown in the footer                     |

## Body

| Field                            | Type                                   | Required | Example or behavior                                                                                                                                                               |
| -------------------------------- | -------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body.greeting`                  | String                                 | No       | `'Hello'`. If omitted and a name is supplied, the localized greeting defaults to `'Hi'`. Use `''` for a name alone.                                                               |
| `body.name`                      | String                                 | No       | `'Jane'`                                                                                                                                                                          |
| `body.intro`                     | String or array of strings             | No       | `['Thanks for your order.', 'Here is your receipt.']`, one paragraph per nonempty entry                                                                                           |
| `body.actions`                   | Array of objects                       | No       | `[{ instructions: 'View your receipt:', button: { text: 'View receipt', link: 'https://acme.test/receipt' } }]`                                                                   |
| `body.actions[].instructions`    | String                                 | No       | `'View your receipt:'`                                                                                                                                                            |
| `body.actions[].button`          | Object                                 | No       | `{ text: 'View receipt', link: 'https://acme.test/receipt' }`                                                                                                                     |
| `body.actions[].button.text`     | Nonempty string                        | Yes      | `'View receipt'`                                                                                                                                                                  |
| `body.actions[].button.link`     | URL string                             | Yes      | `'https://acme.test/receipt'`                                                                                                                                                     |
| `body.table`                     | Object                                 | No       | `{ data: [{ Item: 'Notebook', Price: '$6' }] }`                                                                                                                                   |
| `body.table.data`                | Array of row objects                   | Yes      | `[{ Item: 'Notebook', Qty: 2 }]`. Keys become headings in first-seen order. Cell values are strings or finite numbers. Missing cells are blank in HTML and omitted in plain text. |
| `body.table.columns`             | Object                                 | No       | `{ customWidth: { Price: '20%' } }`                                                                                                                                               |
| `body.table.columns.customWidth` | Object of column keys to width strings | No       | `{ Price: '20%', Qty: '80px' }`. Use whole numbers in the ranges `1%`–`100%` or `1px`–`999px`.                                                                                    |
| `body.table.total`               | Row object                             | No       | `{ Item: 'Total', Price: '$6' }`. Uses the headings from `data`, which must contain at least one column.                                                                          |
| `body.unsafeHtml`                | String                                 | No       | `'<p><strong>Order confirmed.</strong></p>'`. Inserted verbatim before the outro. Use only with markup you control. Put content required in both formats in a normal body field.  |
| `body.outro`                     | String                                 | No       | `'Reply if you need help.'`                                                                                                                                                       |
| `body.signature`                 | String                                 | No       | `'The Acme team'`                                                                                                                                                                 |

## Footer

| Field                 | Type             | Required | Example or behavior                                       |
| --------------------- | ---------------- | -------- | --------------------------------------------------------- |
| `footer.text`         | String           | No       | `'You received this email because you signed up.'`        |
| `footer.links`        | Array of objects | No       | `[{ text: 'Contact us', link: 'mailto:help@acme.test' }]` |
| `footer.links[].text` | Nonempty string  | Yes      | `'Contact us'`                                            |
| `footer.links[].link` | URL string       | Yes      | `'mailto:help@acme.test'`                                 |
| `footer.address`      | String           | No       | `'123 Market St, San Francisco, CA'`                      |

Use absolute `http://`, `https://`, `mailto:`, or `tel:` links. Logo URLs
accept HTTP(S) only. HTML output escapes user-provided text and URL
attributes. Plain-text output and returned metadata preserve literal text.
