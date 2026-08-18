#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { booleanArg, listArg, parseArgs } from './lib/args.mjs';
import { proposePages, runAudit } from './lib/orchestrator.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(scriptDirectory);
const args = parseArgs(process.argv.slice(2));

if (args.proposePages) {
  const result = await proposePages({ inputType: args.inputType, input: args.input, skillRoot });
  console.log(JSON.stringify({ proposed: result.proposed, discoveryErrors: result.discovery.errors ?? [] }, null, 2));
} else {
  const required = ['mode', 'inputType', 'input'];
  const missing = required.filter((key) => !args[key]);
  if (missing.length) throw new Error(`Missing required option(s): ${missing.map((item) => `--${item.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`).join(', ')}`);
  const outputDirectory = path.resolve(args.output ?? 'audit-results');
  const result = await runAudit({
    skillRoot,
    mode: args.mode,
    inputType: args.inputType,
    input: args.input,
    outputDirectory,
    outputFormat: args.format ?? 'markdown',
    selectedPages: listArg(args.pages),
    approveDefaultPages: booleanArg(args.approveDefaultPages),
    intentPath: args.intent,
    baseUrl: args.baseUrl,
    lighthouse: booleanArg(args.lighthouse, args.mode !== 'copy'),
    allowPartial: booleanArg(args.allowPartial),
    buildMode: args.buildMode,
  });
  console.log(JSON.stringify({ reportPath: result.reportPath, findings: result.report.findings.length, outputDirectory }, null, 2));
}
