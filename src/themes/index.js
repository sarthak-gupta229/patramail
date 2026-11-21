'use strict';

const themes = Object.freeze({
  default: require('./default'),
  dark: require('./dark'),
});

function resolveTheme(selection = 'default') {
  if (typeof selection === 'string' && Object.hasOwn(themes, selection)) {
    return themes[selection];
  }
  if (!selection || typeof selection !== 'object' || Array.isArray(selection)) {
    throw new TypeError('theme must be "default", "dark", or a theme object');
  }

  const theme = { ...themes.default };
  for (const key of Object.keys(theme)) {
    if (Object.hasOwn(selection, key)) theme[key] = selection[key];
  }

  for (const key of ['bg', 'card', 'text', 'heading', 'brand']) {
    if (
      typeof theme[key] !== 'string' ||
      !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(theme[key])
    ) {
      throw new TypeError(
        `theme.${key} must be a three- or six-digit hex color`,
      );
    }
  }
  if (
    typeof theme.font !== 'string' ||
    !/^[a-z][a-z0-9-]*(?: [a-z0-9-]+)*(?: *, *[a-z][a-z0-9-]*(?: [a-z0-9-]+)*)*$/i.test(
      theme.font,
    )
  ) {
    throw new TypeError(
      'theme.font must be a comma-separated list of unquoted font names',
    );
  }
  if (typeof theme.radius !== 'string' || !/^\d{1,3}px$/.test(theme.radius)) {
    throw new TypeError(
      'theme.radius must be a pixel length from 0px to 999px',
    );
  }

  return Object.freeze(theme);
}

function buttonText(brand) {
  const hex = brand.slice(1);
  const digits =
    hex.length === 3 ? [...hex].map((digit) => digit.repeat(2)).join('') : hex;
  const channels = digits.match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [red, green, blue] = channels;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 0.1791287847 ? '#000000' : '#ffffff';
}

module.exports = { themes, resolveTheme, buttonText };
