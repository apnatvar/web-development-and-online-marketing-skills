import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCopyFindings, validateIntent } from './copy.mjs';
import { mergeCombinedAudit } from './combined.mjs';
import { mergeDuplicateFindings, prioritizeFindings } from './findings.mjs';
import { readJson, writeJson, ensureDirectory } from './fs-utils.mjs';
import { loadKnowledgeStatus } from './knowledge.mjs';
import { checkPublicLinks, findingsFromPublicLinks } from './links.mjs';
import { findingsFromLighthouse, runLighthouseForUrl } from './lighthouse.mjs';
import { inspectPublicPages, proposePublicPages, discoverPublicPages } from './public-site.mjs';
import { discoverRoutes, inspectRepositoryPages, proposeRoutes } from './repository.mjs';
import { createTechnicalFindings } from './technical.mjs';
import { checkTools } from './tools.mjs';
import { writeReport } from './report.mjs';

export function modulesForMode(mode) {
  if (mode === 'technical') return ['technical', 'seo knowledge metadata', 'lighthouse'];
  if (mode === 'copy') return ['copy and messaging', 'seo knowledge metadata'];
  if (mode === 'combined') return ['technical', 'copy and messaging', 'combined synthesis', 'seo knowledge metadata', 'lighthouse'];
  throw new Error('Mode must be technical, copy, or combined.');
}

function gitCommit(repositoryRoot) {
  try {
    return execFileSync('git', ['-C', repositoryRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 5000, windowsHide: true }).trim();
  } catch {
    return null;
  }
}

function joinUrl(baseUrl, route) {
  return new URL(route.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).href;
}

function summarize(mode, findings, pages) {
  const high = findings.filter((item) => ['critical', 'high'].includes(item.severity)).length;
  const first = findings.find((item) => item.priorityGroup === 'fix first') ?? findings[0];
  return `${pages.length} page(s) were audited in ${mode} mode. ${high} critical/high-severity finding(s) were identified.${first ? ` Start with “${first.title}”.` : ' No issues were identified by the modules that ran; manual review and real-user data may still reveal problems.'}`;
}

async function loadIntent(intent, intentPath) {
  if (intent) return intent;
  if (!intentPath) return null;
  return JSON.parse(await readFile(intentPath, 'utf8'));
}

export async function proposePages({ inputType, input, skillRoot }) {
  const defaults = await readJson(path.join(skillRoot, 'config', 'audit.defaults.json'));
  const maximum = defaults.pageSelection.maximumPagesWithoutApproval;
  if (inputType === 'local') {
    const discovery = await discoverRoutes(input);
    return { discovery, proposed: proposeRoutes(discovery.routes, maximum) };
  }
  if (inputType === 'public-url') {
    const discovery = await discoverPublicPages(input, defaults.network);
    return { discovery, proposed: proposePublicPages(discovery, maximum) };
  }
  throw new Error('Input type must be local or public-url.');
}

