import { makeFinding, mergeDuplicateFindings } from './findings.mjs';
import { safeEvidence } from './security.mjs';

const STOP_WORDS = new Set('a an and are as at be by for from has have how in is it its of on or our that the their this to we what who with you your'.split(' '));
const JARGON = [
  'best-in-class', 'cutting-edge', 'game-changing', 'next-generation', 'revolutionary',
  'synergy', 'seamless', 'world-class', 'unlock', 'leverage', 'innovative solution',
];

const INTENT_FIELDS = [
  'websitePurpose', 'primaryAudience', 'primaryVisitorProblem', 'desiredVisitorAction',
  'primaryProductOrService', 'keyDifferentiator', 'geographicOrIndustryFocus',
  'priorityPages', 'targetKeywords', 'preferredBrandTone',
];

export function validateIntent(intent) {
  const errors = [];
  if (!intent || typeof intent !== 'object') return ['Website intent is required for copy and combined audits.'];
  for (const field of INTENT_FIELDS) {
    const value = intent[field];
    if (Array.isArray(value)) {
      if (field === 'priorityPages' && value.length === 0) errors.push(`${field} must contain at least one page.`);
      if (value.some((item) => typeof item !== 'string')) errors.push(`${field} must contain only strings.`);
    } else if (typeof value !== 'string' || value.trim().length < 2) {
      errors.push(`${field} is required.`);
    }
  }
  return errors;
}

