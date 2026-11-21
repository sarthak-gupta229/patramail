'use strict';

const { safeUrl } = require('./escape');
const { styles } = require('./events');
const { validColor } = require('./themes');
const { columnNames, validWidth } = require('./sections/table');

function isRecord(value) {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validate(email, defaults = {}) {
  const errors = [];
  const warnings = [];
  const development = process.env.NODE_ENV !== 'production';

  function object(value, path, keys) {
    if (!isRecord(value)) {
      errors.push(`${path} must be an object`);
      return false;
    }
    if (development && keys) {
      for (const key of Object.keys(value)) {
        if (!keys.includes(key)) warnings.push(`Unknown field ${path}.${key}`);
      }
    }
    return true;
  }

  function string(value, path, required = false) {
    if (value === undefined && !required) return;
    if (typeof value !== 'string' || (required && !value.trim())) {
      errors.push(
        `${path} must be ${required ? 'a non-empty string' : 'a string'}`,
      );
    }
  }

  function link(value, path, required = false, image = false) {
    if (value === undefined && !required) return;
    if (!safeUrl(value, image))
      errors.push(
        `${path} must be an absolute ${image ? 'HTTP(S)' : 'HTTP(S), mailto, or tel'} URL`,
      );
  }

  function array(value, path, check) {
    if (!Array.isArray(value)) {
      errors.push(`${path} must be an array`);
      return;
    }
    for (let index = 0; index < value.length; index += 1) {
      check(value[index], `${path}[${index}]`);
    }
  }

  function checkProduct(value, path) {
    if (!object(value, path, ['name', 'link', 'logo', 'copyright'])) return;
    string(value.name, `${path}.name`, Boolean(safeUrl(value.logo, true)));
    string(value.copyright, `${path}.copyright`);
    link(value.link, `${path}.link`);
    link(value.logo, `${path}.logo`, false, true);
  }

  function checkLink(value, path, button = false) {
    if (
      !object(
        value,
        path,
        button ? ['text', 'link', 'color', 'align'] : ['text', 'link'],
      )
    )
      return;
    if (button && value.color !== undefined && !validColor(value.color)) {
      errors.push(`${path}.color must be a three- or six-digit hex color`);
    }
    if (
      button &&
      value.align !== undefined &&
      !['left', 'center'].includes(value.align)
    ) {
      errors.push(`${path}.align must be "left" or "center"`);
    }
    string(value.text, `${path}.text`, true);
    link(value.link, `${path}.link`, true);
  }

  function checkRow(value, path) {
    if (!object(value, path)) return;
    for (const [key, cell] of Object.entries(value)) {
      if (typeof cell !== 'string' && !Number.isFinite(cell)) {
        errors.push(`${path}.${key} must be a string or finite number`);
      }
    }
  }

  function checkTable(value, path) {
    if (!object(value, path, ['data', 'columns', 'total'])) return;
    array(value.data, `${path}.data`, checkRow);
    const keys = columnNames(
      Array.isArray(value.data) ? value.data.filter(isRecord) : [],
    );
    if (value.total !== undefined) {
      checkRow(value.total, `${path}.total`);
      if (!keys.length)
        errors.push(
          `${path}.total requires a data row with at least one column`,
        );
      if (development && isRecord(value.total)) {
        for (const key of Object.keys(value.total)) {
          if (!keys.includes(key))
            warnings.push(`Unknown column ${path}.total.${key}`);
        }
      }
    }
    if (
      value.columns !== undefined &&
      object(value.columns, `${path}.columns`, ['customWidth']) &&
      value.columns.customWidth !== undefined &&
      object(value.columns.customWidth, `${path}.columns.customWidth`)
    ) {
      for (const [key, width] of Object.entries(value.columns.customWidth)) {
        const field = `${path}.columns.customWidth.${key}`;
        if (!validWidth(width))
          errors.push(`${field} must be 1–100% or 1–999px`);
        if (development && !keys.includes(key))
          warnings.push(`Unknown column ${field}`);
      }
    }
  }

  function checkBody(value) {
    if (
      !object(value, 'email.body', [
        'greeting',
        'name',
        'intro',
        'event',
        'actions',
        'table',
        'unsafeHtml',
        'outro',
        'signature',
      ])
    )
      return;
    for (const key of ['greeting', 'name', 'signature', 'unsafeHtml']) {
      string(value[key], `email.body.${key}`);
    }
    for (const field of ['intro', 'outro']) {
      const path = `email.body.${field}`;
      if (Array.isArray(value[field])) {
        array(value[field], path, (line, itemPath) => {
          if (typeof line !== 'string')
            errors.push(`${itemPath} must be a string`);
        });
      } else {
        string(value[field], path);
      }
    }
    if (
      value.event !== undefined &&
      object(value.event, 'email.body.event', [
        'kind',
        'title',
        'date',
        'location',
      ])
    ) {
      if (
        typeof value.event.kind !== 'string' ||
        !Object.hasOwn(styles, value.event.kind)
      ) {
        errors.push('email.body.event.kind must be a supported event template');
      }
      string(value.event.title, 'email.body.event.title', true);
      string(value.event.date, 'email.body.event.date');
      string(value.event.location, 'email.body.event.location');
    }
    if (value.actions !== undefined) {
      array(value.actions, 'email.body.actions', (action, path) => {
        if (!object(action, path, ['instructions', 'button'])) return;
        string(action.instructions, `${path}.instructions`);
        if (action.button !== undefined)
          checkLink(action.button, `${path}.button`, true);
      });
    }
    if (value.table !== undefined) checkTable(value.table, 'email.body.table');
  }

  if (
    object(email, 'email', [
      'product',
      'subject',
      'preheader',
      'body',
      'footer',
    ])
  ) {
    if (email.product === undefined || isRecord(email.product)) {
      checkProduct({ ...defaults, ...email.product }, 'email.product');
    } else {
      object(email.product, 'email.product');
    }
    string(email.subject, 'email.subject');
    if (typeof email.subject === 'string' && [...email.subject].length > 78) {
      warnings.push('email.subject is longer than 78 characters');
    }
    string(email.preheader, 'email.preheader');
    if (email.body !== undefined) checkBody(email.body);
    if (
      email.footer !== undefined &&
      object(email.footer, 'email.footer', ['text', 'links', 'address'])
    ) {
      string(email.footer.text, 'email.footer.text');
      string(email.footer.address, 'email.footer.address');
      if (email.footer.links !== undefined)
        array(email.footer.links, 'email.footer.links', checkLink);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = { validate, isRecord };
