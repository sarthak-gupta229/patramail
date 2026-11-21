# PatraMail: Project Plan

A Node.js npm package that generates clean, responsive HTML emails for transactional mail (password resets, receipts, confirmations, invoices). Inspired by mailgen.

---

## 1. Goals

- Turn a structured JSON-like object into a responsive, email-safe HTML string.
- Work across major email clients, including Outlook, Gmail, and Apple Mail.
- Escape all user input by default so the package is safe to use with untrusted data.
- Ship with a small set of themes and let users customize colors, fonts, and text.
- Provide a plain-text version generated from the same input.
- Be small, dependency-light, and easy to read.

### Non-goals (for v1)

- A visual email editor or drag-and-drop builder.
- Sending email. The package only generates content. Users plug in their own transport (Nodemailer, SendGrid, SES, Mailgun, etc.).
- Complex templating languages. Keep the input as plain objects.

---

## 2. Project Structure

```
patramail/
├── src/
│   ├── index.js              # Public API: PatraMail class and exports
│   ├── render.js             # Builds the full HTML document
│   ├── sections/
│   │   ├── header.js         # Brand/logo header row
│   │   ├── body.js           # Greeting, intro, actions, outro, signature
│   │   ├── actions.js        # Instruction + button blocks
│   │   ├── table.js          # Optional data table (invoices, receipts)
│   │   └── footer.js         # Copyright, links, address
│   ├── text.js               # Plain-text generator
│   ├── escape.js             # HTML escaping helper
│   ├── validate.js           # Input validation and warnings
│   ├── themes/
│   │   ├── index.js          # Theme registry and merge logic
│   │   ├── default.js
│   │   └── dark.js
│   └── i18n/
│       ├── index.js          # Label lookup and fallback
│       └── en.js             # Default English labels
├── test/
│   ├── escape.test.js
│   ├── render.test.js
│   ├── text.test.js
│   ├── validate.test.js
│   ├── snapshots/            # Expected HTML outputs for regression checks
│   └── fixtures/             # Sample email inputs
├── examples/
│   ├── password-reset.js
│   ├── receipt.js
│   └── with-nodemailer.js
├── scripts/
│   └── preview.js            # Writes example emails to preview/*.html
├── docs/
│   ├── api.md                # Full API reference
│   ├── input-schema.md       # Every field of the input object
│   └── themes.md             # How to create and customize themes
├── .github/
│   └── workflows/
│       └── ci.yml            # Lint, test, and publish on tag
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── .npmignore                # Or use the "files" field in package.json
├── .editorconfig
├── .prettierrc
├── eslint.config.js
└── package.json
```

### Why this layout

- `src/sections/` keeps each email part small and testable on its own.
- `src/escape.js` is isolated so it can be audited easily. Security-sensitive code should be obvious.
- `test/snapshots/` catches unintended layout changes when you refactor.
- `examples/` doubles as documentation and as manual test cases.

---

## 3. Input Schema (Draft)

```js
{
  product: {
    name: 'Acme',
    link: 'https://acme.test',
    logo: 'https://acme.test/logo.png',
    copyright: '© 2026 Acme Inc.'
  },
  subject: 'Confirm your account',       // optional, used for <title>
  preheader: 'Confirm to get started',   // hidden inbox preview text
  body: {
    greeting: 'Hi',
    name: 'Jane',
    intro: ['Welcome aboard.', 'Click below to confirm your email.'],
    actions: [
      {
        instructions: 'Confirm your email address:',
        button: { text: 'Confirm', link: 'https://acme.test/confirm' }
      }
    ],
    table: {                              // optional
      data: [{ item: 'Pro plan', price: '$10' }],
      columns: { customWidth: { price: '20%' } }
    },
    outro: 'Reply to this email if you need help.',
    signature: 'Cheers, the Acme team'
  },
  footer: {
    text: 'You received this email because you signed up.',
    links: [{ text: 'Unsubscribe', link: 'https://acme.test/unsub' }]
  }
}
```

Rules to decide early and document:

