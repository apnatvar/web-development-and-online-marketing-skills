import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { runAudit } from '../../scripts/lib/orchestrator.mjs';
import { startFixtureServer } from '../../tests/helpers/fixture-server.mjs';

const exampleRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(path.dirname(exampleRoot));
const fixtureRoot = path.join(skillRoot, 'tests', 'fixtures', 'local-site');
const publicRoot = path.join(fixtureRoot, 'public');
const intent = JSON.parse(await readFile(path.join(skillRoot, 'tests', 'fixtures', 'intent.json'), 'utf8'));
const server = await startFixtureServer(publicRoot);
try {
  const result = await runAudit({
    skillRoot,
    mode: 'combined',
    inputType: 'local',
    input: fixtureRoot,
    outputDirectory: path.join(exampleRoot, 'audit-results'),
    outputFormat: 'html',
    selectedPages: ['/', '/services', '/contact'],
    intent,
    baseUrl: server.origin,
    lighthouse: true,
    allowPartial: false,
    buildMode: 'fictional static fixture served by the example runner',
  });
  console.log(JSON.stringify({ reportPath: result.reportPath, findings: result.report.findings.length }, null, 2));
} finally {
  await server.close();
}
