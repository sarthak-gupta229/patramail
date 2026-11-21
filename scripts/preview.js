'use strict';

const { mkdirSync, readdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const PatraMail = require('..');

const root = path.resolve(__dirname, '..');
const exampleDirectory = path.join(root, 'examples');
const previewDirectory = path.join(root, 'preview');
const mailer = new PatraMail();

mkdirSync(previewDirectory, { recursive: true });
for (const file of readdirSync(exampleDirectory).sort()) {
  if (!file.endsWith('.js')) continue;
  const email = require(path.join(exampleDirectory, file));
  const output = path.join(
    previewDirectory,
    path.basename(file, '.js') + '.html',
  );
  writeFileSync(output, mailer.generateHtml(email));
  console.log(path.relative(root, output));
}
