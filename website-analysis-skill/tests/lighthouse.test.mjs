import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { calculateMedianLighthouse, classifyLighthouseAudit, findingsFromLighthouse, generateLighthouseInvocation, lighthouseArtifactSlug, median } from '../scripts/lib/lighthouse.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(testsRoot);
const require = createRequire(import.meta.url);

function lhr(performance, lcp, cls, version = '13.4.1') {
  return {
    requestedUrl: 'https://example.test/', finalDisplayedUrl: 'https://example.test/', lighthouseVersion: version,
    environment: { hostUserAgent: 'Mozilla/5.0 HeadlessChrome/150.0.7871.129', benchmarkIndex: performance * 10 },
    configSettings: { formFactor: 'mobile', throttlingMethod: 'simulate', screenEmulation: { width: 412, height: 823 }, throttling: { rttMs: 150, cpuSlowdownMultiplier: 4 } },
    categories: { performance: { title: 'Performance', score: performance }, accessibility: { title: 'Accessibility', score: 0.9 }, seo: { title: 'SEO', score: 1 }, 'best-practices': { title: 'Best Practices', score: 0.95 } },
    audits: {
      'largest-contentful-paint': { title: 'LCP', score: performance, numericValue: lcp, numericUnit: 'millisecond', displayValue: `${lcp} ms` },
      'cumulative-layout-shift': { title: 'CLS', score: cls <= 0.1 ? 1 : 0.5, numericValue: cls, numericUnit: 'unitless', displayValue: String(cls) },
      'document-title': { title: 'Document title', score: 1 },
    },
  };
}

test('median calculation handles odd and even samples', () => {
  assert.equal(median([9, 1, 5]), 5);
  assert.equal(median([1, 3]), 2);
});

test('multiple Lighthouse runs produce true medians', () => {
  const summary = calculateMedianLighthouse([lhr(0.4, 5000, 0.3), lhr(0.9, 2000, 0.05), lhr(0.7, 3200, 0.15)]);
  assert.equal(summary.categories.performance.scorePercent, 70);
  assert.equal(summary.audits['largest-contentful-paint'].numericValue, 3200);
  assert.equal(summary.audits['cumulative-layout-shift'].numericValue, 0.15);
  assert.equal(summary.runs, 3);
  assert.equal(summary.runtime.chromeVersion, '150.0.7871.129');
});

test('deterministic versus variable result classification is explicit', () => {
  assert.equal(classifyLighthouseAudit('document-title'), 'deterministic');
  assert.equal(classifyLighthouseAudit('largest-contentful-paint'), 'variable performance');
  assert.equal(classifyLighthouseAudit('cache-insight'), 'environment-dependent');
  assert.equal(classifyLighthouseAudit('color-contrast'), 'relatively stable');
});

test('standard Lighthouse command records exact config and categories', () => {
  const invocation = generateLighthouseInvocation({
    skillRoot, url: 'https://example.test/', outputPath: 'C:\\audit\\run.json',
    chromePath: 'C:\\Chrome\\chrome.exe', configPath: 'C:\\skill\\lighthouse.config.cjs',
    categories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  assert.equal(invocation.command, process.execPath);
  assert.ok(invocation.args.some((item) => item === '--only-categories=performance,accessibility,best-practices,seo'));
  assert.ok(invocation.args.some((item) => item.includes('lighthouse.config.cjs')));
  assert.ok(invocation.args.includes('--output=json'));
});

test('Lighthouse artifact names are stable across ephemeral local ports', () => {
  assert.equal(lighthouseArtifactSlug('http://127.0.0.1:4173/contact'), '127-0-0-1-contact');
  assert.equal(lighthouseArtifactSlug('http://127.0.0.1:64948/contact'), '127-0-0-1-contact');
  assert.equal(lighthouseArtifactSlug('http://127.0.0.1:4173/'), '127-0-0-1-homepage');
});

test('standard throttling configuration matches recorded baseline', async () => {
  const baseline = JSON.parse(await readFile(path.join(skillRoot, 'config', 'lighthouse-baseline.json'), 'utf8'));
  const config = require(path.join(skillRoot, 'config', 'lighthouse.config.cjs'));
  assert.equal(baseline.lighthouseVersion, '13.4.1');
  assert.equal(config.settings.throttlingMethod, baseline.throttlingMethod);
  assert.equal(config.settings.throttling.cpuSlowdownMultiplier, baseline.cpuSlowdownMultiplier);
  assert.equal(config.settings.screenEmulation.width, baseline.viewport.width);
  assert.equal(baseline.numberOfRuns, 3);
});

test('Lighthouse metric findings do not treat lab data as deterministic', () => {
  const summary = calculateMedianLighthouse([lhr(0.4, 5000, 0.3), lhr(0.7, 3200, 0.15), lhr(0.8, 3000, 0.12)]);
  const findings = findingsFromLighthouse(summary, { url: 'https://example.test/', sourceType: 'public URL' });
  assert.ok(findings.some((item) => item.tags.includes('largest-contentful-paint')));
  assert.ok(findings.filter((item) => item.category === 'Lighthouse performance').every((item) => item.measurementClass === 'variable performance'));
  assert.ok(findings.every((item) => item.repositoryAccessRequired));
});
