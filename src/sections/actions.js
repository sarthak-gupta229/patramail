'use strict';

const { escape, safeUrl } = require('../escape');

module.exports = function actions(items, theme) {
  return items
    .map(({ instructions, button }) => {
      const link = safeUrl(button?.link);
      const instruction = instructions
        ? `<p style="margin:0 0 12px;">${escape(instructions)}</p>`
        : '';
      const control =
        link && button.text
          ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;"><tr><td class="pm-button" bgcolor="${theme.brand}" style="background-color:${theme.brand};border-radius:${theme.radius};mso-padding-alt:12px 22px;"><a class="pm-button-link" href="${escape(link)}" style="display:inline-block;padding:12px 22px;color:${theme.buttonText};font-weight:bold;text-decoration:underline;mso-padding-alt:0;">${escape(button.text)}</a></td></tr></table>`
          : '';

      return instruction + control;
    })
    .join('');
};
