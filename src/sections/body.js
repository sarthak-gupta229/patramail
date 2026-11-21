'use strict';

const { escape } = require('../escape');
const actions = require('./actions');
const { table } = require('./table');
const label = require('../i18n');

const paragraph = (value) =>
  value ? `<p style="margin:0 0 16px;">${escape(value)}</p>` : '';

module.exports = function body(data, theme, lang) {
  const salutation = [
    data.greeting ?? (data.name ? label(lang, 'greeting') : ''),
    data.name,
  ]
    .filter(Boolean)
    .join(' ');
  const greeting = salutation
    ? data.event
      ? `<p class="pm-heading" style="margin:0 0 8px;color:${theme.heading};font-weight:bold;">${escape(salutation)}</p>`
      : `<h1 class="pm-heading" style="margin:0 0 16px;color:${theme.heading};font-size:24px;line-height:1.3;">${escape(salutation)}</h1>`
    : '';
  const intro = [data.intro ?? []].flat().map(paragraph).join('');
  const content =
    greeting +
    intro +
    actions(data.actions ?? [], theme) +
    table(data.table, theme, label(lang, 'table')) +
    (data.unsafeHtml ?? '') +
    [data.outro ?? []].flat().map(paragraph).join('') +
    paragraph(data.signature);

  const cell = data.event
    ? 'class="pm-event-inset" style="padding:24px 32px 24px;overflow-wrap:anywhere;"'
    : 'style="padding:24px 24px 8px;"';
  return content ? `<tr><td ${cell}>${content}</td></tr>` : '';
};
