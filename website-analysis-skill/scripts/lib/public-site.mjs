import { inspectHtml, parseRobots, parseSitemap } from './html.mjs';

function requirePublicUrl(value) {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http:// and https:// public URLs are supported.');
  if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
    // Localhost is allowed for tests and local preview audits; it is not called a public source.
    return parsed;
  }
  return parsed;
}

export async function fetchText(url, options = {}) {
  const target = requirePublicUrl(url);
  const response = await fetch(target, {
    redirect: 'follow',
    signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
    headers: { 'user-agent': options.userAgent ?? 'WebsiteQualityAuditor/1.0 (+local audit tool)' },
  });
  const declaredLength = Number(response.headers.get('content-length') ?? 0);
  const maximumBytes = options.maximumResponseBytes ?? 5_242_880;
  if (declaredLength > maximumBytes) throw new Error(`Response exceeds ${maximumBytes} bytes: ${url}`);
  const text = await response.text();
  if (Buffer.byteLength(text) > maximumBytes) throw new Error(`Response exceeds ${maximumBytes} bytes: ${url}`);
  return {
    requestedUrl: target.href,
    finalUrl: response.url,
    status: response.status,
    ok: response.ok,
    redirected: response.redirected,
    headers: Object.fromEntries(response.headers.entries()),
    text,
  };
}

export async function discoverPublicPages(startUrl, options = {}) {
  const root = requirePublicUrl(startUrl);
  const origin = root.origin;
  const robotsUrl = new URL('/robots.txt', origin).href;
  let robots = null;
  let sitemap = null;
  const errors = [];
  try {
    const response = await fetchText(robotsUrl, options);
    robots = { url: robotsUrl, ...response, parsed: parseRobots(response.text) };
  } catch (error) {
    errors.push(`robots.txt: ${error.message}`);
  }

  const sitemapCandidates = robots?.parsed.sitemaps?.length
    ? robots.parsed.sitemaps
    : [new URL('/sitemap.xml', origin).href];
  for (const candidate of sitemapCandidates.slice(0, 3)) {
    try {
      const response = await fetchText(candidate, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      sitemap = { url: candidate, ...response, urls: parseSitemap(response.text) };
      break;
    } catch (error) {
      errors.push(`sitemap ${candidate}: ${error.message}`);
    }
  }

  let homepage = null;
  try {
    const response = await fetchText(root.href, options);
    homepage = { ...response, inspection: inspectHtml(response.text, { url: response.finalUrl }) };
  } catch (error) {
    errors.push(`homepage: ${error.message}`);
  }

  const candidates = new Set([root.href]);
  for (const url of sitemap?.urls ?? []) {
    try {
      const parsed = new URL(url);
      if (parsed.origin === origin) candidates.add(parsed.href);
    } catch {}
  }
  for (const link of homepage?.inspection.links ?? []) {
    try {
      const parsed = new URL(link.href);
      if (parsed.origin === origin && !parsed.hash) candidates.add(parsed.href);
    } catch {}
  }
  return { startUrl: root.href, robots, sitemap, homepage, candidates: [...candidates], errors };
}

function publicPagePriority(url, homepage) {
  const parsed = new URL(url);
  if (parsed.href === homepage || parsed.pathname === '/') return 100;
  if (/product|service|solution|pricing/i.test(parsed.pathname)) return 80;
  if (/contact|book|demo|quote|checkout|signup/i.test(parsed.pathname)) return 70;
  if (/blog|article|guide|resource|news/i.test(parsed.pathname)) return 60;
  if (/about/i.test(parsed.pathname)) return 50;
  return 10;
}

export function proposePublicPages(discovery, maximum = 5) {
  return discovery.candidates
    .sort((left, right) => publicPagePriority(right, discovery.startUrl) - publicPagePriority(left, discovery.startUrl) || left.localeCompare(right))
    .slice(0, maximum)
    .map((url) => ({ url, rationale: url === discovery.startUrl ? 'homepage' : 'representative sitemap or internal-link page' }));
}

export async function inspectPublicPages(startUrl, selectedUrls = [], options = {}) {
  const discovery = await discoverPublicPages(startUrl, options);
  const urls = selectedUrls.length > 0 ? selectedUrls : proposePublicPages(discovery).map((item) => item.url);
  const pages = [];
  for (const url of urls) {
    try {
      const response = url === discovery.startUrl && discovery.homepage
        ? discovery.homepage
        : await fetchText(url, options);
      pages.push({
        url,
        finalUrl: response.finalUrl,
        sourceType: 'public URL',
        status: response.status,
        headers: response.headers,
        redirected: response.redirected,
        inspection: response.inspection ?? inspectHtml(response.text, { url: response.finalUrl }),
      });
    } catch (error) {
      pages.push({ url, sourceType: 'public URL', status: null, headers: {}, error: error.message, inspection: null });
    }
  }
  return { discovery, pages };
}
