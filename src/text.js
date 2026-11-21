'use strict';

const { columnNames } = require('./sections/table');
const label = require('./i18n');

function tableLines(table) {
  if (!table?.data?.length) return [];
  const columns = columnNames(table.data);
  const formatRow = (row) =>
    columns
      .filter((key) => Object.hasOwn(row, key))
      .map((key) => `${key}: ${row[key]}`)
      .join(' | ');

  return [...table.data, ...(table.total ? [table.total] : [])]
    .map(formatRow)
    .filter(Boolean);
}

module.exports = function text(email, lang) {
  const { product = {}, body = {}, footer = {} } = email;
  const brand = [product.name, product.link].filter(Boolean).join(' — ');
  const greeting = [
    body.greeting ?? (body.name ? label(lang, 'greeting') : ''),
    body.name,
  ]
    .filter(Boolean)
    .join(' ');
  const actions = (body.actions ?? []).map(({ instructions, button }) => {
    const label = instructions || button?.text;
    return button?.link
      ? [label, button.link].filter(Boolean).join(': ')
      : label;
  });
  const links = (footer.links ?? []).map(
    ({ text, link }) => `${text}: ${link}`,
  );

  return [
    brand,
    greeting,
    ...[body.intro ?? []].flat(),
    ...actions,
    tableLines(body.table).join('\n'),
    body.outro,
    body.signature,
    footer.text,
    links.join('\n'),
    footer.address,
    product.copyright,
  ]
    .filter(Boolean)
    .join('\n\n');
};
