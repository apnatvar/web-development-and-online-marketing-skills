#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkTools, requiredToolFailures } from './lib/tools.mjs';
import { parseArgs, booleanArg } from './lib/args.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(scriptDirectory);
const args = parseArgs(process.argv.slice(2));
const capabilities = checkTools(skillRoot);
const failures = requiredToolFailures(capabilities, {
  needsLighthouse: booleanArg(args.lighthouse),
  needsNetwork: booleanArg(args.publicUrl),
});

console.log(JSON.stringify({ capabilities, failures }, null, 2));
if (failures.some((failure) => !failure.startsWith('Confirm '))) process.exitCode = 2;
