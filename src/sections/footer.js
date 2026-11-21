'use strict';

const { escape, safeUrl } = require('../escape');

module.exports = function footer(data, product, theme, isEvent) {
  const links = (data.links ?? []).flatMap(({ text, link }) => {
    const url = safeUrl(link);
    return text && url
      ? [
          `<a class="pm-brand" href="${escape(url)}" style="color:${theme.brand};text-decoration:underline;">${escape(text)}</a>`,
        ]
      : [];
  });

  const content = [
    escape(data.text),
    links.join(' &middot; '),
    escape(data.address),
    escape(product.copyright),
  ]
    .filter(Boolean)
    .map((value) => `<p style="margin:0 0 8px;">${value}</p>`)
    .join('');

  const cell = isEvent
    ? `class="pm-event-footer pm-event-inset" style="padding:16px 32px;border-top:1px solid ${theme.eventRule};font-size:13px;"`
    : 'align="center" style="padding:16px 24px;font-size:13px;"';
  return content ? `<tr><td ${cell}>${content}</td></tr>` : '';
};
