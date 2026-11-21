'use strict';

const { escape } = require('./escape');
const header = require('./sections/header');
const event = require('./sections/event');
const { eventTheme } = require('./events');
const body = require('./sections/body');
const footer = require('./sections/footer');
const label = require('./i18n');

const { themes, buttonText } = require('./themes');

module.exports = function render(email, selectedTheme, lang) {
  const automaticDark = selectedTheme === themes.default;
  const explicitDark = selectedTheme === themes.dark;
  const eventData = email.body?.event;
  const mode = automaticDark ? 'light' : explicitDark ? 'dark' : 'custom';
  const theme = eventData
    ? eventTheme(selectedTheme, eventData.kind, mode)
    : selectedTheme;
  const dark = eventData
    ? eventTheme(themes.dark, eventData.kind, 'dark')
    : themes.dark;
  const scheme = automaticDark ? 'light dark' : explicitDark ? 'dark' : 'light';
  const eventMobile = eventData
    ? `
  .pm-event-inset { padding-left: 22px !important; padding-right: 22px !important; }
  .pm-event-hero { padding-top: 22px !important; padding-bottom: 22px !important; }
  .pm-event-title { font-size: 36px !important; }
  .pm-event-detail { display: block !important; width: 100% !important; padding: 0 0 8px !important; }`
    : '';
  const eventDark = eventData
    ? `
  .pm-event-hero { background-color: ${dark.eventSurface} !important; border-color: ${dark.eventRule} !important; color: ${dark.text} !important; }
  .pm-event-details, .pm-event-footer { border-color: ${dark.eventRule} !important; }`
    : '';
  const darkStyles = automaticDark
    ? `
@media (prefers-color-scheme: dark) {
  .pm-bg { background-color: ${dark.bg} !important; }
  .pm-card { background-color: ${dark.card} !important; color: ${dark.text} !important; }
  .pm-heading { color: ${dark.heading} !important; }
  .pm-brand { color: ${dark.brand} !important; }
  .pm-button { background-color: ${dark.brand} !important; }
  .pm-button-link { color: ${buttonText(dark.brand)} !important; }${eventDark}
}`
    : '';
  const preheader = email.preheader
    ? `<div aria-hidden="true" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(email.preheader)}</div>`
    : '';
  const product = email.product ?? {};
  const rows =
    header(product, theme, Boolean(eventData)) +
    event(eventData, theme) +
    body(
      email.body ?? {},
      { ...theme, buttonText: buttonText(theme.brand) },
      lang,
    ) +
    footer(email.footer ?? {}, product, theme, Boolean(eventData));
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
  .pm-data-table { min-width: 400px !important; }${eventMobile}
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
