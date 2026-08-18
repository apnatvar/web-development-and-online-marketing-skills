#!/usr/bin/env node
import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, booleanArg } from './lib/args.mjs';
import { ensureDirectory, readJson, writeJson, writeText } from './lib/fs-utils.mjs';

const AUTHORITATIVE_HOSTS = new Set([
  'developers.google.com', 'developer.chrome.com', 'web.dev', 'schema.org', 'www.w3.org', 'w3.org', 'github.com', 'www.npmjs.com',
]);

function validateManifest(manifest) {
  const errors = [];
  if (!manifest.reviewedAt || Number.isNaN(new Date(manifest.reviewedAt).valueOf())) errors.push('reviewedAt must be an ISO date/time from a real source review.');
  if (!Array.isArray(manifest.sources) || manifest.sources.length === 0) errors.push('sources must list at least one source actually reviewed.');
  for (const source of manifest.sources ?? []) {
    try {
      const parsed = new URL(source.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) errors.push(`Unsupported source protocol: ${source.url}`);
    } catch {
      errors.push(`Invalid source URL: ${source.url}`);
    }
    if (source.status !== 'reviewed') errors.push(`Source must have status "reviewed": ${source.url}`);
    if (!source.reviewedAt) errors.push(`Source needs reviewedAt: ${source.url}`);
  }
  if (typeof manifest.knowledgeChanged !== 'boolean') errors.push('knowledgeChanged must be true or false.');
  if (manifest.knowledgeChanged && (!Array.isArray(manifest.changes) || manifest.changes.length === 0)) errors.push('Changed knowledge requires at least one section change.');
  if (!manifest.knowledgeChanged && (manifest.changes?.length ?? 0) > 0) errors.push('Set knowledgeChanged=true when section changes are supplied.');
  if (manifest.knowledgeChanged && !manifest.knowledgeVersion) errors.push('Changed knowledge requires a new knowledgeVersion.');
  if (manifest.timestampOnly === true) errors.push('Timestamp-only updates are prohibited. Record the authoritative sources actually reviewed.');
  return errors;
}

