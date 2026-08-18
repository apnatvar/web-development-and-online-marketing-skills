import { createHash } from 'node:crypto';

export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'informational'];
export const CONFIDENCE_LEVELS = ['confirmed', 'likely', 'possible'];
export const PRIORITY_GROUPS = ['fix first', 'fix next', 'improve later', 'monitor'];

function identifier(value) {
  const readable = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 46);
  const suffix = createHash('sha1').update(value).digest('hex').slice(0, 7);
  return `${readable || 'finding'}-${suffix}`;
}

export function makeFinding(input) {
  const finding = {
    id: input.id ?? identifier(`${input.title}|${input.affectedPage}`),
    title: input.title,
    category: input.category,
    affectedPage: input.affectedPage,
    evidence: input.evidence,
    evidenceSource: input.evidenceSource,
    severity: input.severity ?? 'medium',
    confidence: input.confidence ?? 'confirmed',
    userImpact: input.userImpact ?? 'No material user impact was established.',
    seoImpact: input.seoImpact ?? 'No direct search impact was established.',
    conversionImpact: input.conversionImpact ?? 'No direct conversion impact was established.',
    technicalExplanation: input.technicalExplanation,
    plainLanguageExplanation: input.plainLanguageExplanation,
    recommendedFix: input.recommendedFix,
    implementationGuidance: input.implementationGuidance,
    expectedResult: input.expectedResult,
    verificationMethod: input.verificationMethod,
    repositoryAccessRequired: Boolean(input.repositoryAccessRequired),
    effort: input.effort ?? 'unknown',
    affectedPageCount: input.affectedPageCount ?? 1,
    dependencyOrder: input.dependencyOrder ?? 0,
    priorityGroup: input.priorityGroup ?? 'monitor',
    changeType: input.changeType ?? 'monitoring',
    measurementClass: input.measurementClass ?? 'deterministic',
  };
  if (input.relatedFindingIds?.length) finding.relatedFindingIds = [...new Set(input.relatedFindingIds)];
  if (input.tags?.length) finding.tags = [...new Set(input.tags)];
  return finding;
}

function mentionsImpact(text, negative = false) {
  const match = /block|prevent|cannot|slow|confus|miss|inaccess|index|crawl|conversion|abandon|trust|discover/i.test(text ?? '');
  return match ? (negative ? -1 : 1) : 0;
}

export function scoreFinding(finding) {
  const severity = { critical: 100, high: 70, medium: 40, low: 15, informational: 0 }[finding.severity] ?? 0;
  const confidence = { confirmed: 15, likely: 8, possible: 2 }[finding.confidence] ?? 0;
  const effortPenalty = { small: 0, medium: 6, large: 14, unknown: 10 }[finding.effort] ?? 10;
  const impact = [finding.userImpact, finding.seoImpact, finding.conversionImpact].reduce((total, text) => total + mentionsImpact(text) * 12, 0);
  const breadth = Math.min(15, Math.max(0, (finding.affectedPageCount - 1) * 3));
  const dependency = Math.max(0, 8 - finding.dependencyOrder * 2);
  return severity + confidence + impact + breadth + dependency - effortPenalty;
}

export function priorityFor(finding, score = scoreFinding(finding)) {
  if (finding.confidence === 'possible' || finding.severity === 'informational') return 'monitor';
  if (finding.severity === 'critical' || score >= 105) return 'fix first';
  if (score >= 65) return 'fix next';
  if (score >= 25) return 'improve later';
  return 'monitor';
}

export function prioritizeFindings(findings) {
  const ranked = findings.map((finding) => {
    const priorityScore = scoreFinding(finding);
    return { ...finding, priorityScore, priorityGroup: priorityFor(finding, priorityScore) };
  }).sort((left, right) => {
    const group = PRIORITY_GROUPS.indexOf(left.priorityGroup) - PRIORITY_GROUPS.indexOf(right.priorityGroup);
    return group || right.priorityScore - left.priorityScore || left.id.localeCompare(right.id);
  });
  return {
    findings: ranked,
    groups: Object.fromEntries(PRIORITY_GROUPS.map((group) => [group, ranked.filter((item) => item.priorityGroup === group).map((item) => item.id)])),
    quickWins: ranked.filter((item) => item.effort === 'small' && ['fix first', 'fix next'].includes(item.priorityGroup)).map((item) => item.id),
    byChangeType: ranked.reduce((result, item) => {
      (result[item.changeType] ??= []).push(item.id);
      return result;
    }, {}),
  };
}

export function mergeDuplicateFindings(findings) {
  const groups = new Map();
  for (const finding of findings) {
    const key = `${finding.title.toLowerCase()}|${finding.category.toLowerCase()}|${finding.recommendedFix.toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(finding);
  }
  return [...groups.values()].map((group) => {
    if (group.length === 1) return group[0];
    const pages = [...new Set(group.map((item) => item.affectedPage))];
    const evidence = [...new Set(group.map((item) => item.evidence))].join(' | ');
    return {
      ...group[0],
      affectedPage: pages.join(', '),
      affectedPages: pages,
      affectedPageCount: pages.length,
      evidence,
      relatedFindingIds: [...new Set(group.flatMap((item) => [item.id, ...(item.relatedFindingIds ?? [])]))].filter((id) => id !== group[0].id),
    };
  });
}
