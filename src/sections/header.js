'use strict';

const { escape, safeUrl } = require('../escape');

module.exports = function header(product, theme, isEvent) {
  const logo = safeUrl(product.logo, true);
  const link = safeUrl(product.link);
  const name = escape(product.name);
  if (!logo && !name) return '';

  const content = logo
    ? `<img src="${escape(logo)}" alt="${name}" width="160" height="48" style="border:0;display:inline-block;width:160px;height:48px;object-fit:contain;">`
    : name;
  const color = isEvent ? theme.heading : theme.brand;
  const colorClass = isEvent ? 'pm-heading' : 'pm-brand';
  const brand = link
    ? `<a class="${colorClass}" href="${escape(link)}" style="color:${color};text-decoration:underline;">${content}</a>`
    : content;

  if (isEvent) {
    return `<tr><td class="pm-heading pm-event-inset" style="padding:16px 32px;color:${color};font-size:15px;font-weight:bold;overflow-wrap:anywhere;">${brand}</td></tr>`;
  }

  return `<tr><td class="pm-brand" align="center" style="padding:24px 24px 0;color:${theme.brand};font-size:24px;font-weight:bold;">${brand}</td></tr>`;
};
