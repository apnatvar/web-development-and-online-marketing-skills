#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/args.mjs';
import { calculateMedianLighthouse } from './lib/lighthouse.mjs';
import { exists } from './lib/fs-utils.mjs';

const REQUIRED_FINDING_FIELDS = [
  'id', 'title', 'category', 'affectedPage', 'evidence', 'evidenceSource', 'severity', 'confidence',
  'userImpact', 'seoImpact', 'technicalExplanation', 'plainLanguageExplanation', 'recommendedFix',
  'implementationGuidance', 'expectedResult', 'verificationMethod', 'repositoryAccessRequired',
  'effort', 'priorityGroup', 'changeType', 'measurementClass',
];
const SEVERITY = new Set(['critical', 'high', 'medium', 'low', 'informational']);
const CONFIDENCE = new Set(['confirmed', 'likely', 'possible']);
const PRIORITY = new Set(['fix first', 'fix next', 'improve later', 'monitor']);
const PLACEHOLDER = /\bTODO\b|\{\{[^}]+\}\}|\[PLACEHOLDER\]|<placeholder>/i;

function compareNumber(actual, expected, label, errors) {
  if (actual === null && expected === null) return;
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || Math.abs(actual - expected) > 1e-9) errors.push(`${label}: expected median ${expected}, found ${actual}.`);
}

export async function validateAuditReport(report, outputRoot) {
  const errors = [];
  const warnings = [];
  if (!['technical', 'copy', 'combined'].includes(report.mode)) errors.push('Report mode is invalid.');
  if (['copy', 'combined'].includes(report.mode) && !report.intent) errors.push('Copy/combined report is missing website intent.');
  if (report.mode === 'technical' && report.intent) errors.push('Technical-only report should not contain collected website intent.');
  if (!report.seoKnowledge?.lastVerified) errors.push('SEO knowledge verification date is missing.');
  if (!report.auditDate || Number.isNaN(new Date(report.auditDate).valueOf())) errors.push('Audit date is missing or invalid.');
  if (!Array.isArray(report.pages) || report.pages.length === 0) errors.push('No tested pages are recorded.');
  if (!Array.isArray(report.findings)) errors.push('Findings must be an array.');

  const ids = new Set();
  const duplicateKeys = new Set();
  for (const [index, finding] of (report.findings ?? []).entries()) {
    for (const field of REQUIRED_FINDING_FIELDS) {
      if (finding[field] === undefined || finding[field] === null || (typeof finding[field] === 'string' && !finding[field].trim())) errors.push(`Finding ${index + 1} is missing ${field}.`);
    }
    if (!SEVERITY.has(finding.severity)) errors.push(`Finding ${finding.id} has invalid severity.`);
    if (!CONFIDENCE.has(finding.confidence)) errors.push(`Finding ${finding.id} has invalid confidence.`);
    if (!PRIORITY.has(finding.priorityGroup)) errors.push(`Finding ${finding.id} has invalid priority group.`);
    if (ids.has(finding.id)) errors.push(`Duplicate finding id: ${finding.id}`);
    ids.add(finding.id);
    const duplicateKey = `${finding.title}|${finding.affectedPage}`.toLowerCase();
    if (duplicateKeys.has(duplicateKey)) errors.push(`Duplicate unmerged finding: ${finding.title} on ${finding.affectedPage}`);
    duplicateKeys.add(duplicateKey);
    if (PLACEHOLDER.test(JSON.stringify(finding))) errors.push(`Finding ${finding.id} contains an unresolved placeholder.`);
    if (report.input?.type === 'public-url' && ['code change', 'configuration change', 'structural fix'].includes(finding.changeType) && !finding.repositoryAccessRequired) {
      errors.push(`Public finding ${finding.id} claims implementation guidance without requiring repository access.`);
    }
    if (report.input?.type === 'public-url' && /edit\s+[^.]+\.(?:js|jsx|ts|tsx|vue|svelte|astro):?\d*/i.test(finding.implementationGuidance)) {
      errors.push(`Public finding ${finding.id} claims an unverified exact source path.`);
    }
  }
  // Related IDs can include pre-merge finding identities that are intentionally
  // absent from the final list. The merged finding must carry their evidence,
  // but referential presence is not required.

  if (report.input?.type === 'local') {
    for (const page of report.pages ?? []) {
      if (!page.source || /^https?:/i.test(page.source)) continue;
      const target = path.resolve(report.input.target, page.source);
      if (!(await exists(target))) errors.push(`Recorded local page path does not exist: ${target}`);
    }
  }
  for (const item of report.lighthouse ?? []) {
    if (item.summary?.aggregation !== 'median' || item.summary?.runs < 2) errors.push(`Lighthouse summary for ${item.summary?.url} is not a multi-run median.`);
    const rawFiles = item.rawResultPaths ?? [];
    if (rawFiles.length !== item.summary.runs) errors.push(`Lighthouse raw run count mismatch for ${item.summary?.url}.`);
    const absoluteRaw = rawFiles.map((file) => path.resolve(outputRoot, file));
    for (const file of [...absoluteRaw, path.resolve(outputRoot, item.medianPath)]) if (!(await exists(file))) errors.push(`Missing Lighthouse artifact: ${file}`);
    if (absoluteRaw.every((file) => file) && (await Promise.all(absoluteRaw.map(exists))).every(Boolean)) {
      const lhrs = await Promise.all(absoluteRaw.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
      const recalculated = calculateMedianLighthouse(lhrs);
      for (const [id, category] of Object.entries(recalculated.categories)) compareNumber(item.summary.categories?.[id]?.scorePercent, category.scorePercent, `${item.summary.url} category ${id}`, errors);
      for (const [id, audit] of Object.entries(recalculated.audits)) compareNumber(item.summary.audits?.[id]?.numericValue, audit.numericValue, `${item.summary.url} audit ${id}`, errors);
    }
  }

  const markdownPath = path.join(outputRoot, 'reports', 'audit.md');
  const htmlPath = path.join(outputRoot, 'reports', 'audit.html');
  if (!(await exists(markdownPath)) && !(await exists(htmlPath))) errors.push('Neither reports/audit.md nor reports/audit.html exists.');
  if (await exists(markdownPath)) {
    const markdown = await readFile(markdownPath, 'utf8');
    for (const finding of report.findings ?? []) if (!markdown.includes(`id="${finding.id}"`)) errors.push(`Markdown anchor missing for ${finding.id}.`);
    if (PLACEHOLDER.test(markdown)) errors.push('Markdown report contains an unresolved placeholder.');
  }
  if (await exists(htmlPath)) {
    const html = await readFile(htmlPath, 'utf8');
    for (const finding of report.findings ?? []) {
      if (!html.includes(`id="${finding.id}"`)) errors.push(`HTML issue anchor missing for ${finding.id}.`);
      if (!html.includes(`href="#evidence-${finding.id}"`)) errors.push(`HTML evidence link missing for ${finding.id}.`);
    }
    if (!/<meta name="viewport"/i.test(html) || !/<main\b/i.test(html)) errors.push('HTML report is missing local responsive/semantic structure.');
    if (PLACEHOLDER.test(html)) errors.push('HTML report contains an unresolved placeholder.');
  }
  return { valid: errors.length === 0, errors, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error('Usage: node scripts/validate-findings.mjs --input audit-data.json --output-root audit-results');
  const inputPath = path.resolve(args.input);
  const outputRoot = path.resolve(args.outputRoot ?? path.dirname(path.dirname(inputPath)));
  const report = JSON.parse(await readFile(inputPath, 'utf8'));
  const result = await validateAuditReport(report, outputRoot);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 1;
}
