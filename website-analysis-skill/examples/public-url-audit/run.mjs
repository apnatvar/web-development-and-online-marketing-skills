import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { runAudit } from '../../scripts/lib/orchestrator.mjs';

const exampleRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(path.dirname(exampleRoot));
const intent = JSON.parse(await readFile(path.join(skillRoot, 'tests', 'fixtures', 'example-com-intent.json'), 'utf8'));
const result = await runAudit({
  skillRoot,
  mode: 'combined',
  inputType: 'public-url',
  input: 'https://example.com/',
  outputDirectory: path.join(exampleRoot, 'audit-results'),
  outputFormat: 'markdown',
  selectedPages: ['https://example.com/'],
  intent,
  lighthouse: true,
  allowPartial: false,
  buildMode: 'deployed public URL',
});
console.log(JSON.stringify({ reportPath: result.reportPath, findings: result.report.findings.length }, null, 2));