- `intro` accepts a string or an array of strings (one paragraph each).
- Unknown keys are ignored and reported as warnings in development mode.
- Every string is escaped unless the user explicitly uses `unsafeHtml`.

---

## 4. Public API (Draft)

```js
const PatraMail = require('patramail');

const mailer = new PatraMail({
  product: { name: 'Acme', link: 'https://acme.test' },
  theme: 'default',                 // or a theme object
  lang: 'en'
});

mailer.generate(email)              // -> { html, text, subject, preheader }
mailer.generateHtml(email)          // -> string
mailer.generatePlainText(email)     // -> string
mailer.validate(email)              // -> { valid, errors, warnings }
```

Also export `PatraMail`, `themes`, and `escape` as named exports for advanced use.

---

## 5. Build Phases

Work through these in order. Each phase ends with something runnable.

### Phase 0: Setup (half a day)

- [ ] Create the repo on GitHub with a README and MIT license.
- [ ] Run `npm init`, set `main`, `files`, `engines` (Node 18+), and `license`.
- [ ] Add ESLint, Prettier, and `.editorconfig`.
- [ ] Choose a test runner. `node:test` (built in) keeps dependencies at zero.
- [ ] Set up a CI workflow that runs lint and tests on every push.

**Done when:** `npm test` runs and passes with one placeholder test.

### Phase 1: Core HTML rendering (2 to 3 days)

- [ ] Write `escape.js` and test it against `<`, `>`, `&`, quotes, and `<script>` tags.
- [ ] Build the outer document: doctype, meta tags, table-based wrapper, 600px container.
- [ ] Build sections in order: header, greeting, intro, actions, outro, signature, footer.
- [ ] Skip any section whose data is missing, without leaving blank rows.
- [ ] Add the mobile media query that makes the container fluid under 620px.
- [ ] Inline all styles. Do not rely on `<style>` blocks for layout.

**Done when:** a sample password-reset email renders correctly in a browser and the snapshot test passes.

### Phase 2: Themes and customization (1 to 2 days)

- [ ] Define the theme shape: `bg`, `card`, `text`, `heading`, `brand`, `font`, `radius`.
- [ ] Merge a user theme over the default with a shallow merge. Validate color values.
- [ ] Ship `default` and `dark` themes.
- [ ] Add a `dark` mode block using `prefers-color-scheme` plus `color-scheme` meta tags.
- [ ] Document how to write a custom theme in `docs/themes.md`.

**Done when:** the same input renders in two themes and both pass visual review.

### Phase 3: Data table and rich blocks (1 to 2 days)

- [ ] Add the table section for receipts and invoices, with headers, rows, and an optional total row.
- [ ] Support `customWidth` per column.
- [ ] Make tables scroll horizontally inside their own wrapper on small screens.

**Done when:** a receipt example with five items renders correctly on a 375px-wide viewport.

### Phase 4: Plain-text generation (1 day)

- [ ] Write `text.js` that walks the same input object.
- [ ] Format actions as `Instructions: <link>` lines.
- [ ] Render tables as aligned columns or simple `key: value` lines.
- [ ] Strip nothing from user text. Plain text needs no escaping.

**Done when:** `generate()` returns both `html` and `text` for every fixture.

### Phase 5: Validation and developer experience (1 to 2 days)

- [ ] Write `validate.js`. Errors for missing required fields such as a button's `link`. Warnings for unknown keys and very long subjects.
- [ ] Add a `preheader` field, rendered as hidden text.
- [ ] Add i18n labels with `en` as the default and a fallback to English for missing keys.
- [ ] Add `scripts/preview.js` that writes every example to `preview/*.html`.

**Done when:** running `npm run preview` produces HTML files you can open and check.

### Phase 6: Testing and compatibility (2 to 3 days)

- [ ] Write unit tests for each section, the escape helper, the text generator, and validation.
- [ ] Add snapshot tests for each fixture. Update them deliberately with a flag.
- [ ] Send the preview emails to Gmail, Outlook (desktop and web), Apple Mail, and a mobile client through Mailtrap, Ethereal, or a real inbox.
- [ ] For wider coverage, run one send through Litmus or Email on Acid, or use the free "Email Client Testing" services listed in the README.
- [ ] Record known rendering issues in the README.

