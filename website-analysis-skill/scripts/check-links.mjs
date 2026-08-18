#!/usr/bin/env node
import { parseArgs, listArg } from './lib/args.mjs';
import { inspectPublicPages } from './lib/public-site.mjs';
import { checkPublicLinks, findingsFromPublicLinks } from './lib/links.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.url) throw new Error('Usage: node scripts/check-links.mjs --url https://example.com [--pages url1,url2]');
const inspected = await inspectPublicPages(args.url, listArg(args.pages));
const result = await checkPublicLinks(inspected.pages, { maximumLinks: Number(args.maximum ?? 40) });
console.log(JSON.stringify({ ...result, findings: findingsFromPublicLinks(result) }, null, 2));
