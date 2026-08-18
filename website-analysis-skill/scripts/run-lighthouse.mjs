#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/args.mjs';
import { runLighthouseForUrl } from './lib/lighthouse.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(scriptDirectory);
const args = parseArgs(process.argv.slice(2));
const url = args.url ?? args._[0];
if (!url) throw new Error('Usage: node scripts/run-lighthouse.mjs --url https://example.com [--output audit-results] [--runs 3]');
const result = await runLighthouseForUrl({
  skillRoot,
  url,
  outputRoot: path.resolve(args.output ?? 'audit-results'),
  numberOfRuns: Number(args.runs ?? 3),
});
console.log(JSON.stringify(result, null, 2));
