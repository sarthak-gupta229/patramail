'use strict';

const { isRecord } = require('./validate');

function toPatraMail(email) {
  if (!isRecord(email) || !isRecord(email.body)) return email;
  const { action, actions, title, greeting, name, signature, ...rest } =
    email.body;
  const hideGreeting = greeting === false;
  const normalizedActions =
    action === undefined || Array.isArray(action) ? action : [action];
  return {
    ...email,
    body: {
      ...rest,
      greeting: hideGreeting ? undefined : (title ?? greeting),
      name: hideGreeting || title !== undefined ? undefined : name,
      signature: signature === false ? undefined : signature,
      actions: actions === undefined ? normalizedActions : actions,
    },
  };
}

module.exports = (PatraMail) =>
  class Mailgen {
    #mailer;

    constructor(options) {
      this.#mailer = new PatraMail(options);
    }

    generate(email) {
      return this.generateHtml(email);
    }

    generatePlaintext(email) {
      return this.generatePlainText(email);
    }

    generateHtml(email) {
      return this.#mailer.generateHtml(toPatraMail(email));
    }

    generatePlainText(email) {
      return this.#mailer.generatePlainText(toPatraMail(email));
    }

    validate(email) {
      return this.#mailer.validate(toPatraMail(email));
    }
  };
