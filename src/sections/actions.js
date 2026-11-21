'use strict';

const { escape, safeUrl } = require('../escape');
const { buttonText } = require('../themes');

module.exports = function actions(items, theme) {
  return items
    .map(({ instructions, button }) => {
      const link = safeUrl(button?.link);
      const instruction = instructions
        ? `<p style="margin:0 0 12px;">${escape(instructions)}</p>`
        : '';
      const background = button?.color ?? theme.brand;
      const foreground = button?.color
        ? buttonText(background)
        : theme.buttonText;
      const cellClass = button?.color ? '' : ' class="pm-button"';
      const linkClass = button?.color ? '' : ' class="pm-button-link"';
      const layout =
        button?.align === 'center'
          ? 'align="center" style="margin:0 auto 16px;"'
          : 'style="margin:0 0 16px;"';
      const control =
        link && button.text
          ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" ${layout}><tr><td${cellClass} bgcolor="${background}" style="background-color:${background};border-radius:${theme.radius};mso-padding-alt:12px 22px;"><a${linkClass} href="${escape(link)}" style="display:inline-block;padding:12px 22px;color:${foreground};font-weight:bold;text-decoration:underline;mso-padding-alt:0;">${escape(button.text)}</a></td></tr></table>`
          : '';

      return instruction + control;
    })
    .join('');
};
