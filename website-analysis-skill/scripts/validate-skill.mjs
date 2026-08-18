#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, readJson, walkFiles } from './lib/fs-utils.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(scriptDirectory);
const required = [
  'SKILL.md', 'README.md', 'agents/openai.yaml', 'package.json',
  'config/audit.defaults.json', 'config/lighthouse-baseline.json', 'config/lighthouse.config.cjs',
  'knowledge/seo/current-practices.md', 'knowledge/seo/sources.md', 'knowledge/seo/changelog.md', 'knowledge/seo/metadata.json',
  'schemas/audit-config.schema.json', 'schemas/website-intent.schema.json', 'schemas/finding.schema.json', 'schemas/report.schema.json',
  'scripts/audit.mjs', 'scripts/run-lighthouse.mjs', 'scripts/update-seo-knowledge.mjs', 'scripts/validate-findings.mjs',
  'workflows/select-mode.md', 'workflows/gather-intent.md', 'workflows/run-technical-audit.md', 'workflows/run-copy-audit.md', 'workflows/run-combined-audit.md',
  'templates/technical-report.md', 'templates/copy-report.md', 'templates/combined-report.md', 'templates/report.html',
];
const errors = [];
for (const relative of required) if (!(await exists(path.join(skillRoot, relative)))) errors.push(`Missing required file: ${relative}`);

const skill = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');
const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/i)?.[1] ?? '';
const frontmatterKeys = [...frontmatter.matchAll(/^([a-zA-Z0-9_-]+):/gm)].map((match) => match[1]);
if (frontmatterKeys.join(',') !== 'name,description') errors.push('SKILL.md frontmatter must contain only name and description.');
if (!/name:\s*website-tech-content-analysis/.test(frontmatter)) errors.push('SKILL.md name is invalid.');
if (!/Mandatory intake gate/.test(skill) || !/Do not inspect the site until the user selects an audit mode/.test(skill)) errors.push('Mode-selection gate is missing.');
if (!/Do not ask for website intent in technical-only mode/.test(skill)) errors.push('Technical intent isolation is missing.');

const baseline = await readJson(path.join(skillRoot, 'config', 'lighthouse-baseline.json'));
const metadata = await readJson(path.join(skillRoot, 'knowledge', 'seo', 'metadata.json'));
const packageJson = await readJson(path.join(skillRoot, 'package.json'));
if (packageJson.devDependencies?.lighthouse !== baseline.lighthouseVersion) errors.push('Pinned Lighthouse package and baseline version differ.');
if (baseline.numberOfRuns < 2 || baseline.aggregation !== 'median per category, audit score, and numeric metric') errors.push('Lighthouse multi-run median baseline is invalid.');
if (!metadata.lastVerified || !metadata.lastUpdated || !metadata.sourceUrls?.length) errors.push('SEO metadata timestamps or sources are missing.');
const sources = await readFile(path.join(skillRoot, 'knowledge', 'seo', 'sources.md'), 'utf8');
const changelog = await readFile(path.join(skillRoot, 'knowledge', 'seo', 'changelog.md'), 'utf8');
if (!sources.includes(metadata.lastVerified) || !changelog.includes(metadata.lastUpdated)) errors.push('SEO timestamps are not supported by source/changelog records.');

const files = await walkFiles(skillRoot, { maximumFileBytes: 10_000_000 });
for (const file of files) {
  if (file.includes(`${path.sep}node_modules${path.sep}`) || file.includes(`${path.sep}audit-results${path.sep}`)) continue;
  if (!/\.(?:md|mjs|json|yaml|html|cjs)$/i.test(file)) continue;
  const content = await readFile(file, 'utf8');
  if (/\[TODO(?::|\])/i.test(content) || /\{\{[^}]+\}\}/.test(content)) errors.push(`Unresolved placeholder in ${path.relative(skillRoot, file)}`);
}
console.log(JSON.stringify({ valid: errors.length === 0, errors, checkedFiles: files.length }, null, 2));
if (errors.length) process.exitCode = 1;
