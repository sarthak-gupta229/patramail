# PatraMail

Generate responsive transactional email HTML and plain text from structured input.

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
