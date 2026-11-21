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
  const example = require(path.join(exampleDirectory, file));
  const entries = Array.isArray(example)
    ? example
    : [[path.basename(file, '.js'), example]];
  for (const [name, email] of entries) {
    const output = path.join(previewDirectory, name + '.html');
    writeFileSync(output, mailer.generateHtml(email));
    console.log(path.relative(root, output));
  }
}
