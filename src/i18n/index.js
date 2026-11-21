'use strict';

const en = require('./en');
const locales = new Map([['en', en]]);

function label(lang, key) {
  return (
    locales.get(lang)?.[key] ??
    locales.get(lang.split('-')[0])?.[key] ??
    en[key]
  );
}

module.exports = label;
