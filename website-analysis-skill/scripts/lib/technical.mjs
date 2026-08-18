import path from 'node:path';
import { makeFinding, mergeDuplicateFindings } from './findings.mjs';
import { safeEvidence } from './security.mjs';

function pageLabel(page) {
  return page.url ?? page.route ?? page.file ?? 'unknown page';
}

function localGuidance(page, action, line) {
  const location = page.file ? `${page.file}${line ? `:${line}` : ''}` : 'the relevant page template';
  return `Edit ${location}. ${action}`;
}

function publicGuidance(action) {
  return `${action} Change the page template or site-builder SEO/settings panel that controls this output. Repository access is required to name the exact file or component.`;
}

function guidance(page, action, line) {
  return page.sourceType === 'local repository' ? localGuidance(page, action, line) : publicGuidance(action);
}

function implementationNeedsRepository(page) {
  return page.sourceType !== 'local repository';
}

function issue(page, input) {
  return makeFinding({
    affectedPage: pageLabel(page),
    repositoryAccessRequired: implementationNeedsRepository(page),
    ...input,
  });
}

function metadataFindings(page) {
  const result = [];
  const inspected = page.inspection;
  if (!inspected) return result;
  if (!inspected.title) {
    result.push(issue(page, {
      title: 'Document title is missing', category: 'metadata', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'quick win',
      evidence: 'No non-empty <title> element was found.', evidenceSource: 'HTML metadata inspector',
      userImpact: 'Browser tabs and shared links do not identify the page clearly.', seoImpact: 'Search engines lose a strong page-topic and title-link signal.',
      technicalExplanation: 'The rendered or source HTML has no usable document title.', plainLanguageExplanation: 'The page has no label for browser tabs or search-result headlines.',
      recommendedFix: 'Add one concise, page-specific title that describes the page and, where useful, the brand.',
      implementationGuidance: guidance(page, 'Add a single <title> in the document head or framework metadata API.', inspected.titleLine),
      expectedResult: 'The page is identifiable in tabs and has a strong candidate search-result title.', verificationMethod: 'View source and rerun the metadata and Lighthouse SEO checks.',
      measurementClass: 'deterministic', tags: ['title', 'seo', 'messaging'],
    }));
  } else if (inspected.title.length < 15 || inspected.title.length > 65) {
    result.push(issue(page, {
      title: 'Document title may be unhelpfully short or long', category: 'metadata', severity: 'low', confidence: 'likely', effort: 'small', changeType: 'content rewrite',
      evidence: `Title (${inspected.title.length} characters): “${safeEvidence(inspected.title)}”`, evidenceSource: 'HTML metadata inspector',
      userImpact: 'A vague or truncated title can make the page harder to recognize.', seoImpact: 'Google may rewrite a title that is vague, repetitive, or poorly matched to page content.',
      technicalExplanation: 'Length is a review trigger, not a ranking requirement; usefulness and accuracy matter more than a fixed character count.', plainLanguageExplanation: 'The title deserves a human edit for clarity; it is not failing a magic length rule.',
      recommendedFix: 'Rewrite the title to be unique, concise, and accurate without keyword stuffing.', implementationGuidance: guidance(page, 'Update the title in the route metadata and keep the visible H1 consistent with its promise.', inspected.titleLine),
      expectedResult: 'A clearer browser label and stronger search-result headline candidate.', verificationMethod: 'Review at common search-snippet widths and confirm the title still accurately summarizes the page.',
      measurementClass: 'relatively stable', tags: ['title', 'seo', 'messaging'],
    }));
  }
  if (!inspected.metaDescription) {
    result.push(issue(page, {
      title: 'Meta description is missing', category: 'metadata', severity: 'medium', confidence: 'confirmed', effort: 'small', changeType: 'quick win',
      evidence: 'No meta[name="description"] with content was found.', evidenceSource: 'HTML metadata inspector',
      userImpact: 'People may see a less useful automatically selected snippet when the page is shared or found.', seoImpact: 'A description is not a direct ranking guarantee, but a useful summary can improve search-result comprehension and clicks.',
      technicalExplanation: 'Search engines can select body text instead, but an accurate page-specific summary gives them another candidate.', plainLanguageExplanation: 'The page does not provide its own short summary for search engines.',
      recommendedFix: 'Add a unique one- or two-sentence summary of the page and its relevant next step.', implementationGuidance: guidance(page, 'Add meta name="description" through the framework metadata API or document head.'),
      expectedResult: 'A stronger snippet candidate that matches the page.', verificationMethod: 'Inspect rendered HTML and confirm each audited page has a distinct, accurate description.', measurementClass: 'deterministic', tags: ['description', 'seo'],
    }));
  }
  if (inspected.canonicalCount > 1) {
    result.push(issue(page, {
      title: 'Multiple canonical tags conflict', category: 'canonicalisation', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'configuration change',
      evidence: `${inspected.canonicalCount} canonical link elements were found.`, evidenceSource: 'HTML metadata inspector',
      userImpact: 'No direct visible effect, but indexing can become inconsistent.', seoImpact: 'Conflicting canonical signals can prevent the preferred URL from being understood.',
      technicalExplanation: 'A page should emit one consistent canonical preference.', plainLanguageExplanation: 'The page tells search engines more than once which URL is the main version.',
      recommendedFix: 'Emit exactly one absolute canonical URL that agrees with redirects, internal links, and sitemap entries.', implementationGuidance: guidance(page, 'Remove duplicate framework/plugin output and keep one canonical link.'),
      expectedResult: 'A consistent canonical signal.', verificationMethod: 'Inspect rendered HTML and verify one canonical tag whose URL resolves successfully.', measurementClass: 'deterministic', tags: ['canonical', 'indexability'],
    }));
  }
  if (/\bnoindex\b/i.test(inspected.metaRobots)) {
    result.push(issue(page, {
      title: 'Page carries a noindex directive', category: 'indexability', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'configuration change',
      evidence: `robots meta content: “${safeEvidence(inspected.metaRobots)}”`, evidenceSource: 'HTML metadata inspector',
      userImpact: 'People can still use the page directly.', seoImpact: 'Compliant search engines are instructed not to include this page in search results.',
      technicalExplanation: 'The robots meta tag contains noindex.', plainLanguageExplanation: 'This page is explicitly asking not to appear in search.',
      recommendedFix: 'If the page should rank, remove noindex after confirming it is not a staging, account, search, or duplicate page.', implementationGuidance: guidance(page, 'Change the route-level robots metadata only after confirming the intended indexing policy.'),
      expectedResult: 'The page becomes eligible for indexing; indexing is still not guaranteed.', verificationMethod: 'Inspect the rendered meta tag, then use Search Console URL Inspection after deployment.', measurementClass: 'deterministic', tags: ['indexability'],
    }));
  }
  return result;
}

