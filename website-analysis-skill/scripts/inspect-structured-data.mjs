#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { inspectHtml } from './lib/html.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.file) throw new Error('Usage: node scripts/inspect-structured-data.mjs --file page.html');
const result = inspectHtml(await readFile(args.file, 'utf8'), { sourcePath: args.file, url: args.url });
console.log(JSON.stringify({ jsonLd: result.jsonLd, note: 'JSON parsing does not prove eligibility. Validate the page against current Google rich-result documentation and schema.org.' }, null, 2));
