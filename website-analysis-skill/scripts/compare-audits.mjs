#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { compareAudits, renderComparisonMarkdown } from './lib/comparison.mjs';
import { writeText } from './lib/fs-utils.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.previous || !args.current) throw new Error('Usage: node scripts/compare-audits.mjs --previous old/raw/audit-data.json --current new/raw/audit-data.json [--output comparison.md]');
const [previous, current] = await Promise.all([args.previous, args.current].map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
const comparison = compareAudits(previous, current);
const markdown = renderComparisonMarkdown(previous, current, comparison);
if (args.output) await writeText(args.output, markdown);
else console.log(markdown);
