'use strict';

const { escape } = require('./escape');
const header = require('./sections/header');
const body = require('./sections/body');
const footer = require('./sections/footer');
const label = require('./i18n');

const { themes, buttonText } = require('./themes');

module.exports = function render(email, theme, lang) {
  const automaticDark = theme === themes.default;
  const scheme = automaticDark
    ? 'light dark'
    : theme === themes.dark
      ? 'dark'
      : 'light';
  const dark = themes.dark;
  const darkStyles = automaticDark
    ? `
@media (prefers-color-scheme: dark) {
  .pm-bg { background-color: ${dark.bg} !important; }
  .pm-card { background-color: ${dark.card} !important; color: ${dark.text} !important; }
  .pm-heading { color: ${dark.heading} !important; }
  .pm-brand { color: ${dark.brand} !important; }
  .pm-button { background-color: ${dark.brand} !important; }
  .pm-button-link { color: ${buttonText(dark.brand)} !important; }
}`
    : '';
  const preheader = email.preheader
    ? `<div aria-hidden="true" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(email.preheader)}</div>`
    : '';
  const product = email.product ?? {};
  const rows =
    header(product, theme) +
    body(
      email.body ?? {},
      { ...theme, buttonText: buttonText(theme.brand) },
      lang,
    ) +
    footer(email.footer ?? {}, product, theme);
  const card = rows
    ? `<!--[if mso]><table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
    <table role="presentation" class="pm-card" align="center" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="${theme.card}" style="width:100%;max-width:600px;table-layout:fixed;background-color:${theme.card};color:${theme.text};border-radius:${theme.radius};font-family:${theme.font};font-size:16px;line-height:1.5;">
      ${rows}
    </table>
    <!--[if mso]></td></tr></table><![endif]-->`
    : '';

  return `<!doctype html>
<html lang="${escape(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="${scheme}">
<meta name="supported-color-schemes" content="${scheme}">
<title>${escape(email.subject ?? (product.name || label(lang, 'title')))}</title>
<style>
@media only screen and (max-width: 620px) {
  .pm-card { width: 100% !important; }
  .pm-outer { padding: 12px !important; }
  .pm-table-scroll { overflow-x: auto !important; }
  .pm-data-table { min-width: 400px !important; }
}${darkStyles}
</style>
</head>
<body class="pm-bg" style="margin:0;padding:0;background-color:${theme.bg};">
${preheader}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${theme.bg}" class="pm-bg" style="background-color:${theme.bg};">
<tr><td align="center" class="pm-outer" style="padding:24px;">
    ${card}
</td></tr>
</table>
</body>
</html>
`;
};
