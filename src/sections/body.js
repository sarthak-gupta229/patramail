'use strict';

const { escape } = require('../escape');
const actions = require('./actions');
const event = require('./event');
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
    ? `<h1 class="pm-heading" style="margin:0 0 16px;color:${theme.heading};font-size:24px;line-height:1.3;">${escape(salutation)}</h1>`
    : '';
  const intro = [data.intro ?? []].flat().map(paragraph).join('');
  const content =
    greeting +
    intro +
    event(data.event, Boolean(greeting)) +
    actions(data.actions ?? [], theme) +
    table(data.table, theme, label(lang, 'table')) +
    (data.unsafeHtml ?? '') +
    [data.outro ?? []].flat().map(paragraph).join('') +
    paragraph(data.signature);

  return content
    ? `<tr><td style="padding:24px 24px 8px;">${content}</td></tr>`
    : '';
};
