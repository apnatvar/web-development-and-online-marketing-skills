import { inspectUntrustedContent, safeEvidence } from './security.mjs';

const ENTITY_MAP = new Map([
  ['amp', '&'], ['lt', '<'], ['gt', '>'], ['quot', '"'], ['apos', "'"], ['nbsp', ' '],
]);

export function decodeEntities(value) {
  return String(value ?? '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return ENTITY_MAP.get(entity.toLowerCase()) ?? match;
  });
}

export function stripTags(value) {
  return decodeEntities(String(value ?? '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function parseAttributes(fragment) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of fragment.matchAll(pattern)) {
    const name = match[1].toLowerCase();
    if (name === '<' || name.startsWith('!')) continue;
    attributes[name] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function lineAt(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function pairedElements(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}\\s*>`, 'gi');
  return [...html.matchAll(pattern)].map((match) => ({
    attributes: parseAttributes(match[1]),
    innerHtml: match[2],
    text: stripTags(match[2]),
    raw: match[0],
    line: lineAt(html, match.index),
  }));
}

function singleElements(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  return [...html.matchAll(pattern)].map((match) => ({
    attributes: parseAttributes(match[1]),
    raw: match[0],
    line: lineAt(html, match.index),
  }));
}

function removeUnseenContent(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]+(?:hidden|aria-hidden\s*=\s*["']?true|style\s*=\s*["'][^"']*(?:display\s*:\s*none|visibility\s*:\s*hidden))[^>]*>[\s\S]*?<\/[^>]+>/gi, ' ');
}

function resolveUrl(value, pageUrl) {
  if (!value) return null;
  try {
    return pageUrl ? new URL(value, pageUrl).href : value;
  } catch {
    return value;
  }
}

export function inspectHtml(html, context = {}) {
  const source = String(html ?? '');
  const titles = pairedElements(source, 'title');
  const metas = singleElements(source, 'meta');
  const links = pairedElements(source, 'a').map((item) => ({
    ...item,
    href: resolveUrl(item.attributes.href, context.url),
  }));
  const headings = [];
  for (let level = 1; level <= 6; level += 1) {
    headings.push(...pairedElements(source, `h${level}`).map((item) => ({ ...item, level })));
  }
  headings.sort((left, right) => left.line - right.line);
  const images = singleElements(source, 'img').map((item) => ({
    ...item,
    src: resolveUrl(item.attributes.src, context.url),
  }));
  const scripts = [...pairedElements(source, 'script'), ...singleElements(source, 'script')];
  const jsonLd = pairedElements(source, 'script')
    .filter((item) => item.attributes.type?.toLowerCase() === 'application/ld+json')
    .map((item) => {
      try {
        return { line: item.line, value: JSON.parse(item.innerHtml), error: null };
      } catch (error) {
        return { line: item.line, value: null, error: error.message };
      }
    });
  const linkElements = singleElements(source, 'link');
  const canonicalElements = linkElements.filter((item) => item.attributes.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const alternateLanguages = linkElements.filter((item) => item.attributes.rel?.toLowerCase().split(/\s+/).includes('alternate') && item.attributes.hreflang);
  const htmlElement = singleElements(source, 'html')[0] ?? { attributes: {} };
  const visibleText = stripTags(removeUnseenContent(source));
  const buttons = pairedElements(source, 'button');
  const inputButtons = singleElements(source, 'input').filter((item) => ['submit', 'button'].includes(item.attributes.type?.toLowerCase()));
  const ctaPattern = /\b(get started|buy|book|contact|request|schedule|sign up|subscribe|start|try|download|learn more|call|apply|join)\b/i;
  const ctas = [
    ...buttons.map((item) => ({ text: item.text, href: null, line: item.line, element: 'button' })),
    ...links.filter((item) => ctaPattern.test(`${item.text} ${item.attributes.class ?? ''}`)).map((item) => ({ text: item.text, href: item.href, line: item.line, element: 'a' })),
    ...inputButtons.map((item) => ({ text: item.attributes.value ?? '', href: null, line: item.line, element: 'input' })),
  ].filter((item) => item.text);
  const security = inspectUntrustedContent(source);
  const words = visibleText.match(/[\p{L}\p{N}'’-]+/gu) ?? [];

  return {
    url: context.url ?? null,
    sourcePath: context.sourcePath ?? null,
    title: titles[0]?.text ?? '',
    titleCount: titles.length,
    titleLine: titles[0]?.line ?? null,
    metaDescription: metas.find((item) => item.attributes.name?.toLowerCase() === 'description')?.attributes.content ?? '',
    metaRobots: metas.find((item) => item.attributes.name?.toLowerCase() === 'robots')?.attributes.content ?? '',
    viewport: metas.find((item) => item.attributes.name?.toLowerCase() === 'viewport')?.attributes.content ?? '',
    canonical: canonicalElements[0]?.attributes.href ? resolveUrl(canonicalElements[0].attributes.href, context.url) : '',
    canonicalCount: canonicalElements.length,
    alternateLanguages: alternateLanguages.map((item) => ({ language: item.attributes.hreflang, href: resolveUrl(item.attributes.href, context.url) })),
    language: htmlElement.attributes.lang ?? '',
    headings: headings.map(({ level, text, line }) => ({ level, text, line })),
    images: images.map(({ attributes, src, line }) => ({
      src,
      alt: attributes.alt,
      width: attributes.width,
      height: attributes.height,
      loading: attributes.loading,
      line,
    })),
    links: links.map(({ href, text, attributes, line }) => ({ href, text, rel: attributes.rel ?? '', line })),
    ctas,
    scripts: scripts.map(({ attributes, line }) => ({ src: resolveUrl(attributes.src, context.url), type: attributes.type ?? '', async: 'async' in attributes, defer: 'defer' in attributes, line })),
    stylesheets: linkElements.filter((item) => item.attributes.rel?.toLowerCase().split(/\s+/).includes('stylesheet')).map((item) => ({ href: resolveUrl(item.attributes.href, context.url), line: item.line })),
    jsonLd,
    landmarks: Object.fromEntries(['header', 'nav', 'main', 'aside', 'footer'].map((tag) => [tag, pairedElements(source, tag).length])),
    visibleText,
    wordCount: words.length,
    firstContent: safeEvidence(visibleText, 500),
    security,
  };
}

export function parseSitemap(xml) {
  return [...String(xml ?? '').matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeEntities(match[1].trim()))
    .filter(Boolean);
}

export function parseRobots(value) {
  const groups = [];
  let current = null;
  const sitemaps = [];
  for (const rawLine of String(value ?? '').split(/\r?\n/)) {
    const line = rawLine.replace(/\s*#.*$/, '').trim();
    if (!line || !line.includes(':')) continue;
    const [rawName, ...rest] = line.split(':');
    const name = rawName.trim().toLowerCase();
    const ruleValue = rest.join(':').trim();
    if (name === 'user-agent') {
      current = { userAgent: ruleValue, rules: [] };
      groups.push(current);
    } else if (name === 'sitemap') {
      sitemaps.push(ruleValue);
    } else if (current && ['allow', 'disallow'].includes(name)) {
      current.rules.push({ directive: name, path: ruleValue });
    }
  }
  return { groups, sitemaps };
}
