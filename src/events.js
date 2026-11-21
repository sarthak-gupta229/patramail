'use strict';

const styles = Object.freeze({
  invitation: {
    label: 'Invitation',
    accent: '#49309a',
    background: '#f0eaff',
    subject: (name) => `You're invited to ${name}`,
    intro:
      'Join us for the event below. Please let us know if you can make it.',
    button: 'RSVP',
  },
  confirmation: {
    label: 'Confirmed',
    accent: '#0c624e',
    background: '#e5f7ef',
    subject: (name) => `You're registered for ${name}`,
    intro:
      'Your registration is confirmed. Keep these details handy for the day.',
    button: 'View registration',
  },
  reminder: {
    label: 'Reminder',
    accent: '#784203',
    background: '#fff2d8',
    subject: (name) => `Coming up: ${name}`,
    intro: 'A quick reminder to check the details before the event.',
    button: 'View event details',
  },
  update: {
    label: 'Event update',
    accent: '#144780',
    background: '#e6f1ff',
    subject: (name) => `Updated details for ${name}`,
    intro:
      'The event details have changed. Please review the latest information below.',
    button: 'View updated details',
  },
  cancellation: {
    label: 'Canceled',
    accent: '#94264a',
    background: '#fdebf0',
    subject: (name) => `${name} has been canceled`,
    intro: 'This event has been canceled. Thank you for your understanding.',
    button: 'Get more information',
  },
  followUp: {
    label: 'After the event',
    accent: '#075966',
    background: '#e3f6f7',
    subject: (name) => `Thank you for joining ${name}`,
    intro:
      'Thanks for spending time with us. We appreciate you being part of the event.',
    button: 'View event resources',
  },
});

function eventTemplate(kind, options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('event options must be an object');
  }
  const {
    name,
    recipient,
    date,
    location,
    link,
    buttonText,
    intro,
    outro,
    subject,
    preheader,
    footer,
  } = options;
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('event name must be a non-empty string');
  }
  if (buttonText !== undefined && link === undefined) {
    throw new TypeError('event buttonText requires a link');
  }
  const preset = styles[kind];
  return {
    subject: subject === undefined ? preset.subject(name) : subject,
    preheader: preheader === undefined ? preset.intro : preheader,
    body: {
      name: recipient,
      intro: intro === undefined ? preset.intro : intro,
      event: { kind, title: name, date, location },
      actions:
        link === undefined
          ? undefined
          : [
              {
                button: {
                  text: buttonText === undefined ? preset.button : buttonText,
                  link,
                  color: preset.accent,
                },
              },
            ],
      outro,
    },
    footer,
  };
}

const templates = Object.freeze(
  Object.fromEntries(
    Object.keys(styles).map((kind) => [
      kind,
      (options) => eventTemplate(kind, options),
    ]),
  ),
);

module.exports = { styles, templates };