function tokens(value) {
  return [...new Set((String(value ?? '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length > 2 && !STOP_WORDS.has(word)))];
}

export function intentMatchRatio(copy, intentValue) {
  const expected = tokens(intentValue);
  if (!expected.length) return 1;
  const actual = new Set(tokens(copy));
  return expected.filter((word) => actual.has(word)).length / expected.length;
}

function countSyllables(word) {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.length <= 3) return 1;
  const groups = normalized.replace(/(?:e|es|ed)$/i, '').match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

export function readability(text) {
  const sentences = String(text).split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  const words = String(text).match(/[A-Za-z]+/g) ?? [];
  if (!sentences.length || !words.length) return { score: null, words: words.length, sentences: sentences.length, label: 'insufficient text' };
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);
  const label = score >= 70 ? 'easy' : score >= 50 ? 'moderate' : 'difficult';
  return { score: Math.round(score * 10) / 10, words: words.length, sentences: sentences.length, label };
}

export function repeatedPhrases(text, phraseLength = 4) {
  const words = (String(text).toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((word) => !STOP_WORDS.has(word));
  const counts = new Map();
  for (let index = 0; index <= words.length - phraseLength; index += 1) {
    const phrase = words.slice(index, index + phraseLength).join(' ');
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count >= 3).sort((left, right) => right[1] - left[1]);
}

function pageLabel(page) {
  return page.url ?? page.route ?? page.file ?? 'unknown page';
}

function guide(page, localAction, publicAction = localAction) {
  if (page.sourceType === 'local repository') return `Edit ${page.file ?? 'the page component'}. ${localAction}`;
  return `${publicAction} Repository access is required to identify the exact template or CMS field.`;
}

function copyFinding(page, input) {
  return makeFinding({
    affectedPage: pageLabel(page),
    evidenceSource: 'Visible-copy and website-intent comparator',
    repositoryAccessRequired: page.sourceType !== 'local repository',
    measurementClass: 'relatively stable',
    ...input,
  });
}

function messageFindings(page, intent) {
  const inspected = page.inspection;
  if (!inspected) return [];
  const findings = [];
  const opening = `${inspected.title} ${inspected.headings.slice(0, 2).map((item) => item.text).join(' ')} ${inspected.firstContent}`;
  const purposeRatio = intentMatchRatio(opening, `${intent.websitePurpose} ${intent.primaryProductOrService}`);
  if (purposeRatio < 0.28) {
    findings.push(copyFinding(page, {
      title: 'Opening message does not clearly state the website purpose', category: 'value proposition', severity: 'high', confidence: 'likely', effort: 'medium', changeType: 'content rewrite',
      evidence: `Opening: “${safeEvidence(opening)}”; stated purpose: “${safeEvidence(intent.websitePurpose)}”.`,
      userImpact: 'Visitors may leave before understanding what the site offers.', seoImpact: 'The visible topic may not align with the queries the page is meant to satisfy.', conversionImpact: 'Unclear relevance weakens the path to the desired action.',
      technicalExplanation: `Only ${Math.round(purposeRatio * 100)}% of meaningful purpose/product terms appeared in the opening sample; this is a review heuristic, not proof of poor copy.`,
      plainLanguageExplanation: 'The first screen does not use enough concrete language to explain what this site is for.',
      recommendedFix: 'Rewrite the title, h1, and first supporting sentence to name the offer, audience or problem, and practical outcome.',
      implementationGuidance: guide(page, 'Update the hero copy while preserving accurate claims and the existing heading semantics.'),
      expectedResult: 'A first-time visitor can explain the offer after one quick scan.',
      verificationMethod: 'Ask an unfamiliar reader what the site offers after five seconds; compare their answer with the stated intent.', tags: ['messaging', 'hero', 'intent'],
    }));
  }
  const audienceRatio = intentMatchRatio(opening, intent.primaryAudience);
  if (audienceRatio < 0.25) {
    findings.push(copyFinding(page, {
      title: 'The intended audience is not obvious near the top', category: 'audience clarity', severity: 'medium', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `Primary audience: “${safeEvidence(intent.primaryAudience)}”; opening sample: “${safeEvidence(opening)}”.`,
      userImpact: 'Relevant visitors may not recognize that the offer is meant for them.', seoImpact: 'Audience and use-case language can help align the page with specific search intent.', conversionImpact: 'Visitors hesitate when fit is unclear.',
      technicalExplanation: 'The meaningful audience terms have little or no overlap with prominent visible copy.', plainLanguageExplanation: 'The page does not quickly say who it is for.',
      recommendedFix: 'Name the audience or a recognizable audience situation in the hero or immediate supporting copy.',
      implementationGuidance: guide(page, 'Add accurate audience language without excluding valid customers or inventing segments.'),
      expectedResult: 'Qualified visitors recognize themselves sooner.', verificationMethod: 'Review with three target-audience examples and confirm the statement remains true.', tags: ['audience', 'intent'],
    }));
  }
  if (intentMatchRatio(opening, intent.keyDifferentiator) < 0.25) {
    findings.push(copyFinding(page, {
      title: 'The stated differentiator is not visible in the opening message', category: 'differentiation', severity: 'medium', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `Stated differentiator: “${safeEvidence(intent.keyDifferentiator)}”; it is not clearly reflected in the opening sample.`,
      userImpact: 'Visitors may see a generic offer that is difficult to compare.', seoImpact: 'Specific subject language can improve relevance, but no ranking outcome is guaranteed.', conversionImpact: 'A generic promise gives visitors less reason to choose this offer.',
      technicalExplanation: 'The intent-to-copy comparison found weak term alignment; synonyms and visual context may require human review.', plainLanguageExplanation: 'The reason to choose this offer is not easy to see.',
      recommendedFix: 'State the truthful differentiator in plain language and connect it to a visitor benefit.', implementationGuidance: guide(page, 'Use only supported facts; do not add unverified “best”, results, certifications, or capabilities.'),
      expectedResult: 'Visitors can tell why the offer differs from alternatives.', verificationMethod: 'Ask a reviewer to identify the difference without reading the intent brief.', tags: ['differentiation', 'trust'],
    }));
  }
  return findings;
}

export function ctaFindings(page, intent) {
  const inspected = page.inspection;
  if (!inspected) return [];
  const findings = [];
  if (!inspected.ctas.length) {
    findings.push(copyFinding(page, {
      title: 'No clear action prompt was detected', category: 'calls to action', severity: 'high', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `Desired visitor action: “${safeEvidence(intent.desiredVisitorAction)}”; no recognizable button or action link text was found.`,
      userImpact: 'Visitors may not know what to do next.', seoImpact: 'No direct ranking effect is claimed; weak navigation can reduce discoverability.', conversionImpact: 'The primary conversion path is unclear.',
      technicalExplanation: 'No button or common action-language link was found in the inspected markup.', plainLanguageExplanation: 'The page does not give visitors an obvious next step.',
      recommendedFix: 'Add a specific, visible CTA that describes the next action and outcome.', implementationGuidance: guide(page, 'Add a real link or button with descriptive text; avoid vague “Submit” or misleading urgency.'),
      expectedResult: 'Visitors can immediately identify the intended next step.', verificationMethod: 'Confirm the CTA is visible, keyboard accessible, functional, and understandable out of context.', tags: ['cta', 'conversion'],
    }));
    return findings;
  }
  const ctaText = inspected.ctas.map((cta) => cta.text).join(' | ');
  if (intentMatchRatio(ctaText, intent.desiredVisitorAction) < 0.2) {
    findings.push(copyFinding(page, {
      title: 'CTA wording does not clearly match the desired visitor action', category: 'calls to action', severity: 'medium', confidence: 'likely', effort: 'small', changeType: 'quick win',
      evidence: `Detected CTA text: “${safeEvidence(ctaText)}”; intended action: “${safeEvidence(intent.desiredVisitorAction)}”.`,
      userImpact: 'Visitors may be unsure where a button leads or whether it completes their goal.', seoImpact: 'No direct ranking effect is claimed.', conversionImpact: 'Mismatch between intent and CTA can reduce action completion.',
      technicalExplanation: 'CTA words have low overlap with the stated action; human review should account for good synonyms.', plainLanguageExplanation: 'The buttons do not clearly say the action the business wants visitors to take.',
      recommendedFix: 'Use consistent action-led wording that previews what happens next.', implementationGuidance: guide(page, 'Update visible labels and accessible names together; keep secondary actions visually secondary.'),
      expectedResult: 'The conversion path feels predictable.', verificationMethod: 'Check every primary CTA label and destination against the stated action.', tags: ['cta', 'conversion', 'consistency'],
    }));
  }
  const distinct = new Set(inspected.ctas.map((cta) => cta.text.trim().toLowerCase()));
  if (distinct.size > 4) {
    findings.push(copyFinding(page, {
      title: 'Primary actions use too many competing labels', category: 'calls to action', severity: 'medium', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `${distinct.size} distinct CTA labels: ${safeEvidence([...distinct].join(', '))}`, userImpact: 'Competing actions increase decision effort.',
      seoImpact: 'No direct search impact is claimed.', conversionImpact: 'Inconsistent CTA hierarchy can dilute the primary action.',
      technicalExplanation: 'The page uses more than four distinct detected action labels; some may legitimately be secondary.', plainLanguageExplanation: 'The page asks visitors to do too many differently named things.',
      recommendedFix: 'Choose one primary CTA label and a small number of clearly secondary actions.', implementationGuidance: guide(page, 'Normalize labels and visual hierarchy across repeated components.'),
      expectedResult: 'A clearer action hierarchy.', verificationMethod: 'List every CTA by section and confirm one primary action remains consistent.', tags: ['cta', 'consistency'],
    }));
  }
  return findings;
}

function qualityFindings(page, intent) {
  const inspected = page.inspection;
  if (!inspected) return [];
  const findings = [];
  const reading = readability(inspected.visibleText);
  if (reading.words >= 120 && reading.score !== null && reading.score < 45) {
    findings.push(copyFinding(page, {
      title: 'Copy is difficult to read quickly', category: 'readability', severity: 'medium', confidence: 'likely', effort: 'medium', changeType: 'content rewrite',
      evidence: `Estimated Flesch Reading Ease: ${reading.score} (${reading.label}) across ${reading.words} words.`, evidenceSource: 'Visible-copy readability heuristic',
      userImpact: 'Dense sentences make scanning and comprehension harder, especially on mobile.', seoImpact: 'No target reading score is a ranking requirement; understandable content better serves searchers.', conversionImpact: 'High reading effort can hide the offer and next step.',
      technicalExplanation: 'The English-language readability formula is a heuristic and may be inappropriate for specialized terminology or other languages.', plainLanguageExplanation: 'The copy uses sentences or words that take extra effort to process.',
      recommendedFix: 'Shorten sentences, front-load conclusions, replace avoidable jargon, and use descriptive subheadings and lists.', implementationGuidance: guide(page, `Edit toward the preferred tone (“${safeEvidence(intent.preferredBrandTone)}”) without removing necessary technical accuracy.`),
      expectedResult: 'Visitors find key information faster.', verificationMethod: 'Read aloud, test with representative users, and recalculate only as a secondary check.', tags: ['readability', 'mobile'],
    }));
  }
  const jargonFound = JARGON.filter((term) => inspected.visibleText.toLowerCase().includes(term));
  if (jargonFound.length) {
    findings.push(copyFinding(page, {
      title: 'Generic marketing jargon reduces specificity', category: 'clarity', severity: 'low', confidence: 'confirmed', effort: 'small', changeType: 'quick win',
      evidence: `Detected phrase(s): ${jargonFound.join(', ')}`, evidenceSource: 'Visible-copy phrase scanner',
      userImpact: 'Visitors must interpret broad claims instead of learning what the offer actually does.', seoImpact: 'Generic language contributes little topical specificity.', conversionImpact: 'Unsupported superlatives can weaken trust.',
      technicalExplanation: 'A curated phrase list found broad promotional language; context still requires editorial judgment.', plainLanguageExplanation: 'The copy sounds promotional without explaining something concrete.',
      recommendedFix: 'Replace each phrase with a specific, supportable description of the process, feature, audience, or outcome.', implementationGuidance: guide(page, 'Do not substitute invented statistics, testimonials, certifications, or capabilities.'),
      expectedResult: 'More credible and informative copy.', verificationMethod: 'For every claim, ask “what exactly does this mean, and can we prove it?”', tags: ['jargon', 'trust'],
    }));
  }
  const repetitions = repeatedPhrases(inspected.visibleText);
  if (repetitions.length) {
    findings.push(copyFinding(page, {
      title: 'Copy repeats the same phrases excessively', category: 'repetition', severity: 'low', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `Repeated phrase: “${safeEvidence(repetitions[0][0])}” (${repetitions[0][1]} times).`, evidenceSource: 'Visible-copy repetition heuristic',
      userImpact: 'Repetition slows scanning and can make the page feel padded.', seoImpact: 'Natural repetition is fine; forced repetition can reduce content quality and resemble keyword stuffing.', conversionImpact: 'Repeated claims use space that could answer objections or add evidence.',
      technicalExplanation: 'A four-word normalized phrase occurred at least three times.', plainLanguageExplanation: 'The page says the same thing several times.',
      recommendedFix: 'Keep the strongest instance and use the freed space for distinct, useful information.', implementationGuidance: guide(page, 'Preserve intentional navigation labels and legal text; edit repeated marketing paragraphs.'),
      expectedResult: 'Tighter copy with fewer redundant sections.', verificationMethod: 'Rerun repetition analysis and perform a human edit pass.', tags: ['repetition', 'content-quality'],
    }));
  }
  const trustPattern = /case stud|customer|client|testimonial|review|certif|accredit|warranty|guarantee|privacy|security|about us|team|evidence|methodology/i;
  if (!trustPattern.test(inspected.visibleText)) {
    findings.push(copyFinding(page, {
      title: 'The page offers little visible support for trust', category: 'trust signals', severity: 'medium', confidence: 'possible', effort: 'medium', changeType: 'content rewrite',
      evidence: 'No common evidence, policy, team, methodology, customer, certification, or assurance language was detected.', evidenceSource: 'Visible-copy trust-signal heuristic',
      userImpact: 'Visitors may lack enough information to judge credibility.', seoImpact: 'Trust is context-dependent; this audit does not treat E-E-A-T as a standalone ranking factor.', conversionImpact: 'Unanswered credibility questions can delay action.',
      technicalExplanation: 'Automated text matching cannot see every visual or externally hosted trust signal.', plainLanguageExplanation: 'The page may not give visitors enough reason to believe the claims.',
      recommendedFix: 'Add only real, verifiable evidence appropriate to the business: named process, policies, responsible people, source citations, or genuine customer proof.', implementationGuidance: guide(page, 'Do not invent results, reviews, logos, certifications, guarantees, or statistics; mark this as unresolved until evidence is supplied.'),
      expectedResult: 'Visitors can evaluate credibility using factual evidence.', verificationMethod: 'Have the business owner verify every trust claim and link to supporting detail.', tags: ['trust', 'evidence'],
    }));
  }
  return findings;
}

function keywordFindings(page, intent) {
  if (!intent.targetKeywords?.length || !page.inspection) return [];
  const prominent = `${page.inspection.title} ${page.inspection.headings.map((heading) => heading.text).join(' ')} ${page.inspection.metaDescription}`;
  const aligned = intent.targetKeywords.filter((keyword) => intentMatchRatio(prominent, keyword) >= 0.5);
  if (aligned.length > 0) return [];
  return [copyFinding(page, {
    title: 'Prominent copy does not align with stated target keywords', category: 'search intent', severity: 'medium', confidence: 'likely', effort: 'medium', changeType: 'content rewrite',
    evidence: `Stated keywords: ${safeEvidence(intent.targetKeywords.join(', '))}; prominent copy: “${safeEvidence(prominent)}”.`,
    userImpact: 'Searchers may not quickly see that the page answers their need.', seoImpact: 'Weak topical alignment can reduce relevance for the intended query; keyword inclusion alone never guarantees rankings.', conversionImpact: 'Mismatch between query expectation and landing copy increases abandonment.',
    technicalExplanation: 'None of the supplied keyword phrases had strong token overlap with title, headings, or description.', plainLanguageExplanation: 'The page does not use the same clear topic language its intended visitors may search for.',
    recommendedFix: 'Choose the keyword whose intent genuinely matches this page, then reflect that topic naturally in the title, main heading, summary, and supporting content.',
    implementationGuidance: guide(page, 'Avoid stuffing every keyword onto every page; map distinct intents to appropriate pages.'),
    expectedResult: 'A clearer match between the page and its intended search need.', verificationMethod: 'Review the search-result promise and landing page together; confirm one primary intent per page.', tags: ['keywords', 'search-intent'],
  })];
}

export function analyseCopyPage(page, intent) {
  if (!page.inspection) return [];
  return [...messageFindings(page, intent), ...ctaFindings(page, intent), ...qualityFindings(page, intent), ...keywordFindings(page, intent)];
}

function consistencyFindings(pages, intent) {
  const usable = pages.filter((page) => page.inspection);
  if (usable.length < 2) return [];
  const primaryCtas = usable.map((page) => page.inspection.ctas[0]?.text?.trim()).filter(Boolean);
  const distinct = new Set(primaryCtas.map((text) => text.toLowerCase()));
  if (distinct.size <= 2) return [];
  const local = usable.every((page) => page.sourceType === 'local repository');
  return [makeFinding({
    title: 'Primary CTA language changes across pages', category: 'message consistency', affectedPage: usable.map(pageLabel).join(', '),
    affectedPageCount: usable.length, evidence: `First CTA labels: ${safeEvidence(primaryCtas.join(' | '))}`, evidenceSource: 'Cross-page copy comparator',
    severity: 'medium', confidence: 'likely', userImpact: 'Visitors encounter an inconsistent path as they move through the site.', seoImpact: 'No direct ranking effect is claimed.',
    conversionImpact: 'Changing labels can make the same desired action feel like different commitments.', technicalExplanation: 'More than two distinct first-CTA labels were found across the sampled pages.',
    plainLanguageExplanation: 'The site names its main next step differently from page to page.', recommendedFix: `Standardize the primary action around “${safeEvidence(intent.desiredVisitorAction)}” and reserve other labels for genuinely different actions.`,
    implementationGuidance: local ? 'Update the shared CTA component or page data where possible.' : 'Update the shared site-builder component or template. Repository access is required to identify it.',
    expectedResult: 'A predictable site-wide conversion path.', verificationMethod: 'Inventory CTA labels across the selected pages and click each destination.', repositoryAccessRequired: !local,
    effort: 'small', changeType: 'quick win', measurementClass: 'relatively stable', tags: ['cta', 'consistency'],
  })];
}

export function createCopyFindings({ pages, intent }) {
  const errors = validateIntent(intent);
  if (errors.length) throw new Error(`Invalid website intent:\n- ${errors.join('\n- ')}`);
  return mergeDuplicateFindings([...pages.flatMap((page) => analyseCopyPage(page, intent)), ...consistencyFindings(pages, intent)]);
}
