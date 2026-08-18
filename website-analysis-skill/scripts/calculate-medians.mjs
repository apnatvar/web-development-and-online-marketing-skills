#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { calculateMedianLighthouse } from './lib/lighthouse.mjs';
import { writeJson } from './lib/fs-utils.mjs';

const args = parseArgs(process.argv.slice(2));
const files = [...args._, ...(args.files ? String(args.files).split(',') : [])];
if (files.length < 2) throw new Error('Provide at least two Lighthouse JSON files.');
const results = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
const summary = calculateMedianLighthouse(results, { rawResultPaths: files });
if (args.output) await writeJson(args.output, summary);
else console.log(JSON.stringify(summary, null, 2));
