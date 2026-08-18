import { makeFinding, mergeDuplicateFindings } from './findings.mjs';

function findByTag(findings, tag) {
  return findings.filter((finding) => finding.tags?.includes(tag));
}

function samePage(left, right) {
  return left.affectedPage === right.affectedPage || left.affectedPage.split(', ').some((page) => right.affectedPage.includes(page));
}

export function synthesizeCombinedFindings(technical, copy) {
  const synthesis = [];
  const technicalTitles = findByTag(technical, 'title');
  const messageIssues = [...findByTag(copy, 'messaging'), ...findByTag(copy, 'search-intent')];
  for (const tech of technicalTitles) {
    const message = messageIssues.find((candidate) => samePage(tech, candidate));
    if (!message) continue;
    synthesis.push(makeFinding({
      title: 'Page title weakens both search presentation and the opening message', category: 'combined SEO and messaging', affectedPage: tech.affectedPage,
      evidence: `${tech.evidence} Related message evidence: ${message.evidence}`, evidenceSource: 'Combined metadata and intent synthesis',
      severity: tech.severity === 'high' || message.severity === 'high' ? 'high' : 'medium', confidence: tech.confidence === 'confirmed' ? 'confirmed' : 'likely',
      userImpact: 'Visitors cannot quickly identify the page in a tab, link, or opening scan.', seoImpact: 'The title-link candidate and visible topic do not communicate a strong, consistent subject.',
      conversionImpact: 'The search promise and landing message do not form a clear path to action.', technicalExplanation: 'Metadata and visible-copy findings affect the same page and should be repaired as one messaging system.',
      plainLanguageExplanation: 'The label people see before visiting and the message they see after arriving are both weak or mismatched.',
      recommendedFix: 'Write the title, h1, and opening summary together around one accurate page purpose; keep each unique but consistent.',
      implementationGuidance: tech.repositoryAccessRequired ? 'Update the CMS/template fields controlling title, h1, and hero copy; repository access is needed to identify exact files.' : tech.implementationGuidance,
      expectedResult: 'A coherent search-result promise and landing-page message.', verificationMethod: 'Compare rendered title, h1, description, and first paragraph side by side after deployment.',
      repositoryAccessRequired: tech.repositoryAccessRequired, effort: 'medium', changeType: 'content rewrite', measurementClass: 'relatively stable',
      relatedFindingIds: [tech.id, message.id], tags: ['title', 'messaging', 'seo'],
    }));
  }

  const headingTech = findByTag(technical, 'heading');
  const openingCopy = [...findByTag(copy, 'messaging'), ...findByTag(copy, 'audience')];
  for (const tech of headingTech) {
    const message = openingCopy.find((candidate) => samePage(tech, candidate));
    if (!message) continue;
    synthesis.push(makeFinding({
      title: 'Heading structure and heading message should be repaired together', category: 'combined accessibility and messaging', affectedPage: tech.affectedPage,
      evidence: `${tech.evidence} ${message.evidence}`, evidenceSource: 'Combined heading-structure and intent synthesis', severity: 'high', confidence: 'confirmed',
      userImpact: 'The main message is unclear both visually and to assistive technology.', seoImpact: 'The primary topic is less explicit in visible and semantic structure.', conversionImpact: 'Visitors may not recognize relevance before leaving.',
      technicalExplanation: 'Changing words without fixing the heading element, or fixing markup without improving the words, would leave half the problem.', plainLanguageExplanation: 'The heading needs both the right HTML role and clearer wording.',
      recommendedFix: 'Create one descriptive visible h1, then organize supporting sections with logically nested headings.',
      implementationGuidance: tech.repositoryAccessRequired ? 'Update the shared heading/hero template and its copy fields; exact code cause requires repository access.' : tech.implementationGuidance,
      expectedResult: 'A clear, accessible outline whose first heading states the page purpose.', verificationMethod: 'Review the visual hierarchy, DOM heading tree, and five-second comprehension together.',
      repositoryAccessRequired: tech.repositoryAccessRequired, effort: 'medium', changeType: 'structural fix', measurementClass: 'deterministic', relatedFindingIds: [tech.id, message.id], tags: ['heading', 'messaging'],
    }));
  }
  return mergeDuplicateFindings(synthesis);
}

export function mergeCombinedAudit(technical, copy) {
  const synthesis = synthesizeCombinedFindings(technical, copy);
  const related = new Set(synthesis.flatMap((item) => item.relatedFindingIds ?? []));
  const remaining = [...technical, ...copy].filter((item) => !related.has(item.id));
  return mergeDuplicateFindings([...synthesis, ...remaining]);
}