function structureFindings(page) {
  const result = [];
  const inspected = page.inspection;
  if (!inspected) return result;
  const h1s = inspected.headings.filter((heading) => heading.level === 1);
  if (h1s.length === 0) {
    result.push(issue(page, {
      title: 'No level-one heading identifies the page', category: 'semantic HTML', severity: 'medium', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: `${inspected.headings.length} headings found; none is <h1>.`, evidenceSource: 'HTML heading inspector',
      userImpact: 'Screen-reader and scanning users lack a clear page heading.', seoImpact: 'Search engines can still understand the page, but the primary topic is less explicit.',
      technicalExplanation: 'The heading outline has no h1.', plainLanguageExplanation: 'The page looks like it has content but does not label its main topic in the document structure.',
      recommendedFix: 'Use one descriptive h1 for the page’s primary visible heading.', implementationGuidance: guidance(page, 'Change the primary heading component to an <h1>; keep visual styling in CSS.'),
      expectedResult: 'A clearer page structure for people and machines.', verificationMethod: 'Inspect the accessibility tree or rerun the heading check.', measurementClass: 'deterministic', tags: ['heading', 'accessibility', 'messaging'],
    }));
  } else if (h1s.length > 1) {
    result.push(issue(page, {
      title: 'Multiple level-one headings weaken the page outline', category: 'semantic HTML', severity: 'low', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: `${h1s.length} h1 elements: ${h1s.map((heading) => `“${safeEvidence(heading.text, 80)}”`).join(', ')}`, evidenceSource: 'HTML heading inspector',
      userImpact: 'People navigating by headings may not know which heading names the page.', seoImpact: 'Multiple h1 elements are not inherently a Google violation, but a clearer document outline improves interpretation.',
      technicalExplanation: 'The page has more than one top-level heading; this is a usability review trigger, not an automatic SEO penalty.', plainLanguageExplanation: 'More than one heading claims to be the page’s main heading.',
      recommendedFix: 'Keep the page title as h1 and demote subsection headings to the appropriate level.', implementationGuidance: guidance(page, 'Update semantic heading levels without changing their visual design.'),
      expectedResult: 'A more predictable outline.', verificationMethod: 'Review the heading tree in browser accessibility tools.', measurementClass: 'deterministic', tags: ['heading', 'accessibility'],
    }));
  }
  for (let index = 1; index < inspected.headings.length; index += 1) {
    const previous = inspected.headings[index - 1];
    const current = inspected.headings[index];
    if (current.level > previous.level + 1) {
      result.push(issue(page, {
        title: 'Heading levels skip part of the hierarchy', category: 'accessibility', severity: 'medium', confidence: 'confirmed', effort: 'small', changeType: 'code change',
        evidence: `h${previous.level} “${safeEvidence(previous.text, 80)}” is followed by h${current.level} “${safeEvidence(current.text, 80)}”.`, evidenceSource: 'HTML heading inspector',
        userImpact: 'The outline can be confusing for people who navigate headings with assistive technology.', seoImpact: 'No direct ranking rule was inferred; semantic structure supports clearer content understanding.',
        technicalExplanation: 'A heading level was skipped in document order.', plainLanguageExplanation: 'The page jumps over a section level, like going from chapter to sub-subsection.',
        recommendedFix: 'Choose heading levels by nesting, not font size.', implementationGuidance: guidance(page, `Change the heading near line ${current.line} to the appropriate semantic level.`, current.line),
        expectedResult: 'A logical heading outline.', verificationMethod: 'Rerun the heading check and inspect the accessibility tree.', measurementClass: 'deterministic', tags: ['heading', 'accessibility', 'messaging'],
      }));
      break;
    }
  }
  if (!inspected.language) {
    result.push(issue(page, {
      title: 'Document language is not declared', category: 'accessibility', severity: 'medium', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: 'The html element has no lang attribute.', evidenceSource: 'HTML semantic inspector',
      userImpact: 'Screen readers may pronounce words using the wrong language rules.', seoImpact: 'No direct ranking penalty is claimed.',
      technicalExplanation: 'The root html element lacks a valid language code.', plainLanguageExplanation: 'The browser is not told what language the page uses.',
      recommendedFix: 'Set the primary BCP 47 language code, such as lang="en"; localize it on translated variants.', implementationGuidance: guidance(page, 'Set lang on the root html element or framework document shell.'),
      expectedResult: 'More accurate assistive-technology pronunciation.', verificationMethod: 'Inspect the rendered html element and rerun accessibility checks.', measurementClass: 'deterministic', tags: ['accessibility', 'international'],
    }));
  }
  if (!inspected.viewport) {
    result.push(issue(page, {
      title: 'Mobile viewport metadata is missing', category: 'mobile usability', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'quick win',
      evidence: 'No meta[name="viewport"] was found.', evidenceSource: 'HTML metadata inspector',
      userImpact: 'Mobile browsers may render the page at a desktop-sized layout, making text and controls difficult to use.', seoImpact: 'Poor mobile usability can reduce search performance and engagement.',
      technicalExplanation: 'The document head does not declare a responsive viewport.', plainLanguageExplanation: 'Phones are not told to size the page to the screen.',
      recommendedFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> and test responsive layouts.', implementationGuidance: guidance(page, 'Add the viewport metadata once in the shared document head.'),
      expectedResult: 'The CSS viewport matches the device width.', verificationMethod: 'Test at 320, 375, 412, and 768 CSS pixels and rerun Lighthouse.', measurementClass: 'deterministic', tags: ['mobile'],
    }));
  }
  if (inspected.landmarks.main === 0) {
    result.push(issue(page, {
      title: 'Main content landmark is missing', category: 'semantic HTML', severity: 'low', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: 'No <main> element was found.', evidenceSource: 'HTML semantic inspector',
      userImpact: 'Assistive-technology users cannot jump directly to the primary content.', seoImpact: 'No direct ranking effect is claimed.',
      technicalExplanation: 'The document does not identify its primary content landmark.', plainLanguageExplanation: 'The page does not mark which content is the main part.',
      recommendedFix: 'Wrap the unique primary content in one main element.', implementationGuidance: guidance(page, 'Add one <main> around route content, outside repeated navigation and footer.'),
      expectedResult: 'Faster landmark navigation.', verificationMethod: 'Inspect landmarks in the accessibility tree.', measurementClass: 'deterministic', tags: ['accessibility', 'semantic'],
    }));
  }
  return result;
}

