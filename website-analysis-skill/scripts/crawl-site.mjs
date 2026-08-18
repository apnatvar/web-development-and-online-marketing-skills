#!/usr/bin/env node
import { parseArgs } from './lib/args.mjs';
import { discoverPublicPages, proposePublicPages } from './lib/public-site.mjs';

const args = parseArgs(process.argv.slice(2));
const url = args.url ?? args._[0];
if (!url) throw new Error('Usage: node scripts/crawl-site.mjs --url https://example.com');
const discovery = await discoverPublicPages(url);
console.log(JSON.stringify({ ...discovery, proposedPages: proposePublicPages(discovery) }, null, 2));
