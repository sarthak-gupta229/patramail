'use strict';

const { escape } = require('../escape');
const { styles } = require('../events');

module.exports = function event(data, theme) {
  if (!data) return '';

  const { label } = styles[data.kind];
  const entries = [
    ['When', data.date],
    ['Where', data.location],
  ].filter(([, value]) => value);
  const detail = ([label, value]) =>
    `<td class="pm-event-detail" valign="top" width="${entries.length === 2 ? '50%' : '100%'}" style="padding:0 16px 0 0;overflow-wrap:anywhere;font-size:15px;line-height:1.5;">
      <strong class="pm-heading" style="color:${theme.heading};">${label}</strong><br>${escape(value)}
    </td>`;
  const details = entries.length
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;table-layout:fixed;">
      <tr><td class="pm-event-details" style="padding-top:16px;border-top:1px solid ${theme.eventRule};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;"><tr>${entries.map(detail).join('')}</tr></table>
      </td></tr>
    </table>`
    : '';

  return `<tr><td class="pm-event-hero pm-event-inset" bgcolor="${theme.eventSurface}" style="padding:28px 32px;border-top:1px solid ${theme.eventRule};border-bottom:1px solid ${theme.eventRule};background-color:${theme.eventSurface};color:${theme.text};overflow-wrap:anywhere;">
    <p class="pm-brand" style="margin:0 0 10px;color:${theme.brand};font-size:12px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;">${label}</p>
    <h1 class="pm-event-title pm-heading" style="margin:0;color:${theme.heading};font-family:Georgia, Times New Roman, serif;font-size:44px;font-weight:normal;line-height:1.12;">${escape(data.title)}</h1>
    ${details}
  </td></tr>`;
};
