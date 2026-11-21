'use strict';

const { escape } = require('../escape');
const { styles } = require('../events');

module.exports = function event(data, hasGreeting) {
  if (!data) return '';
  const { accent, background, label } = styles[data.kind];
  const heading = hasGreeting ? 'h2' : 'h1';
  const detail = (label, value) =>
    value
      ? `<p style="margin:8px 0 0;font-size:15px;"><strong>${label}</strong><br>${escape(value)}</p>`
      : '';

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;table-layout:fixed;">
<tr><td bgcolor="${background}" style="padding:20px;border-left:5px solid ${accent};border-radius:6px;background-color:${background};color:${accent};overflow-wrap:anywhere;">
<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${label}</p>
<${heading} style="margin:0;font-size:26px;line-height:1.2;">${escape(data.title)}</${heading}>
${detail('When', data.date)}${detail('Where', data.location)}
</td></tr></table>`;
};