function mediaAndDataFindings(page) {
  const result = [];
  const inspected = page.inspection;
  if (!inspected) return result;
  const missingAlt = inspected.images.filter((image) => image.alt === undefined);
  if (missingAlt.length) {
    result.push(issue(page, {
      title: 'Images omit alternative-text attributes', category: 'accessibility', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: `${missingAlt.length} image(s) omit alt; first: ${safeEvidence(missingAlt[0].src ?? '[inline image]')}`, evidenceSource: 'HTML image inspector',
      userImpact: 'Screen-reader users may not receive the meaning of informative images.', seoImpact: 'Search engines have less context for image content.',
      technicalExplanation: 'The img elements have no alt attribute. Decorative images should use alt=""; informative images need equivalent concise text.', plainLanguageExplanation: 'Some images have no text alternative.',
      recommendedFix: 'Add accurate alt text to informative images and empty alt attributes to decorative images.', implementationGuidance: guidance(page, `Start with the image near line ${missingAlt[0].line}; derive text from actual visible meaning, not filenames.`, missingAlt[0].line),
      expectedResult: 'Images have an accessible text equivalent without keyword stuffing.', verificationMethod: 'Rerun Axe/Lighthouse and review alt text in context.', measurementClass: 'deterministic', tags: ['image', 'accessibility', 'seo'],
    }));
  }
  const unsized = inspected.images.filter((image) => !image.width || !image.height);
  if (unsized.length) {
    result.push(issue(page, {
      title: 'Images do not reserve intrinsic layout space', category: 'layout stability', severity: 'medium', confidence: 'likely', effort: 'small', changeType: 'code change',
      evidence: `${unsized.length} image(s) omit width and/or height attributes.`, evidenceSource: 'HTML image inspector',
      userImpact: 'Content can move as images load, causing missed taps or disrupted reading.', seoImpact: 'Unexpected shifts can contribute to poor CLS, a Core Web Vital; actual CLS requires measurement.',
      technicalExplanation: 'Without dimensions or an aspect-ratio reservation, image space may be unknown before download.', plainLanguageExplanation: 'The browser may not know how much room an image needs until it arrives.',
      recommendedFix: 'Provide correct width/height or an equivalent CSS aspect-ratio and keep responsive sizing.', implementationGuidance: guidance(page, 'Configure the image component to emit intrinsic dimensions; verify the rendered aspect ratio.'),
      expectedResult: 'More stable rendering and potentially lower CLS.', verificationMethod: 'Confirm dimensions in rendered HTML and compare median CLS across three Lighthouse runs.', measurementClass: 'environment-dependent', tags: ['image', 'cls', 'performance'],
    }));
  }
  const invalidJsonLd = inspected.jsonLd.filter((item) => item.error);
  if (invalidJsonLd.length) {
    result.push(issue(page, {
      title: 'Structured data contains invalid JSON', category: 'structured data', severity: 'high', confidence: 'confirmed', effort: 'small', changeType: 'code change',
      evidence: `JSON-LD near line ${invalidJsonLd[0].line}: ${safeEvidence(invalidJsonLd[0].error)}`, evidenceSource: 'JSON-LD parser',
      userImpact: 'No direct visible break may occur.', seoImpact: 'Invalid JSON-LD cannot be interpreted for eligible rich-result features.',
      technicalExplanation: 'The application/ld+json script failed JSON parsing.', plainLanguageExplanation: 'The machine-readable description is malformed.',
      recommendedFix: 'Generate valid JSON-LD from serialized data and include only truthful, visible-page information.', implementationGuidance: guidance(page, 'Fix JSON syntax, then validate the correct Google-supported type and its required properties.', invalidJsonLd[0].line),
      expectedResult: 'Parsers can read the structured data; rich-result display is never guaranteed.', verificationMethod: 'Run a JSON parser and Google Rich Results Test after deployment.', measurementClass: 'deterministic', tags: ['structured-data', 'seo'],
    }));
  }
  return result;
}

