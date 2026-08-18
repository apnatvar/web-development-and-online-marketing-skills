#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startFixtureServer } from '../tests/helpers/fixture-server.mjs';

const skillRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(skillRoot, 'tests', 'fixtures', 'local-site', 'public');
const server = await startFixtureServer(root);
console.log(`Fictional fixture server: ${server.origin}`);
console.log('Press Ctrl+C to stop.');
process.on('SIGINT', async () => { await server.close(); process.exit(0); });
await new Promise(() => {});
