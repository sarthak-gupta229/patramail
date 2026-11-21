'use strict';

const render = require('./render');
const { templates: eventTemplates } = require('./events');
const accountTemplates = require('./account-templates');
const text = require('./text');
const { escape } = require('./escape');
const { themes, resolveTheme } = require('./themes');
const { validate, isRecord } = require('./validate');

class PatraMail {
  constructor(options = {}) {
    if (!isRecord(options)) throw new TypeError('options must be an object');
    if (options.product !== undefined && !isRecord(options.product)) {
      throw new TypeError('options.product must be an object');
    }
    if (options.lang !== undefined && typeof options.lang !== 'string') {
      throw new TypeError('options.lang must be a language tag');
    }
    this.lang = Intl.getCanonicalLocales(options.lang ?? 'en')[0];
    this.product = Object.freeze({ ...options.product });
    this.theme = resolveTheme(options.theme);
  }

  validate(email) {
    return validate(email, this.product);
  }

  #prepare(email) {
    const result = this.validate(email);
    if (!result.valid) throw new TypeError(result.errors.join('\n'));
    if (result.warnings.length) {
      process.emitWarning(result.warnings.join('\n'), {
        code: 'PATRAMAIL_INPUT',
      });
    }
    return { ...email, product: { ...this.product, ...email.product } };
  }

  generate(email) {
    const input = this.#prepare(email);
    return {
      html: render(input, this.theme, this.lang),
      text: text(input, this.lang),
      subject: input.subject,
      preheader: input.preheader,
    };
  }

  generateHtml(email) {
    return render(this.#prepare(email), this.theme, this.lang);
  }

  generatePlainText(email) {
    return text(this.#prepare(email), this.lang);
  }
}

const Mailgen = require('./mailgen')(PatraMail);

module.exports = Mailgen;
module.exports.PatraMail = PatraMail;
module.exports.escape = escape;
module.exports.themes = themes;
module.exports.templates = Object.freeze({
  ...eventTemplates,
  ...accountTemplates,
});
module.exports.Mailgen = Mailgen;