function responseFindings(page) {
  if (page.sourceType !== 'public URL') return [];
  const result = [];
  if (!page.status) {
    result.push(issue(page, {
      title: 'Page could not be fetched', category: 'crawlability', severity: 'high', confidence: 'confirmed', effort: 'unknown', changeType: 'monitoring',
      evidence: safeEvidence(page.error ?? 'No HTTP response received.'), evidenceSource: 'HTTP fetcher',
      userImpact: 'Visitors or audit tools may be unable to reach the page.', seoImpact: 'A consistently unreachable page cannot be crawled normally.',
      technicalExplanation: 'The audit environment did not receive a usable response. Network or sandbox restrictions remain possible.', plainLanguageExplanation: 'The page did not load for this audit.',
      recommendedFix: 'Retry from an unrestricted network, then investigate DNS, TLS, server, firewall, or authentication if it still fails.', implementationGuidance: 'Repository access may be needed after reachability is reproduced; no exact code cause can be confirmed from this failed request.',
      expectedResult: 'A successful 200-class response for public content.', verificationMethod: 'Fetch from two networks and inspect server logs if available.', repositoryAccessRequired: true,
      measurementClass: 'environment-dependent', tags: ['crawlability'],
    }));
    return result;
  }
  if (page.status >= 400) {
    result.push(issue(page, {
      title: `Page returns HTTP ${page.status}`, category: 'crawlability', severity: page.status >= 500 ? 'critical' : 'high', confidence: 'confirmed', effort: 'unknown', changeType: 'configuration change',
      evidence: `Final HTTP status: ${page.status}`, evidenceSource: 'HTTP fetcher',
      userImpact: 'Visitors cannot access the intended page normally.', seoImpact: 'Error responses are not usable indexable page content.',
      technicalExplanation: 'The deployed URL returned an error response.', plainLanguageExplanation: 'The server says this page is unavailable.',
      recommendedFix: 'Restore the intended page or redirect obsolete URLs to the closest relevant replacement.', implementationGuidance: publicGuidance('Inspect hosting routes, deployment output, and server logs; do not redirect every missing URL to the homepage.'),
      expectedResult: 'A relevant 200 response or intentional permanent redirect.', verificationMethod: 'Fetch the URL and follow the complete redirect chain.', measurementClass: 'relatively stable', tags: ['crawlability', 'broken-link'],
    }));
  }
  const headers = Object.fromEntries(Object.entries(page.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
  const missing = [
    ...(String(page.finalUrl ?? page.url ?? '').startsWith('https://') ? [['strict-transport-security', 'Strict-Transport-Security']] : []),
    ['content-security-policy', 'Content-Security-Policy'],
    ['x-content-type-options', 'X-Content-Type-Options'],
    ['referrer-policy', 'Referrer-Policy'],
  ].filter(([key]) => !headers[key]).map(([, label]) => label);
  if (missing.length) {
    result.push(issue(page, {
      title: 'Basic defensive response headers are absent', category: 'security headers', severity: 'low', confidence: 'confirmed', effort: 'medium', changeType: 'configuration change',
      evidence: `Not observed: ${missing.join(', ')}`, evidenceSource: 'HTTP response header inspector',
      userImpact: 'The browser has fewer explicit protections against some injection, MIME confusion, or referrer leakage risks.', seoImpact: 'No direct ranking effect is claimed; this is a best-practice observation.',
      technicalExplanation: 'Headers were absent on the audited response. Suitability and exact policy values depend on the application.', plainLanguageExplanation: 'The site is not sending some optional browser safety instructions.',
      recommendedFix: 'Add appropriate headers at the CDN/host/application layer, testing CSP in report-only mode before enforcement.', implementationGuidance: publicGuidance('Ask the host or developer to configure the missing headers without breaking required scripts or embeds.'),
      expectedResult: 'Stronger browser-side defenses.', verificationMethod: 'Re-fetch the deployed page, inspect headers, and run functional tests.', measurementClass: 'relatively stable', tags: ['security'],
    }));
  }
  return result;
}

export function technicalFindingsForPage(page) {
  if (!page.inspection) return responseFindings(page);
  const result = [
    ...responseFindings(page),
    ...metadataFindings(page),
    ...structureFindings(page),
    ...mediaAndDataFindings(page),
  ];
  if (page.inspection.security.promptInjectionDetected) {
    result.push(issue(page, {
      title: 'Instruction-like page content was ignored', category: 'audit safety', severity: 'informational', confidence: 'confirmed', effort: 'unknown', changeType: 'monitoring',
      evidence: 'Prompt-injection-like text was detected; its contents were not followed or reproduced.', evidenceSource: 'Untrusted-content safety scanner',
      userImpact: 'No website-user impact was established.', seoImpact: 'No direct search impact was established.',
      technicalExplanation: 'Website content is audit data and cannot direct the auditing agent.', plainLanguageExplanation: 'The page contained text that looked like instructions to the auditor, so the auditor ignored it.',
      recommendedFix: 'No change is required if this text is legitimate user-facing content; remove it if it was unintentionally exposed.', implementationGuidance: guidance(page, 'Review the page content without copying suspected instructions or secrets into reports.'),
      expectedResult: 'The audit remains scoped to website analysis.', verificationMethod: 'Confirm that no page-supplied command affected the audit workflow.', measurementClass: 'deterministic', tags: ['safety'],
    }));
  }
  if (page.inspection.security.sensitiveTypes.length) {
    result.push(issue(page, {
      title: 'Potential sensitive information is publicly visible', category: 'privacy and security', severity: 'critical', confidence: 'likely', effort: 'unknown', changeType: 'structural fix',
      evidence: `Sensitive-looking pattern type(s): ${page.inspection.security.sensitiveTypes.join(', ')}. Values were redacted.`, evidenceSource: 'Sensitive-data signature scanner',
      userImpact: 'Exposed credentials or private material could harm users and the organization.', seoImpact: 'Search indexing can make accidental exposure harder to contain.',
      technicalExplanation: 'Pattern matching suggests a secret-like value, but a human must confirm before rotation or removal.', plainLanguageExplanation: 'The page may be showing information that should be private.',
      recommendedFix: 'Confirm immediately; if genuine, revoke/rotate the secret, remove it from output and history, redeploy, and request cache/search removal where needed.', implementationGuidance: guidance(page, 'Do not paste the suspected value into tickets or reports. Inspect the source securely and involve the credential owner.'),
      expectedResult: 'Sensitive material is no longer publicly retrievable and compromised credentials are invalid.', verificationMethod: 'Confirm revocation with the owning service and fetch the page/cache without exposing the value.', measurementClass: 'deterministic', tags: ['sensitive-data'],
    }));
  }
  return result;
}

function isInternalHref(href) {
  return href && (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) && !href.startsWith('//');
}

export function localBrokenLinkFindings(pages, knownRoutes) {
  const routes = new Set(knownRoutes.map((route) => route.replace(/\/$/, '') || '/'));
  const findings = [];
  for (const page of pages) {
    for (const link of page.inspection?.links ?? []) {
      if (!isInternalHref(link.href) || link.href.startsWith('/#')) continue;
      const clean = link.href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
      if (/\.[a-z0-9]{2,5}$/i.test(clean)) continue;
      if (!routes.has(clean)) {
        findings.push(issue(page, {
          title: 'Internal link points to an unknown local route', category: 'internal links', severity: 'high', confidence: 'likely', effort: 'small', changeType: 'quick win',
          evidence: `Link “${safeEvidence(link.text, 80)}” targets ${safeEvidence(link.href)} near line ${link.line}.`, evidenceSource: 'Repository route and link checker',
          userImpact: 'Visitors may land on a not-found page.', seoImpact: 'Broken internal links waste crawl paths and weaken discoverability.',
          technicalExplanation: 'The target did not match a discovered repository route; dynamic or externally generated routes remain a possible exception.', plainLanguageExplanation: 'A link appears to lead to a page that does not exist in the repository.',
          recommendedFix: 'Correct the destination, create the intended route, or remove the link.', implementationGuidance: localGuidance(page, 'Update the href and verify dynamic route generation if applicable.', link.line),
          expectedResult: 'The link reaches a relevant page without an error.', verificationMethod: 'Build the site and request the target URL; rerun the link checker.', measurementClass: 'relatively stable', tags: ['links', 'crawlability'],
        }));
      }
    }
  }
  return findings;
}

export function siteDirectiveFindings(inputType, discovery) {
  if (inputType !== 'public-url') return [];
  const findings = [];
  const page = { url: discovery.startUrl, sourceType: 'public URL' };
  if (!discovery.robots?.ok) {
    findings.push(issue(page, {
      title: 'robots.txt was not available', category: 'robots directives', severity: 'low', confidence: 'confirmed', effort: 'small', changeType: 'configuration change',
      evidence: discovery.errors.find((error) => error.startsWith('robots.txt')) ?? 'robots.txt did not return a usable response.', evidenceSource: 'Public robots.txt fetcher',
      userImpact: 'No direct visitor effect.', seoImpact: 'A robots file is not required for crawling, but it is needed when deliberate crawl rules or sitemap discovery are expected.',
      technicalExplanation: 'The conventional root robots.txt endpoint was unavailable.', plainLanguageExplanation: 'The site has no readable crawler instruction file at the usual location.',
      recommendedFix: 'If crawl rules are needed, publish a valid UTF-8 /robots.txt; do not use it to hide confidential content or as a canonicalization tool.', implementationGuidance: publicGuidance('Configure the host to serve /robots.txt as plain text and include a Sitemap directive where useful.'),
      expectedResult: 'Crawlers can retrieve intentional rules.', verificationMethod: 'Fetch /robots.txt publicly and test important URLs against its rules.', measurementClass: 'relatively stable', tags: ['robots', 'crawlability'],
    }));
  }
  if (!discovery.sitemap?.urls?.length) {
    findings.push(issue(page, {
      title: 'No usable XML sitemap was discovered', category: 'sitemap', severity: 'low', confidence: 'confirmed', effort: 'small', changeType: 'configuration change',
      evidence: discovery.errors.filter((error) => error.startsWith('sitemap')).join(' | ') || 'No <loc> URLs were found.', evidenceSource: 'robots.txt and sitemap fetcher',
      userImpact: 'No direct visitor effect.', seoImpact: 'Search engines can discover pages through links, but a sitemap can improve canonical URL discovery and monitoring, especially for larger sites.',
      technicalExplanation: 'Neither a robots-declared sitemap nor /sitemap.xml yielded usable URLs.', plainLanguageExplanation: 'The site does not provide a working list of important public pages.',
      recommendedFix: 'Generate an XML sitemap containing canonical, indexable absolute URLs and expose it at a stable URL.', implementationGuidance: publicGuidance('Enable the framework/CMS sitemap feature, exclude error/noindex/redirect URLs, and reference it from robots.txt.'),
      expectedResult: 'Important canonical URLs are easier to discover and submit.', verificationMethod: 'Fetch and parse the sitemap, sample its URLs, then submit it in Search Console if available.', measurementClass: 'relatively stable', tags: ['sitemap', 'crawlability'],
    }));
  }
  return findings;
}

export function createTechnicalFindings({ pages, inputType, discovery }) {
  const findings = pages.flatMap(technicalFindingsForPage);
  if (inputType === 'local') findings.push(...localBrokenLinkFindings(pages, discovery.routes.map((item) => item.route)));
  findings.push(...siteDirectiveFindings(inputType, discovery));
  return mergeDuplicateFindings(findings);
}
