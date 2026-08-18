import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { modulesForMode, runAudit } from '../scripts/lib/orchestrator.mjs';
import { validateIntent } from '../scripts/lib/copy.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(testsRoot);
const fixtureRoot = path.join(testsRoot, 'fixtures', 'local-site');

test('mode selection routes only approved modules', () => {
  assert.deepEqual(modulesForMode('technical'), ['technical', 'seo knowledge metadata', 'lighthouse']);
  assert.deepEqual(modulesForMode('copy'), ['copy and messaging', 'seo knowledge metadata']);
  assert.ok(modulesForMode('combined').includes('combined synthesis'));
  assert.throws(() => modulesForMode('unknown'), /technical, copy, or combined/);
});

test('technical-only context isolation excludes copy and intent', () => {
  const modules = modulesForMode('technical');
  assert.equal(modules.some((item) => item.includes('copy')), false);
  assert.equal(modules.some((item) => item.includes('intent')), false);
});

test('copy-only context isolation excludes Lighthouse and technical modules', () => {
  const modules = modulesForMode('copy');
  assert.equal(modules.some((item) => /lighthouse|technical/i.test(item)), false);
});

test('intent collection requires all copy fields', async () => {
  const valid = JSON.parse(await readFile(path.join(testsRoot, 'fixtures', 'intent.json'), 'utf8'));
  assert.deepEqual(validateIntent(valid), []);
  const invalid = { ...valid, desiredVisitorAction: '', priorityPages: [] };
  assert.ok(validateIntent(invalid).some((error) => error.includes('desiredVisitorAction')));
  assert.ok(validateIntent(invalid).some((error) => error.includes('priorityPages')));
});

test('copy audit rejects missing intent before analysis', async () => {
  await assert.rejects(runAudit({
    skillRoot, mode: 'copy', inputType: 'local', input: fixtureRoot,
    outputDirectory: path.join(testsRoot, '.never-written'), outputFormat: 'markdown',
    selectedPages: ['/'], lighthouse: false,
  }), /require complete website intent/i);
});

test('analysis requires selected or approved pages', async () => {
  await assert.rejects(runAudit({
    skillRoot, mode: 'technical', inputType: 'local', input: fixtureRoot,
    outputDirectory: path.join(testsRoot, '.never-written'), outputFormat: 'markdown',
    lighthouse: false,
  }), /Select pages before analysis/);
});
