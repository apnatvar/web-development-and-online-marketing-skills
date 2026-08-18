import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { exists, relativeDisplay, toPosix, walkFiles } from './fs-utils.mjs';
import { inspectHtml } from './html.mjs';
import { inspectUntrustedContent } from './security.mjs';

const PAGE_EXTENSIONS = new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro']);

function cleanSegment(segment) {
  if (/^\(.+\)$/.test(segment) || segment.startsWith('@')) return '';
  if (/^\[\.\.\.(.+)\]$/.test(segment)) return `:${segment.slice(4, -1)}*`;
  if (/^\[(.+)\]$/.test(segment)) return `:${segment.slice(1, -1)}`;
  return segment;
}

function normalizeRoute(segments) {
  const cleaned = segments.map(cleanSegment).filter(Boolean);
  const route = `/${cleaned.join('/')}`.replace(/\/index$/i, '/').replace(/\/$/, '');
  return route || '/';
}

function routeForFile(relativeFile) {
  const normalized = toPosix(relativeFile);
  const extension = path.extname(normalized);
  const withoutExtension = normalized.slice(0, -extension.length);
  let match = withoutExtension.match(/^(?:src\/)?app\/(.*)\/page$/);
  if (match) return normalizeRoute(match[1].split('/'));
  if (/^(?:src\/)?app\/page$/.test(withoutExtension)) return '/';
  match = withoutExtension.match(/^(?:src\/)?pages\/(.+)$/);
  if (match && !/^_/.test(match[1]) && !/^api\//.test(match[1])) return normalizeRoute(match[1].split('/'));
  if (/^(?:src\/)?pages\/index$/.test(withoutExtension)) return '/';
  if (/^(?:public|dist|build)\//.test(withoutExtension) && /\.html?$/i.test(normalized)) {
    return normalizeRoute(withoutExtension.replace(/^(?:public|dist|build)\//, '').split('/'));
  }
  if (/\.html?$/i.test(normalized)) return normalizeRoute(withoutExtension.split('/'));
  return null;
}

function explicitRoutes(source) {
  const routes = [];
  const patterns = [
    /<Route\b[^>]*\bpath\s*=\s*["']([^"']+)["']/g,
    /\bpath\s*:\s*["'](\/[^"]*?)["']/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) routes.push(match[1]);
  }
  return routes;
}

export async function discoverRoutes(repositoryRoot) {
  const root = path.resolve(repositoryRoot);
  if (!(await exists(root))) throw new Error(`Local repository does not exist: ${root}`);
  const files = await walkFiles(root);
  const routeMap = new Map();
  const inspectedFiles = [];
  const skippedSensitiveFiles = [];

  for (const absolute of files) {
    const extension = path.extname(absolute).toLowerCase();
    if (!PAGE_EXTENSIONS.has(extension)) continue;
    const relative = relativeDisplay(root, absolute);
    inspectedFiles.push(relative);
    const route = routeForFile(relative);
    if (route && !routeMap.has(route)) routeMap.set(route, { route, file: relative, source: 'filesystem convention' });
    if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
      const source = await readFile(absolute, 'utf8');
      for (const explicit of explicitRoutes(source)) {
        if (!routeMap.has(explicit)) routeMap.set(explicit, { route: explicit, file: relative, source: 'route declaration' });
      }
    }
  }

  return {
    repositoryRoot: root,
    routes: [...routeMap.values()].sort((left, right) => left.route.localeCompare(right.route)),
    inspectedFiles,
    skippedSensitiveFiles,
  };
}

function pagePriority(route) {
  if (route === '/') return 100;
  if (/product|service|solution|pricing/i.test(route)) return 80;
  if (/contact|book|demo|quote|checkout|signup/i.test(route)) return 70;
  if (/blog|article|guide|resource/i.test(route)) return 60;
  if (/about/i.test(route)) return 50;
  return 10;
}

export function proposeRoutes(routes, maximum = 5) {
  return [...routes]
    .sort((left, right) => pagePriority(right.route) - pagePriority(left.route) || left.route.localeCompare(right.route))
    .slice(0, maximum)
    .map((item) => ({ ...item, rationale: item.route === '/' ? 'homepage' : 'representative high-value route' }));
}

export async function inspectRepositoryPages(repositoryRoot, selectedRoutes = []) {
  const discovery = await discoverRoutes(repositoryRoot);
  const routes = selectedRoutes.length > 0
    ? discovery.routes.filter((item) => selectedRoutes.includes(item.route) || selectedRoutes.includes(item.file))
    : proposeRoutes(discovery.routes);
  const pages = [];
  const repositorySecurity = { promptInjectionFiles: [], sensitiveFiles: [] };
  for (const route of routes) {
    const absolute = path.join(discovery.repositoryRoot, route.file);
    const source = await readFile(absolute, 'utf8');
    const security = inspectUntrustedContent(source);
    if (security.promptInjectionDetected) repositorySecurity.promptInjectionFiles.push(route.file);
    if (security.sensitiveTypes.length > 0) repositorySecurity.sensitiveFiles.push({ file: route.file, types: security.sensitiveTypes });
    pages.push({
      route: route.route,
      file: route.file,
      sourceType: 'local repository',
      status: null,
      headers: {},
      inspection: inspectHtml(source, { sourcePath: route.file }),
    });
  }
  return { discovery, pages, repositorySecurity };
}
