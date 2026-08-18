#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from './lib/args.mjs';
import { inspectHtml } from './lib/html.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.file) throw new Error('Usage: node scripts/inspect-metadata.mjs --file page.html');
const result = inspectHtml(await readFile(args.file, 'utf8'), { sourcePath: args.file, url: args.url });
console.log(JSON.stringify({ title: result.title, titleCount: result.titleCount, metaDescription: result.metaDescription, metaRobots: result.metaRobots, canonical: result.canonical, canonicalCount: result.canonicalCount, viewport: result.viewport, language: result.language, alternateLanguages: result.alternateLanguages }, null, 2));
