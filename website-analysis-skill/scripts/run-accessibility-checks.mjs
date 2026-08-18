#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { inspectHtml } from './lib/html.mjs';
import { technicalFindingsForPage } from './lib/technical.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.file) throw new Error('Usage: node scripts/run-accessibility-checks.mjs --file page.html');
const inspection = inspectHtml(await readFile(args.file, 'utf8'), { sourcePath: args.file });
const page = { file: args.file, route: args.route ?? '/', sourceType: 'local repository', inspection };
const findings = technicalFindingsForPage(page).filter((item) => ['accessibility', 'semantic HTML', 'mobile usability'].includes(item.category));
console.log(JSON.stringify({ findings, limitation: 'Static checks are partial. Run Lighthouse/Axe plus manual keyboard, screen-reader, zoom, and focus testing.' }, null, 2));
