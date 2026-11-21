'use strict';

const { safeUrl } = require('./escape');
const { isRecord } = require('./validate');

const copy = {
  passwordReset: {
    title: 'Reset your password',
    preheader: 'Use this link to choose a new password.',
    intro:
      'We received a request to reset your password. Use the button below to choose a new one.',
    buttonText: 'Reset password',
    outro: 'If you didn’t request a password reset, you can ignore this email.',
  },
  emailVerification: {
    title: 'Verify your email address',
    preheader: 'Confirm this email address to finish setting up your account.',
    intro: 'Please confirm that this email address belongs to you.',
    buttonText: 'Verify email address',
    outro: 'If you didn’t create an account, you can ignore this email.',
  },
  dashboardWelcome: {
    title: 'Your account is ready',
    preheader: 'Open your dashboard to get started.',
    intro:
      'Welcome aboard. Your dashboard is where you can get started and manage your account.',
    buttonText: 'Go to dashboard',
  },
};

function accountTemplate(preset, options) {
  if (!isRecord(options))
    throw new TypeError('account template options must be an object');
  const {
    link,
    recipient,
    subject = preset.title,
    preheader = preset.preheader,
    intro = preset.intro,
    outro = preset.outro,
    buttonText = preset.buttonText,
  } = options;
  if (!safeUrl(link, true)) {
    throw new TypeError(
      'account template link must be an absolute HTTP(S) URL',
    );
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new TypeError('account template recipient must be a string');
  }

  const paragraphs = recipient
    ? [`Hi ${recipient},`, ...[intro].flat()]
    : intro;
  return {
    subject,
    preheader,
    body: {
      greeting: preset.title,
      intro: paragraphs,
      actions: [{ button: { text: buttonText, link, align: 'center' } }],
      outro,
    },
  };
}

module.exports = Object.fromEntries(
  Object.entries(copy).map(([name, preset]) => [
    name,
    (options) => accountTemplate(preset, options),
  ]),
);
