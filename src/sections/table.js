'use strict';

const { escape } = require('../escape');

const validWidth = (value) =>
  typeof value === 'string' &&
  /^(?:[1-9]\d?|100)%$|^[1-9]\d{0,2}px$/.test(value);

function columnNames(rows) {
  return [...new Set(rows.flatMap(Object.keys))];
}

function table(data, theme, label) {
  if (!data?.data?.length) return '';
  const columns = columnNames(data.data);
  if (!columns.length) return '';

  const cellStyle =
    'padding:8px;border-bottom:1px solid currentColor;overflow-wrap:anywhere;';
  const headers = columns.map((key) => {
    const width = data.columns?.customWidth?.[key];
    const size = validWidth(width) ? `width:${width};` : '';
    return `<th scope="col" class="pm-heading" style="text-align:left;box-sizing:border-box;${cellStyle}${size}color:${theme.heading};">${escape(key)}</th>`;
  });
  const row = (values, total = false) =>
    `<tr>${columns
      .map((key, index) => {
        const tag = total && index === 0 ? 'th' : 'td';
        const scope = tag === 'th' ? ' scope="row"' : '';
        const value = Object.hasOwn(values, key) ? values[key] : '';
        const emphasis = total ? 'font-weight:bold;text-align:left;' : '';
        return `<${tag}${scope} style="${cellStyle}${emphasis}">${escape(value)}</${tag}>`;
      })
      .join('')}</tr>`;

  return `<div class="pm-table-scroll" role="region" aria-label="${escape(label)}" tabindex="0" style="max-width:100%;overflow-x:auto;margin:0 0 16px;"><table class="pm-data-table" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;"><thead><tr>${headers.join('')}</tr></thead><tbody>${data.data.map((values) => row(values)).join('')}</tbody>${data.total ? `<tfoot>${row(data.total, true)}</tfoot>` : ''}</table></div>`;
}

module.exports = { table, columnNames, validWidth };
