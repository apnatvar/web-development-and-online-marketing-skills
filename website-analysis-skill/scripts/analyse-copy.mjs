#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { inspectHtml } from './lib/html.mjs';
import { analyseCopyPage, validateIntent } from './lib/copy.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.file || !args.intent) throw new Error('Usage: node scripts/analyse-copy.mjs --file page.html --intent intent.json');
const intent = JSON.parse(await readFile(args.intent, 'utf8'));
const errors = validateIntent(intent);
if (errors.length) throw new Error(errors.join('\n'));
const html = await readFile(args.file, 'utf8');
const page = { file: args.file, route: args.route ?? '/', sourceType: 'local repository', inspection: inspectHtml(html, { sourcePath: args.file }) };
console.log(JSON.stringify(analyseCopyPage(page, intent), null, 2));
