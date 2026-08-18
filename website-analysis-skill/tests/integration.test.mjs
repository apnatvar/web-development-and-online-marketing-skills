import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { runAudit } from '../scripts/lib/orchestrator.mjs';
import { validateAuditReport } from '../scripts/validate-findings.mjs';
import { startFixtureServer } from './helpers/fixture-server.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(testsRoot);
const fixtureRoot = path.join(testsRoot, 'fixtures', 'local-site');
const publicRoot = path.join(fixtureRoot, 'public');
const intent = JSON.parse(await readFile(path.join(testsRoot, 'fixtures', 'intent.json'), 'utf8'));

test('complete local repository copy audit generates valid HTML without technical modules', async () => {
  const output = await mkdtemp(path.join(tmpdir(), 'website-auditor-local-'));
  const result = await runAudit({
    skillRoot, mode: 'copy', inputType: 'local', input: fixtureRoot, outputDirectory: output,
    outputFormat: 'html', selectedPages: ['/', '/services', '/contact'], intent, lighthouse: false,
    now: new Date('2026-07-22T12:00:00Z'),
  });
  assert.equal(result.report.intent.websitePurpose, intent.websitePurpose);
  assert.deepEqual(result.report.reproducibility.modules, ['copy and messaging', 'seo knowledge metadata']);
  assert.equal(result.report.lighthouse.length, 0);
  const validation = await validateAuditReport(result.report, output);
  assert.deepEqual(validation.errors, []);
  assert.match(await readFile(result.reportPath, 'utf8'), /Copy Audit|Copy audit/i);
});

test('technical local repository inspection records file guidance and explicit Lighthouse omission', async () => {
  const output = await mkdtemp(path.join(tmpdir(), 'website-auditor-technical-'));
  const result = await runAudit({
    skillRoot, mode: 'technical', inputType: 'local', input: fixtureRoot, outputDirectory: output,
    outputFormat: 'markdown', selectedPages: ['/'], lighthouse: false, now: new Date('2026-07-22T12:00:00Z'),
  });
  assert.equal(result.report.intent, null);
  assert.ok(result.report.findings.some((item) => item.implementationGuidance.includes('public/index.html')));
  assert.ok(result.report.limitations.some((item) => /Lighthouse was explicitly disabled/.test(item)));
  assert.deepEqual((await validateAuditReport(result.report, output)).errors, []);
});

test('public website copy audit remains useful without source access', async (t) => {
  const server = await startFixtureServer(publicRoot);
  t.after(() => server.close());
  const output = await mkdtemp(path.join(tmpdir(), 'website-auditor-public-'));
  const result = await runAudit({
    skillRoot, mode: 'copy', inputType: 'public-url', input: `${server.origin}/`, outputDirectory: output,
    outputFormat: 'markdown', selectedPages: [`${server.origin}/`, `${server.origin}/services`], intent, lighthouse: false,
    now: new Date('2026-07-22T12:00:00Z'),
  });
  assert.ok(result.report.findings.length > 0);
  assert.ok(result.report.findings.every((item) => item.repositoryAccessRequired));
  assert.ok(result.report.limitations.some((item) => /cannot prove the exact source file/.test(item)));
  assert.deepEqual((await validateAuditReport(result.report, output)).errors, []);
});
