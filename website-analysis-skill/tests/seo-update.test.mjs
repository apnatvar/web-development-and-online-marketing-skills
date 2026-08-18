import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { knowledgeFreshness } from '../scripts/lib/knowledge.mjs';
import { replaceMarkdownSection, updateSeoKnowledge } from '../scripts/update-seo-knowledge.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(testsRoot);

test('stale SEO knowledge warnings follow configurable thresholds', () => {
  const metadata = { lastVerified: '2026-01-01', lastUpdated: '2026-01-01', knowledgeVersion: 'test' };
  const policy = { warningAfterDays: 90, criticalAfterDays: 180 };
  assert.equal(knowledgeFreshness(metadata, policy, new Date('2026-03-01T00:00:00Z')).status, 'fresh');
  assert.equal(knowledgeFreshness(metadata, policy, new Date('2026-05-01T00:00:00Z')).status, 'warning');
  assert.equal(knowledgeFreshness(metadata, policy, new Date('2026-08-01T00:00:00Z')).status, 'critical');
});

test('SEO section updater changes only the selected section', () => {
  const before = '# Guide\n\n## One\n\nOld one.\n\n## Two\n\nKeep two.\n';
  const after = replaceMarkdownSection(before, '## One', 'New one.');
  assert.match(after, /## One\n\nNew one/);
  assert.match(after, /## Two\n\nKeep two/);
});

test('SEO update workflow records source review, timestamp, changelog, backup, and diff', async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'website-auditor-seo-'));
  await cp(path.join(skillRoot, 'knowledge'), path.join(temporary, 'knowledge'), { recursive: true });
  const manifest = {
    reviewedAt: '2026-07-23T10:00:00Z', knowledgeChanged: true, knowledgeVersion: '2026.07.23-test',
    sources: [{ url: 'https://developers.google.com/search/docs/essentials', title: 'Search Essentials', reviewedAt: '2026-07-23', status: 'reviewed', notes: 'Fixture review.' }],
    changes: [{ heading: '## Optional recommendations', content: '- Add optional features only when they serve a verified site need.' }],
    unverifiedRecommendations: ['Fictional vendor claim was not verified.'],
  };
  const result = await updateSeoKnowledge({ skillRoot: temporary, manifest });
  const metadata = JSON.parse(await readFile(path.join(temporary, 'knowledge', 'seo', 'metadata.json'), 'utf8'));
  const changelog = await readFile(path.join(temporary, 'knowledge', 'seo', 'changelog.md'), 'utf8');
  const sources = await readFile(path.join(temporary, 'knowledge', 'seo', 'sources.md'), 'utf8');
  assert.equal(metadata.lastVerified, '2026-07-23');
  assert.equal(metadata.knowledgeVersion, '2026.07.23-test');
  assert.match(changelog, /2026.07.23-test/);
  assert.match(sources, /Fixture review/);
  assert.match(await readFile(result.diffPath, 'utf8'), /Optional recommendations/);
  assert.match(await readFile(path.join(result.historyRoot, 'metadata.json'), 'utf8'), /2026.07.22/);
});

test('timestamp-only SEO updates are rejected', async () => {
  await assert.rejects(updateSeoKnowledge({
    skillRoot,
    manifest: { reviewedAt: '2026-07-23T10:00:00Z', timestampOnly: true, knowledgeChanged: false, changes: [], sources: [{ url: 'https://developers.google.com/search/docs/essentials', reviewedAt: '2026-07-23', status: 'reviewed' }] },
    dryRun: true,
  }), /Timestamp-only updates are prohibited/);
});
