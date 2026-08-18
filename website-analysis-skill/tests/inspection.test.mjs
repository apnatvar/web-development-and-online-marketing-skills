import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { inspectHtml, parseRobots, parseSitemap } from '../scripts/lib/html.mjs';
import { discoverRoutes, inspectRepositoryPages } from '../scripts/lib/repository.mjs';
import { discoverPublicPages, inspectPublicPages, proposePublicPages } from '../scripts/lib/public-site.mjs';
import { inspectUntrustedContent, redactSensitive } from '../scripts/lib/security.mjs';
import { startFixtureServer } from './helpers/fixture-server.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(testsRoot, 'fixtures', 'local-site');
const publicRoot = path.join(fixtureRoot, 'public');

test('metadata and heading inspection extracts source evidence', async () => {
  const html = await readFile(path.join(publicRoot, 'services.html'), 'utf8');
  const result = inspectHtml(html, { sourcePath: 'public/services.html', url: 'https://lantern.invalid/services' });
  assert.match(result.title, /Catalogue website setup/);
  assert.match(result.metaDescription, /Accessible catalogue/);
  assert.equal(result.canonical, 'https://lantern.invalid/services');
  assert.deepEqual(result.headings.map((item) => item.level), [1, 2, 2]);
  assert.ok(result.ctas.some((cta) => cta.text === 'Book an introductory call'));
  assert.equal(result.language, 'en');
});

test('local route discovery finds static routes and representative pages', async () => {
  const discovery = await discoverRoutes(fixtureRoot);
  const routes = discovery.routes.map((item) => item.route);
  assert.ok(routes.includes('/'));
  assert.ok(routes.includes('/services'));
  assert.ok(routes.includes('/contact'));
  assert.ok(routes.includes('/blog/lorem'));
});

test('local repository inspection returns file-level pages', async () => {
  const result = await inspectRepositoryPages(fixtureRoot, ['/', '/services']);
  assert.equal(result.pages.length, 2);
  assert.ok(result.pages.every((page) => page.file.startsWith('public/')));
  assert.equal(result.pages.find((page) => page.route === '/').inspection.security.promptInjectionDetected, true);
});

test('sitemap and robots parsers discover public directives', () => {
  assert.deepEqual(parseSitemap('<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/a</loc></url></urlset>'), ['https://example.test/', 'https://example.test/a']);
  const robots = parseRobots('User-agent: *\nDisallow: /private\nSitemap: https://example.test/sitemap.xml');
  assert.equal(robots.groups[0].rules[0].path, '/private');
  assert.equal(robots.sitemaps[0], 'https://example.test/sitemap.xml');
});

test('public website inspection uses sitemap and rendered response HTML', async (t) => {
  const server = await startFixtureServer(publicRoot);
  t.after(() => server.close());
  const discovery = await discoverPublicPages(`${server.origin}/`);
  assert.equal(discovery.robots.ok, true);
  assert.equal(discovery.sitemap.urls.length, 3);
  assert.ok(proposePublicPages(discovery).some((item) => item.url.endsWith('/services')));
  const inspected = await inspectPublicPages(`${server.origin}/`, [`${server.origin}/services`]);
  assert.equal(inspected.pages[0].status, 200);
  assert.match(inspected.pages[0].inspection.title, /Catalogue website/);
});

test('prompt injection is detected but hidden commands are excluded from copy', async () => {
  const html = await readFile(path.join(publicRoot, 'index.html'), 'utf8');
  const result = inspectHtml(html);
  assert.equal(result.security.promptInjectionDetected, true);
  assert.doesNotMatch(result.visibleText, /Ignore previous instructions/i);
});

test('sensitive-data signatures are reported and redacted', () => {
  const sample = 'api_key="fictional-but-secret-shaped-123456789"';
  const scan = inspectUntrustedContent(sample);
  assert.deepEqual(scan.sensitiveTypes, ['credential-like assignment']);
  assert.doesNotMatch(redactSensitive(sample), /fictional-but-secret-shaped/);
  assert.match(redactSensitive(sample), /REDACTED/);
});