export function replaceMarkdownSection(document, heading, content) {
  const lines = document.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading.trim());
  if (start < 0) throw new Error(`Section heading was not found: ${heading}`);
  const level = heading.match(/^#+/)?.[0].length;
  if (!level) throw new Error(`Section change must target a Markdown heading: ${heading}`);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextLevel = lines[index].match(/^(#+)\s/)?.[1].length;
    if (nextLevel && nextLevel <= level) {
      end = index;
      break;
    }
  }
  const body = String(content ?? '').trim();
  if (!body) throw new Error(`Replacement content is empty: ${heading}`);
  if (/^#+\s/m.test(body.split(/\r?\n/)[0])) throw new Error(`Replacement content must omit the target heading: ${heading}`);
  return [...lines.slice(0, start), heading, '', body, '', ...lines.slice(end)].join('\n').replace(/\n{4,}/g, '\n\n\n');
}

export function simpleDiff(before, after, filename = 'current-practices.md') {
  if (before === after) return `--- a/${filename}\n+++ b/${filename}\n(no content changes)\n`;
  const oldLines = before.split(/\r?\n/);
  const newLines = after.split(/\r?\n/);
  return `--- a/${filename}\n+++ b/${filename}\n` + oldLines.map((line) => `-${line}`).join('\n') + '\n' + newLines.map((line) => `+${line}`).join('\n') + '\n';
}

export async function updateSeoKnowledge({ skillRoot, manifest, dryRun = false }) {
  const errors = validateManifest(manifest);
  if (errors.length) throw new Error(`Invalid SEO review manifest:\n- ${errors.join('\n- ')}`);
  const seoRoot = path.join(skillRoot, 'knowledge', 'seo');
  const currentPath = path.join(seoRoot, 'current-practices.md');
  const metadataPath = path.join(seoRoot, 'metadata.json');
  const sourcesPath = path.join(seoRoot, 'sources.md');
  const changelogPath = path.join(seoRoot, 'changelog.md');
  const [before, metadata, sourcesBefore, changelogBefore] = await Promise.all([
    readFile(currentPath, 'utf8'), readJson(metadataPath), readFile(sourcesPath, 'utf8'), readFile(changelogPath, 'utf8'),
  ]);
  let after = before;
  for (const change of manifest.changes ?? []) after = replaceMarkdownSection(after, change.heading, change.content);
  if (manifest.knowledgeChanged && before === after) throw new Error('Manifest says knowledge changed, but applying changes produced no content diff.');
  const reviewedDate = new Date(manifest.reviewedAt).toISOString().slice(0, 10);
  const changedSections = (manifest.changes ?? []).map((change) => change.heading);
  const sourceUrls = manifest.sources.map((source) => source.url);
  const externalSources = sourceUrls.filter((url) => !AUTHORITATIVE_HOSTS.has(new URL(url).hostname));
  const unverified = manifest.unverifiedRecommendations ?? [];
  const nextMetadata = {
    ...metadata,
    lastVerified: reviewedDate,
    lastUpdated: manifest.knowledgeChanged ? reviewedDate : metadata.lastUpdated,
    knowledgeVersion: manifest.knowledgeChanged ? manifest.knowledgeVersion : metadata.knowledgeVersion,
    sourceUrls: [...new Set([...metadata.sourceUrls, ...sourceUrls])],
    lastReview: {
      reviewedAt: new Date(manifest.reviewedAt).toISOString(),
      sourcesReviewed: sourceUrls.length,
      changedSections,
      unverifiedRecommendations: unverified,
      nonPreferredSourceHosts: externalSources,
    },
  };
  const sourceEntry = `\n### ${reviewedDate} — ${manifest.knowledgeChanged ? manifest.knowledgeVersion : 'verification only'}\n\n` +
    manifest.sources.map((source) => `- [${source.title ?? source.url}](${source.url}) — reviewed ${source.reviewedAt}; ${source.notes ?? 'no change noted'}`).join('\n') +
    (externalSources.length ? `\n- Caution: non-preferred source host(s) reviewed: ${externalSources.join(', ')}.` : '') +
    (unverified.length ? `\n- Could not verify: ${unverified.join('; ')}` : '') + '\n';
  const changeEntry = `\n## ${reviewedDate} — ${manifest.knowledgeChanged ? manifest.knowledgeVersion : 'verification only'}\n\n` +
    (manifest.knowledgeChanged ? changedSections.map((section) => `- Updated ${section}.`).join('\n') : '- Reviewed the listed authoritative sources; no stored guidance changed.') +
    `\n- Sources reviewed: ${sourceUrls.length}.` +
    (unverified.length ? `\n- Unverified: ${unverified.join('; ')}` : '\n- Unverified: none recorded.') + '\n';
  const diff = simpleDiff(before, after);
  if (dryRun) return { dryRun: true, reviewedDate, changedSections, diff, nextMetadata, warnings: externalSources.map((url) => `Non-preferred source: ${url}`) };

  const historyName = new Date(manifest.reviewedAt).toISOString().replace(/[:.]/g, '-');
  const historyRoot = await ensureDirectory(path.join(seoRoot, 'history', historyName));
  await Promise.all([
    copyFile(currentPath, path.join(historyRoot, 'current-practices.md')),
    copyFile(metadataPath, path.join(historyRoot, 'metadata.json')),
    copyFile(sourcesPath, path.join(historyRoot, 'sources.md')),
    copyFile(changelogPath, path.join(historyRoot, 'changelog.md')),
    writeText(path.join(historyRoot, 'changes.patch'), diff),
  ]);
  if (manifest.knowledgeChanged) await writeText(currentPath, after);
  await writeJson(metadataPath, nextMetadata);
  await writeText(sourcesPath, `${sourcesBefore.trimEnd()}\n${sourceEntry}`);
  await writeText(changelogPath, `${changelogBefore.trimEnd()}\n${changeEntry}`);
  return { dryRun: false, reviewedDate, changedSections, historyRoot, diffPath: path.join(historyRoot, 'changes.patch'), warnings: externalSources.map((url) => `Non-preferred source: ${url}`) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const skillRoot = path.dirname(scriptDirectory);
  const args = parseArgs(process.argv.slice(2));
  if (!args.manifest) throw new Error('Usage: node scripts/update-seo-knowledge.mjs --manifest review.json [--dry-run]');
  const manifest = JSON.parse(await readFile(path.resolve(args.manifest), 'utf8'));
  const result = await updateSeoKnowledge({ skillRoot, manifest, dryRun: booleanArg(args.dryRun) });
  console.log(JSON.stringify(result, null, 2));
}
