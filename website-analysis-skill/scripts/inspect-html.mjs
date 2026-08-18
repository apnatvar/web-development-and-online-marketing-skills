#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { inspectHtml } from './lib/html.mjs';

const args = parseArgs(process.argv.slice(2));
const file = args.file ?? args._[0];
if (!file) throw new Error('Usage: node scripts/inspect-html.mjs --file page.html [--url https://example.com/page]');
console.log(JSON.stringify(inspectHtml(await readFile(file, 'utf8'), { url: args.url, sourcePath: file }), null, 2));
