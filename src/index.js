'use strict';

const render = require('./render');
const { escape } = require('./escape');

class PatraMail {
  constructor(options = {}) {
    this.product = { ...options.product };
    this.lang = options.lang ?? 'en';
  }

  generateHtml(email) {
    return render(
      { ...email, product: { ...this.product, ...email.product } },
      undefined,
      this.lang,
    );
  }
}

module.exports = PatraMail;
module.exports.PatraMail = PatraMail;
module.exports.escape = escape;