**Done when:** all tests pass in CI and the compatibility notes are written.

### Phase 7: Documentation (1 to 2 days)

- [ ] README: what it is, install, a 10-line quick start, screenshot of output, link to docs.
- [ ] `docs/input-schema.md`: every field, its type, whether it is required, and an example.
- [ ] `docs/api.md`: every method and return value.
- [ ] `docs/themes.md`: theme keys with example values and a custom theme walkthrough.
- [ ] Three runnable examples in `examples/`, one of them with Nodemailer.

**Done when:** a new developer can send their first email in under ten minutes using only the README.

### Phase 8: Release (half a day)

- [ ] Bump the version to `0.1.0` and write the first `CHANGELOG.md` entry.
- [ ] Run `npm pack` and inspect the tarball. Confirm only `src`, `README.md`, and `LICENSE` are included.
- [ ] Check the name is free: `npm view patramail` should return 404. If not, use a scope such as `@yourname/patramail`.
- [ ] `npm login`, then `npm publish` (add `--access public` for scoped names).
- [ ] Tag the release on GitHub and create a release note.

**Done when:** `npm install patramail` works in an empty folder and the example runs.

### Phase 9: After launch

- [ ] Collect issues and feature requests on GitHub.
- [ ] Add more built-in themes and layouts based on demand.
- [ ] Consider a `v1.0.0` once the schema has been stable for a few releases.

---

## 6. Quality Checklist (Before Each Release)

**Security**
- [ ] Every user-supplied string is escaped, except inside `unsafeHtml` blocks.
- [ ] Link values are checked for `javascript:` and `data:` schemes.
- [ ] No external scripts or fonts are required to render.

**Compatibility**
- [ ] Layout uses nested tables with `role="presentation"`.
- [ ] Styles are inline. Media queries are the only `<style>` rules.
- [ ] Images have `alt` text and explicit width and height.
- [ ] Buttons use bulletproof markup (a padded `<td>` with a link inside), not image buttons.

**Accessibility**
- [ ] Text contrast is at least 4.5:1 against the background.
- [ ] `lang` attribute is set on `<html>`.
- [ ] Links have descriptive text, not just "click here".

**Quality**
- [ ] `npm test` and `npm run lint` pass.
- [ ] Snapshots are reviewed when they change.
- [ ] CHANGELOG is updated.
- [ ] Package size is reasonable (`npm pack --dry-run`).

---

## 7. Suggested Timeline

| Week | Focus |
|------|-------|
| 1 | Phase 0 and Phase 1. Working HTML output. |
| 2 | Phase 2 and Phase 3. Themes and tables. |
| 3 | Phase 4 and Phase 5. Plain text and validation. |
| 4 | Phase 6. Tests and client testing. |
| 5 | Phase 7 and Phase 8. Docs and first release. |

This assumes part-time work, roughly 8 to 10 hours per week. Full-time work can compress it to two or three weeks.

---

## 8. Risks and How to Handle Them

| Risk | Mitigation |
|------|-----------|
| Outlook renders layout differently | Use table-based layout and test on Outlook early, not at the end. |
| HTML injection through user data | Escape by default and test with malicious strings in the test suite. |
| Scope creep into a full editor | Keep v1 to structured input. Log ideas as issues for later. |
| Name already taken on npm | Check early in Phase 0. Fall back to a scoped name. |
| Breaking changes after release | Keep the schema additive. Use semver and document breaking changes in the CHANGELOG. |

---

## 9. Definition of Done for v0.1.0

- [ ] Renders header, body, actions, optional table, outro, signature, and footer.
- [ ] Two themes available, with custom theme support.
- [ ] HTML and plain-text output from one call.
- [ ] Input validation with clear error messages.
- [ ] Escaping covered by tests.
- [ ] Tested in at least four email clients.
- [ ] README, API docs, and at least two examples.
- [ ] Published to npm with a tagged GitHub release.
