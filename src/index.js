'use strict';

const render = require('./render');
const text = require('./text');
const { escape } = require('./escape');
const { themes, resolveTheme } = require('./themes');

class PatraMail {
  constructor(options = {}) {
    this.product = { ...options.product };
    this.lang = options.lang ?? 'en';
    this.theme = resolveTheme(options.theme);
  }

  #prepare(email) {
    return { ...email, product: { ...this.product, ...email.product } };
  }

  generate(email) {
    const input = this.#prepare(email);
    return {
      html: render(input, this.theme, this.lang),
      text: text(input),
      subject: input.subject,
      preheader: input.preheader,
    };
  }

  generateHtml(email) {
    return render(this.#prepare(email), this.theme, this.lang);
  }

  generatePlainText(email) {
    return text(this.#prepare(email));
  }
}

module.exports = PatraMail;
module.exports.PatraMail = PatraMail;
module.exports.escape = escape;
module.exports.themes = themes;
