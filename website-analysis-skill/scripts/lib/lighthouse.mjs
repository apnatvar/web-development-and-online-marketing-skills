import { spawn } from 'node:child_process';
import { readFile, rm, unlink } from 'node:fs/promises';
import path from 'node:path';
import { ensureDirectory, readJson, safeSlug, writeJson } from './fs-utils.mjs';
import { makeFinding } from './findings.mjs';
import { checkTools } from './tools.mjs';

export function median(values) {
  const usable = values.filter((value) => Number.isFinite(value)).sort((left, right) => left - right);
  if (!usable.length) return null;
  const middle = Math.floor(usable.length / 2);
  return usable.length % 2 ? usable[middle] : (usable[middle - 1] + usable[middle]) / 2;
}

export function classifyLighthouseAudit(auditId, categoryId = '') {
  if (['performance', 'largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'interactive', 'total-blocking-time', 'cumulative-layout-shift', 'interaction-to-next-paint'].includes(auditId) || categoryId === 'performance') {
    return 'variable performance';
  }
  if (/viewport|document-title|meta-description|canonical|hreflang|robots|is-crawlable|structured-data|html-has-lang|heading-order|image-alt/.test(auditId)) {
    return 'deterministic';
  }
  if (/cache|compression|redirect|server-response|document-latency|network/.test(auditId)) return 'environment-dependent';
  return 'relatively stable';
}

export function calculateMedianLighthouse(lhrs, options = {}) {
  if (!Array.isArray(lhrs) || lhrs.length < 2) throw new Error('At least two Lighthouse results are required for a median summary.');
  const first = lhrs[0];
  const categoryIds = [...new Set(lhrs.flatMap((lhr) => Object.keys(lhr.categories ?? {})))];
  const auditIds = [...new Set(lhrs.flatMap((lhr) => Object.keys(lhr.audits ?? {})))];
  const categories = {};
  for (const id of categoryIds) {
    categories[id] = {
      title: first.categories?.[id]?.title ?? id,
      score: median(lhrs.map((lhr) => lhr.categories?.[id]?.score).filter(Number.isFinite)),
      scorePercent: median(lhrs.map((lhr) => Number.isFinite(lhr.categories?.[id]?.score) ? lhr.categories[id].score * 100 : null)),
      measurementClass: classifyLighthouseAudit(id, id),
    };
  }
  const audits = {};
  for (const id of auditIds) {
    const records = lhrs.map((lhr) => lhr.audits?.[id]).filter(Boolean);
    const score = median(records.map((record) => record.score).filter(Number.isFinite));
    const numericValue = median(records.map((record) => record.numericValue).filter(Number.isFinite));
    if (score === null && numericValue === null) continue;
    const representative = records.find((record) => numericValue !== null && record.numericValue === numericValue)
      ?? records.find((record) => score !== null && record.score === score)
      ?? records[0];
    audits[id] = {
      title: representative.title ?? id,
      description: representative.description ?? '',
      score,
      numericValue,
      numericUnit: representative.numericUnit ?? null,
      displayValue: representative.displayValue ?? null,
      measurementClass: classifyLighthouseAudit(id),
    };
  }
  const hostAgent = first.environment?.hostUserAgent ?? '';
  const chromeVersion = hostAgent.match(/(?:Chrome|HeadlessChrome)\/([\d.]+)/)?.[1] ?? null;
  return {
    schemaVersion: '1.0.0',
    url: first.finalDisplayedUrl ?? first.finalUrl ?? first.requestedUrl ?? options.url ?? '',
    requestedUrl: first.requestedUrl ?? options.url ?? '',
    runs: lhrs.length,
    aggregation: 'median',
    categories,
    audits,
    runtime: {
      lighthouseVersion: first.lighthouseVersion ?? null,
      chromeVersion,
      nodeVersion: process.versions.node,
      hostUserAgent: hostAgent,
      benchmarkIndexMedian: median(lhrs.map((lhr) => lhr.environment?.benchmarkIndex).filter(Number.isFinite)),
    },
    configuration: {
      formFactor: first.configSettings?.formFactor ?? null,
      throttlingMethod: first.configSettings?.throttlingMethod ?? null,
      screenEmulation: first.configSettings?.screenEmulation ?? null,
      throttling: first.configSettings?.throttling ?? null,
      categories: Object.keys(categories),
      cacheState: 'cold; storage reset enabled',
    },
    rawResultPaths: options.rawResultPaths ?? [],
    variabilityNote: 'Standardized simulated throttling improves comparability but does not make performance measurements deterministic. Use field data for real-user Core Web Vitals.',
  };
}

export function generateLighthouseInvocation({ skillRoot, url, outputPath, chromePath, configPath, categories }) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`Lighthouse URL must use HTTP(S): ${url}`);
  const cliModule = path.join(skillRoot, 'node_modules', 'lighthouse', 'cli', 'index.js');
  return {
    command: process.execPath,
    args: [
      cliModule,
      parsed.href,
      `--config-path=${configPath}`,
      `--chrome-path=${chromePath}`,
      `--only-categories=${categories.join(',')}`,
      '--output=json',
      `--output-path=${outputPath}`,
      '--chrome-flags=--headless=new --no-first-run --no-default-browser-check',
      '--max-wait-for-load=90000',
      '--quiet',
    ],
  };
}

