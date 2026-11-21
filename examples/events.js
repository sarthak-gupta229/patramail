'use strict';

const { PatraMail, templates } = require('..');

const details = {
  name: 'Studio Open House',
  recipient: 'Maya',
  date: 'Sat, Dec 12 · 4:00 p.m. IST',
  location: 'Northline Studio, Bengaluru',
};

module.exports = [
  [
    'event-invitation',
    templates.invitation({
      ...details,
      link: 'https://events.example.com/rsvp',
    }),
  ],
  [
    'event-confirmation',
    templates.confirmation({
      ...details,
      link: 'https://events.example.com/registration',
    }),
  ],
  [
    'event-reminder',
    templates.reminder({
      ...details,
      link: 'https://events.example.com/details',
    }),
  ],
  [
    'event-update',
    templates.update({
      ...details,
      date: 'Sat, Dec 12 · 5:00 p.m. IST',
      intro: 'Doors now open at 5:00 p.m. IST. The venue is unchanged.',
      link: 'https://events.example.com/details',
    }),
  ],
  [
    'event-cancellation',
    templates.cancellation({
      name: details.name,
      recipient: details.recipient,
      outro: 'We will email you when we have a new date.',
    }),
  ],
  [
    'event-follow-up',
    templates.followUp({
      name: details.name,
      recipient: details.recipient,
      link: 'https://events.example.com/resources',
    }),
  ],
].map(([name, email]) => [
  name,
  {
    ...email,
    product: { name: 'Northline Studio', link: 'https://events.example.com' },
  },
]);

if (require.main === module) {
  const mailer = new PatraMail();
  const selected = process.argv[2] ?? 'event-invitation';
  const email = module.exports.find(([name]) => name === selected)?.[1];
  if (!email) {
    console.error(
      `Choose one of: ${module.exports.map(([name]) => name).join(', ')}`,
    );
    process.exitCode = 1;
  } else {
    console.log(mailer.generateHtml(email));
  }
}
