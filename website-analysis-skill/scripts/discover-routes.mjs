#!/usr/bin/env node
import { parseArgs } from './lib/args.mjs';
import { discoverRoutes, proposeRoutes } from './lib/repository.mjs';

const args = parseArgs(process.argv.slice(2));
const root = args.repository ?? args._[0] ?? process.cwd();
const discovery = await discoverRoutes(root);
console.log(JSON.stringify({ ...discovery, proposedPages: proposeRoutes(discovery.routes) }, null, 2));
