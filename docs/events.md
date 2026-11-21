# Event email templates

PatraMail ships six event templates. Each has a status label, a coordinated
accent, and preset copy. The built-in light theme uses a warm paper background;
the dark theme uses charcoal. Event names use a serif headline, and the date
and location stack on small screens. Custom themes still control the brand
color and main palette. Every template produces
HTML and plain text from the same event details.

| Template                 | When to use it                               | Default button       |
| ------------------------ | -------------------------------------------- | -------------------- |
| `templates.invitation`   | Invite someone and collect an RSVP           | RSVP                 |
| `templates.confirmation` | Confirm a registration                       | View registration    |
| `templates.reminder`     | Send practical details before the event      | View event details   |
| `templates.update`       | Share a new time, venue, or format           | View updated details |
| `templates.cancellation` | Confirm a cancellation or provide next steps | Get more information |
| `templates.followUp`     | Thank attendees and share resources          | View event resources |

```js
const { PatraMail, templates } = require('patramail');

const mailer = new PatraMail({ product: { name: 'Northline Studio' } });
const email = templates.invitation({
  name: 'Studio Open House',
  recipient: 'Maya',
  date: 'Saturday, December 12 at 4:00 p.m. IST',
  location: 'Northline Studio, Bengaluru',
  link: 'https://events.example.com/rsvp',
});
const { html, text, subject } = mailer.generate(email);
```

Pass `html`, `text`, and `subject` to your email transport.

| Option                 | Type                       | Purpose                                                           |
| ---------------------- | -------------------------- | ----------------------------------------------------------------- |
| `name`                 | Nonempty string, required  | Event name shown in the event card and default subject            |
| `recipient`            | String                     | Adds a personalized greeting                                      |
| `date`                 | String                     | Display-ready date and time, including the time zone where useful |
| `location`             | String                     | Venue, meeting platform, or location details                      |
| `link`                 | URL string                 | Adds a button with this destination                               |
| `buttonText`           | Nonempty string            | Overrides the button label when a link is supplied                |
| `intro`, `outro`       | String or array of strings | Override the default introduction or add closing paragraphs       |
| `subject`, `preheader` | String                     | Override the preset metadata independently                        |
| `footer`               | Footer object              | Adds contact information or footer links                          |

The date and location appear only when provided. Button URLs follow the
[normal input rules](input-schema.md). Template copy and status labels ship
in English. Use the text overrides to customize the message.

Run `npm run preview` from this repository to generate the six examples
under `preview/`, or run `node examples/events.js event-invitation` to
print one example directly.