export function lighthouseArtifactSlug(url) {
  const parsedUrl = new URL(url);
  const pageLabel = parsedUrl.pathname === '/'
    ? `${parsedUrl.hostname}-homepage`
    : `${parsedUrl.hostname}-${parsedUrl.pathname}`;
  return safeSlug(pageLabel);
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, env: { ...process.env, ...options.env }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Lighthouse exited ${code}: ${(stderr || stdout).trim().slice(-2000)}`));
    });
  });
}

export async function runLighthouseForUrl(options) {
  const {
    skillRoot, url, outputRoot, numberOfRuns = 3,
    categories = ['performance', 'accessibility', 'best-practices', 'seo'],
  } = options;
  if (numberOfRuns < 2) throw new Error('Run Lighthouse at least twice; three runs is the standard baseline.');
  const capabilities = checkTools(skillRoot);
  if (!capabilities.node.available || !capabilities.lighthouse.available || !capabilities.chrome.available) {
    const missing = [!capabilities.node.available && 'Node.js 22.19+', !capabilities.lighthouse.available && 'Lighthouse 13.4.1', !capabilities.chrome.available && 'Chrome/Chromium'].filter(Boolean);
    throw new Error(`Cannot run Lighthouse because ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} unavailable. Run npm install, set CHROME_PATH if needed, and request sandbox approval for browser launch.`);
  }
  const rawDirectory = await ensureDirectory(path.join(outputRoot, 'raw'));
  const resolvedOutputRoot = path.resolve(outputRoot);
  const temporaryRoot = path.join(resolvedOutputRoot, '.lighthouse-tmp');
  if (!temporaryRoot.startsWith(`${resolvedOutputRoot}${path.sep}`)) throw new Error('Refusing an unsafe Lighthouse temporary path.');
  await ensureDirectory(temporaryRoot);
  const slug = lighthouseArtifactSlug(url);
  const configPath = path.join(skillRoot, 'config', 'lighthouse.config.cjs');
  const rawResultPaths = [];
  const results = [];
  const runtimeWarnings = [];
  try {
    for (let run = 1; run <= numberOfRuns; run += 1) {
      const outputPath = path.join(rawDirectory, `${slug}-run-${String(run).padStart(2, '0')}.json`);
      await unlink(outputPath).catch(() => {});
      const invocation = generateLighthouseInvocation({
        skillRoot, url, outputPath, chromePath: capabilities.chrome.path, configPath, categories,
      });
      try {
        await runProcess(invocation.command, invocation.args, { cwd: skillRoot, env: { TEMP: temporaryRoot, TMP: temporaryRoot } });
      } catch (error) {
        let recovered = null;
        try { recovered = JSON.parse(await readFile(outputPath, 'utf8')); } catch {}
        const cleanupOnly = /destroyTmp|\\lighthouse\.\d+|lighthouse\.\d+.*(?:EPERM|permission denied)/i.test(error.message);
        if (!cleanupOnly || !recovered?.categories || recovered.runtimeError) throw error;
        runtimeWarnings.push(`Run ${run} produced a valid LHR but Chrome temporary-profile cleanup reported: ${error.message.split('\n')[0]}`);
      }
      const parsedResult = JSON.parse(await readFile(outputPath, 'utf8'));
      if (parsedResult.runtimeError) throw new Error(`Lighthouse runtime error for ${url}: ${parsedResult.runtimeError.message ?? parsedResult.runtimeError.code}`);
      results.push(parsedResult);
      rawResultPaths.push(path.relative(outputRoot, outputPath).replaceAll('\\', '/'));
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true }).catch(() => {});
  }
  const summary = calculateMedianLighthouse(results, { url, rawResultPaths });
  if (runtimeWarnings.length) summary.runtimeWarnings = runtimeWarnings;
  const medianPath = path.join(rawDirectory, `${slug}-median.json`);
  await writeJson(medianPath, summary);
  return { summary, medianPath, rawResultPaths };
}

const AUDIT_GUIDANCE = {
  'render-blocking-resources': ['Render-blocking resources delay meaningful content', 'Move critical CSS inline where justified, defer non-critical styles/scripts, and remove avoidable blocking requests.', 'medium', 'code change'],
  'render-blocking-insight': ['Render-blocking resources delay meaningful content', 'Shorten critical request chains; inline only genuinely critical CSS and defer the rest.', 'medium', 'code change'],
  'unused-javascript': ['Unused JavaScript increases page work', 'Remove unused dependencies/exports, split route bundles, and load optional features only when needed.', 'high', 'structural fix'],
  'unused-css-rules': ['Unused CSS increases transfer and style work', 'Remove dead selectors or scope styles so the audited route receives only what it uses.', 'medium', 'code change'],
  'legacy-javascript-insight': ['Legacy JavaScript adds avoidable bytes and work', 'Serve modern bundles to modern browsers and review transpilation/browser targets.', 'medium', 'configuration change'],
  'duplicated-javascript-insight': ['Duplicate JavaScript wastes bytes and execution', 'Deduplicate package versions and shared chunks after checking bundle analysis.', 'medium', 'structural fix'],
  'mainthread-work-breakdown': ['Main-thread work delays responsiveness', 'Break long tasks, reduce hydration/client rendering, and move heavy work off the initial interaction path.', 'high', 'structural fix'],
  'bootup-time': ['JavaScript execution cost is high', 'Reduce shipped JavaScript, defer non-essential initialization, and profile the largest script tasks.', 'high', 'structural fix'],
  'uses-long-cache-ttl': ['Static assets use short cache lifetimes', 'Serve fingerprinted static assets with long-lived immutable caching while keeping HTML safely revalidatable.', 'medium', 'configuration change'],
  'cache-insight': ['Caching policy leaves repeat visits slower', 'Use long-lived immutable caching for versioned assets and a deliberate revalidation policy for HTML/API responses.', 'medium', 'configuration change'],
  'uses-text-compression': ['Text resources are not compressed', 'Enable Brotli or gzip for HTML, CSS, JavaScript, JSON, SVG, and other text responses.', 'high', 'configuration change'],
  'redirects': ['Redirects delay the initial document', 'Link directly to the final canonical HTTPS URL and remove avoidable redirect hops.', 'medium', 'configuration change'],
  'document-latency-insight': ['Initial document response is slow', 'Measure server, CDN, and application time separately; cache safe output and remove avoidable redirects.', 'high', 'configuration change'],
  'image-delivery-insight': ['Images are larger than their rendered need', 'Resize to displayed dimensions, use modern formats where appropriate, and configure responsive srcset/sizes.', 'high', 'code change'],
  'uses-responsive-images': ['Images are oversized for their display size', 'Generate responsive variants and provide accurate srcset and sizes.', 'medium', 'code change'],
  'modern-image-formats': ['Modern image formats could reduce transfer', 'Generate WebP/AVIF variants while keeping a compatible fallback if needed.', 'medium', 'code change'],
  'font-display-insight': ['Font loading delays or destabilizes text', 'Subset fonts, preload only the critical face, use font-display deliberately, and use metric-compatible fallbacks.', 'medium', 'code change'],
};

function formatMetric(value, unit) {
  if (!Number.isFinite(value)) return 'not recorded';
  if (unit === 'millisecond') return `${Math.round(value)} ms`;
  if (unit === 'unitless') return String(Math.round(value * 1000) / 1000);
  if (unit === 'byte') return `${Math.round(value / 1024)} KiB`;
  return `${Math.round(value * 100) / 100}${unit ? ` ${unit}` : ''}`;
}

export function findingsFromLighthouse(summary, page) {
  const findings = [];
  const repositoryAccessRequired = page.sourceType !== 'local repository';
  const location = page.url ?? page.route ?? summary.url;
  const implementationPrefix = repositoryAccessRequired
    ? 'The exact implementation cause cannot be confirmed without repository access. A developer or site builder should '
    : `Inspect ${page.file ?? 'the route and shared layout'} and `;
  const metricRules = [
    ['largest-contentful-paint', 2500, 'Largest Contentful Paint exceeds the “good” threshold', 'high', 'Improve the actual LCP element: prioritize it, compress/right-size it if it is an image, and reduce server/render delay before it.', 'LCP measures when the likely main content becomes visible.'],
    ['interaction-to-next-paint', 200, 'Interaction to Next Paint exceeds the “good” threshold', 'high', 'Profile slow interactions, break long tasks, reduce DOM/render work, and provide immediate visual feedback.', 'INP measures real interaction responsiveness when available.'],
    ['total-blocking-time', 200, 'Total Blocking Time is elevated in the lab run', 'high', 'Break long main-thread tasks and reduce early JavaScript execution.', 'TBT is a lab diagnostic and is not a substitute for field INP.'],
    ['cumulative-layout-shift', 0.1, 'Cumulative Layout Shift exceeds the “good” threshold', 'high', 'Reserve space for images, embeds, banners, and late UI; stabilize font metrics and avoid inserting content above existing content.', 'CLS measures unexpected visible layout movement.'],
  ];
  for (const [id, threshold, title, severity, fix, explanation] of metricRules) {
    const audit = summary.audits[id];
    if (!audit || !Number.isFinite(audit.numericValue) || audit.numericValue <= threshold) continue;
    findings.push(makeFinding({
      title, category: 'Lighthouse performance', affectedPage: location, evidence: `Median across ${summary.runs} runs: ${formatMetric(audit.numericValue, audit.numericUnit)}; threshold: ${threshold}${audit.numericUnit === 'millisecond' ? ' ms' : ''}.`,
      evidenceSource: `Lighthouse ${summary.runtime.lighthouseVersion ?? 'runtime'} median`, severity, confidence: 'confirmed', userImpact: 'The measured delay or instability can make the page feel slow or unreliable.',
      seoImpact: id === 'total-blocking-time' ? 'No direct field threshold is inferred from this lab diagnostic.' : 'Poor field Core Web Vitals can contribute to page-experience concerns; lab results alone do not prove field performance.',
      conversionImpact: 'Slow or unstable experiences can interrupt comprehension and action.', technicalExplanation: `${explanation} This lab value is variable and environment-dependent.`,
      plainLanguageExplanation: 'The standardized test repeatedly observed a user-experience delay above the recommended good range.', recommendedFix: fix,
      implementationGuidance: `${implementationPrefix}${fix.charAt(0).toLowerCase()}${fix.slice(1)}`, expectedResult: 'A lower median lab metric and, after real traffic accumulates, potentially better field experience.',
      verificationMethod: `Repeat at least three runs with the same configuration and compare the median; check CrUX/Search Console field data at the 75th percentile where available.`,
      repositoryAccessRequired, effort: 'medium', changeType: 'structural fix', measurementClass: 'variable performance', tags: [id, 'performance'],
    }));
  }
  for (const [id, [title, fix, severity, changeType]] of Object.entries(AUDIT_GUIDANCE)) {
    const audit = summary.audits[id];
    if (!audit || audit.score === null || audit.score >= 0.9) continue;
    findings.push(makeFinding({
      title, category: 'Lighthouse opportunity', affectedPage: location, evidence: `Median audit score: ${Math.round(audit.score * 100)}${audit.displayValue ? `; ${audit.displayValue}` : ''}.`,
      evidenceSource: `Lighthouse ${summary.runtime.lighthouseVersion ?? 'runtime'} median`, severity, confidence: 'likely', userImpact: 'The issue can delay content or interaction depending on the affected resource.',
      seoImpact: 'Performance improvements support page experience; no ranking change is guaranteed.', conversionImpact: 'Faster, more stable pages reduce friction before the primary action.',
      technicalExplanation: `${audit.title}. Lighthouse results are indicators; inspect the referenced resources before changing code.`, plainLanguageExplanation: 'The browser downloaded or processed work that may not be needed so early.',
      recommendedFix: fix, implementationGuidance: `${implementationPrefix}${fix.charAt(0).toLowerCase()}${fix.slice(1)}`,
      expectedResult: 'Less transfer, blocking, or rendering work on the tested route.', verificationMethod: 'Inspect the Lighthouse detail rows, apply the change, then compare three-run medians using the same runtime and settings.',
      repositoryAccessRequired, effort: 'medium', changeType, measurementClass: audit.measurementClass, tags: [id, 'performance'],
    }));
  }
  return findings;
}
