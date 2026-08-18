#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { renderHtml } from './lib/report.mjs';
import { writeText } from './lib/fs-utils.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.output) throw new Error('Usage: node scripts/generate-html-report.mjs --input audit-data.json --output audit.html');
const report = JSON.parse(await readFile(args.input, 'utf8'));
await writeText(args.output, renderHtml(report));
