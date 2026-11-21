'use strict';

const { escape } = require('./escape');
const header = require('./sections/header');
const body = require('./sections/body');
const footer = require('./sections/footer');

const defaultTheme = {
  bg: '#f3f4f6',
  card: '#ffffff',
  text: '#212936',
  heading: '#111827',
  brand: '#1746a2',
  font: 'Arial, Helvetica, sans-serif',
  radius: '6px',
  buttonText: '#ffffff',
};

module.exports = function render(email, theme = defaultTheme, lang = 'en') {
  const product = email.product ?? {};
  const rows =
    header(product, theme) +
    body(email.body ?? {}, theme) +
    footer(email.footer ?? {}, product, theme);
  const card = rows
    ? `<!--[if mso]><table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
    <table role="presentation" class="pm-card" align="center" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="${theme.card}" style="width:100%;max-width:600px;background-color:${theme.card};color:${theme.text};border-radius:${theme.radius};font-family:${theme.font};font-size:16px;line-height:1.5;">
      ${rows}
    </table>
    <!--[if mso]></td></tr></table><![endif]-->`
    : '';

  return `<!doctype html>
<html lang="${escape(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(email.subject ?? product.name)}</title>
<style>
@media only screen and (max-width: 620px) {
  .pm-card { width: 100% !important; }
  .pm-outer { padding: 12px !important; }
}
</style>
</head>
<body class="pm-bg" style="margin:0;padding:0;background-color:${theme.bg};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${theme.bg}" class="pm-bg" style="background-color:${theme.bg};">
<tr><td align="center" class="pm-outer" style="padding:24px;">
    ${card}
</td></tr>
</table>
</body>
</html>
`;
};
