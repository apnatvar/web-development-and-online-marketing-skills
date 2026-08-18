import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { inspectHtml } from '../scripts/lib/html.mjs';
import { analyseCopyPage, ctaFindings, intentMatchRatio } from '../scripts/lib/copy.mjs';
import { technicalFindingsForPage } from '../scripts/lib/technical.mjs';
import { mergeCombinedAudit, synthesizeCombinedFindings } from '../scripts/lib/combined.mjs';
import { makeFinding, prioritizeFindings } from '../scripts/lib/findings.mjs';
import { renderHtml, renderMarkdown } from '../scripts/lib/report.mjs';
import { compareAudits } from '../scripts/lib/comparison.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(testsRoot, 'fixtures', 'local-site', 'public');
const intent = JSON.parse(await readFile(path.join(testsRoot, 'fixtures', 'intent.json'), 'utf8'));

async function fixturePage(name = 'index.html') {
  const html = await readFile(path.join(publicRoot, name), 'utf8');
  return { route: name === 'index.html' ? '/' : `/${name.replace('.html', '')}`, file: `public/${name}`, sourceType: 'local repository', inspection: inspectHtml(html, { sourcePath: `public/${name}` }) };
}

test('heading analysis produces actionable semantic finding', async () => {
  const findings = technicalFindingsForPage(await fixturePage());
  const heading = findings.find((item) => item.tags?.includes('heading'));
  assert.ok(heading);
  assert.match(heading.implementationGuidance, /public\/index.html/);
  assert.match(heading.verificationMethod, /heading|accessibility/i);
});

test('CTA analysis compares wording with desired action', async () => {
  const page = await fixturePage();
  const findings = ctaFindings(page, intent);
  assert.ok(findings.some((item) => /CTA wording|action prompt/i.test(item.title)));
});

test('copy-intent comparison finds weak and strong alignment', async () => {
  assert.ok(intentMatchRatio('Catalogue website setup for independent shops', intent.primaryProductOrService) > 0.5);
  const weak = analyseCopyPage(await fixturePage(), intent);
  assert.ok(weak.some((item) => item.category === 'value proposition'));
  const strong = analyseCopyPage(await fixturePage('services.html'), intent);
  assert.equal(strong.some((item) => item.title.includes('website purpose')), false);
});

test('combined audit synthesizes rather than concatenating related issues', async () => {
  const page = await fixturePage();
  const technical = technicalFindingsForPage(page);
  const copy = analyseCopyPage(page, intent);
  const synthesized = synthesizeCombinedFindings(technical, copy);
  assert.ok(synthesized.some((item) => item.category.includes('combined')));
  const merged = mergeCombinedAudit(technical, copy);
  const related = new Set(synthesized.flatMap((item) => item.relatedFindingIds));
  assert.equal(merged.some((item) => related.has(item.id)), false);
});

test('finding prioritisation considers confidence, effort, and impact', () => {
  const high = makeFinding({ title: 'Blocking issue', category: 'crawl', affectedPage: '/', evidence: 'HTTP 500', evidenceSource: 'HTTP', severity: 'critical', confidence: 'confirmed', userImpact: 'Users are blocked.', seoImpact: 'Crawling is blocked.', conversionImpact: 'Conversion is blocked.', technicalExplanation: 'Server error.', plainLanguageExplanation: 'Page is down.', recommendedFix: 'Restore service.', implementationGuidance: 'Inspect server logs.', expectedResult: 'HTTP 200.', verificationMethod: 'Fetch page.', repositoryAccessRequired: true, effort: 'medium', changeType: 'configuration change', measurementClass: 'relatively stable' });
  const possible = makeFinding({ title: 'Possible tweak', category: 'copy', affectedPage: '/', evidence: 'Heuristic', evidenceSource: 'Heuristic', severity: 'medium', confidence: 'possible', userImpact: 'May confuse.', seoImpact: 'Unknown.', conversionImpact: 'Unknown.', technicalExplanation: 'Possible.', plainLanguageExplanation: 'Maybe.', recommendedFix: 'Review.', implementationGuidance: 'Ask users.', expectedResult: 'Evidence.', verificationMethod: 'User test.', repositoryAccessRequired: false, effort: 'large', changeType: 'monitoring', measurementClass: 'relatively stable' });
  const ranked = prioritizeFindings([possible, high]);
  assert.equal(ranked.findings[0].title, 'Blocking issue');
  assert.equal(ranked.findings.at(-1).priorityGroup, 'monitor');
});

function reportFixture(findings) {
  return {
    reportVersion: '1.0.0', auditDate: '2026-07-22T00:00:00.000Z', mode: 'combined', input: { type: 'local', target: 'fictional' }, intent,
    pages: [{ label: '/', source: 'public/index.html', status: null }], summary: 'Fictional audit summary.', findings,
    lighthouse: [], seoKnowledge: { lastVerified: '2026-07-22', ageDays: 0, status: 'fresh', knowledgeVersion: '2026.07.22', warning: null }, limitations: ['Fictional fixture only.'],
    reproducibility: { modules: ['technical', 'copy'], buildMode: 'source inspection', repositoryCommit: null, lighthouseBaseline: { lighthouseVersion: '13.4.1', chromeVersion: '150', deviceProfile: 'standard-mobile', numberOfRuns: 3, throttlingMethod: 'simulate' }, nodeVersion: '22', lighthouseVersions: [], chromeVersions: [], pageSelection: 'selected', medianRule: 'median', rawResultPaths: [] },
  };
}

test('Markdown and local HTML generation include complete evidence and links', async () => {
  const findings = prioritizeFindings(technicalFindingsForPage(await fixturePage()).slice(0, 2)).findings;
  const report = reportFixture(findings);
  const markdown = renderMarkdown(report);
  const html = renderHtml(report);
  assert.match(markdown, /Recommended fix/);
  assert.match(markdown, /SEO knowledge status/);
  assert.match(html, /<details class="finding/);
  assert.match(html, new RegExp(`href="#evidence-${findings[0].id}"`));
  assert.match(html, /<meta name="viewport"/);
});

test('before-and-after comparison reports new, resolved, and score changes', () => {
  const oldFinding = makeFinding({ title: 'Old issue', category: 'test', affectedPage: '/', evidence: 'old', evidenceSource: 'test', severity: 'low', confidence: 'confirmed', userImpact: 'Small.', seoImpact: 'Small.', technicalExplanation: 'Old.', plainLanguageExplanation: 'Old.', recommendedFix: 'Fix.', implementationGuidance: 'Fix.', expectedResult: 'Fixed.', verificationMethod: 'Test.', repositoryAccessRequired: false, effort: 'small', changeType: 'quick win', measurementClass: 'deterministic' });
  const newFinding = { ...oldFinding, title: 'New issue', id: 'new-issue' };
  const base = { mode: 'technical', findings: [oldFinding], lighthouse: [], reproducibility: { lighthouseBaseline: { version: 1 }, chromeVersions: [] } };
  const comparison = compareAudits(base, { ...base, findings: [newFinding] });
  assert.equal(comparison.newFindings.length, 1);
  assert.equal(comparison.resolvedFindings.length, 1);
});
