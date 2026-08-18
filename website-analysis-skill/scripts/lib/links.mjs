import { makeFinding, mergeDuplicateFindings } from './findings.mjs';
import { safeEvidence } from './security.mjs';

function eligibleLink(value) {
  if (!value) return false;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

async function requestStatus(url, timeoutMs) {
  let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  if ([405, 501].includes(response.status)) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  return { status: response.status, finalUrl: response.url, redirected: response.redirected };
}

export async function checkPublicLinks(pages, options = {}) {
  const maximumLinks = options.maximumLinks ?? 40;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const candidates = [];
  for (const page of pages) {
    for (const link of page.inspection?.links ?? []) {
      if (!eligibleLink(link.href)) continue;
      candidates.push({ sourcePage: page.url ?? page.finalUrl, text: link.text, line: link.line, href: link.href });
    }
  }
  const unique = [...new Map(candidates.map((item) => [item.href, item])).values()].slice(0, maximumLinks);
  const results = [];
  for (const candidate of unique) {
    try {
      results.push({ ...candidate, ...(await requestStatus(candidate.href, timeoutMs)), error: null });
    } catch (error) {
      results.push({ ...candidate, status: null, finalUrl: null, redirected: false, error: error.message });
    }
  }
  return { checked: results, truncated: candidates.length > maximumLinks, totalCandidates: candidates.length };
}

export function findingsFromPublicLinks(linkCheck) {
  const findings = [];
  for (const link of linkCheck.checked) {
    if (link.status !== null && link.status < 400) continue;
    const confirmedBroken = [404, 410].includes(link.status);
    const serverError = link.status >= 500;
    findings.push(makeFinding({
      title: confirmedBroken ? 'Public link leads to a missing page' : 'Public link could not be verified successfully',
      category: 'broken links', affectedPage: link.sourcePage, evidence: `Link “${safeEvidence(link.text, 80)}” → ${safeEvidence(link.href)} returned ${link.status ?? `no response (${safeEvidence(link.error)})`}.`,
      evidenceSource: 'HTTP link checker', severity: confirmedBroken || serverError ? 'high' : 'medium', confidence: confirmedBroken ? 'confirmed' : 'possible',
      userImpact: 'Visitors may fail to reach referenced information or a next step.', seoImpact: 'Broken internal links interrupt crawl paths; external failures reduce usefulness but do not directly control indexing.',
      conversionImpact: 'A failed destination can stop the visitor journey.', technicalExplanation: confirmedBroken ? 'The destination returned an HTTP not-found/gone response.' : 'The audit request failed or was rejected; bot protection, authentication, or temporary network state may be responsible.',
      plainLanguageExplanation: 'This link did not open normally during the check.', recommendedFix: 'Confirm the destination in a normal browser, then correct, replace, or remove the link. For an intentionally moved internal page, use a relevant permanent redirect.',
      implementationGuidance: 'Update the page or shared component that emits this link. Repository access is required to name the exact file.', expectedResult: 'The link reaches relevant content with a successful response.',
      verificationMethod: 'Click the link and recheck its final HTTP status from an unrestricted network.', repositoryAccessRequired: true, effort: 'small', changeType: 'quick win',
      measurementClass: confirmedBroken ? 'relatively stable' : 'environment-dependent', tags: ['links', 'crawlability'],
    }));
  }
  return mergeDuplicateFindings(findings);
}
