'use strict';

const entities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escape(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) => entities[character],
  );
}

function safeUrl(value, image = false) {
  if (typeof value !== 'string' || /[\s\u0000-\u001f\u007f]/u.test(value)) {
    return '';
  }

  const url = parseUrl(value);
  if (!url) return '';
  if (url.protocol === 'https:' || url.protocol === 'http:') {
    return /^https?:\/\/[^/\\?#]+/i.test(value) &&
      !value.includes('\\') &&
      url.hostname
      ? value
      : '';
  }
  return !image &&
    (url.protocol === 'mailto:' || url.protocol === 'tel:') &&
    url.pathname
    ? value
    : '';
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

module.exports = { escape, safeUrl };
