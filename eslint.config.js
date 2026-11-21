'use strict';

module.exports = [
  { ignores: ['preview/**', 'test/snapshots/**'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: Object.fromEntries(
        ['__dirname', 'console', 'process', 'URL', 'Intl'].map((name) => [
          name,
          'readonly',
        ]),
      ),
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      eqeqeq: 'error',
    },
  },
];
