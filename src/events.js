'use strict';

const styles = Object.freeze({
  invitation: {
    label: 'Invitation',
    accent: '#52406e',
    darkAccent: '#c9b8e7',
    subject: (name) => `You're invited to ${name}`,
    intro:
      'Join us for the event below. Please let us know if you can make it.',
    button: 'RSVP',
  },
  confirmation: {
    label: 'Confirmed',
    accent: '#285747',
    darkAccent: '#a6cbbb',
    subject: (name) => `You're registered for ${name}`,
    intro:
      'Your registration is confirmed. Keep these details handy for the day.',
    button: 'View registration',
  },
  reminder: {
    label: 'Reminder',
    accent: '#69471e',
    darkAccent: '#dec08e',
    subject: (name) => `Coming up: ${name}`,
    intro: 'A quick reminder to check the details before the event.',
    button: 'View event details',
  },
  update: {
    label: 'Event update',
    accent: '#365677',
    darkAccent: '#adc8e5',
    subject: (name) => `Updated details for ${name}`,
    intro:
      'The event details have changed. Please review the latest information below.',
    button: 'View updated details',
  },
  cancellation: {
    label: 'Canceled',
    accent: '#813c47',
    darkAccent: '#e4abb4',
    subject: (name) => `${name} has been canceled`,
    intro: 'This event has been canceled. Thank you for your understanding.',
    button: 'Get more information',
  },
  followUp: {
    label: 'After the event',
    accent: '#285b62',
    darkAccent: '#a6cdd0',
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

function eventTheme(theme, kind, mode) {
  if (mode === 'custom') {
    return { ...theme, eventSurface: theme.card, eventRule: '#8b8277' };
  }

  const { accent, darkAccent } = styles[kind];
  const dark = mode === 'dark';
  return {
    ...theme,
    bg: dark ? '#171819' : '#eeeae4',
    card: dark ? '#222325' : '#fffefa',
    heading: dark ? '#f5f2ed' : '#211e1b',
    text: dark ? '#dedad4' : '#403b35',
    brand: dark ? darkAccent : accent,
    radius: '8px',
    eventSurface: dark ? '#292a2c' : '#f7f3ec',
    eventRule: dark ? '#55514e' : '#d8cfc3',
  };
}

module.exports = { styles, templates, eventTheme };
