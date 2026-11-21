'use strict';

const render = require('./render');
const { escape } = require('./escape');
const { themes, resolveTheme } = require('./themes');

class PatraMail {
  constructor(options = {}) {
    this.product = { ...options.product };
    this.lang = options.lang ?? 'en';
    this.theme = resolveTheme(options.theme);
  }

  generateHtml(email) {
    return render(
      { ...email, product: { ...this.product, ...email.product } },
      this.theme,
      this.lang,
    );
  }
}

module.exports = PatraMail;
module.exports.PatraMail = PatraMail;
module.exports.escape = escape;
module.exports.themes = themes;
