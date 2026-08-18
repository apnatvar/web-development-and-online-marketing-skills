import path from 'node:path';
import { readJson } from './fs-utils.mjs';

export function daysBetween(earlierDate, laterDate = new Date()) {
  const earlier = new Date(`${earlierDate}T00:00:00Z`);
  if (Number.isNaN(earlier.valueOf())) return Number.POSITIVE_INFINITY;
  return Math.floor((laterDate.valueOf() - earlier.valueOf()) / 86_400_000);
}

export function knowledgeFreshness(metadata, policy, now = new Date()) {
  const ageDays = daysBetween(metadata.lastVerified, now);
  const status = ageDays > policy.criticalAfterDays ? 'critical' : ageDays > policy.warningAfterDays ? 'warning' : 'fresh';
  return {
    lastVerified: metadata.lastVerified,
    lastUpdated: metadata.lastUpdated,
    knowledgeVersion: metadata.knowledgeVersion,
    ageDays,
    status,
    warning: status === 'fresh' ? null : `SEO knowledge was last verified ${ageDays} days ago (${metadata.lastVerified}); run “refresh SEO knowledge” before relying on volatile guidance.`,
  };
}

export async function loadKnowledgeStatus(skillRoot, now = new Date()) {
  const metadata = await readJson(path.join(skillRoot, 'knowledge', 'seo', 'metadata.json'));
  const policy = await readJson(path.join(skillRoot, 'config', 'staleness-policy.json'));
  return knowledgeFreshness(metadata, policy, now);
}