export async function runAudit(options) {
  const {
    skillRoot, mode, inputType, input, outputDirectory,
    outputFormat = 'markdown', selectedPages = [], approveDefaultPages = false,
    baseUrl = null, lighthouse = mode !== 'copy', allowPartial = false,
    buildMode = inputType === 'local' ? 'source inspection' : 'deployed',
  } = options;
  const modules = modulesForMode(mode);
  if (!['local', 'public-url'].includes(inputType)) throw new Error('Input type must be local or public-url.');
  if (!['markdown', 'html'].includes(outputFormat)) throw new Error('Output format must be markdown or html. PDF is not supported.');
  if (!input) throw new Error('An existing local repository path or public HTTP(S) URL is required.');
  const intent = await loadIntent(options.intent, options.intentPath);
  if (['copy', 'combined'].includes(mode)) {
    const errors = validateIntent(intent);
    if (errors.length) throw new Error(`Copy and combined audits require complete website intent:\n- ${errors.join('\n- ')}`);
  }
  if (!selectedPages.length && !approveDefaultPages) {
    throw new Error('Select pages before analysis or pass approveDefaultPages=true after reviewing the proposed representative set.');
  }
  const defaults = await readJson(path.join(skillRoot, 'config', 'audit.defaults.json'));
  const lighthouseBaseline = await readJson(path.join(skillRoot, 'config', 'lighthouse-baseline.json'));
  const capabilities = checkTools(skillRoot);
  const limitations = [];
  let inspected;
  if (inputType === 'local') {
    inspected = await inspectRepositoryPages(input, selectedPages);
  } else {
    inspected = await inspectPublicPages(input, selectedPages, defaults.network);
    limitations.push('Public-URL inspection can confirm rendered-response output but cannot prove the exact source file, component, plugin, or code-level cause.');
    if (inspected.discovery.errors.length) limitations.push(...inspected.discovery.errors.map((error) => `Discovery limitation: ${error}`));
  }
  if (!inspected.pages.length) throw new Error('No auditable pages were selected or discovered.');

  let technical = [];
  if (mode !== 'copy') {
    technical = createTechnicalFindings({ pages: inspected.pages, inputType, discovery: inspected.discovery });
    if (inputType === 'public-url') {
      const linkCheck = await checkPublicLinks(inspected.pages, { timeoutMs: defaults.network.timeoutMs });
      technical.push(...findingsFromPublicLinks(linkCheck));
      if (linkCheck.truncated) limitations.push(`Broken-link checks were limited to 40 of ${linkCheck.totalCandidates} discovered link targets.`);
    }
  }
  let copy = [];
  if (mode !== 'technical') copy = createCopyFindings({ pages: inspected.pages, intent });

  const lighthouseResults = [];
  if (lighthouse && mode !== 'copy') {
    const urls = inspected.pages.map((page) => inputType === 'public-url' ? (page.finalUrl ?? page.url) : (baseUrl ? joinUrl(baseUrl, page.route) : null));
    if (urls.some((url) => !url)) {
      const message = 'Lighthouse needs a served URL for local repositories. Build/serve the site and provide --base-url; source files alone cannot be measured.';
      if (!allowPartial) throw new Error(message);
      limitations.push(message);
    } else if (!capabilities.node.available || !capabilities.lighthouse.available || !capabilities.chrome.available) {
      const message = `Lighthouse could not run: ${!capabilities.node.available ? 'use Node.js 22.19 or newer; ' : ''}${!capabilities.lighthouse.available ? 'install exact package 13.4.1 with npm install; ' : ''}${!capabilities.chrome.available ? 'install Chrome or set CHROME_PATH; ' : ''}browser launch may require sandbox approval.`;
      if (!allowPartial) throw new Error(message);
      limitations.push(message);
    } else {
      for (let index = 0; index < urls.length; index += 1) {
        try {
          const result = await runLighthouseForUrl({
            skillRoot, url: urls[index], outputRoot: outputDirectory,
            numberOfRuns: defaults.lighthouse.numberOfRuns, categories: defaults.lighthouse.categories,
          });
          lighthouseResults.push({ page: inspected.pages[index], ...result });
          if (result.summary.runtimeWarnings?.length) limitations.push(...result.summary.runtimeWarnings.map((warning) => `Lighthouse runtime warning for ${urls[index]}: ${warning}`));
          technical.push(...findingsFromLighthouse(result.summary, inspected.pages[index]));
        } catch (error) {
          if (!allowPartial) throw error;
          limitations.push(`Lighthouse failed for ${urls[index]}: ${error.message}`);
        }
      }
    }
  } else if (mode !== 'copy') {
    limitations.push('Lighthouse was explicitly disabled; performance, accessibility, SEO, and best-practice scores are not included.');
  }

  const unprioritized = mode === 'combined' ? mergeCombinedAudit(technical, copy) : mergeDuplicateFindings(mode === 'technical' ? technical : copy);
  const prioritization = prioritizeFindings(unprioritized);
  const finalFindingIds = new Set(prioritization.findings.map((finding) => finding.id));
  const supersededFindings = mode === 'combined'
    ? [...technical, ...copy].filter((finding) => !finalFindingIds.has(finding.id))
    : [];
  const seoKnowledge = await loadKnowledgeStatus(skillRoot, options.now);
  if (seoKnowledge.warning) limitations.push(seoKnowledge.warning);
  limitations.push('Automated accessibility checks do not replace keyboard, screen-reader, zoom, contrast-context, and cognitive usability testing.');
  limitations.push('Analytics, Search Console, server logs, conversion data, and field Core Web Vitals were not available unless the user supplied them.');
  if (mode !== 'technical') limitations.push('Copy heuristics require human editorial judgment and never authorize invented claims, results, testimonials, certifications, statistics, or capabilities.');

  const rawResultPaths = lighthouseResults.flatMap((result) => [...result.rawResultPaths, path.relative(outputDirectory, result.medianPath).replaceAll('\\', '/')]);
  const report = {
    schemaVersion: '1.0.0', reportVersion: defaults.reportVersion, auditDate: (options.now ?? new Date()).toISOString(), mode,
    input: { type: inputType, target: input, baseUrl }, intent: mode === 'technical' ? null : intent,
    pages: inspected.pages.map((page) => ({ label: page.url ?? page.route ?? page.file, source: page.file ?? page.finalUrl ?? page.url, status: page.status })),
    summary: '', findings: prioritization.findings, priorities: { groups: prioritization.groups, quickWins: prioritization.quickWins, byChangeType: prioritization.byChangeType },
    supersededFindings,
    lighthouse: lighthouseResults.map(({ summary, medianPath, rawResultPaths: paths }) => ({ summary, medianPath: path.relative(outputDirectory, medianPath).replaceAll('\\', '/'), rawResultPaths: paths })),
    seoKnowledge, limitations: [...new Set(limitations)],
    reproducibility: {
      auditDate: (options.now ?? new Date()).toISOString(), modules, buildMode,
      repositoryCommit: inputType === 'local' ? gitCommit(input) : null,
      nodeVersion: process.versions.node,
      lighthouseVersions: [...new Set(lighthouseResults.map((item) => item.summary.runtime.lighthouseVersion).filter(Boolean))],
      chromeVersions: [...new Set(lighthouseResults.map((item) => item.summary.runtime.chromeVersion).filter(Boolean))],
      lighthouseBaseline,
      pageSelection: selectedPages.length ? 'user-selected/approved explicit pages' : 'approved representative defaults',
      medianRule: 'Median per category score, audit score, and numeric metric across three cold-cache runs.',
      rawResultPaths,
      capabilities,
    },
  };
  report.summary = summarize(mode, report.findings, report.pages);
  await ensureDirectory(path.join(outputDirectory, 'raw'));
  await writeJson(path.join(outputDirectory, 'raw', 'audit-data.json'), report);
  await writeJson(path.join(outputDirectory, 'raw', 'audit-config.json'), {
    mode, inputType, input, outputFormat, selectedPages, approveDefaultPages, baseUrl, lighthouse, buildMode,
    lighthouseBaseline, seoKnowledgeVerificationDate: seoKnowledge.lastVerified,
  });
  const reportPath = await writeReport(report, outputDirectory, outputFormat);
  return { report, reportPath, outputDirectory };
}
