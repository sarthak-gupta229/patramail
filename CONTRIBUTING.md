# Contributing to PatraMail

You can help by improving the docs, reporting an email rendering issue, or
contributing a fix or template.

## Set up your checkout

Fork the repository on GitHub and clone your fork. Replace
`YOUR_GITHUB_USERNAME` with your username.

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/patramail.git
cd patramail
git switch -c describe-your-change
npm ci
npm test
npm run lint
```

PatraMail uses Node.js 18+, CommonJS, and `node:test`. The package has zero
runtime dependencies. ESLint and Prettier are its development dependencies.

## Report an issue

Share the PatraMail and Node.js versions, the smallest input that reproduces
the problem, and the expected and actual output. For rendering issues, include
the email client and platform, light or dark mode, and a screenshot if available.
Replace real email addresses, tokens, and credentials with sample values.
[Open a GitHub issue](https://github.com/sarthak-gupta229/patramail/issues)

## Change rendering or add a template

- Escape user-provided HTML content by default. Use the existing URL validation
  and keep raw markup opt-in through `body.unsafeHtml`.
- Use presentation tables for layout and inline styles for the default rendering.
  Keep style blocks for media queries.
- Check that a template renders the essential content and links in both HTML
  and plain text.
- Run `npm run preview` and open the affected files in `preview/`. Check light
  and dark rendering and a narrow viewport when the layout changes. Mention the
  browsers or email clients you actually checked.
- When HTML output changes intentionally, run `UPDATE_SNAPSHOTS=1 npm test`
  and review the generated diffs in `test/snapshots/` before committing.
- Update the [API reference](docs/api.md), [input schema](docs/input-schema.md),
  or [template guide](docs/events.md) when the public behavior changes.

## Open a pull request

Run `npm test` and `npm run lint` again. Keep the change focused and use a
descriptive commit message, such as `fix(render): preserve footer links`.
In your pull request, explain the problem and the change, link any related
issue, and list the checks you ran. Include before-and-after previews for
visual changes. GitHub Actions runs lint and tests across the Node versions in
the [CI workflow](.github/workflows/ci.yml).
