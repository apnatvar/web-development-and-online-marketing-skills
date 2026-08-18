#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { renderMarkdown } from './lib/report.mjs';
import { writeText } from './lib/fs-utils.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.output) throw new Error('Usage: node scripts/generate-markdown-report.mjs --input audit-data.json --output audit.md');
const report = JSON.parse(await readFile(args.input, 'utf8'));
await writeText(args.output, renderMarkdown(report));
